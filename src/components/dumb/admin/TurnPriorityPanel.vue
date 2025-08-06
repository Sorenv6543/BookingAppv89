<template>
  <v-card
    variant="outlined"
    class="turn-priority-panel"
  >
    <v-card-title class="text-subtitle-1 py-2 d-flex align-center">
      <v-icon
        class="mr-2"
        color="error"
      >
        mdi-clock-alert
      </v-icon>
      System Turn Priority Queue
      <v-spacer />
      <v-chip
        :color="getTotalUrgencyColor()"
        variant="elevated"
        size="small"
      >
        {{ urgentTurns.length }} Urgent
      </v-chip>
      <v-btn
        variant="text"
        size="small"
        :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="expanded = !expanded"
      />
    </v-card-title>
    
    <v-divider />
    
    <v-expand-transition>
      <v-card-text
        v-show="expanded"
        class="pa-0"
      >
        <!-- Summary Stats -->
        <v-container>
          <v-row>
            <v-col
              cols="12"
              md="3"
            >
              <v-card
                variant="tonal"
                color="error"
              >
                <v-card-text class="text-center py-3">
                  <div class="text-h4 font-weight-bold">
                    {{ criticalTurns.length }}
                  </div>
                  <div class="text-body-2">
                    Critical (&lt; 2 hrs)
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-card
                variant="tonal"
                color="warning"
              >
                <v-card-text class="text-center py-3">
                  <div class="text-h4 font-weight-bold">
                    {{ urgentTurns.length }}
                  </div>
                  <div class="text-body-2">
                    Urgent (&lt; 6 hrs)
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-card
                variant="tonal"
                color="info"
              >
                <v-card-text class="text-center py-3">
                  <div class="text-h4 font-weight-bold">
                    {{ unassignedTurns.length }}
                  </div>
                  <div class="text-body-2">
                    Unassigned
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-card
                variant="tonal"
                color="success"
              >
                <v-card-text class="text-center py-3">
                  <div class="text-h4 font-weight-bold">
                    ${{ estimatedRevenue.toLocaleString() }}
                  </div>
                  <div class="text-body-2">
                    Revenue at Risk
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        
        <v-divider />
        
        <!-- Filters and Controls -->
        <v-container>
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <v-select
                v-model="selectedUrgencyFilter"
                :items="urgencyFilterOptions"
                label="Urgency Level"
                variant="outlined"
                density="compact"
                clearable
                @update:model-value="handleFilterChange"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-select
                v-model="selectedStatusFilter"
                :items="statusFilterOptions"
                label="Assignment Status"
                variant="outlined"
                density="compact"
                clearable
                @update:model-value="handleFilterChange"
              />
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12">
              <div class="d-flex gap-2 flex-wrap">
                <v-btn
                  variant="outlined"
                  size="small"
                  color="primary"
                  @click="handleRefresh"
                >
                  <v-icon start>
                    mdi-refresh
                  </v-icon>
                  Refresh
                </v-btn>
                
                <v-btn
                  variant="outlined"
                  size="small"
                  color="warning"
                  :disabled="selectedTurns.length === 0"
                  @click="handleBulkAssign"
                >
                  <v-icon start>
                    mdi-account-multiple
                  </v-icon>
                  Bulk Assign ({{ selectedTurns.length }})
                </v-btn>
                
                <v-btn
                  variant="outlined"
                  size="small"
                  color="error"
                  :disabled="criticalTurns.length === 0"
                  @click="handleEscalateAll"
                >
                  <v-icon start>
                    mdi-alert-octagon
                  </v-icon>
                  Escalate Critical
                </v-btn>
                
                <v-spacer />
                
                <v-switch
                  v-model="autoRefresh"
                  color="primary"
                  density="compact"
                  hide-details
                  @update:model-value="handleAutoRefreshToggle"
                />
                <span class="text-body-2 ml-2">Auto-refresh</span>
              </div>
            </v-col>
          </v-row>
        </v-container>
        
        <v-divider />
        
        <!-- Turn List -->
        <div class="turn-list">
          <v-list
            class="pa-0"
            max-height="500"
            style="overflow-y: auto;"
          >
            <template
              v-for="(turn, index) in filteredTurns"
              :key="turn.id"
            >
              <v-list-item
                :class="getTurnItemClass(turn)"
                @click="toggleTurnSelection(turn.id)"
              >
                <template #prepend>
                  <v-checkbox
                    :model-value="selectedTurns.includes(turn.id)"
                    color="primary"
                    density="compact"
                    hide-details
                    @click.stop="toggleTurnSelection(turn.id)"
                  />
                  <v-avatar
                    :color="getUrgencyColor(turn)"
                    size="40"
                    class="ml-2"
                  >
                    <v-icon>{{ getUrgencyIcon(turn) }}</v-icon>
                  </v-avatar>
                </template>
                
                <v-list-item-title class="font-weight-medium">
                  {{ getPropertyName(turn.property_id) }}
                  <v-chip
                    :color="getUrgencyColor(turn)"
                    size="x-small"
                    class="ml-2"
                  >
                    {{ getTimeRemaining(turn) }}
                  </v-chip>
                </v-list-item-title>
                
                <v-list-item-subtitle>
                  <div class="d-flex align-center mb-1">
                    <v-icon
                      size="small"
                      class="mr-1"
                    >
                      mdi-account
                    </v-icon>
                    {{ getPropertyOwnerName(turn.owner_id) }}
                    <v-icon
                      size="small"
                      class="mx-2"
                    >
                      mdi-map-marker
                    </v-icon>
                    {{ getPropertyAddress(turn.property_id) }}
                  </div>
                  <div class="d-flex align-center">
                    <v-icon
                      size="small"
                      class="mr-1"
                    >
                      mdi-calendar-export
                    </v-icon>
                    {{ formatDateTime(turn.guest_departure_date) }}
                    <v-icon
                      size="small"
                      class="mx-2"
                    >
                      mdi-calendar-import
                    </v-icon>
                    {{ formatDateTime(turn.guest_arrival_date) }}
                  </div>
                </v-list-item-subtitle>
                
                <template #append>
                  <div class="d-flex flex-column align-end">
                    <!-- Assignment Status -->
                    <div class="mb-2">
                      <v-chip
                        v-if="turn.assigned_cleaner_id"
                        color="success"
                        size="small"
                        variant="tonal"
                      >
                        <v-icon start>
                          mdi-account-check
                        </v-icon>
                        {{ getCleanerName(turn.assigned_cleaner_id) }}
                      </v-chip>
                      <v-chip
                        v-else
                        color="error"
                        size="small"
                        variant="tonal"
                      >
                        <v-icon start>
                          mdi-account-alert
                        </v-icon>
                        Unassigned
                      </v-chip>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="d-flex gap-1">
                      <v-btn
                        v-if="!turn.assigned_cleaner_id"
                        variant="outlined"
                        size="x-small"
                        color="primary"
                        @click.stop="handleAssignCleaner(turn.id)"
                      >
                        <v-icon>mdi-account-plus</v-icon>
                      </v-btn>
                      
                      <v-btn
                        variant="outlined"
                        size="x-small"
                        color="info"
                        @click.stop="handleViewDetails(turn.id)"
                      >
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                      
                      <v-btn
                        v-if="getUrgencyLevel(turn) === 'critical'"
                        variant="outlined"
                        size="x-small"
                        color="error"
                        @click.stop="handleEscalate(turn.id)"
                      >
                        <v-icon>mdi-alert</v-icon>
                      </v-btn>
                    </div>
                  </div>
                </template>
              </v-list-item>
              
              <v-divider v-if="index < filteredTurns.length - 1" />
            </template>
            
            <!-- Empty State -->
            <v-list-item v-if="filteredTurns.length === 0">
              <v-list-item-title class="text-center text-medium-emphasis py-8">
                <v-icon
                  size="64"
                  class="mb-4"
                >
                  mdi-check-circle
                </v-icon>
                <div class="text-h6">
                  No Urgent Turns
                </div>
                <div class="text-body-2">
                  All turn bookings are under control
                </div>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </div>
        
        <!-- Business Impact Alert -->
        <v-container v-if="showBusinessImpactAlert">
          <v-alert
            :type="businessImpactAlert.type"
            variant="tonal"
            :title="businessImpactAlert.title"
            class="mb-0"
          >
            <p
              v-for="message in businessImpactAlert.messages"
              :key="message"
              class="mb-1"
            >
              {{ message }}
            </p>
          </v-alert>
        </v-container>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { Booking } from '@/types/booking'
import type { Property } from '@/types/property'
import type { Cleaner } from '@/types/user'
import { safeDepartureDate } from '@/utils/typeHelpers'

// Props
interface Props {
  turns: Booking[]
  properties: Property[]
  cleaners: Cleaner[]
  propertyOwners: Array<{ id: string; name: string }>
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

// Emits
interface Emits {
  'assign-cleaner': [turnId: string]
  'view-details': [turnId: string]
  'escalate': [turnId: string]
  'bulk-assign': [turnIds: string[]]
  'escalate-all': [turnIds: string[]]
  'refresh': []
}

const emit = defineEmits<Emits>()

// State
const expanded = ref(true)
const selectedTurns = ref<string[]>([])
const selectedUrgencyFilter = ref<string>('')
const selectedStatusFilter = ref<string>('')
const autoRefresh = ref(true)
const refreshInterval = ref<ReturnType<typeof setInterval> | null>(null)

// Computed properties
const urgentTurns = computed(() => {
  return props.turns.filter(turn => {
    const urgency = getUrgencyLevel(turn)
    return urgency === 'urgent' || urgency === 'critical'
  })
})

const criticalTurns = computed(() => {
  return props.turns.filter(turn => getUrgencyLevel(turn) === 'critical')
})

const unassignedTurns = computed(() => {
  return props.turns.filter(turn => !turn.assigned_cleaner_id)
})

const estimatedRevenue = computed(() => {
  // Mock calculation - would be based on property pricing
  return urgentTurns.value.length * 150 // $150 average per turn
})

const filteredTurns = computed(() => {
  let filtered = [...props.turns]
  
  // Filter by urgency
  if (selectedUrgencyFilter.value) {
    filtered = filtered.filter(turn => 
      getUrgencyLevel(turn) === selectedUrgencyFilter.value
    )
  }
  
  // Filter by assignment status
  if (selectedStatusFilter.value) {
    if (selectedStatusFilter.value === 'assigned') {
      filtered = filtered.filter(turn => turn.assigned_cleaner_id)
    } else if (selectedStatusFilter.value === 'unassigned') {
      filtered = filtered.filter(turn => !turn.assigned_cleaner_id)
    }
  }
  
  // Sort by urgency and time remaining
  return filtered.sort((a, b) => {
    const aUrgency = getUrgencyLevel(a)
    const bUrgency = getUrgencyLevel(b)
    
    if (aUrgency === 'critical' && bUrgency !== 'critical') return -1
    if (bUrgency === 'critical' && aUrgency !== 'critical') return 1
    
    // Sort by checkout time (earliest first)
    return safeDepartureDate(a).getTime() - safeDepartureDate(b).getTime()
  })
})

const showBusinessImpactAlert = computed(() => {
  return businessImpactAlert.value.messages.length > 0
})

const businessImpactAlert = computed(() => {
  const alert = {
    type: 'info' as 'info' | 'warning' | 'error',
    title: '',
    messages: [] as string[]
  }

  if (criticalTurns.value.length > 0) {
    alert.type = 'error'
    alert.title = 'Critical Business Impact'
    alert.messages.push(`${criticalTurns.value.length} critical turns require immediate attention`)
    alert.messages.push('Client satisfaction and revenue at high risk')
  } else if (unassignedTurns.value.length > 3) {
    alert.type = 'warning'
    alert.title = 'High Unassigned Turn Volume'
    alert.messages.push(`${unassignedTurns.value.length} turns need cleaner assignment`)
    alert.messages.push('Consider activating additional cleaning staff')
  }

  return alert
})

// Filter options
const urgencyFilterOptions = [
  { title: 'Critical (< 2 hours)', value: 'critical' },
  { title: 'Urgent (< 6 hours)', value: 'urgent' },
  { title: 'Standard', value: 'standard' }
]

const statusFilterOptions = [
  { title: 'Assigned', value: 'assigned' },
  { title: 'Unassigned', value: 'unassigned' }
]

// Methods
const getUrgencyLevel = (turn: Booking): 'critical' | 'urgent' | 'standard' => {
  const now = new Date()
  const checkoutTime = safeDepartureDate(turn)
  const hoursUntil = (checkoutTime.getTime() - now.getTime()) / (1000 * 60 * 60)
  
  if (hoursUntil <= 2) return 'critical'
  if (hoursUntil <= 6) return 'urgent'
  return 'standard'
}

const getUrgencyColor = (turn: Booking) => {
  const urgency = getUrgencyLevel(turn)
  const colors = {
    critical: 'error',
    urgent: 'warning',
    standard: 'info'
  }
  return colors[urgency]
}

const getUrgencyIcon = (turn: Booking) => {
  const urgency = getUrgencyLevel(turn)
  const icons = {
    critical: 'mdi-alert-octagon',
    urgent: 'mdi-clock-alert',
    standard: 'mdi-clock'
  }
  return icons[urgency]
}

const getTotalUrgencyColor = () => {
  if (criticalTurns.value.length > 0) return 'error'
  if (urgentTurns.value.length > 0) return 'warning'
  return 'success'
}

const getTurnItemClass = (turn: Booking) => {
  const urgency = getUrgencyLevel(turn)
  const classes = ['turn-item']
  
  if (urgency === 'critical') classes.push('turn-critical')
  else if (urgency === 'urgent') classes.push('turn-urgent')
  
  if (selectedTurns.value.includes(turn.id)) classes.push('turn-selected')
  
  return classes.join(' ')
}

const getTimeRemaining = (turn: Booking) => {
  const now = new Date()
  const checkoutTime = safeDepartureDate(turn)
  const diffMs = checkoutTime.getTime() - now.getTime()
  
  if (diffMs <= 0) return 'OVERDUE'
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours === 0) return `${minutes}m`
  if (hours < 24) return `${hours}h ${minutes}m`
  
  const days = Math.floor(hours / 24)
  return `${days}d ${hours % 24}h`
}

const formatDateTime = (dateTime: string) => {
  const date = new Date(dateTime)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

const getPropertyName = (propertyId: string) => {
  const property = props.properties.find(p => p.id === propertyId)
  return property?.name || 'Unknown Property'
}

const getPropertyAddress = (propertyId: string) => {
  const property = props.properties.find(p => p.id === propertyId)
  return property?.address || 'Unknown Address'
}

const getPropertyOwnerName = (ownerId: string) => {
  const owner = props.propertyOwners.find(o => o.id === ownerId)
  return owner?.name || `Owner ${ownerId.slice(-4)}`
}

const getCleanerName = (cleanerId: string) => {
  const cleaner = props.cleaners.find(c => c.id === cleanerId)
  return cleaner?.name || 'Unknown Cleaner'
}

const toggleTurnSelection = (turnId: string) => {
  const index = selectedTurns.value.indexOf(turnId)
  if (index > -1) {
    selectedTurns.value.splice(index, 1)
  } else {
    selectedTurns.value.push(turnId)
  }
}

const handleFilterChange = () => {
  // Filters are reactive, no additional action needed
}

const handleRefresh = () => {
  emit('refresh')
}

const handleAssignCleaner = (turnId: string) => {
  emit('assign-cleaner', turnId)
}

const handleViewDetails = (turnId: string) => {
  emit('view-details', turnId)
}

const handleEscalate = (turnId: string) => {
  emit('escalate', turnId)
}

const handleBulkAssign = () => {
  if (selectedTurns.value.length > 0) {
    emit('bulk-assign', [...selectedTurns.value])
  }
}

const handleEscalateAll = () => {
  const criticalIds = criticalTurns.value.map(turn => turn.id)
  if (criticalIds.length > 0) {
    emit('escalate-all', criticalIds)
  }
}

const handleAutoRefreshToggle = (enabled: boolean | null) => {
  if (enabled) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
}

const startAutoRefresh = () => {
  if (refreshInterval.value) return
  
  refreshInterval.value = setInterval(() => {
    emit('refresh')
  }, 30000) // Refresh every 30 seconds
}

const stopAutoRefresh = () => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
    refreshInterval.value = null
  }
}

// Lifecycle
onMounted(() => {
  if (autoRefresh.value) {
    startAutoRefresh()
  }
})

onUnmounted(() => {
  stopAutoRefresh()
})

// Watch for auto-refresh changes
watch(autoRefresh, (enabled) => {
  if (enabled) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
})
</script>

<style scoped>
.turn-priority-panel {
  position: sticky;
  top: 0;
  z-index: 5;
}

.v-card-title {
  background-color: rgb(var(--v-theme-surface-variant));
}

.turn-list {
  max-height: 500px;
  overflow-y: auto;
}

.turn-item {
  transition: all 0.2s ease;
}

.turn-critical {
  border-left: 4px solid rgb(var(--v-theme-error));
  background-color: rgb(var(--v-theme-error), 0.05);
}

.turn-urgent {
  border-left: 4px solid rgb(var(--v-theme-warning));
  background-color: rgb(var(--v-theme-warning), 0.05);
}

.turn-selected {
  background-color: rgb(var(--v-theme-primary), 0.1);
}

.turn-item:hover {
  background-color: rgb(var(--v-theme-surface-variant), 0.5);
}
 



</style>