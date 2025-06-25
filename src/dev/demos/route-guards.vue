<template>
  <div class="route-guards-demo">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-4">
            🚦 Route Guards Demo
          </h1>
          <p class="text-body-1 mb-6">
            Test role-based authentication and authorization for the multi-tenant architecture.
          </p>
        </v-col>
      </v-row>

      <!-- Current User Status -->
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-card class="mb-4">
            <v-card-title>Current User Status</v-card-title>
            <v-card-text>
              <div v-if="authStore.isAuthenticated">
                <v-chip
                  :color="getRoleColor(authStore.user?.role)"
                  class="mb-2"
                >
                  {{ authStore.user?.role?.toUpperCase() || 'UNKNOWN' }}
                </v-chip>
                <p><strong>Name:</strong> {{ authStore.user?.name }}</p>
                <p><strong>Email:</strong> {{ authStore.user?.email }}</p>
                <p><strong>Role:</strong> {{ authStore.user?.role }}</p>
              </div>
              <div v-else>
                <v-chip
                  color="grey"
                  class="mb-2"
                >
                  NOT AUTHENTICATED
                </v-chip>
                <p>You are not logged in.</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <v-card class="mb-4">
            <v-card-title>Quick Role Switch</v-card-title>
            <v-card-text>
              <v-btn-toggle
                v-model="selectedRole"
                mandatory
                class="mb-3"
              >
                <v-btn
                  value="owner"
                  size="small"
                >
                  Owner
                </v-btn>
                <v-btn
                  value="admin"
                  size="small"
                >
                  Admin
                </v-btn>
                <v-btn
                  value="cleaner"
                  size="small"
                >
                  Cleaner
                </v-btn>
              </v-btn-toggle>
              <div class="d-flex gap-2">
                <v-btn 
                  color="primary" 
                  size="small" 
                  :loading="authStore.loading"
                  @click="loginAsRole(selectedRole)"
                >
                  Login as {{ selectedRole }}
                </v-btn>
                <v-btn 
                  color="error" 
                  size="small" 
                  :disabled="!authStore.isAuthenticated"
                  @click="authStore.logout()"
                >
                  Logout
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Route Testing -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>Route Access Testing</v-card-title>
            <v-card-text>
              <p class="text-body-2 mb-4">
                Click the buttons below to test access to different routes based on your current role.
                Watch for access denied messages and automatic redirects.
              </p>

              <!-- Owner Routes -->
              <div class="mb-4">
                <h3 class="text-h6 mb-2">
                  👤 Owner Routes
                </h3>
                <div class="d-flex flex-wrap gap-2">
                  <v-btn 
                    v-for="route in ownerRoutes" 
                    :key="route.path"
                    :color="getRouteButtonColor('owner')"
                    size="small"
                    variant="outlined"
                    @click="testRoute(route.path)"
                  >
                    {{ route.name }}
                  </v-btn>
                </div>
              </div>

              <!-- Admin Routes -->
              <div class="mb-4">
                <h3 class="text-h6 mb-2">
                  🔧 Admin Routes
                </h3>
                <div class="d-flex flex-wrap gap-2">
                  <v-btn 
                    v-for="route in adminRoutes" 
                    :key="route.path"
                    :color="getRouteButtonColor('admin')"
                    size="small"
                    variant="outlined"
                    @click="testRoute(route.path)"
                  >
                    {{ route.name }}
                  </v-btn>
                </div>
              </div>

              <!-- Public Routes -->
              <div class="mb-4">
                <h3 class="text-h6 mb-2">
                  🌐 Public Routes
                </h3>
                <div class="d-flex flex-wrap gap-2">
                  <v-btn 
                    v-for="route in publicRoutes" 
                    :key="route.path"
                    color="success"
                    size="small"
                    variant="outlined"
                    @click="testRoute(route.path)"
                  >
                    {{ route.name }}
                  </v-btn>
                </div>
              </div>

              <!-- Auth Routes -->
              <div class="mb-4">
                <h3 class="text-h6 mb-2">
                  🔐 Auth Routes
                </h3>
                <div class="d-flex flex-wrap gap-2">
                  <v-btn 
                    v-for="route in authRoutes" 
                    :key="route.path"
                    color="info"
                    size="small"
                    variant="outlined"
                    @click="testRoute(route.path)"
                  >
                    {{ route.name }}
                  </v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Test Results -->
      <v-row v-if="testResults.length > 0">
        <v-col cols="12">
          <v-card>
            <v-card-title>Test Results</v-card-title>
            <v-card-text>
              <v-timeline density="compact">
                <v-timeline-item
                  v-for="result in testResults"
                  :key="result.id"
                  :dot-color="result.success ? 'success' : 'error'"
                  size="small"
                >
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <strong>{{ result.route }}</strong>
                      <span class="text-body-2 ml-2">as {{ result.role }}</span>
                    </div>
                    <v-chip 
                      :color="result.success ? 'success' : 'error'" 
                      size="small"
                    >
                      {{ result.success ? 'ALLOWED' : 'DENIED' }}
                    </v-chip>
                  </div>
                  <div
                    v-if="result.message"
                    class="text-body-2 text-medium-emphasis mt-1"
                  >
                    {{ result.message }}
                  </div>
                </v-timeline-item>
              </v-timeline>
              
              <v-btn 
                color="warning" 
                size="small" 
                class="mt-3" 
                @click="clearResults"
              >
                Clear Results
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { UserRole } from '@/types/router'

const router = useRouter()
const authStore = useAuthStore()

// State
const selectedRole = ref<UserRole>('owner')
const testResults = ref<Array<{
  id: string
  route: string
  role: string
  success: boolean
  message?: string
  timestamp: Date
}>>([])

// Route definitions for testing
const ownerRoutes = [
  { name: 'Owner Dashboard', path: '/owner/dashboard' },
  { name: 'Owner Properties', path: '/owner/properties' },
  { name: 'Owner Calendar', path: '/owner/calendar' },
  { name: 'Owner Bookings', path: '/owner/bookings' }
]

const adminRoutes = [
  { name: 'Admin Dashboard', path: '/admin' },
  { name: 'Admin Schedule', path: '/admin/schedule' },
  { name: 'Admin Cleaners', path: '/admin/cleaners' },
  { name: 'Admin Properties', path: '/admin/properties' },
  { name: 'Admin Bookings', path: '/admin/bookings' },
  { name: 'Admin Reports', path: '/admin/reports' }
]

const publicRoutes = [
  { name: 'Home', path: '/' },
  { name: 'Demos', path: '/demos' },
  { name: 'CRUD Testing', path: '/testing/crud' }
]

const authRoutes = [
  { name: 'Login', path: '/auth/login' },
  { name: 'Register', path: '/auth/register' }
]

// Methods
async function loginAsRole(role: UserRole) {
  try {
    await authStore.login(`${role}@example.com`, 'password')
    
    // Update the user role after login
    if (authStore.user) {
      authStore.user.role = role
      authStore.user.name = `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`
    }
    
    addTestResult('Login', `Logged in as ${role}`, true, `Successfully authenticated as ${role}`)
  } catch (error) {
    addTestResult('Login', `Failed to login as ${role}`, false, String(error))
  }
}

function testRoute(path: string) {
  const currentRole = authStore.user?.role || 'unauthenticated'
  
  try {
    // Attempt to navigate to the route
    router.push(path).then(() => {
      addTestResult(path, currentRole, true, 'Navigation successful')
    }).catch((error) => {
      addTestResult(path, currentRole, false, `Navigation failed: ${error.message}`)
    })
  } catch (error) {
    addTestResult(path, currentRole, false, `Error: ${String(error)}`)
  }
}

function addTestResult(route: string, role: string, success: boolean, message?: string) {
  testResults.value.unshift({
    id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    route,
    role,
    success,
    message,
    timestamp: new Date()
  })
  
  // Keep only last 20 results
  if (testResults.value.length > 20) {
    testResults.value = testResults.value.slice(0, 20)
  }
}

function clearResults() {
  testResults.value = []
}

function getRoleColor(role?: string) {
  switch (role) {
    case 'owner': return 'primary'
    case 'admin': return 'error'
    case 'cleaner': return 'success'
    default: return 'grey'
  }
}

function getRouteButtonColor(requiredRole: string) {
  const userRole = authStore.user?.role
  if (!authStore.isAuthenticated) return 'grey'
  if (userRole === requiredRole) return 'success'
  if (userRole === 'admin' && requiredRole === 'owner') return 'warning' // Admin can access owner routes
  return 'error'
}
</script>

<style scoped>
.route-guards-demo {
  min-height: 100vh;
  padding: 20px 0;
}

.gap-2 {
  gap: 8px;
}
</style> 