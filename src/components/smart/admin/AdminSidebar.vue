<template>
  <v-navigation-drawer
    class="admin-sidebar"
    width="100%"
    :elevation="8"
    color="tertiary"
  >                                   
    <v-container class="py-2">
      <!-- Business Management Header -->
      <v-row class="mb-4">
        <v-col cols="12">
          <h2 class="text-h6 font-weight-bold">
            Business Management
          </h2>
          <div class="text-subtitle-2 text-medium-emphasis">
            {{ formattedDate }}
          </div>
          <!-- System Metrics Summary -->
          <div class="mt-2">
            <v-chip
              size="small"
              color="primary"
              variant="outlined"
              class="mr-1 mb-1"
            >
              {{ totalProperties }} Properties
            </v-chip>
            <v-chip
              size="small"
              color="warning"
              variant="outlined"
              class="mr-1 mb-1"
            >
              {{ urgentTurnsCount }} Urgent Turns
            </v-chip>
            <v-chip
              size="small"
              color="success"
              variant="outlined"
              class="mr-1 mb-1"
            >
              {{ availableCleanersCount }} Available Cleaners
            </v-chip>
          </div>
        </v-col>
      </v-row>

      <!-- System-wide Turn Alerts -->
      <v-row v-if="systemTodayTurnsArray.length > 0">
        <v-col cols="12">
          <v-card
            class="system-turn-alerts mb-4"
            variant="outlined"
            color="warning"
          >
            <v-card-title class="d-flex align-center">
              <v-icon
                icon="mdi-alert-circle"
                class="mr-2"
                color="warning"
              />
              System-wide Urgent Turns
              <v-spacer />
              <v-chip
                size="small"
                color="warning"
                variant="flat"
              >
                {{ systemTodayTurnsArray.length }}
              </v-chip>
            </v-card-title>
            <v-card-text>
              <TurnAlerts 
                :bookings="systemTodayBookingsWithMetadata" 
                :properties="allPropertiesMap"
                @view="$emit('navigateToBooking', $event)"
                @assign="handleAssignCleaner"
                @view-all="handleViewAll('turns')"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- System-wide Upcoming Cleanings -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-card
            class="system-upcoming-cleanings"
            variant="outlined"
          >
            <v-card-title class="d-flex align-center">
              <v-icon
                icon="mdi-calendar-clock"
                class="mr-2"
              />
              System-wide Schedule
              <v-spacer />
              <v-chip
                size="small"
                color="info"
                variant="flat"
              >
                {{ systemUpcomingCleaningsArray.length }}
              </v-chip>
            </v-card-title>
            <v-card-text>
              <UpcomingCleanings 
                :bookings="systemUpcomingBookingsWithMetadata"
                :properties="allPropertiesMap"
                @view="$emit('navigateToBooking', $event)"
                @assign="handleAssignCleaner"
                @view-all="handleViewAll($event)"
                @toggle-expanded="toggleUpcomingExpanded"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Advanced Property Filter -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-card
            class="advanced-property-filter"
            variant="outlined"
          >
            <v-card-title class="d-flex align-center">
              <v-icon
                icon="mdi-filter-variant"
                class="mr-2"
              />
              Advanced Filters
            </v-card-title>
            <v-card-text>
              <!-- Property Filter -->
              <v-select
                v-model="selectedProperty"
                :items="propertySelectItems"
                label="Filter by Property"
                clearable
                class="mb-2"
                @update:model-value="handlePropertyFilterChange"
              >
                <template #prepend-item>
                  <v-list-item
                    title="All Properties"
                    value=""
                    @click="selectedProperty = null"
                  />
                  <v-divider class="mt-2" />
                </template>
              </v-select>

              <!-- Owner Filter -->
              <v-select
                v-model="selectedOwner"
                :items="ownerSelectItems"
                label="Filter by Property Owner"
                clearable
                class="mb-2"
                @update:model-value="handleOwnerFilterChange"
              >
                <template #prepend-item>
                  <v-list-item
                    title="All Owners"
                    value=""
                    @click="selectedOwner = null"
                  />
                  <v-divider class="mt-2" />
                </template>
              </v-select>

              <!-- Status Filter -->
              <v-select
                v-model="selectedStatus"
                :items="statusSelectItems"
                label="Filter by Status"
                clearable
                @update:model-value="handleStatusFilterChange"
              >
                <template #prepend-item>
                  <v-list-item
                    title="All Statuses"
                    value=""
                    @click="selectedStatus = null"
                  />
                  <v-divider class="mt-2" />
                </template>
              </v-select>

              <!-- Clear All Filters -->
              <v-btn
                v-if="hasActiveFilters"
                variant="outlined"
                size="small"
                prepend-icon="mdi-filter-remove"
                class="mt-2"
                @click="clearAllFilters"
              >
                Clear All Filters
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Business Analytics Dashboard -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-card
            class="business-analytics"
            variant="outlined"
          >
            <v-card-title class="d-flex align-center">
              <v-icon
                icon="mdi-chart-line"
                class="mr-2"
              />
              Business Analytics
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <div class="text-center">
                    <div class="text-h4 font-weight-bold text-primary">
                      {{ totalProperties }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Total Properties
                    </div>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="text-center">
                    <div class="text-h4 font-weight-bold text-success">
                      {{ activeCleaningsToday }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Active Today
                    </div>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="text-center">
                    <div class="text-h4 font-weight-bold text-warning">
                      {{ urgentTurnsCount }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Urgent Turns
                    </div>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="text-center">
                    <div class="text-h4 font-weight-bold text-info">
                      {{ totalPropertyOwners }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Property Owners
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Cleaner Availability Status -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-card
            class="cleaner-availability"
            variant="outlined"
          >
            <v-card-title class="d-flex align-center">
              <v-icon
                icon="mdi-account-hard-hat"
                class="mr-2"
              />
              Cleaner Status
              <v-spacer />
              <v-chip
                size="small"
                color="success"
                variant="flat"
              >
                {{ availableCleanersCount }} Available
              </v-chip>
            </v-card-title>
            <v-card-text>
              <div
                v-if="cleanerStatusList.length === 0"
                class="text-center text-medium-emphasis"
              >
                No cleaner data available
              </div>
              <div v-else>
                <v-list density="compact">
                  <v-list-item
                    v-for="cleaner in cleanerStatusList.slice(0, 5)"
                    :key="cleaner.id"
                    :title="cleaner.name"
                    :subtitle="cleaner.status"
                  >
                    <template #prepend>
                      <v-avatar
                        size="small"
                        :color="cleaner.statusColor"
                      >
                        <v-icon
                          :icon="cleaner.statusIcon"
                          size="small"
                        />
                      </v-avatar>
                    </template>
                    <template #append>
                      <v-btn
                        v-if="cleaner.status === 'Available'"
                        size="x-small"
                        variant="outlined"
                        color="primary"
                        @click="handleQuickAssign(cleaner.id)"
                      >
                        Assign
                      </v-btn>
                    </template>
                  </v-list-item>
                </v-list>
                <v-btn
                  v-if="cleanerStatusList.length > 5"
                  variant="text"
                  size="small"
                  class="mt-2"
                  @click="$emit('manageSystem')"
                >
                  View All Cleaners ({{ cleanerStatusList.length }})
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Admin Quick Actions -->
      <v-row>
        <v-col cols="12">
          <v-card
            class="admin-quick-actions"
            variant="outlined"
          >
            <v-card-title class="d-flex align-center">
              <v-icon
                icon="mdi-lightning-bolt"
                class="mr-2"
              />
              Admin Actions
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-btn
                    prepend-icon="mdi-account-hard-hat"
                    color="warning"
                    variant="tonal"
                    block
                    class="mb-2"
                    @click="$emit('assignCleaner', { bookingId: '', cleanerId: '' })"
                  >
                    Assign Cleaners
                  </v-btn>
                </v-col>
                <v-col cols="12">
                  <v-btn
                    prepend-icon="mdi-chart-line"
                    color="info"
                    variant="tonal"
                    block
                    class="mb-2"
                    @click="$emit('generateReports')"
                  >
                    Generate Reports
                  </v-btn>
                </v-col>
                <v-col cols="12">
                  <v-btn
                    prepend-icon="mdi-cog"
                    color="primary"
                    variant="tonal"
                    block
                    class="mb-2"
                    @click="$emit('manageSystem')"
                  >
                    Manage System
                  </v-btn>
                </v-col>
                <v-col cols="6">
                  <v-btn
                    prepend-icon="mdi-calendar-plus"
                    color="secondary"
                    variant="outlined"
                    block
                    size="small"
                    @click="$emit('createBooking')"
                  >
                    New Booking
                  </v-btn>
                </v-col>
                <v-col cols="6">
                  <v-btn
                    prepend-icon="mdi-home-plus"
                    color="secondary"
                    variant="outlined"
                    block
                    size="small"
                    @click="$emit('createProperty')"
                  >
                    New Property
                  </v-btn>
                </v-col>
                <v-col cols="12">
                  <v-btn
                    prepend-icon="mdi-alert-circle"
                    color="error"
                    variant="outlined"
                    block
                    size="small"
                    class="mt-2"
                    @click="$emit('emergencyResponse')"
                  >
                    Emergency Response
                  </v-btn>
                </v-col>
              </v-row>
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
import { ref, computed, onMounted } from 'vue';
// Removed unused useUIStore import
import TurnAlerts from '@/components/dumb/shared/TurnAlerts.vue';
import UpcomingCleanings from '@/components/dumb/shared/UpcomingCleanings.vue';

// Import types
import type { Booking, Property, User, BookingWithMetadata } from '@/types';

// Import event logger
import eventLogger from '@/composables/shared/useComponentEventLogger';

// Define props - Admin sees ALL data (no owner filtering)
interface Props {
  todayTurns?: Map<string, Booking> | Booking[];
  upcomingCleanings?: Map<string, Booking> | Booking[];
  properties?: Map<string, Property> | Property[];
  users?: Map<string, User> | User[]; // Property owners
  cleaners?: Map<string, User> | User[]; // Cleaner staff
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  todayTurns: () => [],
  upcomingCleanings: () => [],
  properties: () => [],
  users: () => [],
  cleaners: () => [],
  loading: false
});

// Define emits - Admin-specific events
interface Emits {
  // Navigation events
  (e: 'navigateToBooking', bookingId: string): void;
  (e: 'navigateToDate', date: Date): void;
  (e: 'navigateToProperty', propertyId: string): void;
  
  // Filtering events
  (e: 'filterByProperty', propertyId: string | null): void;
  (e: 'filterByOwner', ownerId: string | null): void;
  (e: 'filterByStatus', status: string | null): void;
  
  // Admin actions
  (e: 'assignCleaner', data: { bookingId: string, cleanerId?: string }): void;
  (e: 'generateReports'): void;
  (e: 'manageSystem'): void;
  (e: 'emergencyResponse'): void;
  
  // CRUD operations
  (e: 'createBooking'): void;
  (e: 'createProperty'): void;
}

const emit = defineEmits<Emits>();

// Store connections (removed unused uiStore to fix linter warning)

// Local state for filters
const selectedProperty = ref<string | null>(null);
const selectedOwner = ref<string | null>(null);
const selectedStatus = ref<string | null>(null);

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
    return new Date().toISOString().split('T')[0];
  }
});

// Convert inputs to proper Maps - ADMIN: NO OWNER FILTERING
const systemTodayTurnsMap = computed(() => {
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
    console.error('Error processing system today\'s turns:', error);
    return new Map<string, Booking>();
  }
});

const systemUpcomingCleaningsMap = computed(() => {
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
    console.error('Error processing system upcoming cleanings:', error);
    return new Map<string, Booking>();
  }
});

const allPropertiesMap = computed(() => {
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
    console.error('Error processing all properties:', error);
    return new Map<string, Property>();
  }
});

const allUsersMap = computed(() => {
  try {
    if (props.users instanceof Map) return props.users;
    
    const map = new Map<string, User>();
    if (Array.isArray(props.users)) {
      props.users.forEach(user => {
        if (user && user.id) {
          map.set(user.id, user);
        }
      });
    }
    return map;
  } catch (error) {
    console.error('Error processing all users:', error);
    return new Map<string, User>();
  }
});

const allCleanersMap = computed(() => {
  try {
    if (props.cleaners instanceof Map) return props.cleaners;
    
    const map = new Map<string, User>();
    if (Array.isArray(props.cleaners)) {
      props.cleaners.forEach(cleaner => {
        if (cleaner && cleaner.id) {
          map.set(cleaner.id, cleaner);
        }
      });
    }
    return map;
  } catch (error) {
    console.error('Error processing all cleaners:', error);
    return new Map<string, User>();
  }
});

// Convert Maps to arrays - ADMIN: ALL DATA, NO FILTERING
const systemTodayTurnsArray = computed(() => 
  Array.from(systemTodayTurnsMap.value.values())
);

const systemUpcomingCleaningsArray = computed(() => 
  Array.from(systemUpcomingCleaningsMap.value.values())
);

// Add metadata to bookings - ADMIN: SYSTEM-WIDE DATA
const systemTodayBookingsWithMetadata = computed(() => {
  return systemTodayTurnsArray.value.map(booking => {
    const property = allPropertiesMap.value.get(booking.property_id);
    const owner = allUsersMap.value.get(booking.owner_id);
    
    // Explicit priority type declaration following established pattern
    const priority: 'low' | 'normal' | 'high' | 'urgent' = 'urgent';
    
    return {
      ...booking,
      priority,
      property_name: property?.name || `Property ${booking.property_id.substring(0, 8)}`,
      owner_name: owner?.name || `Owner ${booking.owner_id.substring(0, 8)}`,
      cleaning_window: {
        start: booking.checkout_date,
        end: booking.checkin_date,
        duration: property?.cleaning_duration || 120
      }
    } as BookingWithMetadata;
  });
});

const systemUpcomingBookingsWithMetadata = computed(() => {
  return systemUpcomingCleaningsArray.value.map(booking => {
    const property = allPropertiesMap.value.get(booking.property_id);
    const owner = allUsersMap.value.get(booking.owner_id);
    
    // Explicit priority type declaration following established pattern
    const priority: 'low' | 'normal' | 'high' | 'urgent' = 
      booking.booking_type === 'turn' ? 'high' : 'normal';
    
    return {
      ...booking,
      priority,
      property_name: property?.name || `Property ${booking.property_id.substring(0, 8)}`,
      owner_name: owner?.name || `Owner ${booking.owner_id.substring(0, 8)}`,
      cleaning_window: {
        start: booking.checkout_date,
        end: booking.checkin_date,
        duration: property?.cleaning_duration || 120
      }
    } as BookingWithMetadata;
  });
});

// Business Analytics - ADMIN: SYSTEM-WIDE METRICS
const totalProperties = computed(() => allPropertiesMap.value.size);

const totalPropertyOwners = computed(() => {
  const ownerIds = new Set<string>();
  Array.from(allPropertiesMap.value.values()).forEach(property => {
    if (property.owner_id) {
      ownerIds.add(property.owner_id);
    }
  });
  return ownerIds.size;
});

const urgentTurnsCount = computed(() => systemTodayTurnsArray.value.length);

const activeCleaningsToday = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return Array.from(systemUpcomingCleaningsMap.value.values())
    .filter(booking => 
      booking.checkout_date.startsWith(today) && 
      booking.status === 'in_progress'
    ).length;
});

const availableCleanersCount = computed(() => {
  return Array.from(allCleanersMap.value.values())
    .filter(cleaner => cleaner.role === 'cleaner').length;
});

// Filter options for admin
const propertySelectItems = computed(() => {
  return Array.from(allPropertiesMap.value.values())
    .filter(property => property && property.id && property.name)
    .map(property => ({
      title: property.name,
      value: property.id,
    }));
});

const ownerSelectItems = computed(() => {
  const owners = Array.from(allUsersMap.value.values())
    .filter(user => user.role === 'owner');
  
  return owners.map(owner => ({
    title: owner.name,
    value: owner.id,
  }));
});

const statusSelectItems = computed(() => [
  { title: 'Pending', value: 'pending' },
  { title: 'Scheduled', value: 'scheduled' },
  { title: 'In Progress', value: 'in_progress' },
  { title: 'Completed', value: 'completed' },
]);

const hasActiveFilters = computed(() => 
  selectedProperty.value !== null || 
  selectedOwner.value !== null || 
  selectedStatus.value !== null
);

// Cleaner status list
const cleanerStatusList = computed(() => {
  return Array.from(allCleanersMap.value.values())
    .filter(cleaner => cleaner.role === 'cleaner')
    .map(cleaner => ({
      id: cleaner.id,
      name: cleaner.name,
      status: 'Available', // TODO: Calculate actual status
      statusColor: 'success',
      statusIcon: 'mdi-check-circle',
    }));
});

// Methods
const handlePropertyFilterChange = (propertyId: string | null): void => {
  try {
    eventLogger.logEvent(
      'AdminSidebar',
      'HomeAdmin',
      'filterByProperty',
      propertyId,
      'emit'
    );
    
    emit('filterByProperty', propertyId);
  } catch (error) {
    console.error('Error changing property filter:', error);
  }
};

const handleOwnerFilterChange = (ownerId: string | null): void => {
  try {
    eventLogger.logEvent(
      'AdminSidebar',
      'HomeAdmin',
      'filterByOwner',
      ownerId,
      'emit'
    );
    
    emit('filterByOwner', ownerId);
  } catch (error) {
    console.error('Error changing owner filter:', error);
  }
};

const handleStatusFilterChange = (status: string | null): void => {
  try {
    eventLogger.logEvent(
      'AdminSidebar',
      'HomeAdmin',
      'filterByStatus',
      status,
      'emit'
    );
    
    emit('filterByStatus', status);
  } catch (error) {
    console.error('Error changing status filter:', error);
  }
};

const clearAllFilters = (): void => {
  try {
    selectedProperty.value = null;
    selectedOwner.value = null;
    selectedStatus.value = null;
    
    emit('filterByProperty', null);
    emit('filterByOwner', null);
    emit('filterByStatus', null);
    
    eventLogger.logEvent(
      'AdminSidebar',
      'HomeAdmin',
      'clearAllFilters',
      null,
      'emit'
    );
  } catch (error) {
    console.error('Error clearing all filters:', error);
  }
};

const handleAssignCleaner = (bookingId: string): void => {
  try {
    eventLogger.logEvent(
      'AdminSidebar',
      'HomeAdmin',
      'assignCleaner',
      { bookingId },
      'emit'
    );
    
    emit('assignCleaner', { bookingId });
  } catch (error) {
    console.error('Error handling assign cleaner:', error);
  }
};

const handleQuickAssign = (cleanerId: string): void => {
  try {
    eventLogger.logEvent(
      'AdminSidebar',
      'HomeAdmin',
      'assignCleaner',
      { cleanerId },
      'emit'
    );
    
    emit('assignCleaner', { bookingId: '', cleanerId });
  } catch (error) {
    console.error('Error handling quick assign:', error);
  }
};

const handleViewAll = (period: string): void => {
  try {
    const today = new Date();
    let targetDate = today;
    
    if (period === 'turns') {
      // Navigate to turn bookings
    } else if (period === 'today') {
      // Navigate to today's bookings
    } else if (period === 'tomorrow') {
      targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 1);
    } else {
      try {
        targetDate = new Date(period);
      } catch {
        targetDate = today;
      }
    }
    
    eventLogger.logEvent(
      'AdminSidebar',
      'HomeAdmin',
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
  console.log('Admin upcoming cleanings expanded:', expanded);
};

// Initialize on mount
onMounted(() => {
  try {
    // Initialize any admin-specific state
    console.log('AdminSidebar mounted with system-wide data access');
  } catch (error) {
    console.error('Error initializing AdminSidebar:', error);
  }
});
</script>

<style scoped>
.admin-sidebar {
  height: 100%;
  overflow-y: auto;
}

.system-turn-alerts {
  border-left: 4px solid rgb(var(--v-theme-warning));
}

.business-analytics .v-card-text {
  padding-bottom: 8px;
}

.cleaner-availability .v-list {
  padding: 0;
}

.admin-quick-actions .v-card-text {
  padding-bottom: 8px;
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

/* Admin-specific styling */
.admin-sidebar .v-card {
  margin-bottom: 8px;
}

.admin-sidebar .v-chip {
  font-size: 0.75rem;
}

/* Desktop-optimized layout */
@media (min-width: 1264px) {
  .admin-sidebar {
    width: 100% !important;
  }
  
  .business-analytics .v-col {
    padding: 4px 8px;
  }
}

/* Mobile optimizations */
@media (max-width: 960px) {
  .admin-sidebar {
    width: 100% !important;
  }
  
  .admin-quick-actions .v-btn {
    font-size: 0.875rem;
  }
}
</style> 