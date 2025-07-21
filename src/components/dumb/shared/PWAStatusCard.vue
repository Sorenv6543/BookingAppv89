<template>
  <v-card
    v-if="showCard"
    variant="outlined"
    class="mb-4"
  >
    <v-card-title class="d-flex align-center gap-2">
      <v-icon 
        :color="isPWA ? 'success' : 'primary'"
        :icon="isPWA ? 'mdi-cellphone-check' : 'mdi-cellphone-arrow-down'"
      />
      PWA Status
      <v-spacer />
      <v-btn
        icon="mdi-chevron-down"
        variant="text"
        size="small"
        @click="expanded = !expanded"
      />
    </v-card-title>

    <v-expand-transition>
      <div v-show="expanded">
        <v-card-text>
          <v-simple-table density="compact">
            <tbody>
              <tr>
                <td>Mode:</td>
                <td>
                  <v-chip
                    :color="isPWA ? 'success' : 'primary'"
                    size="small"
                  >
                    {{ displayMode }}
                  </v-chip>
                </td>
              </tr>
              <tr>
                <td>Network:</td>
                <td>
                  <v-chip
                    :color="isOnline ? 'success' : 'warning'"
                    size="small"
                  >
                    {{ isOnline ? 'Online' : 'Offline' }}
                  </v-chip>
                </td>
              </tr>
              <tr>
                <td>Service Worker:</td>
                <td>
                  <v-chip
                    :color="serviceWorkerActive ? 'success' : 'warning'"
                    size="small"
                  >
                    {{ serviceWorkerActive ? 'Active' : 'Inactive' }}
                  </v-chip>
                </td>
              </tr>
              <tr>
                <td>Sync Queue:</td>
                <td>
                  <v-chip
                    :color="syncQueueLength > 0 ? 'warning' : 'success'"
                    size="small"
                  >
                    {{ syncQueueLength }} pending
                  </v-chip>
                </td>
              </tr>
              <tr>
                <td>Push Notifications:</td>
                <td>
                  <v-chip
                    :color="notificationColor"
                    size="small"
                  >
                    {{ notificationStatus }}
                  </v-chip>
                </td>
              </tr>
              <tr>
                <td>Role:</td>
                <td>
                  <v-chip
                    :color="roleColor"
                    size="small"
                  >
                    {{ roleLabel }}
                  </v-chip>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
          
          <div class="d-flex mt-4 gap-2 flex-wrap">
            <v-btn
              v-if="canInstall"
              :loading="installing"
              color="primary"
              size="small"
              @click="handleInstall"
            >
              <v-icon
                left
                icon="mdi-download"
              />
              Install
            </v-btn>
            
            <v-btn
              v-if="showUpdatePrompt"
              :loading="updating"
              color="warning"
              size="small"
              @click="handleUpdate"
            >
              <v-icon
                left
                icon="mdi-update"
              />
              Update
            </v-btn>
            
            <v-btn
              v-if="syncQueueLength > 0"
              :loading="isProcessingSync"
              color="info"
              size="small"
              @click="retrySync"
            >
              <v-icon
                left
                icon="mdi-sync"
              />
              Sync Now
            </v-btn>
          </div>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePWA } from '@/composables/shared/usePWA'
import { useAuthStore } from '@/stores/auth'

// Props
interface Props {
  showInProduction?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showInProduction: false
})

// Composables
const { 
  canInstall, 
  isOnline, 
  isPWA, 
  showUpdatePrompt,
  installPWA, 
  updatePWA,
  pushNotifications,
  backgroundSync
} = usePWA()

const authStore = useAuthStore()

// Local state
const expanded = ref(false)
const installing = ref(false)
const updating = ref(false)
const serviceWorkerActive = ref(false)

// Computed
const showCard = computed(() => {
  return import.meta.env.DEV || props.showInProduction
})

const displayMode = computed(() => {
  if (window.matchMedia('(display-mode: standalone)').matches)
    return 'Standalone PWA'
  if (window.matchMedia('(display-mode: fullscreen)').matches)
    return 'Fullscreen'
  if (window.matchMedia('(display-mode: minimal-ui)').matches)
    return 'Minimal UI'
  return 'Browser'
})

const syncQueueLength = computed(() => backgroundSync?.queueLength?.value || 0)
const isProcessingSync = computed(() => backgroundSync?.isProcessing?.value || false)

const notificationStatus = computed(() => {
  if (!pushNotifications?.isSupported?.value) return 'Not Supported'
  if (pushNotifications?.hasPermission?.value) return 'Enabled'
  if (pushNotifications?.canRequestPermission?.value) return 'Available'
  return 'Blocked'
})

const notificationColor = computed(() => {
  switch (notificationStatus.value) {
    case 'Enabled': return 'success'
    case 'Available': return 'primary'
    case 'Blocked': return 'error'
    default: return 'grey'
  }
})

const roleColor = computed(() => {
  if (authStore.isAdmin) return 'error'
  if (authStore.isOwner) return 'primary'
  return 'grey'
})

const roleLabel = computed(() => {
  if (authStore.isAdmin) return 'Business Admin'
  if (authStore.isOwner) return 'Property Owner'
  return 'Guest'
})

// Methods
const handleInstall = async () => {
  installing.value = true
  try {
    await installPWA()
  } finally {
    installing.value = false
  }
}

const handleUpdate = async () => {
  updating.value = true
  try {
    await updatePWA()
  } finally {
    updating.value = false
  }
}

const retrySync = async () => {
  try {
    if (backgroundSync?.retryFailedOperations) {
      await backgroundSync.retryFailedOperations()
    }
  } catch (error) {
    console.error('Sync retry failed:', error)
  }
}

onMounted(() => {
  serviceWorkerActive.value = 
    'serviceWorker' in navigator && 
    !!navigator.serviceWorker.controller
})
</script>

<style scoped>
.v-simple-table td {
  padding: 4px 8px;
  font-size: 0.875rem;
}

.v-simple-table td:first-child {
  font-weight: 500;
  width: 140px;
}

.v-btn {
  text-transform: none;
}
</style> 