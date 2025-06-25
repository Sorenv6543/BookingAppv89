<template>
  <v-app>
    <!-- Admin App Bar -->
    <v-app-bar
      app
      color="surface"
      elevation="2"
      class="admin-app-bar"
    >
      <!-- Logo and Title -->
      <div class="d-flex align-center">
        <v-avatar
          color="primary"
          size="36"
          class="mr-3"
        >
          <v-icon color="white">
            mdi-shield-crown
          </v-icon>
        </v-avatar>
        <div>
          <div class="text-h6 font-weight-bold">
            Property Scheduler
          </div>
          <div class="admin-badge">
            Admin Dashboard
          </div>
        </div>
      </div>

      <v-spacer />

      <!-- Admin Navigation -->
      <div class="d-flex align-center mr-4">
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
      </v-menu>
    </v-app-bar>

    <!-- Main Content Area -->
    <v-main class="admin-main">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/shared/useAuth'
import { useRouter } from 'vue-router'

const { logout: authLogout } = useAuth()
const router = useRouter()

const logout = async () => {
  await authLogout()
  router.push('/auth/login')
}
</script>

<style scoped>
.admin-app-bar {
  border-bottom: 2px solid rgb(var(--v-theme-primary)) !important;
}

.admin-badge {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-primary));
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.admin-main {
  background: rgb(var(--v-theme-background)) !important;
}

/* Admin-specific button styling */
.v-btn--variant-text {
  color: rgb(var(--v-theme-on-surface)) !important;
}

.v-btn--variant-text:hover {
  background: rgba(var(--v-theme-primary), 0.08) !important;
}

.v-btn--variant-text.router-link-active {
  background: rgba(var(--v-theme-primary), 0.12) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

/* List items in user menu */
.v-list-item:hover {
  background: rgba(var(--v-theme-primary), 0.08) !important;
}

.v-list-item--active {
  background: rgba(var(--v-theme-primary), 0.12) !important;
  color: rgb(var(--v-theme-primary)) !important;
}
</style> 