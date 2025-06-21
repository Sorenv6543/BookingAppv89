<template>
  <!-- App Bar -->
  <v-app-bar
    app
    color="surface"
    elevation="1"
    class="border-b"
  >
    <v-app-bar-nav-icon />
        
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
        <!-- User Avatar -->
        <v-btn 
          icon
          v-bind="menuProps"
          class="ml-2"
        >
          <v-avatar size="36">
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
        </v-btn>
        <v-btn
          v-bind="menuProps"
          class="ml-2"
          color="primary"
          variant="outlined"
          size="small"
          prepend-icon="mdi-home-outline"
          title="Home"
          @click="navigateToHome"
        >
          <v-avatar size="36">
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
        </v-btn>  
      </template>
      
      <!-- User Menu -->
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
</template>

<script setup lang="ts">
  // Import Theme Picker
  import ThemePicker from '@/components/dumb/shared/ThemePicker.vue';   

  // Import router
  import { useRouter } from 'vue-router';

  // Import router
  const router = useRouter();

  // Import router
  const navigateToHome = () => {
    router.push('/');
  };
</script>

<style scoped>













</style>