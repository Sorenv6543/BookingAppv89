<!--
 🎭 ROOT LANDING PAGE
 src/pages/index.vue - 🏠 HOME PAGE ROUTER
 
✅ Redirects authenticated users to role-specific dashboards
✅ Shows landing page for unauthenticated users
✅ Lets route guards handle navigation
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

  <!-- Landing page for unauthenticated users -->
  <div v-else-if="!authStore.isAuthenticated">
    <AuthPrompt />
  </div>

  <!-- Authenticated users get redirected by route guards -->
  <div v-else class="redirect-container">
    <v-container class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="auto">
          <v-progress-circular indeterminate size="48" color="primary" />
          <div class="text-body-1 mt-4 text-center">
            Redirecting to your dashboard...
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import { getDefaultRouteForRole } from '@/utils/authHelpers'

// Stores
const router = useRouter()
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
              Welcome to Property Cleaning Scheduler
            </v-card-title>
            
            <v-card-text class="text-center">
              <p class="text-body-1 mb-4">
                Please log in to access your dashboard.
              </p>
              
              <v-alert
                type="info"
                variant="tonal"
                class="mb-4"
              >
                <strong>Development Mode:</strong><br>
                Quick login options for testing.
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
                Demo Login (Admin)
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
                Demo Login (Owner)
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
      try {
        const success = await authStore.login('admin@example.com', 'password')
        if (success) {
          // Let route guards handle navigation
          const defaultRoute = getDefaultRouteForRole(authStore.user?.role)
          await router.push(defaultRoute)
        }
      } catch (error) {
        console.error('Mock login failed:', error)
      }
    }
    
    const handleMockOwnerLogin = async () => {
      try {
        const success = await authStore.login('owner@example.com', 'password')
        if (success) {
          // Let route guards handle navigation
          const defaultRoute = getDefaultRouteForRole(authStore.user?.role)
          await router.push(defaultRoute)
        }
      } catch (error) {
        console.error('Mock owner login failed:', error)
      }
    }
    
    const goToLogin = () => {
      router.push('/auth/login')
    }
    
    return {
      authStore,
      uiStore,
      router,
      getDefaultRouteForRole,
      handleMockLogin,
      handleMockOwnerLogin,
      goToLogin
    }
  }
}

// Check authentication status on mount and redirect if needed
onMounted(async () => {
  try {
    // Let the auth store initialize
    if (!authStore.isAuthenticated) {
      await authStore.checkAuth()
    }
    
    // If user is authenticated, redirect to their dashboard
    if (authStore.isAuthenticated) {
      const defaultRoute = getDefaultRouteForRole(authStore.user?.role)
      if (defaultRoute !== '/' && router.currentRoute.value.path === '/') {
        await router.push(defaultRoute)
      }
    }
  } catch (error) {
    console.error('Auth check failed:', error)
  }
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