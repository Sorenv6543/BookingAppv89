<!-- App.vue -->
<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup lang="ts">
import { computed, markRaw } from 'vue'
import { useRoute } from 'vue-router'

// Import layouts
import DefaultLayout from '@/layouts/default.vue'
import AuthLayout from '@/layouts/auth.vue'
import AdminLayout from '@/layouts/admin.vue'

// Available layouts
const layouts = {
  default: markRaw(DefaultLayout),
  auth: markRaw(AuthLayout),
  admin: markRaw(AdminLayout),
}

const route = useRoute()

// Determine the current layout based on route meta
const layout = computed(() => {
  const layoutName = route.meta.layout as string || 'default'
  return layouts[layoutName as keyof typeof layouts] || layouts.default
})
</script>

<style>
/* Global styles */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s ease;
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
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-on-surface-variant), 0.5);
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgb(var(--v-theme-primary));
}

/* Loading and transition classes */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: opacity 0.3s ease;
}

.page-transition-enter-from,
.page-transition-leave-to {
  opacity: 0;
}

/* Priority indicators */
.urgent-priority {
  border-left: 4px solid rgb(var(--v-theme-error)) !important;
}

.high-priority {
  border-left: 4px solid rgb(var(--v-theme-warning)) !important;
}

.standard-priority {
  border-left: 4px solid rgb(var(--v-theme-primary)) !important;
}

/* Booking type indicators */
.turn-booking {
  border-left: 4px solid rgb(var(--v-theme-error)) !important;
}

.standard-booking {
  border-left: 4px solid rgb(var(--v-theme-primary)) !important;
}

/* Animations */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(var(--v-theme-error), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0);
  }
}

.pulse-animation {
  animation: pulse 2s infinite;
}

/* Elevation transitions */
.elevation-transition {
  transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Card hover effect */
.hover-elevate {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-elevate:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(var(--v-theme-on-surface), 0.2) !important;
}

:root {
  --theme-transition-duration: 0.3s;
}

/* Add smooth transition for theme colors */
* {
  transition: background-color var(--theme-transition-duration) ease,
             border-color var(--theme-transition-duration) ease,
             color var(--theme-transition-duration) ease,
             box-shadow var(--theme-transition-duration) ease;
}

/* Exclude specific elements from transition to avoid glitches */
.v-progress-circular,
.v-progress-linear,
.v-btn__overlay,
.v-overlay__scrim,
svg,
i {
  transition: none !important;
}

/* Animation for theme changes */
@keyframes themeChange {
  0% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
}

.v-application {
  animation: themeChange 0.5s ease;
}
</style>