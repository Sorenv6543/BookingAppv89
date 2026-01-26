// Type declarations for virtual PWA modules - Only available in production
// In development, these modules are not available to prevent build errors
declare module 'virtual:pwa-register/vue' {
  import type { Ref } from 'vue'
  
  export interface RegisterSWOptions {
    immediate?: boolean
    onNeedRefresh?: () => void
    onOfflineReady?: () => void
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
    onRegisterError?: (error: unknown) => void
  }
  
  export interface PWARegisterReturn {
    needRefresh: Ref<boolean>
    offlineReady: Ref<boolean>
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
  
  export function useRegisterSW(options?: RegisterSWOptions): PWARegisterReturn
}

// Development fallback - this module will not exist in development
declare module 'virtual:pwa-register/vue' {
  // This is intentionally empty to prevent TypeScript errors
  // The actual implementation will be mocked in usePWA.ts
} 