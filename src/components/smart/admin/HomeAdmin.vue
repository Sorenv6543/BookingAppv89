<template>
  <div class="admin-layout-container">
    <AdminSidebar
      :total-properties="totalProperties"
      :active-cleanings-today="activeCleaningsToday"
      :urgent-turns-count="urgentTurnsCount"
      :total-bookings="totalBookings"
      :total-revenue="totalRevenue"
      :bookings="bookings"
      :loading="loading"
      :current-view="currentView"
      :current-date="currentDate"
      :properties="properties"
    />

    <AdminCalendar
      :bookings="bookings"
      :loading="loading"
      :current-view="currentView"
      :current-date="currentDate"
      :properties="properties"
    />  
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Booking, Property } from '@/types/booking';

import AdminSidebar from './AdminSidebar.vue';
import { useRouter } from 'vue-router';




// Initialize router and store
const router = useRouter();
const store = useStore();

// Define props
const props = defineProps<{
    bookings: Booking[];
    loading: boolean;
    currentView: string;
    currentDate: Date;
    properties: Property[];
}>();

// Initialize state
const totalProperties = ref(0);
const activeCleaningsToday = ref(0);
const urgentTurnsCount = ref(0);
const totalBookings = ref(0);
const totalRevenue = ref(0);

// Handle create booking
const handleCreateBooking = () => {

// Handle create property
const handleCreateProperty = () => {
  router.push('/admin/properties/create');
};

// Handle create user
const handleCreateUser = () => {
  router.push('/admin/users/create');
};

// Handle create turn
const handleCreateTurn = () => {
  router.push('/admin/turns/create');
};

// Handle create notification
const handleCreateNotification = () => {
  router.push('/admin/notifications/create');
};  

// Handle create message
const handleCreateMessage = () => {
  router.push('/admin/messages/create');
};

// Handle create support
const handleCreateSupport = () => {
  router.push('/admin/supports/create');
};

// Handle create settings
const handleCreateSettings = () => {
  router.push('/admin/settings/create');
};

// Handle create profile
const handleCreateProfile = () => {
  router.push('/admin/profiles/create');
};

// Handle create notifications
const handleCreateNotifications = () => {
  router.push('/admin/notifications/create');
};
</script>

<style scoped>
.admin-layout-container {
  display: flex;
  flex-direction: row;
  height: 100vh;
}
</style>



