<template>
  <div class="pwa-notifications">
    <!-- Offline Status Banner -->
    <v-banner
      v-if="!isOnline"
      color="warning"
      icon="mdi-wifi-off"
      lines="one"
      sticky
    >
      <v-banner-text>
        You're offline. Some features may be limited.
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

    <!-- PWA Install Prompt -->
    <v-banner
      v-if="canInstall && !hideInstallPrompt"
      color="primary"
      icon="mdi-download"
      lines="two"
      sticky
    >
      <v-banner-text>
        <div class="text-subtitle-1 font-weight-medium mb-1">
          Install CleanSync App
        </div>
        <div class="text-body-2">
          Get faster access and work offline with the installed app.
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
      color="info"
      icon="mdi-update"
      lines="two"
      sticky
    >
      <v-banner-text>
        <div class="text-subtitle-1 font-weight-medium mb-1">
          App Update Available
        </div>
        <div class="text-body-2">
          A new version is ready. Restart to get the latest features.
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

    <!-- Offline Ready -->
    <v-snackbar
      v-model="showOfflineReadySnackbar"
      timeout="4000"
      color="success"
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

    <!-- Install Success -->
    <v-snackbar
      v-model="showInstallSuccess"
      timeout="4000"
      color="success"
    >
      CleanSync installed successfully!
      <template #actions>
        <v-btn
          variant="text"
          @click="showInstallSuccess = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePWA } from '@/composables/shared/usePWA'

// Emits
interface Emits {
  (e: 'dismissUpdate'): void
}

defineEmits<Emits>()

// PWA Composable
const {
  isOnline,
  canInstall,
  showUpdatePrompt,
  showOfflineReady,
  installPWA,
  updatePWA
} = usePWA()

// Local state
const hideInstallPrompt = ref(false)
const installing = ref(false)
const updating = ref(false)
const showOfflineReadySnackbar = ref(false)
const showInstallSuccess = ref(false)

// Methods
const checkConnection = () => {
  // Force check network status
  window.dispatchEvent(new Event('online'))
}

const dismissInstallPrompt = () => {
  hideInstallPrompt.value = true
  // Store dismissal in localStorage to remember user preference
  localStorage.setItem('pwa-install-dismissed', Date.now().toString())
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

// Watch for offline ready status
watch(showOfflineReady, (newValue) => {
  if (newValue) {
    showOfflineReadySnackbar.value = true
  }
})

// Check if install prompt was previously dismissed
const checkInstallDismissal = () => {
  const dismissed = localStorage.getItem('pwa-install-dismissed')
  if (dismissed) {
    const dismissedTime = parseInt(dismissed)
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
    // Re-show prompt after one week
    if (dismissedTime > oneWeekAgo) {
      hideInstallPrompt.value = true
    }
  }
}

// Initialize
checkInstallDismissal()
</script>

<style scoped>
.pwa-notifications {
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
</style> 