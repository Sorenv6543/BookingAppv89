<template>
  <div class="admin-system-users">
    <!-- Main Content -->
    <div class="users-content">
      <!-- Header (Desktop only) -->
      <div
        v-if="!mobile"
        class="users-header"
      >
        <v-container fluid>
          <v-row align="center">
            <v-col>
              <h1 class="text-h4 font-weight-bold mb-2">
                System Users
              </h1>
              <p class="text-subtitle-1 text-medium-emphasis">
                Manage all system users including admins, property owners, and cleaners
              </p>
            </v-col>
            <v-col cols="auto">
              <v-btn
                color="primary"
                prepend-icon="mdi-account-plus"
                @click="addUser"
              >
                Add User
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- Stats Cards -->
      <div class="stats-section">
        <v-container fluid>
          <v-row>
            <v-col
              cols="6"
              md="3"
            >
              <v-card class="stat-card">
                <v-card-text class="pa-4">
                  <div class="d-flex align-center">
                    <v-icon
                      color="primary"
                      size="32"
                      class="me-3"
                    >
                      mdi-account-group
                    </v-icon>
                    <div>
                      <div class="text-h6 font-weight-bold">
                        {{ totalUsers }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        Total Users
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col
              cols="6"
              md="3"
            >
              <v-card class="stat-card">
                <v-card-text class="pa-4">
                  <div class="d-flex align-center">
                    <v-icon
                      color="success"
                      size="32"
                      class="me-3"
                    >
                      mdi-shield-account
                    </v-icon>
                    <div>
                      <div class="text-h6 font-weight-bold">
                        {{ adminCount }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        Admins
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col
              cols="6"
              md="3"
            >
              <v-card class="stat-card">
                <v-card-text class="pa-4">
                  <div class="d-flex align-center">
                    <v-icon
                      color="info"
                      size="32"
                      class="me-3"
                    >
                      mdi-home-account
                    </v-icon>
                    <div>
                      <div class="text-h6 font-weight-bold">
                        {{ ownerCount }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        Property Owners
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col
              cols="6"
              md="3"
            >
              <v-card class="stat-card">
                <v-card-text class="pa-4">
                  <div class="d-flex align-center">
                    <v-icon
                      color="warning"
                      size="32"
                      class="me-3"
                    >
                      mdi-broom
                    </v-icon>
                    <div>
                      <div class="text-h6 font-weight-bold">
                        {{ cleanerCount }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        Cleaners
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- Filters and Search -->
      <div class="filters-section">
        <v-container fluid>
          <v-row align="center">
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                label="Search users..."
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col
              cols="6"
              md="2"
            >
              <v-select
                v-model="roleFilter"
                :items="roleOptions"
                label="Role"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col
              cols="6"
              md="2"
            >
              <v-select
                v-model="statusFilter"
                :items="statusOptions"
                label="Status"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
              class="d-flex align-center gap-2"
            >
              <v-chip
                v-if="filteredUsers.length !== allUsers.length"
                color="primary"
                variant="outlined"
                size="small"
              >
                {{ filteredUsers.length }} of {{ allUsers.length }} users
              </v-chip>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- Main Content Area -->
      <div class="main-content">
        <v-container fluid>
          <!-- Users Table -->
          <v-card>
            <v-data-table
              :headers="tableHeaders"
              :items="filteredUsers"
              :loading="loading"
              :search="searchQuery"
              class="users-table"
              :mobile-breakpoint="0"
              @click:row="viewUserDetails"
            >
              <template #[`item.avatar`]="{ item }">
                <v-avatar
                  :color="getRoleColor(item.role)"
                  :size="mobile ? 32 : 40"
                  class="ma-2"
                >
                  <span class="text-white font-weight-bold">
                    {{ getInitials(item.name) }}
                  </span>
                </v-avatar>
              </template>

              <template #[`item.name`]="{ item }">
                <div class="user-name-cell">
                  <div 
                    class="user-name font-weight-medium"
                    :class="mobile ? 'text-body-2' : 'text-body-1'"
                  >
                    {{ item.name }}
                  </div>
                  <div 
                    class="user-email text-medium-emphasis"
                    :class="mobile ? 'text-caption' : 'text-body-2'"
                  >
                    {{ item.email }}
                  </div>
                </div>
              </template>

              <template #[`item.role`]="{ item }">
                <v-chip
                  :color="getRoleColor(item.role)"
                  size="small"
                  variant="flat"
                >
                  {{ item.role }}
                </v-chip>
              </template>

              <template #[`item.status`]="{ item }">
                <v-chip
                  :color="getStatusColor(item)"
                  size="small"
                  variant="flat"
                >
                  {{ getStatusText(item) }}
                </v-chip>
              </template>

              <template #[`item.lastActivity`]="{ item }">
                <div 
                  class="last-activity"
                  :class="mobile ? 'text-caption' : 'text-body-2'"
                >
                  {{ item.last_sign_in_at ? formatDate(item.last_sign_in_at) : 'Never' }}
                </div>
              </template>

              <template #[`item.actions`]="{ item }">
                <div class="d-flex align-center gap-1">
                  <v-btn
                    icon="mdi-eye"
                    size="small"
                    variant="text"
                    @click.stop="viewUserDetails(item)"
                  />
                  <v-btn
                    icon="mdi-pencil"
                    size="small"
                    variant="text"
                    @click.stop="editUser(item)"
                  />
                  <v-menu>
                    <template #activator="{ props }">
                      <v-btn
                        icon="mdi-dots-vertical"
                        size="small"
                        variant="text"
                        v-bind="props"
                        @click.stop
                      />
                    </template>
                    <v-list>
                      <v-list-item @click="resetPassword(item)">
                        <v-list-item-title>Reset Password</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="toggleUserStatus(item)">
                        <v-list-item-title>
                          {{ getStatusText(item) === 'Active' ? 'Deactivate' : 'Activate' }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-divider />
                      <v-list-item
                        class="text-error"
                        @click="deleteUser(item)"
                      >
                        <v-list-item-title>Delete User</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </template>
            </v-data-table>
          </v-card>
        </v-container>
      </div>
    </div>

    <!-- Add/Edit User Dialog -->
    <v-dialog
      v-model="userDialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          {{ editingUser ? 'Edit User' : 'Add New User' }}
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="userForm.name"
              label="Full Name"
              required
            />
            <v-text-field
              v-model="userForm.email"
              label="Email"
              type="email"
              required
            />
            <v-select
              v-model="userForm.role"
              :items="roleOptions"
              label="Role"
              required
            />
            <v-text-field
              v-if="!editingUser"
              v-model="userForm.password"
              label="Password"
              type="password"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeUserDialog">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="saveUser"
          >
            {{ editingUser ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';
import { useAdminUserManagement } from '@/composables/admin/useAdminUserManagement';
import type { User, UserRole } from '@/types';

// Composables
const router = useRouter();
const { mobile } = useDisplay();
const { 
  users: allUsers, 
  loading,
  fetchAllUsers,
  createUser,
  updateUser,
  deleteUser: removeUser
} = useAdminUserManagement();

// Reactive state
const searchQuery = ref('');
const roleFilter = ref('');
const statusFilter = ref('');
const userDialog = ref(false);
const editingUser = ref<User | null>(null);

// User form
const userForm = ref({
  name: '',
  email: '',
  role: 'owner' as UserRole,
  password: ''
});

// Filter options
const roleOptions = [
  { title: 'Admin', value: 'admin' },
  { title: 'Property Owner', value: 'owner' },
  { title: 'Cleaner', value: 'cleaner' }
];

const statusOptions = [
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' }
];

// Table headers
const tableHeaders = computed(() => {
  const baseHeaders = [
    { title: '', key: 'avatar', sortable: false, width: mobile.value ? 60 : 80 },
    { title: 'User', key: 'name', sortable: true },
    { title: 'Role', key: 'role', sortable: true },
    { title: 'Status', key: 'status', sortable: true },
    { title: 'Last Activity', key: 'lastActivity', sortable: true },
    { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const }
  ];

  return baseHeaders;
});

// Computed stats
const totalUsers = computed(() => allUsers.value.length);
const adminCount = computed(() => allUsers.value.filter(u => u.role === 'admin').length);
const ownerCount = computed(() => allUsers.value.filter(u => u.role === 'owner').length);
const cleanerCount = computed(() => allUsers.value.filter(u => u.role === 'cleaner').length);

const filteredUsers = computed(() => {
  let users = [...allUsers.value];

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    users = users.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  }

  // Role filter
  if (roleFilter.value) {
    users = users.filter(user => user.role === roleFilter.value);
  }

  // Status filter
  if (statusFilter.value) {
    users = users.filter(user => getStatusText(user).toLowerCase() === statusFilter.value);
  }

  return users;
});

// Methods
const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const getRoleColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    admin: 'error',
    owner: 'primary',
    cleaner: 'success'
  };
  return colors[role] || 'grey';
};

const getStatusColor = (user: User): string => {
  if (!user.created_at) return 'grey';
  if (user.last_sign_in_at) return 'success';
  return 'warning';
};

const getStatusText = (user: User): string => {
  if (!user.created_at) return 'Pending';
  if (user.last_sign_in_at) return 'Active';
  return 'Inactive';
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Actions
const addUser = () => {
  editingUser.value = null;
  userForm.value = {
    name: '',
    email: '',
    role: 'owner',
    password: ''
  };
  userDialog.value = true;
};

const viewUserDetails = (user: User) => {
  router.push(`/admin/users/${user.id}`);
};

const editUser = (user: User) => {
  editingUser.value = user;
  userForm.value = {
    name: user.name,
    email: user.email,
    role: user.role,
    password: ''
  };
  userDialog.value = true;
};

const closeUserDialog = () => {
  userDialog.value = false;
  editingUser.value = null;
};

const saveUser = async () => {
  try {
    if (editingUser.value) {
      await updateUser(editingUser.value.id, userForm.value);
    } else {
      await createUser(userForm.value);
    }
    closeUserDialog();
    await fetchAllUsers();
  } catch (error) {
    console.error('Failed to save user:', error);
  }
};

const resetPassword = (user: User) => {
  console.log('Reset password for:', user.name);
  // TODO: Implement password reset
};

const toggleUserStatus = async (_user: User) => {
  // Status is determined by created_at and last_sign_in_at properties
  // Cannot be directly toggled - would require database schema changes
  console.log('User status toggle not implemented - status is derived from user activity');
};

const deleteUser = async (user: User) => {
  if (confirm(`Are you sure you want to delete ${user.name}?`)) {
    await removeUser(user.id);
    await fetchAllUsers();
  }
};

// Initialize
onMounted(() => {
  fetchAllUsers();
});
</script>

<style scoped>
.admin-system-users {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
}

.users-content {
  min-height: 100vh;
}

.users-header {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
  padding: 24px 0;
}

.stats-section {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
  padding: 16px 0;
}

.filters-section {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
  padding: 16px 0;
}

.main-content {
  padding: 24px 0;
}

.users-table {
  background: rgb(var(--v-theme-surface));
}

.users-table :deep(.v-data-table__tbody tr) {
  cursor: pointer;
}

.users-table :deep(.v-data-table__tbody tr:hover) {
  background: rgb(var(--v-theme-surface-variant));
}

.user-name-cell {
  min-width: 150px;
}

.user-name {
  line-height: 1.2;
}

.user-email {
  line-height: 1.1;
  margin-top: 2px;
}

.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

@media (max-width: 599px) {
  .main-content {
    padding: 12px 0;
  }
}
</style>
