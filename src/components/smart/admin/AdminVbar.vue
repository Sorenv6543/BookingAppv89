<template>
  <!-- Admin App Bar -->
  <v-app-bar
    app
    color="surface"
    elevation="2"
    class="admin-app-bar"
  >
    <!-- Mobile Menu Button  -->
    <v-app-bar-nav-icon @click="toggleDrawer" />




    <v-spacer />

    <!-- Desktop Navigation - Hidden on mobile -->
    <div
      v-if="mdAndUp"
      class="d-flex align-center mr-4"
    >
      <v-btn
        to="/admin"
        variant="text"
        prepend-icon="mdi-view-dashboard"
        class="mr-2"
      >
        Dashboard
      </v-btn>
      <v-btn
        to="/admin/schedule"
        variant="text"
        prepend-icon="mdi-calendar-clock"
        class="mr-2"
      >
        Schedule
      </v-btn>
      <v-btn
        to="/admin/cleaners"
        variant="text"
        prepend-icon="mdi-account-hard-hat"
        class="mr-2"
      >
        Cleaners
      </v-btn>
      <v-btn
        to="/admin/properties"
        variant="text"
        prepend-icon="mdi-home-group"
        class="mr-2"
      >
        Properties
      </v-btn>
      <v-btn
        to="/admin/reports"
        variant="text"
        prepend-icon="mdi-chart-line"
        class="mr-4"
      >
        Reports
      </v-btn>
    </div>
    
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
        >
          <v-avatar size="36">
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
        </v-btn>
      </template>
          
      <v-list min-width="200">
        <v-list-subheader>Admin Options</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-account-outline"
          title="Profile"
        />
        <v-list-item
          prepend-icon="mdi-cog-outline"
          title="System Settings"
        />
       
        <v-list-item
          to="/"
          prepend-icon="mdi-home"
          title="Owner View"
        />
        <v-divider class="my-2" />
        <v-list-item
          prepend-icon="mdi-logout"
          title="Logout"
          color="error"
          @click="logout"
        />
      </v-list>
      <v-divider class="my-2" />

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