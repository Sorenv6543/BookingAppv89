<template>
  <v-card
    class="property-card hover-elevate glass-card fade-in"
    :elevation="2"
    :class="{ 'inactive-property': !property.active }"
    @click="emit('view', property.id)"
  >
    <v-card-title class="d-flex align-center pa-3">
      <div class="text-truncate">
        {{ property.name }}
      </div>
      <v-chip
        class="ml-2"
        size="x-small"
        :color="activeStatusColor"
        :text-color="property.active ? 'white' : 'default'"
      >
        {{ property.active ? 'Active' : 'Inactive' }}
      </v-chip>
    </v-card-title>

    <v-card-text class="pa-3 pt-1">
      <div class="address text-truncate mb-2">
        <v-icon
          icon="mdi-home"
          size="small"
          class="mr-1"
          color="primary"
        />
        {{ property.address }}
      </div>

      <div class="d-flex align-center mb-2">
        <v-icon
          icon="mdi-clock-outline"
          size="small"
          class="mr-1"
          color="primary"
        />
        <span>{{ formattedCleaningDuration }}</span>
      </div>

      <div class="d-flex align-center mb-2">
        <v-icon
          icon="mdi-tag-outline"
          size="small"
          class="mr-1"
          color="primary"
        />
        <v-chip
          size="x-small"
          :color="pricingTierColor"
          class="text-capitalize"
          elevation="1"
        >
          {{ property.pricing_tier }}
        </v-chip>
      </div>

      <div
        v-if="property.special_instructions"
        class="special-instructions mt-3"
      >
        <v-tooltip location="bottom">
          <template #activator="{ props: tooltipProps }">
            <div
              class="text-truncate d-flex align-start"
              v-bind="tooltipProps"
            >
              <v-icon
                icon="mdi-information-outline"
                size="small"
                class="mr-1"
                color="info"
              />
              <div class="text-caption">
                {{ property.special_instructions }}
              </div>
            </div>
          </template>
          <span>{{ property.special_instructions }}</span>
        </v-tooltip>
      </div>
    </v-card-text>

    <v-divider v-if="displayActions" />

    <v-card-actions
      v-if="displayActions"
      class="pa-2"
    >
      <v-spacer />
      <v-btn
        variant="text"
        color="primary"
        size="small"
        aria-label="Edit property"
        rounded
        @click.stop="emit('edit', property.id)"
      >
        <v-icon class="mr-1">
          mdi-pencil
        </v-icon>
        Edit
      </v-btn>
      <v-btn
        variant="text"
        color="error"
        size="small"
        aria-label="Delete property"
        rounded
        @click.stop="emit('delete', property.id)"
      >
        <v-icon class="mr-1">
          mdi-delete
        </v-icon>
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
    luxury: 'accent'
  };
  
  return tierColors[props.property.pricing_tier];
});

// Determine active status color
const activeStatusColor = computed((): string => {
  return props.property.active ? 'success' : 'error';
});
</script>

<style scoped>
/* Main card theming */
.property-card {
  position: relative;
  background: rgb(var(--v-theme-surface)) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
  border-top: 4px solid rgb(var(--v-theme-primary)) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.property-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-on-surface), 0.15);
  border-color: rgba(var(--v-theme-primary), 0.3) !important;
}

.property-card.inactive-property {
  opacity: 0.75;
  border-top-color: rgb(var(--v-theme-error)) !important;
}

.property-card.inactive-property:before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(var(--v-theme-surface), 0.3);
  pointer-events: none;
  z-index: 1;
}

.property-card:hover .v-card-title {
  color: rgb(var(--v-theme-primary)) !important;
}

.special-instructions {
  font-style: italic;
  color: rgba(var(--v-theme-on-surface), 0.7) !important;
}

/* Card title theming */
:deep(.v-card-title) {
  color: rgb(var(--v-theme-on-surface)) !important;
}

/* Card text theming */
:deep(.v-card-text) {
  color: rgba(var(--v-theme-on-surface), 0.8) !important;
}

/* Button theming */
:deep(.v-btn) {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

:deep(.v-btn--variant-text) {
  color: rgb(var(--v-theme-primary)) !important;
}

:deep(.v-btn--variant-text.text-error) {
  color: rgb(var(--v-theme-error)) !important;
}

:deep(.v-btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.3);
}

/* Icon theming */
:deep(.v-icon) {
  color: rgb(var(--v-theme-on-surface)) !important;
}

:deep(.v-btn .v-icon) {
  color: inherit !important;
}

/* Chip theming */
:deep(.v-chip) {
  background: rgba(var(--v-theme-primary), 0.12) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

:deep(.v-chip.bg-success) {
  background: rgba(var(--v-theme-success), 0.12) !important;
  color: rgb(var(--v-theme-success)) !important;
}

:deep(.v-chip.bg-error) {
  background: rgba(var(--v-theme-error), 0.12) !important;
  color: rgb(var(--v-theme-error)) !important;
}

:deep(.v-chip.bg-grey) {
  background: rgba(var(--v-theme-on-surface), 0.12) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
}

/* Divider theming */
:deep(.v-divider) {
  border-color: rgba(var(--v-theme-on-surface), 0.12) !important;
}
</style> 