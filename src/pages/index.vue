<template>
  <!-- Loading state while checking authentication -->
  <div v-if="authStore.loading" class="loading-container">
    <v-container class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="auto">
          <v-progress-circular
            indeterminate
            size="64"
            color="primary"
          />
          <div class="text-h6 mt-4 text-center">
            Loading...
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <!-- Role-based component rendering -->
  <component v-else :is="homeComponent" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

// Role-based component imports
import HomeOwner from '@/components/smart/owner/HomeOwner.vue'
import HomeAdmin from '@/components/smart/admin/HomeAdmin.vue'

// Auth store
const authStore = useAuthStore()

// Simple auth prompt component for unauthenticated users
const AuthPrompt = {
  template: `
    <v-container class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card elevation="8" class="pa-4">
            <v-card-title class="text-h5 text-center mb-4">
              <v-icon class="mr-2" color="primary">mdi-login</v-icon>
              Authentication Required
            </v-card-title>
            
            <v-card-text class="text-center">
              <p class="text-body-1 mb-4">
                Please log in to access the Property Cleaning Scheduler.
              </p>
              
              <v-alert
                type="info"
                variant="tonal"
                class="mb-4"
              >
                <strong>Development Mode:</strong><br>
                Authentication is currently mocked for development.
                Click "Mock Login" to continue.
              </v-alert>
              
              <v-btn
                color="primary"
                size="large"
                block
                @click="handleMockLogin"
                :loading="authStore.loading"
              >
                <v-icon class="mr-2">mdi-account-circle</v-icon>
                Mock Login (Admin)
              </v-btn>
              
              <v-btn
                color="secondary"
                variant="outlined"
                size="large"
                block
                class="mt-2"
                @click="handleMockOwnerLogin"
                :loading="authStore.loading"
              >
                <v-icon class="mr-2">mdi-home-account</v-icon>
                Mock Login (Owner)
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  `,
  setup() {
    const handleMockLogin = async () => {
      await authStore.login('admin@example.com', 'password')
    }
    
    const handleMockOwnerLogin = async () => {
      // Temporarily set user as owner for testing
      await authStore.login('owner@example.com', 'password')
      if (authStore.user) {
        authStore.user.role = 'owner'
        authStore.user.name = 'Property Owner'
      }
    }
    
    return {
      authStore,
      handleMockLogin,
      handleMockOwnerLogin
    }
  }
}

/**
 * Role-based component selection
 * This implements the multi-tenant architecture pattern where:
 * - Property owners see HomeOwner.vue (filtered to their data only)
 * - Business admins see HomeAdmin.vue (access to all data)
 * - Unauthenticated users see AuthPrompt
 * 
 * Note: This is frontend filtering for UX only, not security.
 * Real security will be implemented with backend RLS in Phase 2.
 */
const homeComponent = computed(() => {
  // Show auth prompt for unauthenticated users
  if (!authStore.isAuthenticated) {
    return AuthPrompt
  }
  
  // Show admin interface for admin users
  if (authStore.isAdmin) {
    return HomeAdmin
  }
  
  // Show owner interface for property owners
  if (authStore.isOwner) {
    return HomeOwner
  }
  
  // Fallback for unknown roles or edge cases
  console.warn('Unknown user role:', authStore.user?.role)
  return AuthPrompt
})
</script>

<style scoped>
.loading-container {
  min-height: 100vh;
}

/* Ensure smooth transitions between components */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style> 