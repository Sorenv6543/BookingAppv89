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
            <h1 class="text-h4">My Properties</h1>
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
      <v-row class="mb-4">
        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="text-h6">{{ myProperties.length }}</div>
              <div class="text-caption text-medium-emphasis">
                Total Properties
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="text-h6">{{ myActiveProperties.length }}</div>
              <div class="text-caption text-medium-emphasis">
                Active Properties
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="text-h6">{{ myBookings.length }}</div>
              <div class="text-caption text-medium-emphasis">
                Total Bookings
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="text-h6">{{ myTodayTurns.length }}</div>
              <div class="text-caption text-medium-emphasis">
                Today's Turns
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Property List -->
      <v-row>
        <v-col
          v-for="property in myProperties"
          :key="property.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <PropertyCard
            :property="property"
            @edit="handleEditProperty"
            @delete="handleDeleteProperty"
          />
        </v-col>
      </v-row>

      <!-- Empty State -->
      <v-row v-if="myProperties.length === 0">
        <v-col cols="12" class="text-center py-8">
          <v-icon size="64" color="grey-lighten-1" class="mb-4">
            mdi-home-outline
          </v-icon>
          <h3 class="text-h6 mb-2">No Properties Yet</h3>
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
import PropertyCard from '@/components/dumb/shared/PropertyCard.vue'
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

// ✅ SAME BUSINESS LOGIC AS HomeOwner - NO DUPLICATION
const { 
  myProperties,              // ✅ SAME filtered data
  myActiveProperties,        // ✅ SAME filtered data
  fetchMyProperties,         // ✅ SAME operations
  createMyProperty,          // ✅ SAME operations
  updateMyProperty,          // ✅ SAME operations
  deleteMyProperty,          // ✅ SAME operations
  loading: propertiesLoading // ✅ SAME loading state
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
// EVENT HANDLERS - SAME ORCHESTRATION PATTERN AS HomeOwner
// ============================================================================

const handleCreateProperty = (): void => {
  // ✅ SAME orchestration as HomeOwner - ensures owner_id is set
  const propertyData = {
    owner_id: authStore.user?.id
  }
  uiStore.openModal('propertyModal', 'create', propertyData)
}

const handleEditProperty = (propertyId: string): void => {
  // ✅ SAME logic as HomeOwner - finds in filtered owner data
  const property = myProperties.value.find(p => p.id === propertyId)
  if (property) {
    uiStore.openModal('propertyModal', 'edit', property)
  }
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

/* ✅ SAME THEME VARIABLES AS HomeOwner */
.owner-properties-container {
  --owner-primary: rgb(var(--v-theme-primary));
  --owner-accent: rgb(var(--v-theme-secondary));
  --owner-surface: rgb(var(--v-theme-surface));
  --owner-border: rgb(var(--v-theme-on-surface), 0.12);
}
</style>