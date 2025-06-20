<template>
  <div class="calendar-page">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">
          Booking Calendar
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <OwnerCalendar
          :bookings="bookingStore.bookings"
          :properties="propertyStore.properties"
          :loading="bookingStore.loading || propertyStore.loading"
          @date-select="handleDateSelect"
          @event-click="handleEventClick"
          @event-drop="handleEventDrop"
          @create-booking="handleCreateBooking"
          @update-booking="handleUpdateBooking"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import OwnerCalendar from '@/components/smart/owner/OwnerCalendar.vue';
import { useBookingStore } from '@/stores/booking';
import { usePropertyStore } from '@/stores/property';
import { useUIStore } from '@/stores/ui';
import { useBookings } from '@/composables/shared/useBookings';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';

// Stores
const bookingStore = useBookingStore();
const propertyStore = usePropertyStore();
const uiStore = useUIStore();

// Composables
const { updateBooking } = useBookings();

// Event handlers
const handleDateSelect = (selectInfo: DateSelectArg): void => {
  // Open booking modal with pre-filled dates
  uiStore.openModal('eventModal', 'create', {
    checkout_date: selectInfo.startStr,
    checkin_date: selectInfo.endStr
  });
};

const handleEventClick = (clickInfo: EventClickArg): void => {
  // Get the booking data from the event
  const booking = clickInfo.event.extendedProps.booking;
  
  // Open booking modal in edit mode
  uiStore.openModal('eventModal', 'edit', booking);
};

const handleEventDrop = (dropInfo: EventDropArg): void => {
  // Get the booking data from the event
  const booking = dropInfo.event.extendedProps.booking;
  
  // Update booking dates
  updateBooking(booking.id, {
    checkout_date: dropInfo.event.startStr,
    checkin_date: dropInfo.event.endStr || dropInfo.event.startStr
  });
};

const handleCreateBooking = (): void => {
  // This is handled by handleDateSelect
};

const handleUpdateBooking = (data: { id: string; start: string; end: string }): void => {
  // Update booking with new dates
  updateBooking(data.id, {
    checkout_date: data.start,
    checkin_date: data.end
  });
};

// Initialize
onMounted(async () => {
  // Fetch bookings and properties
  await Promise.all([
    bookingStore.fetchBookings(),
    propertyStore.fetchProperties()
  ]);
});
</script>

<style scoped>
.calendar-page {
  padding: 1rem;
  height: calc(100vh - 64px); /* Adjust based on app bar height */
}
</style> 