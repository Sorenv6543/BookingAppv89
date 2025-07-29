<template>
  <v-navigation-drawer
    v-model="sidebarOpen"
    class="owner-sidebar"
    :width="SIDEBAR_WIDTH"
    elevation="4"
    color="white"
    :temporary="mobile"
    location="left"
    :permanent="!mobile"
  >
    <!-- Main Content Wrapper -->
    <div class="sidebar-content-wrapper">
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
                mdi-calendar
              </v-icon>
            </v-btn>
          </div>
          <div class="claro-brand-info">
            <div class="claro-brand-title">
              Claro
            </div>
            <div class="claro-brand-subtitle">
              Property Scheduling
            </div>
          </div>
        </div>
      </div>
      <!-- Navigation Section -->
      <div class="nav-section sidebar-content-spacing">
        <div class="section-header">
          Navigation
        </div>
      
        <v-list
          class="nav-list"
          density="compact"
        >
          <v-list-item
            class="nav-item"
            prepend-icon="mdi-home"
            title="Home"
            @click="navigateTo('/owner/dashboard')"
          />
        
          <v-list-item
            class="nav-item active-nav-item"
            prepend-icon="mdi-calendar"
            title="Calendar"
            @click="navigateTo('/owner/calendar')"
          >
            <template #append>
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
            prepend-icon="mdi-calendar-check"
            title="Schedule"
            @click="navigateTo('/owner/bookings')"
          />
        
          <v-list-item
            class="nav-item"
            prepend-icon="mdi-home-group"
            title="Properties"
            @click="navigateTo('/owner/properties')"
          />
        
          <v-list-item
            class="nav-item"
            prepend-icon="mdi-clock"
            title="Recent"
            @click="navigateTo('/owner/recent')"
          />
        </v-list>
      </div>

      <!-- Properties Section -->
      <div class="properties-section">
        <div class="section-header">
          <span>Properties</span>
          <v-btn
            icon="mdi-plus"
            size="small"
            variant="text"
            color="primary"
            @click="openCreatePropertyModal"
          />
        </div>
      
        <v-list
          class="properties-list"
          density="compact"
        >
          <v-list-item
            v-for="property in properties"
            :key="property.id"
            class="property-item compact-property-item"
            :class="{ selected: selectedPropertyId === property.id }"
            @click="selectProperty(property)"
          >
            <template #prepend>
              <v-icon 
                :color="selectedPropertyId === property.id ? 'primary' : 'info'"
                size="16"
              >
                mdi-home
              </v-icon>
            </template>
          
            <div class="property-content">
              <div class="property-title">
                {{ property.name }}
              </div>
              <div class="property-subtitle">
                {{ property.address }}
              </div>
            </div>
          
            <template #append>
              <v-menu>
                <template #activator="{ props: activatorProps }">
                  <v-btn
                    v-bind="activatorProps"
                    icon="mdi-dots-vertical"
                    size="x-small"
                    variant="text"
                    @click.stop
                  />
                </template>
              
                <v-list density="compact">
                  <v-list-item
                    prepend-icon="mdi-pencil"
                    title="Edit"
                    @click="editProperty(property)"
                  />
                  <v-list-item
                    prepend-icon="mdi-eye"
                    title="View Details"
                    @click="viewProperty(property)"
                  />
                  <v-divider />
                  <v-list-item
                    prepend-icon="mdi-delete"
                    title="Delete"
                    @click="deleteProperty(property)"
                  />
                </v-list>
              </v-menu>
            </template>
          </v-list-item>
        
          <!-- No Properties State -->
          <div
            v-if="properties.length === 0"
            class="no-properties"
          >
            <v-icon
              color="grey"
              size="48"
            >
              mdi-home-plus
            </v-icon>
            <p class="text-body-2 text-grey mt-2">
              No properties yet
            </p>
            <v-btn
              size="small"
              color="primary"
              variant="outlined"
              @click="openCreatePropertyModal"
            >
              Add Property
            </v-btn>
          </div>
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
            prepend-icon="mdi-plus"
            title="New Event"
            @click="emit('createBooking')"
          />
        
          <v-list-item
            class="action-item"
            prepend-icon="mdi-cog"
            title="Settings"
            @click="navigateTo('/owner/settings')"
          />
        
          <v-list-item
            class="action-item"
            prepend-icon="mdi-account"
            title="Profile"
            @click="navigateTo('/owner/profile')"
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
            mdi-account
          </v-icon>
        </v-avatar>
        
        <div class="user-details">
          <div class="user-name">
            {{ authStore.user?.name || 'User' }}
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
              @click="navigateTo('/owner/profile')"
            />
            <v-list-item
              prepend-icon="mdi-cog"
              title="Settings"
              @click="navigateTo('/owner/settings')"
            />
            <v-divider />
            <v-list-item
              prepend-icon="mdi-logout"
              title="Sign Out"
              @click="handleSignOut"
            />
          </v-list>
        </v-menu>
      </div>
    </div>

    <!-- Property Modal -->
    <PropertyModal
      :open="showPropertyModal"
      :mode="propertyModalMode"
      :property="selectedPropertyForEdit"
      @close="closePropertyModal"
      @save="handlePropertySave"
      @delete="handlePropertyDelete"
    />
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';
import { useAuthStore } from '@/stores/auth';
import { usePropertyStore } from '@/stores/property';
import PropertyModal from '@/components/dumb/PropertyModal.vue';
import type { Property, PropertyFormData, PricingTier } from '@/types';

// Constants for consistent sizing
const SIDEBAR_WIDTH = 280;
const BRAND_HEIGHT_DESKTOP = 200;
const BRAND_HEIGHT_MOBILE = 100;

// Define props
interface Props {
  modelValue?: boolean;
  temporary?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  temporary: false
});

// Define emits
interface Emits {
  (e: 'navigateToBooking', bookingId: string): void;
  (e: 'navigateToDate', date: Date): void;
  (e: 'filterByProperty', propertyId: string | null): void;
  (e: 'createBooking'): void;
  (e: 'createProperty'): void;
  (e: 'editProperty', property: Property): void;
  (e: 'viewProperty', property: Property): void;
  (e: 'update:modelValue', value: boolean): void;
}

const emit = defineEmits<Emits>();

// Composables
const router = useRouter();
const { mobile } = useDisplay();
const authStore = useAuthStore();
const propertyStore = usePropertyStore();

// Local state
const selectedPropertyId = ref<string | null>(null);
const showPropertyModal = ref(false);
const propertyModalMode = ref<'create' | 'edit'>('create');
const selectedPropertyForEdit = ref<Property | undefined>(undefined);

// v-model support
const sidebarOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
});

// Improved brand overlay display logic
const showBrandOverlay = computed(() => {
  // Always show on desktop, show on mobile only when sidebar is open
  return !mobile.value || sidebarOpen.value;
});

// Properties computed - filter by current user
const properties = computed(() => {
  const currentUserId = authStore.user?.id;
  if (!currentUserId) return [];
  
  return propertyStore.propertiesArray.filter(
    property => property.owner_id === currentUserId
  );
});

// Navigation helper
const navigateTo = (path: string) => {
  router.push(path);
};

// Sign out handler
const handleSignOut = async () => {
  const success = await authStore.logout();
  if (success) {
    router.push('/auth/login');
  }
};

// Property management functions
const selectProperty = (property: Property) => {
  selectedPropertyId.value = property.id;
  emit('filterByProperty', property.id);
};

const editProperty = (property: Property) => {
  openEditPropertyModal(property);
};

const viewProperty = (property: Property) => {
  // Navigate to property view page
  navigateTo(`/owner/properties/${property.id}`);
};

// Property modal functions
const openCreatePropertyModal = () => {
  propertyModalMode.value = 'create';
  selectedPropertyForEdit.value = undefined;
  showPropertyModal.value = true;
};

const openEditPropertyModal = (property: Property) => {
  propertyModalMode.value = 'edit';
  selectedPropertyForEdit.value = property;
  showPropertyModal.value = true;
};

const closePropertyModal = () => {
  showPropertyModal.value = false;
  selectedPropertyForEdit.value = undefined;
};

const handlePropertySave = async (propertyData: PropertyFormData) => {
  try {
    if (propertyModalMode.value === 'create') {
      // Transform PropertyFormData to Property for creation
      const newProperty: Property = {
        id: crypto.randomUUID(),
        owner_id: authStore.user?.id || '',
        name: propertyData.name as string,
        address: propertyData.address as string,
        cleaning_duration: propertyData.cleaning_duration as number,
        pricing_tier: propertyData.pricing_tier as PricingTier,
        active: propertyData.active as boolean,
        bedrooms: propertyData.bedrooms as number | undefined,
        bathrooms: propertyData.bathrooms as number | undefined,
        square_feet: propertyData.square_feet as number | undefined,
        property_type: propertyData.property_type as 'apartment' | 'house' | 'condo' | 'townhouse' | undefined,
        special_instructions: propertyData.special_instructions as string | undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      await propertyStore.addProperty(newProperty);
    } else if (propertyModalMode.value === 'edit' && selectedPropertyForEdit.value) {
      await propertyStore.updateProperty(selectedPropertyForEdit.value.id, propertyData);
    }
    closePropertyModal();
  } catch (error) {
    console.error('Failed to save property:', error);
    // TODO: Show error toast/snackbar
  }
};

const handlePropertyDelete = async (propertyId: string) => {
  try {
    await propertyStore.removeProperty(propertyId);
    // Clear selection if deleted property was selected
    if (selectedPropertyId.value === propertyId) {
      selectedPropertyId.value = null;
      emit('filterByProperty', null);
    }
    closePropertyModal();
  } catch (error) {
    console.error('Failed to delete property:', error);
    // TODO: Show error toast/snackbar
  }
};

const deleteProperty = async (property: Property) => {
  if (confirm(`Are you sure you want to delete "${property.name}"?`)) {
    try {
      await propertyStore.removeProperty(property.id);
      // Clear selection if deleted property was selected
      if (selectedPropertyId.value === property.id) {
        selectedPropertyId.value = null;
        emit('filterByProperty', null);
      }
    } catch (error) {
      console.error('Failed to delete property:', error);
      // TODO: Show error toast/snackbar
    }
  }
};
</script>

<style scoped>
/* Navigation Drawer Z-Index Override */
.owner-sidebar {
  top: 0 !important;
  height: 100vh !important;
  background: #f8f9fa !important;
}

/* Main Content Wrapper */
.sidebar-content-wrapper {
  padding-bottom: 120px; /* Space for user info section */
  min-height: 100vh;
  height: 100vh;
}



/* Sidebar Content Spacing */
.sidebar-content-spacing {
  margin-top: v-bind('BRAND_HEIGHT_DESKTOP + "px"'); /* Push content below brand overlay */
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

/* Properties Section */
.properties-section {
  margin-top: 12px;
  margin-bottom: 12px;
}

.properties-list {
  padding: 0 8px;
}

.property-item {
  margin-bottom: 2px;
  border-radius: 6px !important;
  color: rgb(var(--v-theme-success)) !important;
  font-weight: 500 !important;
  cursor: pointer;
  min-height: 32px !important;
}

.compact-property-item {
  padding: 4px 8px !important;
}

.property-item:hover {
  background: #f3f4f6 !important;
}

.property-item.selected {
  background: rgba(var(--v-theme-primary), 0.1) !important;
  border-left: 3px solid rgb(var(--v-theme-primary));
}

.property-content {
  flex: 1;
  min-width: 0;
  padding: 0 8px;
}

.property-title {
  font-size: 0.8rem !important;
  font-weight: 600 !important;
  color: rgb(var(--v-theme-primary)) !important;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.property-subtitle {
  font-size: 0.7rem !important;
  color: rgb(var(--v-theme-info)) !important;
  opacity: 0.8;
  line-height: 1.1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 1px;
}

.no-properties {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 20px;
  text-align: center;
}

/* Quick Actions Section */
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
    margin-top: v-bind('BRAND_HEIGHT_MOBILE + "px"'); /* Smaller spacing on mobile */
  }
}
/* ================================================================ */
/* CLARO BRAND OVERLAY - OVER APP BAR */
/* ================================================================ */

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
    height: v-bind('BRAND_HEIGHT_MOBILE + "px"'); /* Smaller on mobile */
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
/* Global z-index overrides for navigation drawer */
.v-navigation-drawer.owner-sidebar {
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

/* Enhanced scrim visibility for sidebar */
.v-navigation-drawer--temporary + .v-overlay .v-overlay__scrim {
  background-color: rgba(0, 0, 0, 0.65) !important;
  backdrop-filter: blur(2px);
}
</style> 