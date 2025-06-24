<!--
 🎭 COMPONENT SELECTION LAYER
 src/pages/index.vue - 🎬 ROLE-BASED COMPONENT DIRECTOR
 
✅ ROOT DECISION MAKER - chooses which UI to show
✅ Renders different components based on role
✅ Handles admin view-switching
✅ Shows auth prompt for unauthenticated users
 -->

<template>
  <!-- Loading state while checking authentication -->
  <div
    v-if="authStore.loading"
    class="loading-container"
  >
    <v-container class="fill-height">
      <v-row
        justify="center"
        align="center"
      >
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
  <component
    :is="homeComponent"
    v-else
  />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'

// Role-based component imports
import HomeOwner from '@/pages/owner/index.vue'
import HomeAdmin from '@/components/smart/admin/AdminHome.vue'

// Stores
const authStore = useAuthStore()
const uiStore = useUIStore()

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
                class="mb-2"
              >
                <v-icon class="mr-2">mdi-shield-account</v-icon>
                Mock Login (Admin)
              </v-btn>
              
              <v-btn
                color="secondary"
                variant="outlined"
                size="large"
                block
                @click="handleMockOwnerLogin"
                :loading="authStore.loading"
                class="mb-4"
              >
                <v-icon class="mr-2">mdi-home-account</v-icon>
                Mock Login (Owner)
              </v-btn>
              
              <v-divider class="my-4" />
              
              <div class="text-center">
                <p class="text-body-2 mb-2">
                  Or use the full authentication flow:
                </p>
                <v-btn
                  color="primary"
                  variant="text"
                  @click="goToLogin"
                  :disabled="authStore.loading"
                >
                  Go to Login Page
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  `,
  setup() {
    const handleMockLogin = async () => {
      const success = await authStore.login('admin@example.com', 'password')
      if (success) {
        // Show success notification
        uiStore.addNotification('success', 'Welcome!', authStore.getSuccessMessage('login'))
      }
    }
    
    const handleMockOwnerLogin = async () => {
      const success = await authStore.login('owner@example.com', 'password')
      if (success) {
        // Show success notification
        uiStore.addNotification('success', 'Welcome!', authStore.getSuccessMessage('login'))
      }
    }
    
    const goToLogin = () => {
      // This would use router.push in a real component
      window.location.href = '/auth/login'
    }
    
    return {
      authStore,
      uiStore,
      handleMockLogin,
      handleMockOwnerLogin,
      goToLogin
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
  
  // Show admin interface for admin users (considering temp view mode)
  if (authStore.isAdmin) {
    // If admin is in owner view mode, show owner interface
    if (authStore.tempViewMode?.role === 'owner') {
      return HomeOwner
    }
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

// Note: Logout functionality is handled by individual components using the auth store
// The auth store's logout method automatically clears auth state and cached data

// Check authentication status on mount
onMounted(async () => {
  try {
    await authStore.checkAuth()
  } catch (error) {
    console.error('Auth check failed:', error)
  }
})

// Note: In a real app, the logout function would be provided through a global composable
// or context provider rather than exposing it globally
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

/* Auth prompt styling */
.fill-height {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.v-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.v-btn {
  text-transform: none;
}
</style> 