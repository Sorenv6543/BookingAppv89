<template>
  <v-menu offset-y>
    <template #activator="{ props: slotProps }">
      <v-btn
        v-bind="slotProps"
        :color="currentViewColor"
        :variant="currentViewVariant"
        size="small"
        class="role-switcher-btn"
      >
        <v-icon
          class="mr-2"
          size="small"
        >
          {{ currentViewIcon }}
        </v-icon>
        {{ currentViewLabel }}
        <v-icon
          class="ml-1"
          size="small"
        >
          mdi-chevron-down
        </v-icon>
      </v-btn>
    </template>
    
    <v-list
      density="compact"
      min-width="280"
    >
      <!-- Current View Header -->
      <v-list-subheader class="text-uppercase font-weight-bold">
        Current View
      </v-list-subheader>
      
      <v-list-item
        :active="!isInOwnerView"
        class="current-view-item"
        @click="switchToAdminView"
      >
        <template #prepend>
          <v-icon color="primary">
            mdi-shield-account
          </v-icon>
        </template>
        <v-list-item-title>Admin Dashboard</v-list-item-title>
        <v-list-item-subtitle>
          Full business management access
        </v-list-item-subtitle>
        <template #append>
          <v-icon
            v-if="!isInOwnerView"
            color="success"
            size="small"
          >
            mdi-check-circle
          </v-icon>
        </template>
      </v-list-item>
      
      <v-list-item
        :active="isInOwnerView"
        class="current-view-item"
        @click="switchToOwnerView"
      >
        <template #prepend>
          <v-icon color="secondary">
            mdi-home-account
          </v-icon>
        </template>
        <v-list-item-title>Owner View</v-list-item-title>
        <v-list-item-subtitle>
          Property owner perspective for support
        </v-list-item-subtitle>
        <template #append>
          <v-icon
            v-if="isInOwnerView"
            color="success"
            size="small"
          >
            mdi-check-circle
          </v-icon>
        </template>
      </v-list-item>
      
      <v-divider class="my-2" />
      
      <!-- Support Actions -->
      <v-list-subheader class="text-uppercase font-weight-bold">
        Support Actions
      </v-list-subheader>
      
      <v-list-item
        v-if="isInOwnerView"
        class="support-action-item"
        @click="$emit('view-owner-properties')"
      >
        <template #prepend>
          <v-icon color="info">
            mdi-home-city
          </v-icon>
        </template>
        <v-list-item-title>View Owner Properties</v-list-item-title>
        <v-list-item-subtitle>
          See properties from owner's perspective
        </v-list-item-subtitle>
      </v-list-item>
      
      <v-list-item
        v-if="isInOwnerView"
        class="support-action-item"
        @click="$emit('view-owner-bookings')"
      >
        <template #prepend>
          <v-icon color="info">
            mdi-calendar-check
          </v-icon>
        </template>
        <v-list-item-title>View Owner Bookings</v-list-item-title>
        <v-list-item-subtitle>
          See bookings from owner's perspective
        </v-list-item-subtitle>
      </v-list-item>
      
      <v-list-item
        class="support-action-item"
        @click="$emit('open-support-tools')"
      >
        <template #prepend>
          <v-icon color="warning">
            mdi-tools
          </v-icon>
        </template>
        <v-list-item-title>Support Tools</v-list-item-title>
        <v-list-item-subtitle>
          Access admin support utilities
        </v-list-item-subtitle>
      </v-list-item>
      
      <v-divider class="my-2" />
      
      <!-- Info Section -->
      <v-list-item
        class="info-item"
        disabled
      >
        <template #prepend>
          <v-icon
            color="info"
            size="small"
          >
            mdi-information
          </v-icon>
        </template>
        <div class="text-caption text-medium-emphasis">
          <div class="font-weight-medium mb-1">
            Admin Support Mode
          </div>
          <div>
            Switch views to help property owners with their accounts.
            All admin privileges are maintained.
          </div>
        </div>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  isInOwnerView?: boolean
  currentOwnerId?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isInOwnerView: false,
  currentOwnerId: undefined,
  loading: false
})

// Emits
interface Emits {
  'switch-to-admin': []
  'switch-to-owner': [ownerId?: string]
  'view-owner-properties': []
  'view-owner-bookings': []
  'open-support-tools': []
}

const emit = defineEmits<Emits>()

// Computed properties for current view display
const currentViewLabel = computed(() => {
  return props.isInOwnerView ? 'Owner View' : 'Admin View'
})

const currentViewIcon = computed(() => {
  return props.isInOwnerView ? 'mdi-home-account' : 'mdi-shield-account'
})

const currentViewColor = computed(() => {
  return props.isInOwnerView ? 'secondary' : 'primary'
})

const currentViewVariant = computed(() => {
  return props.isInOwnerView ? 'tonal' : 'elevated'
})

// Actions
function switchToAdminView() {
  if (!props.isInOwnerView) return // Already in admin view
  emit('switch-to-admin')
}

function switchToOwnerView() {
  if (props.isInOwnerView) return // Already in owner view
  emit('switch-to-owner', props.currentOwnerId)
}
</script>

<style scoped>
.role-switcher-btn {
  text-transform: none;
  font-weight: 500;
}

.current-view-item {
  border-left: 3px solid transparent;
}

.current-view-item.v-list-item--active {
  border-left-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.08);
}

.support-action-item:hover {
  background-color: rgba(var(--v-theme-info), 0.04);
}

.info-item {
  background-color: rgba(var(--v-theme-info), 0.02);
  border-radius: 8px;
  margin: 8px;
}

/* Smooth transitions */
.v-btn {
  transition: all 0.2s ease;
}

.v-list-item {
  transition: all 0.2s ease;
}

/* Custom styling for different states */
.v-list-item--active .v-list-item-title {
  font-weight: 600;
}

.v-list-item--active .v-list-item-subtitle {
  color: rgba(var(--v-theme-on-surface), 0.8);
}

/* Menu styling */
.v-list {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.v-list-subheader {
  color: rgba(var(--v-theme-primary), 0.8);
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}
</style> 