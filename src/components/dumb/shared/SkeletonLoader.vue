<template>
  <div 
    class="skeleton-loader"
    :class="[
      `skeleton-${type}`,
      `skeleton-${variant}`,
      { 'skeleton-animated': animated }
    ]"
    :style="customStyles"
  >
    <!-- Card-style skeleton -->
    <template v-if="type === 'card'">
      <div class="skeleton-card">
        <div class="skeleton-header">
          <div class="skeleton-avatar" />
          <div class="skeleton-title-section">
            <div class="skeleton-title" />
            <div class="skeleton-subtitle" />
          </div>
          <div class="skeleton-badge" />
        </div>
        
        <div class="skeleton-content">
          <div class="skeleton-metrics">
            <div class="skeleton-metric" />
            <div class="skeleton-metric" />
          </div>
          
          <div class="skeleton-text-lines">
            <div class="skeleton-line full" />
            <div class="skeleton-line medium" />
            <div class="skeleton-line small" />
          </div>
        </div>
        
        <div class="skeleton-actions">
          <div class="skeleton-button" />
          <div class="skeleton-button" />
          <div class="skeleton-button-icon" />
        </div>
      </div>
    </template>

    <!-- List item skeleton -->
    <template v-else-if="type === 'list-item'">
      <div class="skeleton-list-item">
        <div class="skeleton-list-avatar" />
        <div class="skeleton-list-content">
          <div class="skeleton-list-title" />
          <div class="skeleton-list-subtitle" />
          <div class="skeleton-list-meta">
            <div class="skeleton-chip" />
            <div class="skeleton-chip" />
          </div>
        </div>
        <div class="skeleton-list-actions">
          <div class="skeleton-icon-btn" />
          <div class="skeleton-icon-btn" />
        </div>
      </div>
    </template>

    <!-- Table row skeleton -->
    <template v-else-if="type === 'table-row'">
      <div class="skeleton-table-row">
        <div class="skeleton-cell checkbox" />
        <div class="skeleton-cell primary" />
        <div class="skeleton-cell secondary" />
        <div class="skeleton-cell tertiary" />
        <div class="skeleton-cell actions" />
      </div>
    </template>

    <!-- Calendar event skeleton -->
    <template v-else-if="type === 'calendar-event'">
      <div class="skeleton-calendar-event">
        <div class="skeleton-event-time" />
        <div class="skeleton-event-title" />
        <div class="skeleton-event-details" />
      </div>
    </template>

    <!-- Form field skeleton -->
    <template v-else-if="type === 'form-field'">
      <div class="skeleton-form-field">
        <div class="skeleton-field-label" />
        <div class="skeleton-field-input" />
        <div class="skeleton-field-helper" />
      </div>
    </template>

    <!-- Dashboard widget skeleton -->
    <template v-else-if="type === 'dashboard-widget'">
      <div class="skeleton-dashboard-widget">
        <div class="skeleton-widget-header">
          <div class="skeleton-widget-title" />
          <div class="skeleton-widget-value" />
        </div>
        <div class="skeleton-widget-chart">
          <div
            class="skeleton-chart-bar"
            style="height: 60%"
          />
          <div
            class="skeleton-chart-bar"
            style="height: 80%"
          />
          <div
            class="skeleton-chart-bar"
            style="height: 40%"
          />
          <div
            class="skeleton-chart-bar"
            style="height: 90%"
          />
          <div
            class="skeleton-chart-bar"
            style="height: 70%"
          />
        </div>
      </div>
    </template>

    <!-- Navigation menu skeleton -->
    <template v-else-if="type === 'nav-menu'">
      <div class="skeleton-nav-menu">
        <div 
          v-for="item in menuItemCount"
          :key="item"
          class="skeleton-nav-item"
        >
          <div class="skeleton-nav-icon" />
          <div class="skeleton-nav-text" />
          <div class="skeleton-nav-badge" />
        </div>
      </div>
    </template>

    <!-- Custom text skeleton -->
    <template v-else-if="type === 'text'">
      <div class="skeleton-text">
        <div 
          v-for="line in textLines"
          :key="line"
          class="skeleton-line"
          :class="getTextLineClass(line)"
        />
      </div>
    </template>

    <!-- Image skeleton -->
    <template v-else-if="type === 'image'">
      <div class="skeleton-image">
        <div class="skeleton-image-placeholder">
          <v-icon 
            icon="mdi-image-outline" 
            size="large" 
            class="skeleton-image-icon"
          />
        </div>
      </div>
    </template>

    <!-- Generic rectangular skeleton -->
    <template v-else>
      <div class="skeleton-rectangle" />
    </template>

    <!-- Loading progress indicator (optional) -->
    <div 
      v-if="showProgress" 
      class="skeleton-progress"
    >
      <v-progress-linear
        indeterminate
        :color="progressColor"
        height="2"
        class="skeleton-progress-bar"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type SkeletonType = 
  | 'card' 
  | 'list-item' 
  | 'table-row' 
  | 'calendar-event' 
  | 'form-field' 
  | 'dashboard-widget' 
  | 'nav-menu' 
  | 'text' 
  | 'image' 
  | 'rectangle';

type SkeletonVariant = 'wave' | 'pulse' | 'shimmer' | 'static';

interface Props {
  type?: SkeletonType;
  variant?: SkeletonVariant;
  animated?: boolean;
  width?: string | number;
  height?: string | number;
  lines?: number;
  menuItems?: number;
  showProgress?: boolean;
  progressColor?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'rectangle',
  variant: 'shimmer',
  animated: true,
  width: undefined,
  height: undefined,
  lines: 3,
  menuItems: 5,
  showProgress: false,
  progressColor: 'primary',
  loading: true
});

// Computed styles for custom dimensions
const customStyles = computed(() => {
  const styles: Record<string, string> = {};
  
  if (props.width) {
    styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width;
  }
  
  if (props.height) {
    styles.height = typeof props.height === 'number' ? `${props.height}px` : props.height;
  }
  
  return styles;
});

// Text lines for text skeleton
const textLines = computed(() => props.lines || 3);

// Menu items for navigation skeleton
const menuItemCount = computed(() => props.menuItems || 5);

// Generate text line classes for varying widths
const getTextLineClass = (lineIndex: number): string => {
  const classes = ['full', 'large', 'medium', 'small'];
  return classes[lineIndex % classes.length] || 'medium';
};
</script>

<style scoped>
/* Base skeleton styling */
.skeleton-loader {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
}

/* Animation variants */
.skeleton-animated.skeleton-wave::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(var(--v-theme-on-surface), 0.1),
    transparent
  );
  animation: wave 1.5s infinite;
  z-index: 1;
}

.skeleton-animated.skeleton-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-animated.skeleton-shimmer::before {
  content: '';
  position: absolute;
  top: 0;
  left: -200%;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(var(--v-theme-primary), 0.1) 20%,
    rgba(var(--v-theme-primary), 0.3) 40%,
    rgba(var(--v-theme-primary), 0.1) 60%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
  z-index: 1;
}

/* Base skeleton element */
.skeleton-element {
  background: rgba(var(--v-theme-on-surface), 0.06);
  border-radius: 4px;
  position: relative;
}

/* Card skeleton layout */
.skeleton-card {
  padding: 16px;
  background: rgba(var(--v-theme-surface), 0.8);
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-outline), 0.1);
}

.skeleton-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(var(--v-theme-on-surface), 0.08);
  flex-shrink: 0;
}

.skeleton-title-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-title {
  height: 16px;
  width: 70%;
  background: rgba(var(--v-theme-on-surface), 0.1);
  border-radius: 4px;
}

.skeleton-subtitle {
  height: 12px;
  width: 50%;
  background: rgba(var(--v-theme-on-surface), 0.06);
  border-radius: 4px;
}

.skeleton-badge {
  width: 60px;
  height: 24px;
  background: rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 12px;
  flex-shrink: 0;
}

.skeleton-content {
  margin-bottom: 16px;
}

.skeleton-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.skeleton-metric {
  height: 48px;
  background: rgba(var(--v-theme-on-surface), 0.04);
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-outline), 0.08);
}

.skeleton-text-lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 12px;
  background: rgba(var(--v-theme-on-surface), 0.06);
  border-radius: 4px;
}

.skeleton-line.full { width: 100%; }
.skeleton-line.large { width: 85%; }
.skeleton-line.medium { width: 65%; }
.skeleton-line.small { width: 45%; }

.skeleton-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 8px;
  border-top: 1px solid rgba(var(--v-theme-outline), 0.06);
}

.skeleton-button {
  width: 64px;
  height: 32px;
  background: rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 16px;
}

.skeleton-button-icon {
  width: 32px;
  height: 32px;
  background: rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 50%;
}

/* List item skeleton */
.skeleton-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: rgba(var(--v-theme-surface), 0.5);
}

.skeleton-list-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(var(--v-theme-on-surface), 0.08);
  flex-shrink: 0;
}

.skeleton-list-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skeleton-list-title {
  height: 14px;
  width: 60%;
  background: rgba(var(--v-theme-on-surface), 0.1);
  border-radius: 4px;
}

.skeleton-list-subtitle {
  height: 12px;
  width: 40%;
  background: rgba(var(--v-theme-on-surface), 0.06);
  border-radius: 4px;
}

.skeleton-list-meta {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.skeleton-chip {
  width: 48px;
  height: 20px;
  background: rgba(var(--v-theme-on-surface), 0.06);
  border-radius: 10px;
}

.skeleton-list-actions {
  display: flex;
  gap: 8px;
}

.skeleton-icon-btn {
  width: 24px;
  height: 24px;
  background: rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 50%;
}

/* Table row skeleton */
.skeleton-table-row {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 16px;
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.06);
}

.skeleton-cell {
  background: rgba(var(--v-theme-on-surface), 0.06);
  border-radius: 4px;
  height: 16px;
}

.skeleton-cell.checkbox { width: 20px; }
.skeleton-cell.primary { width: 30%; }
.skeleton-cell.secondary { width: 25%; }
.skeleton-cell.tertiary { width: 20%; }
.skeleton-cell.actions { width: 80px; }

/* Calendar event skeleton */
.skeleton-calendar-event {
  padding: 8px;
  background: rgba(var(--v-theme-primary), 0.1);
  border-radius: 4px;
  border-left: 3px solid rgba(var(--v-theme-primary), 0.3);
}

.skeleton-event-time {
  height: 12px;
  width: 60px;
  background: rgba(var(--v-theme-on-surface), 0.1);
  border-radius: 4px;
  margin-bottom: 4px;
}

.skeleton-event-title {
  height: 14px;
  width: 80%;
  background: rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 4px;
  margin-bottom: 4px;
}

.skeleton-event-details {
  height: 10px;
  width: 50%;
  background: rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 4px;
}

/* Form field skeleton */
.skeleton-form-field {
  margin-bottom: 16px;
}

.skeleton-field-label {
  height: 14px;
  width: 30%;
  background: rgba(var(--v-theme-on-surface), 0.1);
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-field-input {
  height: 48px;
  width: 100%;
  background: rgba(var(--v-theme-on-surface), 0.04);
  border-radius: 4px;
  border: 1px solid rgba(var(--v-theme-outline), 0.12);
  margin-bottom: 4px;
}

.skeleton-field-helper {
  height: 12px;
  width: 60%;
  background: rgba(var(--v-theme-on-surface), 0.06);
  border-radius: 4px;
}

/* Dashboard widget skeleton */
.skeleton-dashboard-widget {
  padding: 16px;
  background: rgba(var(--v-theme-surface), 0.8);
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-outline), 0.1);
}

.skeleton-widget-header {
  margin-bottom: 16px;
}

.skeleton-widget-title {
  height: 16px;
  width: 50%;
  background: rgba(var(--v-theme-on-surface), 0.1);
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-widget-value {
  height: 24px;
  width: 30%;
  background: rgba(var(--v-theme-primary), 0.1);
  border-radius: 4px;
}

.skeleton-widget-chart {
  display: flex;
  align-items: end;
  gap: 4px;
  height: 80px;
}

.skeleton-chart-bar {
  flex: 1;
  background: rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 2px 2px 0 0;
  min-height: 20%;
}

/* Navigation menu skeleton */
.skeleton-nav-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.skeleton-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(var(--v-theme-on-surface), 0.02);
}

.skeleton-nav-icon {
  width: 20px;
  height: 20px;
  background: rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 4px;
  flex-shrink: 0;
}

.skeleton-nav-text {
  flex: 1;
  height: 14px;
  background: rgba(var(--v-theme-on-surface), 0.06);
  border-radius: 4px;
}

.skeleton-nav-badge {
  width: 20px;
  height: 16px;
  background: rgba(var(--v-theme-primary), 0.1);
  border-radius: 8px;
  flex-shrink: 0;
}

/* Image skeleton */
.skeleton-image {
  background: rgba(var(--v-theme-on-surface), 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}

.skeleton-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.3;
}

.skeleton-image-icon {
  color: rgba(var(--v-theme-on-surface), 0.4) !important;
}

/* Generic rectangle */
.skeleton-rectangle {
  background: rgba(var(--v-theme-on-surface), 0.06);
  height: 20px;
  width: 100%;
  border-radius: 4px;
}

/* Progress indicator */
.skeleton-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.skeleton-progress-bar {
  border-radius: 0 0 4px 4px;
}

/* Animations */
@keyframes wave {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-200%);
  }
  100% {
    transform: translateX(200%);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .skeleton-metrics {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .skeleton-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .skeleton-actions {
    justify-content: stretch;
  }
  
  .skeleton-button {
    flex: 1;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .skeleton-animated::before,
  .skeleton-animated {
    animation: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .skeleton-element,
  .skeleton-line,
  .skeleton-title,
  .skeleton-subtitle,
  .skeleton-metric,
  .skeleton-button,
  .skeleton-list-title,
  .skeleton-list-subtitle,
  .skeleton-cell {
    background: rgba(var(--v-theme-on-surface), 0.2);
    border: 1px solid rgba(var(--v-theme-on-surface), 0.3);
  }
}
</style> 