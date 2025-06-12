<template>
  <v-container fluid class="sidebar-demo">
    <v-row>
      <v-col cols="12" md="4" lg="3">
        <Sidebar 
          :today-turns="todayTurns"
          :upcoming-cleanings="upcomingCleanings"
          :properties="properties"
          :loading="loading"
          @navigate-to-booking="handleNavigateToBooking"
          @navigate-to-date="handleNavigateToDate"
          @filter-by-property="handleFilterByProperty"
          @create-booking="handleCreateBooking"
          @create-property="handleCreateProperty"
        />
      </v-col>
      <v-col cols="12" md="8" lg="9">
        <v-card class="pa-4">
          <v-card-title>Sidebar Demo</v-card-title>
          <v-card-text>
            <p>This is a demo of the Sidebar component. Try interacting with the sidebar to see how it works.</p>
            <v-divider class="my-4"></v-divider>
            
            <h3 class="text-h6 mb-2">Event Log:</h3>
            <v-list lines="two" class="event-log bg-grey-lighten-4">
              <v-list-item v-for="(event, index) in eventLog" :key="index">
                <v-list-item-title>{{ event.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ event.detail }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item v-if="eventLog.length === 0">
                <v-list-item-title>No events yet</v-list-item-title>
                <v-list-item-subtitle>Try interacting with the sidebar</v-list-item-subtitle>
              </v-list-item>
            </v-list>
            
            <v-divider class="my-4"></v-divider>
            
            <div class="d-flex gap-2">
              <v-btn color="primary" @click="toggleLoading">
                {{ loading ? 'Stop Loading' : 'Start Loading' }}
              </v-btn>
              <v-btn color="secondary" @click="resetEvents">
                Reset Events
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from './Sidebar.vue';
import type { Booking, Property } from '@/types';

// Demo data
const loading = ref(false);
const eventLog = ref<{ name: string, detail: string }[]>([]);

// Generate sample properties
const properties = ref<Property[]>([
  {
    id: '1',
    owner_id: 'owner1',
    name: 'Luxury Beach House',
    address: '123 Coastal Way',
    cleaning_duration: 180, // 3 hours
    special_instructions: 'Check pool filter',
    pricing_tier: 'luxury',
    active: true,
  },
  {
    id: '2',
    owner_id: 'owner1',
    name: 'Downtown Apartment',
    address: '456 Main Street',
    cleaning_duration: 120, // 2 hours
    pricing_tier: 'premium',
    active: true,
  },
  {
    id: '3',
    owner_id: 'owner2',
    name: 'Mountain Cabin',
    address: '789 Forest Road',
    cleaning_duration: 90, // 1.5 hours
    special_instructions: 'Restock firewood',
    pricing_tier: 'basic',
    active: true,
  },
]);

// Generate today's turn bookings
const todayTurns = ref<Booking[]>([
  {
    id: 't1',
    property_id: '1',
    owner_id: 'owner1',
    checkout_date: new Date().toISOString(),
    checkin_date: new Date().toISOString(),
    booking_type: 'turn',
    guest_count: 4,
    notes: 'Urgent: Same-day turnaround',
    status: 'pending',
  },
  {
    id: 't2',
    property_id: '2',
    owner_id: 'owner1',
    checkout_date: new Date().toISOString(),
    checkin_date: new Date().toISOString(),
    booking_type: 'turn',
    guest_count: 2,
    status: 'scheduled',
  },
]);

// Generate upcoming cleanings
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const dayAfterTomorrow = new Date();
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

const upcomingCleanings = ref<Booking[]>([
  {
    id: 'u1',
    property_id: '1',
    owner_id: 'owner1',
    checkout_date: tomorrow.toISOString(),
    checkin_date: tomorrow.toISOString(),
    booking_type: 'standard',
    guest_count: 3,
    status: 'pending',
  },
  {
    id: 'u2',
    property_id: '3',
    owner_id: 'owner2',
    checkout_date: tomorrow.toISOString(),
    checkin_date: dayAfterTomorrow.toISOString(),
    booking_type: 'standard',
    guest_count: 2,
    status: 'scheduled',
  },
  {
    id: 'u3',
    property_id: '2',
    owner_id: 'owner1',
    checkout_date: dayAfterTomorrow.toISOString(),
    checkin_date: dayAfterTomorrow.toISOString(),
    booking_type: 'standard',
    guest_count: 1,
    status: 'pending',
  },
]);

// Event handlers
const handleNavigateToBooking = (bookingId: string) => {
  eventLog.value.unshift({
    name: 'navigateToBooking',
    detail: `Booking ID: ${bookingId}`,
  });
};

const handleNavigateToDate = (date: Date) => {
  eventLog.value.unshift({
    name: 'navigateToDate',
    detail: `Date: ${date.toLocaleDateString()}`,
  });
};

const handleFilterByProperty = (propertyId: string | null) => {
  const propertyName = propertyId 
    ? properties.value.find(p => p.id === propertyId)?.name || 'Unknown'
    : 'All Properties';
  
  eventLog.value.unshift({
    name: 'filterByProperty',
    detail: `Property: ${propertyName} (ID: ${propertyId || 'none'})`,
  });
};

const handleCreateBooking = () => {
  eventLog.value.unshift({
    name: 'createBooking',
    detail: 'Opening booking creation modal',
  });
};

const handleCreateProperty = () => {
  eventLog.value.unshift({
    name: 'createProperty',
    detail: 'Opening property creation modal',
  });
};

// UI control methods
const toggleLoading = () => {
  loading.value = !loading.value;
};

const resetEvents = () => {
  eventLog.value = [];
};
</script>

<style scoped>
.sidebar-demo {
  min-height: 100vh;
}

.event-log {
  max-height: 300px;
  overflow-y: auto;
  border-radius: 4px;
}
</style> 