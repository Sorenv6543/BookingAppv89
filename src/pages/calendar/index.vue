<template>
  <div class="admin-calendar">
    <CalendarAdmin />
  </div>
</template>
  
  <script setup lang="ts">
  import CalendarAdmin from '@/components/smart/admin/CalendarAdmin.vue'
  
  // Admin dashboard page - uses HomeAdmin.vue as the main interface
  // This provides system-wide overview, metrics, and quick actions for business management
  </script>
  
  <style scoped>
  .admin-calendar {
    /* Remove height constraint to work better with Vuetify layout */
    width: 100%;
  }
  </style> 