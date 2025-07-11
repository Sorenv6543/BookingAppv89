<template>
  <div class="quick-actions-fab">
    <!-- Main FAB Trigger -->
    <v-fab
      v-model="isExpanded"
      :icon="isExpanded ? 'mdi-close' : mainIcon"
      :color="mainColor"
      size="large"
      class="main-fab"
      :class="{ 
        'fab-expanded': isExpanded,
        'fab-pulse': showPulse
      }"
      location="bottom end"
      app
      @click="toggleExpanded"
    />

    <!-- Expandable Action Items -->
    <v-slide-y-reverse-transition
      group
      tag="div"
      class="fab-menu"
    >
      <v-fab
        v-for="(action, index) in visibleActions"
        v-show="isExpanded"
        :key="action.id"
        :icon="action.icon"
        :color="action.color || 'primary'"
        :style="{ 
          '--delay': `${index * 100}ms`,
          '--offset': `${(index + 1) * 70}px`
        }"
        size="small"
        class="action-fab"
        :class="`action-fab-${index}`"
        @click="handleActionClick(action)"
      >
        <v-tooltip
          :text="action.tooltip"
          location="start"
          activator="parent"
        />
      </v-fab>
    </v-slide-y-reverse-transition>

    <!-- Backdrop -->
    <v-overlay
      v-model="isExpanded"
      class="fab-overlay"
      opacity="0.1"
      @click="closeMenu"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

export interface QuickAction {
  id: string;
  icon: string;
  tooltip: string;
  color?: string;
  action?: () => void;
  condition?: () => boolean;
  priority?: number;
}

interface Props {
  actions: QuickAction[];
  mainIcon?: string;
  mainColor?: string;
  maxVisible?: number;
  showPulse?: boolean;
  autoClose?: boolean;
}

interface Emits {
  (e: 'action-click', action: QuickAction): void;
  (e: 'menu-toggle', isExpanded: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  mainIcon: 'mdi-plus',
  mainColor: 'primary',
  maxVisible: 4,
  showPulse: false,
  autoClose: true
});

const emit = defineEmits<Emits>();

const isExpanded = ref(false);

// Filter and sort actions based on conditions and priority
const visibleActions = computed(() => {
  return props.actions
    .filter(action => !action.condition || action.condition())
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .slice(0, props.maxVisible);
});

// Handle action click
const handleActionClick = (action: QuickAction) => {
  if (action.action) {
    action.action();
  }
  emit('action-click', action);
  
  if (props.autoClose) {
    closeMenu();
  }
};

// Menu controls
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
  emit('menu-toggle', isExpanded.value);
};

const closeMenu = () => {
  isExpanded.value = false;
  emit('menu-toggle', false);
};

// Auto-close on escape key
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isExpanded.value) {
    closeMenu();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
});

// Watch for changes in visible actions
watch(() => visibleActions.value.length, (newLength) => {
  if (newLength === 0 && isExpanded.value) {
    closeMenu();
  }
});
</script>

<style scoped>
.quick-actions-fab {
  position: relative;
  z-index: 1000;
}

/* Main FAB styling */
.main-fab {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(var(--v-theme-shadow), 0.15);
}

.main-fab.fab-expanded {
  transform: rotate(45deg);
  box-shadow: 0 8px 24px rgba(var(--v-theme-shadow), 0.25);
}

.main-fab.fab-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.15);
  }
  50% {
    box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.4);
  }
  100% {
    box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.15);
  }
}

/* FAB Menu Container */
.fab-menu {
  position: fixed;
  bottom: 80px;
  right: 16px;
  display: flex;
  flex-direction: column-reverse;
  gap: 12px;
  z-index: 999;
}

/* Action FAB styling */
.action-fab {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.3s ease-out forwards;
  animation-delay: var(--delay);
  opacity: 0;
  transform: translateY(20px) scale(0.8);
  box-shadow: 0 2px 8px rgba(var(--v-theme-shadow), 0.15);
}

.action-fab:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 16px rgba(var(--v-theme-shadow), 0.25);
}

/* Staggered animation for action FABs */
.action-fab-0 { --delay: 0ms; }
.action-fab-1 { --delay: 100ms; }
.action-fab-2 { --delay: 200ms; }
.action-fab-3 { --delay: 300ms; }

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Backdrop overlay */
.fab-overlay {
  z-index: 998;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .fab-menu {
    right: 20px;
    bottom: 90px;
  }
  
  .main-fab {
    position: fixed !important;
    bottom: 20px !important;
    right: 20px !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .main-fab,
  .action-fab {
    border: 2px solid rgb(var(--v-theme-on-surface));
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .main-fab,
  .action-fab {
    transition: none;
    animation: none;
  }
  
  .main-fab.fab-expanded {
    transform: none;
  }
  
  .main-fab.fab-pulse {
    animation: none;
  }
}

/* Focus and accessibility */
.main-fab:focus-visible,
.action-fab:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

/* Dark theme adjustments */
.v-theme--dark .main-fab,
.v-theme--dark .action-fab {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.v-theme--dark .main-fab:hover,
.v-theme--dark .action-fab:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}
</style> 