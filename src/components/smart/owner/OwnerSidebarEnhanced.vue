<!-- 
🏠 ENHANCED OWNER SIDEBAR
Based on task_documentation.md template
Enhanced with Vuetify best practices for great UX
-->

<template>
  <v-navigation-drawer
    v-model="isOpen"
    :rail="isRail"
    :permanent="!isMobile"
    :temporary="isMobile"
    app
    class="owner-sidebar"
    color="surface-variant"
    :width="280"
    :rail-width="72"
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
            <v-col cols="4" class="text-center">
              <v-avatar color="primary" size="40">
                <span class="text-h6">{{ ownerProperties.length }}</span>
              </v-avatar>
              <div class="text-caption mt-1">Properties</div>
            </v-col>
            <v-col cols="4" class="text-center">
              <v-avatar color="success" size="40">
                <span class="text-h6">{{ upcomingBookings.length }}</span>
              </v-avatar>
              <div class="text-caption mt-1">Upcoming</div>
            </v-col>
            <v-col cols="4" class="text-center">
              <v-avatar 
                :color="urgentTurns.length > 0 ? 'warning' : 'surface'" 
                size="40"
              >
                <span class="text-h6">{{ urgentTurns.length }}</span>
              </v-avatar>
              <div class="text-caption mt-1">Urgent</div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-expand-transition>

    <v-divider class="mx-4" />

    <!-- Owner Navigation -->
    <v-list density="compact" nav class="px-2">
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
      <v-list-group value="properties" class="mb-1">
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
          v-for="property in ownerProperties"
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
            v-if="ownerBookings.length > 0"
            size="x-small"
            color="primary"
            variant="tonal"
          >
            {{ ownerBookings.length }}
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
        :prepend-icon="urgentTurns.length > 0 ? 'mdi-alert-circle' : 'mdi-check-circle'"
        :title="`Turn Alerts (${urgentTurns.length})`"
        :class="{ 'text-warning': urgentTurns.length > 0, 'text-success': urgentTurns.length === 0 }"
        rounded="lg"
        class="mb-1"
        @click="showTurnAlerts = true"
      >
        <template #append>
          <v-badge
            v-if="urgentTurns.length > 0"
            :content="urgentTurns.length"
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
        <div v-if="!isRail" class="pa-3">
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
      <div v-if="isRail" class="d-flex flex-column pa-2">
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
        <v-icon icon="mdi-home-plus" class="mr-3" />
        Add New Property
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="showAddPropertyDialog = false"
        />
      </v-card-title>
      <v-card-text>
        <OwnerPropertyForm
          :model-value="showAddPropertyDialog"
          mode="create"
          @save="handlePropertySave"
          @cancel="showAddPropertyDialog = false"
        />
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
        <v-icon icon="mdi-calendar-plus" class="mr-3" />
        Schedule New Cleaning
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="showAddBookingDialog = false"
        />
      </v-card-title>
      <v-card-text>
        <OwnerBookingForm
          :model-value="showAddBookingDialog"
          :properties="ownerProperties"
          mode="create"
          @save="handleBookingSave"
          @cancel="showAddBookingDialog = false"
        />
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
          :icon="urgentTurns.length > 0 ? 'mdi-alert-circle' : 'mdi-check-circle'"
          :color="urgentTurns.length > 0 ? 'warning' : 'success'"
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
        <TurnAlertsPanel
          :bookings="urgentTurns"
          role="owner"
          @close="showTurnAlerts = false"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/stores/auth'
import { usePropertyStore } from '@/stores/property'
import { useBookingStore } from '@/stores/booking'
import { useOwnerErrorHandler } from '@/composables/owner/useOwnerErrorHandler'
import OwnerPropertyForm from '@/components/dumb/owner/OwnerPropertyForm.vue'
import OwnerBookingForm from '@/components/dumb/owner/OwnerBookingForm.vue'
import TurnAlertsPanel from '@/components/dumb/shared/TurnAlerts.vue'
import type { Property, Booking } from '@/types'

// Props
interface Props {
  modelValue?: boolean
  rail?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: true,
  rail: false
})

// Emits
interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:rail', value: boolean): void
  (e: 'property-selected', propertyId: string): void
}

const emit = defineEmits<Emits>()

// Composables
const route = useRoute()
const router = useRouter()
const { mobile: isMobile } = useDisplay()
const authStore = useAuthStore()
const propertyStore = usePropertyStore()
const bookingStore = useBookingStore()
const { handleError, showSuccess } = useOwnerErrorHandler()

// Local state
const showAddPropertyDialog = ref(false)
const showAddBookingDialog = ref(false)
const showTurnAlerts = ref(false)

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isRail = computed({
  get: () => props.rail,
  set: (value) => emit('update:rail', value)
})

const currentRoute = computed(() => route.name as string)

// ROLE-BASED DATA FILTERING - Owner sees only their data
const ownerProperties = computed((): Property[] => {
  if (!authStore.user?.id) return []
  return Array.from(propertyStore.properties.values())
    .filter(property => property.owner_id === authStore.user?.id)
})

const ownerBookings = computed((): Booking[] => {
  if (!authStore.user?.id) return []
  return Array.from(bookingStore.bookings.values())
    .filter(booking => booking.owner_id === authStore.user?.id)
})

const upcomingBookings = computed((): Booking[] => {
  const now = new Date()
  return ownerBookings.value.filter(booking => 
    new Date(booking.checkin_date) > now &&
    (booking.status === 'confirmed' || booking.status === 'scheduled')
  )
})

const urgentTurns = computed((): Booking[] => {
  return ownerBookings.value.filter(booking =>
    booking.booking_type === 'turn' &&
    booking.status === 'pending' &&
    new Date(booking.checkout_date) <= new Date(Date.now() + 24 * 60 * 60 * 1000) // Within 24 hours
  )
})

// Methods
const toggleRail = (): void => {
  isRail.value = !isRail.value
}

const navigateTo = (path: string): void => {
  router.push(path)
}

const filterByProperty = (propertyId: string): void => {
  emit('property-selected', propertyId)
  navigateTo('/owner/calendar')
}

const getPropertyBookingsCount = (propertyId: string): number => {
  return ownerBookings.value.filter(booking => 
    booking.property_id === propertyId &&
    ['confirmed', 'pending'].includes(booking.status)
  ).length
}

const getPropertySubtitle = (property: Property): string => {
  const address = typeof property.address === 'string' ? property.address : property.address?.city || 'Unknown'
  const tier = property.pricing_tier || 'standard'
  return `${address} • ${tier}`
}

const handlePropertySave = async (propertyData: any): Promise<void> => {
  try {
    // Create property using the addProperty method from the store
    propertyStore.addProperty({
      ...propertyData,
      owner_id: authStore.user?.id
    })
    showAddPropertyDialog.value = false
    showSuccess('Property added successfully!')
  } catch (error) {
    handleError(error, { message: 'Failed to add property' })
  }
}

const handleBookingSave = async (bookingData: any): Promise<void> => {
  try {
    // Create booking using the addBooking method from the store
    bookingStore.addBooking({
      ...bookingData,
      owner_id: authStore.user?.id
    })
    showAddBookingDialog.value = false
    showSuccess('Booking added successfully!')
  } catch (error) {
    handleError(error, { message: 'Failed to add booking' })
  }
}
</script>

<style scoped>
.owner-sidebar {
  border-right: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.owner-profile {
  transition: all 0.3s ease;
}

.owner-profile:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.v-list-item--active {
  background: rgba(var(--v-theme-primary), 0.12) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

.v-list-item--active .v-list-item__prepend .v-icon {
  color: rgb(var(--v-theme-primary)) !important;
}

.text-warning .v-list-item__prepend .v-icon {
  color: rgb(var(--v-theme-warning)) !important;
}

.text-success .v-list-item__prepend .v-icon {
  color: rgb(var(--v-theme-success)) !important;
}

/* Smooth transitions for rail mode */
.v-navigation-drawer--rail .v-list-item__prepend {
  margin-inline-end: 0 !important;
}

/* Enhanced hover effects */
.v-list-item:hover {
  background: rgba(var(--v-theme-primary), 0.08) !important;
}

/* Quick stats animations */
.v-avatar {
  transition: transform 0.2s ease;
}

.v-avatar:hover {
  transform: scale(1.05);
}
</style> 