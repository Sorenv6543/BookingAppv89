<template>
  <v-container
    fluid
    class="pa-6"
  >
    <!-- Page Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold text-primary mb-2">
          Admin User Management Demo
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Stylish, comprehensive demo of all admin user management features
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
      <v-col
        v-for="stat in stats"
        :key="stat.title"
        cols="12"
        sm="6"
        md="3"
      >
        <v-card
          class="pa-4"
          elevation="2"
        >
          <div class="d-flex align-center">
            <v-avatar
              :color="stat.color"
              size="48"
              class="me-3"
            >
              <v-icon>{{ stat.icon }}</v-icon>
            </v-avatar>
            <div>
              <p class="text-caption text-medium-emphasis mb-1">
                {{ stat.title }}
              </p>
              <p class="text-h5 font-weight-bold">
                {{ stat.value }}
              </p>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters and Search -->
    <v-card
      class="mb-6"
      elevation="2"
    >
      <v-card-title class="pb-2">
        <v-icon class="me-2">
          mdi-filter-variant
        </v-icon>
        Filters
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="4"
          >
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
          <v-col
            cols="12"
            md="3"
          >
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
          <v-col
            cols="12"
            md="3"
          >
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
          <v-col
            cols="12"
            md="2"
          >
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
        <v-icon class="me-2">
          mdi-account-multiple
        </v-icon>
        System Users
      </v-card-title>
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        v-model="selected"
        :headers="headers"
        :items="filteredUsers"
        :loading="loading"
        :search="search"
        item-value="id"
        show-select
      >
        <template #user="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              :color="getRoleColor(item.role)"
              size="40"
              class="me-3"
            >
              <span class="text-white font-weight-bold">
                {{ item.name.charAt(0).toUpperCase() }}
              </span>
            </v-avatar>
            <div>
              <p class="font-weight-medium mb-1">
                {{ item.name }}
              </p>
              <p class="text-caption text-medium-emphasis">
                {{ item.email }}
              </p>
            </div>
          </div>
        </template>
        <template #role="{ item }">
          <v-chip
            :color="getRoleColor(item.role)"
            :text="item.role?.toUpperCase() || 'Unknown'"
            variant="tonal"
            size="small"
          />
        </template>
        <template #status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            :text="getStatusText(item.status)"
            variant="tonal"
            size="small"
          />
        </template>
        <template #company_name="{ item }">
          <span v-if="item.company_name">{{ item.company_name }}</span>
          <span
            v-else
            class="text-medium-emphasis"
          >—</span>
        </template>
        <template #last_sign_in="{ item }">
          <span v-if="item.last_sign_in_at">{{ formatDate(item.last_sign_in_at) }}</span>
          <span
            v-else
            class="text-medium-emphasis"
          >Never</span>
        </template>
        <template #actions="{ item }">
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
                  :disabled="item.id === currentUser?.id"
                  @click="deleteUser(item)"
                />
              </template>
            </v-tooltip>
          </div>
        </template>
        <template #loading>
          <v-skeleton-loader type="table-row@10" />
        </template>
      </v-data-table>
    </v-card>

    <!-- Bulk Actions (when users are selected) -->
    <v-slide-y-transition>
      <v-card
        v-if="selected.length > 0"
        class="mt-4"
        color="primary"
        variant="tonal"
      >
        <v-card-text>
          <div class="d-flex align-center justify-space-between">
            <div>
              <v-icon class="me-2">
                mdi-checkbox-marked-circle
              </v-icon>
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
    <!-- Snackbar Notification -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.message }}
      <template #actions>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="snackbar.show = false"
        />
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdminUserManagement } from '@/composables/admin/useAdminUserManagement'
import { useAuthStore } from '@/stores/auth'
import UserFormDialog from '@/components/dumb/admin/UserFormDialog.vue'
import ConfirmationDialog from '@/components/dumb/shared/ConfirmationDialog.vue'
import BulkRoleChangeDialog from '@/components/dumb/admin/BulkRoleChangeDialog.vue'
import type { User, UserRole } from '@/types'

// Composables
const authStore = useAuthStore()
const {
  users,
  loading,
  fetchAllUsers,
  createUser,
  updateUser,
  deleteUser: deleteUserApi,
  bulkChangeRoles,
  resetUserPassword: resetUserPasswordApi
} = useAdminUserManagement()

// Data
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

// Snackbar
const snackbar = ref({ show: false, message: '', color: 'success', timeout: 3500 })

// Current user
const currentUser = computed(() => authStore.user)

// Options
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

// Stats
const stats = computed(() => [
  { title: 'Total Users', value: users.value.length, icon: 'mdi-account-group', color: 'primary' },
  { title: 'Admins', value: users.value.filter(u => u.role === 'admin').length, icon: 'mdi-shield-account', color: 'red' },
  { title: 'Owners', value: users.value.filter(u => u.role === 'owner').length, icon: 'mdi-home-account', color: 'info' },
  { title: 'Cleaners', value: users.value.filter(u => u.role === 'cleaner').length, icon: 'mdi-broom', color: 'success' }
])

// Filtering
const filteredUsers = computed(() => {
  let result = users.value
  if (roleFilter.value) {
    result = result.filter(user => user.role === roleFilter.value)
  }
  if (statusFilter.value) {
    result = result.filter(user => getStatusText(user).toLowerCase() === statusFilter.value)
  }
  if (search.value) {
    const s = search.value.toLowerCase()
    result = result.filter(user => user.name.toLowerCase().includes(s) || user.email.toLowerCase().includes(s))
  }
  return result
})

const deleteDialogTitle = computed(() => userToDelete.value ? `Delete ${userToDelete.value.name}?` : 'Delete User?')
const deleteDialogMessage = computed(() => userToDelete.value ? `Are you sure you want to delete ${userToDelete.value.name}? This action cannot be undone.` : 'Are you sure you want to delete this user? This action cannot be undone.')

// Methods
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
async function handleDeleteConfirm() {
  if (!userToDelete.value) return
  const ok = await deleteUserApi(userToDelete.value.id)
  if (ok) {
    showSnackbar(`${userToDelete.value.name} deleted`, 'success')
  } else {
    showSnackbar('Failed to delete user', 'error')
  }
  deleteDialog.value = false
  userToDelete.value = null
}
function handleUserSaved() {
  userDialog.value = false
  editingUser.value = null
  showSnackbar('User saved', 'success')
}
function handleBulkRoleSaved() {
  bulkRoleDialog.value = false
  selected.value = []
  showSnackbar('Roles updated', 'success')
}
function clearFilters() {
  search.value = ''
  roleFilter.value = null
  statusFilter.value = null
}
function sendBulkEmail() {
  showSnackbar('Bulk email sent (demo)', 'info')
}
function bulkRoleChange() {
  bulkRoleDialog.value = true
}
function bulkDelete() {
  showSnackbar('Bulk delete not implemented in demo', 'warning')
}
function getRoleColor(role: UserRole) {
  const colors = { admin: 'red', owner: 'primary', cleaner: 'success' }
  return colors[role] || 'grey'
}
function getStatusColor(user: User) {
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
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function showSnackbar(message: string, color: string = 'success') {
  snackbar.value.message = message
  snackbar.value.color = color
  snackbar.value.show = true
}
async function resetUserPassword(user: User) {
  const ok = await resetUserPasswordApi(user.email)
  if (ok) {
    showSnackbar(`Password reset email sent to ${user.email}`, 'success')
  } else {
    showSnackbar('Failed to send password reset email', 'error')
  }
}

onMounted(() => {
  fetchAllUsers()
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