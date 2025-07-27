<!-- 
👑 ADMIN INTERFACE
 src/components/smart/admin/HomeAdmin.vue - 

✅ UNFILTERED VIEW - Admin sees all data
✅ Access to all properties across all owners
✅ System-wide metrics and controls
✅ Can manage any owner's data 

 -->
<template>
  <div class="home-admin-layout">
    <!-- Main Dashboard Content (sidebar and header are now in admin layout) -->
    <AdminDashboard />
  </div>
</template>

<script setup lang="ts">
import AdminDashboard from './AdminDashboard.vue';

// Meta information
defineOptions({
  name: 'HomeAdmin'
});
</script>

<style scoped>
.home-admin-layout {
  height: 100%;
  width: 100%;
}
</style>
