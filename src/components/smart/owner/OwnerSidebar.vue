<template>
  <v-navigation-drawer
    class="owner-sidebar"
    :width="380"
    :permanent="true"
   
    :elevation="0"
    color="tertiary"
  >                                   
    <!-- User Profile Section -->
    <v-list-item
      :prepend-avatar="`https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.user?.name || 'Owner')}&background=6366f1&color=fff`"
      :title="authStore.user?.name || 'Property Owner'"
      :subtitle="authStore.user?.email"
      class="owner-profile ma-2"
      rounded="lg"
      color="primary"
      variant="tonal"
    >
      <template #append>
        <v-btn
          variant="text"
          :icon="isRail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
          size="small"
          @click="toggleRail"
        />
      </template>
    </v-list-item>

    <v-divider class="mx-4" />

    <!-- Owner Quick Stats -->
    <v-expand-transition>
      <v-card
        v-if="!isRail"
        variant="flat"
        class="mx-2 my-3"
        color="surface-bright"
      >
        <v-card-subtitle class="text-caption text-medium-emphasis pb-2">
          Quick Stats
        </v-card-subtitle>
        <v-card-text class="pt-0">
          <v-row dense>
            <v-col
              cols="4"
              class="text-center"
            >
              <v-avatar
                color="primary"
                size="40"
              >
                <span class="text-h6">{{ ownerData.stats.propertiesCount }}</span>
              </v-avatar>
              <div class="text-caption mt-1">
                Properties
              </div>
            </v-col>
            <v-col
              cols="4"
              class="text-center"
            >
              <v-avatar
                color="success"
                size="40"
              >
                <span class="text-h6">{{ ownerData.stats.upcomingBookingsCount }}</span>
              </v-avatar>
              <div class="text-caption mt-1">
                Upcoming
              </div>
            </v-col>
            <v-col
              cols="4"
              class="text-center"
            >
              <v-avatar 
                :color="ownerData.stats.urgentTurnsCount > 0 ? 'warning' : 'surface'" 
                size="40"
              >
                <span class="text-h6">{{ ownerData.stats.urgentTurnsCount }}</span>
              </v-avatar>
              <div class="text-caption mt-1">
                Urgent
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-expand-transition>

    <v-divider class="mx-4" />

    <!-- Owner Navigation -->
    <v-list
      density="compact"
      nav
      class="px-2"
    >
      <!-- Dashboard -->
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Dashboard"
        :active="currentRoute === 'owner-dashboard'"
        rounded="lg"
        class="mb-1"
        @click="navigateTo('/owner/dashboard')"
      />

      <!-- My Properties -->
      <v-list-group
        value="properties"
        class="mb-1"
      >
        <template #activator="{ props: activatorProps }">
          <v-list-item
            v-bind="activatorProps"
            prepend-icon="mdi-home-group"
            title="My Properties"
            rounded="lg"
          >
            <template #append="{ isActive }">
              <v-icon :icon="isActive ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
            </template>
          </v-list-item>
        </template>

        <v-list-item
          prepend-icon="mdi-plus-circle"
          title="Add Property"
          class="ml-4"
          rounded="lg"
          @click="showAddPropertyDialog = true"
        />
        
        <v-list-item
          v-for="property in ownerData.ownerProperties"
          :key="property.id"
          :prepend-icon="property.active ? 'mdi-home' : 'mdi-home-off'"
          :title="property.name"
          :subtitle="getPropertySubtitle(property)"
          class="ml-4"
          rounded="lg"
          @click="filterByProperty(property.id)"
        >
          <template #append>
            <v-chip
              v-if="getPropertyBookingsCount(property.id) > 0"
              size="x-small"
              color="primary"
              variant="tonal"
            >
              {{ getPropertyBookingsCount(property.id) }}
            </v-chip>
          </template>
        </v-list-item>
      </v-list-group>

      <!-- My Bookings -->
      <v-list-item
        prepend-icon="mdi-calendar-check"
        title="My Bookings"
        :active="currentRoute === 'owner-bookings'"
        rounded="lg"
        class="mb-1"
        @click="navigateTo('/owner/bookings')"
      >
        <template #append>
          <v-chip
            v-if="ownerData.ownerBookings.length > 0"
            size="x-small"
            color="primary"
            variant="tonal"
          >
            {{ ownerData.ownerBookings.length }}
          </v-chip>
        </template>
      </v-list-item>

      <!-- Calendar View -->
      <v-list-item
        prepend-icon="mdi-calendar"
        title="Calendar"
        :active="currentRoute === 'owner-calendar'"
        rounded="lg"
        class="mb-1"
        @click="navigateTo('/owner/calendar')"
      />

      <v-divider class="my-3" />

      <!-- Turn Alerts (Owner-specific) -->
      <v-list-item
        :prepend-icon="ownerData.urgentTurns.length > 0 ? 'mdi-alert-circle' : 'mdi-check-circle'"
        :title="`Turn Alerts (${ownerData.urgentTurns.length})`"
        :class="{ 'text-warning': ownerData.urgentTurns.length > 0, 'text-success': ownerData.urgentTurns.length === 0 }"
        rounded="lg"
        class="mb-1"
        @click="showTurnAlerts = true"
      >
        <template #append>
          <v-badge
            v-if="ownerData.urgentTurns.length > 0"
            :content="ownerData.urgentTurns.length"
            color="warning"
          />
        </template>
      </v-list-item>

      <!-- Settings -->
      <v-list-item
        prepend-icon="mdi-cog"
        title="Settings"
        rounded="lg"
        @click="navigateTo('/owner/settings')"
      />
    </v-list>

    <!-- Owner Quick Actions -->
    <template #append>
      <v-expand-transition>
        <div
          v-if="!isRail"
          class="pa-3"
        >
          <v-btn
            block
            color="primary"
            prepend-icon="mdi-plus"
            text="Add Booking"
            variant="elevated"
            class="mb-2"
            @click="showAddBookingDialog = true"
          />
          <v-btn
            block
            color="secondary"
            prepend-icon="mdi-home-plus"
            text="Add Property"
            variant="outlined"
            @click="showAddPropertyDialog = true"
          />
        </div>
      </v-expand-transition>
      
      <!-- Rail mode quick actions -->
      <div
        v-if="isRail"
        class="d-flex flex-column pa-2"
      >
        <v-btn
          icon="mdi-plus"
          color="primary"
          variant="elevated"
          class="mb-2"
          @click="showAddBookingDialog = true"
        />
        <v-btn
          icon="mdi-home-plus"
          color="secondary"
          variant="outlined"
          @click="showAddPropertyDialog = true"
        />
      </div>
    </template>
  </v-navigation-drawer>

  <!-- Enhanced Property Dialog -->
  <v-dialog 
    v-model="showAddPropertyDialog" 
    max-width="600"
    persistent
    :fullscreen="isMobile"
  >
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon
          icon="mdi-home-plus"
          class="mr-3"
        />
        Add New Property
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="showAddPropertyDialog = false"
        />
      </v-card-title>
      <v-card-text>
        <!-- Simple form for now - will be replaced with OwnerPropertyForm -->
        <v-alert
          type="info"
          variant="tonal"
          class="mb-4"
        >
          Property creation form will be implemented here
        </v-alert>
        <v-btn
          color="primary"
          @click="createSampleProperty"
        >
          Create Sample Property
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Enhanced Booking Dialog -->
  <v-dialog 
    v-model="showAddBookingDialog" 
    max-width="800"
    persistent
    :fullscreen="isMobile"
  >
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon
          icon="mdi-calendar-plus"
          class="mr-3"
        />
        Schedule New Cleaning
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="showAddBookingDialog = false"
        />
      </v-card-title>
      <v-card-text>
        <!-- Simple form for now - will be replaced with OwnerBookingForm -->
        <v-alert
          type="info"
          variant="tonal"
          class="mb-4"
        >
          Booking creation form will be implemented here
        </v-alert>
        <v-btn 
          color="primary" 
          :disabled="ownerData.ownerProperties.length === 0"
          @click="createSampleBooking"
        >
          Create Sample Booking
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Enhanced Turn Alerts Dialog -->
  <v-dialog 
    v-model="showTurnAlerts" 
    max-width="500"
    :fullscreen="isMobile"
  >
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon 
          :icon="ownerData.urgentTurns.length > 0 ? 'mdi-alert-circle' : 'mdi-check-circle'"
          :color="ownerData.urgentTurns.length > 0 ? 'warning' : 'success'"
          class="mr-3"
        />
        Turn Alerts
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="showTurnAlerts = false"
        />
      </v-card-title>
      <v-card-text>
        <div v-if="ownerData.urgentTurns.length > 0">
          <v-list>
            <v-list-item
              v-for="turn in ownerData.urgentTurns"
              :key="turn.id"
            >
              <template #prepend>
                <v-avatar
                  color="warning"
                  size="40"
                >
                  <v-icon>mdi-alert</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title>
                {{ getPropertyName(turn.property_id) }}
              </v-list-item-title>
              <v-list-item-subtitle>
                Checkout: {{ new Date(turn.checkout_date).toLocaleDateString() }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </div>
        <v-alert
          v-else
          type="success"
          variant="tonal"
        >
          <v-icon
            icon="mdi-check-circle"
            class="mr-2"
          />
          No urgent turns! All your properties are under control.
        </v-alert>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDisplay } from 'vuetify';
import { useRouter, useRoute } from 'vue-router';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { useOwnerDataStore } from '@/stores/ownerData';
import type { Property } from '@/types';

// Define emits
interface Emits {
  (e: 'navigateToBooking', bookingId: string): void;
  (e: 'navigateToDate', date: Date): void;
  (e: 'filterByProperty', propertyId: string | null): void;
  (e: 'createBooking'): void;
  (e: 'createProperty'): void;
}

const emit = defineEmits<Emits>();

// Composables
const router = useRouter();
const route = useRoute();
const { mobile } = useDisplay();

// Store connections
const uiStore = useUIStore();
const authStore = useAuthStore();
const ownerDataStore = useOwnerDataStore();

// Enhanced state
const isRail = ref(false);
const showAddPropertyDialog = ref(false);
const showAddBookingDialog = ref(false);
const showTurnAlerts = ref(false);

// Get owner data from store
const ownerData = computed(() => ownerDataStore);

// Responsive design
const isMobile = computed(() => mobile.value);

// Current route detection
const currentRoute = computed(() => route.name as string);

// Navigation methods
const navigateTo = (path: string) => {
  try {
    router.push(path);
  } catch (error) {
    console.error('Navigation error:', error);
  }
};

const toggleRail = () => {
  isRail.value = !isRail.value;
};

// Property and booking methods
const filterByProperty = (propertyId: string) => {
  try {
    uiStore.setPropertyFilter(propertyId);
    emit('filterByProperty', propertyId);
  } catch (error) {
    console.error('Error filtering by property:', error);
  }
};

const getPropertySubtitle = (property: Property): string => {
  return property.address || 'No address';
};

const getPropertyBookingsCount = (propertyId: string): number => {
  return ownerData.value.ownerBookings.filter(b => b.property_id === propertyId).length;
};

const getPropertyName = (propertyId: string): string => {
  const property = ownerData.value.ownerProperties.find(p => p.id === propertyId);
  return property?.name || 'Unknown Property';
};

// Sample data creation methods
const createSampleProperty = async () => {
  try {
    const sampleProperty = {
      name: `Sample Property ${Date.now()}`,
      address: '123 Sample Street',
      property_type: 'house' as const,
      bedrooms: 2,
      bathrooms: 2,
      cleaning_duration: 120,
      pricing_tier: 'standard' as const,
      active: true
    };
    
    await ownerDataStore.createOwnerProperty(sampleProperty);
    showAddPropertyDialog.value = false;
  } catch (error) {
    console.error('Error creating sample property:', error);
  }
};

const createSampleBooking = async () => {
  try {
    if (ownerData.value.ownerProperties.length === 0) {
      console.error('No properties available for booking');
      return;
    }

    const property = ownerData.value.ownerProperties[0];
    const sampleBooking = {
      property_id: property.id,
      booking_type: 'standard' as const,
      checkout_date: new Date().toISOString().split('T')[0],
      cleaner_id: null,
      status: 'scheduled' as const,
      special_instructions: 'Sample booking created from sidebar'
    };
    
    await ownerDataStore.createOwnerBooking(sampleBooking);
    showAddBookingDialog.value = false;
  } catch (error) {
    console.error('Error creating sample booking:', error);
  }
};

// Initialize owner data on mount
onMounted(async () => {
  try {
    await ownerDataStore.refreshOwnerData();
  } catch (error) {
    console.error('Error initializing owner data:', error);
  }
});
</script>

<style scoped>
.owner-sidebar {
  height: 100%;
  overflow-y: auto;
}

.quick-actions .v-card-text {
  display: flex;
  flex-wrap: wrap;
  gap: 0px;
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* Mobile optimizations */
@media (max-width: 960px) {
  .owner-sidebar {
    width: 100% !important;
  }
}

/* Owner-specific styling */
.property-filter .v-card-title {
  color: rgb(var(--v-theme-primary));
}

.quick-actions .v-card-title {
  color: rgb(var(--v-theme-secondary));
}
</style> 