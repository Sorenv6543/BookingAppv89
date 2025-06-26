<template>
  <div class="pwa-notifications-enhanced">
    <!-- Offline Status Banner -->
    <v-banner
      v-if="!isOnline"
      color="warning"
      icon="mdi-wifi-off"
      lines="two"
      sticky
    >
      <v-banner-text>
        <div class="text-subtitle-1 font-weight-medium mb-1">
          You're Offline
        </div>
        <div class="text-body-2">
          {{ offlineMessage }}
        </div>
      </v-banner-text>
      <template #actions>
        <v-btn
          variant="text"
          size="small"
          @click="checkConnection"
        >
          Retry
        </v-btn>
      </template>
    </v-banner>

    <!-- Background Sync Status -->
    <v-banner
      v-if="hasPendingSync && isOnline"
      color="info"
      icon="mdi-sync"
      lines="two"
      sticky
    >
      <v-banner-text>
        <div class="text-subtitle-1 font-weight-medium mb-1">
          Syncing {{ syncStatus.total }} Operations
        </div>
        <div class="text-body-2">
          {{ syncStatusMessage }}
        </div>
      </v-banner-text>
      <template #actions>
        <v-btn
          variant="text"
          size="small"
          :loading="isProcessingSync"
          @click="retrySync"
        >
          Retry
        </v-btn>
      </template>
    </v-banner>

    <!-- Push Notifications Permission -->
    <v-banner
      v-if="showNotificationPrompt"
      color="primary"
      icon="mdi-bell"
      lines="two"
      sticky
    >
      <v-banner-text>
        <div class="text-subtitle-1 font-weight-medium mb-1">
          Enable Notifications
        </div>
        <div class="text-body-2">
          {{ notificationPromptMessage }}
        </div>
      </v-banner-text>
      <template #actions>
        <v-btn
          variant="text"
          size="small"
          @click="dismissNotificationPrompt"
        >
          Not Now
        </v-btn>
        <v-btn
          color="white"
          variant="elevated"
          size="small"
          :loading="requestingPermission"
          @click="requestNotifications"
        >
          Enable
        </v-btn>
      </template>
    </v-banner>

    <!-- PWA Install Prompt -->
    <v-banner
      v-if="canInstall && !hideInstallPrompt"
      color="success"
      icon="mdi-download"
      lines="two"
      sticky
    >
      <v-banner-text>
        <div class="text-subtitle-1 font-weight-medium mb-1">
          Install {{ appName }} App
        </div>
        <div class="text-body-2">
          {{ installPromptMessage }}
        </div>
      </v-banner-text>
      <template #actions>
        <v-btn
          variant="text"
          size="small"
          @click="dismissInstallPrompt"
        >
          Not Now
        </v-btn>
        <v-btn
          color="white"
          variant="elevated"
          size="small"
          :loading="installing"
          @click="handleInstall"
        >
          Install
        </v-btn>
      </template>
    </v-banner>

    <!-- PWA Update Available -->
    <v-banner
      v-if="showUpdatePrompt"
      color="secondary"
      icon="mdi-update"
      lines="two"
      sticky
    >
      <v-banner-text>
        <div class="text-subtitle-1 font-weight-medium mb-1">
          App Update Available
        </div>
        <div class="text-body-2">
          A new version is ready with improvements and bug fixes.
        </div>
      </v-banner-text>
      <template #actions>
        <v-btn
          variant="text"
          size="small"
          @click="$emit('dismissUpdate')"
        >
          Later
        </v-btn>
        <v-btn
          color="white"
          variant="elevated"
          size="small"
          :loading="updating"
          @click="handleUpdate"
        >
          Update Now
        </v-btn>
      </template>
    </v-banner>

    <!-- Success Notifications -->
    <v-snackbar
      v-model="showOfflineReadySnackbar"
      timeout="4000"
      color="success"
      location="bottom"
    >
      App is ready to work offline!
      <template #actions>
        <v-btn
          variant="text"
          @click="showOfflineReadySnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar
      v-model="showInstallSuccess"
      timeout="4000"
      color="success"
      location="bottom"
    >
      {{ appName }} installed successfully!
      <template #actions>
        <v-btn
          variant="text"
          @click="showInstallSuccess = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar
      v-model="showNotificationSuccess"
      timeout="4000"
      color="success"
      location="bottom"
    >
      Notifications enabled! You'll receive alerts for urgent turns.
      <template #actions>
        <v-btn
          variant="text"
          @click="showNotificationSuccess = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar
      v-model="showSyncSuccess"
      timeout="3000"
      color="success"
      location="bottom"
    >
      All changes synced successfully!
      <template #actions>
        <v-btn
          variant="text"
          @click="showSyncSuccess = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { usePWA } from '@/composables/shared/usePWA'
import { useAuth } from '@/composables/shared/useAuth'

// Emits
interface Emits {
  (e: 'dismissUpdate'): void
}

defineEmits<Emits>()

// Composables
const {
  isOnline,
  canInstall,
  showUpdatePrompt,
  showOfflineReady,
  installPWA,
  updatePWA,
  pushNotifications,
  backgroundSync
} = usePWA()

const { userRole } = useAuth()

// Local state
const hideInstallPrompt = ref(false)
const hideNotificationPrompt = ref(false)
const installing = ref(false)
const updating = ref(false)
const requestingPermission = ref(false)
const showOfflineReadySnackbar = ref(false)
const showInstallSuccess = ref(false)
const showNotificationSuccess = ref(false)
const showSyncSuccess = ref(false)

// Computed properties
const appName = computed(() => {
  if (userRole.value === 'owner') return 'CleanSync'
  if (userRole.value === 'admin') return 'CleanSync Pro'
  return 'CleanSync'
})

const showNotificationPrompt = computed(() => {
  return pushNotifications.canRequestPermission.value && 
         !hideNotificationPrompt.value &&
         !pushNotifications.hasPermission.value
})

const notificationPromptMessage = computed(() => {
  if (userRole.value === 'owner') {
    return 'Get instant alerts for urgent turn cleanings and booking confirmations.'
  }
  return 'Receive system alerts for urgent turns and business-critical notifications.'
})

const installPromptMessage = computed(() => {
  if (userRole.value === 'owner') {
    return 'Get faster access and work offline for property management.'
  }
  return 'Enhanced mobile oversight with offline capabilities for business management.'
})

const offlineMessage = computed(() => {
  const pendingCount = backgroundSync.queueLength.value
  if (pendingCount > 0) {
    return `${pendingCount} operations will sync when connection returns.`
  }
  return 'Some features may be limited until connection returns.'
})

const hasPendingSync = computed(() => 
  backgroundSync.hasPendingOperations.value && backgroundSync.canProcess.value
)

const isProcessingSync = computed(() => backgroundSync.isProcessing.value)

const syncStatus = computed(() => backgroundSync.getQueueStatus())

const syncStatusMessage = computed(() => {
  const status = syncStatus.value
  const operations = Object.entries(status.operations)
    .map(([op, count]) => `${count} ${op.replace('_', ' ')}`)
    .join(', ')
  
  return operations || 'Syncing changes...'
})

// Methods
const checkConnection = () => {
  window.dispatchEvent(new Event('online'))
}

const dismissInstallPrompt = () => {
  hideInstallPrompt.value = true
  localStorage.setItem('pwa-install-dismissed', Date.now().toString())
}

const dismissNotificationPrompt = () => {
  hideNotificationPrompt.value = true
  localStorage.setItem('pwa-notification-dismissed', Date.now().toString())
}

const handleInstall = async () => {
  installing.value = true
  try {
    const success = await installPWA()
    if (success) {
      showInstallSuccess.value = true
    }
  } catch (error) {
    console.error('Installation failed:', error)
  } finally {
    installing.value = false
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
  }
}

const requestNotifications = async () => {
  requestingPermission.value = true
  try {
    const granted = await pushNotifications.requestPermission()
    if (granted) {
      showNotificationSuccess.value = true
      hideNotificationPrompt.value = true
    }
  } catch (error) {
    console.error('Notification permission failed:', error)
  } finally {
    requestingPermission.value = false
  }
}

const retrySync = async () => {
  try {
    await backgroundSync.retryFailedOperations()
  } catch (error) {
    console.error('Sync retry failed:', error)
  }
}

// Watchers
watch(showOfflineReady, (newValue) => {
  if (newValue) {
    showOfflineReadySnackbar.value = true
  }
})

watch(() => backgroundSync.queueLength.value, (newLength, oldLength) => {
  // Show success when queue becomes empty (operations completed)
  if (oldLength > 0 && newLength === 0 && isOnline.value) {
    showSyncSuccess.value = true
  }
})

// Check dismissal preferences
const checkDismissalPreferences = () => {
  const installDismissed = localStorage.getItem('pwa-install-dismissed')
  const notificationDismissed = localStorage.getItem('pwa-notification-dismissed')
  
  if (installDismissed) {
    const dismissedTime = parseInt(installDismissed)
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
    if (dismissedTime > oneWeekAgo) {
      hideInstallPrompt.value = true
    }
  }

  if (notificationDismissed) {
    const dismissedTime = parseInt(notificationDismissed)
    const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000)
    if (dismissedTime > threeDaysAgo) {
      hideNotificationPrompt.value = true
    }
  }
}

// Initialize
onMounted(() => {
  checkDismissalPreferences()
})
</script>

<style scoped>
.pwa-notifications-enhanced {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1100;
}

.v-banner {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Ensure banners stack properly */
.v-banner + .v-banner {
  position: relative;
  top: 0;
}

/* Mobile optimizations */
@media (max-width: 600px) {
  .v-banner .v-banner-text {
    padding-right: 0;
  }
  
  .v-banner .v-btn {
    margin-left: 8px;
  }
}
</style> 