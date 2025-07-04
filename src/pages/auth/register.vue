<template>
  <v-container class="fill-height">
    <v-row
      justify="center"
      align="center"
    >
      <v-col
        cols="12"
        sm="10"
        md="8"
        lg="6"
        xl="4"
      >
        <v-card
          elevation="8"
          class="pa-6"
        >
          <!-- Header -->
          <v-card-title class="text-h4 text-center mb-2">
            <v-icon
              class="mr-3"
              color="primary"
              size="large"
            >
              mdi-account-plus
            </v-icon>
            Create Account
          </v-card-title>
          
          <v-card-subtitle class="text-center mb-6">
            Join Property Cleaning Scheduler
          </v-card-subtitle>
          
          <!-- Error Alert -->
          <v-alert
            v-if="authStore.error"
            type="error"
            variant="tonal"
            class="mb-4"
            closable
            @click:close="authStore.clearError()"
          >
            {{ authStore.error }}
          </v-alert>
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
          
          <!-- Registration Form -->
          <v-form
            ref="registerForm"
            @submit.prevent="handleRegister"
          >
            <!-- Account Type Selection -->
            <div class="mb-6">
              <v-label class="text-subtitle-1 font-weight-medium mb-3">
                Account Type
              </v-label>
              <v-radio-group
                v-model="selectedRole"
                :rules="roleRules"
                class="mt-2"
              >
                <v-radio
                  v-for="role in availableRoles"
                  :key="role.value"
                  :value="role.value"
                  class="mb-2"
                >
                  <template #label>
                    <div class="ml-2">
                      <div class="text-subtitle-2 font-weight-medium">
                        {{ role.title }}
                      </div>
                      <div class="text-body-2 text-medium-emphasis">
                        {{ role.description }}
                      </div>
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>
            </div>
            
            <!-- Personal Information -->
            <v-text-field
              v-model="name"
              label="Full Name"
              autocomplete="name"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              :rules="nameRules"
              :disabled="authStore.loading"
              class="mb-3"
              required
            />
            
            <v-text-field
              v-model="email"
              label="Email Address"
              type="email"
              autocomplete="email"
              prepend-inner-icon="mdi-email"
              variant="outlined"
              :rules="emailRules"
              :disabled="authStore.loading"
              class="mb-3"
              required
            />
            
            <!-- Company Name (for property owners) -->
            <v-text-field
              v-if="selectedRole === 'owner'"
              v-model="companyName"
              label="Company Name (Optional)"
              autocomplete="organization"
              prepend-inner-icon="mdi-office-building"
              variant="outlined"
              :disabled="authStore.loading"
              class="mb-3"
              hint="e.g., Your Property Management Company"
              persistent-hint
            />
            
            <!-- Password Fields -->
            <v-text-field
              v-model="password"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              variant="outlined"
              :rules="passwordRules"
              :disabled="authStore.loading"
              class="mb-3"
              required
              @click:append-inner="showPassword = !showPassword"
            />
            
            <v-text-field
              v-model="confirmPassword"
              label="Confirm Password"
              :type="showConfirmPassword ? 'text' : 'password'"
              autocomplete="new-password"
              prepend-inner-icon="mdi-lock-check"
              :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
              variant="outlined"
              :rules="confirmPasswordRules"
              :disabled="authStore.loading"
              class="mb-4"
              required
              @click:append-inner="showConfirmPassword = !showConfirmPassword"
            />
            
            <!-- Terms and Conditions -->
            <v-checkbox
              v-model="agreeToTerms"
              :rules="termsRules"
              :disabled="authStore.loading"
              class="mb-4"
            >
              <template #label>
                <div class="text-body-2">
                  I agree to the 
                  <a
                    href="#"
                    class="text-primary"
                    @click.prevent="showTerms = true"
                  >
                    Terms of Service
                  </a> 
                  and 
                  <a
                    href="#"
                    class="text-primary"
                    @click.prevent="showPrivacy = true"
                  >
                    Privacy Policy
                  </a>
                </div>
              </template>
            </v-checkbox>
            
            <!-- Submit Button -->
            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="authStore.loading"
              class="mb-4"
              @click="handleRegister"
            >
              <v-icon class="mr-2">
                mdi-account-plus
              </v-icon>
              Create Account
            </v-btn>
          </v-form>
          
          <!-- Footer Links -->
          <v-divider class="my-4" />
          
          <div class="text-center">
            <p class="text-body-2 mb-2">
              Already have an account?
            </p>
            <v-btn
              color="primary"
              variant="text"
              :disabled="authStore.loading"
              @click="goToLogin"
            >
              Sign In
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Terms Dialog -->
    <v-dialog
      v-model="showTerms"
      max-width="600"
    >
      <v-card>
        <v-card-title>Terms of Service</v-card-title>
        <v-card-text>
          <p>This is a demo application. In a real application, this would contain the actual terms of service.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showTerms = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Privacy Dialog -->
    <v-dialog
      v-model="showPrivacy"
      max-width="600"
    >
      <v-card>
        <v-card-title>Privacy Policy</v-card-title>
        <v-card-text>
          <p>This is a demo application. In a real application, this would contain the actual privacy policy.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showPrivacy = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getAvailableRoles, getDefaultRouteForRole } from '@/utils/authHelpers'
import type { UserRole } from '@/types'

// Router and stores
const router = useRouter()
const authStore = useAuthStore()

// Form data
const name = ref('')
const email = ref('')
const companyName = ref('')
const password = ref('')
const confirmPassword = ref('')
const selectedRole = ref<UserRole>('owner') // Default to owner
const agreeToTerms = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const successMessage = ref('')
const registerForm = ref()

// Dialog states
const showTerms = ref(false)
const showPrivacy = ref(false)

// Available roles for registration
const availableRoles = getAvailableRoles()

// Validation rules
const nameRules = [
  (v: string) => !!v || 'Full name is required',
  (v: string) => v.length >= 2 || 'Name must be at least 2 characters'
]

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 8 || 'Password must be at least 8 characters',
  (v: string) => /(?=.*[a-z])/.test(v) || 'Password must contain at least one lowercase letter',
  (v: string) => /(?=.*[A-Z])/.test(v) || 'Password must contain at least one uppercase letter',
  (v: string) => /(?=.*\d)/.test(v) || 'Password must contain at least one number'
]

const confirmPasswordRules = [
  (v: string) => !!v || 'Please confirm your password',
  (v: string) => v === password.value || 'Passwords do not match'
]

const roleRules = [
  (v: UserRole) => !!v || 'Please select an account type'
]

const termsRules = [
  (v: boolean) => !!v || 'You must agree to the terms and conditions'
]

/**
 * Handle form submission
 */
async function handleRegister() {
  // Validate form
  //push to register page
  router.push('/auth/register')
  const { valid } = await registerForm.value.validate()
  if (!valid) return
  
  try {
    const userData = {
      email: email.value,
      password: password.value,
      name: name.value,
      role: selectedRole.value,
      company_name: companyName.value,
      

    }
    
    const success = await authStore.register(userData)
    
    if (success) {
      // Show success message
      successMessage.value = authStore.getSuccessMessage('register')

      // Navigate to role-appropriate dashboard
      const defaultRoute = getDefaultRouteForRole(authStore.user?.role)
      
      // Small delay to show success message
      setTimeout(async () => {
        await router.push(defaultRoute)
      }, 1500)
    }
  } catch (error) {
    console.error('Registration error:', error)
    // Error is handled by the auth store
  }
}

/**
 * Navigate to login page
 */
function goToLogin() {
  router.push('/auth/login')
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

/* Form field focus styling */
.v-text-field {
  transition: all 0.2s ease;
}

.v-text-field:focus-within {
  transform: translateY(-1px);
}

/* Radio group styling */
.v-radio-group {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
}

.v-radio {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding-bottom: 12px;
}

.v-radio:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

/* Link styling */
a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style> 