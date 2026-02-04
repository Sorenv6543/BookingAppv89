<template>
  <div 
    :class="containerClasses"
    :style="containerStyle"
  >
    <v-progress-circular
      :size="size"
      :width="width"
      :color="color"
      :indeterminate="!progress"
      :model-value="progress"
      class="loading-spinner"
    />
    
    <div 
      v-if="message"
      :class="messageClasses"
      class="loading-message"
    >
      {{ message }}
    </div>
    
    <div 
      v-if="showProgress && progress !== undefined"
      class="loading-progress"
    >
      {{ Math.round(progress) }}%
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  /** Size of the spinner */
  size?: number | string;
  /** Width of the spinner stroke */
  width?: number | string;
  /** Color of the spinner */
  color?: string;
  /** Loading message to display */
  message?: string;
  /** Progress value (0-100) for determinate progress */
  progress?: number;
  /** Show progress percentage */
  showProgress?: boolean;
  /** Variant for different use cases */
  variant?: 'inline' | 'overlay' | 'page' | 'button';
  /** Center the spinner */
  centered?: boolean;
  /** Minimum height for the container */
  minHeight?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 40,
  width: 4,
  color: 'primary',
  message: undefined,
  progress: undefined,
  variant: 'inline',
  centered: true,
  minHeight: 'auto'
});

// Computed classes and styles
const containerClasses = computed(() => [
  'loading-spinner-container',
  `loading-spinner--${props.variant}`,
  {
    'loading-spinner--centered': props.centered,
    'loading-spinner--with-message': props.message,
    'loading-spinner--with-progress': props.showProgress && props.progress !== undefined
  }
]);

const containerStyle = computed(() => ({
  minHeight: props.minHeight
}));

const messageClasses = computed(() => [
  'text-body-2',
  {
    'text-center': props.centered,
    'mt-3': props.variant !== 'button'
  }
]);
</script>

<style scoped>
.loading-spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-spinner--inline {
  display: inline-flex;
  vertical-align: middle;
}

.loading-spinner--overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10;
}

.loading-spinner--page {
  min-height: 200px;
  width: 100%;
}

.loading-spinner--button {
  flex-direction: row;
  gap: 8px;
}

.loading-spinner--centered {
  text-align: center;
}

.loading-message {
  color: rgba(var(--v-theme-on-surface), 0.7);
  max-width: 300px;
  word-wrap: break-word;
}

.loading-progress {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.8);
  margin-top: 8px;
}

.loading-spinner--button .loading-message {
  margin-top: 0;
  font-size: 0.875rem;
}

/* Dark theme adjustments */
.v-theme--dark .loading-spinner--overlay {
  background-color: rgba(0, 0, 0, 0.8);
}
</style> 