<template>
  <div class="property-card-demo">
    <h2 class="text-h5 mb-4">Property Card Demo</h2>
    
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="3" v-for="property in demoProperties" :key="property.id">
        <PropertyCard 
          :property="property" 
          @edit="handleEdit"
          @delete="handleDelete"
          @view="handleView"
        />
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PropertyCard from './PropertyCard.vue';
import type { Property } from '@/types';

// Sample properties for demo
const demoProperties = ref<Property[]>([
  {
    id: '1',
    owner_id: 'owner1',
    name: 'Seaside Villa',
    address: '123 Ocean Drive, Beach City',
    cleaning_duration: 120,
    special_instructions: 'Clean sand from floors, check outside shower.',
    pricing_tier: 'luxury',
    active: true,
    created_at: '2023-01-15T09:30:00Z',
    updated_at: '2023-05-20T14:15:00Z'
  },
  {
    id: '2',
    owner_id: 'owner1',
    name: 'Downtown Apartment',
    address: '456 Main Street, Apt 7B, Metro City',
    cleaning_duration: 60,
    pricing_tier: 'premium',
    active: true,
    created_at: '2023-02-10T11:45:00Z',
    updated_at: '2023-06-05T16:30:00Z'
  },
  {
    id: '3',
    owner_id: 'owner2',
    name: 'Mountain Cabin',
    address: '789 Pine Trail, Highland Mountains',
    cleaning_duration: 90,
    special_instructions: 'Check fireplace, restock firewood if needed.',
    pricing_tier: 'basic',
    active: false,
    created_at: '2023-03-22T08:15:00Z',
    updated_at: '2023-04-18T13:20:00Z'
  },
  {
    id: '4',
    owner_id: 'owner3',
    name: 'Lakefront Cottage with Very Long Name That Should Truncate',
    address: '101 Lake View Road, Waterside County, with a very long address that should truncate',
    cleaning_duration: 150,
    special_instructions: 'This is a very long special instruction that should be truncated in the UI but visible in a tooltip when hovering. Check boat dock and life vests.',
    pricing_tier: 'luxury',
    active: true,
    created_at: '2023-01-05T10:10:00Z',
    updated_at: '2023-07-12T09:45:00Z'
  }
]);

// Snackbar for demo actions
const snackbar = ref({
  show: false,
  text: '',
  color: 'info'
});

// Demo handlers
const handleEdit = (id: string) => {
  const property = demoProperties.value.find(p => p.id === id);
  snackbar.value = {
    show: true,
    text: `Edit requested for: ${property?.name}`,
    color: 'primary'
  };
};

const handleDelete = (id: string) => {
  const property = demoProperties.value.find(p => p.id === id);
  snackbar.value = {
    show: true,
    text: `Delete requested for: ${property?.name}`,
    color: 'error'
  };
};

const handleView = (id: string) => {
  const property = demoProperties.value.find(p => p.id === id);
  snackbar.value = {
    show: true,
    text: `Viewing details for: ${property?.name}`,
    color: 'info'
  };
};
</script>

<style scoped>
.property-card-demo {
  padding: 1rem;
}
</style> 