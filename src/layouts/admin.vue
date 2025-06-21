<template>
  <v-app>


    <!-- Admin Navigation Drawer - Always Visible -->
    <v-navigation-drawer
      v-model="drawer"
      permanent
      app
      color="surface"
      width="280"
      class="admin-nav-drawer"
    >
      <!-- Drawer Header -->
      <v-list-item class="px-4 py-4">
        <template #prepend>
          <v-avatar
            color="primary"
            size="40"
          >
            <v-icon color="white">
              mdi-shield-crown
            </v-icon>
          </v-avatar>
        </template>
        <v-list-item-title class="text-h6 font-weight-bold">
          Admin Layout
        </v-list-item-title>
        <v-list-item-subtitle>
          Business Management
        </v-list-item-subtitle>
      </v-list-item>

      <v-divider />

   

      <v-divider class="my-2" />

      <!-- Quick Actions -->
      <v-list density="compact">
        <v-list-subheader>Quick Actions</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-plus"
          title="New Booking"
          @click="createBooking"
        />
        <v-list-item
          prepend-icon="mdi-home-plus"
          title="Add Property"
          @click="createProperty"
        />
        <v-list-item
          prepend-icon="mdi-account-plus"
          title="Add Cleaner"
          @click="addCleaner"
        />
      </v-list>

      <!-- Admin Footer -->
      <template #append>
        <div class="pa-4">
          <v-btn
            to="/"
            variant="outlined"
            block
            prepend-icon="mdi-home"
            class="mb-2"
          >
            Switch to Owner View
          </v-btn>
          <v-btn
            variant="text"
            block
            prepend-icon="mdi-logout"
            color="error"
            @click="logout"
          >
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main Content Area -->
    <v-main class="admin-main">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useAuth } from '@/composables/shared/useAuth'
import { useRouter } from 'vue-router'

// Responsive display composable
const { mdAndUp } = useDisplay()


// Navigation state (drawer is permanently visible)
const drawer = ref(true)

// Auth and routing
const { logout: authLogout } = useAuth()
const router = useRouter()

// Methods
const logout = async () => {
  await authLogout()
  router.push('/auth/login')
}

const createBooking = () => {
  router.push('/admin/schedule')
}

const createProperty = () => {
  router.push('/admin/properties')
}

const addCleaner = () => {
  router.push('/admin/cleaners')
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

.admin-nav-drawer {
  border-right: 1px solid rgb(var(--v-theme-outline-variant)) !important;
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

/* List items in drawer */
.v-list-item:hover {
  background: rgba(var(--v-theme-primary), 0.08) !important;
}

.v-list-item--active {
  background: rgba(var(--v-theme-primary), 0.12) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

/* Responsive adjustments for always-visible drawer */
@media (max-width: 800px) {
  .admin-app-bar .v-toolbar__content {
    padding-left: 8px;
    padding-right: 8px;
  }
  
  .admin-nav-drawer {
    width: 240px !important;
  }
}

@media (max-width: 600px) {
  .admin-nav-drawer {
    width: 200px !important;
  }
  
  .admin-nav-drawer .v-list-item-title {
    font-size: 0.875rem;
  }
}
</style> 