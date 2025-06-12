<template>
  <v-navigation-drawer class="sidebar" width="100%" elevation="3">
    <v-container class="py-2">
      <!-- Header -->
      <v-row class="mb-4">
        <v-col cols="12">
          <h2 class="text-h6 font-weight-bold">Property Cleaning</h2>
          <div class="text-subtitle-2 text-medium-emphasis">
            {{ formattedDate }}
          </div>
        </v-col>
      </v-row>

      <!-- Turn Alerts (if any) -->
      <v-row v-if="todayTurnsArray.length > 0">
        <v-col cols="12">
          <TurnAlerts 
            :bookings="todayBookingsWithMetadata" 
            :properties="propertiesMap"
            @view="$emit('navigateToBooking', $event)"
            @assign="handleAssign"
            @view-all="handleViewAll('turns')"
          />
        </v-col>
      </v-row>

      <!-- Upcoming Cleanings -->
      <v-row class="mb-4">
        <v-col cols="12">
          <UpcomingCleanings 
            :bookings="upcomingBookingsWithMetadata"
            :properties="propertiesMap"
            @view="$emit('navigateToBooking', $event)"
            @assign="handleAssign"
            @view-all="handleViewAll($event)"
            @toggle-expanded="toggleUpcomingExpanded"
          />
        </v-col>
      </v-row>

      <!-- Property Filter -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-card class="property-filter" variant="outlined">
            <v-card-title class="d-flex align-center">
              <v-icon icon="mdi-filter-variant" class="mr-2" />
              Filter by Property
            </v-card-title>
            <v-card-text>
              <v-select
                v-model="selectedProperty"
                :items="propertySelectItems"
                label="Select Property"
                clearable
                @update:model-value="handlePropertyFilterChange"
              >
                <template v-slot:prepend-item>
                  <v-list-item
                    title="All Properties"
                    value=""
                    @click="selectedProperty = null"
                  />
                  <v-divider class="mt-2" />
                </template>
              </v-select>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Quick Actions -->
      <v-row>
        <v-col cols="12">
          <v-card class="quick-actions" variant="outlined">
            <v-card-title class="d-flex align-center">
              <v-icon icon="mdi-lightning-bolt" class="mr-2" />
              Quick Actions
            </v-card-title>
            <v-card-text class="d-flex gap-2">
              <v-btn
                prepend-icon="mdi-calendar-plus"
                color="primary"
                variant="tonal"
                block
                @click="$emit('createBooking')"
              >
                New Booking
              </v-btn>
              <v-btn
                prepend-icon="mdi-home-plus"
                color="secondary"
                variant="tonal"
                block
                @click="$emit('createProperty')"
              >
                New Property
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Loading Overlay -->
      <v-overlay 
        v-show="loading"
        contained
        persistent
        class="align-center justify-center"
      >
        <v-progress-circular
          indeterminate
          color="primary"
        />
      </v-overlay>
    </v-container>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useUIStore } from '@/stores/ui';
import TurnAlerts from '@/components/dumb/TurnAlerts.vue';
import UpcomingCleanings from '@/components/dumb/UpcomingCleanings.vue';

// Import types
import type { Booking, Property, BookingWithMetadata } from '@/types';

// Import event logger
import eventLogger from '@/composables/useComponentEventLogger';

// Define props with default values
interface Props {
  todayTurns: Map<string, Booking> | Booking[];
  upcomingCleanings: Map<string, Booking> | Booking[];
  properties: Map<string, Property> | Property[];
  loading: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  todayTurns: () => [],
  upcomingCleanings: () => [],
  properties: () => [],
  loading: false
});

// Define emits
interface Emits {
  (e: 'navigateToBooking', bookingId: string): void;
  (e: 'navigateToDate', date: Date): void;
  (e: 'filterByProperty', propertyId: string | null): void;
  (e: 'createBooking'): void;
  (e: 'createProperty'): void;
}

const emit = defineEmits<Emits>();

// Store connections
const uiStore = useUIStore();

// Local state - initialize from UI store
const selectedProperty = ref<string | null>(uiStore.selectedPropertyFilter || null);

// Computed properties
const formattedDate = computed(() => {
  try {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return new Date().toISOString().split('T')[0]; // Fallback format
  }
});

// Convert inputs to proper Maps if they're not already
const todayTurnsMap = computed(() => {
  try {
    if (props.todayTurns instanceof Map) return props.todayTurns;
    
    const map = new Map<string, Booking>();
    if (Array.isArray(props.todayTurns)) {
      props.todayTurns.forEach(booking => {
        if (booking && booking.id) {
          map.set(booking.id, booking);
        }
      });
    }
    return map;
  } catch (error) {
    console.error('Error processing today\'s turns:', error);
    return new Map<string, Booking>();
  }
});

const upcomingCleaningsMap = computed(() => {
  try {
    if (props.upcomingCleanings instanceof Map) return props.upcomingCleanings;
    
    const map = new Map<string, Booking>();
    if (Array.isArray(props.upcomingCleanings)) {
      props.upcomingCleanings.forEach(booking => {
        if (booking && booking.id) {
          map.set(booking.id, booking);
        }
      });
    }
    return map;
  } catch (error) {
    console.error('Error processing upcoming cleanings:', error);
    return new Map<string, Booking>();
  }
});

const propertiesMap = computed(() => {
  try {
    if (props.properties instanceof Map) return props.properties;
    
    const map = new Map<string, Property>();
    if (Array.isArray(props.properties)) {
      props.properties.forEach(property => {
        if (property && property.id) {
          map.set(property.id, property);
        }
      });
    }
    return map;
  } catch (error) {
    console.error('Error processing properties:', error);
    return new Map<string, Property>();
  }
});

// Convert Maps to arrays for components that expect arrays
const todayTurnsArray = computed(() => 
  Array.from(todayTurnsMap.value.values())
);

const upcomingCleaningsArray = computed(() => 
  Array.from(upcomingCleaningsMap.value.values())
);

// Add metadata (priority) to bookings for the components
const todayBookingsWithMetadata = computed(() => {
  return todayTurnsArray.value.map(booking => {
    // Ensure the priority is one of the expected values: 'low' | 'normal' | 'high' | 'urgent'
    const priority: 'low' | 'normal' | 'high' | 'urgent' = 'high';
    
    return {
      ...booking,
      priority,
      property_name: propertiesMap.value.get(booking.property_id)?.name || `Property ${booking.property_id.substring(0, 8)}`,
      cleaning_window: {
        start: booking.checkout_date,
        end: booking.checkin_date,
        duration: propertiesMap.value.get(booking.property_id)?.cleaning_duration || 120
      }
    } as BookingWithMetadata;
  });
});

const upcomingBookingsWithMetadata = computed(() => {
  return upcomingCleaningsArray.value.map(booking => {
    // Ensure the priority is one of the expected values: 'low' | 'normal' | 'high' | 'urgent'
    const priority: 'low' | 'normal' | 'high' | 'urgent' = 
      booking.booking_type === 'turn' ? 'high' : 'normal';
    
    return {
      ...booking,
      priority,
      property_name: propertiesMap.value.get(booking.property_id)?.name || `Property ${booking.property_id.substring(0, 8)}`,
      cleaning_window: {
        start: booking.checkout_date,
        end: booking.checkin_date,
        duration: propertiesMap.value.get(booking.property_id)?.cleaning_duration || 120
      }
    } as BookingWithMetadata;
  });
});

// Format properties for v-select
const propertySelectItems = computed(() => {
  try {
    return Array.from(propertiesMap.value.values())
      .filter(property => property && property.id && property.name)
      .map(property => ({
        title: property.name,
        value: property.id,
      }));
  } catch (error) {
    console.error('Error creating property select items:', error);
    return [];
  }
});

// Methods
const handlePropertyFilterChange = (propertyId: string | null): void => {
  try {
    // Update UI store
    uiStore.setPropertyFilter(propertyId);
    
    // Log event
    eventLogger.logEvent(
      'Sidebar',
      'Home',
      'filterByProperty',
      propertyId,
      'emit'
    );
    
    // Emit to parent
    emit('filterByProperty', propertyId);
  } catch (error) {
    console.error('Error changing property filter:', error);
    // Could add UI notification here using the UI store
  }
};

const handleAssign = (bookingId: string): void => {
  try {
    // Log event
    eventLogger.logEvent(
      'Sidebar',
      'Home',
      'navigateToBooking',
      bookingId,
      'emit'
    );
    
    // For now, just emit navigation event
    emit('navigateToBooking', bookingId);
    // Later this could open an assignment modal
  } catch (error) {
    console.error('Error handling assign:', error);
  }
};

const handleViewAll = (period: string): void => {
  try {
    // Could navigate to a filtered view of bookings
    const today = new Date();
    let targetDate = today;
    
    if (period === 'turns') {
      // Navigate to turn bookings
      // Keep targetDate as today
    } else if (period === 'today') {
      // Navigate to today's bookings
      // Keep targetDate as today
    } else if (period === 'tomorrow') {
      // Navigate to tomorrow's bookings
      targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 1);
    } else {
      // Period could be a date string
      try {
        targetDate = new Date(period);
      } catch {
        // If not a valid date, just navigate to today
        targetDate = today;
      }
    }
    
    // Log event
    eventLogger.logEvent(
      'Sidebar',
      'Home',
      'navigateToDate',
      targetDate,
      'emit'
    );
    
    emit('navigateToDate', targetDate);
  } catch (error) {
    console.error('Error handling view all:', error);
  }
};

const toggleUpcomingExpanded = (expanded: boolean): void => {
  // This method can be used if needed
  console.log('Upcoming cleanings expanded:', expanded);
};

// Watch for changes in the UI store's property filter
watch(() => uiStore.selectedPropertyFilter, (newPropertyId) => {
  selectedProperty.value = newPropertyId;
});

// Initialize from UI store on mount
onMounted(() => {
  try {
    selectedProperty.value = uiStore.selectedPropertyFilter;
  } catch (error) {
    console.error('Error initializing selected property:', error);
    selectedProperty.value = null;
  }
});

// Override emits to log events
const origEmit = emit;
// Create wrapped emit function to log events
const emitWithLogging = ((event: string, ...args: any[]) => {
  // Log the event
  eventLogger.logEvent(
    'Sidebar',
    'Home',
    event,
    args[0],
    'emit'
  );
  
  // Call the original emit
  return origEmit(event, ...args);
}) as typeof emit;

// Replace emit with the wrapped version
// Note: This doesn't actually work directly, but illustrates the concept
// The actual logging is done in the handlers
</script>

<style scoped>
.sidebar {
  height: 100%;
  overflow-y: auto;
}

.quick-actions .v-card-text {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* Mobile optimizations */
@media (max-width: 960px) {
  .sidebar {
    width: 100% !important;
  }
}
</style> 