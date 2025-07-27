<template>
  <div class="admin-users-page">
    <AdminUsers />
  </div>
</template>

<script setup lang="ts">
import AdminUsers from '@/components/smart/admin/AdminUsers.vue';

// Meta information for this page
defineOptions({
  name: 'AdminUsersPage'
});
</script>

<style scoped>
.admin-users-page {
  height: 100vh;
  width: 100%;
}
</style>
