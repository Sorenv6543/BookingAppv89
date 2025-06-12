<template>
  <v-container>
    <h1 class="text-h4 mb-4">Upcoming Cleanings Demo</h1>
    
    <v-row>
      <v-col cols="12" md="8">
        <UpcomingCleanings 
          :bookings="sampleBookings"
          @view="handleView"
          @assign="handleAssign"
          @toggle-expanded="expanded = $event"
          @view-all="handleViewAll"
        />
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Demo Controls</v-card-title>
          <v-card-text>
            <v-slider
              v-model="bookingCount"
              label="Number of Bookings"
              min="0"
              max="30"
              step="1"
              thumb-label
              @update:model-value="generateSampleBookings"
            ></v-slider>
            
            <v-slider
              v-model="turnPercentage"
              label="Turn Percentage"
              min="0"
              max="100"
              step="5"
              thumb-label
              @update:model-value="generateSampleBookings"
            ></v-slider>
            
            <v-slider
              v-model="daysRange"
              label="Days Range"
              min="1"
              max="14"
              step="1"
              thumb-label
              @update:model-value="generateSampleBookings"
            ></v-slider>
          </v-card-text>
        </v-card>
        
        <v-card class="mt-4">
          <v-card-title>Event Log</v-card-title>
          <v-card-text>
            <v-list density="compact" lines="two">
              <v-list-item v-for="(event, index) in eventLog" :key="index">
                <v-list-item-title>{{ event.type }}</v-list-item-title>
                <v-list-item-subtitle>{{ event.details }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <v-btn 
              v-if="eventLog.length > 0" 
              block 
              variant="text" 
              color="error" 
              @click="eventLog = []"
            >
              Clear Log
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import UpcomingCleanings from './UpcomingCleanings.vue';

// Define BookingWithMetadata type inline to avoid import issues
interface BookingWithMetadata {
  id: string;
  property_id: string;
  owner_id: string;
  checkout_date: string;
  checkin_date: string;
  booking_type: 'standard' | 'turn';
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  guest_count?: number;
  notes?: string;
  assigned_cleaner_id?: string;
  created_at?: string;
  updated_at?: string;
  property_name?: string;
  cleaning_window?: {
    start: string;
    end: string;
    duration: number;
  };
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

// Demo state
const expanded = ref(true);
const bookingCount = ref(15);
const turnPercentage = ref(30);
const daysRange = ref(7);
const sampleBookings = ref<BookingWithMetadata[]>([]);
const eventLog = ref<Array<{type: string, details: string}>>([]);

// Generate sample bookings with random dates and properties
function generateSampleBookings() {
  const bookings: BookingWithMetadata[] = [];
  const propertyNames = ['Ocean View Villa', 'Mountain Retreat', 'Downtown Loft', 'Suburban Home', 'Lake Cabin'];
  
  for (let i = 0; i < bookingCount.value; i++) {
    // Random date within the next X days (weighted towards earlier dates)
    const daysAhead = Math.floor(Math.random() * Math.random() * daysRange.value);
    
    const checkoutDate = new Date();
    checkoutDate.setDate(checkoutDate.getDate() + daysAhead);
    checkoutDate.setHours(9 + Math.floor(Math.random() * 6), 0, 0, 0); // Checkout between 9 AM and 3 PM
    
    // Determine if it's a turn booking (same day checkout/checkin)
    const isTurn = Math.random() * 100 < turnPercentage.value;
    
    const checkinDate = new Date(checkoutDate);
    if (isTurn) {
      // For turn bookings, checkin is same day, a few hours after checkout
      checkinDate.setHours(checkoutDate.getHours() + 3 + Math.floor(Math.random() * 5));
    } else {
      // For standard bookings, checkin is 1-3 days after checkout
      checkinDate.setDate(checkinDate.getDate() + 1 + Math.floor(Math.random() * 3));
      checkinDate.setHours(14 + Math.floor(Math.random() * 6), 0, 0, 0); // Checkin between 2 PM and 8 PM
    }
    
    // Random priority based on turn status and time window
    let priority: 'low' | 'normal' | 'high' | 'urgent';
    if (isTurn) {
      priority = Math.random() < 0.3 ? 'urgent' : 'high';
    } else {
      priority = Math.random() < 0.7 ? 'normal' : 'low';
    }
    
    // Random property
    const propertyName = propertyNames[Math.floor(Math.random() * propertyNames.length)];
    const propertyId = uuidv4();
    
    // Create booking
    const booking: BookingWithMetadata = {
      id: uuidv4(),
      property_id: propertyId,
      owner_id: uuidv4(),
      checkout_date: checkoutDate.toISOString(),
      checkin_date: checkinDate.toISOString(),
      booking_type: isTurn ? 'turn' : 'standard',
      status: Math.random() < 0.8 ? 'scheduled' : 'pending',
      property_name: `${propertyName} #${Math.floor(Math.random() * 100)}`,
      priority,
      cleaning_window: {
        start: checkoutDate.toISOString(),
        end: checkinDate.toISOString(),
        duration: Math.floor((checkinDate.getTime() - checkoutDate.getTime()) / (1000 * 60))
      }
    };
    
    bookings.push(booking);
  }
  
  sampleBookings.value = bookings;
}

// Event handlers
function handleView(id: string) {
  const booking = sampleBookings.value.find(b => b.id === id);
  eventLog.value.unshift({
    type: 'View Booking',
    details: `ID: ${id}, Property: ${booking?.property_name}`
  });
}

function handleAssign(id: string) {
  const booking = sampleBookings.value.find(b => b.id === id);
  eventLog.value.unshift({
    type: 'Assign Cleaner',
    details: `ID: ${id}, Property: ${booking?.property_name}`
  });
}

function handleViewAll(period: string) {
  eventLog.value.unshift({
    type: 'View All Cleanings',
    details: `Period: ${period}`
  });
}

// Generate initial bookings
onMounted(() => {
  generateSampleBookings();
});
</script> 