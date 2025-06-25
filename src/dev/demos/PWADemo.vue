<template>
  <v-container class="pwa-demo">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h4 text-center py-4">
            PWA Demo & Testing
          </v-card-title>
          
          <v-divider />
          
          <v-card-text>
            <v-row>
              <!-- PWA Status -->
              <v-col cols="12" md="6">
                <v-card variant="outlined">
                  <v-card-title class="text-h6">
                    <v-icon class="mr-2">mdi-application</v-icon>
                    PWA Status
                  </v-card-title>
                  <v-card-text>
                    <v-list density="compact">
                      <v-list-item>
                        <v-list-item-title>Running as PWA</v-list-item-title>
                        <template #append>
                          <v-chip
                            :color="isPWA ? 'success' : 'default'"
                            size="small"
                          >
                            {{ isPWA ? 'Yes' : 'No' }}
                          </v-chip>
                        </template>
                      </v-list-item>
                      
                      <v-list-item>
                        <v-list-item-title>Can Install</v-list-item-title>
                        <template #append>
                          <v-chip
                            :color="canInstall ? 'primary' : 'default'"
                            size="small"
                          >
                            {{ canInstall ? 'Yes' : 'No' }}
                          </v-chip>
                        </template>
                      </v-list-item>
                      
                      <v-list-item>
                        <v-list-item-title>Service Worker</v-list-item-title>
                        <template #append>
                          <v-chip
                            :color="isServiceWorkerRegistered ? 'success' : 'warning'"
                            size="small"
                          >
                            {{ isServiceWorkerRegistered ? 'Active' : 'Inactive' }}
                          </v-chip>
                        </template>
                      </v-list-item>
                      
                      <v-list-item>
                        <v-list-item-title>Online Status</v-list-item-title>
                        <template #append>
                          <v-chip
                            :color="isOnline ? 'success' : 'error'"
                            size="small"
                          >
                            {{ isOnline ? 'Online' : 'Offline' }}
                          </v-chip>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <!-- PWA Actions -->
              <v-col cols="12" md="6">
                <v-card variant="outlined">
                  <v-card-title class="text-h6">
                    <v-icon class="mr-2">mdi-cog</v-icon>
                    PWA Actions
                  </v-card-title>
                  <v-card-text>
                    <v-btn
                      v-if="canInstall"
                      color="primary"
                      variant="elevated"
                      block
                      class="mb-3"
                      :loading="installing"
                      @click="handleInstall"
                    >
                      <v-icon class="mr-2">mdi-download</v-icon>
                      Install App
                    </v-btn>
                    
                    <v-btn
                      v-if="showUpdatePrompt"
                      color="info"
                      variant="elevated"
                      block
                      class="mb-3"
                      :loading="updating"
                      @click="handleUpdate"
                    >
                      <v-icon class="mr-2">mdi-update</v-icon>
                      Update App
                    </v-btn>
                    
                    <v-btn
                      color="warning"
                      variant="outlined"
                      block
                      class="mb-3"
                      @click="toggleOfflineMode"
                    >
                      <v-icon class="mr-2">mdi-wifi-off</v-icon>
                      {{ isOnline ? 'Go Offline' : 'Go Online' }}
                    </v-btn>
                    
                    <v-btn
                      color="secondary"
                      variant="outlined"
                      block
                      @click="refreshPage"
                    >
                      <v-icon class="mr-2">mdi-refresh</v-icon>
                      Refresh Page
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            
            <!-- PWA Features Test -->
            <v-row class="mt-4">
              <v-col cols="12">
                <v-card variant="outlined">
                  <v-card-title class="text-h6">
                    <v-icon class="mr-2">mdi-test-tube</v-icon>
                    PWA Features Test
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <!-- Offline Storage Test -->
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="testData"
                          label="Test Data"
                          hint="Data persists offline"
                          persistent-hint
                          variant="outlined"
                        />
                        <v-btn
                          color="primary"
                          class="mt-2 mr-2"
                          @click="saveTestData"
                        >
                          Save to Cache
                        </v-btn>
                        <v-btn
                          color="secondary"
                          class="mt-2"
                          @click="loadTestData"
                        >
                          Load from Cache
                        </v-btn>
                      </v-col>
                      
                      <!-- Network Test -->
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="apiResponse"
                          label="API Response"
                          readonly
                          variant="outlined"
                          hint="Tests network caching"
                          persistent-hint
                        />
                        <v-btn
                          color="primary"
                          class="mt-2"
                          :loading="testingApi"
                          @click="testApiCall"
                        >
                          Test API Call
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            
            <!-- PWA Information -->
            <v-row class="mt-4">
              <v-col cols="12">
                <v-card variant="outlined">
                  <v-card-title class="text-h6">
                    <v-icon class="mr-2">mdi-information</v-icon>
                    PWA Information
                  </v-card-title>
                  <v-card-text>
                    <v-list density="compact">
                      <v-list-item>
                        <v-list-item-title>User Agent</v-list-item-title>
                        <v-list-item-subtitle class="text-wrap">
                          {{ navigator.userAgent }}
                        </v-list-item-subtitle>
                      </v-list-item>
                      
                      <v-list-item>
                        <v-list-item-title>Display Mode</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ displayMode }}
                        </v-list-item-subtitle>
                      </v-list-item>
                      
                      <v-list-item>
                        <v-list-item-title>Platform</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ navigator.platform }}
                        </v-list-item-subtitle>
                      </v-list-item>
                      
                      <v-list-item>
                        <v-list-item-title>Storage Estimate</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ storageInfo }}
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePWA } from '@/composables/shared/usePWA'

// PWA Composable
const {
  isOnline,
  isPWA,
  canInstall,
  showUpdatePrompt,
  installPWA,
  updatePWA
} = usePWA()

// Local state
const installing = ref(false)
const updating = ref(false)
const testData = ref('')
const apiResponse = ref('')
const testingApi = ref(false)
const storageInfo = ref('Calculating...')

// Computed
const isServiceWorkerRegistered = computed(() => {
  return 'serviceWorker' in navigator && !!navigator.serviceWorker.controller
})

const displayMode = computed(() => {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return 'Standalone'
  }
  if (window.matchMedia('(display-mode: fullscreen)').matches) {
    return 'Fullscreen'
  }
  if (window.matchMedia('(display-mode: minimal-ui)').matches) {
    return 'Minimal UI'
  }
  return 'Browser'
})

// Methods
const handleInstall = async () => {
  installing.value = true
  try {
    await installPWA()
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

const toggleOfflineMode = () => {
  // Simulate offline mode by dispatching events
  if (isOnline.value) {
    window.dispatchEvent(new Event('offline'))
  } else {
    window.dispatchEvent(new Event('online'))
  }
}

const refreshPage = () => {
  window.location.reload()
}

const saveTestData = () => {
  localStorage.setItem('pwa-test-data', testData.value)
  console.log('Test data saved:', testData.value)
}

const loadTestData = () => {
  const saved = localStorage.getItem('pwa-test-data')
  if (saved) {
    testData.value = saved
    console.log('Test data loaded:', saved)
  }
}

const testApiCall = async () => {
  testingApi.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    apiResponse.value = `Success at ${new Date().toLocaleTimeString()}`
  } catch (error) {
    apiResponse.value = `Error: ${error}`
  } finally {
    testingApi.value = false
  }
}

const getStorageEstimate = async () => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate()
      const used = estimate.usage ? (estimate.usage / 1024 / 1024).toFixed(2) : 'Unknown'
      const quota = estimate.quota ? (estimate.quota / 1024 / 1024).toFixed(2) : 'Unknown'
      storageInfo.value = `${used}MB / ${quota}MB`
    } catch (error) {
      storageInfo.value = 'Not available'
    }
  } else {
    storageInfo.value = 'Not supported'
  }
}

// Initialize
onMounted(() => {
  getStorageEstimate()
  loadTestData()
})
</script>

<style scoped>
.pwa-demo {
  max-width: 1200px;
  margin: 0 auto;
}

.text-wrap {
  white-space: normal !important;
  word-break: break-word;
}
</style> 