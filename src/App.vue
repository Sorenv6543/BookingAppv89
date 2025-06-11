<!-- App.vue -->
<template>
  <component :is="layoutComponent" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from '@/layouts/default.vue';
import AuthLayout from '@/layouts/auth.vue';

const route = useRoute();

// Dynamic layout based on route meta
const layoutComponent = computed(() => {
  const layoutName = route.meta?.layout as string || 'default';
  
  switch (layoutName) {
    case 'auth':
      return AuthLayout;
    case 'default':
    default:
      return DefaultLayout;
  }
});
</script>

<style>
/* Global styles */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Roboto', sans-serif;
}

#app {
  height: 100vh;
  width: 100%;
}

/* Ensure Vuetify works properly */
.v-application {
  font-family: 'Roboto', sans-serif !important;
}

/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgb(var(--v-theme-surface-variant));
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgb(var(--v-theme-on-surface-variant));
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgb(var(--v-theme-primary));
}

/* Loading and transition classes for future use */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: opacity 0.3s ease;
}

.page-transition-enter-from,
.page-transition-leave-to {
  opacity: 0;
}
</style>