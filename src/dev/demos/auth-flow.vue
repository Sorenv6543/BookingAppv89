<template>
  <v-container class="pa-6">
    <v-row>
      <v-col cols="12">
        <v-card
          elevation="2"
          class="pa-6"
        >
          <v-card-title class="text-h4 mb-4">
            <v-icon
              class="mr-3"
              color="primary"
            >
              mdi-account-check
            </v-icon>
            Authentication Flow Demo
          </v-card-title>
          
          <v-card-subtitle class="mb-6">
            Test role-based authentication and navigation
          </v-card-subtitle>
          
          <!-- Current Auth State -->
          <v-alert
            :type="authStore.isAuthenticated ? 'success' : 'info'"
            variant="tonal"
            class="mb-6"
          >
            <div class="text-h6 mb-2">
              Current Authentication State
            </div>
            <div v-if="authStore.isAuthenticated">
              <strong>User:</strong> {{ authStore.user?.name }} ({{ authStore.user?.email }})<br>
              <strong>Role:</strong> {{ authStore.user?.role }}<br>
              <strong>Current View:</strong> {{ authStore.currentRole }}<br>
              <strong>Default Route:</strong> {{ authStore.defaultRoute }}<br>
              <strong>Temp View Mode:</strong> {{ authStore.tempViewMode ? 'Yes' : 'No' }}
            </div>
            <div v-else>
              <strong>Status:</strong> Not authenticated
            </div>
          </v-alert>
          
          <!-- Error Display -->
          <v-alert
            v-if="authStore.error"
            type="error"
            variant="tonal"
            class="mb-4"
            closable
            @click:close="authStore.clearError"
          >
            {{ authStore.error }}
          </v-alert>
          
          <!-- Success Display -->
          <v-alert
            v-if="successMessage"
            type="success"
            variant="tonal"
            class="mb-4"
            closable
            @click:close="successMessage = ''"
          >
            {{ successMessage }}
          </v-alert>
          
          <!-- Authentication Actions -->
          <div class="mb-6">
            <v-card
              variant="outlined"
              class="pa-4"
            >
              <v-card-title class="text-h6 mb-4">
                Authentication Actions
              </v-card-title>
              
              <v-row class="mb-4">
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-btn
                    color="primary"
                    block
                    :loading="authStore.loading"
                    :disabled="authStore.isAuthenticated"
                    @click="loginAsOwner"
                  >
                    <v-icon class="mr-2">
                      mdi-home-account
                    </v-icon>
                    Login as Owner
                  </v-btn>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-btn
                    color="secondary"
                    block
                    :loading="authStore.loading"
                    :disabled="authStore.isAuthenticated"
                    @click="loginAsAdmin"
                  >
                    <v-icon class="mr-2">
                      mdi-shield-account
                    </v-icon>
                    Login as Admin
                  </v-btn>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-btn
                    color="warning"
                    block
                    :loading="authStore.loading"
                    :disabled="authStore.isAuthenticated"
                    @click="loginAsCleaner"
                  >
                    <v-icon class="mr-2">
                      mdi-account-hard-hat
                    </v-icon>
                    Login as Cleaner
                  </v-btn>
                </v-col>
              </v-row>
              
              <v-btn
                v-if="authStore.isAuthenticated"
                color="error"
                block
                :loading="authStore.loading"
                @click="handleLogout"
              >
                <v-icon class="mr-2">
                  mdi-logout
                </v-icon>
                Logout
              </v-btn>
            </v-card>
          </div>
          
          <!-- Admin Role Switching -->
          <div
            v-if="authStore.isAdmin"
            class="mb-6"
          >
            <v-card
              variant="outlined"
              class="pa-4"
            >
              <v-card-title class="text-h6 mb-4">
                Admin Role Switching
              </v-card-title>
              
              <AdminRoleSwitcher
                :is-in-owner-view="authStore.tempViewMode?.role === 'owner'"
                @switch-to-admin="handleSwitchToAdmin"
                @switch-to-owner="handleSwitchToOwner"
                @view-owner-properties="showMessage('Viewing owner properties')"
                @view-owner-bookings="showMessage('Viewing owner bookings')"
                @open-support-tools="showMessage('Opening support tools')"
              />
            </v-card>
          </div>
          
          <!-- Navigation Testing -->
          <div class="mb-6">
            <v-card
              variant="outlined"
              class="pa-4"
            >
              <v-card-title class="text-h6 mb-4">
                Navigation Testing
              </v-card-title>
              
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-btn
                    color="info"
                    block
                    :disabled="!authStore.isAuthenticated"
                    @click="navigateToDefault"
                  >
                    <v-icon class="mr-2">
                      mdi-home
                    </v-icon>
                    Go to Default Route
                  </v-btn>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-btn
                    color="info"
                    variant="outlined"
                    block
                    @click="goToLogin"
                  >
                    <v-icon class="mr-2">
                      mdi-login
                    </v-icon>
                    Go to Login Page
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </div>
          
          <!-- Registration Testing -->
          <div class="mb-6">
            <v-card
              variant="outlined"
              class="pa-4"
            >
              <v-card-title class="text-h6 mb-4">
                Registration Testing
              </v-card-title>
              
              <v-btn
                color="success"
                block
                @click="goToSignup"
              >
                <v-icon class="mr-2">
                  mdi-account-plus
                </v-icon>
                Go to Registration Page
              </v-btn>
            </v-card>
          </div>
          
          <!-- Auth Helpers Testing -->
          <div class="mb-6">
            <v-card
              variant="outlined"
              class="pa-4"
            >
              <v-card-title class="text-h6 mb-4">
                Auth Helpers Testing
              </v-card-title>
              
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <div class="text-body-2 mb-2">
                    <strong>Role Display Names:</strong>
                  </div>
                  <v-chip
                    class="mr-2 mb-2"
                    color="primary"
                    size="small"
                  >
                    Owner: {{ getRoleDisplayName('owner') }}
                  </v-chip>
                  <v-chip
                    class="mr-2 mb-2"
                    color="secondary"
                    size="small"
                  >
                    Admin: {{ getRoleDisplayName('admin') }}
                  </v-chip>
                  <v-chip
                    class="mr-2 mb-2"
                    color="warning"
                    size="small"
                  >
                    Cleaner: {{ getRoleDisplayName('cleaner') }}
                  </v-chip>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <div class="text-body-2 mb-2">
                    <strong>Default Routes:</strong>
                  </div>
                  <div class="text-caption">
                    Owner: {{ getDefaultRouteForRole('owner') }}<br>
                    Admin: {{ getDefaultRouteForRole('admin') }}<br>
                    Cleaner: {{ getDefaultRouteForRole('cleaner') }}
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AdminRoleSwitcher from '@/components/dumb/admin/AdminRoleSwitcher.vue'
import { 
  getDefaultRouteForRole, 
  getRoleDisplayName 
} from '@/utils/authHelpers'

// Router and stores
const router = useRouter()
const authStore = useAuthStore()

// Local state
const successMessage = ref('')

// Authentication actions
async function loginAsOwner() {
  const success = await authStore.login('owner@example.com', 'password')
  if (success) {
    successMessage.value = authStore.getSuccessMessage('login')
  }
}

async function loginAsAdmin() {
  const success = await authStore.login('admin@example.com', 'password')
  if (success) {
    successMessage.value = authStore.getSuccessMessage('login')
  }
}

async function loginAsCleaner() {
  const success = await authStore.login('cleaner@example.com', 'password')
  if (success) {
    successMessage.value = authStore.getSuccessMessage('login')
  }
}

async function handleLogout() {
  const success = await authStore.logout()
  if (success) {
    successMessage.value = authStore.getSuccessMessage('logout')
  }
}

// Role switching actions
function handleSwitchToAdmin() {
  const success = authStore.switchToAdminView()
  if (success) {
    successMessage.value = 'Switched to admin view'
  }
}

function handleSwitchToOwner() {
  const success = authStore.switchToOwnerView()
  if (success) {
    successMessage.value = 'Switched to owner view'
  }
}

// Navigation actions
function navigateToDefault() {
  if (authStore.defaultRoute) {
    router.push(authStore.defaultRoute)
  }
}

function goToLogin() {
  router.push('/auth/login')
}

function goToSignup() {
  router.push('/auth/signup')
}

// Utility functions
function showMessage(message: string) {
  successMessage.value = message
}

// Clear any existing errors when component mounts
authStore.clearError()
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}

.v-btn {
  text-transform: none;
}

.v-alert {
  transition: all 0.3s ease;
}
</style> 