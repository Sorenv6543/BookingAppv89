<!-- layouts/admin.vue - Full admin layout with sidebar -->
<template>
  <v-app>
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
      @toggle-sidebar="toggleSidebar"
    />

    <!-- Main Content Area -->
    <div 
      class="admin-main-content"
      :class="{ 'sidebar-open': isSidebarOpen && !mobile }"
    >
      <router-view />
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';
import AdminSidebar from '@/components/smart/admin/AdminSidebar.vue';

import { useAdminUserManagement } from '@/composables/admin/useAdminUserManagement';
import { useBookingStore } from '@/stores/booking';
import { usePropertyStore } from '@/stores/property';
import type { Booking, Property } from '@/types';

// Composables
const router = useRouter();
const { mobile } = useDisplay();
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

// Computed stats for sidebar
const totalProperties = computed(() => propertyStore.properties.size);

const activeCleaningsToday = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return Array.from(bookingStore.bookings.values())
    .filter(booking => 
      booking.guest_departure_date.startsWith(today) && 
      booking.status === 'in_progress'
    ).length;
});

const urgentTurnsCount = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return Array.from(bookingStore.bookings.values())
    .filter(booking => 
      booking.guest_departure_date.startsWith(today) && 
      booking.booking_type === 'turn' && 
      booking.status !== 'completed'
    ).length;
});

// Navigation handlers
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Event handlers for sidebar
const handleNavigateToBooking = (bookingId: string) => {
  router.push(`/admin/bookings/${bookingId}`);
};

const handleNavigateToDate = (date: Date) => {
  router.push(`/admin/schedule?date=${date.toISOString().split('T')[0]}`);
};

const handleFilterByProperty = (propertyId: string | null) => {
  console.log('Filter by property:', propertyId);
};

const handleCreateBooking = () => {
  router.push('/admin/bookings/create');
};

const handleCreateProperty = () => {
  router.push('/admin/properties/create');
};

const handleAssignCleaner = (data: { bookingId: string, cleanerId?: string }) => {
  console.log('Assign cleaner:', data);
};

const handleGenerateReports = () => {
  router.push('/admin/reports');
};

const handleManageSystem = () => {
  router.push('/admin/settings');
};

const handleEmergencyResponse = () => {
  console.log('Emergency response triggered');
};

// Initialize data on mount
onMounted(async () => {
  console.log('🎛️ [AdminLayout] Loading admin layout data...');
  loading.value = true;
  try {
    await Promise.all([
      fetchAllUsers(),
      bookingStore.fetchBookings(),
      propertyStore.fetchProperties()
    ]);
    console.log('✅ [AdminLayout] Admin layout data loaded');
  } catch (error) {
    console.error('❌ [AdminLayout] Failed to fetch admin layout data:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* ================================================================ */
/* MAIN APP HEADER */
/* ================================================================ */

.main-app-header {
  background: white !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  border-bottom: 1px solid #e0e0e0 !important;
  z-index: 19 !important; /* Lower than sidebar z-index */
  transition: margin-left 0.3s ease-in-out;
  margin-left: 0;
}

.main-app-header.sidebar-open {
  margin-left: 280px; /* Match sidebar width */
}

.app-title {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

.brand-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-icon {
  background: #1976d2;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.brand-text {
  color: black;
  font-weight: 600;
  font-size: 1.1rem;
}

.main-app-header .v-app-bar-nav-icon {
  color: black !important;
}

.main-app-header .v-app-bar-nav-icon:hover {
  background: rgba(0, 0, 0, 0.05) !important;
}

/* ================================================================ */
/* ADMIN MAIN CONTENT LAYOUT */
/* ================================================================ */

.admin-main-content {
  transition: margin-left 0.3s ease-in-out;
  margin-left: 0;

  margin-top: 16px; /* Account for app header */
  min-height: 100vh;
}
.menu-button{
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 100px;
  left: 10px;
}

.admin-main-content.sidebar-open {
  margin-left: 280px; /* Match sidebar width */
}

/* Responsive behavior - overlay on mobile */
@media (max-width: 959px) {
  .admin-main-content.sidebar-open {
    margin-left: 0; /* No push on mobile */
  }
  
  .main-app-header.sidebar-open {
    margin-left: 0; /* No push on mobile */
  }
}
</style>
