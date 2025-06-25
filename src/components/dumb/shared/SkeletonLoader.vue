<template>
  <div :class="containerClasses">
    <!-- Predefined skeleton types -->
    <template v-if="type === 'card'">
      <v-skeleton-loader
        type="card"
        :loading="loading"
        :height="height"
        class="skeleton-card"
      >
        <slot />
      </v-skeleton-loader>
    </template>
    
    <template v-else-if="type === 'list-item'">
      <v-skeleton-loader
        type="list-item-avatar-two-line"
        :loading="loading"
        class="skeleton-list-item"
      >
        <slot />
      </v-skeleton-loader>
    </template>
    
    <template v-else-if="type === 'table-row'">
      <v-skeleton-loader
        type="table-row"
        :loading="loading"
        class="skeleton-table-row"
      >
        <slot />
      </v-skeleton-loader>
    </template>
    
    <template v-else-if="type === 'property-card'">
      <v-skeleton-loader
        :loading="loading"
        type="card-avatar, article, actions"
        :height="height || 280"
        class="skeleton-property-card"
      >
        <slot />
      </v-skeleton-loader>
    </template>
    
    <template v-else-if="type === 'booking-item'">
      <v-skeleton-loader
        :loading="loading"
        type="list-item-avatar-three-line"
        class="skeleton-booking-item"
      >
        <slot />
      </v-skeleton-loader>
    </template>
    
    <template v-else-if="type === 'calendar-event'">
      <v-skeleton-loader
        :loading="loading"
        type="chip"
        :height="height || 60"
        class="skeleton-calendar-event"
      >
        <slot />
      </v-skeleton-loader>
    </template>
    
    <template v-else-if="type === 'form'">
      <v-skeleton-loader
        :loading="loading"
        type="heading, text, text, text, button"
        class="skeleton-form"
      >
        <slot />
      </v-skeleton-loader>
    </template>
    
    <template v-else-if="type === 'dashboard-stats'">
      <v-skeleton-loader
        :loading="loading"
        type="card-heading, divider, list-item-three-line, card-heading, divider, list-item-three-line"
        class="skeleton-dashboard-stats"
      >
        <slot />
      </v-skeleton-loader>
    </template>
    
    <!-- Custom skeleton with custom type string -->
    <template v-else>
      <v-skeleton-loader
        :type="type"
        :loading="loading"
        :height="height"
        :width="width"
        :class="skeletonClasses"
      >
        <slot />
      </v-skeleton-loader>
    </template>
    
    <!-- Multiple items for lists -->
    <template v-if="count > 1">
      <v-skeleton-loader
        v-for="i in count - 1"
        :key="i"
        :type="type === 'property-card' ? 'card-avatar, article, actions' : 
          type === 'booking-item' ? 'list-item-avatar-three-line' :
          type === 'list-item' ? 'list-item-avatar-two-line' :
          type === 'table-row' ? 'table-row' : type"
        :loading="loading"
        :height="type === 'property-card' ? height || 280 : 
          type === 'calendar-event' ? height || 60 : height"
        :width="width"
        :class="skeletonClasses"
        class="mt-2"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  /** Whether to show skeleton or content */
  loading?: boolean;
  /** Predefined skeleton type or custom Vuetify skeleton type string */
  type?: 'card' | 'list-item' | 'table-row' | 'property-card' | 'booking-item' | 
         'calendar-event' | 'form' | 'dashboard-stats' | string;
  /** Number of skeleton items to show (for lists) */
  count?: number;
  /** Height of the skeleton */
  height?: number | string;
  /** Width of the skeleton */
  width?: number | string;
  /** Additional CSS classes */
  class?: string;
  /** Variant for different contexts */
  variant?: 'default' | 'rounded' | 'elevated';
}

const props = withDefaults(defineProps<Props>(), {
  loading: true,
  type: 'card',
  count: 1,
  variant: 'default'
});

// Computed classes
const containerClasses = computed(() => [
  'skeleton-loader-container',
  props.class
]);

const skeletonClasses = computed(() => [
  'skeleton-loader',
  `skeleton-loader--${props.variant}`,
  {
    'skeleton-loader--rounded': props.variant === 'rounded',
    'skeleton-loader--elevated': props.variant === 'elevated'
  }
]);
</script>

<style scoped>
.skeleton-loader-container {
  width: 100%;
}

.skeleton-loader--rounded {
  border-radius: 12px;
}

.skeleton-loader--elevated {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.skeleton-card {
  margin-bottom: 16px;
}

.skeleton-list-item {
  margin-bottom: 8px;
}

.skeleton-table-row {
  margin-bottom: 4px;
}

.skeleton-property-card {
  margin-bottom: 16px;
  border-radius: 8px;
}

.skeleton-booking-item {
  margin-bottom: 12px;
  padding: 8px;
}

.skeleton-calendar-event {
  margin-bottom: 4px;
  border-radius: 4px;
}

.skeleton-form {
  padding: 16px;
}

.skeleton-dashboard-stats {
  padding: 16px;
}

/* Animation customization */
:deep(.v-skeleton-loader__bone) {
  background: linear-gradient(90deg, 
    rgba(var(--v-theme-surface-variant), 0.4) 25%, 
    rgba(var(--v-theme-surface-variant), 0.6) 50%, 
    rgba(var(--v-theme-surface-variant), 0.4) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Dark theme adjustments */
.v-theme--dark :deep(.v-skeleton-loader__bone) {
  background: linear-gradient(90deg, 
    rgba(var(--v-theme-surface-variant), 0.2) 25%, 
    rgba(var(--v-theme-surface-variant), 0.4) 50%, 
    rgba(var(--v-theme-surface-variant), 0.2) 75%
  );
  background-size: 200% 100%;
}
</style> 