<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">
              mdi-account-check
            </v-icon>
            useOwnerBookings Demo
            <v-spacer />
            <v-chip
              :color="currentUserId ? 'success' : 'error'"
              variant="outlined"
            >
              {{ currentUserId ? `Owner: ${authStore.user?.name}` : 'Not Logged In' }}
            </v-chip>
          </v-card-title>
          
          <v-card-text>
            <v-alert
              v-if="!currentUserId"
              type="warning"
              class="mb-4"
            >
              Please log in to test owner-specific functionality
            </v-alert>
            
            <!-- Loading/Error/Success States -->
            <v-alert
              v-if="loading"
              type="info"
              class="mb-4"
            >
              <v-progress-circular
                indeterminate
                size="20"
                class="mr-2"
              />
              Loading...
            </v-alert>
            
            <v-alert
              v-if="error"
              type="error"
              class="mb-4"
              closable
              @click:close="error = null"
            >
              {{ error }}
            </v-alert>
            
            <v-alert
              v-if="success"
              type="success"
              class="mb-4"
              closable
              @click:close="success = null"
            >
              {{ success }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Owner Statistics -->
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">
              mdi-chart-box
            </v-icon>
            My Booking Statistics
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                v-for="(value, key) in myBookingStats"
                :key="key"
                cols="6"
                sm="4"
              >
                <v-card
                  variant="outlined"
                  class="text-center pa-2"
                >
                  <div class="text-h6">
                    {{ value }}
                  </div>
                  <div class="text-caption text-uppercase">
                    {{ formatStatKey(key) }}
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col
        cols="12"
        md="6"
      >
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">
              mdi-alert-circle
            </v-icon>
            My Turn Alerts
          </v-card-title>
          <v-card-text>
            <div
              v-if="myTodayTurns.length === 0"
              class="text-center text-medium-emphasis"
            >
              No urgent turns today
            </div>
            <v-list v-else>
              <v-list-item
                v-for="turn in myTodayTurns"
                :key="turn.id"
                :title="getPropertyName(turn.property_id)"
                :subtitle="`Checkout: ${formatDateTime(turn.checkout_date)} | Checkin: ${formatDateTime(turn.checkin_date)}`"
              >
                <template #prepend>
                  <v-avatar
                    color="error"
                    size="small"
                  >
                    <v-icon>mdi-clock-alert</v-icon>
                  </v-avatar>
                </template>
                <template #append>
                  <v-chip
                    :color="getStatusColor(turn.status)"
                    size="small"
                  >
                    {{ turn.status }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- My Bookings List -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">
              mdi-calendar-check
            </v-icon>
            My Bookings ({{ myBookings.size }})
            <v-spacer />
            <v-btn
              color="primary"
              :loading="loading"
              @click="fetchMyBookings"
            >
              <v-icon class="mr-2">
                mdi-refresh
              </v-icon>
              Refresh
            </v-btn>
          </v-card-title>
          
          <v-card-text>
            <div
              v-if="myBookings.size === 0"
              class="text-center text-medium-emphasis py-8"
            >
              <v-icon
                size="64"
                class="mb-4"
              >
                mdi-calendar-blank
              </v-icon>
              <div class="text-h6">
                No bookings found
              </div>
              <div class="text-body-2">
                Create your first booking to get started
              </div>
            </div>
            
            <v-data-table
              v-else
              :headers="bookingHeaders"
              :items="Array.from(myBookings.values())"
              :items-per-page="10"
              class="elevation-1"
            >
              <template #item.property_id="{ item }">
                {{ getPropertyName(item.property_id) }}
              </template>
              
              <template #item.booking_type="{ item }">
                <v-chip
                  :color="item.booking_type === 'turn' ? 'error' : 'primary'"
                  size="small"
                  variant="outlined"
                >
                  {{ item.booking_type }}
                </v-chip>
              </template>
              
              <template #item.status="{ item }">
                <v-chip
                  :color="getStatusColor(item.status)"
                  size="small"
                >
                  {{ item.status }}
                </v-chip>
              </template>
              
              <template #item.priority="{ item }">
                <v-chip
                  :color="getPriorityColor(calculateMyBookingPriority(item))"
                  size="small"
                  variant="outlined"
                >
                  {{ calculateMyBookingPriority(item) }}
                </v-chip>
              </template>
              
              <template #item.checkout_date="{ item }">
                {{ formatDate(item.checkout_date) }}
              </template>
              
              <template #item.checkin_date="{ item }">
                {{ formatDate(item.checkin_date) }}
              </template>
              
              <template #item.actions="{ item }">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="editBooking(item)"
                />
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="confirmDeleteBooking(item)"
                />
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Upcoming Cleanings -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">
              mdi-calendar-clock
            </v-icon>
            My Upcoming Cleanings (Next 7 Days)
          </v-card-title>
          <v-card-text>
            <div
              v-if="myUpcomingCleanings.size === 0"
              class="text-center text-medium-emphasis"
            >
              No upcoming cleanings in the next 7 days
            </div>
            <v-timeline
              v-else
              side="end"
              density="compact"
            >
              <v-timeline-item
                v-for="cleaning in myUpcomingCleanings"
                :key="cleaning.id"
                :dot-color="cleaning.booking_type === 'turn' ? 'error' : 'primary'"
                size="small"
              >
                <template #opposite>
                  <div class="text-caption">
                    {{ formatDate(cleaning.checkout_date) }}
                  </div>
                </template>
                <v-card
                  variant="outlined"
                  class="mb-2"
                >
                  <v-card-text class="py-2">
                    <div class="font-weight-medium">
                      {{ getPropertyName(cleaning.property_id) }}
                    </div>
                    <div class="text-caption">
                      {{ formatDateTime(cleaning.checkout_date) }} → {{ formatDateTime(cleaning.checkin_date) }}
                    </div>
                    <div class="d-flex align-center mt-1">
                      <v-chip
                        :color="cleaning.booking_type === 'turn' ? 'error' : 'primary'"
                        size="x-small"
                        class="mr-2"
                      >
                        {{ cleaning.booking_type }}
                      </v-chip>
                      <v-chip
                        :color="getStatusColor(cleaning.status)"
                        size="x-small"
                      >
                        {{ cleaning.status }}
                      </v-chip>
                    </div>
                  </v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Test Actions -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">
              mdi-test-tube
            </v-icon>
            Test Actions
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="3"
              >
                <v-btn
                  block
                  color="primary"
                  :loading="loading"
                  :disabled="!currentUserId"
                  @click="testCreateBooking"
                >
                  Test Create Booking
                </v-btn>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="3"
              >
                <v-btn
                  block
                  color="secondary"
                  :loading="loading"
                  :disabled="!currentUserId || myBookings.size === 0"
                  @click="testUpdateBooking"
                >
                  Test Update First Booking
                </v-btn>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="3"
              >
                <v-btn
                  block
                  color="warning"
                  :loading="loading"
                  :disabled="!currentUserId || myBookings.size === 0"
                  @click="testStatusChange"
                >
                  Test Status Change
                </v-btn>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="3"
              >
                <v-btn
                  block
                  color="info"
                  :loading="loading"
                  :disabled="!currentUserId"
                  @click="generateSampleData"
                >
                  Generate Sample Data
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Confirmation Dialog -->
    <v-dialog
      v-model="showDeleteDialog"
      max-width="400"
    >
      <v-card>
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete this booking?
          <div class="mt-2 font-weight-medium">
            {{ bookingToDelete ? getPropertyName(bookingToDelete.property_id) : '' }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDeleteDialog = false">
            Cancel
          </v-btn>
          <v-btn
            color="error"
            :loading="loading"
            @click="executeDelete"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useOwnerBookings } from '@/composables/owner/useOwnerBookings-supabase';
import { useAuthStore } from '@/stores/auth';
import { usePropertyStore } from '@/stores/property';
import type { Booking, BookingFormData } from '@/types';

// Composables
const ownerBookings = useOwnerBookings();
const authStore = useAuthStore();
const propertyStore = usePropertyStore();

// Destructure owner booking composable
const {
  loading,
  error,
  success,
  myBookings,
  myProperties,
  myTodayTurns,
  myUpcomingCleanings,
  myBookingStats,
  fetchMyBookings,
  createMyBooking,
  updateMyBooking,
  deleteMyBooking,
  changeMyBookingStatus,
  calculateMyBookingPriority
} = ownerBookings;

// Local state
const showDeleteDialog = ref(false);
const bookingToDelete = ref<Booking | null>(null);

// Computed
const currentUserId = computed(() => authStore.user?.id);

// Table headers
const bookingHeaders = [
  { title: 'Property', key: 'property_id', sortable: true },
  { title: 'Type', key: 'booking_type', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Priority', key: 'priority', sortable: false },
  { title: 'Checkout', key: 'checkout_date', sortable: true },
  { title: 'Checkin', key: 'checkin_date', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
];

// Helper functions
function getPropertyName(propertyId: string): string {
  const property = propertyStore.getPropertyById(propertyId);
  return property ? property.name : 'Unknown Property';
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

function formatStatKey(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'orange',
    scheduled: 'blue',
    in_progress: 'purple',
    completed: 'green',
    cancelled: 'red'
  };
  return colors[status] || 'grey';
}

function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: 'grey',
    normal: 'blue',
    high: 'orange',
    urgent: 'red'
  };
  return colors[priority] || 'grey';
}

// Test functions
async function testCreateBooking() {
  const propertiesArray = Array.from(myProperties.value.values());
  if (!currentUserId.value || propertiesArray.length === 0) {
    error.value = 'No properties available for testing';
    return;
  }
  
  const testBookingData: BookingFormData = {
    property_id: propertiesArray[0].id,
    checkout_date: new Date().toISOString(),
    checkin_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    booking_type: 'standard',
    status: 'pending',
    guest_count: 2,
    notes: 'Test booking created from demo',
    owner_id: currentUserId.value
  };
  
  await createMyBooking(testBookingData);
}

async function testUpdateBooking() {
  const bookingsArray = Array.from(myBookings.value.values());
  if (bookingsArray.length === 0) return;
  
  const firstBooking = bookingsArray[0];
  const updates: Partial<BookingFormData> = {
    notes: `Updated at ${new Date().toLocaleTimeString()}`,
    guest_count: (firstBooking.guest_count || 1) + 1
  };
  
  await updateMyBooking(firstBooking.id, updates);
}

async function testStatusChange() {
  if (myBookings.value.length === 0) return;
  
  const firstBooking = myBookings.value[0];
  const nextStatus = firstBooking.status === 'pending' ? 'scheduled' : 'pending';
  
  await changeMyBookingStatus(firstBooking.id, nextStatus);
}

async function generateSampleData() {
  if (!currentUserId.value || myProperties.value.length === 0) {
    error.value = 'No properties available for sample data generation';
    return;
  }
  
  const sampleBookings: BookingFormData[] = [
    {
      property_id: myProperties.value[0].id,
      checkout_date: new Date().toISOString(),
      checkin_date: new Date().toISOString(), // Same day = turn
      booking_type: 'turn',
      status: 'pending',
      guest_count: 4,
      notes: 'Urgent turn booking - same day checkout/checkin',
      owner_id: currentUserId.value
    },
    {
      property_id: myProperties.value[0].id,
      checkout_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
      checkin_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      booking_type: 'standard',
      status: 'pending',
      guest_count: 2,
      notes: 'Standard booking with 1-day gap',
      owner_id: currentUserId.value
    }
  ];
  
  for (const bookingData of sampleBookings) {
    await createMyBooking(bookingData);
  }
}

function editBooking(booking: Booking) {
  // In a real app, this would open an edit modal
  console.log('Edit booking:', booking);
  success.value = `Edit functionality would open for booking ${booking.id}`;
}

function confirmDeleteBooking(booking: Booking) {
  bookingToDelete.value = booking;
  showDeleteDialog.value = true;
}

async function executeDelete() {
  if (bookingToDelete.value) {
    await deleteMyBooking(bookingToDelete.value.id);
    showDeleteDialog.value = false;
    bookingToDelete.value = null;
  }
}
</script>

<style scoped>
.v-card {
  margin-bottom: 16px;
}
</style> 