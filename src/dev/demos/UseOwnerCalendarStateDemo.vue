<template>
  <v-container
    fluid
    class="pa-4"
  >
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4">
          <v-card-title class="d-flex align-center">
            <v-icon
              class="mr-2"
              color="primary"
            >
              mdi-calendar-account
            </v-icon>
            useOwnerCalendarState Demo
            <v-spacer />
            <v-chip
              color="success"
              variant="outlined"
            >
              Owner Role
            </v-chip>
          </v-card-title>
          <v-card-subtitle>
            Testing owner-specific calendar state management with role-based data filtering
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Owner Calendar Stats -->
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-card class="mb-4">
          <v-card-title>
            <v-icon class="mr-2">
              mdi-chart-box
            </v-icon>
            {{ ownerCalendarTitle }}
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="6"
                sm="3"
              >
                <v-card
                  variant="outlined"
                  class="text-center pa-2"
                >
                  <div class="text-h4 text-primary">
                    {{ calendarStats.totalProperties }}
                  </div>
                  <div class="text-caption">
                    Properties
                  </div>
                </v-card>
              </v-col>
              <v-col
                cols="6"
                sm="3"
              >
                <v-card
                  variant="outlined"
                  class="text-center pa-2"
                >
                  <div class="text-h4 text-info">
                    {{ calendarStats.totalBookings }}
                  </div>
                  <div class="text-caption">
                    Bookings
                  </div>
                </v-card>
              </v-col>
              <v-col
                cols="6"
                sm="3"
              >
                <v-card
                  variant="outlined"
                  class="text-center pa-2"
                >
                  <div class="text-h4 text-error">
                    {{ calendarStats.urgentTurns }}
                  </div>
                  <div class="text-caption">
                    Urgent Turns
                  </div>
                </v-card>
              </v-col>
              <v-col
                cols="6"
                sm="3"
              >
                <v-card
                  variant="outlined"
                  class="text-center pa-2"
                >
                  <div class="text-h4 text-warning">
                    {{ calendarStats.upcomingCleanings }}
                  </div>
                  <div class="text-caption">
                    Upcoming
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Owner Turn Alerts -->
      <v-col
        cols="12"
        md="6"
      >
        <v-card class="mb-4">
          <v-card-title>
            <v-icon
              class="mr-2"
              color="error"
            >
              mdi-fire
            </v-icon>
            My Turn Alerts
            <v-chip
              class="ml-2"
              color="error"
              size="small"
            >
              {{ myTurnAlerts.length }}
            </v-chip>
          </v-card-title>
          <v-card-text>
            <div
              v-if="myTurnAlerts.length === 0"
              class="text-center text-medium-emphasis py-4"
            >
              <v-icon
                size="48"
                color="success"
              >
                mdi-check-circle
              </v-icon>
              <div class="mt-2">
                No urgent turns today!
              </div>
            </div>
            <v-list
              v-else
              density="compact"
            >
              <v-list-item
                v-for="alert in myTurnAlerts"
                :key="alert.id"
                class="mb-2"
              >
                <template #prepend>
                  <v-avatar
                    :color="getUrgencyColor(alert.urgencyLevel)"
                    size="small"
                  >
                    <v-icon color="white">
                      mdi-fire
                    </v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ alert.alertMessage }}</v-list-item-title>
                <v-list-item-subtitle>{{ alert.timeUntilCheckout }}</v-list-item-subtitle>
                <template #append>
                  <v-chip
                    :color="getUrgencyColor(alert.urgencyLevel)"
                    size="small"
                  >
                    {{ alert.urgencyLevel }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Property Filter Controls -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4">
          <v-card-title>
            <v-icon class="mr-2">
              mdi-filter
            </v-icon>
            Property Filters
          </v-card-title>
          <v-card-text>
            <v-row align="center">
              <v-col
                cols="12"
                md="6"
              >
                <v-select
                  v-model="selectedPropertyFilter"
                  :items="propertyFilterOptions"
                  item-title="name"
                  item-value="id"
                  label="Filter by Property"
                  clearable
                  prepend-icon="mdi-home"
                  @update:model-value="handlePropertyFilterChange"
                >
                  <template #item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template #prepend>
                        <v-icon :color="item.raw.active ? 'success' : 'warning'">
                          {{ item.raw.active ? 'mdi-home' : 'mdi-home-off' }}
                        </v-icon>
                      </template>
                      <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.raw.address }}</v-list-item-subtitle>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-btn
                  color="primary"
                  variant="outlined"
                  :disabled="!selectedPropertyFilter"
                  @click="clearOwnerPropertyFilters"
                >
                  <v-icon class="mr-2">
                    mdi-filter-off
                  </v-icon>
                  Clear Filters
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Calendar Events Preview -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4">
          <v-card-title>
            <v-icon class="mr-2">
              mdi-calendar-month
            </v-icon>
            My Calendar Events
            <v-chip
              class="ml-2"
              color="info"
              size="small"
            >
              {{ myCalendarEvents.length }}
            </v-chip>
          </v-card-title>
          <v-card-text>
            <div
              v-if="myCalendarEvents.length === 0"
              class="text-center text-medium-emphasis py-8"
            >
              <v-icon
                size="64"
                color="info"
              >
                mdi-calendar-blank
              </v-icon>
              <div class="mt-4 text-h6">
                No bookings found
              </div>
              <div class="text-body-2">
                Add some properties and bookings to see them here
              </div>
            </div>
            <v-row v-else>
              <v-col
                v-for="event in myCalendarEvents.slice(0, 6)"
                :key="event.id"
                cols="12"
                sm="6"
                md="4"
              >
                <v-card
                  variant="outlined"
                  :color="event.backgroundColor"
                  class="mb-2"
                  @click="simulateEventClick(event)"
                >
                  <v-card-text class="pa-3">
                    <div class="d-flex align-center mb-2">
                      <v-icon
                        class="mr-2"
                        color="white"
                      >
                        {{ event.extendedProps.booking_type === 'turn' ? 'mdi-fire' : 'mdi-home-clean' }}
                      </v-icon>
                      <span class="text-white font-weight-bold">{{ event.title }}</span>
                    </div>
                    <div class="text-white text-caption mb-1">
                      <v-icon
                        size="small"
                        class="mr-1"
                      >
                        mdi-home
                      </v-icon>
                      {{ event.extendedProps.propertyName }}
                    </div>
                    <div class="text-white text-caption mb-1">
                      <v-icon
                        size="small"
                        class="mr-1"
                      >
                        mdi-calendar
                      </v-icon>
                      {{ formatEventDate(event.start) }}
                    </div>
                    <div class="text-white text-caption">
                      <v-icon
                        size="small"
                        class="mr-1"
                      >
                        mdi-information
                      </v-icon>
                      {{ event.extendedProps.status }}
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-btn
              v-if="myCalendarEvents.length > 6"
              color="primary"
              variant="text"
              class="mt-2"
              @click="showAllEvents = !showAllEvents"
            >
              {{ showAllEvents ? 'Show Less' : `Show All ${myCalendarEvents.length} Events` }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Function Testing -->
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-card class="mb-4">
          <v-card-title>
            <v-icon class="mr-2">
              mdi-function
            </v-icon>
            Function Testing
          </v-card-title>
          <v-card-text>
            <v-btn
              color="primary"
              variant="outlined"
              class="mb-2 mr-2"
              @click="testDateSelect"
            >
              <v-icon class="mr-2">
                mdi-calendar-plus
              </v-icon>
              Test Date Select
            </v-btn>
            <v-btn
              color="secondary"
              variant="outlined"
              class="mb-2 mr-2"
              @click="testEventClick"
            >
              <v-icon class="mr-2">
                mdi-calendar-edit
              </v-icon>
              Test Event Click
            </v-btn>
            <v-btn
              color="info"
              variant="outlined"
              class="mb-2 mr-2"
              @click="testValidateAccess"
            >
              <v-icon class="mr-2">
                mdi-shield-check
              </v-icon>
              Test Access Validation
            </v-btn>
            <v-btn
              color="warning"
              variant="outlined"
              class="mb-2"
              @click="generateSampleData"
            >
              <v-icon class="mr-2">
                mdi-database-plus
              </v-icon>
              Generate Sample Data
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Status Messages -->
      <v-col
        cols="12"
        md="6"
      >
        <v-card class="mb-4">
          <v-card-title>
            <v-icon class="mr-2">
              mdi-message
            </v-icon>
            Status Messages
          </v-card-title>
          <v-card-text>
            <v-alert
              v-if="ownerError"
              type="error"
              variant="outlined"
              class="mb-2"
              closable
              @click:close="ownerError = null"
            >
              {{ ownerError }}
            </v-alert>
            <v-alert
              v-if="ownerSuccess"
              type="success"
              variant="outlined"
              class="mb-2"
              closable
              @click:close="ownerSuccess = null"
            >
              {{ ownerSuccess }}
            </v-alert>
            <v-alert
              v-if="!ownerError && !ownerSuccess"
              type="info"
              variant="outlined"
            >
              No messages. Try testing the functions above.
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Debug Information -->
    <v-row>
      <v-col cols="12">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-icon class="mr-2">
                mdi-bug
              </v-icon>
              Debug Information
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <h4>Current User</h4>
                  <pre class="text-caption">{{ JSON.stringify(currentUser, null, 2) }}</pre>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <h4>Calendar State</h4>
                  <pre class="text-caption">{{ JSON.stringify({
                    currentView,
                    currentDate: currentDate?.toISOString(),
                    selectedPropertyIds: Array.from(selectedPropertyIds),
                    showTurnBookings,
                    showStandardBookings
                  }, null, 2) }}</pre>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useOwnerCalendarState } from '@/composables/owner/useOwnerCalendarState';
import { useOwnerBookings } from '@/composables/owner/useOwnerBookings';
import { useAuthStore } from '@/stores/auth';
import { usePropertyStore } from '@/stores/property';
import { useBookingStore } from '@/stores/booking';

// Get composables and stores
const ownerCalendarState = useOwnerCalendarState();
const ownerBookings = useOwnerBookings();
const authStore = useAuthStore();
const propertyStore = usePropertyStore();
const bookingStore = useBookingStore();

// Destructure owner calendar state
const {
  // Computed properties
  myCalendarEvents,
  myTurnAlerts,
  myPropertyOptions,
  ownerCalendarTitle,
  
  // Functions
  getOwnerCalendarEvents,
  handleOwnerDateSelect,
  handleOwnerEventClick,
  getOwnerTurnAlerts,
  filterByOwnerProperty,
  clearOwnerPropertyFilters,
  validateOwnerBookingAccess,
  getOwnerCalendarStats,
  
  // State
  ownerError,
  ownerLoading,
  ownerSuccess,
  
  // Base calendar state
  currentView,
  currentDate,
  selectedPropertyIds,
  showTurnBookings,
  showStandardBookings
} = ownerCalendarState;

// Demo-specific state
const selectedPropertyFilter = ref<string | null>(null);
const showAllEvents = ref(false);

// Computed properties
const currentUser = computed(() => authStore.user);
const calendarStats = computed(() => getOwnerCalendarStats());

const propertyFilterOptions = computed(() => [
  { id: 'all', name: 'All Properties', address: 'Show all properties', active: true },
  ...myPropertyOptions.value
]);

// Methods
function handlePropertyFilterChange(propertyId: string | null) {
  if (!propertyId || propertyId === 'all') {
    clearOwnerPropertyFilters();
    selectedPropertyFilter.value = null;
  } else {
    filterByOwnerProperty(propertyId);
  }
}

function simulateEventClick(event: any) {
  const mockClickInfo = {
    event: {
      id: event.id,
      title: event.title,
      extendedProps: event.extendedProps
    }
  };
  handleOwnerEventClick(mockClickInfo);
}

function testDateSelect() {
  const mockSelectInfo = {
    startStr: new Date().toISOString().split('T')[0],
    endStr: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  };
  handleOwnerDateSelect(mockSelectInfo);
}

function testEventClick() {
  if (myCalendarEvents.value.length > 0) {
    simulateEventClick(myCalendarEvents.value[0]);
  } else {
    ownerError.value = 'No events available to test with';
  }
}

function testValidateAccess() {
  if (myCalendarEvents.value.length > 0) {
    const bookingId = myCalendarEvents.value[0].id;
    const hasAccess = validateOwnerBookingAccess(bookingId);
    ownerSuccess.value = `Access validation for booking ${bookingId}: ${hasAccess ? 'ALLOWED' : 'DENIED'}`;
  } else {
    ownerError.value = 'No bookings available to test access validation';
  }
}

function generateSampleData() {
  // Generate sample properties for current user
  const userId = authStore.user?.id;
  if (!userId) {
    ownerError.value = 'Please log in to generate sample data';
    return;
  }

  // Add sample properties
  const sampleProperties = [
    {
      id: `prop-${Date.now()}-1`,
      owner_id: userId,
      name: 'Sunset Villa',
      address: '123 Ocean Drive, Miami, FL',
      cleaning_duration: 120,
      pricing_tier: 'premium' as const,
      active: true,
      special_instructions: 'Pool cleaning required',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: `prop-${Date.now()}-2`,
      owner_id: userId,
      name: 'Downtown Loft',
      address: '456 Main Street, Austin, TX',
      cleaning_duration: 90,
      pricing_tier: 'basic' as const,
      active: true,
      special_instructions: 'High-rise building, use service elevator',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  sampleProperties.forEach(property => {
    propertyStore.addProperty(property);
  });

  // Add sample bookings
  const sampleBookings = [
    {
      id: `booking-${Date.now()}-1`,
      property_id: sampleProperties[0].id,
      owner_id: userId,
      checkout_date: new Date().toISOString(),
      checkin_date: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours later
      booking_type: 'turn' as const,
      status: 'pending' as const,
      guest_count: 4,
      notes: 'Same-day turn - urgent cleaning needed',
      priority: 'urgent' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: `booking-${Date.now()}-2`,
      property_id: sampleProperties[1].id,
      owner_id: userId,
      checkout_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      checkin_date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
      booking_type: 'standard' as const,
      status: 'scheduled' as const,
      guest_count: 2,
      notes: 'Standard cleaning between guests',
              priority: 'normal' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  sampleBookings.forEach(booking => {
    bookingStore.addBooking(booking);
  });

  ownerSuccess.value = `Generated ${sampleProperties.length} properties and ${sampleBookings.length} bookings for testing`;
}

function getUrgencyColor(urgency: string): string {
  switch (urgency) {
    case 'critical': return 'error';
    case 'high': return 'warning';
    case 'medium': return 'info';
    case 'low': return 'success';
    default: return 'grey';
  }
}

function formatEventDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

// Initialize demo
onMounted(() => {
  // Ensure user is logged in for demo
  if (!authStore.user) {
    authStore.login('owner@example.com', 'password');
  }
});
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

pre {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 8px;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
}
</style> 