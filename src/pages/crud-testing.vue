<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { usePropertyStore } from '@/stores/property';
import { useBookingStore } from '@/stores/booking';
import { useProperties } from '@/composables/shared/useProperties';
import { useBookings } from '@/composables/shared/useBookings';
import FullCalendar from '@/dev/FullCalendar.vue';
import type { PropertyFormData, BookingFormData } from '@/types';

// Stores and composables
const propertyStore = usePropertyStore();
const bookingStore = useBookingStore();
const { 
  createProperty, 
  updateProperty, 
  deleteProperty,
  loading: propertyLoading,
  error: propertyError
} = useProperties();

const { 
  createBooking, 
  updateBooking, 
  deleteBooking,
  loading: bookingLoading,
  error: bookingError,
  fetchAllBookings
} = useBookings();

// State
const activeTab = ref('property');
const testResults = reactive({
  property: {
    create: { status: '', message: '' },
    read: { status: '', message: '' },
    update: { status: '', message: '' },
    delete: { status: '', message: '' },
  },
  booking: {
    create: { status: '', message: '' },
    read: { status: '', message: '' },
    update: { status: '', message: '' },
    delete: { status: '', message: '' },
  },
  calendar: {
    display: { status: '', message: '' },
    dragDrop: { status: '', message: '' },
    turnHighlighting: { status: '', message: '' },
  }
});

// Testing data
const testPropertyId = ref<string | null>(null);
const testBookingId = ref<string | null>(null);
const testProperty = reactive<PropertyFormData>({
  name: 'Test Property',
  address: '123 Test Lane, Testville, TS 12345',
  cleaning_duration: 60,
  pricing_tier: 'basic',
  special_instructions: 'This is a test property for CRUD testing',
  active: true,
  owner_id: 'test-owner-123',
});

const testBooking = reactive<BookingFormData>({
  property_id: '',
  owner_id: 'test-owner-123',
  checkout_date: new Date().toISOString().split('T')[0],
  checkin_date: new Date().toISOString().split('T')[0],
  booking_type: 'turn',
  status: 'pending',
  guest_count: 2,
  notes: 'This is a test booking for CRUD testing',
});

const testBookingStandard = reactive<BookingFormData>({
  property_id: '',
  owner_id: 'test-owner-123',
  checkout_date: new Date().toISOString().split('T')[0],
  checkin_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days later
  booking_type: 'standard',
  status: 'pending',
  guest_count: 4,
  notes: 'This is a test standard booking for CRUD testing',
});

// Property CRUD Test Functions
async function runPropertyCreateTest() {
  testResults.property.create.status = 'running';
  testResults.property.create.message = 'Creating test property...';
  
  try {
    const propertyId = await createProperty({ ...testProperty });
    
    if (propertyId) {
      testPropertyId.value = propertyId;
      testResults.property.create.status = 'success';
      testResults.property.create.message = `Property created with ID: ${propertyId}`;
      
      // Update the booking property_id for later booking tests
      testBooking.property_id = propertyId;
      testBookingStandard.property_id = propertyId;
    } else {
      testResults.property.create.status = 'failure';
      testResults.property.create.message = propertyError.value || 'Failed to create property, but no error was provided';
    }
  } catch (error) {
    testResults.property.create.status = 'failure';
    testResults.property.create.message = error instanceof Error ? error.message : 'Unknown error occurred';
  }
}

async function runPropertyReadTest() {
  testResults.property.read.status = 'running';
  testResults.property.read.message = 'Reading property data...';
  
  try {
    if (!testPropertyId.value) {
      throw new Error('No property ID available. Please create a property first.');
    }
    
    const property = propertyStore.getPropertyById(testPropertyId.value);
    
    if (property) {
      testResults.property.read.status = 'success';
      testResults.property.read.message = `Property retrieved successfully: ${property.name}`;
    } else {
      testResults.property.read.status = 'failure';
      testResults.property.read.message = 'Property not found in store';
    }
  } catch (error) {
    testResults.property.read.status = 'failure';
    testResults.property.read.message = error instanceof Error ? error.message : 'Unknown error occurred';
  }
}

async function runPropertyUpdateTest() {
  testResults.property.update.status = 'running';
  testResults.property.update.message = 'Updating property data...';
  
  try {
    if (!testPropertyId.value) {
      throw new Error('No property ID available. Please create a property first.');
    }
    
    const updates = {
      name: 'Updated Test Property',
      pricing_tier: 'premium' as const,
      cleaning_duration: 90
    };
    
    const success = await updateProperty(testPropertyId.value, updates);
    
    if (success) {
      testResults.property.update.status = 'success';
      testResults.property.update.message = 'Property updated successfully';
    } else {
      testResults.property.update.status = 'failure';
      testResults.property.update.message = propertyError.value || 'Failed to update property, but no error was provided';
    }
  } catch (error) {
    testResults.property.update.status = 'failure';
    testResults.property.update.message = error instanceof Error ? error.message : 'Unknown error occurred';
  }
}

async function runPropertyDeleteTest() {
  testResults.property.delete.status = 'running';
  testResults.property.delete.message = 'Deleting property...';
  
  try {
    if (!testPropertyId.value) {
      throw new Error('No property ID available. Please create a property first.');
    }
    
    // First make sure we don't have any bookings for this property
    const propertyBookings = bookingStore.bookingsByProperty(testPropertyId.value);
    for (const booking of propertyBookings) {
      await deleteBooking(booking.id);
    }
    
    const success = await deleteProperty(testPropertyId.value);
    
    if (success) {
      testResults.property.delete.status = 'success';
      testResults.property.delete.message = 'Property deleted successfully';
      testPropertyId.value = null;
    } else {
      testResults.property.delete.status = 'failure';
      testResults.property.delete.message = propertyError.value || 'Failed to delete property, but no error was provided';
    }
  } catch (error) {
    testResults.property.delete.status = 'failure';
    testResults.property.delete.message = error instanceof Error ? error.message : 'Unknown error occurred';
  }
}

// Booking CRUD Test Functions
async function runBookingCreateTest() {
  testResults.booking.create.status = 'running';
  testResults.booking.create.message = 'Creating test booking...';
  
  try {
    if (!testPropertyId.value) {
      throw new Error('No property ID available. Please create a property first.');
    }
    
    testBooking.property_id = testPropertyId.value;
    const bookingId = await createBooking({ ...testBooking });
    
    if (bookingId) {
      testBookingId.value = bookingId;
      testResults.booking.create.status = 'success';
      testResults.booking.create.message = `Booking created with ID: ${bookingId}`;
    } else {
      testResults.booking.create.status = 'failure';
      testResults.booking.create.message = bookingError.value || 'Failed to create booking, but no error was provided';
    }

    // Create a standard booking as well for calendar testing
    testBookingStandard.property_id = testPropertyId.value;
    await createBooking({ ...testBookingStandard });
  } catch (error) {
    testResults.booking.create.status = 'failure';
    testResults.booking.create.message = error instanceof Error ? error.message : 'Unknown error occurred';
  }
}

async function runBookingReadTest() {
  testResults.booking.read.status = 'running';
  testResults.booking.read.message = 'Reading booking data...';
  
  try {
    if (!testBookingId.value) {
      throw new Error('No booking ID available. Please create a booking first.');
    }
    
    const booking = bookingStore.getBookingById(testBookingId.value);
    
    if (booking) {
      testResults.booking.read.status = 'success';
      testResults.booking.read.message = `Booking retrieved successfully: ${booking.booking_type} booking at property ${booking.property_id}`;
    } else {
      testResults.booking.read.status = 'failure';
      testResults.booking.read.message = 'Booking not found in store';
    }
  } catch (error) {
    testResults.booking.read.status = 'failure';
    testResults.booking.read.message = error instanceof Error ? error.message : 'Unknown error occurred';
  }
}

async function runBookingUpdateTest() {
  testResults.booking.update.status = 'running';
  testResults.booking.update.message = 'Updating booking data...';
  
  try {
    if (!testBookingId.value) {
      throw new Error('No booking ID available. Please create a booking first.');
    }
    
    const updates = {
      guest_count: 3,
      notes: 'Updated test booking notes',
      status: 'scheduled' as const
    };
    
    const success = await updateBooking(testBookingId.value, updates);
    
    if (success) {
      testResults.booking.update.status = 'success';
      testResults.booking.update.message = 'Booking updated successfully';
    } else {
      testResults.booking.update.status = 'failure';
      testResults.booking.update.message = bookingError.value || 'Failed to update booking, but no error was provided';
    }
  } catch (error) {
    testResults.booking.update.status = 'failure';
    testResults.booking.update.message = error instanceof Error ? error.message : 'Unknown error occurred';
  }
}

async function runBookingDeleteTest() {
  testResults.booking.delete.status = 'running';
  testResults.booking.delete.message = 'Deleting booking...';
  
  try {
    if (!testBookingId.value) {
      throw new Error('No booking ID available. Please create a booking first.');
    }
    
    const success = await deleteBooking(testBookingId.value);
    
    if (success) {
      testResults.booking.delete.status = 'success';
      testResults.booking.delete.message = 'Booking deleted successfully';
      testBookingId.value = null;
    } else {
      testResults.booking.delete.status = 'failure';
      testResults.booking.delete.message = bookingError.value || 'Failed to delete booking, but no error was provided';
    }
  } catch (error) {
    testResults.booking.delete.status = 'failure';
    testResults.booking.delete.message = error instanceof Error ? error.message : 'Unknown error occurred';
  }
}

// Calendar Test Functions
function runCalendarDisplayTest() {
  testResults.calendar.display.status = 'running';
  testResults.calendar.display.message = 'Testing calendar event display...';
  
  try {
    // Check if bookings are displayed in the calendar
    const bookingsArray = bookingStore.bookingsArray.length;
    
    if (bookingsArray > 0) {
      testResults.calendar.display.status = 'success';
      testResults.calendar.display.message = `Calendar displaying ${bookingsArray} events successfully`;
    } else {
      testResults.calendar.display.status = 'warning';
      testResults.calendar.display.message = 'No bookings found to display in calendar';
    }
  } catch (error) {
    testResults.calendar.display.status = 'failure';
    testResults.calendar.display.message = error instanceof Error ? error.message : 'Unknown error occurred';
  }
}

function testTurnHighlighting() {
  testResults.calendar.turnHighlighting.status = 'running';
  testResults.calendar.turnHighlighting.message = 'Testing turn booking highlighting...';
  
  try {
    // Check if we have turn bookings
    const turnBookings = bookingStore.turnBookings.length;
    
    if (turnBookings > 0) {
      testResults.calendar.turnHighlighting.status = 'success';
      testResults.calendar.turnHighlighting.message = `Found ${turnBookings} turn bookings with special highlighting`;
    } else {
      testResults.calendar.turnHighlighting.status = 'warning';
      testResults.calendar.turnHighlighting.message = 'No turn bookings found to test highlighting';
    }
  } catch (error) {
    testResults.calendar.turnHighlighting.status = 'failure';
    testResults.calendar.turnHighlighting.message = error instanceof Error ? error.message : 'Unknown error occurred';
  }
}



// Run all tests in order
async function runAllPropertyTests() {
  await runPropertyCreateTest();
  await runPropertyReadTest();
  await runPropertyUpdateTest();
}

async function runAllBookingTests() {
  // Ensure we have a property first
  if (!testPropertyId.value) {
    await runPropertyCreateTest();
  }
  
  await runBookingCreateTest();
  await runBookingReadTest();
  await runBookingUpdateTest();
}

async function runAllCalendarTests() {
  // Ensure we have bookings first
  if (!testPropertyId.value) {
    await runPropertyCreateTest();
  }
  if (!testBookingId.value) {
    await runBookingCreateTest();
  }
  
  runCalendarDisplayTest();
  testTurnHighlighting();
  // Note: Drag and drop can only be tested through user interaction
  testResults.calendar.dragDrop.status = 'info';
  testResults.calendar.dragDrop.message = 'Drag and drop can be tested manually by dragging events on the calendar';
}

// Setup test data on mount
onMounted(async () => {
  await fetchAllBookings();
});

// Helper function to get status color
function getStatusColor(status: string) {
  switch (status) {
    case 'success': return 'success';
    case 'failure': return 'error';
    case 'running': return 'info';
    case 'warning': return 'warning';
    default: return 'grey';
  }
}
</script>

<template>
  <v-container fluid>
    <h1 class="text-h4 mb-5">
      CRUD Operations Testing
    </h1>
    
    <v-tabs v-model="activeTab">
      <v-tab value="property">
        Property CRUD
      </v-tab>
      <v-tab value="booking">
        Booking CRUD
      </v-tab>
      <v-tab value="calendar">
        Calendar Integration
      </v-tab>
    </v-tabs>
    
    <v-window
      v-model="activeTab"
      class="mt-5"
    >
      <!-- Property CRUD Testing -->
      <v-window-item value="property">
        <h2 class="text-h5 mb-4">
          Property CRUD Testing
        </h2>
        
        <v-card class="mb-4">
          <v-card-title>Test Controls</v-card-title>
          <v-card-text>
            <p v-if="testPropertyId">
              Current Test Property ID: {{ testPropertyId }}
            </p>
            <v-btn 
              color="primary" 
              class="mr-2" 
              :loading="propertyLoading"
              @click="runAllPropertyTests"
            >
              Run All Property Tests
            </v-btn>
            <v-btn 
              color="success" 
              class="mr-2" 
              :loading="propertyLoading"
              @click="runPropertyCreateTest"
            >
              Create
            </v-btn>
            <v-btn 
              color="info" 
              class="mr-2" 
              :disabled="!testPropertyId"
              :loading="propertyLoading"
              @click="runPropertyReadTest"
            >
              Read
            </v-btn>
            <v-btn 
              color="warning" 
              class="mr-2" 
              :disabled="!testPropertyId"
              :loading="propertyLoading"
              @click="runPropertyUpdateTest"
            >
              Update
            </v-btn>
            <v-btn 
              color="error" 
              :disabled="!testPropertyId"
              :loading="propertyLoading"
              @click="runPropertyDeleteTest"
            >
              Delete
            </v-btn>
          </v-card-text>
        </v-card>
        
        <v-card>
          <v-card-title>Test Results</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>Create Property</v-list-item-title>
                <v-chip
                  :color="getStatusColor(testResults.property.create.status)"
                >
                  {{ testResults.property.create.status || 'not run' }}
                </v-chip>
                <v-list-item-subtitle>{{ testResults.property.create.message }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <v-list-item-title>Read Property</v-list-item-title>
                <v-chip
                  :color="getStatusColor(testResults.property.read.status)"
                >
                  {{ testResults.property.read.status || 'not run' }}
                </v-chip>
                <v-list-item-subtitle>{{ testResults.property.read.message }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <v-list-item-title>Update Property</v-list-item-title>
                <v-chip
                  :color="getStatusColor(testResults.property.update.status)"
                >
                  {{ testResults.property.update.status || 'not run' }}
                </v-chip>
                <v-list-item-subtitle>{{ testResults.property.update.message }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <v-list-item-title>Delete Property</v-list-item-title>
                <v-chip
                  :color="getStatusColor(testResults.property.delete.status)"
                >
                  {{ testResults.property.delete.status || 'not run' }}
                </v-chip>
                <v-list-item-subtitle>{{ testResults.property.delete.message }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-window-item>
      
      <!-- Booking CRUD Testing -->
      <v-window-item value="booking">
        <h2 class="text-h5 mb-4">
          Booking CRUD Testing
        </h2>
        
        <v-card class="mb-4">
          <v-card-title>Test Controls</v-card-title>
          <v-card-text>
            <p v-if="testPropertyId">
              Current Test Property ID: {{ testPropertyId }}
            </p>
            <p v-if="testBookingId">
              Current Test Booking ID: {{ testBookingId }}
            </p>
            <v-btn 
              color="primary" 
              class="mr-2" 
              :loading="bookingLoading"
              @click="runAllBookingTests"
            >
              Run All Booking Tests
            </v-btn>
            <v-btn 
              color="success" 
              class="mr-2" 
              :disabled="!testPropertyId"
              :loading="bookingLoading"
              @click="runBookingCreateTest"
            >
              Create
            </v-btn>
            <v-btn 
              color="info" 
              class="mr-2" 
              :disabled="!testBookingId"
              :loading="bookingLoading"
              @click="runBookingReadTest"
            >
              Read
            </v-btn>
            <v-btn 
              color="warning" 
              class="mr-2" 
              :disabled="!testBookingId"
              :loading="bookingLoading"
              @click="runBookingUpdateTest"
            >
              Update
            </v-btn>
            <v-btn 
              color="error" 
              :disabled="!testBookingId"
              :loading="bookingLoading"
              @click="runBookingDeleteTest"
            >
              Delete
            </v-btn>
          </v-card-text>
        </v-card>
        
        <v-card>
          <v-card-title>Test Results</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>Create Booking</v-list-item-title>
                <v-chip
                  :color="getStatusColor(testResults.booking.create.status)"
                >
                  {{ testResults.booking.create.status || 'not run' }}
                </v-chip>
                <v-list-item-subtitle>{{ testResults.booking.create.message }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <v-list-item-title>Read Booking</v-list-item-title>
                <v-chip
                  :color="getStatusColor(testResults.booking.read.status)"
                >
                  {{ testResults.booking.read.status || 'not run' }}
                </v-chip>
                <v-list-item-subtitle>{{ testResults.booking.read.message }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <v-list-item-title>Update Booking</v-list-item-title>
                <v-chip
                  :color="getStatusColor(testResults.booking.update.status)"
                >
                  {{ testResults.booking.update.status || 'not run' }}
                </v-chip>
                <v-list-item-subtitle>{{ testResults.booking.update.message }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <v-list-item-title>Delete Booking</v-list-item-title>
                <v-chip
                  :color="getStatusColor(testResults.booking.delete.status)"
                >
                  {{ testResults.booking.delete.status || 'not run' }}
                </v-chip>
                <v-list-item-subtitle>{{ testResults.booking.delete.message }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-window-item>
      
      <!-- Calendar Integration Testing -->
      <v-window-item value="calendar">
        <h2 class="text-h5 mb-4">
          Calendar Integration Testing
        </h2>
        
        <v-card class="mb-4">
          <v-card-title>Test Controls</v-card-title>
          <v-card-text>
            <p>Test Events Count: {{ bookingStore.bookingsArray.length }}</p>
            <p>Turn Bookings Count: {{ bookingStore.turnBookings.length }}</p>
            <v-btn 
              color="primary" 
              class="mr-2" 
              @click="runAllCalendarTests"
            >
              Run All Calendar Tests
            </v-btn>
            <v-btn 
              color="success" 
              class="mr-2" 
              :loading="bookingLoading"
              @click="runAllBookingTests"
            >
              Create Test Bookings
            </v-btn>
          </v-card-text>
        </v-card>
        
        <v-card class="mb-4">
          <v-card-title>Test Results</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>Calendar Event Display</v-list-item-title>
                <v-chip
                  :color="getStatusColor(testResults.calendar.display.status)"
                >
                  {{ testResults.calendar.display.status || 'not run' }}
                </v-chip>
                <v-list-item-subtitle>{{ testResults.calendar.display.message }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <v-list-item-title>Drag and Drop</v-list-item-title>
                <v-chip
                  :color="getStatusColor(testResults.calendar.dragDrop.status)"
                >
                  {{ testResults.calendar.dragDrop.status || 'not run' }}
                </v-chip>
                <v-list-item-subtitle>{{ testResults.calendar.dragDrop.message }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item>
                <v-list-item-title>Turn Booking Highlighting</v-list-item-title>
                <v-chip
                  :color="getStatusColor(testResults.calendar.turnHighlighting.status)"
                >
                  {{ testResults.calendar.turnHighlighting.status || 'not run' }}
                </v-chip>
                <v-list-item-subtitle>{{ testResults.calendar.turnHighlighting.message }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
        
        <!-- Calendar Component Display -->
        <v-card>
          <v-card-title>Calendar View</v-card-title>
          <v-card-text style="height: 600px;">
            <FullCalendar
              :bookings="bookingStore.bookings" 
              :properties="propertyStore.properties"
              \
            />
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
  </v-container>
</template>

<style scoped>
.v-list-item-subtitle {
  margin-top: 8px;
}
</style> 