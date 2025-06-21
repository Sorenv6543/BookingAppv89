<!-- OWNER LAYOUT- SIDEBAR NAVIGATION AND APP BAR 
 src/pages/owner/index.vue - Owner Dashboard

✅ FILTERED VIEW - Owner sees only their data
✅ Filters properties by owner_id
✅ Filters bookings by owner_id
✅ Prevents access to other owners' data
--->
```


<template>
  <v-app>
    <!-- OwnerVbar: Shows only current owner's data -->

        
    

  
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
  import { ref } from 'vue';
  import { useDisplay } from 'vuetify';

  import ThemePicker from '@/components/dumb/shared/ThemePicker.vue';

  // Reactive state for the navigation drawer
  const drawer = ref(true);
  const rail = ref(false);
  
  
  // Store connections
  const { mobile} = useDisplay();
  
  // Methods
  const toggleSidebar = (): void => {
    if (mobile.value) {
      // On mobile, toggle the drawer visibility
      drawer.value = !drawer.value;
    } else {
      // On desktop, toggle the rail mode
      rail.value = !rail.value;
    }
  };


  
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