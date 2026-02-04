<template>
  <v-card
    variant="outlined"
    class="admin-calendar-controls"
  >
    <v-card-title class="text-subtitle-1 py-2 d-flex align-center">
      <v-icon class="mr-2">
        mdi-calendar-clock
      </v-icon>
      Calendar Controls
      <v-spacer />
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
        <v-container>
          <!-- View Controls -->
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <div class="text-body-2 text-medium-emphasis mb-2">
                Calendar View
              </div>
              <v-btn-toggle
                v-model="selectedView"
                variant="outlined"
                divided
                mandatory
                @update:model-value="handleViewChange"
              >
                <v-btn
                  value="dayGridMonth"
                  size="small"
                >
                  <v-icon start>
                    mdi-calendar-month
                  </v-icon>
                  Month
                </v-btn>
                <v-btn
                  value="timeGridWeek"
                  size="small"
                >
                  <v-icon start>
                    mdi-calendar-week
                  </v-icon>
                  Week
                </v-btn>
                <v-btn
                  value="timeGridDay"
                  size="small"
                >
                  <v-icon start>
                    mdi-calendar-today
                  </v-icon>
                  Day
                </v-btn>
                <v-btn
                  value="listWeek"
                  size="small"
                >
                  <v-icon start>
                    mdi-format-list-bulleted
                  </v-icon>
                  Agenda
                </v-btn>
              </v-btn-toggle>
            </v-col>
            
            <v-col
              cols="12"
              md="6"
            >
              <div class="text-body-2 text-medium-emphasis mb-2">
                Date Navigation
              </div>
              <div class="d-flex gap-2 align-center">
                <v-btn
                  variant="outlined"
                  size="small"
                  @click="handlePrevious"
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                
                <v-btn
                  variant="outlined"
                  size="small"
                  @click="handleToday"
                >
                  Today
                </v-btn>
                
                <v-btn
                  variant="outlined"
                  size="small"
                  @click="handleNext"
                >
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
                
                <v-spacer />
                
                <v-text-field
                  v-model="selectedDate"
                  type="date"
                  variant="outlined"
                  density="compact"
                  hide-details
                  style="max-width: 150px;"
                  @update:model-value="handleDateChange"
                />
              </div>
            </v-col>
          </v-row>
          
          <v-divider class="my-4" />
          
          <!-- Filters -->
          <v-row>
            <v-col
              cols="12"
              md="3"
            >
              <v-select
                v-model="filters.status"
                :items="statusOptions"
                label="Status Filter"
                variant="outlined"
                density="compact"
                clearable
                multiple
                chips
                @update:model-value="handleFilterChange"
              >
                <template #chip="{ props: chipProps, item }">
                  <v-chip
                    v-bind="chipProps"
                    :color="getStatusColor(item.value)"
                    size="small"
                  >
                    {{ item.title }}
                  </v-chip>
                </template>
              </v-select>
            </v-col>
            
            <v-col
              cols="12"
              md="3"
            >
              <v-select
                v-model="filters.cleaner"
                :items="cleanerOptions"
                label="Cleaner Filter"
                variant="outlined"
                density="compact"
                clearable
                multiple
                chips
                @update:model-value="handleFilterChange"
              >
                <template #item="{ props: itemProps, item }">
                  <v-list-item v-bind="itemProps">
                    <template #prepend>
                      <v-avatar
                        :color="getCleanerColor(item.value)"
                        size="small"
                      >
                        <v-icon>mdi-account</v-icon>
                      </v-avatar>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
            
            <v-col
              cols="12"
              md="3"
            >
              <v-select
                v-model="filters.bookingType"
                :items="bookingTypeOptions"
                label="Booking Type"
                variant="outlined"
                density="compact"
                clearable
                multiple
                chips
                @update:model-value="handleFilterChange"
              >
                <template #chip="{ props: chipProps, item }">
                  <v-chip
                    v-bind="chipProps"
                    :color="item.value === 'turn' ? 'error' : 'primary'"
                    size="small"
                  >
                    {{ item.title }}
                  </v-chip>
                </template>
              </v-select>
            </v-col>
            
            <v-col
              cols="12"
              md="3"
            >
              <v-select
                v-model="filters.propertyOwner"
                :items="propertyOwnerOptions"
                label="Property Owner"
                variant="outlined"
                density="compact"
                clearable
                multiple
                chips
                @update:model-value="handleFilterChange"
              />
            </v-col>
          </v-row>
          
          <!-- Advanced Filters -->
          <v-row v-if="showAdvancedFilters">
            <v-col
              cols="12"
              md="4"
            >
              <v-select
                v-model="filters.priority"
                :items="priorityOptions"
                label="Priority Level"
                variant="outlined"
                density="compact"
                clearable
                multiple
                chips
                @update:model-value="handleFilterChange"
              >
                <template #chip="{ props: chipProps, item }">
                  <v-chip
                    v-bind="chipProps"
                    :color="getPriorityColor(item.value)"
                    size="small"
                  >
                    {{ item.title }}
                  </v-chip>
                </template>
              </v-select>
            </v-col>
            
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="filters.dateRange.start"
                label="Start Date"
                type="date"
                variant="outlined"
                density="compact"
                @update:model-value="handleFilterChange"
              />
            </v-col>
            
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="filters.dateRange.end"
                label="End Date"
                type="date"
                variant="outlined"
                density="compact"
                @update:model-value="handleFilterChange"
              />
            </v-col>
          </v-row>
          
          <v-divider class="my-4" />
          
          <!-- Action Controls -->
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <div class="text-body-2 text-medium-emphasis mb-2">
                Quick Actions
              </div>
              <div class="d-flex flex-wrap gap-2">
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
                  color="success"
                  @click="handleExport"
                >
                  <v-icon start>
                    mdi-download
                  </v-icon>
                  Export
                </v-btn>
                
                <v-btn
                  variant="outlined"
                  size="small"
                  color="info"
                  @click="handlePrint"
                >
                  <v-icon start>
                    mdi-printer
                  </v-icon>
                  Print
                </v-btn>
                
                <v-btn
                  variant="text"
                  size="small"
                  @click="showAdvancedFilters = !showAdvancedFilters"
                >
                  <v-icon start>
                    {{ showAdvancedFilters ? 'mdi-filter-minus' : 'mdi-filter-plus' }}
                  </v-icon>
                  {{ showAdvancedFilters ? 'Less' : 'More' }} Filters
                </v-btn>
              </div>
            </v-col>
            
            <v-col
              cols="12"
              md="6"
            >
              <div class="text-body-2 text-medium-emphasis mb-2">
                Bulk Operations
              </div>
              <div class="d-flex flex-wrap gap-2">
                <v-btn
                  variant="outlined"
                  size="small"
                  color="warning"
                  :disabled="!hasSelectedBookings"
                  @click="handleBulkAssign"
                >
                  <v-icon start>
                    mdi-account-multiple
                  </v-icon>
                  Bulk Assign
                </v-btn>
                
                <v-btn
                  variant="outlined"
                  size="small"
                  color="info"
                  :disabled="!hasSelectedBookings"
                  @click="handleBulkStatusUpdate"
                >
                  <v-icon start>
                    mdi-clipboard-list
                  </v-icon>
                  Update Status
                </v-btn>
                
                <v-btn
                  variant="outlined"
                  size="small"
                  color="error"
                  :disabled="!hasSelectedBookings"
                  @click="handleBulkDelete"
                >
                  <v-icon start>
                    mdi-delete-multiple
                  </v-icon>
                  Bulk Delete
                </v-btn>
              </div>
            </v-col>
          </v-row>
          
          <!-- Real-time Updates -->
          <v-row>
            <v-col cols="12">
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-switch
                    v-model="realTimeUpdates"
                    color="primary"
                    density="compact"
                    hide-details
                    @update:model-value="handleRealTimeToggle"
                  />
                  <span class="text-body-2 ml-2">Real-time Updates</span>
                </div>
                
                <div class="text-caption text-medium-emphasis">
                  Last updated: {{ lastUpdated }}
                </div>
              </div>
            </v-col>
          </v-row>
          
          <!-- Filter Summary -->
          <v-row v-if="hasActiveFilters">
            <v-col cols="12">
              <v-card
                variant="tonal"
                color="info"
              >
                <v-card-text class="py-2">
                  <div class="d-flex align-center">
                    <v-icon class="mr-2">
                      mdi-filter
                    </v-icon>
                    <span class="text-body-2">Active Filters:</span>
                    <div class="d-flex flex-wrap gap-1 ml-2">
                      <v-chip
                        v-for="filter in activeFilterSummary"
                        :key="filter.key"
                        size="x-small"
                        variant="outlined"
                        closable
                        @click:close="clearFilter(filter.key)"
                      >
                        {{ filter.label }}
                      </v-chip>
                    </div>
                    <v-spacer />
                    <v-btn
                      variant="text"
                      size="small"
                      @click="clearAllFilters"
                    >
                      Clear All
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Cleaner } from '@/types/user'

// Props
interface Props {
  currentView: string
  currentDate: string
  selectedBookings: string[]
  cleaners: Cleaner[]
  propertyOwners: Array<{ id: string; name: string }>
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

// Emits
interface Emits {
  'view-change': [view: string]
  'date-change': [date: string]
  'navigate': [direction: 'prev' | 'next' | 'today']
  'filter-change': [filters: CalendarFilters]
  'refresh': []
  'export': [format: string]
  'print': []
  'bulk-assign': []
  'bulk-status-update': []
  'bulk-delete': []
  'real-time-toggle': [enabled: boolean | null]
}

const emit = defineEmits<Emits>()

// Types
interface CalendarFilters {
  status: string[]
  cleaner: string[]
  bookingType: string[]
  propertyOwner: string[]
  priority: string[]
  dateRange: {
    start: string
    end: string
  }
}

// State
const expanded = ref(true)
const showAdvancedFilters = ref(false)
const realTimeUpdates = ref(true)
const selectedView = ref(props.currentView)
const selectedDate = ref(props.currentDate)

const filters = ref<CalendarFilters>({
  status: [],
  cleaner: [],
  bookingType: [],
  propertyOwner: [],
  priority: [],
  dateRange: {
    start: '',
    end: ''
  }
})

// Computed properties
const hasSelectedBookings = computed(() => {
  return props.selectedBookings.length > 0
})

const hasActiveFilters = computed(() => {
  return filters.value.status.length > 0 ||
         filters.value.cleaner.length > 0 ||
         filters.value.bookingType.length > 0 ||
         filters.value.propertyOwner.length > 0 ||
         filters.value.priority.length > 0 ||
         filters.value.dateRange.start ||
         filters.value.dateRange.end
})

const activeFilterSummary = computed(() => {
  const summary = []
  
  if (filters.value.status.length > 0) {
    summary.push({ key: 'status', label: `Status: ${filters.value.status.length} selected` })
  }
  if (filters.value.cleaner.length > 0) {
    summary.push({ key: 'cleaner', label: `Cleaners: ${filters.value.cleaner.length} selected` })
  }
  if (filters.value.bookingType.length > 0) {
    summary.push({ key: 'bookingType', label: `Types: ${filters.value.bookingType.length} selected` })
  }
  if (filters.value.propertyOwner.length > 0) {
    summary.push({ key: 'propertyOwner', label: `Owners: ${filters.value.propertyOwner.length} selected` })
  }
  if (filters.value.priority.length > 0) {
    summary.push({ key: 'priority', label: `Priority: ${filters.value.priority.length} selected` })
  }
  if (filters.value.dateRange.start || filters.value.dateRange.end) {
    summary.push({ key: 'dateRange', label: 'Date Range Set' })
  }
  
  return summary
})

const lastUpdated = computed(() => {
  return new Date().toLocaleTimeString()
})

// Options
const statusOptions = [
  { title: 'Pending', value: 'pending' },
  { title: 'Scheduled', value: 'scheduled' },
  { title: 'In Progress', value: 'in_progress' },
  { title: 'Completed', value: 'completed' },
  { title: 'Cancelled', value: 'cancelled' }
]

const bookingTypeOptions = [
  { title: 'Standard Cleaning', value: 'standard' },
  { title: 'Turn Cleaning', value: 'turn' }
]

const priorityOptions = [
  { title: 'Standard', value: 'standard' },
  { title: 'High', value: 'high' },
  { title: 'Urgent', value: 'urgent' }
]

const cleanerOptions = computed(() => {
  return props.cleaners.map(cleaner => ({
    title: cleaner.name,
    value: cleaner.id
  }))
})

const propertyOwnerOptions = computed(() => {
  return props.propertyOwners.map(owner => ({
    title: owner.name,
    value: owner.id
  }))
})

// Methods
const handleViewChange = (view: string) => {
  emit('view-change', view)
}

const handleDateChange = (date: string) => {
  emit('date-change', date)
}

const handlePrevious = () => {
  emit('navigate', 'prev')
}

const handleNext = () => {
  emit('navigate', 'next')
}

const handleToday = () => {
  emit('navigate', 'today')
}

const handleFilterChange = () => {
  emit('filter-change', { ...filters.value })
}

const handleRefresh = () => {
  emit('refresh')
}

const handleExport = () => {
  emit('export', 'csv')
}

const handlePrint = () => {
  emit('print')
}

const handleBulkAssign = () => {
  emit('bulk-assign')
}

const handleBulkStatusUpdate = () => {
  emit('bulk-status-update')
}

const handleBulkDelete = () => {
  emit('bulk-delete')
}

const handleRealTimeToggle = (enabled: boolean | null) => {
  emit('real-time-toggle', enabled)
}

const clearFilter = (filterKey: string) => {
  switch (filterKey) {
    case 'status':
      filters.value.status = []
      break
    case 'cleaner':
      filters.value.cleaner = []
      break
    case 'bookingType':
      filters.value.bookingType = []
      break
    case 'propertyOwner':
      filters.value.propertyOwner = []
      break
    case 'priority':
      filters.value.priority = []
      break
    case 'dateRange':
      filters.value.dateRange = { start: '', end: '' }
      break
  }
  handleFilterChange()
}

const clearAllFilters = () => {
  filters.value = {
    status: [],
    cleaner: [],
    bookingType: [],
    propertyOwner: [],
    priority: [],
    dateRange: { start: '', end: '' }
  }
  handleFilterChange()
}

const getStatusColor = (status: string) => {
  const colors = {
    pending: 'orange',
    scheduled: 'blue',
    in_progress: 'purple',
    completed: 'green',
    cancelled: 'red'
  }
  return colors[status as keyof typeof colors] || 'grey'
}

const getPriorityColor = (priority: string) => {
  const colors = {
    standard: 'grey',
    high: 'orange',
    urgent: 'red'
  }
  return colors[priority as keyof typeof colors] || 'grey'
}

const getCleanerColor = (cleanerId: string) => {
  // Generate consistent color based on cleaner ID
  const colors = ['primary', 'secondary', 'success', 'info', 'warning']
  const index = cleanerId.length % colors.length
  return colors[index]
}

// Watch for prop changes
watch(() => props.currentView, (newView) => {
  selectedView.value = newView
})

watch(() => props.currentDate, (newDate) => {
  selectedDate.value = newDate
})
</script>

<style scoped>
.admin-calendar-controls {
  position: sticky;
  top: 0;
  z-index: 10;
}

.v-card-title {
  background-color: rgb(var(--v-theme-surface-variant));
}

.v-btn-toggle { 
  width: 100%;
}

.v-btn-toggle .v-btn {
  flex: 1;
}
</style>