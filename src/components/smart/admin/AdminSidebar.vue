<template>
  <v-navigation-drawer
    v-model="sidebarOpen"
    class="admin-sidebar"
    :width="SIDEBAR_WIDTH"
    elevation="4"
    color="white"
    :temporary="mobile"
    location="left"
    :permanent="!mobile"
  >
    <!-- Main Content Wrapper -->
    <div class="sidebar-content-wrapper">
      <!-- Brand Overlay -->
      <div 
        v-show="showBrandOverlay"
        class="claro-brand-overlay"
      >
        <div class="claro-brand-section">
          <div class="claro-brand-icon">
            <v-btn
              icon
              color="primary"
              elevation="8"
              size="x-large"
              class="prominent-icon"
            >
              <v-icon
                color="white"
                size="32"
              >
                mdi-shield-crown
              </v-icon>
            </v-btn>
          </div>
          <div class="claro-brand-info">
            <div class="claro-brand-title">
              Claro Admin
            </div>
            <div class="claro-brand-subtitle">
              Business Management
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Section -->
      <div class="nav-section sidebar-content-spacing">
        <div class="section-header">
          Administration
        </div>
        
        <v-list
          class="nav-list"
          density="compact"
        >
          <v-list-item
            class="nav-item"
            :class="{ 'active-nav-item': $route.path === '/admin' }"
            prepend-icon="mdi-view-dashboard"
            title="Dashboard"
            @click="navigateTo('/admin')"
          >
            <template
              v-if="$route.path === '/admin'"
              #append
            >
              <v-icon
                size="16"
                color="white"
              >
                mdi-chevron-right
              </v-icon>
            </template>
          </v-list-item>
          
          <v-list-item
            class="nav-item"
            :class="{ 'active-nav-item': $route.path === '/admin/schedule' }"
            prepend-icon="mdi-calendar-month"
            title="Master Schedule"
            @click="navigateTo('/admin/schedule')"
          >
            <template
              v-if="$route.path === '/admin/schedule'"
              #append
            >
              <v-icon
                size="16"
                color="white"
              >
                mdi-chevron-right
              </v-icon>
            </template>
          </v-list-item>
          
          <v-list-item
            class="nav-item"
            :class="{ 'active-nav-item': $route.path === '/admin/bookings' }"
            prepend-icon="mdi-calendar-check"
            title="All Bookings"
            @click="navigateTo('/admin/bookings')"
          >
            <template
              v-if="$route.path === '/admin/bookings'"
              #append
            >
              <v-icon
                size="16"
                color="white"
              >
                mdi-chevron-right
              </v-icon>
            </template>
          </v-list-item>
          
          <v-list-item
            class="nav-item"
            :class="{ 'active-nav-item': $route.path === '/admin/properties' }"
            prepend-icon="mdi-home-city"
            title="Properties"
            @click="navigateTo('/admin/properties')"
          >
            <template
              v-if="$route.path === '/admin/properties'"
              #append
            >
              <v-icon
                size="16"
                color="white"
              >
                mdi-chevron-right
              </v-icon>
            </template>
          </v-list-item>
          
          <v-list-item
            class="nav-item"
            :class="{ 'active-nav-item': $route.path === '/admin/cleaners' }"
            prepend-icon="mdi-account-hard-hat"
            title="Cleaners"
            @click="navigateTo('/admin/cleaners')"
          >
            <template
              v-if="$route.path === '/admin/cleaners'"
              #append
            >
              <v-icon
                size="16"
                color="white"
              >
                mdi-chevron-right
              </v-icon>
            </template>
          </v-list-item>
          
          <v-list-item
            class="nav-item"
            :class="{ 'active-nav-item': $route.path === '/admin/property-owners' }"
            prepend-icon="mdi-account-group"
            title="Property Owners"
            @click="navigateTo('/admin/property-owners')"
          >
            <template
              v-if="$route.path === '/admin/property-owners'"
              #append
            >
              <v-icon
                size="16"
                color="white"
              >
                mdi-chevron-right
              </v-icon>
            </template>
          </v-list-item>
          
          <v-list-item
            class="nav-item"
            :class="{ 'active-nav-item': $route.path === '/admin/users' }"
            prepend-icon="mdi-account-cog"
            title="System Users"
            @click="navigateTo('/admin/users')"
          >
            <template
              v-if="$route.path === '/admin/users'"
              #append
            >
              <v-icon
                size="16"
                color="white"
              >
                mdi-chevron-right
              </v-icon>
            </template>
          </v-list-item>
          
          <v-list-item
            class="nav-item"
            :class="{ 'active-nav-item': $route.path === '/admin/reports' }"
            prepend-icon="mdi-chart-line"
            title="Reports"
            @click="navigateTo('/admin/reports')"
          >
            <template
              v-if="$route.path === '/admin/reports'"
              #append
            >
              <v-icon
                size="16"
                color="white"
              >
                mdi-chevron-right
              </v-icon>
            </template>
          </v-list-item>
        </v-list>
      </div>

      <!-- Business Metrics Section -->
      <div class="metrics-section">
        <div class="section-header">
          <span>Business Overview</span>
          <v-btn
            icon="mdi-refresh"
            size="small"
            variant="text"
            color="primary"
            @click="refreshMetrics"
          />
        </div>
        
        <div class="metrics-cards">
          <v-card
            class="metric-card"
            variant="outlined"
          >
            <v-card-text class="text-center pa-3">
              <div class="metric-value text-primary">
                {{ totalProperties }}
              </div>
              <div class="metric-label">
                Properties
              </div>
            </v-card-text>
          </v-card>
          
          <v-card
            class="metric-card"
            variant="outlined"
          >
            <v-card-text class="text-center pa-3">
              <div class="metric-value text-success">
                {{ activeCleaningsToday }}
              </div>
              <div class="metric-label">
                Active Today
              </div>
            </v-card-text>
          </v-card>
          
          <v-card
            class="metric-card"
            variant="outlined"
          >
            <v-card-text class="text-center pa-3">
              <div class="metric-value text-warning">
                {{ urgentTurnsCount }}
              </div>
              <div class="metric-label">
                Urgent Turns
              </div>
            </v-card-text>
          </v-card>
          
          <v-card
            class="metric-card"
            variant="outlined"
          >
            <v-card-text class="text-center pa-3">
              <div class="metric-value text-info">
                {{ availableCleanersCount }}
              </div>
              <div class="metric-label">
                Available
              </div>
            </v-card-text>
          </v-card>
        </div>
      </div>

      <!-- Urgent Alerts Section -->
      <div
        v-if="urgentBookings.length > 0"
        class="alerts-section"
      >
        <div class="section-header">
          <span>Urgent Alerts</span>
          <v-chip
            size="small"
            color="error"
            variant="flat"
          >
            {{ urgentBookings.length }}
          </v-chip>
        </div>
        
        <v-list
          class="alert-list"
          density="compact"
        >
          <v-list-item
            v-for="booking in urgentBookings.slice(0, 3)"
            :key="booking.id"
            class="alert-item"
            @click="viewBooking(booking)"
          >
            <template #prepend>
              <v-icon 
                color="error"
                size="16"
              >
                mdi-alert-circle
              </v-icon>
            </template>
            
            <div class="alert-content">
              <div class="alert-title">
                {{ getPropertyName(booking.property_id) }}
              </div>
              <div class="alert-subtitle">
                Turn cleaning needed
              </div>
            </div>
            
            <template #append>
              <v-btn
                icon="mdi-chevron-right"
                size="small"
                variant="text"
              />
            </template>
          </v-list-item>
          
          <v-list-item
            v-if="urgentBookings.length > 3"
            class="view-all-item"
            @click="navigateTo('/admin/bookings?filter=urgent')"
          >
            <template #prepend>
              <v-icon 
                color="primary"
                size="16"
              >
                mdi-eye
              </v-icon>
            </template>
            
            <div class="alert-content">
              <div class="alert-title">
                View all urgent items ({{ urgentBookings.length }})
              </div>
            </div>
          </v-list-item>
        </v-list>
      </div>

      <!-- Quick Actions Section -->
      <div class="actions-section">
        <div class="section-header">
          Quick Actions
        </div>
        
        <v-list
          class="actions-list"
          density="compact"
        >
          <v-list-item
            class="action-item"
            prepend-icon="mdi-calendar-plus"
            title="New Booking"
            @click="emit('createBooking')"
          />
          
          <v-list-item
            class="action-item"
            prepend-icon="mdi-home-plus"
            title="Add Property"
            @click="emit('createProperty')"
          />
          
          <v-list-item
            class="action-item"
            prepend-icon="mdi-account-plus"
            title="Add Cleaner"
            @click="navigateTo('/admin/cleaners/create')"
          />
          
          <v-list-item
            class="action-item"
            prepend-icon="mdi-file-chart"
            title="Generate Report"
            @click="emit('generateReports')"
          />
          
          <v-list-item
            class="action-item"
            prepend-icon="mdi-cog"
            title="System Settings"
            @click="navigateTo('/admin/settings')"
          />
        </v-list>
      </div>
    </div>

    <!-- User Info Section at Bottom -->
    <div class="user-info-section">
      <v-divider class="mb-3" />
      <div class="user-info-card">
        <v-avatar
          color="primary"
          size="32"
          class="user-avatar"
        >
          <v-icon
            color="white"
            size="18"
          >
            mdi-shield-account
          </v-icon>
        </v-avatar>
        
        <div class="user-details">
          <div class="user-name">
            {{ authStore.user?.name || 'Admin' }}
          </div>
          <div class="user-email">
            {{ authStore.user?.email || 'No email' }}
          </div>
        </div>
        
        <v-menu offset-y>
          <template #activator="{ props: menuProps }">
            <v-btn
              v-bind="menuProps"
              icon
              size="small"
              variant="text"
              class="user-menu-btn"
            >
              <v-icon size="16">
                mdi-dots-vertical
              </v-icon>
            </v-btn>
          </template>
          
          <v-list density="compact">
            <v-list-item
              prepend-icon="mdi-account"
              title="Profile"
              @click="navigateTo('/admin/profile')"
            />
            <v-list-item
              prepend-icon="mdi-cog"
              title="Settings"
              @click="navigateTo('/admin/settings')"
            />
            <v-divider />
            <v-list-item
              prepend-icon="mdi-logout"
              title="Sign Out"
              :disabled="signingOut"
              @click="handleSignOut"
            />
          </v-list>
        </v-menu>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';
import { useAuthStore } from '@/stores/auth';
import type { Booking, Property } from '@/types';

// Constants for consistent sizing
const SIDEBAR_WIDTH = 280;
const BRAND_HEIGHT_DESKTOP = 200;
const BRAND_HEIGHT_MOBILE = 100;
const signingOut = ref(false);

// Define props matching HomeAdmin expectations
interface Props {
  modelValue?: boolean;
  bookings?: Booking[];
  properties?: Property[];
  totalProperties?: number;
  activeCleaningsToday?: number;
  urgentTurnsCount?: number;
  loading?: boolean;
  currentView?: string;
  currentDate?: Date;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  bookings: () => [],
  properties: () => [],
  totalProperties: 0,
  activeCleaningsToday: 0,
  urgentTurnsCount: 0,
  loading: false,
  currentView: 'month',
  currentDate: () => new Date()
});

// Define emits matching HomeAdmin expectations
interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'navigateToBooking', bookingId: string): void;
  (e: 'navigateToDate', date: Date): void;
  (e: 'filterByProperty', propertyId: string | null): void;
  (e: 'createBooking'): void;
  (e: 'createProperty'): void;
  (e: 'assignCleaner', data: { bookingId: string, cleanerId?: string }): void;
  (e: 'generateReports'): void;
  (e: 'manageSystem'): void;
  (e: 'emergencyResponse'): void;
}

const emit = defineEmits<Emits>();

// Composables
const router = useRouter();
const { mobile } = useDisplay();
const authStore = useAuthStore();

// v-model support
const sidebarOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
});

// Brand overlay display logic
const showBrandOverlay = computed(() => {
  return !mobile.value || sidebarOpen.value;
});

// Computed metrics from props
const availableCleanersCount = computed(() => {
  // TODO: Calculate from actual cleaner data
  return 5; // Placeholder
});

// Urgent bookings for alerts
const urgentBookings = computed(() => {
  return props.bookings.filter(booking => 
    booking.booking_type === 'turn' && 
    booking.status === 'pending'
  );
});

// Navigation helper
const navigateTo = (path: string) => {
  router.push(path);
};

// Sign out handler
const handleSignOut = async () => {
  if (signingOut.value) return; // Prevent double-clicks
  signingOut.value = true;
  try {
    const success = await authStore.logout();
    if (success) {
      // Small delay to ensure auth state is fully cleared
      await new Promise(resolve => setTimeout(resolve, 100));
      await router.push('/auth/login');
    } else {
      console.error('Logout failed');
    }
  } catch (error) {
    console.error('Error during logout:', error);
    // Force redirect even if logout had issues
    await router.push('/auth/login');
  } finally {
    signingOut.value = false;
  }
};

// Booking actions
const viewBooking = (booking: Booking) => {
  emit('navigateToBooking', booking.id);
};

// Get property name helper
const getPropertyName = (propertyId: string): string => {
  const property = props.properties.find(p => p.id === propertyId);
  return property?.name || 'Unknown Property';
};

// Refresh metrics
const refreshMetrics = () => {
  // TODO: Implement metrics refresh
  console.log('Refreshing metrics...');
};
</script>

<style scoped>
/* Navigation Drawer Z-Index Override */
.admin-sidebar {
  top: 0 !important;
  height: 100vh !important;
  background: #f8f9fa !important;
}

/* Main Content Wrapper */
.sidebar-content-wrapper {
  padding-bottom: 120px;
  min-height: 100vh;
  height: 100vh;
}

/* Sidebar Content Spacing */
.sidebar-content-spacing {
  margin-top: v-bind('BRAND_HEIGHT_DESKTOP + "px"');
}

/* Section Headers */
.section-header {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  padding: 16px 20px 8px 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Navigation Section */
.nav-section {
  margin-bottom: 16px;
}

.nav-list {
  padding: 0 12px;
}

.nav-item {
  margin-bottom: 4px;
  border-radius: 8px !important;
  color: rgb(var(--v-theme-success)) !important;
  font-weight: 500 !important;
}

.nav-item:hover {
  background: #f3f4f6 !important;
}

.nav-item.active-nav-item {
  background: rgb(var(--v-theme-primary)) !important;
  color: white !important;
}

.nav-item.active-nav-item :deep(.v-list-item__prepend .v-icon) {
  color: white !important;
}

.nav-item.active-nav-item :deep(.v-list-item-title) {
  color: white !important;
}

/* Metrics Section */
.metrics-section {
  margin: 16px 0;
}

.metrics-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 0 16px;
}

.metric-card {
  min-height: 70px;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.metric-label {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-info));
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 4px;
}

/* Alerts Section */
.alerts-section {
  margin: 16px 0;
}

.alert-list {
  padding: 0 12px;
}

.alert-item {
  margin-bottom: 4px;
  border-radius: 6px !important;
  border-left: 3px solid rgb(var(--v-theme-error));
  background: rgba(var(--v-theme-error), 0.05) !important;
  cursor: pointer;
}

.alert-item:hover {
  background: rgba(var(--v-theme-error), 0.1) !important;
}

.view-all-item {
  margin-top: 8px;
  border-radius: 6px !important;
  color: rgb(var(--v-theme-primary)) !important;
  cursor: pointer;
}

.view-all-item:hover {
  background: rgba(var(--v-theme-primary), 0.05) !important;
}

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.alert-subtitle {
  font-size: 0.7rem;
  color: rgb(var(--v-theme-error));
  line-height: 1.1;
  margin-top: 2px;
}

/* Actions Section */
.actions-section {
  margin-top: 16px;
}

.actions-list {
  padding: 0 12px;
}

.action-item {
  margin-bottom: 4px;
  border-radius: 8px !important;
  color: rgb(var(--v-theme-success)) !important;
  font-weight: 500 !important;
}

.action-item:hover {
  background: #f3f4f6 !important;
}

/* Icon styling */
:deep(.v-list-item__prepend .v-icon) {
  color: rgb(var(--v-theme-info));
  opacity: 1;
}

.nav-item:hover :deep(.v-list-item__prepend .v-icon) {
  color: rgb(var(--v-theme-success));
}

.action-item:hover :deep(.v-list-item__prepend .v-icon) {
  color: rgb(var(--v-theme-success));
}

/* List item title styling */
:deep(.v-list-item-title) {
  font-size: 0.95rem !important;
  font-weight: 500 !important;
}

/* User Info Section */
.user-info-section {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px 20px 20px;
  background: white;
  border-top: 1px solid #e5e7eb;
}

.user-info-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
}

.user-avatar {
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-email {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-info));
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-menu-btn {
  flex-shrink: 0;
  opacity: 0.7;
}

.user-menu-btn:hover {
  opacity: 1;
  background: rgba(var(--v-theme-primary), 0.1);
}

/* Responsive adjustments */
@media (max-width: 959px) {
  .sidebar-content-spacing {
    margin-top: v-bind('BRAND_HEIGHT_MOBILE + "px"');
  }
  
  .metrics-cards {
    grid-template-columns: 1fr;
  }
}

/* Brand Overlay */
.claro-brand-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: v-bind('SIDEBAR_WIDTH + "px"');
  height: v-bind('BRAND_HEIGHT_DESKTOP + "px"');
  background: linear-gradient(135deg, rgb(var(--v-theme-secondary)) 0%, rgba(var(--v-theme-secondary), 0.9) 100%);
  display: flex;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  border-bottom: 2px solid rgba(var(--v-theme-primary), 0.3);
}

.claro-brand-section {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.claro-brand-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgba(var(--v-theme-primary), 0.8) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
}

.prominent-icon {
  width: 64px !important;
  height: 64px !important;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgba(var(--v-theme-primary), 0.9) 100%) !important;
  box-shadow: 0 6px 16px rgba(var(--v-theme-primary), 0.4) !important;
}

.claro-brand-info {
  flex: 1;
}

.claro-brand-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: rgb(var(--v-theme-primary));
  line-height: 1.1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
}

.claro-brand-subtitle {
  font-size: 1rem;
  color: rgb(var(--v-theme-info));
  line-height: 1.2;
  font-weight: 500;
  margin-top: 4px;
  opacity: 0.9;
}

/* Responsive Brand Overlay */
@media (max-width: 959px) {
  .claro-brand-overlay {
    height: v-bind('BRAND_HEIGHT_MOBILE + "px"');
    padding: 0 16px;
  }
  
  .claro-brand-icon {
    width: 48px;
    height: 48px;
  }
  
  .prominent-icon {
    width: 48px !important;
    height: 48px !important;
  }
  
  .claro-brand-title {
    font-size: 1.4rem !important;
    font-weight: 700;
  }
  
  .claro-brand-subtitle {
    font-size: 0.85rem !important;
  }
}
</style>

<!-- Unscoped styles for z-index overrides -->
<style>
/* Global z-index overrides for admin navigation drawer */
.v-navigation-drawer.admin-sidebar {
  height: 100vh !important;
  top: 0 !important;
}

.v-navigation-drawer--temporary {
  height: 100vh !important;
  top: 0 !important;
}

.v-navigation-drawer--temporary .v-navigation-drawer__content {
  height: 100vh !important;
}

.v-overlay--contained .v-overlay__scrim {
  background-color: rgba(0, 0, 0, 0.6) !important;
}

.v-overlay__scrim {
  background-color: rgba(0, 0, 0, 0.6) !important;
}

/* Enhanced scrim visibility for admin sidebar */
.v-navigation-drawer--temporary + .v-overlay .v-overlay__scrim {
  background-color: rgba(0, 0, 0, 0.65) !important;
  backdrop-filter: blur(2px);
}
</style>