<template>
  <v-navigation-drawer
    v-model="sidebarOpen"
    :top="0"
    class="owner-sidebar"
    :width="280"
    elevation="0"
    color="white"
    :temporary="props.temporary"
    location="left"
   
  >
      <div 
  v-show="sidebarOpen || !mobile"
  class="claro-brand-overlay"
>
  <div class="claro-brand-section">
    <div class="claro-brand-icon">
      <v-icon color="white" size="24">mdi-calendar</v-icon>
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
const { xs, md, lg, mobile, sm } = useDisplay();

// v-model support
const sidebarOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
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

/* Target all Vuetify navigation drawer elements */
:deep(.v-navigation-drawer) {
  
}

:deep(.v-navigation-drawer__scrim) {
 
}

:deep(.v-navigation-drawer__content) {

}

.owner-sidebar-drawer {

}

.owner-sidebar :deep(.v-navigation-drawer__content) {
 
}

/* Sidebar Content Spacing */
.sidebar-content-spacing {
  margin-top: 100px; /* Push content below brand overlay */
}

/* Section Headers */
.section-header {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1976d2;
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
  color: #374151 !important;
  font-weight: 500 !important;
}

.nav-item:hover {
  background: #f3f4f6 !important;
}

.nav-item.active-nav-item {
  background: #1976d2 !important;
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
  color: #374151 !important;
  font-weight: 500 !important;
}

.action-item:hover {
  background: #f3f4f6 !important;
}

/* Icon styling */
:deep(.v-list-item__prepend .v-icon) {
  color: #6b7280;
  opacity: 1;
}

.nav-item:hover :deep(.v-list-item__prepend .v-icon) {
  color: #374151;
}

.action-item:hover :deep(.v-list-item__prepend .v-icon) {
  color: #374151;
}

/* List item title styling */
:deep(.v-list-item-title) {
  font-size: 0.875rem !important;
  font-weight: 500 !important;
}

/* Responsive adjustments */
@media (max-width: 959px) {
  .sidebar-content-spacing {
    margin-top: 80px; /* Smaller spacing on mobile */
  }
}
/* ================================================================ */
/* CLARO BRAND OVERLAY - OVER APP BAR */
/* ================================================================ */

.claro-brand-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100px;
  background: #1976d2;

  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.claro-brand-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.claro-brand-icon {
  width: 48px;
  height: 48px;
  background: #1976d2;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.claro-brand-info {
  flex: 1;
}

.claro-brand-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  line-height: 1.2;
}

.claro-brand-subtitle {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.2;
}

/* Responsive Brand Overlay */
@media (max-width: 959px) {
  .claro-brand-overlay {
    height: 80px; /* Smaller on mobile */
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
 
}

.v-overlay__scrim {

}
</style> 