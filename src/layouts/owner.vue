<!-- layouts/owner.vue - Minimal layout for owner interface -->
<template>
  <v-app>
    <!-- Minimal container - let HomeOwner handle all layout -->
    <div class="owner-layout-container">
      <router-view />
    </div>
  </v-app>
</template>

<script setup lang="ts">
// Minimal layout for owner interface
// HomeOwner.vue handles its own app-bar, sidebar, and brand overlay
</script>

<style>
/* Minimal layout styles - don't interfere with HomeOwner's layout */
.owner-layout-container {
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
}

/* Reset any Vuetify v-main styles that could interfere */
.v-application .owner-layout-container {
  padding: 0 !important;
  margin: 0 !important;
}
</style>