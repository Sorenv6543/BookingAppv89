# start on task 81. use sequential thinking and the supabase
_Exported on 7/4/2025 at 07:40:28 PDT from Cursor (1.2.1)_

---

**User**

start on task 81. use sequential thinking and the supabase MCP tool to get relevant documentation. use supabase MCP tool for any migration needs ,etc. use context7 for getting vuetify documents for building a modern professional admin user management interface.

---

**Cursor**

I'll start working on Task-081 (Authentication & User Management) using sequential thinking to break down this complex task systematically.

Perfect! Now let me start gathering the necessary documentation. First, I'll research Supabase Auth documentation, then get Vuetify docs for building the admin user management interface.

Now let me get more specific Supabase documentation about user management and admin interfaces:

Now let me get Vuetify documentation for building modern admin user management interfaces:

Perfect! Now let me get the Vuetify documentation for admin interfaces and data tables:

Now let me examine the existing authentication files to understand the current implementation:

Perfect! Now I have a comprehensive understanding of the current state. Let me create a production-ready admin user management interface for Task-081.

Let me start by creating a modern admin user management interface with Vuetify components:

```vue
<template>
  <v-container fluid class="pa-6">
    <!-- Page Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold text-primary mb-2">
          User Management
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Manage system users, roles, and permissions
        </p>
      </div>
      
      <v-btn
        color="primary"
        variant="elevated"
        size="large"
        prepend-icon="mdi-account-plus"
        @click="openCreateUserDialog"
      >
        Add User
      </v-btn>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar color="primary" size="48" class="me-3">
              <v-icon>mdi-account-group</v-icon>
            </v-avatar>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Total Users</p>
              <p class="text-h5 font-weight-bold">{{ totalUsers }}</p>
            </div>
          </div>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar color="success" size="48" class="me-3">
              <v-icon>mdi-shield-account</v-icon>
            </v-avatar>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Admins</p>
              <p class="text-h5 font-weight-bold">{{ adminCount }}</p>
            </div>
          </div>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar color="info" size="48" class="me-3">
              <v-icon>mdi-home-account</v-icon>
            </v-avatar>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Owners</p>
              <p class="text-h5 font-weight-bold">{{ ownerCount }}</p>
            </div>
          </div>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar color="warning" size="48" class="me-3">
              <v-icon>mdi-broom</v-icon>
            </v-avatar>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">Cleaners</p>
              <p class="text-h5 font-weight-bold">{{ cleanerCount }}</p>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters and Search -->
    <v-card class="mb-6" elevation="2">
      <v-card-title class="pb-2">
        <v-icon class="me-2">mdi-filter-variant</v-icon>
        Filters
      </v-card-title>
      
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              label="Search users..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              clearable
              hide-details
            />
          </v-col>
          
          <v-col cols="12" md="3">
            <v-select
              v-model="roleFilter"
              :items="roleOptions"
              label="Filter by Role"
              variant="outlined"
              density="compact"
              clearable
              hide-details
            />
          </v-col>
          
          <v-col cols="12" md="3">
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              label="Filter by Status"
              variant="outlined"
              density="compact"
              clearable
              hide-details
            />
          </v-col>
          
          <v-col cols="12" md="2">
            <v-btn
              color="primary"
              variant="outlined"
              size="large"
              block
              @click="clearFilters"
            >
              Clear Filters
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Users Data Table -->
    <v-card elevation="2">
      <v-card-title class="pb-2">
        <v-icon class="me-2">mdi-account-multiple</v-icon>
        System Users
      </v-card-title>
      
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="filteredUsers"
        :loading="loading"
        :search="search"
        item-value="id"
        show-select
        v-model="selected"
      >
        <!-- User Info Column -->
        <template #item.user="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar :color="getRoleColor(item.role)" size="40" class="me-3">
              <span class="text-white font-weight-bold">
                {{ item.name.charAt(0).toUpperCase() }}
              </span>
            </v-avatar>
            <div>
              <p class="font-weight-medium mb-1">{{ item.name }}</p>
              <p class="text-caption text-medium-emphasis">{{ item.email }}</p>
            </div>
          </div>
        </template>

        <!-- Role Column -->
        <template #item.role="{ item }">
          <v-chip
            :color="getRoleColor(item.role)"
            :text="item.role.toUpperCase()"
            variant="tonal"
            size="small"
          />
        </template>

        <!-- Status Column -->
        <template #item.status="{ item }">
          <v-chip
            :color="getStatusColor(item)"
            :text="getStatusText(item)"
            variant="tonal"
            size="small"
          />
        </template>

        <!-- Company Column -->
        <template #item.company_name="{ item }">
          <span v-if="item.company_name">{{ item.company_name }}</span>
          <span v-else class="text-medium-emphasis">—</span>
        </template>

        <!-- Last Activity Column -->
        <template #item.last_sign_in="{ item }">
          <span v-if="item.last_sign_in_at">
            {{ formatDate(item.last_sign_in_at) }}
          </span>
          <span v-else class="text-medium-emphasis">Never</span>
        </template>

        <!-- Actions Column -->
        <template #item.actions="{ item }">
          <div class="d-flex gap-1">
            <v-tooltip text="Edit User">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  color="primary"
                  @click="editUser(item)"
                />
              </template>
            </v-tooltip>
            
            <v-tooltip text="Reset Password">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-lock-reset"
                  size="small"
                  variant="text"
                  color="warning"
                  @click="resetUserPassword(item)"
                />
              </template>
            </v-tooltip>
            
            <v-tooltip text="Delete User">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="deleteUser(item)"
                  :disabled="item.id === currentUser?.id"
                />
              </template>
            </v-tooltip>
          </div>
        </template>

        <!-- Loading State -->
        <template #loading>
          <v-skeleton-loader type="table-row@10" />
        </template>
      </v-data-table>
    </v-card>

    <!-- Bulk Actions (when users are selected) -->
    <v-slide-y-transition>
      <v-card v-if="selected.length > 0" class="mt-4" color="primary" variant="tonal">
        <v-card-text>
          <div class="d-flex align-center justify-space-between">
            <div>
              <v-icon class="me-2">mdi-checkbox-marked-circle</v-icon>
              {{ selected.length }} user{{ selected.length > 1 ? 's' : '' }} selected
            </div>
            
            <div class="d-flex gap-2">
              <v-btn
                variant="outlined"
                prepend-icon="mdi-email"
                @click="sendBulkEmail"
              >
                Send Email
              </v-btn>
              
              <v-btn
                variant="outlined"
                prepend-icon="mdi-account-edit"
                @click="bulkRoleChange"
              >
                Change Role
              </v-btn>
              
              <v-btn
                variant="outlined"
                color="error"
                prepend-icon="mdi-delete"
                @click="bulkDelete"
              >
                Delete Selected
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-slide-y-transition>

    <!-- Create/Edit User Dialog -->
    <UserFormDialog
      v-model="userDialog"
      :user="editingUser"
      :is-editing="isEditing"
      @saved="handleUserSaved"
    />

    <!-- Delete Confirmation Dialog -->
    <ConfirmationDialog
      v-model="deleteDialog"
      :title="deleteDialogTitle"
      :message="deleteDialogMessage"
      confirm-text="Delete"
      confirm-color="error"
      @confirm="handleDeleteConfirm"
    />

    <!-- Bulk Actions Dialogs -->
    <BulkRoleChangeDialog
      v-model="bulkRoleDialog"
      :selected-users="selected"
      @saved="handleBulkRoleSaved"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAdminErrorHandler } from '@/composables/admin/useAdminErrorHandler'
import { useLoadingState } from '@/composables/shared/useLoadingState'
import type { User, UserRole } from '@/types'

// Component imports
import UserFormDialog from '@/components/dumb/admin/UserFormDialog.vue'
import ConfirmationDialog from '@/components/dumb/shared/ConfirmationDialog.vue'
import BulkRoleChangeDialog from '@/components/dumb/admin/BulkRoleChangeDialog.vue'

// Composables
const authStore = useAuthStore()
const { handleError, showErrorAlert } = useAdminErrorHandler()
const { loading, setLoading } = useLoadingState()

// Data
const users = ref<User[]>([])
const search = ref('')
const roleFilter = ref<UserRole | null>(null)
const statusFilter = ref<string | null>(null)
const selected = ref<User[]>([])
const itemsPerPage = ref(25)

// Dialog states
const userDialog = ref(false)
const deleteDialog = ref(false)
const bulkRoleDialog = ref(false)
const editingUser = ref<User | null>(null)
const isEditing = ref(false)
const userToDelete = ref<User | null>(null)

// Current user
const currentUser = computed(() => authStore.user)

// Filter options
const roleOptions = [
  { title: 'Admin', value: 'admin' },
  { title: 'Owner', value: 'owner' },
  { title: 'Cleaner', value: 'cleaner' }
]

const statusOptions = [
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
  { title: 'Pending', value: 'pending' }
]

// Data table headers
const headers = [
  { title: 'User', key: 'user', sortable: false },
  { title: 'Role', key: 'role', width: '120px' },
  { title: 'Company', key: 'company_name', width: '150px' },
  { title: 'Status', key: 'status', width: '100px' },
  { title: 'Last Activity', key: 'last_sign_in', width: '140px' },
  { title: 'Actions', key: 'actions', sortable: false, width: '140px' }
]

// Computed properties
const totalUsers = computed(() => users.value.length)
const adminCount = computed(() => users.value.filter(u => u.role === 'admin').length)
const ownerCount = computed(() => users.value.filter(u => u.role === 'owner').length)
const cleanerCount = computed(() => users.value.filter(u => u.role === 'cleaner').length)

const filteredUsers = computed(() => {
  let result = users.value

  if (roleFilter.value) {
    result = result.filter(user => user.role === roleFilter.value)
  }

  if (statusFilter.value) {
    result = result.filter(user => getStatusText(user).toLowerCase() === statusFilter.value)
  }

  return result
})

const deleteDialogTitle = computed(() => 
  userToDelete.value ? `Delete ${userToDelete.value.name}?` : 'Delete User?'
)

const deleteDialogMessage = computed(() => 
  userToDelete.value 
    ? `Are you sure you want to delete ${userToDelete.value.name}? This action cannot be undone.`
    : 'Are you sure you want to delete this user? This action cannot be undone.'
)

// Methods
async function fetchUsers() {
  try {
    setLoading(true)
    users.value = await authStore.fetchAllUsers()
  } catch (error) {
    handleError(error, 'Failed to fetch users')
  } finally {
    setLoading(false)
  }
}

function openCreateUserDialog() {
  editingUser.value = null
  isEditing.value = false
  userDialog.value = true
}

function editUser(user: User) {
  editingUser.value = { ...user }
  isEditing.value = true
  userDialog.value = true
}

function deleteUser(user: User) {
  userToDelete.value = user
  deleteDialog.value = true
}

async function resetUserPassword(user: User) {
  try {
    setLoading(true)
    const success = await authStore.requestPasswordReset(user.email)
    if (success) {
      showSuccessMessage(`Password reset email sent to ${user.email}`)
    }
  } catch (error) {
    handleError(error, 'Failed to send password reset email')
  } finally {
    setLoading(false)
  }
}

async function handleDeleteConfirm() {
  if (!userToDelete.value) return

  try {
    setLoading(true)
    // TODO: Implement user deletion in auth store
    await authStore.deleteUser(userToDelete.value.id)
    await fetchUsers()
    showSuccessMessage(`${userToDelete.value.name} has been deleted`)
  } catch (error) {
    handleError(error, 'Failed to delete user')
  } finally {
    setLoading(false)
    deleteDialog.value = false
    userToDelete.value = null
  }
}

function handleUserSaved() {
  userDialog.value = false
  editingUser.value = null
  fetchUsers()
}

function handleBulkRoleSaved() {
  bulkRoleDialog.value = false
  selected.value = []
  fetchUsers()
}

function clearFilters() {
  search.value = ''
  roleFilter.value = null
  statusFilter.value = null
}

// Bulk actions
function sendBulkEmail() {
  // TODO: Implement bulk email functionality
  console.log('Send bulk email to:', selected.value)
}

function bulkRoleChange() {
  bulkRoleDialog.value = true
}

function bulkDelete() {
  // TODO: Implement bulk delete functionality
  console.log('Bulk delete:', selected.value)
}

// Helper functions
function getRoleColor(role: UserRole) {
  const colors = {
    admin: 'red',
    owner: 'primary',
    cleaner: 'success'
  }
  return colors[role] || 'grey'
}

function getStatusColor(user: User) {
  // Determine status based on user data
  if (!user.created_at) return 'grey'
  if (user.last_sign_in_at) return 'success'
  return 'warning'
}

function getStatusText(user: User) {
  if (!user.created_at) return 'Pending'
  if (user.last_sign_in_at) return 'Active'
  return 'Inactive'
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function showSuccessMessage(message: string) {
  // TODO: Implement success message display
  console.log('Success:', message)
}

// Lifecycle
onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.v-data-table :deep(.v-data-table__td) {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
}

.v-card {
  border-radius: 12px;
}

.text-medium-emphasis {
  opacity: 0.7;
}
</style>
```

Now let me create the UserFormDialog component that's needed for creating and editing users:

```vue
<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="updateModelValue"
    max-width="600px"
    persistent
    scrollable
  >
    <v-card>
      <v-card-title class="d-flex align-center pa-6 pb-4">
        <v-icon :icon="isEditing ? 'mdi-account-edit' : 'mdi-account-plus'" class="me-3" />
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
              <v-icon icon="mdi-account" class="me-2" />
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

              <v-col cols="12" v-if="!isEditing">
                <v-text-field
                  v-model="formData.password"
                  label="Password *"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  density="comfortable"
                  :rules="isEditing ? [] : [rules.required, rules.minLength(8)]"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  :error-messages="errors.password"
                  :hint="!isEditing ? 'Minimum 8 characters required' : ''"
                  :persistent-hint="!isEditing"
                />
              </v-col>

              <v-col cols="12" v-if="!isEditing">
                <v-text-field
                  v-model="formData.confirmPassword"
                  label="Confirm Password *"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  variant="outlined"
                  density="comfortable"
                  :rules="isEditing ? [] : [rules.required, rules.passwordMatch]"
                  prepend-inner-icon="mdi-lock-check"
                  :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showConfirmPassword = !showConfirmPassword"
                  :error-messages="errors.confirmPassword"
                />
              </v-col>
            </v-row>
          </div>

          <!-- Role and Access Section -->
          <div class="mb-6">
            <h3 class="text-h6 font-weight-medium mb-4 text-primary">
              <v-icon icon="mdi-shield-account" class="me-2" />
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
                  <template #item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template #prepend>
                        <v-icon :icon="item.raw.icon" :color="item.raw.color" />
                      </template>
                      <v-list-item-title>{{ item.raw.title }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.raw.description }}</v-list-item-subtitle>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>

              <v-col cols="12" v-if="formData.role === 'admin'">
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
          <div class="mb-6" v-if="formData.role === 'owner'">
            <h3 class="text-h6 font-weight-medium mb-4 text-primary">
              <v-icon icon="mdi-domain" class="me-2" />
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
          <div class="mb-6" v-if="formData.role === 'cleaner'">
            <h3 class="text-h6 font-weight-medium mb-4 text-primary">
              <v-icon icon="mdi-broom" class="me-2" />
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

              <v-col cols="12" sm="6">
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

              <v-col cols="12" sm="6">
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
              <v-icon icon="mdi-cog" class="me-2" />
              User Preferences
            </h3>
            
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="formData.timezone"
                  :items="timezoneOptions"
                  label="Timezone"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-clock"
                />
              </v-col>

              <v-col cols="12" sm="6">
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
          @click="closeDialog"
          :disabled="loading"
        >
          Cancel
        </v-btn>
        
        <v-btn
          color="primary"
          variant="elevated"
          size="large"
          :loading="loading"
          :disabled="!formValid"
          @click="handleSubmit"
        >
          {{ isEditing ? 'Update User' : 'Create User' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
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
      location: props.user.location || '',
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
    handleError(error, props.isEditing ? 'Failed to update user' : 'Failed to create user')
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
```

Now let me create the BulkRoleChangeDialog component:

```vue
<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="updateModelValue"
    max-width="600px"
    persistent
  >
    <v-card>
      <v-card-title class="d-flex align-center pa-6 pb-4">
        <v-icon icon="mdi-account-edit" class="me-3" />
        <span class="text-h5 font-weight-bold">
          Bulk Role Change
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
        <!-- Selected Users Preview -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-medium mb-4 text-primary">
            <v-icon icon="mdi-account-multiple" class="me-2" />
            Selected Users ({{ selectedUsers.length }})
          </h3>
          
          <v-card variant="outlined" class="pa-4" max-height="200" style="overflow-y: auto;">
            <div v-if="selectedUsers.length === 0" class="text-center text-medium-emphasis py-4">
              No users selected
            </div>
            
            <div v-else>
              <div
                v-for="user in selectedUsers"
                :key="user.id"
                class="d-flex align-center py-2"
                :class="{ 'border-b': selectedUsers.indexOf(user) < selectedUsers.length - 1 }"
              >
                <v-avatar :color="getRoleColor(user.role)" size="32" class="me-3">
                  <span class="text-white text-caption font-weight-bold">
                    {{ user.name.charAt(0).toUpperCase() }}
                  </span>
                </v-avatar>
                
                <div class="flex-grow-1">
                  <p class="font-weight-medium mb-1">{{ user.name }}</p>
                  <p class="text-caption text-medium-emphasis">{{ user.email }}</p>
                </div>
                
                <v-chip
                  :color="getRoleColor(user.role)"
                  :text="user.role.toUpperCase()"
                  variant="tonal"
                  size="small"
                />
              </div>
            </div>
          </v-card>
        </div>

        <!-- Role Selection -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-medium mb-4 text-primary">
            <v-icon icon="mdi-shield-account" class="me-2" />
            New Role Assignment
          </h3>
          
          <v-select
            v-model="newRole"
            :items="roleOptions"
            label="Select New Role *"
            variant="outlined"
            density="comfortable"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-account-group"
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <template #prepend>
                  <v-icon :icon="item.raw.icon" :color="item.raw.color" />
                </template>
                <v-list-item-title>{{ item.raw.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.raw.description }}</v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-select>
        </div>

        <!-- Impact Summary -->
        <div v-if="newRole" class="mb-6">
          <h3 class="text-h6 font-weight-medium mb-4 text-warning">
            <v-icon icon="mdi-alert-circle" class="me-2" />
            Impact Summary
          </h3>
          
          <v-alert
            type="warning"
            variant="tonal"
            class="mb-4"
          >
            <div class="font-weight-medium mb-2">
              This action will change the role for {{ selectedUsers.length }} user{{ selectedUsers.length > 1 ? 's' : '' }}:
            </div>
            
            <ul class="ml-4">
              <li v-for="change in roleChanges" :key="change.from">
                {{ change.count }} user{{ change.count > 1 ? 's' : '' }} from 
                <strong>{{ change.from.toUpperCase() }}</strong> to 
                <strong>{{ newRole.toUpperCase() }}</strong>
              </li>
            </ul>
          </v-alert>

          <!-- Warning for Admin Changes -->
          <v-alert
            v-if="newRole === 'admin' || hasAdminInSelection"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            <div class="font-weight-medium mb-2">
              <v-icon icon="mdi-shield-alert" class="me-2" />
              Administrative Access Warning
            </div>
            
            <div v-if="newRole === 'admin'">
              You are granting administrative access to {{ selectedUsers.length }} user{{ selectedUsers.length > 1 ? 's' : '' }}. 
              Admin users have full system access and can manage all users and data.
            </div>
            
            <div v-if="hasAdminInSelection && newRole !== 'admin'">
              You are removing administrative access from {{ adminUsersInSelection.length }} user{{ adminUsersInSelection.length > 1 ? 's' : '' }}. 
              This will restrict their access to system management features.
            </div>
          </v-alert>
        </div>

        <!-- Confirmation Checkbox -->
        <div v-if="newRole">
          <v-checkbox
            v-model="confirmChange"
            color="primary"
            hide-details
          >
            <template #label>
              <span class="font-weight-medium">
                I understand the impact of this role change and confirm this action
              </span>
            </template>
          </v-checkbox>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-6 pt-4">
        <v-spacer />
        <v-btn
          variant="outlined"
          size="large"
          @click="closeDialog"
          :disabled="loading"
        >
          Cancel
        </v-btn>
        
        <v-btn
          color="primary"
          variant="elevated"
          size="large"
          :loading="loading"
          :disabled="!canProceed"
          @click="handleSubmit"
        >
          Change Roles
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAdminErrorHandler } from '@/composables/admin/useAdminErrorHandler'
import type { User, UserRole } from '@/types'

// Props and Emits
interface Props {
  modelValue: boolean
  selectedUsers: User[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: []
}>()

// Composables
const authStore = useAuthStore()
const { handleError } = useAdminErrorHandler()

// Form state
const loading = ref(false)
const newRole = ref<UserRole | null>(null)
const confirmChange = ref(false)

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

// Validation rules
const rules = {
  required: (value: any) => !!value || 'This field is required'
}

// Computed properties
const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value)
}

const roleChanges = computed(() => {
  if (!newRole.value) return []
  
  const changes = new Map<UserRole, number>()
  
  props.selectedUsers.forEach(user => {
    if (user.role !== newRole.value) {
      changes.set(user.role, (changes.get(user.role) || 0) + 1)
    }
  })
  
  return Array.from(changes.entries()).map(([from, count]) => ({
    from,
    count
  }))
})

const hasAdminInSelection = computed(() => {
  return props.selectedUsers.some(user => user.role === 'admin')
})

const adminUsersInSelection = computed(() => {
  return props.selectedUsers.filter(user => user.role === 'admin')
})

const canProceed = computed(() => {
  return newRole.value && confirmChange.value && props.selectedUsers.length > 0
})

// Methods
function closeDialog() {
  updateModelValue(false)
  resetForm()
}

function resetForm() {
  newRole.value = null
  confirmChange.value = false
}

function getRoleColor(role: UserRole) {
  const colors = {
    admin: 'red',
    owner: 'primary',
    cleaner: 'success'
  }
  return colors[role] || 'grey'
}

async function handleSubmit() {
  if (!newRole.value) return

  try {
    loading.value = true
    
    // Filter out users who already have the target role
    const usersToUpdate = props.selectedUsers.filter(user => user.role !== newRole.value)
    
    if (usersToUpdate.length === 0) {
      // Show message that no changes are needed
      console.log('No users need role changes')
      closeDialog()
      return
    }

    // Update each user's role
    const updatePromises = usersToUpdate.map(user =>
      authStore.changeUserRole(user.id, newRole.value!)
    )
    
    const results = await Promise.allSettled(updatePromises)
    
    // Check for failures
    const failures = results.filter(result => result.status === 'rejected')
    
    if (failures.length > 0) {
      console.error('Some role updates failed:', failures)
      // Still emit saved to refresh the list, but show partial success message
    }
    
    const successCount = usersToUpdate.length - failures.length
    console.log(`Successfully updated ${successCount} out of ${usersToUpdate.length} users`)
    
    emit('saved')
    closeDialog()
  } catch (error) {
    handleError(error, 'Failed to update user roles')
  } finally {
    loading.value = false
  }
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
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

.border-b {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
}

.text-medium-emphasis {
  opacity: 0.7;
}

:deep(.v-input__details) {
  margin-top: 4px;
}
</style>
```

Now let me enhance the auth store to add the missing methods for admin user management:

```typescript
  async function updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
    try {
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      return true;
    } catch (err) {
      console.error('❌ Failed to update user role:', err);
      return false;
    }
  }

->

  async function updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
    try {
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      return true;
    } catch (err) {
      console.error('❌ Failed to update user role:', err);
      return false;
    }
  }

  async function deleteUser(userId: string): Promise<boolean> {
    try {
      // Delete from user_profiles first (will cascade to other tables via foreign keys)
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        throw profileError;
      }

      // Delete from auth.users using admin API
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);

      if (authError) {
        console.warn('⚠️ Failed to delete auth user, but profile deleted:', authError);
        // Don't throw here since profile deletion succeeded
      }

      return true;
    } catch (err) {
      console.error('❌ Failed to delete user:', err);
      return false;
    }
  }

  async function createAdminUser(userData: {
    email: string;
    password: string;
    name: string;
    access_level?: string;
  }): Promise<boolean> {
    try {
      // Create auth user using admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true, // Auto-confirm for admin-created users
        user_metadata: {
          name: userData.name,
          role: 'admin'
        }
      });

      if (authError || !authData.user) {
        throw authError || new Error('Failed to create auth user');
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: userData.email,
          name: userData.name,
          role: 'admin' as UserRole,
          access_level: userData.access_level || 'full'
        });

      if (profileError) {
        // Try to clean up auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw profileError;
      }

      return true;
    } catch (err) {
      console.error('❌ Failed to create admin user:', err);
      return false;
    }
  }
```

```typescript
  return {
    // State
    user,
    session,
    loading,
    error,
    initializing,
    
    // Computed
    isAuthenticated,
    currentUserId,
    
    // Methods
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    checkAuth,
    getAllUsers,
    updateUserRole,
    loadUserProfile
  };

->

  return {
    // State
    user,
    session,
    loading,
    error,
    initializing,
    
    // Computed
    isAuthenticated,
    currentUserId,
    
    // Methods
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    checkAuth,
    getAllUsers,
    updateUserRole,
    deleteUser,
    createAdminUser,
    loadUserProfile
  };
```

