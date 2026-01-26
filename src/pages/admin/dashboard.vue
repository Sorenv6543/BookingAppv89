<template>
  <AdminDashboard @toggle-sidebar="handleToggleSidebar" />
</template>

<script setup lang="ts">
import AdminDashboard from '@/components/smart/admin/AdminDashboard.vue';

// Handle sidebar toggle event from child component
const handleToggleSidebar = () => {
  // Emit event to layout to toggle sidebar
  // Note: This would typically be handled by the layout component
  console.log('Toggle sidebar requested from dashboard');
};
</script>