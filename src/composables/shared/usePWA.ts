import { ref, computed, onMounted } from 'vue'
import { usePushNotifications } from './usePushNotifications'
import { useBackgroundSync } from './useBackgroundSync'

// // PWA Install Event Interface
// interface BeforeInstallPromptEvent extends Event {
//   readonly platforms: string[]
//   readonly userChoice: Promise<{
//     outcome: 'accepted' | 'dismissed'
//     platform: string
//   }>
//   prompt(): Promise<void>
// }

export const usePWA = () => {
  // PWA Installation
  // const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
  const isPWAInstallable = ref(false)
  const isPWAInstalled = ref(false)
  
  // Network Status
  const isOnline = ref(navigator.onLine)
  
  // Service Worker - Mock in development
  const needRefresh = ref(false)
  const offlineReady = ref(false)
  // const updateServiceWorker = async () => Promise.resolve()

  // Check if running as PWA
  const isPWA = computed(() => {
    // Always false in development to prevent PWA-related issues
    return false
  })

  // Install PWA
  const installPWA = async () => {
    console.log('PWA installation disabled in development mode')
    return false
  }

  // Update PWA
  const updatePWA = async () => {
    console.log('PWA update disabled in development mode')
  }

  // Setup event listeners
  onMounted(() => {
    console.log('PWA event listeners disabled in development mode')
    
    // Only set up network status listeners
    const updateOnlineStatus = () => {
      isOnline.value = navigator.onLine
    }
    
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
  })

  // Initialize push notifications and background sync
  const pushNotifications = usePushNotifications()
  const backgroundSync = useBackgroundSync()

  // Don't start background sync in development
  console.log('PWA background sync disabled in development mode')

  return {
    // Installation
    isPWAInstallable,
    isPWAInstalled,
    isPWA,
    installPWA,
    
    // Network
    isOnline,
    
    // Service Worker
    needRefresh,
    offlineReady,
    updatePWA,
    
    // Push Notifications
    pushNotifications,
    
    // Background Sync
    backgroundSync,
    
    // Computed states
    canInstall: computed(() => false), // Always false in development
    showUpdatePrompt: computed(() => false), // Always false in development
    showOfflineReady: computed(() => false), // Always false in development
    
    // Combined PWA status
    isFullyFunctional: computed(() => false) // Always false in development
  }
} 