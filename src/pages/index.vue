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

  <!-- Redirect unauthenticated users to login -->
  <div
    v-else-if="!authStore.isAuthenticated"
    class="redirect-container"
  >
    <v-container class="fill-height">
      <v-row
        justify="center"
        align="center"
      >
        <v-col cols="auto">
          <v-progress-circular
            indeterminate
            size="48"
            color="primary"
          />
          <div class="text-body-1 mt-4 text-center">
            Redirecting to login...
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <!-- Authenticated users get redirected by route guards -->
  <div
    v-else
    class="redirect-container"
  >
    <v-container class="fill-height">
      <v-row
        justify="center"
        align="center"
      >
        <v-col cols="auto">
          <v-progress-circular
            indeterminate
            size="48"
            color="primary"
          />
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
import { getDefaultRouteForRole } from '@/utils/authHelpers'

// Stores
const router = useRouter()
const authStore = useAuthStore()



// Check authentication status on mount and redirect appropriately
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
    } else {
      // If user is not authenticated, redirect to login
      await router.push('/auth/login')
    }
  } catch (error) {
    console.error('Auth check failed:', error)
    // On error, redirect to login as well
    await router.push('/auth/login')
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