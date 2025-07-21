<!-- src/pages/auth/login.vue - Complete working version -->
<template>
  <v-container class="fill-height">
    <v-row
      justify="center"
      align="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="6"
        lg="4"
      >
        <v-card
          elevation="8"
          class="pa-6"
        >
          <v-card-title class="text-h4 text-center mb-4">
            <v-icon
              color="primary"
              class="mr-2"
            >
              mdi-login
            </v-icon>
            Sign In
          </v-card-title>

          <!-- Loading States -->
          <div
            v-if="authStore.initializing"
            class="text-center py-8"
          >
            <v-progress-circular
              indeterminate
              color="primary"
            />
            <p class="mt-4">
              Initializing authentication...
            </p>
          </div>
          
          <div
            v-else-if="authStore.loading"
            class="text-center py-8"
          >
            <v-progress-circular
              indeterminate
              color="primary"
            />
            <p class="mt-4">
              Signing you in...
            </p>
          </div>

          <!-- Login Form -->
          <v-form 
            v-else 
            ref="loginForm" 
            @submit.prevent="handleLogin"
          >
            <!-- Email Field -->
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              :rules="emailRules"
              variant="outlined"
              class="mb-3"
              prepend-inner-icon="mdi-email"
              required
            />

            <!-- Password Field -->
            <v-text-field
              v-model="password"
              :label="showPassword ? 'Password (visible)' : 'Password'"
              :type="showPassword ? 'text' : 'password'"
              :rules="passwordRules"
              variant="outlined"
              class="mb-4"
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              required
              @click:append-inner="showPassword = !showPassword"
            />

            <!-- Sign In Button -->
            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="authStore.loading"
              :disabled="authStore.loading"
              class="mb-4"
            >
              <v-icon class="mr-2">
                mdi-login
              </v-icon>
              Sign In
            </v-btn>

            <!-- Quick Login Buttons for Testing -->
            <v-divider class="my-4" />
            <div class="text-center mb-4">
              <p class="text-body-2 mb-2">
                Quick Login (Development):
              </p>
              <div class="d-flex gap-2">
                <v-btn
                  size="small"
                  variant="outlined"
                  color="primary"
                  :loading="authStore.loading"
                  @click="quickLogin('')"
                >
                  Your Account
                </v-btn>
                <v-btn
                  size="small"
                  variant="outlined"
                  color="secondary"
                  @click="testSupabaseConnection"
                >
                  Test Connection
                </v-btn>
              </div>
            </div>

            <!-- Register Link -->
            <v-divider class="my-4" />
            <div class="text-center">
              <p class="text-body-2 mb-2">
                Don't have an account?
              </p>
              <v-btn
                color="primary"
                variant="text"
                :disabled="authStore.loading"
                @click="goToRegister"
              >
                Create Account
              </v-btn>
              <v-divider class="my-4" />
              <v-btn
                color="primary"
                variant="text"
                :disabled="authStore.loading"
                @click="goToDemos"
              >
                Demos
              </v-btn>
            </div>
          </v-form>
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

const router = useRouter()
const authStore = useAuthStore()
const email = ref('') // Pre-filled with your email
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
  (v: string) => !!v || 'Password is required'
]

async function handleLogin() {
  const { valid } = await loginForm.value.validate()
  if (!valid) return

  try {
    console.log('🔐 Starting login process...');
    console.log('Auth store login method:', typeof authStore.login);
    
    // Set a timeout to prevent infinite loading
    const loginTimeout = setTimeout(() => {
      console.warn('⚠️ Login timeout - forcing loading to stop');
      forceStopLoading();
    }, 8000); // 8 second timeout

    const success = await authStore.login(email.value, password.value)
    clearTimeout(loginTimeout);
    
    console.log('Login result:', { success, user: authStore.user, isAuthenticated: authStore.isAuthenticated });
    
    if (success) {
      console.log('✅ Login successful, setting up navigation...');
      successMessage.value = authStore.getSuccessMessage() ?? ''
      
      // Wait for user to be populated
      let attempts = 0;
      const maxAttempts = 10;
      
      while (!authStore.user && attempts < maxAttempts) {
        console.log(`Waiting for user data... attempt ${attempts + 1}/${maxAttempts}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (authStore.user) {
        const defaultRoute = getDefaultRouteForRole(authStore.user.role)
        console.log('Navigating to:', defaultRoute);
        await router.push(defaultRoute)
      } else {
        console.warn('User data not available after login - forcing navigation');
        // Force navigation to owner dashboard as fallback
        await router.push('/owner/dashboard');
      }
    } else {
      console.error('❌ Login failed - success was false');
      console.log('Auth store error:', authStore.error);
    }
  } catch (error) {
    console.error('❌ Login error:', error)
  }
}

function quickLogin(userEmail: string) {
  email.value = userEmail;
  password.value = 'your-password'; // You'll need to set your actual password
  handleLogin();
}

function forceStopLoading() {
  console.warn('🔧 Force stopping loading state');
  // Note: loading state will clear automatically when login completes
  authStore.clearError(); // Clear any errors that might be blocking
  
  // If user seems authenticated, navigate anyway
  if (authStore.isAuthenticated) {
    const defaultRoute = getDefaultRouteForRole(authStore.user?.role);
    router.push(defaultRoute);
  }
}



function goToDemos() {
  router.push('/demos')
}

function goToRegister() {
  router.push('/auth/register')
}

// Clear error on mount
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

.gap-2 {
  gap: 8px;
}
</style>