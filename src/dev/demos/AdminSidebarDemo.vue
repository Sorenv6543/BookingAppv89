<template>
  <div class="admin-sidebar-demo">
    <v-container fluid>
      <v-row>
        <!-- Demo AdminSidebar -->
        <v-col
          cols="12"
          md="4"
          lg="3"
        >
          <AdminSidebar
            :today-turns="demoTodayTurns"
            :upcoming-cleanings="demoUpcomingCleanings"
            :properties="demoProperties"
            :users="demoUsers"
            :cleaners="demoCleaners"
            :loading="loading"
            @navigate-to-booking="handleNavigateToBooking"
            @navigate-to-date="handleNavigateToDate"
            @navigate-to-property="handleNavigateToProperty"
            @filter-by-property="handleFilterByProperty"
            @filter-by-owner="handleFilterByOwner"
            @filter-by-status="handleFilterByStatus"
            @assign-cleaner="handleAssignCleaner"
            @generate-reports="handleGenerateReports"
            @manage-system="handleManageSystem"
            @emergency-response="handleEmergencyResponse"
            @create-booking="handleCreateBooking"
            @create-property="handleCreateProperty"
          />
        </v-col>

        <!-- Demo Information Panel -->
        <v-col
          cols="12"
          md="8"
          lg="9"
        >
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon
                icon="mdi-information"
                class="mr-2"
              />
              AdminSidebar Demo - System-wide Data Access
            </v-card-title>
            <v-card-text>
              <v-alert
                type="info"
                variant="tonal"
                class="mb-4"
              >
                <strong>Role-Based Architecture:</strong> This AdminSidebar shows ALL data across ALL property owners (no filtering). 
                Compare this to OwnerSidebar which filters data by owner_id === currentUser.id.
              </v-alert>

              <!-- Demo Data Summary -->
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <h3 class="text-h6 mb-3">
                    System-wide Data Summary
                  </h3>
                  <v-list density="compact">
                    <v-list-item>
                      <v-list-item-title>Total Properties</v-list-item-title>
                      <v-list-item-subtitle>{{ demoProperties.size }} across {{ uniqueOwners }} owners</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Urgent Turns Today</v-list-item-title>
                      <v-list-item-subtitle>{{ demoTodayTurns.size }} system-wide</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Upcoming Cleanings</v-list-item-title>
                      <v-list-item-subtitle>{{ demoUpcomingCleanings.size }} across all properties</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Available Cleaners</v-list-item-title>
                      <v-list-item-subtitle>{{ demoCleaners.size }} staff members</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <h3 class="text-h6 mb-3">
                    Admin Features Demonstrated
                  </h3>
                  <v-list density="compact">
                    <v-list-item>
                      <v-list-item-title>System-wide Turn Alerts</v-list-item-title>
                      <v-list-item-subtitle>All urgent turns across all owners</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Advanced Filtering</v-list-item-title>
                      <v-list-item-subtitle>By property, owner, and status</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Business Analytics</v-list-item-title>
                      <v-list-item-subtitle>System-wide metrics and KPIs</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Cleaner Management</v-list-item-title>
                      <v-list-item-subtitle>Staff availability and assignments</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Admin Quick Actions</v-list-item-title>
                      <v-list-item-subtitle>Business management tools</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>

              <!-- Event Log -->
              <v-divider class="my-4" />
              <h3 class="text-h6 mb-3">
                Event Log
              </h3>
              <v-card
                variant="outlined"
                max-height="300"
                class="overflow-y-auto"
              >
                <v-card-text>
                  <div
                    v-if="eventLog.length === 0"
                    class="text-center text-medium-emphasis"
                  >
                    No events logged yet. Interact with the AdminSidebar to see events.
                  </div>
                  <v-list
                    v-else
                    density="compact"
                  >
                    <v-list-item
                      v-for="(event, index) in eventLog.slice().reverse()"
                      :key="index"
                      class="mb-1"
                    >
                      <v-list-item-title class="text-caption">
                        <v-chip
                          size="x-small"
                          color="primary"
                          class="mr-2"
                        >
                          {{ event.timestamp }}
                        </v-chip>
                        <strong>{{ event.action }}</strong>
                      </v-list-item-title>
                      <v-list-item-subtitle class="text-caption">
                        {{ event.details }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>

              <!-- Toggle Loading State -->
              <v-divider class="my-4" />
              <v-btn
                :color="loading ? 'error' : 'primary'"
                variant="outlined"
                @click="loading = !loading"
              >
                {{ loading ? 'Stop Loading' : 'Test Loading State' }}
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AdminSidebar from '../components/smart/admin/AdminSidebar.vue';
import type { Booking, Property, User, Cleaner } from '@/types';

// Demo state
const loading = ref(false);
const eventLog = ref<Array<{ timestamp: string; action: string; details: string }>>([]);

// Generate comprehensive demo data across multiple property owners
// Create demo users map
const demoUsers = ref(new Map<string, User>());
demoUsers.value.set('owner-1', {
  id: 'owner-1',
  email: 'sarah.johnson@email.com',
  name: 'Sarah Johnson',
  role: 'owner',
  settings: { 
    theme: 'light', 
    notifications: true,
    timezone: 'America/New_York',
    language: 'en'
  },
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z'
});
demoUsers.value.set('owner-2', {
  id: 'owner-2',
  email: 'mike.chen@email.com',
  name: 'Mike Chen',
  role: 'owner',
  settings: { 
    theme: 'dark', 
    notifications: true,
    timezone: 'America/Los_Angeles',
    language: 'en'
  },
  created_at: '2024-01-20T14:30:00Z',
  updated_at: '2024-01-20T14:30:00Z'
});
demoUsers.value.set('owner-3', {
  id: 'owner-3',
  email: 'lisa.rodriguez@email.com',
  name: 'Lisa Rodriguez',
  role: 'owner',
  settings: { 
    theme: 'light', 
    notifications: false,
    timezone: 'America/Chicago',
    language: 'es'
  },
  created_at: '2024-02-01T09:15:00Z',
  updated_at: '2024-02-01T09:15:00Z'
});
demoUsers.value.set('owner-4', {
  id: 'owner-4',
  email: 'david.kim@email.com',
  name: 'David Kim',
  role: 'owner',
  settings: { 
    theme: 'light', 
    notifications: true,
    timezone: 'America/New_York',
    language: 'ko'
  },
  created_at: '2024-02-10T16:45:00Z',
  updated_at: '2024-02-10T16:45:00Z'
});

// Create demo cleaners map
const demoCleaners = ref(new Map<string, Cleaner>());
demoCleaners.value.set('cleaner-1', {
  id: 'cleaner-1',
  email: 'maria.garcia@cleaningco.com',
  name: 'Maria Garcia',
  role: 'cleaner',
  settings: { 
    theme: 'light', 
    notifications: true,
    timezone: 'America/New_York',
    language: 'en'
  },
  skills: ['deep-cleaning', 'eco-friendly'],
  max_daily_bookings: 4,
  created_at: '2024-01-10T08:00:00Z',
  updated_at: '2024-01-10T08:00:00Z'
});
demoCleaners.value.set('cleaner-2', {
  id: 'cleaner-2',
  email: 'james.wilson@cleaningco.com',
  name: 'James Wilson',
  role: 'cleaner',
  settings: { 
    theme: 'light', 
    notifications: true,
    timezone: 'America/New_York',
    language: 'en'
  },
  skills: ['standard-cleaning', 'move-out'],
  max_daily_bookings: 5,
  created_at: '2024-01-12T08:00:00Z',
  updated_at: '2024-01-12T08:00:00Z'
});
demoCleaners.value.set('cleaner-3', {
  id: 'cleaner-3',
  email: 'anna.petrov@cleaningco.com',
  name: 'Anna Petrov',
  role: 'cleaner',
  settings: { 
    theme: 'dark', 
    notifications: true,
    timezone: 'America/New_York',
    language: 'en'
  },
  skills: ['luxury-cleaning', 'antique-care'],
  max_daily_bookings: 3,
  created_at: '2024-01-15T08:00:00Z',
  updated_at: '2024-01-15T08:00:00Z'
});
demoCleaners.value.set('cleaner-4', {
  id: 'cleaner-4',
  email: 'carlos.mendez@cleaningco.com',
  name: 'Carlos Mendez',
  role: 'cleaner',
  settings: { 
    theme: 'light', 
    notifications: false,
    timezone: 'America/New_York',
    language: 'es'
  },
  skills: ['standard-cleaning', 'pet-friendly'],
  max_daily_bookings: 4,
  created_at: '2024-01-18T08:00:00Z',
  updated_at: '2024-01-18T08:00:00Z'
});

const demoProperties = ref(new Map<string, Property>([
  // Sarah Johnson's properties
  ['prop-1', {
    id: 'prop-1',
    owner_id: 'owner-1',
    name: 'Downtown Loft',
    address: '123 Main St, Downtown',
    cleaning_duration: 120,
    special_instructions: 'Key in lockbox, code 1234',
    pricing_tier: 'premium',
    active: true,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  }],
  ['prop-2', {
    id: 'prop-2',
    owner_id: 'owner-1',
    name: 'Beachside Condo',
    address: '456 Ocean Ave, Beach District',
    cleaning_duration: 90,
    special_instructions: 'Check balcony doors',
    pricing_tier: 'luxury',
    active: true,
    created_at: '2024-01-16T11:00:00Z',
    updated_at: '2024-01-16T11:00:00Z'
  }],
  // Mike Chen's properties
  ['prop-3', {
    id: 'prop-3',
    owner_id: 'owner-2',
    name: 'Mountain Cabin',
    address: '789 Pine Rd, Mountain View',
    cleaning_duration: 150,
    special_instructions: 'Check fireplace area',
    pricing_tier: 'premium',
    active: true,
    created_at: '2024-01-20T15:00:00Z',
    updated_at: '2024-01-20T15:00:00Z'
  }],
  ['prop-4', {
    id: 'prop-4',
    owner_id: 'owner-2',
    name: 'City Studio',
    address: '321 Urban St, City Center',
    cleaning_duration: 60,
    special_instructions: 'Small space, focus on bathroom',
    pricing_tier: 'basic',
    active: true,
    created_at: '2024-01-21T09:30:00Z',
    updated_at: '2024-01-21T09:30:00Z'
  }],
  // Lisa Rodriguez's properties
  ['prop-5', {
    id: 'prop-5',
    owner_id: 'owner-3',
    name: 'Suburban House',
    address: '654 Maple Dr, Suburbs',
    cleaning_duration: 180,
    special_instructions: 'Pet-friendly cleaning products only',
    pricing_tier: 'premium',
    active: true,
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z'
  }],
  // David Kim's properties
  ['prop-6', {
    id: 'prop-6',
    owner_id: 'owner-4',
    name: 'Historic Townhouse',
    address: '987 Heritage Ln, Old Town',
    cleaning_duration: 200,
    special_instructions: 'Careful with antique furniture',
    pricing_tier: 'luxury',
    active: true,
    created_at: '2024-02-10T17:00:00Z',
    updated_at: '2024-02-10T17:00:00Z'
  }],
  ['prop-7', {
    id: 'prop-7',
    owner_id: 'owner-4',
    name: 'Modern Apartment',
    address: '147 Tech Blvd, Innovation District',
    cleaning_duration: 100,
    special_instructions: 'Smart home - use app for access',
    pricing_tier: 'premium',
    active: true,
    created_at: '2024-02-11T08:30:00Z',
    updated_at: '2024-02-11T08:30:00Z'
  }]
]));

// Generate today's urgent turns across multiple owners
const demoTodayTurns = ref(new Map<string, Booking>([
  ['turn-1', {
    id: 'turn-1',
    property_id: 'prop-1',
    owner_id: 'owner-1',
    checkout_date: new Date().toISOString().split('T')[0] + 'T11:00:00Z',
    checkin_date: new Date().toISOString().split('T')[0] + 'T15:00:00Z',
    booking_type: 'turn',
    guest_count: 2,
    notes: 'Same-day turnaround - high priority',
    status: 'pending',
    assigned_cleaner_id: 'cleaner-1',
    priority: 'urgent',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }],
  ['turn-2', {
    id: 'turn-2',
    property_id: 'prop-3',
    owner_id: 'owner-2',
    checkout_date: new Date().toISOString().split('T')[0] + 'T10:00:00Z',
    checkin_date: new Date().toISOString().split('T')[0] + 'T16:00:00Z',
    booking_type: 'turn',
    guest_count: 4,
    notes: 'Mountain cabin - extra cleaning needed',
    status: 'scheduled',
    assigned_cleaner_id: 'cleaner-2',
    priority: 'urgent',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }],
  ['turn-3', {
    id: 'turn-3',
    property_id: 'prop-5',
    owner_id: 'owner-3',
    checkout_date: new Date().toISOString().split('T')[0] + 'T12:00:00Z',
    checkin_date: new Date().toISOString().split('T')[0] + 'T17:00:00Z',
    booking_type: 'turn',
    guest_count: 3,
    notes: 'Pet-friendly products required',
    status: 'pending',
    priority: 'urgent',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }]
]));

// Generate upcoming cleanings across multiple owners
const demoUpcomingCleanings = ref(new Map<string, Booking>([
  ['booking-1', {
    id: 'booking-1',
    property_id: 'prop-2',
    owner_id: 'owner-1',
    checkout_date: getTomorrowDate() + 'T14:00:00Z',
    checkin_date: getTomorrowDate() + 'T16:00:00Z',
    booking_type: 'standard',
    guest_count: 2,
    notes: 'Regular cleaning',
    status: 'scheduled',
    assigned_cleaner_id: 'cleaner-3',
    priority: 'normal',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }],
  ['booking-2', {
    id: 'booking-2',
    property_id: 'prop-4',
    owner_id: 'owner-2',
    checkout_date: getDateInDays(2) + 'T11:00:00Z',
    checkin_date: getDateInDays(2) + 'T13:00:00Z',
    booking_type: 'turn',
    guest_count: 1,
    notes: 'Quick studio turnaround',
    status: 'pending',
    priority: 'high',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }],
  ['booking-3', {
    id: 'booking-3',
    property_id: 'prop-6',
    owner_id: 'owner-4',
    checkout_date: getDateInDays(3) + 'T10:00:00Z',
    checkin_date: getDateInDays(3) + 'T15:00:00Z',
    booking_type: 'standard',
    guest_count: 4,
    notes: 'Historic property - careful cleaning',
    status: 'scheduled',
    assigned_cleaner_id: 'cleaner-4',
    priority: 'normal',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }],
  ['booking-4', {
    id: 'booking-4',
    property_id: 'prop-7',
    owner_id: 'owner-4',
    checkout_date: getDateInDays(4) + 'T13:00:00Z',
    checkin_date: getDateInDays(4) + 'T15:00:00Z',
    booking_type: 'standard',
    guest_count: 2,
    notes: 'Smart home access via app',
    status: 'pending',
    priority: 'normal',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }]
]));

// Computed properties
const uniqueOwners = computed(() => {
  const ownerIds = new Set<string>();
  Array.from(demoProperties.value.values()).forEach(property => {
    ownerIds.add(property.owner_id);
  });
  return ownerIds.size;
});

// Helper functions
function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

function getDateInDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

function logEvent(action: string, details: string): void {
  const timestamp = new Date().toLocaleTimeString();
  eventLog.value.push({ timestamp, action, details });
  
  // Keep only last 20 events
  if (eventLog.value.length > 20) {
    eventLog.value = eventLog.value.slice(-20);
  }
}

// Event handlers
const handleNavigateToBooking = (bookingId: string): void => {
  logEvent('Navigate to Booking', `Booking ID: ${bookingId}`);
};

const handleNavigateToDate = (date: Date): void => {
  logEvent('Navigate to Date', `Date: ${date.toLocaleDateString()}`);
};

const handleNavigateToProperty = (propertyId: string): void => {
  logEvent('Navigate to Property', `Property ID: ${propertyId}`);
};

const handleFilterByProperty = (propertyId: string | null): void => {
  const propertyName = propertyId ? demoProperties.value.get(propertyId)?.name || 'Unknown' : 'All Properties';
  logEvent('Filter by Property', `Property: ${propertyName}`);
};

const handleFilterByOwner = (ownerId: string | null): void => {
  const ownerName = ownerId ? demoUsers.value.get(ownerId)?.name || 'Unknown' : 'All Owners';
  logEvent('Filter by Owner', `Owner: ${ownerName}`);
};

const handleFilterByStatus = (status: string | null): void => {
  logEvent('Filter by Status', `Status: ${status || 'All Statuses'}`);
};

const handleAssignCleaner = (data: { bookingId: string, cleanerId?: string }): void => {
  const cleanerName = data.cleanerId ? demoCleaners.value.get(data.cleanerId)?.name || 'Unknown' : 'TBD';
  logEvent('Assign Cleaner', `Booking: ${data.bookingId}, Cleaner: ${cleanerName}`);
};

const handleGenerateReports = (): void => {
  logEvent('Generate Reports', 'Business reports generation requested');
};

const handleManageSystem = (): void => {
  logEvent('Manage System', 'System management interface requested');
};

const handleEmergencyResponse = (): void => {
  logEvent('Emergency Response', 'Emergency response protocol activated');
};

const handleCreateBooking = (): void => {
  logEvent('Create Booking', 'New booking creation requested');
};

const handleCreateProperty = (): void => {
  logEvent('Create Property', 'New property creation requested');
};

// Initialize demo
onMounted(() => {
  logEvent('Demo Initialized', `AdminSidebar demo loaded with ${demoProperties.value.size} properties across ${uniqueOwners.value} owners`);
});
</script>

<style scoped>
.admin-sidebar-demo {
  height: 100vh;
  overflow: hidden;
}

.overflow-y-auto {
  overflow-y: auto;
}

.v-list-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.v-list-item:last-child {
  border-bottom: none;
}
</style> 