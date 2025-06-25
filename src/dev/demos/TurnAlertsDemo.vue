<template>
  <div class="demo-container pa-4">
    <h1 class="text-h4 mb-4">
      Turn Alerts Demo
    </h1>
    
    <div class="mb-4">
      <v-btn
        color="error"
        class="mr-2"
        @click="addUrgentTurn"
      >
        Add Urgent Turn
      </v-btn>
      <v-btn
        color="warning"
        class="mr-2"
        @click="addHighTurn"
      >
        Add High Priority Turn
      </v-btn>
      <v-btn
        color="grey"
        @click="clearTurns"
      >
        Clear All
      </v-btn>
    </div>
    
    <TurnAlerts 
      :bookings="turnBookings" 
      @view="onViewBooking" 
      @assign="onAssignBooking"
      @toggle-expanded="expanded = $event"
      @view-all="logEvent('View all turns clicked')"
    />
    
    <div class="mt-4 pa-2 bg-grey-lighten-4">
      <h3 class="text-h6">
        Event Log:
      </h3>
      <v-list>
        <v-list-item
          v-for="(log, index) in eventLogs"
          :key="index"
        >
          {{ log }}
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TurnAlerts from '@components/dumb/shared/TurnAlerts.vue';
import { v4 as uuidv4 } from 'uuid';
import type { BookingWithMetadata } from '@/types';

const expanded = ref(true);
const turnBookings = ref<BookingWithMetadata[]>([]);
const eventLogs = ref<string[]>([]);

// Helper to create demo turns
function createTurn(priority: 'urgent' | 'high'): BookingWithMetadata {
  const now = new Date();
  const id = uuidv4();
  const propertyId = uuidv4();
  
  // Create checkout time (current time + 1-2 hours)
  const checkoutHours = priority === 'urgent' ? 1 : 2;
  const checkout = new Date(now.getTime() + (checkoutHours * 60 * 60 * 1000));
  
  // Create checkin time (checkout time + 3-5 hours)
  const checkinOffset = Math.floor(Math.random() * 2) + 3; // 3-5 hours
  const checkin = new Date(checkout.getTime() + (checkinOffset * 60 * 60 * 1000));
  
  return {
    id,
    property_id: propertyId,
    property_name: `Demo Property ${turnBookings.value.length + 1}`,
    owner_id: 'demo-owner',
    checkout_date: checkout.toISOString(),
    checkin_date: checkin.toISOString(),
    booking_type: 'turn',
    status: 'pending',
    priority,
    cleaning_window: {
      start: checkout.toISOString(),
      end: checkin.toISOString(),
      duration: checkinOffset * 60 // minutes
    }
  };
}

function addUrgentTurn() {
  const turn = createTurn('urgent');
  turnBookings.value.push(turn);
  logEvent(`Added urgent turn for ${turn.property_name}`);
}

function addHighTurn() {
  const turn = createTurn('high');
  turnBookings.value.push(turn);
  logEvent(`Added high priority turn for ${turn.property_name}`);
}

function clearTurns() {
  turnBookings.value = [];
  logEvent('Cleared all turns');
}

function onViewBooking(id: string) {
  const booking = turnBookings.value.find(b => b.id === id);
  logEvent(`Viewing booking for ${booking?.property_name || id}`);
}

function onAssignBooking(id: string) {
  const booking = turnBookings.value.find(b => b.id === id);
  logEvent(`Assigning cleaner to ${booking?.property_name || id}`);
}

function logEvent(message: string) {
  const timestamp = new Date().toLocaleTimeString();
  eventLogs.value.unshift(`[${timestamp}] ${message}`);
}

// Add some initial demo data
addUrgentTurn();
addHighTurn();
</script>

<style scoped>
.demo-container {
  max-width: 800px;
  margin: 0 auto;
}
</style> 