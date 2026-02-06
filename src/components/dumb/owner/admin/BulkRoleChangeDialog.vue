<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600px"
    persistent
    @update:model-value="updateModelValue"
  >
    <v-card>
      <v-card-title class="d-flex align-center pa-6 pb-4">
        <v-icon
          icon="mdi-account-edit"
          class="me-3"
        />
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
            <v-icon
              icon="mdi-account-multiple"
              class="me-2"
            />
            Selected Users ({{ selectedUsers.length }})
          </h3>
          
          <v-card
            variant="outlined"
            class="pa-4"
            max-height="200"
            style="overflow-y: auto;"
          >
            <div
              v-if="selectedUsers.length === 0"
              class="text-center text-medium-emphasis py-4"
            >
              No users selected
            </div>
            
            <div v-else>
              <div
                v-for="user in selectedUsers"
                :key="user.id"
                class="d-flex align-center py-2"
                :class="{ 'border-b': selectedUsers.indexOf(user) < selectedUsers.length - 1 }"
              >
                <v-avatar
                  :color="getRoleColor(user.role)"
                  size="32"
                  class="me-3"
                >
                  <span class="text-white text-caption font-weight-bold">
                    {{ user.name.charAt(0).toUpperCase() }}
                  </span>
                </v-avatar>
                
                <div class="flex-grow-1">
                  <p class="font-weight-medium mb-1">
                    {{ user.name }}
                  </p>
                  <p class="text-caption text-medium-emphasis">
                    {{ user.email }}
                  </p>
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
            <v-icon
              icon="mdi-shield-account"
              class="me-2"
            />
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
        </div>

        <!-- Impact Summary -->
        <div
          v-if="newRole"
          class="mb-6"
        >
          <h3 class="text-h6 font-weight-medium mb-4 text-warning">
            <v-icon
              icon="mdi-alert-circle"
              class="me-2"
            />
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
              <li
                v-for="change in roleChanges"
                :key="change.from"
              >
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
              <v-icon
                icon="mdi-shield-alert"
                class="me-2"
              />
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
  required: (value: unknown) => !!value || 'This field is required'
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
    handleError(error, {
      operation: 'bulk_role_change',
      component: 'BulkRoleChangeDialog'
    })
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