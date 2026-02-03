<!-- 
🏠 ROLE-SPECIFIC INTERFACES
👤 OWNER INTERFACE - PROPERTIES MANAGEMENT
src/components/smart/owner/OwnerProperties.vue - 

✅ FILTERED VIEW - Owner sees only their properties
✅ Uses SAME composables as HomeOwner.vue
✅ Maintains single source of truth architecture
✅ Demonstrates 3-layer composables pattern excellence
 -->

<template>
  <div class="owner-properties-container">
    <!-- Property Management Interface -->
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <div class="d-flex justify-space-between align-center mb-4">
            <h1 class="text-h4">
              My Properties
            </h1>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="handleCreateProperty"
            >
              Add Property
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Property Stats (Using SAME composables as HomeOwner) -->
      <v-row class="mb-2 compact-stats-row">
        <v-col
          cols="6"
          sm="3"
          class="pa-1"
        >
          <v-card
            class="compact-stat-card stat-card-primary"
            elevation="1"
          >
            <v-card-text class="pa-2 text-center">
              <div class="stat-number">
                {{ myProperties.length }}
              </div>
              <div class="stat-label">
                Total Properties
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="6"
          sm="3"
          class="pa-1"
        >
          <v-card
            class="compact-stat-card stat-card-success"
            elevation="1"
          >
            <v-card-text class="pa-2 text-center">
              <div class="stat-number">
                {{ myActiveProperties.length }}
              </div>
              <div class="stat-label">
                Active Properties
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="6"
          sm="3"
          class="pa-1"
        >
          <v-card
            class="compact-stat-card stat-card-info"
            elevation="1"
          >
            <v-card-text class="pa-2 text-center">
              <div class="stat-number">
                {{ myBookings.length }}
              </div>
              <div class="stat-label">
                Total Bookings
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="6"
          sm="3"
          class="pa-1"
        >
          <v-card
            class="compact-stat-card stat-card-warning"
            elevation="1"
          >
            <v-card-text class="pa-2 text-center">
              <div class="stat-number">
                {{ myTodayTurns.length }}
              </div>
              <div class="stat-label">
                Today's Turns
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Property List -->
      <v-row>
        <v-col
          v-for="(property, index) in myProperties"
          :key="property.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="pa-2"
        >
          <v-card 
            class="compact-property-card" 
            :class="getPropertyCardClass(index)"
            elevation="2"
            @click="viewProperty(property)"
          >
            <v-card-text class="pa-3">
              <div class="d-flex align-center justify-space-between mb-2">
                <v-icon
                  :color="getPropertyIconColor(index)"
                  size="20"
                >
                  {{ getPropertyIcon(property.property_type) }}
                </v-icon>
                <v-menu>
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-dots-vertical"
                      size="small"
                      variant="text"
                      @click.stop
                    />
                  </template>
                  <v-list density="compact">
                    <v-list-item @click="editProperty(property)">
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="viewProperty(property)">
                      <v-list-item-title>View</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="handleDeleteProperty(property.id)">
                      <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
              
              <div class="property-name mb-1">
                {{ property.name }}
              </div>
              <div class="property-address mb-2">
                {{ property.address }}
              </div>
              
              <div class="property-details">
                <span class="detail-item">
                  <v-icon
                    size="12"
                    class="mr-1"
                  >mdi-bed</v-icon>
                  {{ property.bedrooms || 0 }}
                </span>
                <span class="detail-item">
                  <v-icon
                    size="12"
                    class="mr-1"
                  >mdi-shower</v-icon>
                  {{ property.bathrooms || 0 }}
                </span>
                <span class="detail-item">
                  <v-icon
                    size="12"
                    class="mr-1"
                  >mdi-home</v-icon>
                  {{ property.property_type || 'N/A' }}
                </span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Empty State -->
      <v-row v-if="myProperties.length === 0">
        <v-col
          cols="12"
          class="text-center py-8"
        >
          <v-icon
            size="64"
            color="grey-lighten-1"
            class="mb-4"
          >
            mdi-home-outline
          </v-icon>
          <h3 class="text-h6 mb-2">
            No Properties Yet
          </h3>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Add your first property to start managing bookings and cleanings.
          </p>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="handleCreateProperty"
          >
            Add Your First Property
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <!-- Property Modal - Same modal system as HomeOwner -->
    <PropertyModal
      :open="propertyModalOpen"
      :mode="propertyModalMode"
      :property="propertyModalData"
      @close="handlePropertyModalClose"
      @save="handlePropertyModalSave"
      @delete="handlePropertyModalDelete"
    />

    <!-- Confirmation Dialog - Same system as HomeOwner -->
    <ConfirmationDialog
      :open="confirmDialogOpen"
      :title="confirmDialogTitle"
      :message="confirmDialogMessage"
      :confirm-text="confirmDialogConfirmText"
      :cancel-text="confirmDialogCancelText"
      :dangerous="confirmDialogDangerous"
      @confirm="handleConfirmDialogConfirm"
      @cancel="handleConfirmDialogCancel"
      @close="handleConfirmDialogClose"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PropertyModal from '@/components/dumb/PropertyModal.vue'
import ConfirmationDialog from '@/components/dumb/shared/ConfirmationDialog.vue'

// ✅ SAME COMPOSABLES AS HomeOwner.vue - SINGLE SOURCE OF TRUTH MAINTAINED
import { useOwnerProperties } from '@/composables/owner/useOwnerProperties'
import { useOwnerBookings } from '@/composables/owner/useOwnerBookings-supabase'
import { useUIStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import type { Property, PropertyFormData } from '@/types'

// Component metadata
defineOptions({
  name: 'OwnerProperties'
})

// ✅ SAME STORE CONNECTIONS AS HomeOwner
const uiStore = useUIStore()
const authStore = useAuthStore()
const router = useRouter()

// ✅ SAME BUSINESS LOGIC AS HomeOwner - NO DUPLICATION
const { 
  myProperties,              // ✅ SAME data
  myActiveProperties,        // ✅ SAME filtered data
  fetchMyProperties,         // ✅ SAME operations
  createMyProperty,          // ✅ SAME operations
  updateMyProperty,          // ✅ SAME operations
  deleteMyProperty           // ✅ SAME operations
  // loading removed since not used
} = useOwnerProperties()

const {
  myBookings,               // ✅ SAME filtered data
  myTodayTurns,            // ✅ SAME filtered data
  fetchMyBookings          // ✅ SAME operations
} = useOwnerBookings()

// ============================================================================
// UI STATE - SAME MODAL MANAGEMENT AS HomeOwner
// ============================================================================

// Property Modal - Same pattern as HomeOwner
const propertyModalOpen = computed(() => uiStore.isModalOpen('propertyModal'))
const propertyModalMode = computed(() => {
  const modal = uiStore.getModalState('propertyModal')
  return (modal?.mode as 'create' | 'edit') || 'create'
})
const propertyModalData = computed(() => {
  const modal = uiStore.getModalState('propertyModal')
  return modal?.data as Property | undefined
})

// Confirmation Dialog - Same pattern as HomeOwner
const confirmDialogOpen = computed(() => uiStore.isConfirmDialogOpen('confirmDialog'))
const confirmDialogTitle = computed(() => {
  const dialog = uiStore.getConfirmDialogState('confirmDialog')
  return dialog?.title || 'Confirm'
})
const confirmDialogMessage = computed(() => {
  const dialog = uiStore.getConfirmDialogState('confirmDialog')
  return dialog?.message || 'Are you sure you want to proceed?'
})
const confirmDialogConfirmText = computed(() => {
  const dialog = uiStore.getConfirmDialogState('confirmDialog')
  return dialog?.confirmText || 'Confirm'
})
const confirmDialogCancelText = computed(() => {
  const dialog = uiStore.getConfirmDialogState('confirmDialog')
  return dialog?.cancelText || 'Cancel'
})
const confirmDialogDangerous = computed(() => {
  const dialog = uiStore.getConfirmDialogState('confirmDialog')
  return dialog?.dangerous || false
})
const confirmDialogData = computed(() => {
  const dialog = uiStore.getConfirmDialogState('confirmDialog')
  return dialog?.data
})

// ============================================================================
// HELPER FUNCTIONS - STYLING AND ICONS
// ============================================================================

// Property card styling based on index
const getPropertyCardClass = (index: number): string => {
  const classes = [
    'property-card-blue',
    'property-card-green', 
    'property-card-purple',
    'property-card-orange'
  ]
  return classes[index % classes.length]
}

// Property icon color based on index
const getPropertyIconColor = (index: number): string => {
  const colors = ['primary', 'success', 'secondary', 'warning']
  return colors[index % colors.length]
}

// Property type icon mapping
const getPropertyIcon = (propertyType?: string): string => {
  switch (propertyType) {
    case 'house': return 'mdi-home'
    case 'apartment': return 'mdi-apartment'
    case 'condo': return 'mdi-office-building'
    case 'townhouse': return 'mdi-home-group'
    default: return 'mdi-home-outline'
  }
}

// ============================================================================
// EVENT HANDLERS - SAME ORCHESTRATION PATTERN AS HomeOwner
// ============================================================================

const handleCreateProperty = (): void => {
  // ✅ SAME orchestration as HomeOwner - ensures owner_id is set
  const propertyData = {
    owner_id: authStore.user?.id
  }
  uiStore.openModal('propertyModal', 'create', propertyData)
}


const handleDeleteProperty = async (propertyId: string): Promise<void> => {
  // ✅ SAME logic as HomeOwner - operates on owner's data only
  const property = myProperties.value.find(p => p.id === propertyId)
  if (!property) return

  uiStore.openConfirmDialog('confirmDialog', {
    title: 'Delete Property',
    message: `Are you sure you want to delete "${property.name}"? This will also delete all associated bookings. This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    dangerous: true,
    data: { type: 'property', id: propertyId }
  })
}

// Navigation functions
const editProperty = (property: Property): void => {
  router.push(`/owner/properties/${property.id}/edit`)
}

const viewProperty = (property: Property): void => {
  router.push(`/owner/properties/${property.id}`)
}

// ============================================================================
// MODAL EVENT HANDLERS - SAME PATTERN AS HomeOwner
// ============================================================================

const handlePropertyModalClose = (): void => {
  uiStore.closeModal('propertyModal')
}

const handlePropertyModalSave = async (data: PropertyFormData): Promise<void> => {
  try {
    // ✅ SAME logic as HomeOwner - ensures owner_id is set
    const propertyData = {
      ...data,
      owner_id: authStore.user?.id
    }
    
    if (propertyModalMode.value === 'create') {
      await createMyProperty(propertyData as PropertyFormData)
    } else if (propertyModalData.value) {
      // Verify owner can update this property (same check as HomeOwner)
      if (propertyModalData.value.owner_id !== authStore.user?.id) {
        throw new Error('Cannot update property not owned by current user')
      }
      await updateMyProperty(propertyModalData.value.id, propertyData as Partial<PropertyFormData>)
    }
    uiStore.closeModal('propertyModal')
  } catch (error) {
    console.error('Failed to save your property:', error)
  }
}

const handlePropertyModalDelete = async (propertyId: string): Promise<void> => {
  // ✅ SAME verification as HomeOwner
  const property = myProperties.value.find(p => p.id === propertyId)
  if (!property || property.owner_id !== authStore.user?.id) {
    console.warn('Cannot delete property not owned by current user')
    return
  }
  
  uiStore.openConfirmDialog('confirmDialog', {
    title: 'Delete Property',
    message: `Are you sure you want to delete "${property.name}"? This will also delete all associated bookings. This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    dangerous: true,
    data: { type: 'property', id: propertyId }
  })
}

// ============================================================================
// CONFIRMATION DIALOG HANDLERS - SAME PATTERN AS HomeOwner
// ============================================================================

const handleConfirmDialogConfirm = async (): Promise<void> => {
  const data = confirmDialogData.value
  
  if (data?.type === 'property' && data?.id) {
    try {
      await deleteMyProperty(data.id as string)
      uiStore.closeModal('propertyModal')
    } catch (error) {
      console.error('Failed to delete your property:', error)
    }
  }
  
  uiStore.closeConfirmDialog('confirmDialog')
}

const handleConfirmDialogCancel = (): void => {
  uiStore.closeConfirmDialog('confirmDialog')
}

const handleConfirmDialogClose = (): void => {
  uiStore.closeConfirmDialog('confirmDialog')
}

// ============================================================================
// LIFECYCLE - SAME INITIALIZATION AS HomeOwner
// ============================================================================

onMounted(async () => {
  // ✅ SAME initialization pattern as HomeOwner
  if (authStore.isAuthenticated && authStore.user?.role === 'owner') {
    await Promise.all([
      fetchMyProperties(),
      fetchMyBookings()
    ])
  }
})
</script>

<style scoped>
.owner-properties-container {
  padding: 1rem;
  min-height: calc(100vh - 64px);
}

.v-card {
  height: 100%;
}

/* Compact stat cards */
.compact-stats-row {
  max-height: 60px;
}

.compact-stat-card {
  min-height: auto !important;
  height: 60px !important;
  cursor: default;
}

.compact-stat-card .v-card-text {
  padding: 8px !important;
}

.stat-number {
  font-size: 1.25rem !important;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 0.7rem !important;
  line-height: 1;
  opacity: 0.9;
}

/* Stat card color themes */
.stat-card-primary {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-left: 4px solid rgb(var(--v-theme-primary));
}

.stat-card-primary .stat-number {
  color: rgb(var(--v-theme-primary));
}

.stat-card-success {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  border-left: 4px solid rgb(var(--v-theme-success));
}

.stat-card-success .stat-number {
  color: rgb(var(--v-theme-success));
}

.stat-card-info {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  border-left: 4px solid rgb(var(--v-theme-secondary));
}

.stat-card-info .stat-number {
  color: rgb(var(--v-theme-secondary));
}

.stat-card-warning {
  background: linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%);
  border-left: 4px solid rgb(var(--v-theme-warning));
}

.stat-card-warning .stat-number {
  color: rgb(var(--v-theme-warning));
}

/* Compact property cards */
.compact-property-card {
  min-height: auto !important;
  height: 140px !important;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px !important;
}

.compact-property-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.property-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.property-address {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-on-surface-variant));
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.property-details {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.detail-item {
  display: flex;
  align-items: center;
  font-size: 0.7rem;
  color: rgb(var(--v-theme-on-surface-variant));
  background: rgba(var(--v-theme-surface-variant), 0.3);
  padding: 2px 6px;
  border-radius: 4px;
}

/* Property card color themes */
.property-card-blue {
  background: linear-gradient(135deg, #e3f2fd 0%, #e1f5fe 100%);
  border-left: 4px solid #2196f3;
}

.property-card-blue .property-name {
  color: #1976d2;
}

.property-card-green {
  background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%);
  border-left: 4px solid #4caf50;
}

.property-card-green .property-name {
  color: #388e3c;
}

.property-card-purple {
  background: linear-gradient(135deg, #f3e5f5 0%, #fce4ec 100%);
  border-left: 4px solid #9c27b0;
}

.property-card-purple .property-name {
  color: #7b1fa2;
}

.property-card-orange {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-left: 4px solid #ff9800;
}

.property-card-orange .property-name {
  color: #f57c00;
}

/* ✅ SAME THEME VARIABLES AS HomeOwner */
.owner-properties-container {
  --owner-primary: rgb(var(--v-theme-primary));
  --owner-accent: rgb(var(--v-theme-secondary));
  --owner-surface: rgb(var(--v-theme-surface));
  --owner-border: rgb(var(--v-theme-on-surface), 0.12);
}
</style>
