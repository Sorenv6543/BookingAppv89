<template>
  <div class="admin-property-owners-page">
    <AdminPropertyOwners />
  </div>
</template>

<script setup lang="ts">
import AdminPropertyOwners from '@/components/smart/admin/AdminPropertyOwners.vue';

// Meta information for this page
defineOptions({
  name: 'AdminPropertyOwnersPage'
});
</script>

<style scoped>
.admin-property-owners-page {
  height: 100vh;
  width: 100%;
}
</style>
