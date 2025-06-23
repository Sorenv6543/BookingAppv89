<template>
  <v-app>
    <!-- Admin App Bar -->
    <v-app-bar
      app
      color="surface"
      elevation="2"
      class="admin-app-bar"
    >
      <!-- Mobile Menu Button -->
      <v-app-bar-nav-icon
       
        @click="drawer = !drawer"
        class="mr-2"
      />

      <!-- Logo and Title -->
      <div class="d-flex align-center">
        <v-avatar
          color="primary"
          size="36"
          class="mr-3"
        >
          <v-icon color="white">mdi-shield-crown</v-icon>
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

      <!-- Desktop Navigation - Hidden on mobile -->
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

    <!-- Mobile Navigation Drawer -->
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
          <v-avatar color="primary" size="40">
            <v-icon color="white">mdi-shield-crown</v-icon>
          </v-avatar>
        </template>
        <v-list-item-title class="text-h6 font-weight-bold">
          Admin Panel
        </v-list-item-title>
        <v-list-item-subtitle>
          Business Management
        </v-list-item-subtitle>
      </v-list-item>

      <v-divider />

      <!-- Mobile Navigation Items -->
      <v-list nav>
        <v-list-item
          to="/admin"
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          @click="closeMobileDrawer"
        />
        <v-list-item
          to="/admin/schedule"
          prepend-icon="mdi-calendar-clock"
          title="Master Schedule"
          @click="closeMobileDrawer"
        />
        <v-list-item
          to="/admin/cleaners"
          prepend-icon="mdi-account-hard-hat"
          title="Cleaner Management"
          @click="closeMobileDrawer"
        />
        <v-list-item
          to="/admin/properties"
          prepend-icon="mdi-home-group"
          title="All Properties"
          @click="closeMobileDrawer"
        />
        <v-list-item
          to="/admin/bookings"
          prepend-icon="mdi-calendar-edit"
          title="All Bookings"
          @click="closeMobileDrawer"
        />
        <v-list-item
          to="/admin/reports"
          prepend-icon="mdi-chart-line"
          title="Business Reports"
          @click="closeMobileDrawer"
        />
      </v-list>

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

      <!-- Mobile Footer -->
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

// Navigation state
const drawer = ref(false)

// Auth and routing
const { logout: authLogout } = useAuth()
const router = useRouter()

// Methods
const logout = async () => {
  await authLogout()
  router.push('/auth/login')
}

const closeMobileDrawer = () => {
  if (!mdAndUp.value) {
    drawer.value = false
  }
}

const createBooking = () => {
  router.push('/admin/schedule')
  closeMobileDrawer()
}

const createProperty = () => {
  router.push('/admin/properties')
  closeMobileDrawer()
}

const addCleaner = () => {
  router.push('/admin/cleaners')
  closeMobileDrawer()
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

/* Responsive app bar */
@media (max-width: 959px) {
  .admin-app-bar .v-toolbar__content {
    padding-left: 8px;
    padding-right: 8px;
  }
}
</style> 