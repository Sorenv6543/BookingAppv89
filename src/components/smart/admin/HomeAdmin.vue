<template>
  <div class="admin-layout-container">
    <!-- Admin Sidebar -->
    <AdminSidebar
      v-model="isSidebarOpen"
      :bookings="bookings"
      :properties="properties"
      :total-properties="totalProperties"
      :active-cleanings-today="activeCleaningsToday"
      :urgent-turns-count="urgentTurnsCount"
      :loading="loading"
      :current-view="currentView"
      :current-date="currentDate"
      @navigate-to-booking="handleNavigateToBooking"
      @navigate-to-date="handleNavigateToDate"
      @filter-by-property="handleFilterByProperty"
      @create-booking="handleCreateBooking"
      @create-property="handleCreateProperty"
      @assign-cleaner="handleAssignCleaner"
      @generate-reports="handleGenerateReports"
      @manage-system="handleManageSystem"
      @emergency-response="handleEmergencyResponse"
    />

    <!-- Main Dashboard Content -->
    <div class="admin-main-content">
      <v-container
        fluid
        class="pa-6"
      >
        <!-- Dashboard Header -->
        <div class="dashboard-header mb-6">
          <h1 class="text-h4 font-weight-bold mb-2">
            Admin Dashboard (HomeAdmin Component)
          </h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            System-wide management and calendar overview
          </p>
        </div>

        <!-- Quick Stats Cards -->
        <v-row class="mb-6">
          <v-col
            cols="12"
            sm="6"
            md="3"
          >
            <v-card class="stat-card">
              <v-card-text class="pa-4">
                <div class="d-flex align-center">
                  <v-icon
                    color="primary"
                    size="32"
                    class="me-3"
                  >
                    mdi-calendar-today
                  </v-icon>
                  <div>
                    <div class="text-h6 font-weight-bold">
                      {{ todayBookingsCount }}
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
            <v-card class="stat-card">
              <v-card-text class="pa-4">
                <div class="d-flex align-center">
                  <v-icon
                    color="warning"
                    size="32"
                    class="me-3"
                  >
                    mdi-fire
                  </v-icon>
                  <div>
                    <div class="text-h6 font-weight-bold">
                      {{ urgentTurnsCount }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Urgent Turns
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
            <v-card class="stat-card">
              <v-card-text class="pa-4">
                <div class="d-flex align-center">
                  <v-icon
                    color="success"
                    size="32"
                    class="me-3"
                  >
                    mdi-home-variant
                  </v-icon>
                  <div>
                    <div class="text-h6 font-weight-bold">
                      {{ totalProperties }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Active Properties
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
            <v-card class="stat-card">
              <v-card-text class="pa-4">
                <div class="d-flex align-center">
                  <v-icon
                    color="info"
                    size="32"
                    class="me-3"
                  >
                    mdi-account-group
                  </v-icon>
                  <div>
                    <div class="text-h6 font-weight-bold">
                      {{ activeCleaningsToday }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Active Cleanings
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Calendar Preview Section -->
        <v-row>
          <v-col cols="12">
            <v-card class="calendar-preview-card">
              <v-card-title class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-icon class="me-2">
                    mdi-calendar
                  </v-icon>
                  Calendar Overview
                </div>
                <v-btn
                  color="primary"
                  variant="outlined"
                  size="small"
                  @click="goToFullCalendar"
                >
                  <v-icon start>
                    mdi-fullscreen
                  </v-icon>
                  Full Calendar
                </v-btn>
              </v-card-title>
              
              <v-card-text>
                <!-- Calendar Preview Component -->
                <div class="calendar-preview-container">
                  <div class="debug-info mb-4">
                    <p><strong>Debug Info:</strong></p>
                    <p>Bookings: {{ bookingStore.bookings.size }}</p>
                    <p>Properties: {{ propertyStore.properties.size }}</p>
                    <p>Users: {{ usersMap.size }}</p>
                    <p>Loading: {{ loading }}</p>
                  </div>
                  <AdminCalendar
                    :bookings="bookingStore.bookings"
                    :properties="propertyStore.properties"
                    :users="usersMap"
                    :loading="loading"
                    :preview-mode="true"
                    @date-select="handleCalendarDateSelect"
                    @event-click="handleCalendarEventClick"
                    @view-change="handleViewChange"
                    @date-change="handleDateChange"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminSidebar from './AdminSidebar.vue';
import AdminCalendar from './AdminCalendar.vue';
import { useAdminUserManagement } from '@/composables/admin/useAdminUserManagement';
import { useBookingStore } from '@/stores/booking';
import { usePropertyStore } from '@/stores/property';
import type { Booking, Property } from '@/types';

// Composables
const router = useRouter();
const bookingStore = useBookingStore();
const propertyStore = usePropertyStore();
const { users: allUsers, fetchAllUsers } = useAdminUserManagement();

// Initialize state
const currentView = ref('month');
const currentDate = ref(new Date());
const isSidebarOpen = ref(true);
const loading = ref<boolean>(false);

const bookings = ref<Booking[]>([]);
const properties = ref<Property[]>([]);

// Computed stats for dashboard
const todayBookingsCount = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return Array.from(bookingStore.bookings.values())
    .filter(booking => booking.checkout_date.startsWith(today)).length;
});

const totalProperties = computed(() => propertyStore.properties.size);

const activeCleaningsToday = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return Array.from(bookingStore.bookings.values())
    .filter(booking => 
      booking.checkout_date.startsWith(today) && 
      booking.status === 'in_progress'
    ).length;
});

const urgentTurnsCount = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return Array.from(bookingStore.bookings.values())
    .filter(booking => 
      booking.checkout_date.startsWith(today) && 
      booking.booking_type === 'turn' && 
      booking.status !== 'completed'
    ).length;
});

// Create users Map for AdminCalendar
const usersMap = computed(() => {
  const map = new Map();
  allUsers.value.forEach(user => {
    map.set(user.id, user);
  });
  return map;
});

// Navigation handlers
const goToFullCalendar = () => {
  router.push('/admin/schedule');
};

// Event handlers
const handleNavigateToBooking = (bookingId: string) => {
  router.push(`/admin/bookings/${bookingId}`);
};

const handleNavigateToDate = (date: Date) => {
  // Navigate to calendar view with specific date
  router.push(`/admin/schedule?date=${date.toISOString().split('T')[0]}`);
};

const handleFilterByProperty = (propertyId: string | null) => {
  console.log('Filter by property:', propertyId);
  // TODO: Implement property filtering
};

const handleCreateBooking = () => {
  router.push('/admin/bookings/create');
};

const handleCreateProperty = () => {
  router.push('/admin/properties/create');
};

const handleAssignCleaner = (data: { bookingId: string, cleanerId?: string }) => {
  console.log('Assign cleaner:', data);
  // TODO: Implement cleaner assignment
};

const handleGenerateReports = () => {
  router.push('/admin/reports');
};

const handleManageSystem = () => {
  router.push('/admin/settings');
};

const handleEmergencyResponse = () => {
  console.log('Emergency response triggered');
  // TODO: Implement emergency response
};

// Calendar preview handlers
const handleCalendarDateSelect = (selectInfo: any) => {
  // Navigate to full calendar with date selection
  router.push(`/admin/schedule?date=${selectInfo.startStr}&action=create`);
};

const handleCalendarEventClick = (clickInfo: any) => {
  // Navigate to full calendar with event selected
  const booking = clickInfo.event.extendedProps.booking;
  router.push(`/admin/schedule?booking=${booking.id}`);
};

const handleViewChange = (view: string) => {
  currentView.value = view;
};

const handleDateChange = (date: Date) => {
  currentDate.value = date;
};

// Initialize data on mount
onMounted(async () => {
  console.log('🏠 [HomeAdmin] Component mounted, loading dashboard data...');
  loading.value = true;
  try {
    await Promise.all([
      fetchAllUsers(),
      bookingStore.fetchBookings(),
      propertyStore.fetchProperties()
    ]);
    console.log('✅ [HomeAdmin] Dashboard data loaded:', {
      bookings: bookingStore.bookings.size,
      properties: propertyStore.properties.size,
      users: allUsers.value.length
    });
  } catch (error) {
    console.error('❌ [HomeAdmin] Failed to fetch dashboard data:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.admin-layout-container {
  display: flex;
  flex-direction: row;
  height: 100vh;
}

.admin-main-content {
  flex: 1;
  overflow-y: auto;
  background: rgb(var(--v-theme-background));
}

.dashboard-header {
  padding-bottom: 16px;
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
}

.stat-card {
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.calendar-preview-card {
  min-height: 600px;
}

.calendar-preview-container {
  height: 500px;
  overflow: hidden;
}

.calendar-preview-container :deep(.fc) {
  height: 100%;
}

.calendar-preview-container :deep(.fc-toolbar-chunk) {
  display: flex;
  align-items: center;
}

.calendar-preview-container :deep(.fc-button-group) {
  margin-left: 8px;
}

/* Mobile responsiveness */
@media (max-width: 960px) {
  .admin-layout-container {
    flex-direction: column;
  }
  
  .stat-card {
    margin-bottom: 16px;
  }
  
  .calendar-preview-container {
    height: 400px;
  }
}

@media (max-width: 600px) {
  .dashboard-header h1 {
    font-size: 1.5rem;
  }
  
  .calendar-preview-container {
    height: 300px;
  }
}
</style>



