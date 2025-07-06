<template>
  <div class="owner-bookings-page">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <div class="d-flex justify-space-between align-center mb-4">
            <h1 class="text-h4">
              My Bookings
            </h1>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="handleCreateBooking"
            >
              New Booking
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Booking Stats -->
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
                  mdi-calendar-check
                </v-icon>
                <div>
                  <div class="text-h6">
                    {{ ownerBookingsArray.length }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    Total Bookings
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
                    {{ turnBookings.length }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    Turn Bookings
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
                  mdi-calendar-today
                </v-icon>
                <div>
                  <div class="text-h6">
                    {{ todayBookings.length }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    Today
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
      </v-row>

      <!-- Filters -->
      <v-row class="mb-4">
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="selectedProperty"
            :items="propertyOptions"
            label="Filter by Property"
            clearable
            prepend-inner-icon="mdi-home"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="selectedStatus"
            :items="statusOptions"
            label="Filter by Status"
            clearable
            prepend-inner-icon="mdi-filter"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="selectedType"
            :items="typeOptions"
            label="Filter by Type"
            clearable
            prepend-inner-icon="mdi-tag"
          />
        </v-col>
      </v-row>

      <!-- Bookings List -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              Bookings ({{ ownerBookingsArray.length }})
            </v-card-title>
            
            <v-data-table
              :headers="tableHeaders"
              :items="bookingItems"
              :loading="loading"
              item-key="id"
              class="elevation-0"
            >
              <template #[`item.property_name`]="{ item }">
                <div class="d-flex align-center">
                  <v-icon
                    class="mr-2"
                    size="small"
                  >
                    mdi-home
                  </v-icon>
                  {{ item.property_name }}
                </div>
              </template>

              <template #[`item.booking_type`]="{ item }">
                <v-chip
                  :color="item.booking_type === 'turn' ? 'warning' : 'primary'"
                  size="small"
                  variant="tonal"
                >
                  {{ item.booking_type === 'turn' ? 'Turn' : 'Standard' }}
                </v-chip>
              </template>

              <template #[`item.status`]="{ item }">
                <v-chip
                  :color="getStatusColor(item.status)"
                  size="small"
                  variant="tonal"
                >
                  {{ item.status }}
                </v-chip>
              </template>

              <template #[`item.dates`]="{ item }">
                <div>
                  <div class="text-body-2">
                    <strong>Out:</strong> {{ formatDate(item.checkout_date) }}
                  </div>
                  <div class="text-body-2">
                    <strong>In:</strong> {{ formatDate(item.checkin_date) }}
                  </div>
                </div>
              </template>

              <template #[`item.actions`]="{ item }">
                <div class="d-flex gap-1">
                  <v-btn
                    icon="mdi-pencil"
                    size="small"
                    variant="text"
                    @click="handleEditBooking(item)"
                  />
                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    variant="text"
                    color="error"
                    @click="handleDeleteBooking(item)"
                  />
                </div>
              </template>
            </v-data-table>

            <!-- Empty State -->
            <div
              v-if="ownerBookingsArray.length === 0"
              class="text-center py-8"
            >
              <v-icon
                size="64"
                color="grey-lighten-1"
                class="mb-4"
              >
                mdi-calendar-blank
              </v-icon>
              <h3 class="text-h6 mb-2">
                No Bookings Yet
              </h3>
              <p class="text-body-2 text-medium-emphasis mb-4">
                Create your first booking to get started.
              </p>
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                @click="handleCreateBooking"
              >
                Create Booking
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useOwnerBookings } from '@/composables/owner/useOwnerBookings-supabase';
import { useOwnerProperties } from '@/composables/owner/useOwnerProperties';
import { useUIStore } from '@/stores/ui';
import type { Booking, ModalData } from '@/types';

// Meta information for this page
defineOptions({
  name: 'OwnerBookingsPage'
});

// Composables
const { 
  myBookings: ownerBookings,
  myTodayTurns: todayBookings,
  myUpcomingCleanings: upcomingBookings,
  fetchMyBookings,
  deleteMyBooking
} = useOwnerBookings();

const {
  myProperties: ownerProperties,
  fetchMyProperties
} = useOwnerProperties();

// Stores
const uiStore = useUIStore();

// Reactive state
const selectedProperty = ref<string | null>(null);
const selectedStatus = ref<string | null>(null);
const selectedType = ref<string | null>(null);
const loading = ref(false);

// Computed
const ownerBookingsArray = computed(() => 
  Array.from(ownerBookings.value.values())
);

const turnBookings = computed(() => 
  ownerBookingsArray.value.filter(b => b.booking_type === 'turn')
);

const propertyOptions = computed(() => [
  ...Array.from(ownerProperties.value.values()).map(p => ({
    title: p.name,
    value: p.id
  }))
]);

const statusOptions = [
  { title: 'Pending', value: 'pending' },
  { title: 'Scheduled', value: 'scheduled' },
  { title: 'In Progress', value: 'in_progress' },
  { title: 'Completed', value: 'completed' }
];

const typeOptions = [
  { title: 'Standard', value: 'standard' },
  { title: 'Turn', value: 'turn' }
];

const bookingItems = computed(() => {
  let filtered = ownerBookingsArray.value;

  if (selectedProperty.value) {
    filtered = filtered.filter(b => b.property_id === selectedProperty.value);
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(b => b.status === selectedStatus.value);
  }

  if (selectedType.value) {
    filtered = filtered.filter(b => b.booking_type === selectedType.value);
  }

  return filtered.map(booking => ({
    ...booking,
    property_name: getPropertyName(booking.property_id)
  })).sort((a, b) => 
    new Date(b.checkout_date).getTime() - new Date(a.checkout_date).getTime()
  );
});

const tableHeaders = [
  { title: 'Property', key: 'property_name', sortable: false },
  { title: 'Type', key: 'booking_type', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Dates', key: 'dates', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, width: '100px' }
];

// Methods
const getPropertyName = (propertyId: string): string => {
  const property = Array.from(ownerProperties.value.values()).find(p => p.id === propertyId);
  return property?.name || 'Unknown Property';
};

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'warning',
    scheduled: 'info',
    in_progress: 'primary',
    completed: 'success'
  };
  return colors[status] || 'grey';
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Event handlers
const handleCreateBooking = (): void => {
  uiStore.openModal('eventModal', 'create');
};

const handleEditBooking = (booking: Booking): void => {
  uiStore.openModal('eventModal', 'edit', {booking: booking as unknown as ModalData});
};

const handleDeleteBooking = async (booking: Booking): Promise<void> => {
  // Simple confirmation for now
  if (confirm(`Are you sure you want to delete this booking for ${getPropertyName(booking.property_id)}?`)) {
    try {
      await deleteMyBooking(booking.id);
      uiStore.addNotification('success', 'Success', 'Booking deleted successfully');
    } catch (error: unknown) {
      console.error('Error deleting booking:', error);
      uiStore.addNotification('error', 'Error', 'Failed to delete booking');
    }
  }
};

// Initialize data
onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([
      fetchMyBookings(),
      fetchMyProperties()
    ]);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.owner-bookings-page {
  padding: 1rem;
  min-height: calc(100vh - 64px);
}

.gap-1 {
  gap: 0.25rem;
}
</style> 