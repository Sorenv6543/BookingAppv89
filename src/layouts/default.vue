<!-- layouts/default.vue -->
<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar
      app
      color="surface"
      elevation="1"
      class="border-b"
    >
      <v-app-bar-nav-icon
        @click="toggleSidebar"
      />
        
      <v-app-bar-title class="font-weight-medium">
        Property Cleaning Scheduler
      </v-app-bar-title>
  
      <v-spacer />
  
      <!-- Theme Picker -->
      <ThemePicker />
  
      <!-- User Menu -->
      <v-menu
        location="bottom end"
        offset="5"
      >
        <template #activator="{ props: menuProps }">
          <v-btn 
            icon
            v-bind="menuProps"
            class="ml-2"
          >
            <v-avatar size="36">
              <v-icon>mdi-account-circle</v-icon>
            </v-avatar>
          </v-btn>
        </template>
          
        <v-list min-width="200">
          <v-list-subheader>User Options</v-list-subheader>
          <v-list-item
            prepend-icon="mdi-account-outline"
            title="Profile"
          />
          <v-list-item
            prepend-icon="mdi-cog-outline"
            title="Settings"
          />
          <v-divider class="my-2" />
          <v-list-item
            prepend-icon="mdi-logout"
            title="Logout"
            color="error"
          />
        </v-list>
      </v-menu>
    </v-app-bar>
  
    <!-- Main Content Area -->
    <v-main class="owner-main">
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
  import { ref } from 'vue'
  import ThemePicker from '@/components/dumb/shared/ThemePicker.vue'
  
  // Sidebar state (for future implementation)
  const sidebarOpen = ref(false)
  
  // Toggle sidebar function
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
    // Note: This layout doesn't currently have a sidebar,
    // but the toggle function is needed for the nav icon
    console.log('Sidebar toggle clicked')
  }
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

  
  /* App bar theming */
  .v-app-bar {
    background: rgb(var(--v-theme-surface)) !important;
    color: rgb(var(--v-theme-on-surface)) !important;
    border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
  }
  
  /* Main content area */
  .owner-main {
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