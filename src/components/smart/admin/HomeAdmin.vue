<template>
  <div class="admin-layout-container">
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AdminSidebar from './AdminSidebar.vue';
import type { Booking, Property } from '@/types';

// Composables
const router = useRouter();

// Initialize state
const totalProperties = ref(0);
const activeCleaningsToday = ref(0);
const urgentTurnsCount = ref(0);

const currentView = ref('month');
const currentDate = ref(new Date());
const isSidebarOpen = ref(true);

const bookings = ref<Booking[]>([]);
const properties = ref<Property[]>([]);
const loading = ref<boolean>(false);

// Event handlers
const handleNavigateToBooking = (bookingId: string) => {
  router.push(`/admin/bookings/${bookingId}`);
};

const handleNavigateToDate = (date: Date) => {
  // Navigate to calendar view with specific date
  router.push(`/admin/calendar?date=${date.toISOString().split('T')[0]}`);
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
</script>

<style scoped>
.admin-layout-container {
  display: flex;
  flex-direction: row;
  height: 100vh;
}
</style>



