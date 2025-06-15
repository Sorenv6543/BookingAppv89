<!-- layouts/auth.vue -->
<template>
  <v-app>
    <!-- Simple app bar for auth pages -->
    <v-app-bar
      app
      color="primary"
      dark
      elevation="1"
      height="64"
    >
      <v-toolbar-title>
        Property Cleaning Scheduler
      </v-toolbar-title>
        
      <v-spacer />
        
      <!-- Optional help or contact link -->
      <v-btn
        variant="text"
        color="white"
        href="mailto:support@example.com"
      >
        <v-icon start>
          mdi-help-circle
        </v-icon>
        Help
      </v-btn>
    </v-app-bar>
  
    <!-- Main content area for auth forms -->
    <v-main class="auth-main">
      <v-container 
        fluid 
        fill-height
        class="pa-0"
      >
        <v-row 
          align="center" 
          justify="center"
          no-gutters
          class="fill-height"
        >
          <v-col 
            cols="12" 
            sm="8" 
            md="6" 
            lg="4" 
            xl="3"
            class="pa-4"
          >
            <!-- Auth forms will be rendered here -->
            <router-view />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  
    <!-- Footer with basic info -->
    <v-footer
      app
      color="transparent"
      class="justify-center"
      height="auto"
    >
      <div class="text-center">
        <div class="text-caption text-medium-emphasis">
          © {{ currentYear }} Property Cleaning Scheduler
        </div>
        <div class="text-caption text-medium-emphasis mt-1">
          Streamline your cleaning operations
        </div>
      </div>
    </v-footer>
  </v-app>
</template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  // Get current year for footer
  const currentYear = computed(() => new Date().getFullYear());
  </script>
  
  <style scoped>
  .auth-main {
    background: linear-gradient(135deg, 
      rgb(var(--v-theme-primary)) 0%, 
      rgb(var(--v-theme-primary-darken-2)) 100%
    );
    min-height: 100vh;
  }
  
  /* Center the auth content */
  .v-container {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 0;
  }
  
  /* Auth card styling (will be applied to child components) */
  :deep(.v-card) {
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  
  /* Footer styling */
  .v-footer {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  </style>