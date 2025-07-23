<template>
  <v-snackbar
    v-model="isVisible"
    :color="toastColor"
    :timeout="computedTimeout"
    :location="location"
    :class="toastClasses"
    :multi-line="isMultiLine"
    :vertical="isVertical"
    elevation="8"
    @after-leave="handleAfterLeave"
  >
    <div class="toast-content">
      <!-- Icon Section -->
      <div class="toast-icon-section">
        <v-icon
          :icon="toastIcon"
          :size="iconSize"
          :class="iconClasses"
        />
      </div>

      <!-- Content Section -->
      <div class="toast-message-section">
        <div
          v-if="notification.title"
          class="toast-title"
        >
          {{ notification.title }}
        </div>
        <div class="toast-message">
          {{ notification.message }}
        </div>
        
        <!-- Progress Indicators -->
        <div
          v-if="notification.showProgress"
          class="toast-progress"
        >
          <v-progress-linear
            :model-value="progressValue"
            :color="progressColor"
            height="2"
            rounded
          />
        </div>

        <!-- Additional Details -->
        <div
          v-if="notification.details"
          class="toast-details"
        >
          <v-expansion-panels
            variant="accordion"
            class="details-panel"
          >
            <v-expansion-panel
              title="Show Details"
              elevation="0"
            >
              <v-expansion-panel-text>
                {{ notification.details }}
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </div>

      <!-- Action Section -->
      <div
        v-if="hasActions"
        class="toast-actions"
      >
        <div class="action-buttons">
          <v-btn
            v-for="action in notification.actions"
            :key="action.id"
            :color="action.color || 'white'"
            :variant="action.variant || 'text'"
            size="small"
            :loading="action.loading"
            class="action-btn"
            @click="handleActionClick(action)"
          >
            <v-icon
              v-if="action.icon"
              :icon="action.icon"
              size="small"
              class="mr-1"
            />
            {{ action.label }}
          </v-btn>
        </div>
      </div>

      <!-- Close Button -->
      <v-btn
        v-if="notification.closable !== false"
        icon="mdi-close"
        variant="text"
        size="small"
        class="toast-close-btn"
        @click="closeToast"
      />
    </div>

    <!-- Background Pattern for Urgent Notifications -->
    <div
      v-if="notification.priority === 'critical'"
      class="toast-background-pattern"
    />
  </v-snackbar>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';

export interface ToastAction {
  id: string;
  label: string;
  icon?: string;
  color?: string;
  variant?: 'text' | 'outlined' | 'flat' | 'elevated' | 'tonal' | 'plain';
  loading?: boolean;
  action?: () => void | Promise<void>;
}

export interface ToastNotification {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  priority?: 'low' | 'normal' | 'high' | 'critical';
  timeout?: number;
  persistent?: boolean;
  closable?: boolean;
  actions?: ToastAction[];
  details?: string;
  showProgress?: boolean;
  progressValue?: number;
  metadata?: Record<string, any>;
}

interface Props {
  notification: ToastNotification;
  location?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface Emits {
  (e: 'close', id: string): void;
  (e: 'action-click', action: ToastAction, notification: ToastNotification): void;
  (e: 'timeout', id: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  location: 'bottom'
});

const emit = defineEmits<Emits>();

const isVisible = ref(true);
const progressValue = ref(props.notification.progressValue || 0);

// Computed properties for styling
const toastColor = computed(() => {
  const typeColors = {
    success: 'success',
    warning: 'warning', 
    error: 'error',
    info: 'info'
  };
  return typeColors[props.notification.type];
});

const toastIcon = computed(() => {
  const typeIcons = {
    success: 'mdi-check-circle',
    warning: 'mdi-alert',
    error: 'mdi-alert-circle',
    info: 'mdi-information'
  };
  return typeIcons[props.notification.type];
});

const iconSize = computed(() => {
  return props.notification.priority === 'critical' ? 'large' : 'default';
});

const iconClasses = computed(() => ({
  'critical-icon': props.notification.priority === 'critical',
  'pulse-icon': props.notification.priority === 'critical'
}));

const progressColor = computed(() => {
  return props.notification.type === 'error' ? 'white' : 'primary';
});

const computedTimeout = computed(() => {
  if (props.notification.persistent) return -1;
  if (props.notification.timeout) return props.notification.timeout;
  
  // Priority-based timeouts
  const priorityTimeouts = {
    low: 3000,
    normal: 5000,
    high: 8000,
    critical: -1 // Persistent for critical
  };
  
  return priorityTimeouts[props.notification.priority || 'normal'];
});

const toastClasses = computed(() => ({
  'toast-enhanced': true,
  [`toast-${props.notification.type}`]: true,
  [`toast-priority-${props.notification.priority || 'normal'}`]: true,
  'toast-has-actions': hasActions.value,
  'toast-critical': props.notification.priority === 'critical'
}));

const isMultiLine = computed(() => {
  return Boolean(props.notification.title) || 
         props.notification.message.length > 60 ||
         hasActions.value;
});

const isVertical = computed(() => {
  return hasActions.value && props.notification.actions!.length > 2;
});

const hasActions = computed(() => {
  return props.notification.actions && props.notification.actions.length > 0;
});

// Action handlers
const handleActionClick = async (action: ToastAction) => {
  try {
    if (action.action) {
      const result = action.action();
      if (result instanceof Promise) {
        action.loading = true;
        await result;
        action.loading = false;
      }
    }
    emit('action-click', action, props.notification);
  } catch (error) {
    action.loading = false;
    console.error('Toast action failed:', error);
  }
};

const closeToast = () => {
  isVisible.value = false;
};

const handleAfterLeave = () => {
  emit('close', props.notification.id);
};

// Auto-update progress value
watch(
  () => props.notification.progressValue,
  (newValue) => {
    if (newValue !== undefined) {
      progressValue.value = newValue;
    }
  }
);

// Critical notification audio alert
const playAudioAlert = () => {
  if (props.notification.priority === 'critical') {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  }
};

onMounted(() => {
  playAudioAlert();
});
</script>

<style scoped>
/* Enhanced toast content layout */
.toast-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  min-height: 48px;
}

.toast-icon-section {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.toast-message-section {
  flex: 1;
  min-width: 0;
}

.toast-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin-left: 8px;
}

.toast-close-btn {
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.toast-close-btn:hover {
  opacity: 1;
}

/* Typography and spacing */
.toast-title {
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.3;
  margin-bottom: 4px;
  color: inherit;
}

.toast-message {
  font-size: 0.875rem;
  line-height: 1.4;
  opacity: 0.95;
  word-wrap: break-word;
}

.toast-details {
  margin-top: 8px;
}

.details-panel {
  background: rgba(255, 255, 255, 0.1) !important;
  box-shadow: none !important;
}

.toast-progress {
  margin-top: 8px;
}

/* Action buttons */
.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.action-btn {
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Priority-based styling */
:deep(.v-snackbar.toast-priority-critical) {
  animation: criticalPulse 1s ease-in-out infinite alternate;
}

:deep(.v-snackbar.toast-priority-high) {
  border-left: 4px solid rgba(255, 255, 255, 0.8);
}

:deep(.v-snackbar.toast-priority-low) {
  opacity: 0.9;
}

/* Critical notification styling */
.toast-background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.1) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.1) 75%,
    transparent 75%
  );
  background-size: 20px 20px;
  animation: movePattern 2s linear infinite;
  pointer-events: none;
  border-radius: inherit;
}

/* Icon animations */
.critical-icon {
  color: #fff !important;
}

.pulse-icon {
  animation: iconPulse 1s ease-in-out infinite;
}

/* Animations */
@keyframes criticalPulse {
  from {
    box-shadow: 0 4px 12px rgba(var(--v-theme-error), 0.3);
  }
  to {
    box-shadow: 0 8px 24px rgba(var(--v-theme-error), 0.6);
  }
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes movePattern {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 20px 20px;
  }
}

/* Type-specific enhancements */
:deep(.v-snackbar.toast-success) {
  background: linear-gradient(135deg, rgb(var(--v-theme-success)) 0%, rgba(var(--v-theme-success), 0.8) 100%) !important;
}

:deep(.v-snackbar.toast-warning) {
  background: linear-gradient(135deg, rgb(var(--v-theme-warning)) 0%, rgba(var(--v-theme-warning), 0.8) 100%) !important;
}

:deep(.v-snackbar.toast-error) {
  background: linear-gradient(135deg, rgb(var(--v-theme-error)) 0%, rgba(var(--v-theme-error), 0.8) 100%) !important;
}

:deep(.v-snackbar.toast-info) {
  background: linear-gradient(135deg, rgb(var(--v-theme-info)) 0%, rgba(var(--v-theme-info), 0.8) 100%) !important;
}

/* Glass effect for enhanced visual appeal */
:deep(.v-snackbar.toast-enhanced) {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .toast-content {
    flex-direction: column;
    gap: 8px;
  }
  
  .toast-actions {
    align-self: stretch;
    margin-left: 0;
    margin-top: 8px;
  }
  
  .action-buttons {
    justify-content: flex-end;
  }
  
  .toast-close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .critical-icon,
  .toast-background-pattern,
  :deep(.v-snackbar.toast-priority-critical) {
    animation: none;
  }
}

/* Focus management */
.action-btn:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.8);
  outline-offset: 2px;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  :deep(.v-snackbar.toast-enhanced) {
    border: 2px solid white;
  }
  
  .toast-title,
  .toast-message {
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  }
}
</style> 