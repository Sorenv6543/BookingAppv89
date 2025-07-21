<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">
          AdminQuickActions Demo
        </h1>
        <p class="text-body-1 mb-6">
          This demo showcases the AdminQuickActions component with various states and configurations.
        </p>
      </v-col>
    </v-row>
    
    <v-row>
      <!-- Demo Controls -->
      <v-col
        cols="12"
        md="4"
      >
        <v-card
          variant="outlined"
          class="mb-4"
        >
          <v-card-title class="text-h6">
            Demo Controls
          </v-card-title>
          <v-card-text>
            <v-switch
              v-model="loading"
              label="Loading State"
              color="primary"
              class="mb-2"
            />
            
            <v-switch
              v-model="disabled"
              label="Disabled State"
              color="secondary"
              class="mb-2"
            />
            
            <v-slider
              v-model="urgentCount"
              label="Urgent Count"
              :min="0"
              :max="20"
              :step="1"
              thumb-label
              class="mb-2"
            />
            
            <v-slider
              v-model="todayBookings"
              label="Today Bookings"
              :min="0"
              :max="50"
              :step="1"
              thumb-label
              class="mb-2"
            />
            
            <v-slider
              v-model="unassignedCount"
              label="Unassigned Count"
              :min="0"
              :max="30"
              :step="1"
              thumb-label
              class="mb-2"
            />
            
            <v-slider
              v-model="completedToday"
              label="Completed Today"
              :min="0"
              :max="25"
              :step="1"
              thumb-label
              class="mb-2"
            />
            
            <v-select
              v-model="selectedVariant"
              :items="variantOptions"
              label="Card Variant"
              variant="outlined"
              class="mb-2"
            />
            
            <v-slider
              v-model="elevation"
              label="Elevation"
              :min="0"
              :max="24"
              :step="1"
              thumb-label
            />
          </v-card-text>
        </v-card>
        
        <!-- Action Log -->
        <v-card variant="outlined">
          <v-card-title class="text-h6 d-flex align-center">
            Action Log
            <v-spacer />
            <v-btn
              size="small"
              variant="text"
              @click="actionLog = []"
            >
              Clear
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div
              v-if="actionLog.length === 0"
              class="text-center text-medium-emphasis py-4"
            >
              No actions performed yet
            </div>
            <v-list
              v-else
              density="compact"
            >
              <v-list-item
                v-for="(action, index) in actionLog.slice().reverse()"
                :key="index"
                class="px-0"
              >
                <v-list-item-title class="text-body-2">
                  <v-chip
                    size="x-small"
                    color="primary"
                    class="mr-2"
                  >
                    {{ actionLog.length - index }}
                  </v-chip>
                  {{ formatActionType(action.type) }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  {{ action.timestamp.toLocaleTimeString() }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      
      <!-- AdminQuickActions Demo -->
      <v-col
        cols="12"
        md="8"
      >
        <v-card variant="outlined">
          <v-card-title class="text-h6">
            AdminQuickActions Component
          </v-card-title>
          <v-card-text>
            <AdminQuickActions
              :loading="loading"
              :disabled="disabled"
              :elevation="elevation"
              :variant="selectedVariant"
              :urgent-count="urgentCount"
              :today-bookings="todayBookings"
              :unassigned-count="unassignedCount"
              :completed-today="completedToday"
              @action="handleAction"
            />
          </v-card-text>
        </v-card>
        
        <!-- Component Info -->
        <v-card
          variant="outlined"
          class="mt-4"
        >
          <v-card-title class="text-h6">
            Component Features
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>Critical Actions</v-list-item-title>
                <v-list-item-subtitle>
                  Urgent turns management and cleaner assignment with visual indicators
                </v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <v-list-item-title>Primary Management</v-list-item-title>
                <v-list-item-subtitle>
                  Master calendar access and new booking creation
                </v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <v-list-item-title>Bulk Operations</v-list-item-title>
                <v-list-item-subtitle>
                  Collapsible section for bulk assignment and rescheduling
                </v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <v-list-item-title>Business Management</v-list-item-title>
                <v-list-item-subtitle>
                  Cleaner management, reports, properties, and system settings
                </v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <v-list-item-title>Quick Stats</v-list-item-title>
                <v-list-item-subtitle>
                  Optional statistics display for today's metrics
                </v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <v-list-item-title>Responsive Design</v-list-item-title>
                <v-list-item-subtitle>
                  Adaptive layout with mobile-optimized text and spacing
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminQuickActions from '@/components/dumb/admin/AdminQuickActions.vue'

// Demo state
const loading = ref(false)
const disabled = ref(false)
const urgentCount = ref(3)
const todayBookings = ref(12)
const unassignedCount = ref(5)
const completedToday = ref(8)
const elevation = ref(2)
const selectedVariant = ref<'elevated' | 'flat' | 'tonal' | 'outlined' | 'text' | 'plain'>('elevated')

// Variant options
const variantOptions = [
  { title: 'Elevated', value: 'elevated' },
  { title: 'Flat', value: 'flat' },
  { title: 'Tonal', value: 'tonal' },
  { title: 'Outlined', value: 'outlined' },
  { title: 'Text', value: 'text' },
  { title: 'Plain', value: 'plain' }
]

// Action log
interface ActionLogEntry {
  type: string
  timestamp: Date
}

const actionLog = ref<ActionLogEntry[]>([])

// Methods
function handleAction(actionType: string) {
  actionLog.value.push({
    type: actionType,
    timestamp: new Date()
  })
  
  // Keep only last 20 actions
  if (actionLog.value.length > 20) {
    actionLog.value = actionLog.value.slice(-20)
  }
  
  console.log('Admin action triggered:', actionType)
}

function formatActionType(actionType: string): string {
  return actionType
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>

<style scoped>
.v-slider {
  margin-bottom: 8px;
}

.v-list-item {
  min-height: 40px;
}
</style> 