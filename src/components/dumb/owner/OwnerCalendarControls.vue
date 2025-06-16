<template>
  <v-card
    class="owner-calendar-controls"
    :elevation="elevation"
    :variant="variant"
  >
    <v-card-text class="pa-3">
      <v-container fluid class="pa-0">
        <!-- Main Controls Row -->
        <v-row align="center" class="mb-2">
          <!-- Navigation Controls -->
          <v-col cols="auto">
            <v-btn-group
              variant="outlined"
              density="comfortable"
            >
              <v-btn
                :disabled="loading"
                @click="handleNavigation('prev')"
              >
                <v-icon>mdi-chevron-left</v-icon>
                <span class="d-none d-sm-inline ml-1">Previous</span>
              </v-btn>
              
              <v-btn
                :disabled="loading"
                @click="handleNavigation('today')"
              >
                <v-icon>mdi-calendar-today</v-icon>
                <span class="d-none d-sm-inline ml-1">Today</span>
              </v-btn>
              
              <v-btn
                :disabled="loading"
                @click="handleNavigation('next')"
              >
                <span class="d-none d-sm-inline mr-1">Next</span>
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-btn-group>
          </v-col>
          
          <v-spacer />
          
          <!-- Current Date Display -->
          <v-col cols="auto" class="text-center">
            <div class="text-h6 font-weight-medium">
              {{ currentDateDisplay }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ currentDateSubtitle }}
            </div>
          </v-col>
          
          <v-spacer />
          
          <!-- View Controls -->
          <v-col cols="auto">
            <v-btn-group
              v-model="selectedView"
              variant="outlined"
              density="comfortable"
              mandatory
            >
              <v-btn
                value="dayGridMonth"
                :disabled="loading"
                @click="handleViewChange('dayGridMonth')"
              >
                <v-icon>mdi-calendar-month</v-icon>
                <span class="d-none d-md-inline ml-1">Month</span>
              </v-btn>
              
              <v-btn
                value="timeGridWeek"
                :disabled="loading"
                @click="handleViewChange('timeGridWeek')"
              >
                <v-icon>mdi-calendar-week</v-icon>
                <span class="d-none d-md-inline ml-1">Week</span>
              </v-btn>
              
              <v-btn
                value="timeGridDay"
                :disabled="loading"
                @click="handleViewChange('timeGridDay')"
              >
                <v-icon>mdi-calendar</v-icon>
                <span class="d-none d-md-inline ml-1">Day</span>
              </v-btn>
            </v-btn-group>
          </v-col>
        </v-row>
        
        <!-- Secondary Controls Row (Mobile/Tablet) -->
        <v-row v-if="showSecondaryControls" class="mt-2">
          <!-- Property Filter -->
          <v-col
            cols="12"
            sm="6"
            md="4"
          >
            <v-select
              v-model="selectedProperty"
              :items="propertyFilterItems"
              label="Filter by Property"
              variant="outlined"
              density="compact"
              :disabled="loading"
              prepend-inner-icon="mdi-home"
              @update:model-value="handlePropertyFilter"
            />
          </v-col>
          
          <!-- Booking Type Filter -->
          <v-col
            cols="12"
            sm="6"
            md="4"
          >
            <v-select
              v-model="selectedBookingType"
              :items="bookingTypeFilterItems"
              label="Filter by Type"
              variant="outlined"
              density="compact"
              :disabled="loading"
              prepend-inner-icon="mdi-filter"
              @update:model-value="handleBookingTypeFilter"
            />
          </v-col>
          
          <!-- Quick Actions -->
          <v-col
            cols="12"
            md="4"
          >
            <v-btn
              color="primary"
              variant="elevated"
              block
              :disabled="loading"
              @click="handleQuickAction('add-booking')"
            >
              <v-icon class="mr-2">mdi-plus</v-icon>
              Schedule Cleaning
            </v-btn>
          </v-col>
        </v-row>
        
        <!-- Toggle Secondary Controls (Mobile) -->
        <v-row v-if="!showSecondaryControls" class="mt-2">
          <v-col cols="12">
            <v-btn
              variant="text"
              size="small"
              block
              @click="showSecondaryControls = true"
            >
              <v-icon class="mr-1">mdi-tune</v-icon>
              Show Filters & Options
            </v-btn>
          </v-col>
        </v-row>
        
        <!-- Hide Secondary Controls -->
        <v-row v-else class="mt-1">
          <v-col cols="12">
            <v-btn
              variant="text"
              size="small"
              block
              @click="showSecondaryControls = false"
            >
              <v-icon class="mr-1">mdi-chevron-up</v-icon>
              Hide Filters & Options
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Props
interface Props {
  currentDate?: Date
  view?: CalendarView
  properties?: PropertyOption[]
  loading?: boolean
  elevation?: number
  variant?: 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text' | 'plain'
}

const props = withDefaults(defineProps<Props>(), {
  currentDate: () => new Date(),
  view: 'dayGridMonth',
  properties: () => [],
  loading: false,
  elevation: 1,
  variant: 'outlined'
})

// Emits
interface Emits {
  (e: 'navigation', direction: NavigationDirection): void
  (e: 'view-change', view: CalendarView): void
  (e: 'property-filter', propertyId: string | null): void
  (e: 'booking-type-filter', bookingType: BookingTypeFilter): void
  (e: 'quick-action', action: QuickAction): void
}

const emit = defineEmits<Emits>()

// Types
type CalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'
type NavigationDirection = 'prev' | 'next' | 'today'
type BookingTypeFilter = 'all' | 'standard' | 'turn'
type QuickAction = 'add-booking'

interface PropertyOption {
  id: string
  name: string
}

// Reactive data
const selectedView = ref<CalendarView>(props.view)
const selectedProperty = ref<string | null>(null)
const selectedBookingType = ref<BookingTypeFilter>('all')
const showSecondaryControls = ref(false)

// Computed properties
const currentDateDisplay = computed(() => {
  const date = props.currentDate
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long'
  }
  
  if (selectedView.value === 'timeGridWeek') {
    // For week view, show week range
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    
    if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
      return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${startOfWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
    } else {
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    }
  } else if (selectedView.value === 'timeGridDay') {
    // For day view, show full date
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  } else {
    // For month view, show month and year
    return date.toLocaleDateString('en-US', options)
  }
})

const currentDateSubtitle = computed(() => {
  if (selectedView.value === 'dayGridMonth') {
    return 'Month View'
  } else if (selectedView.value === 'timeGridWeek') {
    return 'Week View'
  } else {
    return 'Day View'
  }
})

const propertyFilterItems = computed(() => {
  const items: { title: string; value: string | null }[] = [
    { title: 'All Properties', value: null }
  ]
  
  props.properties.forEach(property => {
    items.push({
      title: property.name,
      value: property.id
    })
  })
  
  return items
})

const bookingTypeFilterItems = [
  { title: 'All Bookings', value: 'all' },
  { title: 'Standard Cleanings', value: 'standard' },
  { title: 'Same-Day Turns', value: 'turn' }
]

// Methods
const handleNavigation = (direction: NavigationDirection) => {
  emit('navigation', direction)
}

const handleViewChange = (view: CalendarView) => {
  selectedView.value = view
  emit('view-change', view)
}

const handlePropertyFilter = (propertyId: string | null) => {
  emit('property-filter', propertyId)
}

const handleBookingTypeFilter = (bookingType: BookingTypeFilter) => {
  emit('booking-type-filter', bookingType)
}

const handleQuickAction = (action: QuickAction) => {
  emit('quick-action', action)
}
</script>

<style scoped>
.owner-calendar-controls {
  width: 100%;
}

/* Ensure consistent button group styling */
.v-btn-group .v-btn {
  min-height: 40px;
}

/* Mobile optimizations */
@media (max-width: 600px) {
  .v-btn-group .v-btn {
    min-height: 36px;
    padding: 0 8px;
  }
  
  .v-btn-group .v-btn .v-icon {
    font-size: 1.1rem;
  }
  
  .text-h6 {
    font-size: 1.1rem !important;
  }
}

/* Tablet optimizations */
@media (min-width: 601px) and (max-width: 960px) {
  .v-btn-group .v-btn {
    min-height: 42px;
  }
}

/* Ensure proper spacing */
.v-btn-group {
  box-shadow: none;
}

.v-btn-group .v-btn:not(:last-child) {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style> 