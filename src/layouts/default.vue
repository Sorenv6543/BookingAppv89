<!-- layouts/default.vue -->
<template>
    <v-app>
      <!-- Navigation Drawer -->
      <v-navigation-drawer
        v-model="sidebarVisible"
        app
        clipped
        :temporary="$vuetify.display.mobile"
        :permanent="!$vuetify.display.mobile"
        width="350"
        color="surface"
      >
        <!-- Sidebar content will be handled by smart components -->
        <div class="pa-4">
          <h3 class="text-h6 mb-4">Property Scheduler</h3>
          <!-- This is where Sidebar.vue will be mounted when we get to TASK-028 -->
          <div class="sidebar-placeholder">
            <v-list>
              <v-list-item>
                <v-list-item-title>Dashboard</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Properties</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Calendar</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </div>
      </v-navigation-drawer>
  
      <!-- App Bar -->
      <v-app-bar
        app
        clipped-left
        color="primary"
        dark
        elevation="1"
      >
        <v-app-bar-nav-icon
          @click="toggleSidebar"
        />
        
        <v-toolbar-title>
          Property Cleaning Scheduler
        </v-toolbar-title>
  
        <v-spacer />
  
        <!-- User Menu (placeholder for now) -->
        <v-menu offset-y>
          <template #activator="{ props }">
            <v-btn 
              icon
              v-bind="props"
            >
              <v-avatar size="32">
                <v-icon>mdi-account-circle</v-icon>
              </v-avatar>
            </v-btn>
          </template>
          
          <v-list>
            <v-list-item>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item>
            <v-divider />
            <v-list-item>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
  
      <!-- Main Content Area -->
      <v-main>
        <router-view />
      </v-main>
  
      <!-- Global Notification Area (for future use) -->
      <div id="notification-area">
        <!-- Global notifications will be mounted here -->
      </div>
  
      <!-- Global Modal Area (for future use) -->
      <div id="modal-area">
        <!-- Global modals will be mounted here -->
      </div>
    </v-app>
  </template>
  
  <script setup lang="ts">
  import { computed, watch } from 'vue';
  import { useDisplay } from 'vuetify';
  import { useUIStore } from '@/stores/ui';
  
  // Store connections
  const uiStore = useUIStore();
  const { mobile } = useDisplay();
  
  // Sidebar state from UI store
  const sidebarVisible = computed({
    get: () => uiStore.isSidebarOpen('main'),
    set: (value: boolean) => uiStore.sidebars.set('main', value)
  });
  
  // Methods
  const toggleSidebar = (): void => {
    uiStore.toggleSidebar('main');
  };
  
  // Auto-hide sidebar on mobile
  watch(mobile, (isMobile: boolean) => {
    if (isMobile) {
      uiStore.sidebars.set('main', false);
    }
  });
  </script>
  
  <style scoped>
  .sidebar-placeholder {
    /* Temporary styling for layout preview */
    opacity: 0.7;
  }
  
  /* Main content styling */
  .v-main {
    background-color: rgb(var(--v-theme-background));
  }
  
  /* App bar styling */
  .v-app-bar {
    border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  }
  
  /* Navigation drawer styling */
  .v-navigation-drawer {
    border-right: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  }
  </style>