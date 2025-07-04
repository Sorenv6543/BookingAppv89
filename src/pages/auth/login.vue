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
            <v-btn 
              size="small" 
              variant="text" 
              class="mt-2"
              @click="forceStopLoading"
            >
              ⚠️ Force Stop (if stuck)
            </v-btn>
          </div>

          <!-- Login Form -->
          <v-form 
            v-else 
            ref="loginForm" 
            @submit.prevent="handleLogin"
          >
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
            >
              {{ successMessage }}
            </v-alert>

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
                  @click="quickLogin('jimrey@gmail.com')"
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
const email = ref('jimrey@gmail.com') // Pre-filled with your email
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
    // Set a timeout to prevent infinite loading
    const loginTimeout = setTimeout(() => {
      console.warn('⚠️ Login timeout - forcing loading to stop');
      forceStopLoading();
    }, 8000); // 8 second timeout

    const success = await authStore.login(email.value, password.value)
    clearTimeout(loginTimeout);
    
    if (success) {
      successMessage.value = authStore.getSuccessMessage() ?? ''
      const defaultRoute = getDefaultRouteForRole(authStore.user?.role)
      
      // Navigate immediately
      await router.push(defaultRoute)
    }
  } catch (error) {
    console.error('Login error:', error)
  }
}

function quickLogin(userEmail: string) {
  email.value = userEmail;
  password.value = 'your-password'; // You'll need to set your actual password
  handleLogin();
}

function forceStopLoading() {
  console.warn('🔧 Force stopping loading state');
  authStore.loading = false;
  
  // If user seems authenticated, navigate anyway
  if (authStore.isAuthenticated) {
    const defaultRoute = getDefaultRouteForRole(authStore.user?.role);
    router.push(defaultRoute);
  }
}

async function testSupabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test direct connection (this would normally be in your supabase plugin)
    const response = await fetch('https://yplrudursbvzcdaroqly.supabase.co/rest/v1/user_profiles?select=count', {
      method: 'HEAD',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwbHJ1ZHVyc2J2emNkYXJvcWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNzIyNTAsImV4cCI6MjA2Njg0ODI1MH0.D3NN6SPNG_fJ4ys_2Ju9t_9X12P18nWLyzF_nteHIuQ'
      }
    });
    
    if (response.ok) {
      console.log('✅ Supabase connection successful');
      alert('✅ Supabase connection successful');
    } else {
      console.error('❌ Supabase connection failed:', response.status);
      alert('❌ Supabase connection failed: ' + response.status);
    }
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    alert('❌ Connection test failed: ' + (error instanceof Error ? error.message : String(error)));
  }
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