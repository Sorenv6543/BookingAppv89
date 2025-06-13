<!-- layouts/default.vue -->
<template>
    <v-app>
      <!-- Navigation Drawer -->
      <v-navigation-drawer
        v-model="sidebarVisible"
        app
        :temporary="$vuetify.display.mobile"
        :permanent="!$vuetify.display.mobile"
        width="280"
        color="surface"
        class="border-r gradient-sidebar"
      >
        <!-- App Logo and Title -->
        <div class="pa-4 d-flex align-center">
          <v-avatar color="primary" class="mr-3">
            <v-icon color="white">mdi-broom</v-icon>
          </v-avatar>
          <h3 class="text-h5">Property Scheduler</h3>
        </div>
        
        <v-divider class="my-2"></v-divider>

        <!-- Navigation Links -->
        <v-list nav>
          <v-list-item
            to="/"
            prepend-icon="mdi-view-dashboard-outline"
            title="Dashboard"
            rounded="lg"
          ></v-list-item>
          <v-list-item
            to="/properties"
            prepend-icon="mdi-home-outline"
            title="Properties"
            rounded="lg"
          ></v-list-item>
          <v-list-item
            to="/calendar"
            prepend-icon="mdi-calendar-outline"
            title="Calendar"
            rounded="lg"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
  
      <!-- App Bar -->
      <v-app-bar
        app
        color="surface"
        elevation="1"
        class="border-b"
      >
        <v-app-bar-nav-icon
          @click="toggleSidebar"
        ></v-app-bar-nav-icon>
        
        <v-app-bar-title class="font-weight-medium">
          Property Cleaning Scheduler
        </v-app-bar-title>
  
        <v-spacer></v-spacer>
  
        <!-- Theme Picker -->
        <theme-picker></theme-picker>
  
        <!-- User Menu -->
        <v-menu location="bottom end" offset="5">
          <template #activator="{ props }">
            <v-btn 
              icon
              v-bind="props"
              class="ml-2"
            >
              <v-avatar size="36">
                <v-icon>mdi-account-circle</v-icon>
              </v-avatar>
            </v-btn>
          </template>
          
          <v-list min-width="200">
            <v-list-subheader>User Options</v-list-subheader>
            <v-list-item prepend-icon="mdi-account-outline" title="Profile"></v-list-item>
            <v-list-item prepend-icon="mdi-cog-outline" title="Settings"></v-list-item>
            <v-divider class="my-2"></v-divider>
            <v-list-item prepend-icon="mdi-logout" title="Logout" color="error"></v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
  
      <!-- Main Content Area -->
      <v-main class="bg-background bg-gradient">
        <router-view />
      </v-main>
  
      <!-- Global Notification Area -->
      <div id="notification-area">
        <!-- Global notifications will be mounted here -->
      </div>
  
      <!-- Global Modal Area -->
      <div id="modal-area">
        <!-- Global modals will be mounted here -->
      </div>
    </v-app>
  </template>
  
  <script setup lang="ts">
  import { computed, watch } from 'vue';
  import { useDisplay } from 'vuetify';
  import { useUIStore } from '@/stores/ui';
  import ThemePicker from '@/components/dumb/ThemePicker.vue';
  
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
  
  <style>
  /* Theme-aware utility classes */
  .border-b {
    border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
  }
  
  .border-r {
    border-right: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
  }
  
  /* Navigation drawer theming */
  .v-navigation-drawer {
    background: rgb(var(--v-theme-surface)) !important;
    color: rgb(var(--v-theme-on-surface)) !important;
  }
  
  /* App bar theming */
  .v-app-bar {
    background: rgb(var(--v-theme-surface)) !important;
    color: rgb(var(--v-theme-on-surface)) !important;
    border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
  }
  
  /* Main content area */
  .v-main {
    background: rgb(var(--v-theme-background)) !important;
    color: rgb(var(--v-theme-on-background)) !important;
  }
  
  /* List items in navigation */
  .v-list-item {
    color: rgb(var(--v-theme-on-surface)) !important;
  }
  
  .v-list-item:hover {
    background: rgba(var(--v-theme-primary), 0.08) !important;
  }
  
  .v-list-item--active {
    background: rgba(var(--v-theme-primary), 0.12) !important;
    color: rgb(var(--v-theme-primary)) !important;
  }
  
  /* Avatar and icons */
  .v-avatar {
    background: rgb(var(--v-theme-primary)) !important;
  }
  
  /* Menu styling */
  .v-menu .v-list {
    background: rgb(var(--v-theme-surface)) !important;
  }

  /* Glassmorphism for cards */
  .glass-card {
    background: rgba(255, 255, 255, 0.25) !important;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 16px !important;
    border: 1px solid rgba(255, 255, 255, 0.18);
  }

  /* Fade-in animation for cards */
  .fade-in {
    animation: fadeInUp 0.7s cubic-bezier(0.23, 1, 0.32, 1);
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px);}
    to { opacity: 1; transform: translateY(0);}
  }

  /* Animated button hover */
  .v-btn {
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .v-btn:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 4px 16px rgba(33, 150, 243, 0.15);
  }
  </style>