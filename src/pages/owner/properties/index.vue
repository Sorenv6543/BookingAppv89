<template>
  <div class="owner-properties-page">
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
              @click="handleAddProperty"
            >
              Add Property
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Property Stats -->
      <v-row class="mb-4">
        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <v-card>
            <v-card-text>
              <div class="text-h6">
                {{ ownerProperties.length }}
              </div>
              <div class="text-caption text-medium-emphasis">
                Total Properties
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <v-card>
            <v-card-text>
              <div class="text-h6">
                {{ activeProperties.length }}
              </div>
              <div class="text-caption text-medium-emphasis">
                Active Properties
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <v-card>
            <v-card-text>
              <div class="text-h6">
                {{ ownerBookings.length }}
              </div>
              <div class="text-caption text-medium-emphasis">
                Total Bookings
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <v-card>
            <v-card-text>
              <div class="text-h6">
                {{ todayTurns.length }}
              </div>
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
          v-for="property in ownerProperties"
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
      <v-row v-if="ownerProperties.length === 0">
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
            @click="handleAddProperty"
          >
            Add Your First Property
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import PropertyCard from '@/components/dumb/shared/PropertyCard.vue';
import { useOwnerProperties } from '@/composables/owner/useOwnerProperties';
import { useOwnerBookings } from '@/composables/owner/useOwnerBookings';
import { useUIStore } from '@/stores/ui';
import type { Property } from '@/types';

// Meta information for this page
defineOptions({
  name: 'OwnerPropertiesPage'
});

// Composables
const { 
  myProperties: ownerProperties,
  myActiveProperties: activeProperties,
  fetchMyProperties,
  deleteMyProperty
} = useOwnerProperties();

const {
  myBookings: ownerBookings,
  myTodayTurns: todayTurns,
  fetchMyBookings
} = useOwnerBookings();

// Stores
const uiStore = useUIStore();

// Event handlers
const handleAddProperty = (): void => {
  uiStore.openModal('propertyModal', 'create');
};

const handleEditProperty = (propertyId: string): void => {
  const property = ownerProperties.value.find(p => p.id === propertyId);
  if (property) {
    uiStore.openModal('propertyModal', 'edit', property);
  }
};

const handleDeleteProperty = async (propertyId: string): Promise<void> => {
  const property = ownerProperties.value.find(p => p.id === propertyId);
  if (!property) return;

  const confirmed = await uiStore.showConfirmation(
    'Delete Property',
    `Are you sure you want to delete "${property.name}"? This action cannot be undone.`,
    { dangerous: true }
  );

  if (confirmed) {
    try {
      await deleteMyProperty(property.id);
      uiStore.showNotification('Property deleted successfully', 'success');
    } catch (error) {
      uiStore.showNotification('Failed to delete property', 'error');
    }
  }
};

// Initialize data
onMounted(async () => {
  await Promise.all([
    fetchMyProperties(),
    fetchMyBookings()
  ]);
});
</script>

<style scoped>
.owner-properties-page {
  padding: 1rem;
  min-height: calc(100vh - 64px);
}

.v-card {
  height: 100%;
}
</style> 