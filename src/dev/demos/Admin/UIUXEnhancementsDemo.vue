<template>
  <v-container
    fluid
    class="ui-demo-page"
  >
    <div class="demo-header">
      <h1 class="demo-title">
        UI/UX Enhancements Demo
      </h1>
      <p class="demo-subtitle">
        Interactive showcase of enhanced components with improved user experience
      </p>
    </div>

    <!-- Enhanced Property Cards Section -->
    <section class="demo-section">
      <h2 class="section-title">
        <v-icon
          icon="mdi-card-bulleted"
          class="mr-2"
        />
        Enhanced Property Cards
      </h2>
      <p class="section-description">
        Improved visual hierarchy, hover interactions, and contextual quick actions.
      </p>
      
      <v-row>
        <v-col
          v-for="property in sampleProperties"
          :key="property.id"
          cols="12"
          md="6"
          lg="4"
        >
          <PropertyCard
            :property="property"
            :recent-bookings-count="Math.floor(Math.random() * 10)"
            :last-cleaned="getRandomDate()"
            @view="handlePropertyView"
            @edit="handlePropertyEdit"
            @quick-booking="handleQuickBooking"
            @duplicate="handlePropertyDuplicate"
            @delete="handlePropertyDelete"
          />
        </v-col>
      </v-row>
    </section>

    <!-- Enhanced Toast Notifications Section -->
    <section class="demo-section">
      <h2 class="section-title">
        <v-icon
          icon="mdi-bell-ring"
          class="mr-2"
        />
        Enhanced Toast Notifications
      </h2>
      <p class="section-description">
        Priority-based styling, interactive actions, and better user feedback.
      </p>
      
      <div class="demo-controls">
        <v-btn
          v-for="toastType in toastTypes"
          :key="toastType.type"
          :color="toastType.color"
          variant="outlined"
          class="ma-2"
          @click="showToast(toastType)"
        >
          <v-icon
            :icon="toastType.icon"
            class="mr-2"
          />
          {{ toastType.label }}
        </v-btn>
      </div>

      <!-- Toast Components Container -->
      <div class="toast-container">
        <EnhancedToast
          v-for="notification in activeNotifications"
          :key="notification.id"
          :notification="notification"
          @close="removeNotification"
          @action-click="handleToastAction"
        />
      </div>
    </section>

    <!-- Skeleton Loaders Section -->
    <section class="demo-section">
      <h2 class="section-title">
        <v-icon
          icon="mdi-loading"
          class="mr-2"
        />
        Enhanced Skeleton Loaders
      </h2>
      <p class="section-description">
        Multiple skeleton patterns with smooth animations and responsive design.
      </p>
      
      <v-row>
        <v-col
          v-for="skeleton in skeletonTypes"
          :key="skeleton.type"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card class="mb-4">
            <v-card-title class="text-h6">
              {{ skeleton.label }}
            </v-card-title>
            <v-card-text>
              <SkeletonLoader
                :type="skeleton.type"
                :variant="selectedSkeletonVariant"
                :animated="skeletonAnimated"
                :show-progress="skeleton.showProgress"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <div class="demo-controls">
        <v-btn-toggle
          v-model="selectedSkeletonVariant"
          mandatory
          class="ma-2"
        >
          <v-btn value="shimmer">
            Shimmer
          </v-btn>
          <v-btn value="wave">
            Wave
          </v-btn>
          <v-btn value="pulse">
            Pulse
          </v-btn>
          <v-btn value="static">
            Static
          </v-btn>
        </v-btn-toggle>
        
        <v-switch
          v-model="skeletonAnimated"
          label="Animated"
          class="ma-2"
        />
      </div>
    </section>

    <!-- Quick Actions FAB Section -->
    <section class="demo-section">
      <h2 class="section-title">
        <v-icon
          icon="mdi-plus-circle"
          class="mr-2"
        />
        Quick Actions FAB
      </h2>
      <p class="section-description">
        Expandable floating action button with contextual quick actions.
      </p>
      
      <div class="fab-demo-area">
        <p class="text-center text-medium-emphasis">
          The floating action button is positioned in the bottom-right corner.
          <br>
          Click it to see the expandable quick actions menu.
        </p>
        
        <QuickActionsFab
          :actions="quickActions"
          :show-pulse="fabPulse"
          main-icon="mdi-plus"
          main-color="primary"
          @action-click="handleQuickAction"
          @menu-toggle="handleFabToggle"
        />
        
        <div class="demo-controls mt-4">
          <v-switch
            v-model="fabPulse"
            label="Pulse Animation"
            class="ma-2"
          />
        </div>
      </div>
    </section>

    <!-- Mobile Bottom Navigation Section -->
    <section class="demo-section">
      <h2 class="section-title">
        <v-icon
          icon="mdi-navigation"
          class="mr-2"
        />
        Mobile Bottom Navigation
      </h2>
      <p class="section-description">
        Enhanced mobile navigation with badges, animations, and role-based items.
      </p>
      
      <div class="mobile-nav-demo">
        <div class="mobile-preview">
          <div class="mobile-content">
            <h3>Mobile Navigation Preview</h3>
            <p>
              Switch between Owner and Admin roles to see different navigation items.
              Navigation items have contextual badges and animations.
            </p>
            
            <v-radio-group
              v-model="selectedRole"
              inline
            >
              <v-radio
                label="Owner"
                value="owner"
              />
              <v-radio
                label="Admin"
                value="admin"
              />
            </v-radio-group>
          </div>
          
          <MobileBottomNav
            :items="mobileNavItems"
            :user-role="selectedRole"
            :auto-hide="false"
            :show-quick-action-hint="showNavHint"
            @navigate="handleMobileNavigation"
            @item-click="handleNavItemClick"
          />
        </div>
        
        <div class="demo-controls mt-4">
          <v-switch
            v-model="showNavHint"
            label="Show Quick Action Hint"
            class="ma-2"
          />
        </div>
      </div>
    </section>

    <!-- Performance Metrics Section -->
    <section class="demo-section">
      <h2 class="section-title">
        <v-icon
          icon="mdi-speedometer"
          class="mr-2"
        />
        UI Performance Metrics
      </h2>
      <p class="section-description">
        Real-time performance monitoring and optimization insights.
      </p>
      
      <v-row>
        <v-col
          cols="12"
          md="3"
        >
          <v-card>
            <v-card-text class="text-center">
              <div class="text-h4 text-primary">
                {{ renderTime }}ms
              </div>
              <div class="text-caption">
                Render Time
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-card>
            <v-card-text class="text-center">
              <div class="text-h4 text-success">
                {{ animationFps }}fps
              </div>
              <div class="text-caption">
                Animation FPS
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-card>
            <v-card-text class="text-center">
              <div class="text-h4 text-info">
                {{ memoryUsage }}MB
              </div>
              <div class="text-caption">
                Memory Usage
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-card>
            <v-card-text class="text-center">
              <div class="text-h4 text-warning">
                {{ interactionScore }}
              </div>
              <div class="text-caption">
                UX Score
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </section>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import PropertyCard from '@/components/dumb/shared/PropertyCard.vue';
import EnhancedToast, { type ToastNotification, type ToastAction } from '@/components/dumb/shared/EnhancedToast.vue';
import SkeletonLoader from '@/components/dumb/shared/SkeletonLoader.vue';
import QuickActionsFab, { type QuickAction } from '@/components/dumb/shared/QuickActionsFab.vue';
import MobileBottomNav, { type NavItem } from '@/components/dumb/shared/MobileBottomNav.vue';
import type { Property } from '@/types';

// Sample data
const sampleProperties = ref<Property[]>([
  {
    id: '1',
    name: 'Luxury Downtown Apartment',
    address: '123 Main Street, Downtown',
    pricing_tier: 'luxury',
    cleaning_duration: 180,
    special_instructions: 'Please use eco-friendly cleaning products only. Pay special attention to hardwood floors.',
    active: true,
    owner_id: 'owner1'
  },
  {
    id: '2',
    name: 'Cozy Studio Loft',
    address: '456 Oak Avenue, Arts District',
    pricing_tier: 'standard',
    cleaning_duration: 90,
    special_instructions: undefined,
    active: true,
    owner_id: 'owner2'
  },
  {
    id: '3',
    name: 'Family Beach House',
    address: '789 Coastal Drive, Beachfront',
    pricing_tier: 'premium',
    cleaning_duration: 240,
    special_instructions: 'Sandy floors require extra attention. Check for beach equipment storage.',
    active: false,
    owner_id: 'owner3'
  }
]);

// Toast notifications
const activeNotifications = ref<ToastNotification[]>([]);
const notificationCounter = ref(0);

const toastTypes = [
  {
    type: 'success' as const,
    label: 'Success',
    color: 'success',
    icon: 'mdi-check-circle'
  },
  {
    type: 'warning' as const,
    label: 'Warning',
    color: 'warning',
    icon: 'mdi-alert'
  },
  {
    type: 'error' as const,
    label: 'Error',
    color: 'error',
    icon: 'mdi-alert-circle'
  },
  {
    type: 'info' as const,
    label: 'Info',
    color: 'info',
    icon: 'mdi-information'
  }
];

// Skeleton loaders
const selectedSkeletonVariant = ref<'wave' | 'pulse' | 'shimmer' | 'static'>('shimmer');
const skeletonAnimated = ref(true);

const skeletonTypes = [
  { type: 'card' as const, label: 'Property Card', showProgress: false },
  { type: 'list-item' as const, label: 'List Item', showProgress: false },
  { type: 'dashboard-widget' as const, label: 'Dashboard Widget', showProgress: true },
  { type: 'calendar-event' as const, label: 'Calendar Event', showProgress: false },
  { type: 'form-field' as const, label: 'Form Field', showProgress: false },
  { type: 'nav-menu' as const, label: 'Navigation Menu', showProgress: false }
];

// Quick Actions FAB
const fabPulse = ref(true);

const quickActions = ref<QuickAction[]>([
  {
    id: 'add-property',
    icon: 'mdi-home-plus',
    tooltip: 'Add New Property',
    color: 'primary',
    priority: 4,
    action: () => console.log('Add property')
  },
  {
    id: 'quick-booking',
    icon: 'mdi-calendar-plus',
    tooltip: 'Quick Booking',
    color: 'success',
    priority: 3,
    action: () => console.log('Quick booking')
  },
  {
    id: 'urgent-alert',
    icon: 'mdi-alert',
    tooltip: 'Urgent Alerts',
    color: 'error',
    priority: 2,
    condition: () => true,
    action: () => console.log('View alerts')
  },
  {
    id: 'settings',
    icon: 'mdi-cog',
    tooltip: 'Settings',
    color: 'secondary',
    priority: 1,
    action: () => console.log('Open settings')
  }
]);

// Mobile Bottom Navigation
const selectedRole = ref<'owner' | 'admin'>('owner');
const showNavHint = ref(true);

const mobileNavItems = ref<NavItem[]>([
  {
    id: 'dashboard',
    value: 'dashboard',
    label: 'Dashboard',
    icon: 'mdi-view-dashboard',
    route: '/dashboard',
    role: 'shared'
  },
  {
    id: 'properties',
    value: 'properties',
    label: 'Properties',
    icon: 'mdi-home-group',
    route: '/properties',
    badge: { count: 3, color: 'primary' },
    role: 'shared'
  },
  {
    id: 'bookings',
    value: 'bookings',
    label: 'Bookings',
    icon: 'mdi-calendar-check',
    route: '/bookings',
    badge: { count: 12, color: 'success', pulse: true },
    role: 'shared'
  },
  {
    id: 'cleaners',
    value: 'cleaners',
    label: 'Cleaners',
    icon: 'mdi-account-group',
    route: '/cleaners',
    badge: { count: 2, color: 'warning', urgent: true },
    role: 'admin'
  },
  {
    id: 'analytics',
    value: 'analytics',
    label: 'Analytics',
    icon: 'mdi-chart-line',
    route: '/analytics',
    role: 'admin'
  },
  {
    id: 'profile',
    value: 'profile',
    label: 'Profile',
    icon: 'mdi-account',
    route: '/profile',
    role: 'shared'
  }
]);

// Performance metrics
const renderTime = ref(15);
const animationFps = ref(60);
const memoryUsage = ref(24);
const interactionScore = ref(95);

// Methods
const getRandomDate = () => {
  const start = new Date(2024, 0, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const showToast = (toastType: typeof toastTypes[0]) => {
  const id = `toast-${++notificationCounter.value}`;
  
  const sampleActions: ToastAction[] = [
    {
      id: 'view',
      label: 'View',
      icon: 'mdi-eye',
      action: () => console.log('View action')
    },
    {
      id: 'dismiss',
      label: 'Dismiss',
      variant: 'outlined',
      action: () => removeNotification(id)
    }
  ];
  
  const notification: ToastNotification = {
    id,
    type: toastType.type,
    title: `${toastType.label} Notification`,
    message: `This is a sample ${toastType.type} notification with enhanced styling and interactions.`,
    priority: toastType.type === 'error' ? 'critical' : 'normal',
    actions: toastType.type !== 'info' ? sampleActions : undefined,
    details: toastType.type === 'error' ? 'Additional error details can be shown here for debugging purposes.' : undefined,
    showProgress: toastType.type === 'info',
    progressValue: toastType.type === 'info' ? 65 : undefined
  };
  
  activeNotifications.value.push(notification);
};

const removeNotification = (id: string) => {
  const index = activeNotifications.value.findIndex(n => n.id === id);
  if (index > -1) {
    activeNotifications.value.splice(index, 1);
  }
};

const handleToastAction = (action: ToastAction, notification: ToastNotification) => {
  console.log('Toast action:', action.id, 'for notification:', notification.id);
  if (action.action) {
    action.action();
  }
};

// Property card handlers
const handlePropertyView = (id: string) => {
  console.log('View property:', id);
};

const handlePropertyEdit = (id: string) => {
  console.log('Edit property:', id);
};

const handleQuickBooking = (id: string) => {
  console.log('Quick booking for property:', id);
  showToast(toastTypes[0]); // Show success toast
};

const handlePropertyDuplicate = (id: string) => {
  console.log('Duplicate property:', id);
};

const handlePropertyDelete = (id: string) => {
  console.log('Delete property:', id);
  showToast(toastTypes[2]); // Show error toast
};

// FAB handlers
const handleQuickAction = (action: QuickAction) => {
  console.log('Quick action:', action.id);
  if (action.action) {
    action.action();
  }
};

const handleFabToggle = (isExpanded: boolean) => {
  console.log('FAB expanded:', isExpanded);
};

// Mobile nav handlers
const handleMobileNavigation = (item: NavItem) => {
  console.log('Navigate to:', item.route);
};

const handleNavItemClick = (item: NavItem) => {
  console.log('Nav item clicked:', item.id);
};

// Performance monitoring
const updatePerformanceMetrics = () => {
  renderTime.value = Math.floor(Math.random() * 10) + 10;
  animationFps.value = Math.floor(Math.random() * 5) + 58;
  memoryUsage.value = Math.floor(Math.random() * 10) + 20;
  interactionScore.value = Math.floor(Math.random() * 10) + 90;
};

let performanceInterval: number;

onMounted(() => {
  performanceInterval = window.setInterval(updatePerformanceMetrics, 2000);
});

onUnmounted(() => {
  if (performanceInterval) {
    window.clearInterval(performanceInterval);
  }
});
</script>

<style scoped>
.ui-demo-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 48px;
}

.demo-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 16px;
}

.demo-subtitle {
  font-size: 1.2rem;
  color: rgb(var(--v-theme-on-surface-variant));
  max-width: 600px;
  margin: 0 auto;
}

.demo-section {
  margin-bottom: 64px;
  padding: 32px;
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 16px;
  border: 1px solid rgba(var(--v-theme-outline), 0.1);
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.section-description {
  font-size: 1rem;
  color: rgb(var(--v-theme-on-surface-variant));
  margin-bottom: 32px;
  line-height: 1.6;
}

.demo-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin: 24px 0;
  padding: 16px;
  background: rgba(var(--v-theme-surface), 0.5);
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-outline), 0.08);
}

.toast-container {
  position: relative;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.fab-demo-area {
  position: relative;
  min-height: 300px;
  background: rgba(var(--v-theme-surface), 0.3);
  border-radius: 12px;
  border: 2px dashed rgba(var(--v-theme-outline), 0.2);
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.mobile-nav-demo {
  background: rgba(var(--v-theme-surface), 0.3);
  border-radius: 12px;
  padding: 24px;
}

.mobile-preview {
  position: relative;
  max-width: 400px;
  margin: 0 auto;
  background: rgb(var(--v-theme-surface));
  border-radius: 20px;
  border: 8px solid rgba(var(--v-theme-outline), 0.2);
  overflow: hidden;
  min-height: 500px;
}

.mobile-content {
  padding: 32px 24px 100px;
  text-align: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .ui-demo-page {
    padding: 16px;
  }
  
  .demo-title {
    font-size: 2rem;
  }
  
  .demo-section {
    padding: 16px;
    margin-bottom: 32px;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .demo-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .fab-demo-area {
    min-height: 200px;
    padding: 16px;
  }
}

/* Dark theme adjustments */
.v-theme--dark .demo-section {
  background: rgba(var(--v-theme-surface-variant), 0.2);
  border-color: rgba(var(--v-theme-outline), 0.2);
}

.v-theme--dark .demo-controls {
  background: rgba(var(--v-theme-surface), 0.3);
  border-color: rgba(var(--v-theme-outline), 0.15);
}

.v-theme--dark .fab-demo-area {
  background: rgba(var(--v-theme-surface), 0.2);
}

.v-theme--dark .mobile-nav-demo {
  background: rgba(var(--v-theme-surface), 0.2);
}

/* Animation for performance metrics */
.text-h4 {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style> 