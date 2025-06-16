<template>
  <v-navigation-drawer
    class="owner-sidebar"
    width="100%"
    :elevation="80"
    color="tertiary"

  >                                   
    <v-container class="py-2">
      <!-- Header with Owner-specific info -->
      <v-row class="mb-4">
        <v-col cols="12">
          <h2 class="text-h6 font-weight-bold">
            My Properties
          </h2>
          <div class="text-subtitle-2 text-medium-emphasis">
            {{ formattedDate }}
          </div>
          <!-- Owner-specific metrics -->
          <div class="text-caption text-medium-emphasis mt-1">
            {{ ownerPropertiesCount }} properties • {{ ownerBookingsCount }} bookings
          </div>
        </v-col>
      </v-row>

      <!-- Turn Alerts (owner's turns only) -->
      <v-row v-if="ownerTodayTurnsArray.length > 0">
        <v-col cols="12">
          <TurnAlerts 
            :bookings="ownerTodayBookingsWithMetadata" 
            :properties="ownerPropertiesMap"
            @view="$emit('navigateToBooking', $event)"
            @assign="handleViewBooking"
            @view-all="handleViewAll('turns')"
          />
        </v-col>
      </v-row>

      <!-- Upcoming Cleanings (owner's cleanings only) -->
      <v-row class="mb-4">
        <v-col cols="12">
          <UpcomingCleanings 
            :bookings="ownerUpcomingBookingsWithMetadata"
            :properties="ownerPropertiesMap"
            @view="$emit('navigateToBooking', $event)"
            @assign="handleViewBooking"
            @view-all="handleViewAll($event)"
            @toggle-expanded="toggleUpcomingExpanded"
          />
        </v-col>
      </v-row>

      <!-- Property Filter (owner's properties only) -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-card
            class="property-filter"
            variant="outlined"
          >
            <v-card-title class="d-flex align-center">
              <v-icon
                icon="mdi-filter-variant"
                class="mr-2"
              />
              Filter My Properties
            </v-card-title>
            <v-card-text>
              <v-select
                v-model="selectedProperty"
                :items="ownerPropertySelectItems"
                label="Select Property"
                clearable
                @update:model-value="handlePropertyFilterChange"
              >
                <template #prepend-item>
                  <v-list-item
                    title="All My Properties"
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

      <!-- Quick Actions (owner-specific) -->
      <v-row>
        <v-col cols="12">
          <v-card
            class="quick-actions"
            variant="outlined"
          >
            <v-card-title class="d-flex align-center">
              <v-icon
                icon="mdi-lightning-bolt"
                class="mr-2"
              />
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
                Add Booking
              </v-btn>
              <v-btn
                prepend-icon="mdi-home-plus"
                color="secondary"
                variant="tonal"
                block
                @click="$emit('createProperty')"
              >
                Add Property
              </v-btn>
            </v-card-text>
            <v-card-text class="pt-0">
              <v-btn
                prepend-icon="mdi-calendar-month"
                color="info"
                variant="outlined"
                block
                @click="handleViewCalendar"
              >
                View My Calendar
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Loading Overlay -->
      <v-overlay 
        :model-value="loading"
        :contained="true"
        :persistent="true"
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
import { useAuthStore } from '@/stores/auth';
import TurnAlerts from '@/components/dumb/shared/TurnAlerts.vue';
import UpcomingCleanings from '@/components/dumb/shared/UpcomingCleanings.vue';

// Import types
import type { Booking, Property, BookingWithMetadata } from '@/types';

// Import event logger
import eventLogger from '@/composables/shared/useComponentEventLogger';

// Define props with default values
interface Props {
  todayTurns?: Map<string, Booking> | Booking[];
  upcomingCleanings?: Map<string, Booking> | Booking[];
  properties?: Map<string, Property> | Property[];
  loading?: boolean;
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
const authStore = useAuthStore();

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

// Get current user ID for filtering
const currentUserId = computed(() => authStore.user?.id || '1');

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

// OWNER-SPECIFIC FILTERING: Filter all data to show only current owner's data
const ownerPropertiesMap = computed(() => {
  const ownerMap = new Map<string, Property>();
  propertiesMap.value.forEach((property, id) => {
    if (property.owner_id === currentUserId.value) {
      ownerMap.set(id, property);
    }
  });
  return ownerMap;
});

const ownerTodayTurnsMap = computed(() => {
  const ownerMap = new Map<string, Booking>();
  todayTurnsMap.value.forEach((booking, id) => {
    if (booking.owner_id === currentUserId.value) {
      ownerMap.set(id, booking);
    }
  });
  return ownerMap;
});

const ownerUpcomingCleaningsMap = computed(() => {
  const ownerMap = new Map<string, Booking>();
  upcomingCleaningsMap.value.forEach((booking, id) => {
    if (booking.owner_id === currentUserId.value) {
      ownerMap.set(id, booking);
    }
  });
  return ownerMap;
});

// Convert owner Maps to arrays for components that expect arrays
const ownerTodayTurnsArray = computed(() => 
  Array.from(ownerTodayTurnsMap.value.values())
);

const ownerUpcomingCleaningsArray = computed(() => 
  Array.from(ownerUpcomingCleaningsMap.value.values())
);

// Owner-specific metrics
const ownerPropertiesCount = computed(() => ownerPropertiesMap.value.size);
const ownerBookingsCount = computed(() => 
  ownerTodayTurnsArray.value.length + ownerUpcomingCleaningsArray.value.length
);

// Add metadata (priority) to owner's bookings for the components
const ownerTodayBookingsWithMetadata = computed(() => {
  return ownerTodayTurnsArray.value.map(booking => {
    // Owner's turns are typically high priority
    const priority: 'low' | 'normal' | 'high' | 'urgent' = 'high';
    
    return {
      ...booking,
      priority,
      property_name: ownerPropertiesMap.value.get(booking.property_id)?.name || `Property ${booking.property_id.substring(0, 8)}`,
      cleaning_window: {
        start: booking.checkout_date,
        end: booking.checkin_date,
        duration: ownerPropertiesMap.value.get(booking.property_id)?.cleaning_duration || 120
      }
    } as BookingWithMetadata;
  });
});

const ownerUpcomingBookingsWithMetadata = computed(() => {
  return ownerUpcomingCleaningsArray.value.map(booking => {
    // Priority based on booking type
    const priority: 'low' | 'normal' | 'high' | 'urgent' = 
      booking.booking_type === 'turn' ? 'high' : 'normal';
    
    return {
      ...booking,
      priority,
      property_name: ownerPropertiesMap.value.get(booking.property_id)?.name || `Property ${booking.property_id.substring(0, 8)}`,
      cleaning_window: {
        start: booking.checkout_date,
        end: booking.checkin_date,
        duration: ownerPropertiesMap.value.get(booking.property_id)?.cleaning_duration || 120
      }
    } as BookingWithMetadata;
  });
});

// Format owner's properties for v-select (only their properties)
const ownerPropertySelectItems = computed(() => {
  try {
    return Array.from(ownerPropertiesMap.value.values())
      .filter(property => property && property.id && property.name)
      .map(property => ({
        title: property.name,
        value: property.id,
      }));
  } catch (error) {
    console.error('Error creating owner property select items:', error);
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
      'OwnerSidebar',
      'HomeOwner',
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

// Owner-specific: View booking instead of assign cleaner
const handleViewBooking = (bookingId: string): void => {
  try {
    // Log event
    eventLogger.logEvent(
      'OwnerSidebar',
      'HomeOwner',
      'navigateToBooking',
      bookingId,
      'emit'
    );
    
    // Navigate to booking for viewing/editing
    emit('navigateToBooking', bookingId);
  } catch (error) {
    console.error('Error handling view booking:', error);
  }
};

const handleViewAll = (period: string): void => {
  try {
    // Navigate to filtered view of owner's bookings
    const today = new Date();
    let targetDate = today;
    
    if (period === 'turns') {
      // Navigate to owner's turn bookings
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
      'OwnerSidebar',
      'HomeOwner',
      'navigateToDate',
      targetDate,
      'emit'
    );
    
    emit('navigateToDate', targetDate);
  } catch (error) {
    console.error('Error handling view all:', error);
  }
};

const handleViewCalendar = (): void => {
  try {
    // Navigate to owner's calendar view
    const today = new Date();
    
    // Log event
    eventLogger.logEvent(
      'OwnerSidebar',
      'HomeOwner',
      'navigateToDate',
      today,
      'emit'
    );
    
    emit('navigateToDate', today);
  } catch (error) {
    console.error('Error handling view calendar:', error);
  }
};

const toggleUpcomingExpanded = (expanded: boolean): void => {
  // This method can be used if needed
  console.log('Owner upcoming cleanings expanded:', expanded);
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
</script>

<style scoped>
.owner-sidebar {
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
  .owner-sidebar {
    width: 100% !important;
  }
}

/* Owner-specific styling */
.property-filter .v-card-title {
  color: rgb(var(--v-theme-primary));
}

.quick-actions .v-card-title {
  color: rgb(var(--v-theme-secondary));
}
</style> 