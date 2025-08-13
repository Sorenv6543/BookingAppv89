<template>
  <v-bottom-navigation
    v-model="activeTab"
    :height="navigationHeight"
    :color="primaryColor"
    class="mobile-bottom-nav"
    :class="{
      'nav-hidden': !isVisible,
      'nav-owner': userRole === 'owner',
      'nav-admin': userRole === 'admin'
    }"
    density="comfortable"
    grow
    @update:model-value="handleNavigation"
  >
    <v-btn
      v-for="item in visibleNavItems"
      :key="item.id"
      :value="item.value"
      :disabled="item.disabled"
      class="nav-item"
      :class="{
        'nav-item-active': activeTab === item.value,
        'nav-item-urgent': item.urgent,
        'nav-item-disabled': item.disabled
      }"
      size="small"
      @click="handleItemClick(item)"
    >
      <!-- Icon with Badge Support -->
      <div class="nav-icon-container">
        <v-icon 
          :icon="item.icon"
          :size="iconSize"
          :color="getIconColor(item)"
          class="nav-icon"
          :class="{ 'icon-animated': item.urgent }"
        />
        
        <!-- Notification Badge -->
        <v-badge
          v-if="item.badge && item.badge.count > 0"
          :content="formatBadgeContent(item.badge)"
          :color="item.badge.color || 'error'"
          :class="badgeClasses(item.badge)"
          :offset-x="badgeOffset.x"
          :offset-y="badgeOffset.y"
          class="nav-badge"
        />
        
        <!-- Urgent Indicator -->
        <div 
          v-if="item.urgent"
          class="urgent-indicator"
        />
      </div>

      <!-- Label with Dynamic Text -->
      <span 
        class="nav-label"
        :class="{ 'label-active': activeTab === item.value }"
      >
        {{ item.label }}
      </span>

      <!-- Loading Indicator -->
      <v-progress-circular
        v-if="item.loading"
        :size="16"
        :width="2"
        indeterminate
        color="primary"
        class="nav-loading"
      />
    </v-btn>

    <!-- Quick Action Indicator -->
    <div 
      v-if="showQuickActionHint"
      class="quick-action-hint"
    >
      <v-icon 
        icon="mdi-gesture-swipe-up" 
        size="small"
        color="primary"
        class="hint-icon"
      />
      <span class="hint-text">Swipe up for quick actions</span>
    </div>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export interface NavBadge {
  count: number;
  max?: number;
  color?: string;
  urgent?: boolean;
  pulse?: boolean;
}

export interface NavItem {
  id: string;
  value: string;
  label: string;
  icon: string;
  route?: string;
  badge?: NavBadge;
  urgent?: boolean;
  disabled?: boolean;
  loading?: boolean;
  role?: 'owner' | 'admin' | 'shared';
  condition?: () => boolean;
  action?: () => void;
}

interface Props {
  items: NavItem[];
  userRole: 'owner' | 'admin';
  currentRoute?: string;
  height?: number;
  primaryColor?: string;
  autoHide?: boolean;
  showQuickActionHint?: boolean;
}

interface Emits {
  (e: 'navigate', item: NavItem): void;
  (e: 'item-click', item: NavItem): void;
  (e: 'tab-change', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  currentRoute: '',
  height: 64,
  primaryColor: 'primary',
  autoHide: true,
  showQuickActionHint: false
});

const emit = defineEmits<Emits>();

const router = useRouter();
const route = useRoute();

const activeTab = ref<string>('');
const isVisible = ref(true);
const lastScrollY = ref(0);

// Computed properties
const navigationHeight = computed(() => props.height);

const iconSize = computed(() => {
  return activeTab.value ? 'default' : 'small';
});

const badgeOffset = computed(() => ({
  x: 12,
  y: 12
}));

// Filter navigation items based on role and conditions
const visibleNavItems = computed(() => {
  return props.items.filter(item => {
    // Role-based filtering
    if (item.role && item.role !== 'shared' && item.role !== props.userRole) {
      return false;
    }
    
    // Condition-based filtering
    if (item.condition && !item.condition()) {
      return false;
    }
    
    return true;
  });
});

// Icon color logic
const getIconColor = (item: NavItem): string => {
  if (item.disabled) return 'disabled';
  if (item.urgent) return 'error';
  if (activeTab.value === item.value) return 'primary';
  return 'on-surface-variant';
};

// Badge formatting
const formatBadgeContent = (badge: NavBadge): string => {
  if (badge.max && badge.count > badge.max) {
    return `${badge.max}+`;
  }
  return badge.count.toString();
};

const badgeClasses = (badge: NavBadge) => ({
  'badge-pulse': badge.pulse,
  'badge-urgent': badge.urgent
});

// Navigation handlers
const handleNavigation = (value: string) => {
  const item = visibleNavItems.value.find(item => item.value === value);
  if (item) {
    emit('tab-change', value);
    
    if (item.route) {
      router.push(item.route);
    }
    
    emit('navigate', item);
  }
};

const handleItemClick = (item: NavItem) => {
  if (item.disabled) return;
  
  if (item.action) {
    item.action();
  }
  
  emit('item-click', item);
};

// Auto-hide functionality
const handleScroll = () => {
  if (!props.autoHide) return;
  
  const currentScrollY = window.scrollY;
  
  if (currentScrollY > lastScrollY.value && currentScrollY > 100) {
    // Scrolling down - hide nav
    isVisible.value = false;
  } else if (currentScrollY < lastScrollY.value) {
    // Scrolling up - show nav
    isVisible.value = true;
  }
  
  lastScrollY.value = currentScrollY;
};

// Route-based active tab detection
const updateActiveTab = () => {
  const currentPath = route.path;
  const matchingItem = visibleNavItems.value.find(item => 
    item.route && currentPath.startsWith(item.route)
  );
  
  if (matchingItem) {
    activeTab.value = matchingItem.value;
  }
};

// Lifecycle
onMounted(() => {
  updateActiveTab();
  
  if (props.autoHide) {
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
});

onUnmounted(() => {
  if (props.autoHide) {
    window.removeEventListener('scroll', handleScroll);
  }
});

// Watch for route changes
watch(
  () => route.path,
  () => updateActiveTab(),
  { immediate: true }
);

// Watch for current route prop changes
watch(
  () => props.currentRoute,
  (newRoute) => {
    if (newRoute) {
      const matchingItem = visibleNavItems.value.find(item => 
        item.route === newRoute
      );
      if (matchingItem) {
        activeTab.value = matchingItem.value;
      }
    }
  }
);
</script>

<style scoped>
/* Base navigation styling */
.mobile-bottom-nav {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(var(--v-theme-surface), 0.95) !important;
  border-top: 1px solid rgba(var(--v-theme-outline), 0.12);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  position: fixed !important;
  bottom: 0;
  left: 0;
  right: 0;
}

.mobile-bottom-nav.nav-hidden {
  transform: translateY(100%);
}

/* Role-based theming */
.mobile-bottom-nav.nav-owner {
  background: rgba(var(--v-theme-surface), 0.95) !important;
  border-top-color: rgba(var(--v-theme-primary), 0.2);
}

.mobile-bottom-nav.nav-admin {
  background: rgba(var(--v-theme-surface), 0.95) !important;
  border-top-color: rgba(var(--v-theme-secondary), 0.2);
}

/* Navigation item styling */
.nav-item {
  position: relative;
  min-height: 56px !important;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  margin: 4px 2px;
}

.nav-item-active {
  background: rgba(var(--v-theme-primary), 0.1) !important;
  color: rgb(var(--v-theme-primary)) !important;
  transform: translateY(-2px);
}

.nav-item-urgent {
  animation: urgentPulse 2s ease-in-out infinite;
}

.nav-item-disabled {
  opacity: 0.5;
  pointer-events: none;
}

/* Icon container and styling */
.nav-icon-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.nav-icon {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item-active .nav-icon {
  transform: scale(1.1);
}

.icon-animated {
  animation: iconBounce 1s ease-in-out infinite;
}

/* Badge styling */
.nav-badge {
  position: absolute;
  top: -8px;
  right: -8px;
}

:deep(.v-badge__badge) {
  font-size: 0.7rem;
  font-weight: 600;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
}

.badge-pulse :deep(.v-badge__badge) {
  animation: badgePulse 1.5s ease-in-out infinite;
}

.badge-urgent :deep(.v-badge__badge) {
  background: rgb(var(--v-theme-error)) !important;
  color: rgb(var(--v-theme-on-error)) !important;
  animation: badgeUrgent 1s ease-in-out infinite;
}

/* Urgent indicator */
.urgent-indicator {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  background: rgb(var(--v-theme-error));
  border-radius: 50%;
  animation: urgentDot 1s ease-in-out infinite;
  box-shadow: 0 0 0 2px rgb(var(--v-theme-surface));
}

/* Label styling */
.nav-label {
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  opacity: 0.8;
}

.label-active {
  opacity: 1;
  font-weight: 600;
  color: rgb(var(--v-theme-primary)) !important;
}

/* Loading indicator */
.nav-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Quick action hint */
.quick-action-hint {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(var(--v-theme-surface), 0.9);
  color: rgb(var(--v-theme-on-surface));
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.7rem;
  opacity: 0.8;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
  animation: hintFloat 2s ease-in-out infinite;
}

.hint-icon {
  animation: hintSwipe 2s ease-in-out infinite;
}

.hint-text {
  white-space: nowrap;
}

/* Animations */
@keyframes urgentPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0.3);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(var(--v-theme-error), 0);
  }
}

@keyframes iconBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

@keyframes badgePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes badgeUrgent {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0.4);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 4px rgba(var(--v-theme-error), 0);
  }
}

@keyframes urgentDot {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.2);
  }
}

@keyframes hintFloat {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-4px);
  }
}

@keyframes hintSwipe {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

/* Dark theme adjustments */
.v-theme--dark .mobile-bottom-nav {
  background: rgba(var(--v-theme-surface), 0.9) !important;
  border-top-color: rgba(var(--v-theme-outline), 0.2);
}

.v-theme--dark .quick-action-hint {
  background: rgba(var(--v-theme-surface), 0.95);
  border-color: rgba(var(--v-theme-outline), 0.3);
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .nav-label {
    font-size: 0.7rem;
  }
  
  .nav-item {
    min-height: 52px !important;
    margin: 2px 1px;
  }
  
  .quick-action-hint {
    font-size: 0.65rem;
    padding: 4px 8px;
  }
}

@media (max-width: 360px) {
  .nav-label {
    display: none;
  }
  
  .nav-item {
    min-height: 48px !important;
  }
  
  .nav-icon-container {
    margin-bottom: 0;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .mobile-bottom-nav {
    border-top: 2px solid rgb(var(--v-theme-outline));
    background: rgb(var(--v-theme-surface)) !important;
  }
  
  .nav-item-active {
    background: rgb(var(--v-theme-primary)) !important;
    color: rgb(var(--v-theme-on-primary)) !important;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .nav-item,
  .nav-icon,
  .nav-label,
  .mobile-bottom-nav {
    transition: none;
    animation: none;
  }
  
  .nav-item-urgent,
  .icon-animated,
  .badge-pulse :deep(.v-badge__badge),
  .badge-urgent :deep(.v-badge__badge),
  .urgent-indicator,
  .quick-action-hint,
  .hint-icon {
    animation: none;
  }
}

/* Focus and accessibility */
.nav-item:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

/* Safe area adjustments for notched devices */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .mobile-bottom-nav {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style> 