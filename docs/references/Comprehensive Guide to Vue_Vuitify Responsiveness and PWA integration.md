
# Comprehensive Guide to Vue, Vuetify Responsiveness and PWA Integration

## 1. Vuetify's Responsive System

### The useDisplay Composable

Vuetify provides a powerful responsive system through the `useDisplay` composable. This composable offers real-time information about the device's viewport, allowing you to create truly responsive applications:

```javascript
import { useDisplay } from 'vuetify'

// In a setup function
const { 
  xs,                // Boolean - Is extra small viewport
  sm, md, lg, xl,    // Boolean - Is current viewport
  mobile,            // Boolean - Is mobile breakpoint (configurable)
  name,              // String - Current breakpoint name
  height, width,     // Number - Viewport dimensions
  smAndDown,         // Boolean - Is sm or smaller
  smAndUp,           // Boolean - Is sm or larger 
  mdAndDown,         // Boolean - Is md or smaller
  mdAndUp,           // Boolean - Is md or larger
  lgAndDown,         // Boolean - Is lg or smaller
  lgAndUp,           // Boolean - Is lg or larger
  xlAndDown,         // Boolean - Is xl or smaller
  xlAndUp            // Boolean - Is xl or larger
} = useDisplay()
```

### Vuetify Breakpoints

The breakpoints system in Vuetify follows the Material Design specifications:

| Breakpoint | Device Type | Width Range |
|------------|-------------|------------|
| xs | Extra small devices | < 600px |
| sm | Small devices | 600px - 959px |
| md | Medium devices | 960px - 1279px |
| lg | Large devices | 1280px - 1919px |
| xl | Extra large devices | ≥ 1920px |

These breakpoints are configurable in the Vuetify plugin initialization:

```javascript
// src/plugins/vuetify.ts
export default createVuetify({
  display: {
    mobileBreakpoint: 'sm', // This determines what's considered "mobile"
    thresholds: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  }
})
```

### Best Practices for Responsive Design in Vuetify

1. **Grid System**:
   Vuetify's grid system is based on a 12-column layout that's highly responsive:

   ```html
   <v-row>
     <v-col cols="12" sm="6" md="4" lg="3">
       <!-- Full width on xs, half on sm, 1/3 on md, 1/4 on lg and up -->
     </v-col>
   </v-row>
   ```

2. **Responsive Text Classes**:
   ```html
   <h1 class="
     text-h4
     text-md-h2
     text-lg-h1
   ">
     This text changes size based on viewport
   </h1>
   ```

3. **Display Helper Classes**:
   ```html
   <!-- Hidden on all screens -->
   <div class="d-none">...</div>
   
   <!-- Visible only on small screens -->
   <div class="d-none d-sm-flex d-md-none">...</div>
   ```

4. **Dynamic Props with useDisplay**:
   ```html
   <script setup>
   import { computed } from 'vue'
   import { useDisplay } from 'vuetify'

   const { mobile } = useDisplay()
   
   const cardHeight = computed(() => mobile.value ? 200 : 400)
   </script>

   <template>
     <v-card :height="cardHeight">...</v-card>
   </template>
   ```

5. **Conditional Rendering**:
   ```html
   <template>
     <div v-if="!$vuetify.display.mdAndDown">Desktop view</div>
     <div v-else>Mobile view</div>
   </template>
   ```

## 2. Building a PWA with Vue 3 and Vite

### Setting Up PWA Support in Vite

The `vite-plugin-pwa` provides robust PWA capabilities for Vue applications:

```bash
npm install -D vite-plugin-pwa @vite-pwa/assets-generator
```

### Configure the PWA Plugin

Update your `vite.config.ts` with the following configuration:

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    VitePWA({
      registerType: 'autoUpdate', // Automatically updates the service worker
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'maskable-icon-512x512.png'],
      manifest: {
        name: 'My Vue 3 PWA',
        short_name: 'VuePWA',
        description: 'A Vue 3 PWA with Vuetify',
        theme_color: '#1976d2',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        // Cache strategies for different resources
        runtimeCaching: [
          {
            // Cache for CSS, JS, and worker files
            urlPattern: ({ request }) => 
              request.destination === 'style' || 
              request.destination === 'script' || 
              request.destination === 'worker',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            // Cache for images
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
              },
            },
          },
          {
            // Cache for API calls
            urlPattern: ({ url }) => url.pathname.startsWith('/api'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
              }
            }
          }
        ],
      },
      devOptions: {
        enabled: true, // Enable during development
        type: 'module'
      }
    })
  ]
})
```

### Creating a PWA Composable

Create a reusable composable for managing PWA functionality:

```typescript
// src/composables/usePWA.ts
import { ref, computed, onMounted } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'

// Interface for install prompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export const usePWA = () => {
  // PWA Installation
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
  const isPWAInstallable = ref(false)
  const isPWAInstalled = ref(false)
  
  // Network Status
  const isOnline = ref(navigator.onLine)
  
  // Service Worker states from the plugin
  const {
    needRefresh, // True if new content is available
    offlineReady, // True if the app is ready for offline use
    updateServiceWorker // Function to update the service worker
  } = useRegisterSW({
    onRegistered(r) {
      console.log('Service Worker registered:', r)
    },
    onRegisterError(error) {
      console.error('Service Worker registration error:', error)
    }
  })

  // Check if running as PWA
  const isPWA = computed(() => {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true ||
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
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault()
      deferredPrompt.value = e as BeforeInstallPromptEvent
      isPWAInstallable.value = true
      console.log('PWA install prompt ready')
    })

    // Listen for install event
    window.addEventListener('appinstalled', () => {
      isPWAInstalled.value = true
      isPWAInstallable.value = false
      deferredPrompt.value = null
      console.log('PWA installed via browser prompt')
    })

    // Network status
    const updateOnlineStatus = () => {
      isOnline.value = navigator.onLine
    }
    
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
  })

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
    
    // Computed states
    canInstall: computed(() => isPWAInstallable.value && !isPWA.value),
    showUpdatePrompt: computed(() => needRefresh.value),
    showOfflineReady: computed(() => offlineReady.value)
  }
}
```

### Creating a PWA-Ready UI Component

Create a component to handle PWA installation and updates:

```vue
<!-- src/components/PWAHandler.vue -->
<template>
  <div>
    <!-- Install Prompt -->
    <v-snackbar
      v-model="showInstallPrompt"
      timeout="-1"
      color="primary"
      location="bottom"
    >
      Install this app for offline use
      <template v-slot:actions>
        <v-btn variant="text" @click="showInstallPrompt = false">
          Later
        </v-btn>
        <v-btn
          color="white"
          variant="elevated"
          :loading="installing"
          @click="handleInstall"
        >
          Install
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Update Notification -->
    <v-snackbar
      v-model="showUpdateSnackbar"
      timeout="-1"
      color="info"
      location="bottom"
    >
      New version available
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="elevated"
          :loading="updating"
          @click="handleUpdate"
        >
          Update
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Offline Indicator -->
    <v-snackbar
      v-model="showOfflineIndicator"
      timeout="5000"
      color="warning"
      location="top"
    >
      You're currently offline. Some features may be limited.
    </v-snackbar>

    <!-- Offline Ready Notification -->
    <v-snackbar
      v-model="showOfflineReadyNotice"
      color="success"
      timeout="3000"
      location="bottom"
    >
      App is ready for offline use!
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { usePWA } from '@/composables/usePWA'

// PWA state
const {
  canInstall,
  isOnline,
  showUpdatePrompt,
  showOfflineReady,
  installPWA,
  updatePWA
} = usePWA()

// Local state
const showInstallPrompt = ref(false)
const showUpdateSnackbar = ref(false)
const showOfflineIndicator = ref(false)
const showOfflineReadyNotice = ref(false)
const installing = ref(false)
const updating = ref(false)

// Methods
const handleInstall = async () => {
  installing.value = true
  try {
    await installPWA()
  } catch (error) {
    console.error('Installation failed:', error)
  } finally {
    installing.value = false
    showInstallPrompt.value = false
  }
}

const handleUpdate = async () => {
  updating.value = true
  try {
    await updatePWA()
  } catch (error) {
    console.error('Update failed:', error)
  } finally {
    updating.value = false
    showUpdateSnackbar.value = false
  }
}

// Watch for changes to show appropriate UI
watch(canInstall, (value) => {
  if (value) {
    // Show install prompt after a delay
    setTimeout(() => {
      showInstallPrompt.value = true
    }, 3000)
  }
})

watch(showUpdatePrompt, (value) => {
  showUpdateSnackbar.value = value
})

watch(showOfflineReady, (value) => {
  showOfflineReadyNotice.value = value
})

watch(isOnline, (newValue, oldValue) => {
  // Show offline indicator when going offline
  if (oldValue === true && newValue === false) {
    showOfflineIndicator.value = true
  }
})
</script>
```

## 3. Combining Responsive Design and PWA Best Practices

### Optimizing PWA for Different Screen Sizes

When building a PWA with Vuetify, you need to ensure that your app works well across all viewport sizes. Here are some best practices:

#### 1. Use Media Queries for Critical CSS

To avoid layout shifts when loading on mobile devices:

```css
/* Essential styles for first render */
@media (max-width: 600px) {
  .app-header {
    height: 56px;
  }
  
  .app-content {
    padding: 16px;
  }
}

@media (min-width: 600px) {
  .app-header {
    height: 64px;
  }
  
  .app-content {
    padding: 24px;
  }
}
```

#### 2. Use Vuetify's Built-in Responsive Classes

```html
<!-- Hidden on mobile, visible on tablet and up -->
<v-btn class="d-none d-sm-flex">Desktop Action</v-btn>

<!-- Visible on mobile, hidden on tablet and up -->
<v-btn class="d-flex d-sm-none">Mobile Action</v-btn>
```

#### 3. Adaptive Layout for Offline Mode

```vue
<template>
  <div>
    <v-app-bar>
      <v-app-bar-title>My PWA App</v-app-bar-title>
      <v-spacer></v-spacer>
      <!-- Show offline indicator when offline -->
      <v-chip v-if="!isOnline" color="warning" size="small">
        Offline
      </v-chip>
    </v-app-bar>
    
    <v-main>
      <!-- Adapt content based on online status -->
      <v-container v-if="isOnline">
        <online-content />
      </v-container>
      <v-container v-else>
        <offline-content />
      </v-container>
    </v-main>
  </div>
</template>

<script setup>
import { usePWA } from '@/composables/usePWA'
import { useDisplay } from 'vuetify'

const { isOnline } = usePWA()
const { mobile } = useDisplay()
</script>
```

### 4. Use Dynamic Imports for a Faster Initial Load

You can use Vue's dynamic imports to reduce the bundle size for mobile devices:

```javascript
// Instead of importing everything upfront
const DesktopView = defineAsyncComponent(() => 
  import('./DesktopView.vue')
)

const MobileView = defineAsyncComponent(() => 
  import('./MobileView.vue')
)
```

### 5. PWA Splash Screen for Different Device Sizes

Create a splash screen that works well across different device sizes:

```html
<template>
  <div 
    v-if="loading"
    class="splash-screen"
    :class="{ 'mobile-splash': mobile }"
  >
    <img 
      :src="mobile ? '/logo-small.png' : '/logo-large.png'"
      alt="App Logo"
    />
    <v-progress-circular indeterminate></v-progress-circular>
  </div>
</template>

<style scoped>
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  z-index: 9999;
}

.mobile-splash img {
  width: 120px;
  height: 120px;
}

.splash-screen:not(.mobile-splash) img {
  width: 200px;
  height: 200px;
}
</style>
```

## 4. Advanced PWA Techniques for Vue and Vuetify Apps

### 1. Offline Data Management

Use IndexedDB for offline data storage:

```javascript
import { openDB } from 'idb'

// Create and connect to the database
const db = await openDB('my-pwa-db', 1, {
  upgrade(db) {
    // Create stores
    db.createObjectStore('todos', { keyPath: 'id' })
    db.createObjectStore('settings')
  }
})

// Store data
await db.put('todos', { id: 1, text: 'Learn PWA', completed: false })

// Get data
const todo = await db.get('todos', 1)
```

### 2. Periodic Background Sync

For advanced PWA features, you can implement periodic background sync:

```javascript
// Request permission for background sync
if ('permissions' in navigator) {
  const status = await navigator.permissions.query({
    name: 'periodic-background-sync',
  })
  
  if (status.state === 'granted') {
    // Register for background sync
    const registration = await navigator.serviceWorker.ready
    try {
      await registration.periodicSync.register('content-sync', {
        minInterval: 24 * 60 * 60 * 1000, // 1 day
      })
    } catch (error) {
      console.error('Periodic sync registration failed:', error)
    }
  }
}
```

### 3. Push Notifications with Vuetify

Implement push notifications with a Vuetify UI:

```vue
<template>
  <div>
    <v-btn
      v-if="!pushEnabled && pushSupported"
      color="primary"
      prepend-icon="mdi-bell"
      @click="requestPushPermission"
    >
      Enable Notifications
    </v-btn>
    
    <!-- Push notification settings -->
    <v-list v-if="pushEnabled">
      <v-list-subheader>Notification Settings</v-list-subheader>
      <v-list-item v-for="(setting, i) in notificationSettings" :key="i">
        <v-list-item-title>{{ setting.title }}</v-list-item-title>
        <template v-slot:append>
          <v-switch v-model="setting.enabled"></v-switch>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const pushSupported = ref(false)
const pushEnabled = ref(false)
const notificationSettings = ref([
  { title: 'New messages', enabled: true },
  { title: 'Updates', enabled: true }
])

onMounted(() => {
  pushSupported.value = 'PushManager' in window
  
  if (pushSupported.value) {
    pushEnabled.value = 
      Notification.permission === 'granted'
  }
})

async function requestPushPermission() {
  try {
    const permission = await Notification.requestPermission()
    pushEnabled.value = permission === 'granted'
    
    if (pushEnabled.value) {
      // Subscribe to push service
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY'
      })
      
      // Send subscription to server
      await sendSubscriptionToServer(subscription)
    }
  } catch (error) {
    console.error('Error requesting notifications permission:', error)
  }
}

async function sendSubscriptionToServer(subscription) {
  // Your implementation to send the subscription to your server
}
</script>
```

## 5. Testing and Debugging Your PWA

### 1. PWA Testing Tools

Use the following tools to test your PWA:

- Chrome DevTools Application tab
- Lighthouse (built into Chrome DevTools)
- [PWA Builder](https://www.pwabuilder.com/) - For analyzing and improving PWAs
- [Workbox CLI](https://developers.google.com/web/tools/workbox/modules/workbox-cli) - For testing service workers

### 2. PWA Debugging Component

Create a debugging component for your development environment:

```vue
<!-- src/components/PWADebugger.vue -->
<template>
  <v-card v-if="isDev" class="my-4">
    <v-card-title>
      PWA Debug Info
      <v-spacer></v-spacer>
      <v-btn icon @click="expanded = !expanded">
        <v-icon>{{ expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-title>
    
    <v-expand-transition>
      <div v-if="expanded">
        <v-divider></v-divider>
        <v-card-text>
          <v-simple-table>
            <tbody>
              <tr>
                <td>PWA Mode:</td>
                <td>{{ isPWA ? 'Yes' : 'No' }}</td>
              </tr>
              <tr>
                <td>Display Mode:</td>
                <td>{{ displayMode }}</td>
              </tr>
              <tr>
                <td>Online:</td>
                <td>
                  <v-chip :color="isOnline ? 'success' : 'error'">
                    {{ isOnline ? 'Yes' : 'No' }}
                  </v-chip>
                </td>
              </tr>
              <tr>
                <td>Service Worker:</td>
                <td>
                  <v-chip :color="serviceWorkerActive ? 'success' : 'warning'">
                    {{ serviceWorkerActive ? 'Active' : 'Inactive' }}
                  </v-chip>
                </td>
              </tr>
              <tr>
                <td>Current Viewport:</td>
                <td>{{ displayName }} ({{ width }}x{{ height }})</td>
              </tr>
            </tbody>
          </v-simple-table>
          
          <div class="d-flex mt-4 gap-2">
            <v-btn @click="toggleOffline">
              {{ isOnline ? 'Simulate Offline' : 'Go Online' }}
            </v-btn>
            <v-btn @click="clearCache">
              Clear Cache
            </v-btn>
            <v-btn @click="unregisterSW">
              Unregister SW
            </v-btn>
          </div>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePWA } from '@/composables/usePWA'
import { useDisplay } from 'vuetify'

// PWA state
const { isPWA, isOnline } = usePWA()
const { name: displayName, width, height } = useDisplay()

// Local state
const expanded = ref(false)
const isDev = ref(import.meta.env.DEV)
const serviceWorkerActive = ref(false)

// Display mode detection
const displayMode = computed(() => {
  if (window.matchMedia('(display-mode: standalone)').matches)
    return 'Standalone'
  if (window.matchMedia('(display-mode: fullscreen)').matches)
    return 'Fullscreen'
  if (window.matchMedia('(display-mode: minimal-ui)').matches)
    return 'Minimal UI'
  return 'Browser'
})

// Methods
const toggleOffline = () => {
  if (isOnline.value) {
    window.dispatchEvent(new Event('offline'))
  } else {
    window.dispatchEvent(new Event('online'))
  }
}

const clearCache = async () => {
  try {
    const cacheKeys = await caches.keys()
    await Promise.all(cacheKeys.map(key => caches.delete(key)))
    alert('All caches cleared')
  } catch (error) {
    console.error('Failed to clear caches:', error)
  }
}

const unregisterSW = async () => {
  try {
    const registrations = await navigator.serviceWorker.getRegistrations()
    await Promise.all(registrations.map(r => r.unregister()))
    alert('Service Worker unregistered')
    serviceWorkerActive.value = false
  } catch (error) {
    console.error('Failed to unregister service worker:', error)
  }
}

// Check service worker status
onMounted(async () => {
  serviceWorkerActive.value = 
    'serviceWorker' in navigator && 
    !!navigator.serviceWorker.controller
})
</script>
```

## Conclusion

By combining Vuetify's responsive capabilities with PWA features, you can create powerful, offline-capable applications that work seamlessly across all devices. The key steps to success are:

1. **Use Vuetify's responsive system** - Leverage the `useDisplay` composable and responsive classes to create adaptive layouts
2. **Configure the PWA plugin properly** - Set up appropriate caching strategies and manifest details
3. **Implement offline capabilities** - Use IndexedDB or other storage methods for offline data management
4. **Create responsive PWA components** - Design your UI components to work well across all screen sizes
5. **Test thoroughly** - Verify

```javascript
import { useDisplay } from 'vuetify'

// In a setup function
const { 
  xs,                // Boolean - Is extra small viewport
  sm, md, lg, xl,    // Boolean - Is current viewport
  mobile,            // Boolean - Is mobile breakpoint (configurable)
  name,              // String - Current breakpoint name
  height, width,     // Number - Viewport dimensions
  smAndDown,         // Boolean - Is sm or smaller
  smAndUp,           // Boolean - Is sm or larger 
  mdAndDown,         // Boolean - Is md or smaller
  mdAndUp,           // Boolean - Is md or larger
  lgAndDown,         // Boolean - Is lg or smaller
  lgAndUp,           // Boolean - Is lg or larger
  xlAndDown,         // Boolean - Is xl or smaller
  xlAndUp            // Boolean - Is xl or larger
} = useDisplay()
```

```javascript
// src/plugins/vuetify.ts
export default createVuetify({
  display: {
    mobileBreakpoint: 'sm', // This determines what's considered "mobile"
    thresholds: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  }
})
```

```html
   <v-row>
     <v-col cols="12" sm="6" md="4" lg="3">
       <!-- Full width on xs, half on sm, 1/3 on md, 1/4 on lg and up -->
     </v-col>
   </v-row>
```

```html
   <h1 class="
     text-h4
     text-md-h2
     text-lg-h1
   ">
     This text changes size based on viewport
   </h1>
```

```html
   <!-- Hidden on all screens -->
   <div class="d-none">...</div>
   
   <!-- Visible only on small screens -->
   <div class="d-none d-sm-flex d-md-none">...</div>
```

```html
   <script setup>
   import { computed } from 'vue'
   import { useDisplay } from 'vuetify'

   const { mobile } = useDisplay()
   
   const cardHeight = computed(() => mobile.value ? 200 : 400)
   </script>

   <template>
     <v-card :height="cardHeight">...</v-card>
   </template>
```

```html
   <template>
     <div v-if="!$vuetify.display.mdAndDown">Desktop view</div>
     <div v-else>Mobile view</div>
   </template>
```

```shellscript
npm install -D vite-plugin-pwa @vite-pwa/assets-generator
```

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    VitePWA({
      registerType: 'autoUpdate', // Automatically updates the service worker
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'maskable-icon-512x512.png'],
      manifest: {
        name: 'My Vue 3 PWA',
        short_name: 'VuePWA',
        description: 'A Vue 3 PWA with Vuetify',
        theme_color: '#1976d2',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        // Cache strategies for different resources
        runtimeCaching: [
          {
            // Cache for CSS, JS, and worker files
            urlPattern: ({ request }) => 
              request.destination === 'style' || 
              request.destination === 'script' || 
              request.destination === 'worker',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            // Cache for images
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
              },
            },
          },
          {
            // Cache for API calls
            urlPattern: ({ url }) => url.pathname.startsWith('/api'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
              }
            }
          }
        ],
      },
      devOptions: {
        enabled: true, // Enable during development
        type: 'module'
      }
    })
  ]
})
```

```typescript
// src/composables/usePWA.ts
import { ref, computed, onMounted } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'

// Interface for install prompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export const usePWA = () => {
  // PWA Installation
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
  const isPWAInstallable = ref(false)
  const isPWAInstalled = ref(false)
  
  // Network Status
  const isOnline = ref(navigator.onLine)
  
  // Service Worker states from the plugin
  const {
    needRefresh, // True if new content is available
    offlineReady, // True if the app is ready for offline use
    updateServiceWorker // Function to update the service worker
  } = useRegisterSW({
    onRegistered(r) {
      console.log('Service Worker registered:', r)
    },
    onRegisterError(error) {
      console.error('Service Worker registration error:', error)
    }
  })

  // Check if running as PWA
  const isPWA = computed(() => {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true ||
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
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault()
      deferredPrompt.value = e as BeforeInstallPromptEvent
      isPWAInstallable.value = true
      console.log('PWA install prompt ready')
    })

    // Listen for install event
    window.addEventListener('appinstalled', () => {
      isPWAInstalled.value = true
      isPWAInstallable.value = false
      deferredPrompt.value = null
      console.log('PWA installed via browser prompt')
    })

    // Network status
    const updateOnlineStatus = () => {
      isOnline.value = navigator.onLine
    }
    
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
  })

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
    
    // Computed states
    canInstall: computed(() => isPWAInstallable.value && !isPWA.value),
    showUpdatePrompt: computed(() => needRefresh.value),
    showOfflineReady: computed(() => offlineReady.value)
  }
}
```

```vue
<!-- src/components/PWAHandler.vue -->
<template>
  <div>
    <!-- Install Prompt -->
    <v-snackbar
      v-model="showInstallPrompt"
      timeout="-1"
      color="primary"
      location="bottom"
    >
      Install this app for offline use
      <template v-slot:actions>
        <v-btn variant="text" @click="showInstallPrompt = false">
          Later
        </v-btn>
        <v-btn
          color="white"
          variant="elevated"
          :loading="installing"
          @click="handleInstall"
        >
          Install
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Update Notification -->
    <v-snackbar
      v-model="showUpdateSnackbar"
      timeout="-1"
      color="info"
      location="bottom"
    >
      New version available
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="elevated"
          :loading="updating"
          @click="handleUpdate"
        >
          Update
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Offline Indicator -->
    <v-snackbar
      v-model="showOfflineIndicator"
      timeout="5000"
      color="warning"
      location="top"
    >
      You're currently offline. Some features may be limited.
    </v-snackbar>

    <!-- Offline Ready Notification -->
    <v-snackbar
      v-model="showOfflineReadyNotice"
      color="success"
      timeout="3000"
      location="bottom"
    >
      App is ready for offline use!
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { usePWA } from '@/composables/usePWA'

// PWA state
const {
  canInstall,
  isOnline,
  showUpdatePrompt,
  showOfflineReady,
  installPWA,
  updatePWA
} = usePWA()

// Local state
const showInstallPrompt = ref(false)
const showUpdateSnackbar = ref(false)
const showOfflineIndicator = ref(false)
const showOfflineReadyNotice = ref(false)
const installing = ref(false)
const updating = ref(false)

// Methods
const handleInstall = async () => {
  installing.value = true
  try {
    await installPWA()
  } catch (error) {
    console.error('Installation failed:', error)
  } finally {
    installing.value = false
    showInstallPrompt.value = false
  }
}

const handleUpdate = async () => {
  updating.value = true
  try {
    await updatePWA()
  } catch (error) {
    console.error('Update failed:', error)
  } finally {
    updating.value = false
    showUpdateSnackbar.value = false
  }
}

// Watch for changes to show appropriate UI
watch(canInstall, (value) => {
  if (value) {
    // Show install prompt after a delay
    setTimeout(() => {
      showInstallPrompt.value = true
    }, 3000)
  }
})

watch(showUpdatePrompt, (value) => {
  showUpdateSnackbar.value = value
})

watch(showOfflineReady, (value) => {
  showOfflineReadyNotice.value = value
})

watch(isOnline, (newValue, oldValue) => {
  // Show offline indicator when going offline
  if (oldValue === true && newValue === false) {
    showOfflineIndicator.value = true
  }
})
</script>
```

```css
/* Essential styles for first render */
@media (max-width: 600px) {
  .app-header {
    height: 56px;
  }
  
  .app-content {
    padding: 16px;
  }
}

@media (min-width: 600px) {
  .app-header {
    height: 64px;
  }
  
  .app-content {
    padding: 24px;
  }
}
```

```html
<!-- Hidden on mobile, visible on tablet and up -->
<v-btn class="d-none d-sm-flex">Desktop Action</v-btn>

<!-- Visible on mobile, hidden on tablet and up -->
<v-btn class="d-flex d-sm-none">Mobile Action</v-btn>
```

```vue
<template>
  <div>
    <v-app-bar>
      <v-app-bar-title>My PWA App</v-app-bar-title>
      <v-spacer></v-spacer>
      <!-- Show offline indicator when offline -->
      <v-chip v-if="!isOnline" color="warning" size="small">
        Offline
      </v-chip>
    </v-app-bar>
    
    <v-main>
      <!-- Adapt content based on online status -->
      <v-container v-if="isOnline">
        <online-content />
      </v-container>
      <v-container v-else>
        <offline-content />
      </v-container>
    </v-main>
  </div>
</template>

<script setup>
import { usePWA } from '@/composables/usePWA'
import { useDisplay } from 'vuetify'

const { isOnline } = usePWA()
const { mobile } = useDisplay()
</script>
```

```javascript
// Instead of importing everything upfront
const DesktopView = defineAsyncComponent(() => 
  import('./DesktopView.vue')
)

const MobileView = defineAsyncComponent(() => 
  import('./MobileView.vue')
)
```

```html
<template>
  <div 
    v-if="loading"
    class="splash-screen"
    :class="{ 'mobile-splash': mobile }"
  >
    <img 
      :src="mobile ? '/logo-small.png' : '/logo-large.png'"
      alt="App Logo"
    />
    <v-progress-circular indeterminate></v-progress-circular>
  </div>
</template>

<style scoped>
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  z-index: 9999;
}

.mobile-splash img {
  width: 120px;
  height: 120px;
}

.splash-screen:not(.mobile-splash) img {
  width: 200px;
  height: 200px;
}
</style>
```

```javascript
import { openDB } from 'idb'

// Create and connect to the database
const db = await openDB('my-pwa-db', 1, {
  upgrade(db) {
    // Create stores
    db.createObjectStore('todos', { keyPath: 'id' })
    db.createObjectStore('settings')
  }
})

// Store data
await db.put('todos', { id: 1, text: 'Learn PWA', completed: false })

// Get data
const todo = await db.get('todos', 1)
```

```javascript
// Request permission for background sync
if ('permissions' in navigator) {
  const status = await navigator.permissions.query({
    name: 'periodic-background-sync',
  })
  
  if (status.state === 'granted') {
    // Register for background sync
    const registration = await navigator.serviceWorker.ready
    try {
      await registration.periodicSync.register('content-sync', {
        minInterval: 24 * 60 * 60 * 1000, // 1 day
      })
    } catch (error) {
      console.error('Periodic sync registration failed:', error)
    }
  }
}
```

```vue
<template>
  <div>
    <v-btn
      v-if="!pushEnabled && pushSupported"
      color="primary"
      prepend-icon="mdi-bell"
      @click="requestPushPermission"
    >
      Enable Notifications
    </v-btn>
    
    <!-- Push notification settings -->
    <v-list v-if="pushEnabled">
      <v-list-subheader>Notification Settings</v-list-subheader>
      <v-list-item v-for="(setting, i) in notificationSettings" :key="i">
        <v-list-item-title>{{ setting.title }}</v-list-item-title>
        <template v-slot:append>
          <v-switch v-model="setting.enabled"></v-switch>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const pushSupported = ref(false)
const pushEnabled = ref(false)
const notificationSettings = ref([
  { title: 'New messages', enabled: true },
  { title: 'Updates', enabled: true }
])

onMounted(() => {
  pushSupported.value = 'PushManager' in window
  
  if (pushSupported.value) {
    pushEnabled.value = 
      Notification.permission === 'granted'
  }
})

async function requestPushPermission() {
  try {
    const permission = await Notification.requestPermission()
    pushEnabled.value = permission === 'granted'
    
    if (pushEnabled.value) {
      // Subscribe to push service
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY'
      })
      
      // Send subscription to server
      await sendSubscriptionToServer(subscription)
    }
  } catch (error) {
    console.error('Error requesting notifications permission:', error)
  }
}

async function sendSubscriptionToServer(subscription) {
  // Your implementation to send the subscription to your server
}
</script>
```

```vue
<!-- src/components/PWADebugger.vue -->
<template>
  <v-card v-if="isDev" class="my-4">
    <v-card-title>
      PWA Debug Info
      <v-spacer></v-spacer>
      <v-btn icon @click="expanded = !expanded">
        <v-icon>{{ expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-title>
    
    <v-expand-transition>
      <div v-if="expanded">
        <v-divider></v-divider>
        <v-card-text>
          <v-simple-table>
            <tbody>
              <tr>
                <td>PWA Mode:</td>
                <td>{{ isPWA ? 'Yes' : 'No' }}</td>
              </tr>
              <tr>
                <td>Display Mode:</td>
                <td>{{ displayMode }}</td>
              </tr>
              <tr>
                <td>Online:</td>
                <td>
                  <v-chip :color="isOnline ? 'success' : 'error'">
                    {{ isOnline ? 'Yes' : 'No' }}
                  </v-chip>
                </td>
              </tr>
              <tr>
                <td>Service Worker:</td>
                <td>
                  <v-chip :color="serviceWorkerActive ? 'success' : 'warning'">
                    {{ serviceWorkerActive ? 'Active' : 'Inactive' }}
                  </v-chip>
                </td>
              </tr>
              <tr>
                <td>Current Viewport:</td>
                <td>{{ displayName }} ({{ width }}x{{ height }})</td>
              </tr>
            </tbody>
          </v-simple-table>
          
          <div class="d-flex mt-4 gap-2">
            <v-btn @click="toggleOffline">
              {{ isOnline ? 'Simulate Offline' : 'Go Online' }}
            </v-btn>
            <v-btn @click="clearCache">
              Clear Cache
            </v-btn>
            <v-btn @click="unregisterSW">
              Unregister SW
            </v-btn>
          </div>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePWA } from '@/composables/usePWA'
import { useDisplay } from 'vuetify'

// PWA state
const { isPWA, isOnline } = usePWA()
const { name: displayName, width, height } = useDisplay()

// Local state
const expanded = ref(false)
const isDev = ref(import.meta.env.DEV)
const serviceWorkerActive = ref(false)

// Display mode detection
const displayMode = computed(() => {
  if (window.matchMedia('(display-mode: standalone)').matches)
    return 'Standalone'
  if (window.matchMedia('(display-mode: fullscreen)').matches)
    return 'Fullscreen'
  if (window.matchMedia('(display-mode: minimal-ui)').matches)
    return 'Minimal UI'
  return 'Browser'
})

// Methods
const toggleOffline = () => {
  if (isOnline.value) {
    window.dispatchEvent(new Event('offline'))
  } else {
    window.dispatchEvent(new Event('online'))
  }
}

const clearCache = async () => {
  try {
    const cacheKeys = await caches.keys()
    await Promise.all(cacheKeys.map(key => caches.delete(key)))
    alert('All caches cleared')
  } catch (error) {
    console.error('Failed to clear caches:', error)
  }
}

const unregisterSW = async () => {
  try {
    const registrations = await navigator.serviceWorker.getRegistrations()
    await Promise.all(registrations.map(r => r.unregister()))
    alert('Service Worker unregistered')
    serviceWorkerActive.value = false
  } catch (error) {
    console.error('Failed to unregister service worker:', error)
  }
}

// Check service worker status
onMounted(async () => {
  serviceWorkerActive.value = 
    'serviceWorker' in navigator && 
    !!navigator.serviceWorker.controller
})
</script>
```

