<template>
  <AdminCalendar />
</template>

<script setup lang="ts">
import AdminCalendar from '@/components/smart/admin/AdminCalendar.vue';

defineOptions({
  name: 'AdminSchedulePage'
});
</script>

<style scoped>
.admin-calendar-page {
  height: 100vh;
  width: 100%;
}
</style>