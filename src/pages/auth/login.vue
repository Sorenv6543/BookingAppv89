<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4" xl="3">
        <v-card elevation="8" class="pa-6">
          <!-- Header -->
          <v-card-title class="text-h4 text-center mb-2">
            <v-icon class="mr-3" color="primary" size="large">
              mdi-login
            </v-icon>
            Welcome Back
          </v-card-title>
          
          <v-card-subtitle class="text-center mb-6">
            Sign in to Property Cleaning Scheduler
          </v-card-subtitle>
          
          <!-- Error Alert -->
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
          
          <!-- Success Alert -->
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
          
          <!-- Development Mode Info -->
          <v-alert
            type="info"
            variant="tonal"
            class="mb-4"
          >
            <div class="text-body-2">
              <strong>Development Mode:</strong><br>
              Use the demo accounts below or enter any email/password.
            </div>
          </v-alert>
          
          <!-- Login Form -->
          <v-form @submit.prevent="handleLogin" ref="loginForm">
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              prepend-inner-icon="mdi-email"
              variant="outlined"
              :rules="emailRules"
              :disabled="authStore.loading"
              class="mb-3"
              required
            />
            
            <v-text-field
              v-model="password"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              :rules="passwordRules"
              :disabled="authStore.loading"
              class="mb-4"
              required
            />
            
            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="authStore.loading"
              class="mb-4"
            >
              <v-icon class="mr-2">mdi-login</v-icon>
              Sign In
            </v-btn>
          </v-form>
          
          <!-- Demo Accounts -->
          <v-divider class="my-4" />
          
          <div class="text-center mb-3">
            <v-chip color="info" variant="tonal" size="small">
              Demo Accounts
            </v-chip>
          </div>
          
          <v-row class="mb-4">
            <v-col cols="6">
              <v-btn
                color="secondary"
                variant="outlined"
                size="small"
                block
                @click="loginAsOwner"
                :loading="authStore.loading"
              >
                <v-icon class="mr-1" size="small">mdi-home-account</v-icon>
                Owner Demo
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                color="secondary"
                variant="outlined"
                size="small"
                block
                @click="loginAsAdmin"
                :loading="authStore.loading"
              >
                <v-icon class="mr-1" size="small">mdi-shield-account</v-icon>
                Admin Demo
              </v-btn>
            </v-col>
          </v-row>
          
          <!-- Footer Links -->
          <v-divider class="my-4" />
          
          <div class="text-center">
            <p class="text-body-2 mb-2">
              Don't have an account?
            </p>
            <v-btn
              color="primary"
              variant="text"
              @click="goToRegister"
              :disabled="authStore.loading"
            >
              Create Account
            </v-btn>
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
import { getDefaultRouteForRole } from '@/utils/authHelpers'

// Router and stores
const router = useRouter()
const authStore = useAuthStore()

// Form data
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const successMessage = ref('')
const loginForm = ref()

// Validation rules
const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 3 || 'Password must be at least 3 characters (demo mode)'
]

/**
 * Handle form submission
 */
async function handleLogin() {
  // Validate form
  const { valid } = await loginForm.value.validate()
  if (!valid) return
  
  try {
    const success = await authStore.login(email.value, password.value)
    
    if (success) {
      // Show success message
      successMessage.value = authStore.getSuccessMessage('login')
      
      // Navigate to role-appropriate dashboard
      const defaultRoute = getDefaultRouteForRole(authStore.user?.role)
      
      // Small delay to show success message, then navigate
      setTimeout(async () => {
        try {
          await router.push(defaultRoute)
        } catch (error) {
          console.error('Navigation after login failed:', error)
          // Fallback navigation
          window.location.href = defaultRoute
        }
      }, 800)
    }
  } catch (error) {
    console.error('Login error:', error)
    // Error is handled by the auth store
  }
}

/**
 * Quick login as owner demo
 */
async function loginAsOwner() {
  try {
    email.value = 'owner@example.com'
    password.value = 'password'
    await handleLogin()
  } catch (error) {
    console.error('Owner demo login failed:', error)
  }
}

/**
 * Quick login as admin demo
 */
async function loginAsAdmin() {
  try {
    email.value = 'admin@example.com'
    password.value = 'password'
    await handleLogin()
  } catch (error) {
    console.error('Admin demo login failed:', error)
  }
}

/**
 * Navigate to registration page
 */
function goToRegister() {
  router.push('/auth/signup')
}

// Clear any existing errors when component mounts
authStore.clearError()
</script>

<style scoped>
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

/* Smooth transitions */
.v-alert {
  transition: all 0.3s ease;
}

/* Demo account buttons styling */
.v-btn--variant-outlined {
  border-width: 1px;
}

/* Form field focus styling */
.v-text-field {
  transition: all 0.2s ease;
}

.v-text-field:focus-within {
  transform: translateY(-1px);
}
</style> 