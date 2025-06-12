<template>
  <v-card
    class="property-card"
    :elevation="2"
    :class="{ 'inactive-property': !property.active }"
    @click="emit('view', property.id)"
  >
    <v-card-title class="text-truncate d-flex align-center">
      {{ property.name }}
      <v-chip
        class="ml-2"
        size="small"
        :color="activeStatusColor"
        :text-color="property.active ? 'white' : 'default'"
      >
        {{ property.active ? 'Active' : 'Inactive' }}
      </v-chip>
    </v-card-title>

    <v-card-text>
      <div class="address text-truncate mb-2">
        <v-icon icon="mdi-home" size="small" class="mr-1"></v-icon>
        {{ property.address }}
      </div>

      <div class="d-flex align-center mb-2">
        <v-icon icon="mdi-clock-outline" size="small" class="mr-1"></v-icon>
        <span>Cleaning: {{ formattedCleaningDuration }}</span>
      </div>

      <div class="d-flex align-center mb-2">
        <v-icon icon="mdi-tag-outline" size="small" class="mr-1"></v-icon>
        <v-chip
          size="x-small"
          :color="pricingTierColor"
          class="text-capitalize"
        >
          {{ property.pricing_tier }}
        </v-chip>
      </div>

      <div v-if="property.special_instructions" class="special-instructions mt-2">
        <v-tooltip location="bottom">
          <template v-slot:activator="{ props }">
            <div class="text-truncate" v-bind="props">
              <v-icon icon="mdi-information-outline" size="small" class="mr-1"></v-icon>
              {{ property.special_instructions }}
            </div>
          </template>
          <span>{{ property.special_instructions }}</span>
        </v-tooltip>
      </div>
    </v-card-text>

    <v-card-actions v-if="displayActions">
      <v-spacer></v-spacer>
      <v-btn
        variant="text"
        color="primary"
        size="small"
        @click.stop="emit('edit', property.id)"
        aria-label="Edit property"
      >
        <v-icon>mdi-pencil</v-icon>
        Edit
      </v-btn>
      <v-btn
        variant="text"
        color="error"
        size="small"
        @click.stop="emit('delete', property.id)"
        aria-label="Delete property"
      >
        <v-icon>mdi-delete</v-icon>
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Property, PricingTier } from '@/types';

interface Props {
  property: Property;
  displayActions?: boolean;
}

interface Emits {
  (e: 'edit', id: string): void;
  (e: 'delete', id: string): void;
  (e: 'view', id: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  displayActions: true
});

const emit = defineEmits<Emits>();

// Format cleaning duration from minutes to hours and minutes
const formattedCleaningDuration = computed((): string => {
  const { cleaning_duration } = props.property;
  
  if (cleaning_duration < 60) {
    return `${cleaning_duration} minutes`;
  }
  
  const hours = Math.floor(cleaning_duration / 60);
  const minutes = cleaning_duration % 60;
  
  if (minutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  
  return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
});

// Determine pricing tier color
const pricingTierColor = computed((): string => {
  const tierColors: Record<PricingTier, string> = {
    basic: 'grey',
    premium: 'primary',
    luxury: 'purple'
  };
  
  return tierColors[props.property.pricing_tier];
});

// Determine active status color
const activeStatusColor = computed((): string => {
  return props.property.active ? 'success' : 'error';
});
</script>

<style scoped>
.property-card {
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}

.property-card:hover {
  transform: translateY(-4px);
}

.inactive-property {
  opacity: 0.7;
}

.special-instructions {
  font-style: italic;
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
}
</style> 