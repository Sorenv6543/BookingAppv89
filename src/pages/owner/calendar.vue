<template>
  <div class="owner-calendar-page">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <div class="d-flex justify-space-between align-center mb-4">
            <h1 class="text-h4">
              My Booking Calendar
            </h1>
            <div class="d-flex gap-2">
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                @click="handleQuickBooking"
              >
                Quick Booking
              </v-btn>
              <v-btn
                color="secondary"
                prepend-icon="mdi-home-plus"
                variant="outlined"
                @click="handleAddProperty"
              >
                Add Property
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Calendar Stats -->
      <v-row class="mb-4">
        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <v-card>
            <v-card-text>
              <div class="d-flex align-center">
                <v-icon
                  color="primary"
                  class="mr-2"
                >
                  mdi-calendar-today
                </v-icon>
                <div>
                  <div class="text-h6">
                    {{ todayBookings.length }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    Today's Bookings
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <v-card>
            <v-card-text>
              <div class="d-flex align-center">
                <v-icon
                  color="warning"
                  class="mr-2"
                >
                  mdi-clock-fast
                </v-icon>
                <div>
                  <div class="text-h6">
                    {{ todayTurns.length }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    Today's Turns
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <v-card>
            <v-card-text>
              <div class="d-flex align-center">
                <v-icon
                  color="success"
                  class="mr-2"
                >
                  mdi-calendar-week
                </v-icon>
                <div>
                  <div class="text-h6">
                    {{ upcomingBookings.length }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    This Week
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <v-card>
            <v-card-text>
              <div class="d-flex align-center">
                <v-icon
                  color="info"
                  class="mr-2"
                >
                  mdi-home
                </v-icon>
                <div>
                  <div class="text-h6">
                    {{ ownerProperties.length }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    My Properties
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Calendar Component -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-text class="pa-0">
              <OwnerCalendar
                :bookings="ownerBookings"
                :properties="ownerProperties"
                :loading="loading"
                @date-select="handleDateSelect"
                @event-click="handleEventClick"
                @event-drop="handleEventDrop"
                @create-booking="handleCreateBooking"
                @update-booking="handleUpdateBooking"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import OwnerCalendar from '@/components/smart/owner/OwnerCalendar.vue';
import { useOwnerBookings } from '@/composables/owner/useOwnerBookings-supabase';
import { useOwnerProperties } from '@/composables/owner/useOwnerProperties';
import { useUIStore } from '@/stores/ui';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';

// Meta information for this page
defineOptions({
  name: 'OwnerCalendarPage'
});

// Composables
const { 
  myBookings: ownerBookings,
  myTodayBookings: todayBookings,
  myTodayTurns: todayTurns,
  myUpcomingBookings: upcomingBookings,
  fetchMyBookings,
  updateMyBooking
} = useOwnerBookings();

const {
  myProperties: ownerProperties,
  fetchMyProperties
} = useOwnerProperties();

// Stores
const uiStore = useUIStore();

// Computed
const loading = computed(() => {
  return false; // Add loading states from composables if needed
});

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
  
  // Only allow editing if this is the owner's booking
  if (booking) {
    uiStore.openModal('eventModal', 'edit', booking);
  }
};

const handleEventDrop = async (dropInfo: EventDropArg): Promise<void> => {
  // Get the booking data from the event
  const booking = dropInfo.event.extendedProps.booking;
  
  if (booking) {
    try {
      // Update booking dates
      await updateMyBooking(booking.id, {
        checkout_date: dropInfo.event.startStr,
        checkin_date: dropInfo.event.endStr || dropInfo.event.startStr
      });
      
      uiStore.showNotification('Booking updated successfully', 'success');
    } catch (error) {
      uiStore.showNotification('Failed to update booking', 'error');
      // Revert the event position
      dropInfo.revert();
    }
  }
};

const handleCreateBooking = (): void => {
  // Open booking modal for creating new booking
  uiStore.openModal('eventModal', 'create');
};

const handleUpdateBooking = async (data: { id: string; start: string; end: string }): Promise<void> => {
  try {
    // Update booking with new dates
    await updateMyBooking(data.id, {
      checkout_date: data.start,
      checkin_date: data.end
    });
    
    uiStore.showNotification('Booking updated successfully', 'success');
  } catch (error) {
    uiStore.showNotification('Failed to update booking', 'error');
  }
};

const handleQuickBooking = (): void => {
  uiStore.openModal('eventModal', 'create');
};

const handleAddProperty = (): void => {
  uiStore.openModal('propertyModal', 'create');
};

// Initialize data
onMounted(async () => {
  await Promise.all([
    fetchMyBookings(),
    fetchMyProperties()
  ]);
});
</script>

<style scoped>
.owner-calendar-page {
  padding: 1rem;
  min-height: calc(100vh - 64px);
}

.v-card {
  height: 100%;
}

.gap-2 {
  gap: 0.5rem;
}
</style> 