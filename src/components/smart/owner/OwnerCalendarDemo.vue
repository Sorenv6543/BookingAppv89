<template>
  <div class="owner-calendar-demo">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-calendar-account</v-icon>
              OwnerCalendar Demo
              <v-spacer />
              <v-chip color="primary" variant="outlined">
                Owner View
              </v-chip>
            </v-card-title>
            
            <v-card-subtitle>
              Simplified calendar interface for property owners - shows only their bookings with basic controls
            </v-card-subtitle>

            <v-card-text>
              <!-- Calendar Controls -->
              <div class="demo-controls mb-4">
                <v-row align="center">
                  <v-col cols="auto">
                    <v-btn
                      icon="mdi-arrow-left"
                      variant="text"
                      @click="handlePrevious"
                    />
                    <v-btn 
                      variant="outlined" 
                      class="mx-2" 
                      @click="handleGoToday"
                    >
                      Today
                    </v-btn>
                    <v-btn
                      icon="mdi-arrow-right"
                      variant="text"
                      @click="handleNext"
                    />
                  </v-col>
                  
                  <v-col cols="auto">
                    <div class="text-h6">
                      {{ formattedDate }}
                    </div>
                  </v-col>
                  
                  <v-spacer />
                  
                  <v-col cols="auto">
                    <v-btn-toggle
                      v-model="currentView"
                      mandatory
                      @update:model-value="handleViewChange"
                    >
                      <v-btn value="dayGridMonth">
                        Month
                      </v-btn>
                      <v-btn value="timeGridWeek">
                        Week
                      </v-btn>
                      <v-btn value="timeGridDay">
                        Day
                      </v-btn>
                    </v-btn-toggle>
                  </v-col>
                </v-row>
              </div>

              <!-- Owner Calendar Component -->
              <OwnerCalendar
                ref="ownerCalendarRef"
                :bookings="ownerBookings"
                :properties="ownerProperties"
                :loading="loading"
                :current-view="currentView"
                :current-date="currentDate"
                @date-select="handleDateSelect"
                @event-click="handleEventClick"
                @create-booking="handleCreateBooking"
                @view-change="handleCalendarViewChange"
                @date-change="handleCalendarDateChange"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Demo Information -->
      <v-row class="mt-4">
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>
              <v-icon class="mr-2">mdi-information</v-icon>
              Owner Calendar Features
            </v-card-title>
            <v-card-text>
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title>✅ Shows only owner's bookings</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>✅ Basic calendar views (Month, Week, Day)</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>✅ Click to edit bookings</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>✅ Date selection for new bookings</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>✅ Turn booking highlighting</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>❌ No drag-and-drop (admin feature)</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>❌ No cleaner assignment (admin feature)</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>
              <v-icon class="mr-2">mdi-chart-bar</v-icon>
              Owner Data Summary
            </v-card-title>
            <v-card-text>
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title>
                    Properties: {{ ownerProperties.size }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    Total Bookings: {{ ownerBookings.size }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    Turn Bookings: {{ turnBookingsCount }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    Standard Bookings: {{ standardBookingsCount }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    Pending: {{ pendingBookingsCount }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Event Log -->
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-icon class="mr-2">mdi-console</v-icon>
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
              <div class="event-log">
                <div
                  v-for="(event, index) in eventLog"
                  :key="index"
                  class="event-log-item"
                >
                  <v-chip
                    :color="event.type === 'emit' ? 'primary' : 'secondary'"
                    size="small"
                    class="mr-2"
                  >
                    {{ event.type }}
                  </v-chip>
                  <span class="text-caption">
                    {{ event.timestamp }} - {{ event.from }} → {{ event.to }}: {{ event.event }}
                    <span v-if="event.data" class="text-grey">
                      ({{ JSON.stringify(event.data) }})
                    </span>
                  </span>
                </div>
                <div v-if="eventLog.length === 0" class="text-grey text-center py-4">
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
import OwnerCalendar from './OwnerCalendar.vue';
import type { Booking, Property } from '@/types';
import type { DateSelectArg, EventClickArg } from '@fullcalendar/core';

// Demo state
const ownerCalendarRef = ref<InstanceType<typeof OwnerCalendar> | null>(null);
const currentView = ref<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('timeGridWeek');
const currentDate = ref<Date>(new Date());
const loading = ref(false);
const eventLog = ref<Array<{
  timestamp: string;
  from: string;
  to: string;
  event: string;
  type: 'emit' | 'receive';
  data?: any;
}>>([]);

// Sample owner data (filtered to single owner)
const ownerId = 'owner-1';

const ownerProperties = ref<Map<string, Property>>(new Map([
  ['prop-1', {
    id: 'prop-1',
    owner_id: ownerId,
    name: 'Sunset Villa',
    address: '123 Beach Road, Malibu, CA',
    cleaning_duration: 180,
    special_instructions: 'Pool cleaning required',
    pricing_tier: 'luxury',
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }],
  ['prop-2', {
    id: 'prop-2',
    owner_id: ownerId,
    name: 'Mountain Cabin',
    address: '456 Pine Street, Aspen, CO',
    cleaning_duration: 120,
    special_instructions: 'Fireplace cleaning needed',
    pricing_tier: 'premium',
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }],
  ['prop-3', {
    id: 'prop-3',
    owner_id: ownerId,
    name: 'City Loft',
    address: '789 Downtown Ave, NYC, NY',
    cleaning_duration: 90,
    special_instructions: 'High-rise building, elevator access',
    pricing_tier: 'basic',
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }]
]));

const ownerBookings = ref<Map<string, Booking>>(new Map());

// Generate sample bookings for the owner
const generateOwnerBookings = () => {
  const bookings = new Map<string, Booking>();
  const today = new Date();
  const properties = Array.from(ownerProperties.value.keys());
  
  // Generate bookings for the next 30 days
  for (let i = 0; i < 10; i++) {
    const checkoutDate = new Date(today);
    checkoutDate.setDate(today.getDate() + i * 2);
    
    const checkinDate = new Date(checkoutDate);
    checkinDate.setDate(checkoutDate.getDate() + 1);
    
    const propertyId = properties[i % properties.length];
    const isTurn = Math.random() > 0.7; // 30% chance of turn booking
    const statuses = ['pending', 'scheduled', 'in_progress', 'completed'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const booking: Booking = {
      id: `booking-${i + 1}`,
      property_id: propertyId,
      owner_id: ownerId,
      checkout_date: checkoutDate.toISOString().split('T')[0],
      checkin_date: checkinDate.toISOString().split('T')[0],
      booking_type: isTurn ? 'turn' : 'standard',
      guest_count: Math.floor(Math.random() * 6) + 1,
      notes: isTurn ? 'Same-day turnaround required' : 'Standard cleaning',
      status: status as any,
      priority: isTurn ? 'urgent' : 'normal',
      created_at: today.toISOString(),
      updated_at: today.toISOString()
    };
    
    bookings.set(booking.id, booking);
  }
  
  ownerBookings.value = bookings;
};

// Computed properties for demo stats
const turnBookingsCount = computed(() => {
  return Array.from(ownerBookings.value.values())
    .filter(b => b.booking_type === 'turn').length;
});

const standardBookingsCount = computed(() => {
  return Array.from(ownerBookings.value.values())
    .filter(b => b.booking_type === 'standard').length;
});

const pendingBookingsCount = computed(() => {
  return Array.from(ownerBookings.value.values())
    .filter(b => b.status === 'pending').length;
});

const formattedDate = computed(() => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return currentDate.value.toLocaleDateString('en-US', options);
});

// Event handlers
const handleDateSelect = (selectInfo: DateSelectArg) => {
  logEvent('OwnerCalendar', 'OwnerCalendarDemo', 'dateSelect', 'receive', {
    start: selectInfo.startStr,
    end: selectInfo.endStr
  });
  
  console.log('Owner date selected:', selectInfo);
};

const handleEventClick = (clickInfo: EventClickArg) => {
  logEvent('OwnerCalendar', 'OwnerCalendarDemo', 'eventClick', 'receive', {
    id: clickInfo.event.id,
    title: clickInfo.event.title
  });
  
  console.log('Owner event clicked:', clickInfo);
};

const handleCreateBooking = (data: { start: string; end: string; propertyId?: string }) => {
  logEvent('OwnerCalendar', 'OwnerCalendarDemo', 'createBooking', 'receive', data);
  
  console.log('Owner create booking:', data);
};

const handleViewChange = (view: string) => {
  if (ownerCalendarRef.value) {
    ownerCalendarRef.value.changeView(view);
  }
};

const handleCalendarViewChange = (view: string) => {
  logEvent('OwnerCalendar', 'OwnerCalendarDemo', 'viewChange', 'receive', { view });
  currentView.value = view as any;
};

const handleCalendarDateChange = (date: Date) => {
  logEvent('OwnerCalendar', 'OwnerCalendarDemo', 'dateChange', 'receive', { 
    date: date.toISOString() 
  });
  currentDate.value = date;
};

const handlePrevious = () => {
  const date = new Date(currentDate.value);
  
  if (currentView.value === 'dayGridMonth') {
    date.setMonth(date.getMonth() - 1);
  } else if (currentView.value === 'timeGridWeek') {
    date.setDate(date.getDate() - 7);
  } else {
    date.setDate(date.getDate() - 1);
  }
  
  currentDate.value = date;
  if (ownerCalendarRef.value) {
    ownerCalendarRef.value.goToDate(date);
  }
};

const handleNext = () => {
  const date = new Date(currentDate.value);
  
  if (currentView.value === 'dayGridMonth') {
    date.setMonth(date.getMonth() + 1);
  } else if (currentView.value === 'timeGridWeek') {
    date.setDate(date.getDate() + 7);
  } else {
    date.setDate(date.getDate() + 1);
  }
  
  currentDate.value = date;
  if (ownerCalendarRef.value) {
    ownerCalendarRef.value.goToDate(date);
  }
};

const handleGoToday = () => {
  currentDate.value = new Date();
  if (ownerCalendarRef.value) {
    ownerCalendarRef.value.goToDate(new Date());
  }
};

// Event logging
const logEvent = (from: string, to: string, event: string, type: 'emit' | 'receive', data?: any) => {
  eventLog.value.unshift({
    timestamp: new Date().toLocaleTimeString(),
    from,
    to,
    event,
    type,
    data
  });
  
  // Keep only last 20 events
  if (eventLog.value.length > 20) {
    eventLog.value = eventLog.value.slice(0, 20);
  }
};

const clearEventLog = () => {
  eventLog.value = [];
};

// Initialize demo data
onMounted(() => {
  generateOwnerBookings();
});
</script>

<style scoped>
.owner-calendar-demo {
  padding: 16px;
}

.demo-controls {
  border: 1px solid rgb(var(--v-theme-on-surface), 0.12);
  border-radius: 8px;
  padding: 16px;
  background: rgb(var(--v-theme-surface));
}

.event-log {
  max-height: 300px;
  overflow-y: auto;
}

.event-log-item {
  padding: 4px 0;
  border-bottom: 1px solid rgb(var(--v-theme-on-surface), 0.05);
  font-family: monospace;
  font-size: 0.85em;
}

.event-log-item:last-child {
  border-bottom: none;
}
</style> 