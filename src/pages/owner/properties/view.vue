<template>
  <div class="property-view-page">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="d-flex align-center">
              <v-btn
                icon="mdi-arrow-left"
                variant="text"
                @click="$router.go(-1)"
              />
              <h1 class="text-h4 ml-4">
                {{ property?.name || 'Property Details' }}
              </h1>
            </div>
            <div
              v-if="property"
              class="d-flex gap-2"
            >
              <v-btn
                color="primary"
                prepend-icon="mdi-pencil"
                @click="handleEdit"
              >
                Edit
              </v-btn>
              <v-btn
                color="success"
                prepend-icon="mdi-plus"
                @click="handleCreateBooking"
              >
                New Booking
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row v-if="property">
        <v-col
          cols="12"
          md="8"
        >
          <!-- Property Details Card -->
          <v-card class="mb-4">
            <v-card-title>
              <v-icon
                color="primary"
                class="mr-2"
              >
                mdi-home
              </v-icon>
              Property Information
            </v-card-title>
            
            <v-card-text>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <div class="property-detail">
                    <strong>Name:</strong>
                    <div>{{ property.name }}</div>
                  </div>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <div class="property-detail">
                    <strong>Type:</strong>
                    <div>{{ property.property_type || 'Not specified' }}</div>
                  </div>
                </v-col>
                <v-col cols="12">
                  <div class="property-detail">
                    <strong>Address:</strong>
                    <div>{{ property.address }}</div>
                  </div>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <div class="property-detail">
                    <strong>Bedrooms:</strong>
                    <div>{{ property.bedrooms || 'Not specified' }}</div>
                  </div>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <div class="property-detail">
                    <strong>Bathrooms:</strong>
                    <div>{{ property.bathrooms || 'Not specified' }}</div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Recent Bookings -->
          <v-card>
            <v-card-title>
              <v-icon
                color="info"
                class="mr-2"
              >
                mdi-calendar-multiple
              </v-icon>
              Recent Bookings
            </v-card-title>
            
            <v-card-text>
              <div
                v-if="recentBookings.length === 0"
                class="text-center py-8"
              >
                <v-icon
                  color="grey"
                  size="48"
                >
                  mdi-calendar-outline
                </v-icon>
                <div class="text-body-1 text-medium-emphasis mt-2">
                  No bookings yet
                </div>
                <v-btn
                  color="primary"
                  class="mt-4"
                  @click="handleCreateBooking"
                >
                  Create First Booking
                </v-btn>
              </div>
              
              <div v-else>
                <v-list>
                  <v-list-item
                    v-for="booking in recentBookings"
                    :key="booking.id"
                    @click="handleViewBooking(booking)"
                  >
                    <v-list-item-title>
                      {{ formatBookingTitle(booking) }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ formatDateRange(booking.checkin_date, booking.checkout_date) }}
                    </v-list-item-subtitle>
                    <template #append>
                      <v-chip
                        :color="getBookingStatusColor(booking.status)"
                        size="small"
                      >
                        {{ booking.status }}
                      </v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col
          cols="12"
          md="4"
        >
          <!-- Property Stats -->
          <v-card class="mb-4">
            <v-card-title>
              <v-icon
                color="success"
                class="mr-2"
              >
                mdi-chart-line
              </v-icon>
              Statistics
            </v-card-title>
            <v-card-text>
              <div class="stat-item">
                <div class="stat-value">
                  {{ totalBookings }}
                </div>
                <div class="stat-label">
                  Total Bookings
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-value">
                  {{ upcomingBookings }}
                </div>
                <div class="stat-label">
                  Upcoming Bookings
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-value">
                  Active
                </div>
                <div class="stat-label">
                  Status
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Property Info -->
          <v-card>
            <v-card-title>
              <v-icon
                color="info"
                class="mr-2"
              >
                mdi-information
              </v-icon>
              Details
            </v-card-title>
            <v-card-text>
              <div class="text-body-2">
                <p><strong>Created:</strong> {{ formatDate(property.created_at!) }}</p>
                <p><strong>Last Updated:</strong> {{ formatDate(property.updated_at!) }}</p>
                <p><strong>Property ID:</strong> {{ property.id }}</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-else>
        <v-col cols="12">
          <v-card>
            <v-card-text class="text-center">
              <v-progress-circular
                indeterminate
                color="primary"
              />
              <div class="mt-4">
                Loading property...
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
import { useRouter, useRoute } from 'vue-router';
import { usePropertyStore } from '@/stores/property';
import { useBookingStore } from '@/stores/booking';
import type { Property, Booking } from '@/types';

const router = useRouter();
const route = useRoute();
const propertyStore = usePropertyStore();
const bookingStore = useBookingStore();

const property = ref<Property | null>(null);
const propertyId = route.params.id as string;

const recentBookings = computed(() => {
  if (!property.value) return [];
  
  return bookingStore.bookingsArray
    .filter(booking => booking.property_id === property.value!.id)
    .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
    .slice(0, 10);
});

const totalBookings = computed(() => recentBookings.value.length);

const upcomingBookings = computed(() => {
  const today = new Date();
  return recentBookings.value.filter(booking => 
    new Date(booking.checkin_date) > today
  ).length;
});

onMounted(async () => {
  try {
    await Promise.all([
      propertyStore.fetchProperties(),
      bookingStore.fetchBookings()
    ]);
    
    property.value = propertyStore.properties.get(propertyId) || null;
    
    if (!property.value) {
      router.push('/owner/properties');
    }
  } catch (error) {
    console.error('Failed to load property:', error);
    router.push('/owner/properties');
  }
});

const handleEdit = () => {
  if (property.value) {
    router.push(`/owner/properties/${property.value.id}/edit`);
  }
};

const handleCreateBooking = () => {
  // TODO: Open booking creation modal or navigate to booking create page
  console.log('Create booking for property:', property.value?.id);
};

const handleViewBooking = (booking: Booking) => {
  // TODO: Navigate to booking view page
  console.log('View booking:', booking.id);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDateRange = (checkin: string, checkout: string) => {
  const checkinDate = new Date(checkin).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const checkoutDate = new Date(checkout).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${checkinDate} - ${checkoutDate}`;
};

const formatBookingTitle = (booking: Booking) => {
  return `${booking.booking_type === 'turn' ? 'Turn' : 'Standard'} Booking`;
};

const getBookingStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'success';
    case 'pending': return 'warning';
    case 'cancelled': return 'error';
    default: return 'primary';
  }
};

defineOptions({
  name: 'PropertyViewPage'
});
</script>

<style scoped>
.property-view-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.property-detail {
  margin-bottom: 16px;
}

.property-detail strong {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}

.property-detail div {
  margin-top: 4px;
  font-size: 0.95rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px 0;
  border-bottom: 1px solid #e0e0e0;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-value {
  font-size: 2rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}

.stat-label {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-info));
  margin-top: 4px;
}

.gap-2 {
  gap: 8px;
}
</style>