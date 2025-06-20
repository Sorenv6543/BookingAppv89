<template>
  <div class="admin-calendar-demo">
    <v-container fluid>
      <!-- Demo Header -->
      <v-row class="mb-4">
        <v-col>
          <v-card
            class="demo-header"
            elevation="2"
          >
            <v-card-title class="d-flex align-center">
              <v-icon
                class="mr-3"
                color="primary"
              >
                mdi-calendar-multiple
              </v-icon>
              <span>AdminCalendar Component Demo</span>
              <v-spacer />
              <v-chip
                color="success"
                variant="elevated"
              >
                <v-icon start>
                  mdi-check-circle
                </v-icon>
                TASK-039H Complete
              </v-chip>
            </v-card-title>
            <v-card-text>
              <p class="mb-2">
                <strong>Role-Based Multi-Tenant Calendar:</strong> Admin interface showing ALL bookings across ALL property owners with advanced management features.
              </p>
              <v-row>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-chip
                    size="small"
                    color="error"
                    class="mr-2"
                  >
                    🔥 Turn Bookings
                  </v-chip>
                  <span class="text-caption">Urgent same-day turnovers</span>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-chip
                    size="small"
                    color="warning"
                    class="mr-2"
                  >
                    ⚠️ Unassigned
                  </v-chip>
                  <span class="text-caption">Need cleaner assignment</span>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-chip
                    size="small"
                    color="success"
                    class="mr-2"
                  >
                    👤 Assigned
                  </v-chip>
                  <span class="text-caption">Cleaner assigned</span>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Demo Stats -->
      <v-row class="mb-4">
        <v-col
          cols="6"
          md="3"
        >
          <v-card
            class="text-center"
            elevation="1"
          >
            <v-card-text>
              <div class="text-h4 text-primary">
                {{ demoStats.totalBookings }}
              </div>
              <div class="text-caption">
                Total Bookings
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="6"
          md="3"
        >
          <v-card
            class="text-center"
            elevation="1"
          >
            <v-card-text>
              <div class="text-h4 text-error">
                {{ demoStats.urgentTurns }}
              </div>
              <div class="text-caption">
                Urgent Turns
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="6"
          md="3"
        >
          <v-card
            class="text-center"
            elevation="1"
          >
            <v-card-text>
              <div class="text-h4 text-warning">
                {{ demoStats.unassigned }}
              </div>
              <div class="text-caption">
                Unassigned
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="6"
          md="3"
        >
          <v-card
            class="text-center"
            elevation="1"
          >
            <v-card-text>
              <div class="text-h4 text-success">
                {{ demoStats.assigned }}
              </div>
              <div class="text-caption">
                Assigned
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- AdminCalendar Component -->
      <v-row>
        <v-col>
          <AdminCalendar
            :bookings="demoBookings"
            :properties="demoProperties"
            :users="demoUsers"
            :loading="loading"
            @date-select="handleDateSelect"
            @event-click="handleEventClick"
            @event-drop="handleEventDrop"
            @create-booking="handleCreateBooking"
            @update-booking="handleUpdateBooking"
            @assign-cleaner="handleAssignCleaner"
            @update-booking-status="handleUpdateBookingStatus"
            @view-change="handleViewChange"
            @date-change="handleDateChange"
          />
        </v-col>
      </v-row>

      <!-- Demo Actions -->
      <v-row class="mt-4">
        <v-col>
          <v-card
            class="demo-actions"
            elevation="1"
          >
            <v-card-title>Demo Actions</v-card-title>
            <v-card-text>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-btn
                    color="primary"
                    variant="outlined"
                    block
                    @click="addRandomBooking"
                  >
                    <v-icon start>
                      mdi-plus
                    </v-icon>
                    Add Random Booking
                  </v-btn>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-btn
                    color="error"
                    variant="outlined"
                    block
                    @click="addUrgentTurn"
                  >
                    <v-icon start>
                      mdi-fire
                    </v-icon>
                    Add Urgent Turn
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Event Log -->
      <v-row class="mt-4">
        <v-col>
          <v-card
            class="demo-log"
            elevation="1"
          >
            <v-card-title>
              Event Log
              <v-spacer />
              <v-btn
                size="small"
                variant="text"
                @click="clearEventLog"
              >
                Clear
              </v-btn>
            </v-card-title>
            <v-card-text>
              <div class="event-log-container">
                <div
                  v-for="(event, index) in eventLog"
                  :key="index"
                  class="event-log-item"
                >
                  <v-chip
                    :color="getEventColor(event.type)"
                    size="small"
                    class="mr-2"
                  >
                    {{ event.type }}
                  </v-chip>
                  <span class="text-caption">{{ event.timestamp }}</span>
                  <div class="mt-1">
                    {{ event.message }}
                  </div>
                </div>
                <div
                  v-if="eventLog.length === 0"
                  class="text-center text-disabled"
                >
                  No events logged yet. Interact with the calendar to see events.
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import AdminCalendar from '../components/smart/admin/AdminCalendar.vue';
import type { Booking, Property, User, Cleaner } from '@/types';

// Demo state
const loading = ref(false);
const eventLog = ref<Array<{ type: string; message: string; timestamp: string }>>([]);

// Create demo data Maps
const demoBookings = ref(new Map<string, Booking>());
const demoProperties = ref(new Map<string, Property>());
const demoUsers = ref(new Map<string, User>());

// Demo statistics
const demoStats = computed(() => {
  const bookings = Array.from(demoBookings.value.values());
  return {
    totalBookings: bookings.length,
    urgentTurns: bookings.filter(b => b.booking_type === 'turn').length,
    unassigned: bookings.filter(b => !b.assigned_cleaner_id).length,
    assigned: bookings.filter(b => !!b.assigned_cleaner_id).length
  };
});

// Initialize demo data
const initializeDemoData = (): void => {
  // Demo Users (Property Owners + Cleaners + Admin)
  const users: User[] = [
    // Property Owners
    {
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
    },
    {
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
    },
    {
      id: 'owner-3',
      email: 'lisa.rodriguez@email.com',
      name: 'Lisa Rodriguez',
      role: 'owner',
      settings: { 
        theme: 'light', 
        notifications: false,
        timezone: 'America/Chicago',
        language: 'en'
      },
      created_at: '2024-02-01T09:15:00Z',
      updated_at: '2024-02-01T09:15:00Z'
    },
    // Admin User
    {
      id: 'admin-1',
      email: 'admin@cleaningco.com',
      name: 'Admin User',
      role: 'admin',
      settings: { 
        theme: 'light', 
        notifications: true,
        timezone: 'America/New_York',
        language: 'en'
      },
      created_at: '2024-01-01T08:00:00Z',
      updated_at: '2024-01-01T08:00:00Z'
    }
  ];

  // Demo Cleaners (with Cleaner interface properties)
  const cleaners: Cleaner[] = [
    {
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
    },
    {
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
    },
    {
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
      skills: ['deep-cleaning', 'move-in'],
      max_daily_bookings: 3,
      created_at: '2024-01-15T08:00:00Z',
      updated_at: '2024-01-15T08:00:00Z'
    }
  ];

  // Combine all users
  const allUsers = [...users, ...cleaners];
  allUsers.forEach(user => {
    demoUsers.value.set(user.id, user);
  });

  // Demo Properties (across multiple owners)
  const properties: Property[] = [
    // Sarah Johnson's properties
    {
      id: 'prop-1',
      name: 'Downtown Loft',
      address: '123 Main St, New York, NY 10001',
      owner_id: 'owner-1',
      bedrooms: 2,
      bathrooms: 2,
      square_feet: 1200,
      property_type: 'apartment',
      pricing_tier: 'premium',
      cleaning_duration: 120,
      active: true,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 'prop-2',
      name: 'Brooklyn Heights Studio',
      address: '456 Heights Ave, Brooklyn, NY 11201',
      owner_id: 'owner-1',
      bedrooms: 1,
      bathrooms: 1,
      square_feet: 800,
      property_type: 'apartment',
      pricing_tier: 'standard',
      cleaning_duration: 90,
      active: true,
      created_at: '2024-01-16T10:00:00Z',
      updated_at: '2024-01-16T10:00:00Z'
    },
    // Mike Chen's properties
    {
      id: 'prop-3',
      name: 'Hollywood Hills House',
      address: '789 Hills Dr, Los Angeles, CA 90210',
      owner_id: 'owner-2',
      bedrooms: 4,
      bathrooms: 3,
      square_feet: 2500,
      property_type: 'house',
      pricing_tier: 'luxury',
      cleaning_duration: 180,
      active: true,
      created_at: '2024-01-20T14:30:00Z',
      updated_at: '2024-01-20T14:30:00Z'
    },
    {
      id: 'prop-4',
      name: 'Santa Monica Condo',
      address: '321 Beach Blvd, Santa Monica, CA 90401',
      owner_id: 'owner-2',
      bedrooms: 2,
      bathrooms: 2,
      square_feet: 1400,
      property_type: 'condo',
      pricing_tier: 'premium',
      cleaning_duration: 120,
      active: true,
      created_at: '2024-01-21T14:30:00Z',
      updated_at: '2024-01-21T14:30:00Z'
    },
    // Lisa Rodriguez's properties
    {
      id: 'prop-5',
      name: 'Chicago Loop Apartment',
      address: '654 Loop St, Chicago, IL 60601',
      owner_id: 'owner-3',
      bedrooms: 3,
      bathrooms: 2,
      square_feet: 1600,
      property_type: 'apartment',
      pricing_tier: 'standard',
      cleaning_duration: 150,
      active: true,
      created_at: '2024-02-01T09:15:00Z',
      updated_at: '2024-02-01T09:15:00Z'
    }
  ];

  properties.forEach(property => {
    demoProperties.value.set(property.id, property);
  });

  // Demo Bookings (mix of assigned/unassigned, turn/standard, different statuses)
  const today = new Date();
  const bookings: Booking[] = [
    // Urgent turns (some assigned, some not)
    {
      id: 'booking-1',
      property_id: 'prop-1',
      owner_id: 'owner-1',
      checkout_date: today.toISOString().split('T')[0] + 'T11:00:00Z',
      checkin_date: today.toISOString().split('T')[0] + 'T15:00:00Z',
      guest_count: 2,
      booking_type: 'turn',
      status: 'pending',
      assigned_cleaner_id: undefined, // Unassigned urgent turn
      notes: 'Same-day turnover - URGENT',
      created_at: '2024-01-25T08:00:00Z',
      updated_at: '2024-01-25T08:00:00Z'
    },
    {
      id: 'booking-2',
      property_id: 'prop-3',
      owner_id: 'owner-2',
      checkout_date: today.toISOString().split('T')[0] + 'T10:00:00Z',
      checkin_date: today.toISOString().split('T')[0] + 'T16:00:00Z',
      guest_count: 4,
      booking_type: 'turn',
      status: 'scheduled',
      assigned_cleaner_id: 'cleaner-1', // Assigned urgent turn
      notes: 'Large house turnover',
      created_at: '2024-01-25T09:00:00Z',
      updated_at: '2024-01-25T09:00:00Z'
    },
    // Tomorrow's bookings
    {
      id: 'booking-3',
      property_id: 'prop-2',
      owner_id: 'owner-1',
      checkout_date: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T12:00:00Z',
      checkin_date: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T16:00:00Z',
      guest_count: 1,
      booking_type: 'standard',
      status: 'pending',
      assigned_cleaner_id: undefined, // Unassigned standard
      notes: 'Standard cleaning',
      created_at: '2024-01-24T10:00:00Z',
      updated_at: '2024-01-24T10:00:00Z'
    },
    {
      id: 'booking-4',
      property_id: 'prop-4',
      owner_id: 'owner-2',
      checkout_date: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T11:00:00Z',
      checkin_date: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T15:00:00Z',
      guest_count: 2,
      booking_type: 'standard',
      status: 'scheduled',
      assigned_cleaner_id: 'cleaner-2', // Assigned standard
      notes: 'Regular cleaning',
      created_at: '2024-01-24T11:00:00Z',
      updated_at: '2024-01-24T11:00:00Z'
    },
    // Day after tomorrow
    {
      id: 'booking-5',
      property_id: 'prop-5',
      owner_id: 'owner-3',
      checkout_date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T10:00:00Z',
      checkin_date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T14:00:00Z',
      guest_count: 3,
      booking_type: 'turn',
      status: 'in_progress',
      assigned_cleaner_id: 'cleaner-3', // In progress turn
      notes: 'Deep cleaning required',
      created_at: '2024-01-23T12:00:00Z',
      updated_at: '2024-01-25T13:00:00Z'
    },
    // Completed booking
    {
      id: 'booking-6',
      property_id: 'prop-1',
      owner_id: 'owner-1',
      checkout_date: new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T11:00:00Z',
      checkin_date: new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T15:00:00Z',
      guest_count: 2,
      booking_type: 'standard',
      status: 'completed',
      assigned_cleaner_id: 'cleaner-1',
      notes: 'Completed successfully',
      created_at: '2024-01-22T10:00:00Z',
      updated_at: '2024-01-24T16:00:00Z'
    }
  ];

  bookings.forEach(booking => {
    demoBookings.value.set(booking.id, booking);
  });

  logEvent('init', 'Demo data initialized with comprehensive multi-tenant test data');
};

// Event handlers
const handleDateSelect = (selectInfo: DateSelectArg): void => {
  logEvent('dateSelect', `Date range selected: ${selectInfo.startStr} to ${selectInfo.endStr}`);
};

const handleEventClick = (clickInfo: EventClickArg): void => {
  const booking = clickInfo.event.extendedProps.booking as Booking;
  logEvent('eventClick', `Clicked booking: ${booking.id} (${booking.booking_type})`);
};

const handleEventDrop = (dropInfo: EventDropArg): void => {
  const booking = dropInfo.event.extendedProps.booking as Booking;
  logEvent('eventDrop', `Moved booking: ${booking.id} to ${dropInfo.event.startStr}`);
};

const handleCreateBooking = (data: { start: string; end: string; propertyId?: string }): void => {
  logEvent('createBooking', `Create booking request: ${data.start} to ${data.end}`);
};

const handleUpdateBooking = (data: { id: string; updates: Partial<Booking> }): void => {
  const booking = demoBookings.value.get(data.id);
  if (booking) {
    const updatedBooking = { ...booking, ...data.updates };
    demoBookings.value.set(data.id, updatedBooking);
    logEvent('updateBooking', `Updated booking: ${data.id}`);
  }
};

const handleAssignCleaner = (data: { bookingId: string; cleanerId: string; notes?: string }): void => {
  const booking = demoBookings.value.get(data.bookingId);
  const cleaner = demoUsers.value.get(data.cleanerId);
  if (booking && cleaner) {
    booking.assigned_cleaner_id = data.cleanerId;
    booking.status = 'scheduled';
    demoBookings.value.set(data.bookingId, booking);
    logEvent('assignCleaner', `Assigned ${cleaner.name} to booking ${data.bookingId}`);
  }
};

const handleUpdateBookingStatus = (data: { bookingId: string; status: Booking['status'] }): void => {
  const booking = demoBookings.value.get(data.bookingId);
  if (booking) {
    booking.status = data.status;
    demoBookings.value.set(data.bookingId, booking);
    logEvent('updateStatus', `Changed booking ${data.bookingId} status to ${data.status}`);
  }
};

const handleViewChange = (view: string): void => {
  logEvent('viewChange', `Calendar view changed to: ${view}`);
};

const handleDateChange = (date: Date): void => {
  logEvent('dateChange', `Calendar date changed to: ${date.toDateString()}`);
};

// Demo actions
const addRandomBooking = (): void => {
  const properties = Array.from(demoProperties.value.values());
  const randomProperty = properties[Math.floor(Math.random() * properties.length)];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const newBooking: Booking = {
    id: `booking-${Date.now()}`,
    property_id: randomProperty.id,
    owner_id: randomProperty.owner_id,
    checkout_date: tomorrow.toISOString().split('T')[0] + 'T12:00:00Z',
    checkin_date: tomorrow.toISOString().split('T')[0] + 'T16:00:00Z',
    guest_count: Math.floor(Math.random() * 4) + 1,
    booking_type: 'standard',
    status: 'pending',
    assigned_cleaner_id: undefined,
    notes: 'Demo booking',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  demoBookings.value.set(newBooking.id, newBooking);
  logEvent('demo', `Added random booking for ${randomProperty.name}`);
};

const addUrgentTurn = (): void => {
  const properties = Array.from(demoProperties.value.values());
  const randomProperty = properties[Math.floor(Math.random() * properties.length)];
  const today = new Date();
  
  const newBooking: Booking = {
    id: `turn-${Date.now()}`,
    property_id: randomProperty.id,
    owner_id: randomProperty.owner_id,
    checkout_date: today.toISOString().split('T')[0] + 'T11:00:00Z',
    checkin_date: today.toISOString().split('T')[0] + 'T15:00:00Z',
    guest_count: Math.floor(Math.random() * 4) + 1,
    booking_type: 'turn',
    status: 'pending',
    assigned_cleaner_id: undefined,
    notes: 'URGENT: Same-day turnover',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  demoBookings.value.set(newBooking.id, newBooking);
  logEvent('demo', `Added urgent turn for ${randomProperty.name}`);
};

// Event logging
const logEvent = (type: string, message: string): void => {
  eventLog.value.unshift({
    type,
    message,
    timestamp: new Date().toLocaleTimeString()
  });
  
  // Keep only last 20 events
  if (eventLog.value.length > 20) {
    eventLog.value = eventLog.value.slice(0, 20);
  }
};

const clearEventLog = (): void => {
  eventLog.value = [];
};

const getEventColor = (type: string): string => {
  const colors: Record<string, string> = {
    init: 'info',
    dateSelect: 'primary',
    eventClick: 'secondary',
    eventDrop: 'warning',
    createBooking: 'success',
    updateBooking: 'info',
    assignCleaner: 'success',
    updateStatus: 'warning',
    viewChange: 'primary',
    dateChange: 'secondary',
    demo: 'purple'
  };
  return colors[type] || 'default';
};

// Initialize demo data on mount
onMounted(() => {
  initializeDemoData();
});
</script>

<style scoped>
.admin-calendar-demo {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
}

.demo-header {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary), 0.1), rgb(var(--v-theme-secondary), 0.1));
}

.demo-actions,
.demo-log {
  background: rgb(var(--v-theme-surface));
}

.event-log-container {
  max-height: 300px;
  overflow-y: auto;
}

.event-log-item {
  padding: 8px 0;
  border-bottom: 1px solid rgb(var(--v-theme-outline), 0.12);
}

.event-log-item:last-child {
  border-bottom: none;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .admin-calendar-demo .v-container {
    padding: 12px;
  }
}
</style> 