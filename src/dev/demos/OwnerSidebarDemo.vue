<template>
  <div class="owner-sidebar-demo">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-4">
            OwnerSidebar Demo
          </h1>
          <p class="text-body-1 mb-4">
            This demo shows the OwnerSidebar component with sample owner data.
            The sidebar filters all data to show only the current owner's properties and bookings.
          </p>
        </v-col>
      </v-row>
      
      <v-row>
        <!-- Sidebar Demo -->
        <v-col
          cols="12"
          md="4"
        >
          <v-card>
            <v-card-title>Owner Sidebar</v-card-title>
            <v-card-text class="pa-0">
              <div style="height: 600px;">
                <OwnerSidebar
                  :today-turns="sampleOwnerTodayTurns"
                  :upcoming-cleanings="sampleOwnerUpcomingCleanings"
                  :properties="sampleOwnerProperties"
                  :loading="loading"
                  @navigate-to-booking="handleNavigateToBooking"
                  @navigate-to-date="handleNavigateToDate"
                  @filter-by-property="handleFilterByProperty"
                  @create-booking="handleCreateBooking"
                  @create-property="handleCreateProperty"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <!-- Event Log -->
        <v-col
          cols="12"
          md="8"
        >
          <v-card>
            <v-card-title class="d-flex align-center">
              Event Log
              <v-spacer />
              <v-btn
                size="small"
                variant="outlined"
                @click="clearEventLog"
              >
                Clear
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-list
                v-if="eventLog.length > 0"
                density="compact"
              >
                <v-list-item
                  v-for="(event, index) in eventLog"
                  :key="index"
                  :title="event.action"
                  :subtitle="event.details"
                >
                  <template #prepend>
                    <v-icon
                      :icon="getEventIcon(event.action)"
                      :color="getEventColor(event.action)"
                      size="small"
                    />
                  </template>
                  <template #append>
                    <span class="text-caption">{{ event.timestamp }}</span>
                  </template>
                </v-list-item>
              </v-list>
              <div
                v-else
                class="text-center py-4 text-medium-emphasis"
              >
                No events yet. Interact with the sidebar to see events.
              </div>
            </v-card-text>
          </v-card>
          
          <!-- Sample Data Info -->
          <v-card class="mt-4">
            <v-card-title>Sample Data</v-card-title>
            <v-card-text>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <h4>Owner Properties ({{ sampleOwnerPropertiesArray.length }})</h4>
                  <v-list density="compact">
                    <v-list-item
                      v-for="property in sampleOwnerPropertiesArray"
                      :key="property.id"
                      :title="property.name"
                      :subtitle="property.address"
                    />
                  </v-list>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <h4>Owner Bookings ({{ totalOwnerBookings }})</h4>
                  <v-list density="compact">
                    <v-list-item
                      v-for="booking in [...sampleOwnerTodayTurnsArray, ...sampleOwnerUpcomingCleaningsArray]"
                      :key="booking.id"
                      :title="`${booking.booking_type.toUpperCase()} - ${getPropertyName(booking.property_id)}`"
                      :subtitle="`${formatDate(booking.checkout_date)} → ${formatDate(booking.checkin_date)}`"
                    >
                      <template #prepend>
                        <v-chip
                          :color="booking.booking_type === 'turn' ? 'warning' : 'info'"
                          size="x-small"
                          label
                        >
                          {{ booking.booking_type }}
                        </v-chip>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import OwnerSidebar from '../../components/dumb/owner/OwnerSidebar.vue';
import type { Booking, Property } from '@/types';

// Demo state
const loading = ref(false);
const eventLog = ref<Array<{
  action: string;
  details: string;
  timestamp: string;
}>>([]);

// Sample owner data (filtered to current owner ID = '1')
const currentOwnerId = '1';

const sampleOwnerProperties = ref<Map<string, Property>>(new Map([
  ['prop-1', {
    id: 'prop-1',
    owner_id: currentOwnerId, // Owner's property
    name: 'Sunset Beach House',
    address: '123 Ocean Drive, Miami, FL',
    cleaning_duration: 180,
    special_instructions: 'Check pool area, extra attention to kitchen',
    pricing_tier: 'luxury',
    active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  }],
  ['prop-2', {
    id: 'prop-2',
    owner_id: currentOwnerId, // Owner's property
    name: 'Downtown Loft',
    address: '456 Main Street, Miami, FL',
    cleaning_duration: 120,
    special_instructions: 'Hardwood floors, be careful with electronics',
    pricing_tier: 'premium',
    active: true,
    created_at: '2024-01-20T14:30:00Z',
    updated_at: '2024-01-20T14:30:00Z'
  }],
  ['prop-3', {
    id: 'prop-3',
    owner_id: currentOwnerId, // Owner's property
    name: 'Cozy Studio',
    address: '789 Pine Avenue, Miami, FL',
    cleaning_duration: 90,
    pricing_tier: 'basic',
    active: true,
    created_at: '2024-02-01T09:15:00Z',
    updated_at: '2024-02-01T09:15:00Z'
  }]
]));

const sampleOwnerTodayTurns = ref<Map<string, Booking>>(new Map([
  ['booking-1', {
    id: 'booking-1',
    property_id: 'prop-1',
    owner_id: currentOwnerId, // Owner's booking
    checkout_date: new Date().toISOString().split('T')[0] + 'T11:00:00Z',
    checkin_date: new Date().toISOString().split('T')[0] + 'T15:00:00Z',
    booking_type: 'turn',
    guest_count: 4,
    notes: 'Same-day turnaround, high priority',
    status: 'pending',
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-01-10T08:00:00Z'
  }],
  ['booking-2', {
    id: 'booking-2',
    property_id: 'prop-2',
    owner_id: currentOwnerId, // Owner's booking
    checkout_date: new Date().toISOString().split('T')[0] + 'T10:00:00Z',
    checkin_date: new Date().toISOString().split('T')[0] + 'T16:00:00Z',
    booking_type: 'turn',
    guest_count: 2,
    notes: 'Quick turnaround needed',
    status: 'scheduled',
    assigned_cleaner_id: 'cleaner-1',
    created_at: '2024-01-12T09:30:00Z',
    updated_at: '2024-01-12T09:30:00Z'
  }]
]));

const sampleOwnerUpcomingCleanings = ref<Map<string, Booking>>(new Map([
  ['booking-3', {
    id: 'booking-3',
    property_id: 'prop-1',
    owner_id: currentOwnerId, // Owner's booking
    checkout_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T11:00:00Z',
    checkin_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T15:00:00Z',
    booking_type: 'standard',
    guest_count: 6,
    notes: 'Regular cleaning, family with kids',
    status: 'pending',
    created_at: '2024-01-14T11:00:00Z',
    updated_at: '2024-01-14T11:00:00Z'
  }],
  ['booking-4', {
    id: 'booking-4',
    property_id: 'prop-3',
    owner_id: currentOwnerId, // Owner's booking
    checkout_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T12:00:00Z',
    checkin_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T14:00:00Z',
    booking_type: 'standard',
    guest_count: 2,
    notes: 'Business travelers, minimal mess expected',
    status: 'pending',
    created_at: '2024-01-16T13:45:00Z',
    updated_at: '2024-01-16T13:45:00Z'
  }]
]));

// Computed properties for display
const sampleOwnerPropertiesArray = computed(() => 
  Array.from(sampleOwnerProperties.value.values())
);

const sampleOwnerTodayTurnsArray = computed(() => 
  Array.from(sampleOwnerTodayTurns.value.values())
);

const sampleOwnerUpcomingCleaningsArray = computed(() => 
  Array.from(sampleOwnerUpcomingCleanings.value.values())
);

const totalOwnerBookings = computed(() => 
  sampleOwnerTodayTurnsArray.value.length + sampleOwnerUpcomingCleaningsArray.value.length
);

// Event handlers
const handleNavigateToBooking = (bookingId: string) => {
  addEventLog('Navigate to Booking', `Booking ID: ${bookingId}`);
};

const handleNavigateToDate = (date: Date) => {
  addEventLog('Navigate to Date', `Date: ${date.toLocaleDateString()}`);
};

const handleFilterByProperty = (propertyId: string | null) => {
  const propertyName = propertyId 
    ? sampleOwnerProperties.value.get(propertyId)?.name || 'Unknown Property'
    : 'All Properties';
  addEventLog('Filter by Property', `Property: ${propertyName}`);
};

const handleCreateBooking = () => {
  addEventLog('Create Booking', 'Owner wants to create a new booking');
};

const handleCreateProperty = () => {
  addEventLog('Create Property', 'Owner wants to add a new property');
};

// Utility functions
const addEventLog = (action: string, details: string) => {
  eventLog.value.unshift({
    action,
    details,
    timestamp: new Date().toLocaleTimeString()
  });
  
  // Keep only last 20 events
  if (eventLog.value.length > 20) {
    eventLog.value = eventLog.value.slice(0, 20);
  }
};

const clearEventLog = () => {
  eventLog.value = [];
};

const getEventIcon = (action: string): string => {
  const iconMap: Record<string, string> = {
    'Navigate to Booking': 'mdi-calendar-edit',
    'Navigate to Date': 'mdi-calendar-month',
    'Filter by Property': 'mdi-filter-variant',
    'Create Booking': 'mdi-calendar-plus',
    'Create Property': 'mdi-home-plus'
  };
  return iconMap[action] || 'mdi-information';
};

const getEventColor = (action: string): string => {
  const colorMap: Record<string, string> = {
    'Navigate to Booking': 'primary',
    'Navigate to Date': 'info',
    'Filter by Property': 'warning',
    'Create Booking': 'success',
    'Create Property': 'secondary'
  };
  return colorMap[action] || 'grey';
};

const getPropertyName = (propertyId: string): string => {
  return sampleOwnerProperties.value.get(propertyId)?.name || 'Unknown Property';
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};
</script>

<style scoped>
.owner-sidebar-demo {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-surface));
}
</style> 