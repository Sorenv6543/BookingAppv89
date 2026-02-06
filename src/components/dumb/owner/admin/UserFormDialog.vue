<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600px"
    persistent
    scrollable
    @update:model-value="updateModelValue"
  >
    <v-card>
      <v-card-title class="d-flex align-center pa-6 pb-4">
        <v-icon
          :icon="isEditing ? 'mdi-account-edit' : 'mdi-account-plus'"
          class="me-3"
        />
        <span class="text-h5 font-weight-bold">
          {{ isEditing ? 'Edit User' : 'Create New User' }}
        </span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="closeDialog"
        />
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <v-form
          ref="formRef"
          v-model="formValid"
          validate-on="submit"
          @submit.prevent="handleSubmit"
        >
          <!-- Personal Information Section -->
          <div class="mb-6">
            <h3 class="text-h6 font-weight-medium mb-4 text-primary">
              <v-icon
                icon="mdi-account"
                class="me-2"
              />
              Personal Information
            </h3>
            
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.name"
                  label="Full Name *"
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.required, rules.minLength(2)]"
                  prepend-inner-icon="mdi-account"
                  :error-messages="errors.name"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="formData.email"
                  label="Email Address *"
                  type="email"
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.required, rules.email]"
                  prepend-inner-icon="mdi-email"
                  :error-messages="errors.email"
                  :disabled="isEditing"
                  :hint="isEditing ? 'Email cannot be changed after creation' : ''"
                  :persistent-hint="isEditing"
                />
              </v-col>

              <v-col
                v-if="!isEditing"
                cols="12"
              >
                <v-text-field
                  v-model="formData.password"
                  label="Password *"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  density="comfortable"
                  :rules="isEditing ? [] : [rules.required, rules.minLength(8)]"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  :error-messages="errors.password"
                  :hint="!isEditing ? 'Minimum 8 characters required' : ''"
                  :persistent-hint="!isEditing"
                  @click:append-inner="showPassword = !showPassword"
                />
              </v-col>

              <v-col
                v-if="!isEditing"
                cols="12"
              >
                <v-text-field
                  v-model="formData.confirmPassword"
                  label="Confirm Password *"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  variant="outlined"
                  density="comfortable"
                  :rules="isEditing ? [] : [rules.required, rules.passwordMatch]"
                  prepend-inner-icon="mdi-lock-check"
                  :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  :error-messages="errors.confirmPassword"
                  @click:append-inner="showConfirmPassword = !showConfirmPassword"
                />
              </v-col>
            </v-row>
          </div>

          <!-- Role and Access Section -->
          <div class="mb-6">
            <h3 class="text-h6 font-weight-medium mb-4 text-primary">
              <v-icon
                icon="mdi-shield-account"
                class="me-2"
              />
              Role and Access
            </h3>
            
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="formData.role"
                  :items="roleOptions"
                  label="User Role *"
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.required]"
                  prepend-inner-icon="mdi-account-group"
                  :error-messages="errors.role"
                >
                  <template #item="{ props: itemProps, item }">
                    <v-list-item v-bind="itemProps">
                      <template #prepend>
                        <v-icon
                          :icon="item.raw.icon"
                          :color="item.raw.color"
                        />
                      </template>
                      <v-list-item-title>{{ item.raw.title }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.raw.description }}</v-list-item-subtitle>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>

              <v-col
                v-if="formData.role === 'admin'"
                cols="12"
              >
                <v-select
                  v-model="formData.accessLevel"
                  :items="accessLevelOptions"
                  label="Access Level"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-security"
                  hint="Controls what admin features this user can access"
                  persistent-hint
                />
              </v-col>
            </v-row>
          </div>

          <!-- Company Information Section -->
          <div
            v-if="formData.role === 'owner'"
            class="mb-6"
          >
            <h3 class="text-h6 font-weight-medium mb-4 text-primary">
              <v-icon
                icon="mdi-domain"
                class="me-2"
              />
              Company Information
            </h3>
            
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.company_name"
                  label="Company Name"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-office-building"
                  :error-messages="errors.company_name"
                />
              </v-col>
            </v-row>
          </div>

          <!-- Cleaner Information Section -->
          <div
            v-if="formData.role === 'cleaner'"
            class="mb-6"
          >
            <h3 class="text-h6 font-weight-medium mb-4 text-primary">
              <v-icon
                icon="mdi-broom"
                class="me-2"
              />
              Cleaner Information
            </h3>
            
            <v-row>
              <v-col cols="12">
                <v-combobox
                  v-model="formData.skills"
                  label="Skills"
                  variant="outlined"
                  density="comfortable"
                  multiple
                  chips
                  :items="availableSkills"
                  prepend-inner-icon="mdi-star"
                  hint="Select or type skills (press Enter to add custom skills)"
                  persistent-hint
                />
              </v-col>

              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model.number="formData.max_daily_bookings"
                  label="Max Daily Bookings"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-calendar-today"
                  min="1"
                  max="20"
                  :error-messages="errors.max_daily_bookings"
                />
              </v-col>

              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="formData.location"
                  label="Service Location"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-map-marker"
                  placeholder="City, State"
                  :error-messages="errors.location"
                />
              </v-col>
            </v-row>
          </div>

          <!-- User Preferences Section -->
          <div class="mb-6">
            <h3 class="text-h6 font-weight-medium mb-4 text-primary">
              <v-icon
                icon="mdi-cog"
                class="me-2"
              />
              User Preferences
            </h3>
            
            <v-row>
              <v-col
                cols="12"
                sm="6"
              >
                <v-select
                  v-model="formData.timezone"
                  :items="timezoneOptions"
                  label="Timezone"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-clock"
                />
              </v-col>

              <v-col
                cols="12"
                sm="6"
              >
                <v-select
                  v-model="formData.language"
                  :items="languageOptions"
                  label="Language"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-translate"
                />
              </v-col>

              <v-col cols="12">
                <v-switch
                  v-model="formData.notifications_enabled"
                  label="Enable Email Notifications"
                  color="primary"
                  inset
                  hide-details
                />
              </v-col>
            </v-row>
          </div>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-6 pt-4">
        <v-spacer />
        <v-btn
          variant="outlined"
          size="large"
          :disabled="loading"
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        
        <v-btn
          color="primary"
          variant="elevated"
          size="large"
          :loading="loading"
          
          @click="handleSubmit"
        >
          {{ isEditing ? 'Update User' : 'Create User' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAdminErrorHandler } from '@/composables/admin/useAdminErrorHandler'
import type { User, UserRole } from '@/types'

// Props and Emits
interface Props {
  modelValue: boolean
  user?: User | null
  isEditing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  user: null,
  isEditing: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: []
}>()

// Composables
const authStore = useAuthStore()
const { handleError } = useAdminErrorHandler()

// Form state
const formRef = ref()
const formValid = ref(false)
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Form data
const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'owner' as UserRole,
  company_name: '',
  accessLevel: 'full',
  skills: [] as string[],
  max_daily_bookings: 5,
  location: '',
  timezone: 'America/New_York',
  language: 'en',
  notifications_enabled: true
})

// Error messages
const errors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  company_name: '',
  max_daily_bookings: '',
  location: ''
})

// Options
const roleOptions = [
  {
    title: 'Property Owner',
    value: 'owner',
    description: 'Manages properties and bookings',
    icon: 'mdi-home-account',
    color: 'primary'
  },
  {
    title: 'Administrator',
    value: 'admin',
    description: 'Full system access and user management',
    icon: 'mdi-shield-account',
    color: 'red'
  },
  {
    title: 'Cleaner',
    value: 'cleaner',
    description: 'Performs cleaning services',
    icon: 'mdi-broom',
    color: 'success'
  }
]

const accessLevelOptions = [
  { title: 'Full Access', value: 'full' },
  { title: 'Limited Access', value: 'limited' }
]

const availableSkills = [
  'Deep Cleaning',
  'Standard Cleaning',
  'Carpet Cleaning',
  'Window Cleaning',
  'Laundry Service',
  'Organization',
  'Green Cleaning',
  'Pet-Friendly Cleaning'
]

const timezoneOptions = [
  { title: 'Eastern Time', value: 'America/New_York' },
  { title: 'Central Time', value: 'America/Chicago' },
  { title: 'Mountain Time', value: 'America/Denver' },
  { title: 'Pacific Time', value: 'America/Los_Angeles' }
]

const languageOptions = [
  { title: 'English', value: 'en' },
  { title: 'Spanish', value: 'es' },
  { title: 'French', value: 'fr' }
]

// Validation rules
const rules = {
  required: (value: string) => !!value || 'This field is required',
  email: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Please enter a valid email address'
  },
  minLength: (min: number) => (value: string) => 
    value.length >= min || `Must be at least ${min} characters`,
  passwordMatch: (value: string) => 
    value === formData.value.password || 'Passwords do not match'
}

// Computed
const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value)
}

// Methods
function closeDialog() {
  updateModelValue(false)
  resetForm()
}

function resetForm() {
  formData.value = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'owner',
    company_name: '',
    accessLevel: 'full',
    skills: [],
    max_daily_bookings: 5,
    location: '',
    timezone: 'America/New_York',
    language: 'en',
    notifications_enabled: true
  }
  
  // Clear errors
  Object.keys(errors.value).forEach(key => {
    errors.value[key as keyof typeof errors.value] = ''
  })
  
  // Reset form validation
  nextTick(() => {
    formRef.value?.resetValidation()
  })
}

function loadUserData() {
  if (props.user && props.isEditing) {
    formData.value = {
      name: props.user.name || '',
      email: props.user.email || '',
      password: '',
      confirmPassword: '',
      role: props.user.role || 'owner',
      company_name: props.user.company_name || '',
      accessLevel: props.user.access_level || 'full',
      skills: props.user.skills || [],
      max_daily_bookings: props.user.max_daily_bookings || 5,
      location: props.user.location ? `${props.user.location.lat},${props.user.location.lng}` : '',
      timezone: props.user.timezone || 'America/New_York',
      language: props.user.language || 'en',
      notifications_enabled: props.user.notifications_enabled ?? true
    }
  }
}

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  
  if (!valid) {
    return
  }

  try {
    loading.value = true
    
    if (props.isEditing && props.user) {
      // Update existing user
      const updateData = {
        name: formData.value.name,
        role: formData.value.role,
        company_name: formData.value.company_name,
        access_level: formData.value.accessLevel,
        skills: formData.value.skills,
        max_daily_bookings: formData.value.max_daily_bookings,
        timezone: formData.value.timezone,
        language: formData.value.language,
        notifications_enabled: formData.value.notifications_enabled
      }
      
      const success = await authStore.updateProfile(updateData)
      if (success) {
        emit('saved')
        closeDialog()
      }
    } else {
      // Create new user
      const userData = {
        name: formData.value.name,
        role: formData.value.role,
        company_name: formData.value.company_name
      }
      
      const success = await authStore.register(
        formData.value.email,
        formData.value.password,
        userData
      )
      
      if (success) {
        emit('saved')
        closeDialog()
      }
    }
  } catch (error) {
    handleError(error, {
      operation: props.isEditing ? 'update_user' : 'create_user',
      component: 'UserFormDialog'
    })
  } finally {
    loading.value = false
  }
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    loadUserData()
  } else {
    resetForm()
  }
})
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}

.v-card-title {
  background-color: rgba(var(--v-theme-surface), 0.8);
}

:deep(.v-input__details) {
  margin-top: 4px;
}

:deep(.v-field__input) {
  min-height: 48px;
}
</style> 