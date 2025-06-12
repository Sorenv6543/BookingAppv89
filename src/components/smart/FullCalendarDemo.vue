<template>
  <div class="calendar-demo">
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4">
          <v-card-title>
            Calendar Demo
            <v-spacer></v-spacer>
            <v-btn 
              color="primary" 
              prepend-icon="mdi-plus"
              @click="createRandomBooking"
            >
              Add Random Booking
            </v-btn>
            <v-btn 
              class="ml-2" 
              color="secondary" 
              prepend-icon="mdi-calendar-today"
              @click="goToToday"
            >
              Today
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-select
                  v-model="currentView"
                  label="Calendar View"
                  :items="viewOptions"
                  @update:model-value="changeView"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-select
                  v-model="selectedPropertyId"
                  label="Filter by Property"
                  :items="propertyOptions"
                  @update:model-value="filterByProperty"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-checkbox
                  v-model="showTurnBookings"
                  label="Show Turn Bookings"
                  @update:model-value="refreshCalendar"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-checkbox
                  v-model="showStandardBookings"
                  label="Show Standard Bookings"
                  @update:model-value="refreshCalendar"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col cols="12">
        <FullCalendar
          ref="calendarRef"
          :bookings="filteredBookings"
          :properties="properties"
          @date-select="handleDateSelect"
          @event-click="handleEventClick"
          @event-drop="handleEventDrop"
          @create-booking="handleCreateBooking"
          @update-booking="handleUpdateBooking"
        />
      </v-col>
    </v-row>
    
    <!-- Booking Modal -->
    <v-dialog v-model="bookingDialogOpen" max-width="600px">
      <v-card>
        <v-card-title>
          {{ selectedBooking ? 'Edit Booking' : 'Create Booking' }}
        </v-card-title>
        <v-card-text>
          <v-select
            v-model="bookingForm.property_id"
            label="Property"
            :items="propertySelectItems"
          ></v-select>
          <v-text-field
            v-model="bookingForm.checkout_date"
            label="Checkout Date"
            type="datetime-local"
          ></v-text-field>
          <v-text-field
            v-model="bookingForm.checkin_date"
            label="Checkin Date"
            type="datetime-local"
          ></v-text-field>
          <v-select
            v-model="bookingForm.booking_type"
            label="Booking Type"
            :items="['turn', 'standard']"
            readonly
          ></v-select>
          <v-select
            v-model="bookingForm.status"
            label="Status"
            :items="['pending', 'scheduled', 'in_progress', 'completed', 'cancelled']"
          ></v-select>
          <v-text-field
            v-model.number="bookingForm.guest_count"
            label="Guest Count"
            type="number"
          ></v-text-field>
          <v-textarea
            v-model="bookingForm.notes"
            label="Notes"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="bookingDialogOpen = false">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="saveBooking">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import FullCalendar from './FullCalendar.vue';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import type { Booking, Property, BookingType, BookingStatus } from '@/types';

// Sample data
const properties = ref<Map<string, Property>>(new Map());
const bookings = ref<Map<string, Booking>>(new Map());
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);

// UI state
const currentView = ref('dayGridMonth');
const selectedPropertyId = ref<string | null>(null);
const showTurnBookings = ref(true);
const showStandardBookings = ref(true);
const bookingDialogOpen = ref(false);
const selectedBooking = ref<Booking | null>(null);
const bookingForm = ref<Partial<Booking>>({
  property_id: '',
  checkout_date: '',
  checkin_date: '',
  booking_type: 'standard',
  status: 'pending',
  guest_count: 1,
  notes: ''
});

// Computed properties
const propertiesArray = computed(() => Array.from(properties.value.values()));

const viewOptions = [
  { title: 'Month', value: 'dayGridMonth' },
  { title: 'Week', value: 'timeGridWeek' },
  { title: 'Day', value: 'timeGridDay' }
];

const propertyOptions = computed(() => [
  { title: 'All Properties', value: null },
  ...propertiesArray.value.map(p => ({ title: p.name, value: p.id }))
]);

const propertySelectItems = computed(() => 
  propertiesArray.value.map(p => ({
    title: p.name,
    value: p.id
  }))
);

const filteredBookings = computed(() => {
  let result = new Map(bookings.value);
  
  // Filter by property
  if (selectedPropertyId.value) {
    result = new Map(
      [...result].filter(([_, booking]) => booking.property_id === selectedPropertyId.value)
    );
  }
  
  // Filter by booking type
  if (!showTurnBookings.value || !showStandardBookings.value) {
    result = new Map(
      [...result].filter(([_, booking]) => {
        if (booking.booking_type === 'turn' && !showTurnBookings.value) return false;
        if (booking.booking_type === 'standard' && !showStandardBookings.value) return false;
        return true;
      })
    );
  }
  
  return result;
});

// Methods
const generateSampleData = () => {
  // Create sample properties
  const property1: Property = {
    id: 'prop-1',
    owner_id: 'owner-1',
    name: 'Beach House',
    address: '123 Ocean Ave',
    cleaning_duration: 180,
    pricing_tier: 'premium',
    active: true
  };
  
  const property2: Property = {
    id: 'prop-2',
    owner_id: 'owner-1',
    name: 'Mountain Cabin',
    address: '456 Pine Rd',
    cleaning_duration: 120,
    pricing_tier: 'basic',
    active: true
  };
  
  const property3: Property = {
    id: 'prop-3',
    owner_id: 'owner-2',
    name: 'Downtown Loft',
    address: '789 Main St',
    cleaning_duration: 90,
    special_instructions: 'Use special cleaner for hardwood floors',
    pricing_tier: 'luxury',
    active: true
  };
  
  properties.value.set(property1.id, property1);
  properties.value.set(property2.id, property2);
  properties.value.set(property3.id, property3);
  
  // Create sample bookings
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Generate a turn booking (same day checkout/checkin)
  const turnBooking: Booking = {
    id: 'booking-1',
    property_id: 'prop-1',
    owner_id: 'owner-1',
    checkout_date: new Date(today.setHours(11, 0, 0, 0)).toISOString(),
    checkin_date: new Date(today.setHours(15, 0, 0, 0)).toISOString(),
    booking_type: 'turn',
    status: 'pending',
    guest_count: 4,
    notes: 'High priority turn cleaning'
  };
  
  // Generate a standard booking
  const standardBooking: Booking = {
    id: 'booking-2',
    property_id: 'prop-2',
    owner_id: 'owner-1',
    checkout_date: tomorrow.toISOString(),
    checkin_date: new Date(tomorrow.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    booking_type: 'standard',
    status: 'scheduled',
    guest_count: 2,
    notes: 'Regular cleaning'
  };
  
  // Generate another booking
  const anotherBooking: Booking = {
    id: 'booking-3',
    property_id: 'prop-3',
    owner_id: 'owner-2',
    checkout_date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    checkin_date: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    booking_type: 'standard',
    status: 'pending',
    guest_count: 3
  };
  
  bookings.value.set(turnBooking.id, turnBooking);
  bookings.value.set(standardBooking.id, standardBooking);
  bookings.value.set(anotherBooking.id, anotherBooking);
};

const createRandomBooking = () => {
  // Get a random property
  const propertyIds = Array.from(properties.value.keys());
  const randomPropertyId = propertyIds[Math.floor(Math.random() * propertyIds.length)];
  
  // Generate random dates
  const today = new Date();
  const randomDayOffset = Math.floor(Math.random() * 30) - 15; // -15 to +15 days
  
  const checkout = new Date(today);
  checkout.setDate(checkout.getDate() + randomDayOffset);
  checkout.setHours(11, 0, 0, 0);
  
  let checkin;
  const isTurn = Math.random() > 0.7; // 30% chance of turn booking
  
  if (isTurn) {
    // Same day turn
    checkin = new Date(checkout);
    checkin.setHours(15, 0, 0, 0);
  } else {
    // Standard booking with 1-7 day gap
    const gapDays = Math.floor(Math.random() * 7) + 1;
    checkin = new Date(checkout);
    checkin.setDate(checkin.getDate() + gapDays);
    checkin.setHours(15, 0, 0, 0);
  }
  
  // Create new booking
  const newBooking: Booking = {
    id: uuidv4(),
    property_id: randomPropertyId,
    owner_id: properties.value.get(randomPropertyId)?.owner_id || 'owner-1',
    checkout_date: checkout.toISOString(),
    checkin_date: checkin.toISOString(),
    booking_type: isTurn ? 'turn' : 'standard',
    status: 'pending',
    guest_count: Math.floor(Math.random() * 6) + 1,
    notes: isTurn ? 'Random turn booking' : 'Random standard booking'
  };
  
  bookings.value.set(newBooking.id, newBooking);
};

const goToToday = () => {
  if (calendarRef.value) {
    calendarRef.value.goToDate(new Date());
  }
};

const changeView = () => {
  if (calendarRef.value) {
    calendarRef.value.changeView(currentView.value);
  }
};

const filterByProperty = () => {
  refreshCalendar();
};

const refreshCalendar = () => {
  if (calendarRef.value) {
    calendarRef.value.refreshEvents();
  }
};

// Event handlers
const handleDateSelect = (selectInfo: DateSelectArg) => {
  // Open booking modal with pre-filled dates
  bookingForm.value = {
    property_id: selectedPropertyId.value || propertiesArray.value[0].id,
    checkout_date: selectInfo.startStr,
    checkin_date: selectInfo.endStr,
    booking_type: 'standard',
    status: 'pending',
    guest_count: 2,
    notes: ''
  };
  
  // Determine if it's a turn booking
  const checkoutDate = new Date(selectInfo.startStr);
  const checkinDate = new Date(selectInfo.endStr);
  if (checkoutDate.toDateString() === checkinDate.toDateString()) {
    bookingForm.value.booking_type = 'turn';
  }
  
  selectedBooking.value = null;
  bookingDialogOpen.value = true;
};

const handleEventClick = (clickInfo: EventClickArg) => {
  const booking = clickInfo.event.extendedProps.booking as Booking;
  selectedBooking.value = booking;
  
  // Open booking modal with booking data
  bookingForm.value = {
    ...booking
  };
  
  bookingDialogOpen.value = true;
};

const handleEventDrop = (dropInfo: EventDropArg) => {
  const booking = dropInfo.event.extendedProps.booking as Booking;
  
  // Update booking dates
  const updatedBooking = {
    ...booking,
    checkout_date: dropInfo.event.startStr,
    checkin_date: dropInfo.event.endStr || dropInfo.event.startStr
  };
  
  // Determine booking type based on new dates
  const checkoutDate = new Date(updatedBooking.checkout_date);
  const checkinDate = new Date(updatedBooking.checkin_date);
  
  if (checkoutDate.toDateString() === checkinDate.toDateString()) {
    updatedBooking.booking_type = 'turn';
  } else {
    updatedBooking.booking_type = 'standard';
  }
  
  bookings.value.set(booking.id, updatedBooking);
};

const handleCreateBooking = (): void => {
  // This is called automatically when selecting a date range
  // But we're handling it manually in handleDateSelect above
};

const handleUpdateBooking = (data: { id: string; start: string; end: string }) => {
  const booking = bookings.value.get(data.id);
  if (booking) {
    const updatedBooking = {
      ...booking,
      checkout_date: data.start,
      checkin_date: data.end
    };
    
    // Determine booking type based on new dates
    const checkoutDate = new Date(updatedBooking.checkout_date);
    const checkinDate = new Date(updatedBooking.checkin_date);
    
    if (checkoutDate.toDateString() === checkinDate.toDateString()) {
      updatedBooking.booking_type = 'turn';
    } else {
      updatedBooking.booking_type = 'standard';
    }
    
    bookings.value.set(booking.id, updatedBooking);
  }
};

const saveBooking = () => {
  if (selectedBooking.value) {
    // Update existing booking
    const updatedBooking = {
      ...selectedBooking.value,
      ...bookingForm.value
    } as Booking;
    
    bookings.value.set(updatedBooking.id, updatedBooking);
  } else {
    // Create new booking
    const newBooking: Booking = {
      id: uuidv4(),
      property_id: bookingForm.value.property_id || propertiesArray.value[0].id,
      owner_id: properties.value.get(bookingForm.value.property_id || '')?.owner_id || 'owner-1',
      checkout_date: bookingForm.value.checkout_date || new Date().toISOString(),
      checkin_date: bookingForm.value.checkin_date || new Date().toISOString(),
      booking_type: bookingForm.value.booking_type as BookingType || 'standard',
      status: bookingForm.value.status as BookingStatus || 'pending',
      guest_count: bookingForm.value.guest_count,
      notes: bookingForm.value.notes
    };
    
    bookings.value.set(newBooking.id, newBooking);
  }
  
  bookingDialogOpen.value = false;
  refreshCalendar();
};

// Initialize
onMounted(() => {
  generateSampleData();
});
</script>

<style scoped>
.calendar-demo {
  width: 100%;
  height: 100%;
  padding: 16px;
}
</style>
