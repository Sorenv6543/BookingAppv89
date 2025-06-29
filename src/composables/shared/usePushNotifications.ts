import { ref, computed } from 'vue'
import { useAuth } from './useAuth'

// Notification Types for Property Cleaning Business
export type NotificationType = 
  | 'booking_confirmation'
  | 'booking_reminder' 
  | 'turn_alert'
  | 'cleaner_assigned'
  | 'cleaning_completed'
  | 'system_alert'

export interface PushNotificationPayload {
  type: NotificationType
  title: string
  body: string
  data?: Record<string, unknown>
  tag?: string
  requireInteraction?: boolean
  actions?: NotificationAction[]
}

export interface NotificationAction {
  action: string
  title: string
  icon?: string
}

export interface NotificationData extends Record<string, unknown> {
  propertyName?: string
  bookingId?: string
  date?: string
  time?: string
  count?: number
  message?: string
}

export const usePushNotifications = () => {
  // State
  const isSupported = ref('Notification' in window && 'serviceWorker' in navigator)
  const permission = ref<'default' | 'granted' | 'denied'>('default')
  const subscriptionActive = ref(false)
  const vapidPublicKey = ref<string>('') // Will be set from env or server

  // Auth composable for role-based notifications
  const { user } = useAuth()
  const currentUser = computed(() => user.value)
  const userRole = computed(() => user.value?.role)

  // Check initial permission status
  if (isSupported.value) {
    permission.value = Notification.permission
  }

  // Computed properties
  const canRequestPermission = computed(() => 
    isSupported.value && permission.value === 'default'
  )

  const hasPermission = computed(() => 
    isSupported.value && permission.value === 'granted'
  )

  const needsPermission = computed(() => 
    isSupported.value && permission.value === 'denied'
  )

  // Request notification permission
  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported.value) {
      console.warn('Push notifications not supported')
      return false
    }

    try {
      const result = await Notification.requestPermission()
      permission.value = result
      
      if (result === 'granted') {
        console.log('Push notification permission granted')
        await subscribeToPush()
        return true
      } else {
        console.log('Push notification permission denied')
        return false
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  // Subscribe to push notifications
  const subscribeToPush = async (): Promise<PushSubscription | null> => {
    if (!hasPermission.value) {
      console.warn('No notification permission')
      return null
    }

    try {
      const registration = await navigator.serviceWorker.ready
      
      // Check for existing subscription
      let subscription = await registration.pushManager.getSubscription()
      
      if (!subscription) {
        // Create new subscription
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          // @ts-expect-error - Browser API accepts Uint8Array despite strict TypeScript definitions
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey.value)
        })
      }

      subscriptionActive.value = true
      
      // Send subscription to server for role-based targeting
      await sendSubscriptionToServer(subscription)
      
      console.log('Push subscription created:', subscription)
      return subscription
    } catch (error) {
      console.error('Error subscribing to push notifications:', error)
      subscriptionActive.value = false
      return null
    }
  }

  // Unsubscribe from push notifications
  const unsubscribeFromPush = async (): Promise<boolean> => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      
      if (subscription) {
        await subscription.unsubscribe()
        subscriptionActive.value = false
        
        // Notify server to remove subscription
        await removeSubscriptionFromServer(subscription)
        
        console.log('Unsubscribed from push notifications')
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error)
      return false
    }
  }

  // Send local notification (for testing)
  const sendLocalNotification = (payload: PushNotificationPayload) => {
    if (!hasPermission.value) {
      console.warn('No notification permission for local notification')
      return
    }

    const options = {
      body: payload.body,
      data: payload.data,
      tag: payload.tag,
      requireInteraction: payload.requireInteraction || false,
      actions: payload.actions,
      icon: '/pwa-icon.svg',
      badge: '/pwa-icon.svg'
    }

    new Notification(payload.title, options)
  }

  // Role-specific notification helpers
  const sendOwnerNotification = (type: NotificationType, data: NotificationData) => {
    if (userRole.value !== 'owner') return

    const notifications = {
      booking_confirmation: {
        title: 'Booking Confirmed',
        body: `Your cleaning for ${data.propertyName} on ${data.date} is confirmed.`,
        tag: `booking-${data.bookingId}`,
        actions: [
          { action: 'view', title: 'View Details' },
          { action: 'modify', title: 'Modify' }
        ]
      },
      turn_alert: {
        title: 'Urgent Turn Alert',
        body: `Turn cleaning needed today for ${data.propertyName} by ${data.time}.`,
        tag: `turn-${data.bookingId}`,
        requireInteraction: true,
        actions: [
          { action: 'confirm', title: 'Confirm Ready' },
          { action: 'delay', title: 'Request Delay' }
        ]
      },
      cleaning_completed: {
        title: 'Cleaning Completed',
        body: `${data.propertyName} cleaning finished. Ready for guests!`,
        tag: `completed-${data.bookingId}`,
        actions: [
          { action: 'view', title: 'View Report' }
        ]
      }
    }

    const notificationConfig = notifications[type as keyof typeof notifications]
    if (notificationConfig) {
      sendLocalNotification({
        type,
        ...notificationConfig,
        data
      })
    }
  }

  const sendAdminNotification = (type: NotificationType, data: NotificationData) => {
    if (userRole.value !== 'admin') return

    const notifications = {
      turn_alert: {
        title: 'System Turn Alert',
        body: `${data.count} urgent turns require attention across all properties.`,
        tag: 'system-turns',
        requireInteraction: true,
        actions: [
          { action: 'view-all', title: 'View All Turns' },
          { action: 'assign', title: 'Assign Cleaners' }
        ]
      },
      system_alert: {
        title: 'System Alert',
        body: data.message || 'Admin attention required for system operations.',
        tag: 'system-alert',
        requireInteraction: true,
        actions: [
          { action: 'acknowledge', title: 'Acknowledge' }
        ]
      }
    }

    const notificationConfig = notifications[type as keyof typeof notifications]
    if (notificationConfig) {
      sendLocalNotification({
        type,
        ...notificationConfig,
        data
      })
    }
  }

  // Helper functions
  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  const sendSubscriptionToServer = async (subscription: PushSubscription) => {
    // TODO: Implement server endpoint for subscription storage
    // Include user role for targeted notifications
    const subscriptionData = {
      subscription: subscription.toJSON(),
      userId: currentUser.value?.id,
      userRole: userRole.value,
      timestamp: new Date().toISOString()
    }
    
    console.log('Would send subscription to server:', subscriptionData)
    // await fetch('/api/push/subscribe', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(subscriptionData)
    // })
  }

  const removeSubscriptionFromServer = async (subscription: PushSubscription) => {
    // TODO: Implement server endpoint for subscription removal
    console.log('Would remove subscription from server:', subscription.endpoint)
    // await fetch('/api/push/unsubscribe', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ endpoint: subscription.endpoint })
    // })
  }

  // Set VAPID public key (call this during app initialization)
  const setVapidKey = (key: string) => {
    vapidPublicKey.value = key
  }

  return {
    // State
    isSupported,
    permission,
    subscriptionActive,
    
    // Computed
    canRequestPermission,
    hasPermission,
    needsPermission,
    
    // Methods
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
    sendLocalNotification,
    sendOwnerNotification,
    sendAdminNotification,
    setVapidKey
  }
} 