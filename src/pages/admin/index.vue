<template>
  <div class="admin-dashboard">
    <HomeAdmin />
  </div>
</template>

<script setup lang="ts">
import HomeAdmin from '@/components/smart/admin/HomeAdmin.vue';

// Meta information for this page
defineOptions({
  name: 'AdminDashboard'
});

</script>

<style scoped>

</style> 