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
        :loading="isLoading"
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
const { handleError } = useAdminErrorHandler()
const { isLoading } = useLoadingState()

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
    // setLoading(true) // This line was removed as per the edit hint
    users.value = await authStore.fetchAllUsers()
  } catch (error) {
    handleError(error, 'Failed to fetch users')
  } finally {
    // setLoading(false) // This line was removed as per the edit hint
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
    // setLoading(true) // This line was removed as per the edit hint
    const success = await authStore.requestPasswordReset(user.email)
    if (success) {
      showSuccessMessage(`Password reset email sent to ${user.email}`)
    }
  } catch (error) {
    handleError(error, 'Failed to send password reset email')
  } finally {
    // setLoading(false) // This line was removed as per the edit hint
  }
}

async function handleDeleteConfirm() {
  if (!userToDelete.value) return

  try {
    // setLoading(true) // This line was removed as per the edit hint
    // TODO: Implement user deletion in auth store
    await authStore.deleteUser(userToDelete.value.id)
    await fetchUsers()
    showSuccessMessage(`${userToDelete.value.name} has been deleted`)
  } catch (error) {
    handleError(error, 'Failed to delete user')
  } finally {
    // setLoading(false) // This line was removed as per the edit hint
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