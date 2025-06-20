<template>
  <div class="home-admin-demo">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-4">
            HomeAdmin Demo
          </h1>
          <p class="text-body-1 mb-4">
            This demo shows the HomeAdmin component with sample data across multiple property owners.
            The admin interface displays ALL data system-wide (no owner filtering) and includes admin-specific features.
          </p>
        </v-col>
      </v-row>
      
      <v-row>
        <!-- Demo Controls -->
        <v-col
          cols="12"
          md="3"
        >
          <v-card>
            <v-card-title>Demo Controls</v-card-title>
            <v-card-text>
              <v-btn
                block
                color="primary"
                class="mb-2"
                @click="loadSampleData"
              >
                Load Sample Data
              </v-btn>
              <v-btn
                block
                color="secondary"
                class="mb-2"
                @click="clearData"
              >
                Clear Data
              </v-btn>
              <v-btn
                block
                color="info"
                class="mb-4"
                @click="toggleEventLog"
              >
                {{ showEventLog ? 'Hide' : 'Show' }} Event Log
              </v-btn>
              
              <h4>Sample Data Summary</h4>
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title>Properties: {{ samplePropertiesArray.length }}</v-list-item-title>
                  <v-list-item-subtitle>Across {{ uniqueOwners.length }} owners</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Bookings: {{ sampleBookingsArray.length }}</v-list-item-title>
                  <v-list-item-subtitle>{{ turnBookingsCount }} turns, {{ standardBookingsCount }} standard</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Today's Turns: {{ todayTurnsCount }}</v-list-item-title>
                  <v-list-item-subtitle>System-wide urgent</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Upcoming: {{ upcomingCleaningsCount }}</v-list-item-title>
                  <v-list-item-subtitle>Next 7 days</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
          
          <!-- Event Log -->
          <v-card
            v-if="showEventLog"
            class="mt-4"
          >
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
                max-height="300"
                style="overflow-y: auto;"
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
                No events yet. Interact with the admin interface to see events.
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <!-- HomeAdmin Component Demo -->
        <v-col
          cols="12"
          md="9"
        >
          <v-card>
            <v-card-title>Admin Interface (System-wide View)</v-card-title>
            <v-card-text class="pa-0">
              <div style="height: 800px;">
                <HomeAdmin />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Sample Data Details -->
      <v-row class="mt-4">
        <v-col
          cols="12"
          md="6"
        >
          <v-card>
            <v-card-title>Sample Properties (All Owners)</v-card-title>
            <v-card-text>
              <v-list density="compact">
                <v-list-item
                  v-for="property in samplePropertiesArray"
                  :key="property.id"
                  :title="property.name"
                  :subtitle="`Owner: ${getOwnerName(property.owner_id)} | ${property.address}`"
                >
                  <template #prepend>
                    <v-chip
                      :color="getOwnerColor(property.owner_id)"
                      size="x-small"
                      label
                    >
                      {{ getOwnerInitials(property.owner_id) }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col
          cols="12"
          md="6"
        >
          <v-card>
            <v-card-title>Sample Bookings (All Owners)</v-card-title>
            <v-card-text>
              <v-list density="compact">
                <v-list-item
                  v-for="booking in sampleBookingsArray"
                  :key="booking.id"
                  :title="`${booking.booking_type.toUpperCase()} - ${getPropertyName(booking.property_id)}`"
                  :subtitle="`Owner: ${getOwnerName(booking.owner_id)} | ${formatDate(booking.checkout_date)} → ${formatDate(booking.checkin_date)}`"
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
                  <template #append>
                    <v-chip
                      :color="getOwnerColor(booking.owner_id)"
                      size="x-small"
                      label
                    >
                      {{ getOwnerInitials(booking.owner_id) }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import HomeAdmin from '../../../pages/admin/index.vue';
import { usePropertyStore } from '@/stores/property';
import { useBookingStore } from '@/stores/booking';
import { useAuthStore } from '@/stores/auth';
import type { Booking, Property } from '@/types';

// Demo state
const showEventLog = ref(false);
const eventLog = ref<Array<{
  action: string;
  details: string;
  timestamp: string;
}>>([]);

// Store connections
const propertyStore = usePropertyStore();
const bookingStore = useBookingStore();
const authStore = useAuthStore();

// Sample data for multiple owners (admin sees ALL)
const sampleOwners = [
  { id: '1', name: 'John Smith', initials: 'JS', color: 'blue' },
  { id: '2', name: 'Sarah Johnson', initials: 'SJ', color: 'green' },
  { id: '3', name: 'Mike Wilson', initials: 'MW', color: 'purple' },
  { id: '4', name: 'Lisa Brown', initials: 'LB', color: 'orange' }
];

const sampleProperties = ref<Map<string, Property>>(new Map());
const sampleBookings = ref<Map<string, Booking>>(new Map());

// Computed properties for display
const samplePropertiesArray = computed(() => 
  Array.from(sampleProperties.value.values())
);

const sampleBookingsArray = computed(() => 
  Array.from(sampleBookings.value.values())
);

const uniqueOwners = computed(() => 
  [...new Set(samplePropertiesArray.value.map(p => p.owner_id))]
);

const turnBookingsCount = computed(() => 
  sampleBookingsArray.value.filter(b => b.booking_type === 'turn').length
);

const standardBookingsCount = computed(() => 
  sampleBookingsArray.value.filter(b => b.booking_type === 'standard').length
);

const todayTurnsCount = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return sampleBookingsArray.value.filter(b => 
    b.booking_type === 'turn' && 
    b.checkout_date.startsWith(today)
  ).length;
});

const upcomingCleaningsCount = computed(() => {
  const today = new Date();
  const inOneWeek = new Date();
  inOneWeek.setDate(today.getDate() + 7);
  
  return sampleBookingsArray.value.filter(b => {
    const checkoutDate = new Date(b.checkout_date);
    return checkoutDate >= today && checkoutDate <= inOneWeek;
  }).length;
});

// Methods
const loadSampleData = (): void => {
  // Create sample properties across multiple owners
  const properties = new Map<string, Property>([
    ['prop-1', {
      id: 'prop-1',
      owner_id: '1', // John Smith
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
      owner_id: '1', // John Smith
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
      owner_id: '2', // Sarah Johnson
      name: 'Mountain Cabin',
      address: '789 Pine Avenue, Aspen, CO',
      cleaning_duration: 150,
      special_instructions: 'Fireplace cleaning, check hot tub',
      pricing_tier: 'luxury',
      active: true,
      created_at: '2024-02-01T09:15:00Z',
      updated_at: '2024-02-01T09:15:00Z'
    }],
    ['prop-4', {
      id: 'prop-4',
      owner_id: '2', // Sarah Johnson
      name: 'City Studio',
      address: '321 Urban Street, Denver, CO',
      cleaning_duration: 90,
      pricing_tier: 'basic',
      active: true,
      created_at: '2024-02-05T11:00:00Z',
      updated_at: '2024-02-05T11:00:00Z'
    }],
    ['prop-5', {
      id: 'prop-5',
      owner_id: '3', // Mike Wilson
      name: 'Lakefront Villa',
      address: '555 Lake Road, Austin, TX',
      cleaning_duration: 200,
      special_instructions: 'Boat dock area, outdoor furniture',
      pricing_tier: 'luxury',
      active: true,
      created_at: '2024-02-10T16:45:00Z',
      updated_at: '2024-02-10T16:45:00Z'
    }],
    ['prop-6', {
      id: 'prop-6',
      owner_id: '4', // Lisa Brown
      name: 'Historic Townhouse',
      address: '777 Heritage Lane, Charleston, SC',
      cleaning_duration: 160,
      special_instructions: 'Antique furniture, gentle cleaning required',
      pricing_tier: 'premium',
      active: true,
      created_at: '2024-02-15T13:20:00Z',
      updated_at: '2024-02-15T13:20:00Z'
    }]
  ]);

  // Create sample bookings across multiple owners and properties
  const bookings = new Map<string, Booking>([
    ['booking-1', {
      id: 'booking-1',
      property_id: 'prop-1',
      owner_id: '1', // John Smith
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
      property_id: 'prop-3',
      owner_id: '2', // Sarah Johnson
      checkout_date: new Date().toISOString().split('T')[0] + 'T10:00:00Z',
      checkin_date: new Date().toISOString().split('T')[0] + 'T16:00:00Z',
      booking_type: 'turn',
      guest_count: 2,
      notes: 'Mountain cabin turnaround',
      status: 'scheduled',
      assigned_cleaner_id: 'cleaner-1',
      created_at: '2024-01-12T09:30:00Z',
      updated_at: '2024-01-12T09:30:00Z'
    }],
    ['booking-3', {
      id: 'booking-3',
      property_id: 'prop-5',
      owner_id: '3', // Mike Wilson
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
      property_id: 'prop-6',
      owner_id: '4', // Lisa Brown
      checkout_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T12:00:00Z',
      checkin_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T14:00:00Z',
      booking_type: 'standard',
      guest_count: 2,
      notes: 'Historic home, careful cleaning',
      status: 'pending',
      created_at: '2024-01-16T13:45:00Z',
      updated_at: '2024-01-16T13:45:00Z'
    }],
    ['booking-5', {
      id: 'booking-5',
      property_id: 'prop-2',
      owner_id: '1', // John Smith
      checkout_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T09:00:00Z',
      checkin_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T17:00:00Z',
      booking_type: 'turn',
      guest_count: 3,
      notes: 'Downtown loft quick turn',
      status: 'pending',
      created_at: '2024-01-18T15:30:00Z',
      updated_at: '2024-01-18T15:30:00Z'
    }],
    ['booking-6', {
      id: 'booking-6',
      property_id: 'prop-4',
      owner_id: '2', // Sarah Johnson
      checkout_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T10:00:00Z',
      checkin_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T16:00:00Z',
      booking_type: 'standard',
      guest_count: 1,
      notes: 'Studio apartment, minimal cleaning',
      status: 'pending',
      created_at: '2024-01-20T10:15:00Z',
      updated_at: '2024-01-20T10:15:00Z'
    }]
  ]);

  // Update stores with sample data (admin sees ALL data)
  sampleProperties.value = properties;
  sampleBookings.value = bookings;
  
  // Load into actual stores for HomeAdmin to use
  properties.forEach((property, id) => {
    propertyStore.properties.set(id, property);
  });
  
  bookings.forEach((booking, id) => {
    bookingStore.bookings.set(id, booking);
  });

  addEventLog('Load Sample Data', 'Loaded multi-owner sample data for admin view');
};

const clearData = (): void => {
  sampleProperties.value.clear();
  sampleBookings.value.clear();
  propertyStore.properties.clear();
  bookingStore.bookings.clear();
  
  addEventLog('Clear Data', 'Cleared all sample data');
};

const toggleEventLog = (): void => {
  showEventLog.value = !showEventLog.value;
};

const clearEventLog = (): void => {
  eventLog.value = [];
};

const addEventLog = (action: string, details: string): void => {
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

// Utility functions
const getOwnerName = (ownerId: string): string => {
  return sampleOwners.find(o => o.id === ownerId)?.name || 'Unknown Owner';
};

const getOwnerInitials = (ownerId: string): string => {
  return sampleOwners.find(o => o.id === ownerId)?.initials || 'UO';
};

const getOwnerColor = (ownerId: string): string => {
  return sampleOwners.find(o => o.id === ownerId)?.color || 'grey';
};

const getPropertyName = (propertyId: string): string => {
  return sampleProperties.value.get(propertyId)?.name || 'Unknown Property';
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

const getEventIcon = (action: string): string => {
  const iconMap: Record<string, string> = {
    'Load Sample Data': 'mdi-database-plus',
    'Clear Data': 'mdi-database-remove',
    'Navigate to Booking': 'mdi-calendar-edit',
    'Navigate to Date': 'mdi-calendar-month',
    'Filter by Property': 'mdi-filter-variant',
    'Create Booking': 'mdi-calendar-plus',
    'Create Property': 'mdi-home-plus',
    'Assign Cleaners': 'mdi-account-hard-hat',
    'Generate Reports': 'mdi-chart-line',
    'Manage System': 'mdi-cog'
  };
  return iconMap[action] || 'mdi-information';
};

const getEventColor = (action: string): string => {
  const colorMap: Record<string, string> = {
    'Load Sample Data': 'success',
    'Clear Data': 'warning',
    'Navigate to Booking': 'primary',
    'Navigate to Date': 'info',
    'Filter by Property': 'warning',
    'Create Booking': 'success',
    'Create Property': 'secondary',
    'Assign Cleaners': 'warning',
    'Generate Reports': 'info',
    'Manage System': 'primary'
  };
  return colorMap[action] || 'grey';
};

// Initialize demo
onMounted(() => {
  // Set up admin user for demo
  authStore.user = {
    id: 'admin-1',
    email: 'admin@cleaningcompany.com',
    name: 'Admin User',
    role: 'admin',
    settings: {
      notifications: true,
      timezone: 'America/New_York',
      theme: 'light',
      language: 'en'
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };
  
  // Load sample data automatically
  loadSampleData();
});
</script>

<style scoped>
.home-admin-demo {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-surface));
}

/* Admin demo specific styling */
.home-admin-demo .v-card {
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
}

.home-admin-demo .v-card-title {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  color: rgb(var(--v-theme-on-primary));
}
</style> 