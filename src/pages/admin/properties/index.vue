<template>
  <div class="admin-properties-page">
    <!-- Page Header -->
    <div class="page-header">
      <v-container fluid>
        <v-row align="center">
          <v-col>
            <h1 class="text-h4 font-weight-bold">All Properties</h1><h2>admin/properties/index.vue line 8</h2>
            <p class="text-subtitle-1 text-medium-emphasis">
              Manage all properties across all clients
            </p>
          </v-col>
          <v-col cols="auto">
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="openCreatePropertyDialog"
            >
              Add Property
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
      <v-container fluid>
        <v-row align="center">
          <v-col cols="12" md="3">
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              label="Search properties..."
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              label="Status"
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="tierFilter"
              :items="tierOptions"
              label="Pricing Tier"
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="ownerFilter"
              :items="ownerOptions"
              label="Owner"
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>
          <v-col cols="12" md="3">
            <div class="d-flex gap-2">
              <v-text-field
                v-model="minDuration"
                type="number"
                label="Min Duration"
                variant="outlined"
                density="compact"
                suffix="min"
              />
              <v-text-field
                v-model="maxDuration"
                type="number"
                label="Max Duration"
                variant="outlined"
                density="compact"
                suffix="min"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Main Content -->
    <div class="page-content">
      <v-container fluid>
        <!-- Properties Grid -->
        <div v-if="filteredProperties.length === 0" class="text-center py-8">
          <v-icon size="64" color="grey-lighten-1">mdi-home-search</v-icon>
          <p class="text-h6 text-medium-emphasis mt-4">No properties found</p>
          <p class="text-body-2 text-medium-emphasis">
            Try adjusting your filters or add a new property
          </p>
        </div>
        
        <v-row v-else>
          <v-col
            v-for="property in filteredProperties"
            :key="property.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card class="property-card" @click="openPropertyDetails(property)">
              <v-card-text>
                <!-- Status and Tier -->
                <div class="d-flex justify-space-between align-center mb-2">
                  <v-chip
                    :color="property.active ? 'success' : 'error'"
                    size="small"
                    variant="flat"
                  >
                    {{ property.active ? 'Active' : 'Inactive' }}
                  </v-chip>
                  <v-chip
                    :color="getTierColor(property.pricing_tier)"
                    size="small"
                    variant="outlined"
                  >
                    {{ property.pricing_tier }}
                  </v-chip>
                </div>
                
                <!-- Property Name -->
                <h3 class="text-h6 font-weight-medium mb-2">
                  {{ property.name }}
                </h3>
                
                <!-- Address -->
                <div class="text-body-2 text-medium-emphasis mb-2">
                  <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>
                  {{ property.address }}
                </div>
                
                <!-- Property Details -->
                <div class="property-details mb-3">
                  <div class="d-flex justify-space-between text-body-2">
                    <span>
                      <v-icon size="16" class="mr-1">mdi-bed</v-icon>
                      {{ property.bedrooms || 'N/A' }} bed
                    </span>
                    <span>
                      <v-icon size="16" class="mr-1">mdi-shower</v-icon>
                      {{ property.bathrooms || 'N/A' }} bath
                    </span>
                  </div>
                  <div class="d-flex justify-space-between text-body-2 mt-1">
                    <span>
                      <v-icon size="16" class="mr-1">mdi-clock</v-icon>
                      {{ property.cleaning_duration }}min
                    </span>
                    <span>
                      <v-icon size="16" class="mr-1">mdi-resize</v-icon>
                      {{ property.square_feet || 'N/A' }} sqft
                    </span>
                  </div>
                </div>
                
                <!-- Owner Info -->
                <div class="text-caption text-medium-emphasis mb-3">
                  Owner: {{ getOwnerName(property.owner_id) }}
                </div>
                
                <!-- Booking Stats -->
                <div class="booking-stats">
                  <div class="d-flex justify-space-between text-body-2">
                    <span>Total Bookings:</span>
                    <span class="font-weight-bold">{{ getPropertyBookingCount(property.id) }}</span>
                  </div>
                  <div class="d-flex justify-space-between text-body-2">
                    <span>Turn Bookings:</span>
                    <span class="font-weight-bold text-warning">{{ getPropertyTurnCount(property.id) }}</span>
                  </div>
                </div>
              </v-card-text>
              
              <v-card-actions>
                <v-btn
                  size="small"
                  variant="text"
                  @click.stop="editProperty(property)"
                >
                  Edit
                </v-btn>
                <v-btn
                  size="small"
                  variant="text"
                  @click.stop="viewBookings(property)"
                >
                  Bookings
                </v-btn>
                <v-spacer />
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
                    <v-list-item @click="togglePropertyStatus(property)">
                      <v-list-item-title>
                        {{ property.active ? 'Deactivate' : 'Activate' }}
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="duplicateProperty(property)">
                      <v-list-item-title>Duplicate</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="deleteProperty(property)" class="text-error">
                      <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Create/Edit Property Dialog -->
    <v-dialog v-model="showPropertyDialog" max-width="800px">
      <v-card>
        <v-card-title>
          {{ editingProperty ? 'Edit Property' : 'Add New Property' }}
        </v-card-title>
        <v-card-text>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Admin property form would be implemented here with owner selection and full property details
          </p>
          <div class="text-center py-4">
            <v-icon size="48" color="grey-lighten-1">mdi-form-select</v-icon>
            <p class="text-caption text-medium-emphasis mt-2">
              Integration with AdminPropertyForm component needed
            </p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="closePropertyDialog">Cancel</v-btn>
          <v-btn color="primary" @click="saveProperty">
            {{ editingProperty ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAdminProperties } from '@/composables/admin/useAdminProperties'
import { useAdminBookings } from '@/composables/admin/useAdminBookings'
import type { Property, PricingTier } from '@/types/property'

// Composables
const { allProperties, updateProperty } = useAdminProperties()
const { allBookings } = useAdminBookings()

// Reactive state
const searchQuery = ref('')
const statusFilter = ref('')
const tierFilter = ref('')
const ownerFilter = ref('')
const minDuration = ref('')
const maxDuration = ref('')

// Dialog state
const showPropertyDialog = ref(false)
const editingProperty = ref<Property | null>(null)

// Filter options
const statusOptions = [
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' }
]

const tierOptions = [
  { title: 'Basic', value: 'basic' },
  { title: 'Standard', value: 'standard' },
  { title: 'Premium', value: 'premium' },
  { title: 'Luxury', value: 'luxury' }
]

// Computed properties
const ownerOptions = computed(() => {
  const owners = new Set(allProperties.value.map(p => p.owner_id))
  return Array.from(owners).map(ownerId => ({
    title: getOwnerName(ownerId),
    value: ownerId
  }))
})

const filteredProperties = computed(() => {
  let properties = allProperties.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    properties = properties.filter(property => 
      property.name.toLowerCase().includes(query) ||
      property.address.toLowerCase().includes(query) ||
      getOwnerName(property.owner_id).toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value) {
    const isActive = statusFilter.value === 'active'
    properties = properties.filter(property => property.active === isActive)
  }

  // Tier filter
  if (tierFilter.value) {
    properties = properties.filter(property => property.pricing_tier === tierFilter.value)
  }

  // Owner filter
  if (ownerFilter.value) {
    properties = properties.filter(property => property.owner_id === ownerFilter.value)
  }

  // Duration filter
  if (minDuration.value) {
    const min = parseInt(minDuration.value)
    properties = properties.filter(property => property.cleaning_duration >= min)
  }
  if (maxDuration.value) {
    const max = parseInt(maxDuration.value)
    properties = properties.filter(property => property.cleaning_duration <= max)
  }

  // Sort by name
  return properties.sort((a, b) => a.name.localeCompare(b.name))
})

// Helper methods
const getOwnerName = (ownerId: string): string => {
  // In a real app, this would fetch owner data
  return `Owner ${ownerId.slice(-4)}`
}

const getTierColor = (tier: PricingTier): string => {
  const colors: Record<PricingTier, string> = {
    basic: 'grey',
    standard: 'blue',
    premium: 'purple',
    luxury: 'amber'
  }
  return colors[tier]
}

const getPropertyBookingCount = (propertyId: string): number => {
  return allBookings.value.filter(booking => booking.property_id === propertyId).length
}

const getPropertyTurnCount = (propertyId: string): number => {
  return allBookings.value.filter(booking => 
    booking.property_id === propertyId && booking.booking_type === 'turn'
  ).length
}

// Dialog methods
const openCreatePropertyDialog = () => {
  editingProperty.value = null
  showPropertyDialog.value = true
}

const openPropertyDetails = (property: Property) => {
  console.log('Opening property details:', property.id)
  // Navigate to property details or open details modal
}

const editProperty = (property: Property) => {
  editingProperty.value = property
  showPropertyDialog.value = true
}

const closePropertyDialog = () => {
  showPropertyDialog.value = false
  editingProperty.value = null
}

const saveProperty = () => {
  console.log('Saving property...')
  // Implement property save logic
  closePropertyDialog()
}

// Property actions
const viewBookings = (property: Property) => {
  console.log('Viewing bookings for property:', property.id)
  // Navigate to bookings page with property filter
}

const togglePropertyStatus = async (property: Property) => {
  try {
    await updateProperty(property.id, { active: !property.active })
    console.log('Property status updated successfully')
  } catch (error) {
    console.error('Failed to update property status:', error)
  }
}

const duplicateProperty = (property: Property) => {
  console.log('Duplicating property:', property.id)
  // Implement property duplication logic
}

const deleteProperty = async (property: Property) => {
  if (confirm(`Are you sure you want to delete "${property.name}"?`)) {
    console.log('Deleting property:', property.id)
    // Implement property deletion logic
  }
}
</script>

<style scoped>
.admin-properties-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-header {
  flex-shrink: 0;
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
  background: rgb(var(--v-theme-surface));
}

.filters-section {
  flex-shrink: 0;
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
}

.page-content {
  flex: 1;
  overflow-y: auto;
  background: rgb(var(--v-theme-background));
}

.property-card {
  height: 100%;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.property-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.property-details {
  border-top: 1px solid rgb(var(--v-theme-surface-variant));
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
  padding: 8px 0;
}

.booking-stats {
  background: rgb(var(--v-theme-surface-variant));
  border-radius: 4px;
  padding: 8px;
}

@media (max-width: 960px) {
  .admin-properties-page {
    height: auto;
  }
  
  .page-content {
    overflow-y: visible;
  }
}
</style> 