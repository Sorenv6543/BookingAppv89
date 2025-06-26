import { ref, computed, onMounted } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { usePushNotifications } from './usePushNotifications'
import { useBackgroundSync } from './useBackgroundSync'

// PWA Install Event Interface
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export const usePWA = (): any => {
  // PWA Installation
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
  const isPWAInstallable = ref(false)
  const isPWAInstalled = ref(false)
  
  // Network Status
  const isOnline = ref(navigator.onLine)
  
  // Service Worker
  const {
    needRefresh,
    offlineReady,
    updateServiceWorker
  } = useRegisterSW({
    onRegistered(r: any) {
      console.log('Service Worker registered:', r)
    },
    onRegisterError(error: any) {
      console.error('Service Worker registration error:', error)
    }
  })

  // Check if running as PWA
  const isPWA = computed(() => {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone ||
           document.referrer.includes('android-app://')
  })

  // Install PWA
  const installPWA = async () => {
    if (!deferredPrompt.value) return false
    
    try {
      deferredPrompt.value.prompt()
      const { outcome } = await deferredPrompt.value.userChoice
      
      if (outcome === 'accepted') {
        isPWAInstalled.value = true
        console.log('PWA installed successfully')
      }
      
      deferredPrompt.value = null
      isPWAInstallable.value = false
      
      return outcome === 'accepted'
    } catch (error) {
      console.error('PWA installation error:', error)
      return false
    }
  }

  // Update PWA
  const updatePWA = async () => {
    try {
      await updateServiceWorker(true)
    } catch (error) {
      console.error('PWA update error:', error)
    }
  }

  // Setup event listeners
  onMounted(() => {
    // PWA Install Prompt
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault()
      deferredPrompt.value = e as BeforeInstallPromptEvent
      isPWAInstallable.value = true
      console.log('PWA install prompt ready')
    })

    // PWA Installed
    window.addEventListener('appinstalled', () => {
      isPWAInstalled.value = true
      isPWAInstallable.value = false
      deferredPrompt.value = null
      console.log('PWA installed via browser prompt')
    })

    // Network Status
    const updateOnlineStatus = () => {
      isOnline.value = navigator.onLine
    }
    
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
  })

  // Initialize push notifications and background sync
  const pushNotifications = usePushNotifications()
  const backgroundSync = useBackgroundSync()

  // Start background sync auto-processing
  backgroundSync.startAutoSync()

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
    canInstall: computed(() => isPWAInstallable.value && !isPWA.value),
    showUpdatePrompt: computed(() => needRefresh.value),
    showOfflineReady: computed(() => offlineReady.value),
    
    // Combined PWA status
    isFullyFunctional: computed(() => 
      isPWA.value && 
      pushNotifications.hasPermission.value && 
      backgroundSync.canProcess.value
    )
  }
} 