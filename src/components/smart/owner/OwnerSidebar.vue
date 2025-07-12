<template>
  <v-navigation-drawer
    v-model="sidebarOpen"
    :top="0"
    class="owner-sidebar"
    :width="SIDEBAR_WIDTH"
    elevation="4"
    color="white"
    :temporary="props.temporary"
    location="left"
    floating
   
  >
      <div 
  v-show="showBrandOverlay"
  class="claro-brand-overlay"
>
  <div class="claro-brand-section">
    <div class="claro-brand-icon">
      <v-btn
        icon
        color="primary"
        elevation="7"
        size="large"
      >
        <v-icon color="white" size="24">mdi-calendar</v-icon>
      </v-btn>
    </div>
    <div class="claro-brand-info">
      <div class="claro-brand-title">Claro</div>
      <div class="claro-brand-subtitle">Schedule App</div>
    </div>
  </div>
</div>
    <!-- Navigation Section -->
    <div class="nav-section sidebar-content-spacing">
      <div class="section-header">Navigation</div>
      
      <v-list class="nav-list" density="compact">
        <v-list-item
          class="nav-item"
          prepend-icon="mdi-home"
          title="Home"
          @click="navigateTo('/owner/dashboard')"
        />
        
        <v-list-item
          class="nav-item active-nav-item"
          prepend-icon="mdi-calendar"
          title="Calendar"
          @click="navigateTo('/owner/calendar')"
        >
          <template #append>
            <v-icon size="16" color="white">mdi-chevron-right</v-icon>
          </template>
        </v-list-item>
        
        <v-list-item
          class="nav-item"
          prepend-icon="mdi-calendar-check"
          title="Schedule"
          @click="navigateTo('/owner/bookings')"
        />
        
        <v-list-item
          class="nav-item"
          prepend-icon="mdi-clock"
          title="Recent"
          @click="navigateTo('/owner/recent')"
        />
      </v-list>
    </div>

    <!-- Quick Actions Section -->
    <div class="actions-section">
      <div class="section-header">Quick Actions</div>
      
      <v-list class="actions-list" density="compact">
        <v-list-item
          class="action-item"
          prepend-icon="mdi-plus"
          title="New Event"
          @click="emit('createBooking')"
        />
        
        <v-list-item
          class="action-item"
          prepend-icon="mdi-cog"
          title="Settings"
          @click="navigateTo('/owner/settings')"
        />
        
        <v-list-item
          class="action-item"
          prepend-icon="mdi-account"
          title="Profile"
          @click="navigateTo('/owner/profile')"
        />
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';

// Constants for consistent sizing
const SIDEBAR_WIDTH = 280;
const BRAND_HEIGHT_DESKTOP = 180;
const BRAND_HEIGHT_MOBILE = 80;

// Define props
interface Props {
  modelValue: boolean;
  temporary?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  temporary: false
});

// Define emits
interface Emits {
  (e: 'navigateToBooking', bookingId: string): void;
  (e: 'navigateToDate', date: Date): void;
  (e: 'filterByProperty', propertyId: string | null): void;
  (e: 'createBooking'): void;
  (e: 'createProperty'): void;
  (e: 'update:modelValue', value: boolean): void;
}

const emit = defineEmits<Emits>();

// Composables
const router = useRouter();
const { mobile } = useDisplay();

// v-model support
const sidebarOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
});

// Improved brand overlay display logic
const showBrandOverlay = computed(() => {
  // Always show on desktop, show on mobile only when sidebar is open
  return !mobile.value || sidebarOpen.value;
});

// Navigation helper
const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<style scoped>
/* Navigation Drawer Z-Index Override */
.owner-sidebar {
  top:0px !important;
  background: #f8f9fa !important;

}



/* Sidebar Content Spacing */
.sidebar-content-spacing {
  margin-top: v-bind('BRAND_HEIGHT_DESKTOP + "px"'); /* Push content below brand overlay */
}

/* Section Headers */
.section-header {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  padding: 16px 20px 8px 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Navigation Section */
.nav-section {
  margin-bottom: 16px;
}

.nav-list {
  padding: 0 12px;
}

.nav-item {
  margin-bottom: 4px;
  border-radius: 8px !important;
  color: rgb(var(--v-theme-success)) !important;
  font-weight: 500 !important;
}

.nav-item:hover {
  background: #f3f4f6 !important;
}

.nav-item.active-nav-item {
  background: rgb(var(--v-theme-primary)) !important;
  color: white !important;
}

.nav-item.active-nav-item :deep(.v-list-item__prepend .v-icon) {
  color: white !important;
}

.nav-item.active-nav-item :deep(.v-list-item-title) {
  color: white !important;
}

/* Quick Actions Section */
.actions-section {
  margin-top: 16px;
}

.actions-list {
  padding: 0 12px;
}

.action-item {
  margin-bottom: 4px;
  border-radius: 8px !important;
  color: rgb(var(--v-theme-success)) !important;
  font-weight: 500 !important;
}

.action-item:hover {
  background: #f3f4f6 !important;
}

/* Icon styling */
:deep(.v-list-item__prepend .v-icon) {
  color: rgb(var(--v-theme-info));
  opacity: 1;
}

.nav-item:hover :deep(.v-list-item__prepend .v-icon) {
  color: rgb(var(--v-theme-success));
}

.action-item:hover :deep(.v-list-item__prepend .v-icon) {
  color: rgb(var(--v-theme-success));
}

/* List item title styling */
:deep(.v-list-item-title) {
  font-size: 0.95rem !important;
  font-weight: 500 !important;
}

/* Responsive adjustments */
@media (max-width: 959px) {
  .sidebar-content-spacing {
    margin-top: v-bind('BRAND_HEIGHT_MOBILE + "px"'); /* Smaller spacing on mobile */
  }
}
/* ================================================================ */
/* CLARO BRAND OVERLAY - OVER APP BAR */
/* ================================================================ */

.claro-brand-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: v-bind('SIDEBAR_WIDTH + "px"');
  height: v-bind('BRAND_HEIGHT_DESKTOP + "px"');
 
  background-color: rgb(var(--v-theme-secondary));
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.claro-brand-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.claro-brand-icon {
  width: 48px;
  height: 48px;
  background-color: rgb(var(--v-theme-primary));
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

}

.claro-brand-info {
  flex: 1;
}

.claro-brand-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  line-height: 1.2;
}

.claro-brand-subtitle {
  font-size: 0.95rem;
  color: rgb(var(--v-theme-info));
  line-height: 1.2;
}

/* Responsive Brand Overlay */
@media (max-width: 959px) {
  .claro-brand-overlay {
    height: v-bind('BRAND_HEIGHT_MOBILE + "px"'); /* Smaller on mobile */
  }
  
  .claro-brand-icon {
    width: 40px;
    height: 40px;
  }
  
  .claro-brand-title {
    font-size: 1.1rem !important;
  }
  
  .claro-brand-subtitle {
    font-size: 0.8rem !important;
  }
}
</style> 

<!-- Unscoped styles for z-index overrides -->
<style>
/* Global z-index overrides for navigation drawer */
.v-navigation-drawer.owner-sidebar {
  
}

.v-navigation-drawer--temporary {

}

.v-navigation-drawer--temporary .v-navigation-drawer__content {

}

.v-overlay--contained .v-overlay__scrim {
  background-color: rgba(0, 0, 0, 0.9);
 
}

.v-overlay__scrim {
  background-color: rgba(0, 0, 0, 0.9);
}
</style> 