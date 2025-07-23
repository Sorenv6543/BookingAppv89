<template>
  <div class="properties-page">
    <!-- ✅ Thin wrapper - delegates to smart component -->
    <!-- ✅ Maintains single source of truth through shared composables -->
    <OwnerProperties />
  </div>
</template>

<script setup lang="ts">
import OwnerProperties from '@/components/smart/owner/OwnerProperties.vue'

// Meta information for this page
defineOptions({
  name: 'OwnerPropertiesPage'
})
</script>

<style scoped>
.properties-page {
  height: 100vh;
}
</style> 