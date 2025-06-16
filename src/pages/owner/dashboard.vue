<template>
  <div class="owner-dashboard">
    <HomeOwner />
  </div>
</template>

<script setup lang="ts">
import HomeOwner from '@/components/smart/owner/HomeOwner.vue';

// Meta information for this page
defineOptions({
  name: 'OwnerDashboard'
});
</script>

<style scoped>
.owner-dashboard {
  height: 100%;
  width: 100%;
}
</style> 