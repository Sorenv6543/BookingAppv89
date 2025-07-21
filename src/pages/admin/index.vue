<template>
  <div class="admin-dashboard">
   <HomeAdmin />
  </div>
</template>

<script setup lang="ts">
import HomeAdmin from '@/components/smart/admin/HomeAdmin.vue';

// Admin dashboard page - uses HomeAdmin.vue as the main interface
// This provides system-wide overview, metrics, and quick actions for business management
defineOptions({
  name: 'AdminDashboard'
});
</script>

<style scoped>

</style> 