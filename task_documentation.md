# 🚀 Critical Task Implementation Guide

This guide provides comprehensive documentation and examples for implementing the critical tasks in your role-based architecture migration. All examples follow your existing Vue 3 + Pinia + Vuetify + TypeScript patterns.
---
# 📝 **TASK-060: Create OwnerSidebar.vue Component**
### **Overview**
Create a role-specific sidebar that shows only owner-relevant navigation and filters data appropriately.
### **Implementation Pattern**

```vue
<!-- src/components/smart/owner/OwnerSidebar.vue -->
<template>
  <v-navigation-drawer
    v-model="isOpen"
    :rail="isRail"
    :permanent="!isMobile"
    :temporary="isMobile"
    app
    class="owner-sidebar"
  >
    <!-- User Profile Section -->
    <v-list-item
      :prepend-avatar="authStore.user?.avatar || undefined"
      :title="authStore.user?.name || 'Property Owner'"
      :subtitle="authStore.user?.email"
      class="owner-profile"
    >
      <template #append>
        <v-btn
          variant="text"
          icon="mdi-chevron-left"
          size="small"
          @click="toggleRail"
        />
      </template>
    </v-list-item>

    <v-divider />

    <!-- Owner Quick Stats -->
    <v-list-item v-if="!isRail" class="owner-stats">
      <v-list-item-title class="text-caption text-medium-emphasis">
        Quick Stats
      </v-list-item-title>
      <div class="d-flex justify-space-between text-body-2 mt-2">
        <div class="text-center">
          <div class="text-h6 text-primary">{{ ownerProperties.length }}</div>
          <div class="text-caption">Properties</div>
        </div>
        <div class="text-center">
          <div class="text-h6 text-success">{{ upcomingBookings.length }}</div>
          <div class="text-caption">Upcoming</div>
        </div>
        <div class="text-center">
          <div class="text-h6 text-warning">{{ urgentTurns.length }}</div>
          <div class="text-caption">Urgent Turns</div>
        </div>
      </div>
    </v-list-item>

    <v-divider />

    <!-- Owner Navigation -->
    <v-list density="compact" nav>
      <!-- Dashboard -->
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Dashboard"
        :active="currentRoute === 'owner-dashboard'"
        @click="navigateTo('/owner/dashboard')"
      />

      <!-- My Properties -->
      <v-list-group value="properties">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-home-group"
            title="My Properties"
          />
        </template>

        <v-list-item
          prepend-icon="mdi-plus-circle"
          title="Add Property"
          @click="showAddPropertyDialog = true"
        />
        
        <v-list-item
          v-for="property in ownerProperties"
          :key="property.id"
          :prepend-icon="property.active ? 'mdi-home' : 'mdi-home-off'"
          :title="property.name"
          :subtitle="`${property.address?.city} • ${property.pricing_tier}`"
          @click="filterByProperty(property.id)"
        >
          <template #append>
            <v-chip
              v-if="getPropertyBookingsCount(property.id) > 0"
              size="x-small"
              color="primary"
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
        @click="navigateTo('/owner/bookings')"
      >
        <template #append>
          <v-chip
            v-if="ownerBookings.length > 0"
            size="x-small"
            color="primary"
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
        @click="navigateTo('/owner/calendar')"
      />

      <v-divider class="my-2" />

      <!-- Turn Alerts (Owner-specific) -->
      <v-list-item
        prepend-icon="mdi-alert-circle"
        :title="`Turn Alerts (${urgentTurns.length})`"
        :class="{ 'text-warning': urgentTurns.length > 0 }"
        @click="showTurnAlerts = true"
      />

      <!-- Settings -->
      <v-list-item
        prepend-icon="mdi-cog"
        title="Settings"
        @click="navigateTo('/owner/settings')"
      />
    </v-list>

    <!-- Owner Quick Actions -->
    <template #append>
      <div class="pa-2">
        <v-btn
          block
          color="primary"
          prepend-icon="mdi-plus"
          text="Add Booking"
          variant="elevated"
          @click="showAddBookingDialog = true"
        />
      </div>
    </template>
  </v-navigation-drawer>

  <!-- Add Property Dialog -->
  <v-dialog v-model="showAddPropertyDialog" max-width="600">
    <OwnerPropertyForm
      mode="create"
      @save="handlePropertySave"
      @cancel="showAddPropertyDialog = false"
    />
  </v-dialog>

  <!-- Add Booking Dialog -->
  <v-dialog v-model="showAddBookingDialog" max-width="800">
    <OwnerBookingForm
      :properties="ownerProperties"
      mode="create"
      @save="handleBookingSave"
      @cancel="showAddBookingDialog = false"
    />
  </v-dialog>

  <!-- Turn Alerts Dialog -->
  <v-dialog v-model="showTurnAlerts" max-width="500">
    <TurnAlertsPanel
      :turns="urgentTurns"
      role="owner"
      @close="showTurnAlerts = false"
    />
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
import TurnAlertsPanel from '@/components/dumb/shared/TurnAlertsPanel.vue'
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



const currentRoute = computed(() => route.name as string)

// ROLE-BASED DATA FILTERING - Owner sees only their data
const ownerProperties = computed((): Property[] => {
  if (!authStore.user?.id) return []
  return propertyStore.propertiesByOwner(authStore.user.id)
})

const ownerBookings = computed((): Booking[] => {
  if (!authStore.user?.id) return []
  return bookingStore.bookingsByOwner(authStore.user.id)
})

const upcomingBookings = computed((): Booking[] => {
  const now = new Date()
  return ownerBookings.value.filter(booking => 
    new Date(booking.checkin_date) > now &&
    booking.status === 'confirmed'
  )
})

const urgentTurns = computed((): Booking[] => {
  return ownerBookings.value.filter(booking =>
    booking.booking_type === 'turn' &&
    booking.status === 'pending' &&
    new Date(booking.checkout_date) <= new Date(Date.now() + 24 * 60 * 60 * 1000) // Within 24 hours
  )
})

//Methods

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

const handlePropertySave = async (propertyData: any): Promise<void> => {
  try {
    await propertyStore.createProperty({
      ...propertyData,
      owner_id: authStore.user?.id
    })
    showAddPropertyDialog.value = false
    showSuccess('Property added successfully!')
  } catch (error) {
    handleError(error, 'Failed to add property')
  }
}

const handleBookingSave = async (bookingData: any): Promise<void> => {
  try {
    await bookingStore.createBooking({
      ...bookingData,
      owner_id: authStore.user?.id
    })
    showAddBookingDialog.value = false
    showSuccess('Booking added successfully!')
  } catch (error) {
    handleError(error, 'Failed to add booking')
  }
}
</script>

<style scoped>
.owner-sidebar {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.owner-profile {
  background: rgba(var(--v-theme-primary), 0.05);
  margin: 4px;
  border-radius: 8px;
}

.owner-stats {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  margin: 4px;
  border-radius: 8px;
}

.v-list-item--active {
  background: rgba(var(--v-theme-primary), 0.12) !important;
}

.text-warning .v-list-item__prepend .v-icon {
  color: rgb(var(--v-theme-warning)) !important;
}
</style>
```

### **Key Implementation Points**

1. **Role-Based Data Filtering**: Uses computed properties to filter data by `owner_id`
2. **Integration with Existing Stores**: Uses your existing Pinia stores
3. **Vuetify Patterns**: Follows your established Vuetify component usage
4. **TypeScript Safety**: Proper typing for all props, emits, and data
5. **Error Handling**: Uses role-specific error handler for owner-friendly messages

---

## 📝 **TASK-072: Store-Level Role Filtering Architecture**

### **Overview**
Move role-based filtering from components to Pinia stores for better performance and consistency.

### **Implementation Pattern**

```typescript
// src/stores/ownerData.ts - Owner-specific data store
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'
import { usePropertyStore } from './property'
import { useBookingStore } from './booking'
import type { Property, Booking, User } from '@/types'

export const useOwnerDataStore = defineStore('ownerData', () => {
  // Dependencies
  const authStore = useAuthStore()
  const propertyStore = usePropertyStore()
  const bookingStore = useBookingStore()

  // Cache for performance
  const lastOwnerId = ref<string | null>(null)
  const cachedProperties = ref<Property[]>([])
  const cachedBookings = ref<Booking[]>([])
  const cacheTimestamp = ref<number>(0)
  const CACHE_TTL = 30000 // 30 seconds

  // Cache management
  const isCacheValid = computed(() => {
    const now = Date.now()
    return (
      lastOwnerId.value === authStore.user?.id &&
      (now - cacheTimestamp.value) < CACHE_TTL
    )
  })

  const invalidateCache = (): void => {
    lastOwnerId.value = null
    cachedProperties.value = []
    cachedBookings.value = []
    cacheTimestamp.value = 0
  }

  // Core owner data getters with caching
  const ownerProperties = computed((): Property[] => {
    if (!authStore.user?.id) return []

    // Return cached data if valid
    if (isCacheValid.value) {
      return cachedProperties.value
    }

    // Filter and cache new data
    const filtered = propertyStore.propertiesArray.filter(
      property => property.owner_id === authStore.user?.id
    )

    cachedProperties.value = filtered
    lastOwnerId.value = authStore.user.id
    cacheTimestamp.value = Date.now()

    return filtered
  })

  const ownerBookings = computed((): Booking[] => {
    if (!authStore.user?.id) return []

    // Return cached data if valid for bookings
    if (isCacheValid.value && cachedBookings.value.length > 0) {
      return cachedBookings.value
    }

    // Filter and cache new data
    const filtered = bookingStore.bookingsArray.filter(
      booking => booking.owner_id === authStore.user?.id
    )

    cachedBookings.value = filtered
    return filtered
  })

  // Derived owner data
  const activeProperties = computed((): Property[] => {
    return ownerProperties.value.filter(property => property.active)
  })

  const upcomingBookings = computed((): Booking[] => {
    const now = new Date()
    return ownerBookings.value.filter(booking =>
      new Date(booking.checkin_date) > now &&
      ['confirmed', 'pending'].includes(booking.status)
    )
  })

  const recentBookings = computed((): Booking[] => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    return ownerBookings.value.filter(booking =>
      new Date(booking.checkout_date) >= thirtyDaysAgo
    ).sort((a, b) => 
      new Date(b.checkout_date).getTime() - new Date(a.checkout_date).getTime()
    )
  })

  const urgentTurns = computed((): Booking[] => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    return ownerBookings.value.filter(booking =>
      booking.booking_type === 'turn' &&
      booking.status === 'pending' &&
      new Date(booking.checkout_date) <= tomorrow
    )
  })

  // Property-specific helpers
  const getPropertyBookings = (propertyId: string): Booking[] => {
    return ownerBookings.value.filter(booking => 
      booking.property_id === propertyId
    )
  }

  const getPropertyStats = (propertyId: string) => {
    const bookings = getPropertyBookings(propertyId)
    const thisMonth = new Date()
    thisMonth.setDate(1)
    
    const thisMonthBookings = bookings.filter(booking =>
      new Date(booking.checkin_date) >= thisMonth
    )

    return {
      totalBookings: bookings.length,
      thisMonthBookings: thisMonthBookings.length,
      avgNightly: bookings.length > 0 
        ? bookings.reduce((sum, b) => sum + (b.nightly_rate || 0), 0) / bookings.length
        : 0,
      occupancyRate: calculateOccupancyRate(propertyId)
    }
  }

  const calculateOccupancyRate = (propertyId: string): number => {
    const bookings = getPropertyBookings(propertyId)
    if (bookings.length === 0) return 0

    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const bookedDays = bookings
      .filter(booking => 
        new Date(booking.checkin_date) >= lastMonth &&
        new Date(booking.checkout_date) <= thisMonth
      )
      .reduce((total, booking) => {
        const checkin = new Date(booking.checkin_date)
        const checkout = new Date(booking.checkout_date)
        return total + Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24))
      }, 0)

    const totalDays = Math.ceil((thisMonth.getTime() - lastMonth.getTime()) / (1000 * 60 * 60 * 24))
    return Math.round((bookedDays / totalDays) * 100)
  }

  // Actions
  const refreshOwnerData = async (): Promise<void> => {
    invalidateCache()
    await Promise.all([
      propertyStore.fetchProperties(),
      bookingStore.fetchBookings()
    ])
  }

  // Watch for auth changes to invalidate cache
  authStore.$subscribe((mutation, state) => {
    if (mutation.storeId === 'auth' && state.user?.id !== lastOwnerId.value) {
      invalidateCache()
    }
  })

  return {
    // Core data
    ownerProperties,
    ownerBookings,
    activeProperties,
    upcomingBookings,
    recentBookings,
    urgentTurns,
    
    // Helpers
    getPropertyBookings,
    getPropertyStats,
    
    // Actions
    refreshOwnerData,
    invalidateCache,
    
    // Cache info (for debugging)
    isCacheValid,
    cacheTimestamp: computed(() => cacheTimestamp.value)
  }
})
```

```typescript
// src/stores/adminData.ts - Admin-specific data store
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usePropertyStore } from './property'
import { useBookingStore } from './booking'
import type { Property, Booking, SystemMetrics } from '@/types'

export const useAdminDataStore = defineStore('adminData', () => {
  // Dependencies
  const propertyStore = usePropertyStore()
  const bookingStore = useBookingStore()

  // Admin sees ALL data - no filtering
  const allProperties = computed((): Property[] => {
    return propertyStore.propertiesArray
  })

  const allBookings = computed((): Booking[] => {
    return bookingStore.bookingsArray
  })

  // System-wide metrics
  const systemMetrics = computed((): SystemMetrics => {
    const properties = allProperties.value
    const bookings = allBookings.value
    const now = new Date()
    
    return {
      totalProperties: properties.length,
      activeProperties: properties.filter(p => p.active).length,
      totalBookings: bookings.length,
      upcomingBookings: bookings.filter(b => 
        new Date(b.checkin_date) > now && b.status === 'confirmed'
      ).length,
      urgentTurns: bookings.filter(b =>
        b.booking_type === 'turn' &&
        b.status === 'pending' &&
        new Date(b.checkout_date) <= new Date(now.getTime() + 24 * 60 * 60 * 1000)
      ).length,
      revenue: bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.total_cost || 0), 0)
    }
  })

  // Owner performance analytics
  const ownerAnalytics = computed(() => {
    const ownerStats = new Map<string, any>()
    
    allProperties.value.forEach(property => {
      const ownerId = property.owner_id
      if (!ownerStats.has(ownerId)) {
        ownerStats.set(ownerId, {
          ownerId,
          ownerName: property.owner_name || 'Unknown',
          properties: [],
          bookings: [],
          revenue: 0,
          avgOccupancy: 0
        })
      }
      ownerStats.get(ownerId).properties.push(property)
    })

    allBookings.value.forEach(booking => {
      const ownerId = booking.owner_id
      if (ownerStats.has(ownerId)) {
        const stats = ownerStats.get(ownerId)
        stats.bookings.push(booking)
        if (booking.status === 'completed') {
          stats.revenue += booking.total_cost || 0
        }
      }
    })

    return Array.from(ownerStats.values())
  })

  // Critical alerts for admin
  const criticalAlerts = computed(() => {
    const alerts = []
    const now = new Date()
    const twentyFourHours = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    // Unassigned cleanings
    const unassignedCleanings = allBookings.value.filter(booking =>
      !booking.assigned_cleaner_id &&
      booking.cleaning_scheduled &&
      new Date(booking.checkout_date) <= twentyFourHours
    )

    if (unassignedCleanings.length > 0) {
      alerts.push({
        type: 'warning',
        title: 'Unassigned Cleanings',
        message: `${unassignedCleanings.length} cleanings need cleaner assignment`,
        count: unassignedCleanings.length,
        action: 'assign-cleaners'
      })
    }

    // Overdue turns
    const overdueTurns = allBookings.value.filter(booking =>
      booking.booking_type === 'turn' &&
      booking.status === 'pending' &&
      new Date(booking.checkout_date) < now
    )

    if (overdueTurns.length > 0) {
      alerts.push({
        type: 'error',
        title: 'Overdue Turns',
        message: `${overdueTurns.length} turns are overdue`,
        count: overdueTurns.length,
        action: 'urgent-turns'
      })
    }

    return alerts
  })

  return {
    // System data
    allProperties,
    allBookings,
    systemMetrics,
    ownerAnalytics,
    criticalAlerts
  }
})
```

### **Updated Component Usage Pattern**

```vue
<!-- src/components/smart/owner/HomeOwner.vue - Updated to use store filtering -->
<script setup lang="ts">
import { computed } from 'vue'
import { useOwnerDataStore } from '@/stores/ownerData'
import { useOwnerErrorHandler } from '@/composables/owner/useOwnerErrorHandler'

// Use owner data store instead of component-level filtering
const ownerData = useOwnerDataStore()
const { handleError } = useOwnerErrorHandler()

// Data comes pre-filtered from store
const properties = computed(() => ownerData.ownerProperties)
const bookings = computed(() => ownerData.ownerBookings)
const urgentTurns = computed(() => ownerData.urgentTurns)

// Property-specific data
const getPropertyStats = (propertyId: string) => {
  return ownerData.getPropertyStats(propertyId)
}
</script>
```

---

## 📝 **TASK-079: Role-Based Testing Utilities**

### **Overview**
Create comprehensive testing utilities that support role-based component testing.

### **Implementation Pattern**

```typescript
// src/test/utils/roleBasedMounting.ts
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createVuetify } from 'vuetify'
import { createRouter, createWebHistory } from 'vue-router'
import type { ComponentMountingOptions } from '@vue/test-utils'
import type { User, Property, Booking } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { usePropertyStore } from '@/stores/property'
import { useBookingStore } from '@/stores/booking'

// Mock data factories
export const createMockOwner = (overrides?: Partial<User>): User => ({
  id: 'owner-123',
  name: 'Test Owner',
  email: 'owner@test.com',
  role: 'owner',
  created_at: new Date().toISOString(),
  ...overrides
})

export const createMockAdmin = (overrides?: Partial<User>): User => ({
  id: 'admin-456',
  name: 'Test Admin',
  email: 'admin@test.com',
  role: 'admin',
  created_at: new Date().toISOString(),
  ...overrides
})

export const createMockProperty = (ownerId: string, overrides?: Partial<Property>): Property => ({
  id: `prop-${Math.random().toString(36).substr(2, 9)}`,
  name: 'Test Property',
  owner_id: ownerId,
  owner_name: 'Test Owner',
  address: {
    street: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zip: '12345'
  },
  pricing_tier: 'premium',
  nightly_rate: 150,
  cleaning_fee: 75,
  active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
})

export const createMockBooking = (ownerId: string, propertyId: string, overrides?: Partial<Booking>): Booking => ({
  id: `booking-${Math.random().toString(36).substr(2, 9)}`,
  property_id: propertyId,
  owner_id: ownerId,
  checkin_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  checkout_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  booking_type: 'standard',
  guest_count: 2,
  status: 'confirmed',
  cleaning_scheduled: true,
  total_cost: 450,
  nightly_rate: 150,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
})

// Role-based mounting utilities
interface OwnerMountOptions extends ComponentMountingOptions<any> {
  ownerData?: {
    user?: Partial<User>
    properties?: Partial<Property>[]
    bookings?: Partial<Booking>[]
  }
}

interface AdminMountOptions extends ComponentMountingOptions<any> {
  adminData?: {
    user?: Partial<User>
    allProperties?: Partial<Property>[]
    allBookings?: Partial<Booking>[]
  }
}

export const mountOwnerComponent = async (
  component: any,
  options: OwnerMountOptions = {}
): Promise<VueWrapper<any>> => {
  // Setup testing environment
  const pinia = createPinia()
  setActivePinia(pinia)
  
  const vuetify = createVuetify({
    theme: { defaultTheme: 'light' }
  })
  
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: { template: '<div>Home</div>' } },
      { path: '/owner/dashboard', component: { template: '<div>Dashboard</div>' } }
    ]
  })

  // Setup stores with owner data
  const authStore = useAuthStore()
  const propertyStore = usePropertyStore()
  const bookingStore = useBookingStore()

  // Create mock owner
  const mockOwner = createMockOwner(options.ownerData?.user)
  authStore.user = mockOwner

  // Setup owner properties
  if (options.ownerData?.properties) {
    options.ownerData.properties.forEach(propertyData => {
      const property = createMockProperty(mockOwner.id, propertyData)
      propertyStore.properties.set(property.id, property)
    })
  }

  // Setup owner bookings
  if (options.ownerData?.bookings) {
    options.ownerData.bookings.forEach(bookingData => {
      const booking = createMockBooking(
        mockOwner.id,
        Array.from(propertyStore.properties.keys())[0] || 'default-property',
        bookingData
      )
      bookingStore.bookings.set(booking.id, booking)
    })
  }

  // Mount component
  return mount(component, {
    global: {
      plugins: [pinia, vuetify, router],
      stubs: {
        'router-link': true,
        'router-view': true
      }
    },
    ...options
  })
}

export const mountAdminComponent = async (
  component: any,
  options: AdminMountOptions = {}
): Promise<VueWrapper<any>> => {
  // Setup testing environment
  const pinia = createPinia()
  setActivePinia(pinia)
  
  const vuetify = createVuetify({
    theme: { defaultTheme: 'light' }
  })
  
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: { template: '<div>Home</div>' } },
      { path: '/admin/dashboard', component: { template: '<div>Admin Dashboard</div>' } }
    ]
  })

  // Setup stores with admin data
  const authStore = useAuthStore()
  const propertyStore = usePropertyStore()
  const bookingStore = useBookingStore()

  // Create mock admin
  const mockAdmin = createMockAdmin(options.adminData?.user)
  authStore.user = mockAdmin

  // Setup all properties (admin sees everything)
  if (options.adminData?.allProperties) {
    options.adminData.allProperties.forEach(propertyData => {
      const property = createMockProperty('various-owners', propertyData)
      propertyStore.properties.set(property.id, property)
    })
  }

  // Setup all bookings (admin sees everything)
  if (options.adminData?.allBookings) {
    options.adminData.allBookings.forEach(bookingData => {
      const booking = createMockBooking(
        'various-owners',
        Array.from(propertyStore.properties.keys())[0] || 'default-property',
        bookingData
      )
      bookingStore.bookings.set(booking.id, booking)
    })
  }

  // Mount component
  return mount(component, {
    global: {
      plugins: [pinia, vuetify, router],
      stubs: {
        'router-link': true,
        'router-view': true
      }
    },
    ...options
  })
}

// Role-based assertion helpers
export const expectOwnerDataScoping = (wrapper: VueWrapper<any>, ownerId: string) => {
  // Find all property elements and verify they belong to owner
  const propertyElements = wrapper.findAll('[data-testid*="property-"]')
  propertyElements.forEach(element => {
    expect(element.attributes('data-owner-id')).toBe(ownerId)
  })

  // Find all booking elements and verify they belong to owner
  const bookingElements = wrapper.findAll('[data-testid*="booking-"]')
  bookingElements.forEach(element => {
    expect(element.attributes('data-owner-id')).toBe(ownerId)
  })
}

export const expectAdminDataAccess = (wrapper: VueWrapper<any>) => {
  // Admin should see system-wide stats
  expect(wrapper.find('[data-testid="total-properties"]').exists()).toBe(true)
  expect(wrapper.find('[data-testid="total-bookings"]').exists()).toBe(true)
  expect(wrapper.find('[data-testid="system-metrics"]').exists()).toBe(true)
}
```

### **Example Test Implementation**

```typescript
// src/components/smart/owner/__tests__/OwnerSidebar.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import OwnerSidebar from '../OwnerSidebar.vue'
import { mountOwnerComponent, expectOwnerDataScoping, createMockProperty, createMockBooking } from '@/test/utils/roleBasedMounting'

describe('OwnerSidebar.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display only owner properties', async () => {
    const wrapper = await mountOwnerComponent(OwnerSidebar, {
      ownerData: {
        user: { name: 'John Owner' },
        properties: [
          { name: 'Beach House', active: true },
          { name: 'Mountain Cabin', active: false }
        ]
      }
    })

    await nextTick()

    // Should show owner's properties
    expect(wrapper.text()).toContain('Beach House')
    expect(wrapper.text()).toContain('Mountain Cabin')
    
    // Verify data scoping
    expectOwnerDataScoping(wrapper, 'owner-123')
  })

  it('should show correct booking counts', async () => {
    const wrapper = await mountOwnerComponent(OwnerSidebar, {
      ownerData: {
        properties: [
          { name: 'Test Property' }
        ],
        bookings: [
          { status: 'confirmed' },
          { status: 'pending' },
          { status: 'completed' }
        ]
      }
    })

    await nextTick()

    // Should show booking count in nav
    const bookingNavItem = wrapper.find('[data-testid="owner-bookings-nav"]')
    expect(bookingNavItem.text()).toContain('3') // Total bookings
  })

  it('should handle turn alerts correctly', async () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    
    const wrapper = await mountOwnerComponent(OwnerSidebar, {
      ownerData: {
        bookings: [
          {
            booking_type: 'turn',
            status: 'pending',
            checkout_date: tomorrow
          }
        ]
      }
    })

    await nextTick()

    // Should show turn alert
    const turnAlert = wrapper.find('[data-testid="turn-alerts"]')
    expect(turnAlert.text()).toContain('Turn Alerts (1)')
  })

  it('should not show admin-only features', async () => {
    const wrapper = await mountOwnerComponent(OwnerSidebar, {
      ownerData: {
        user: { role: 'owner' }
      }
    })

    await nextTick()

    // Should not show admin features
    expect(wrapper.find('[data-testid="admin-reports"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="cleaner-management"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="system-settings"]').exists()).toBe(false)
  })
})
```

---

## 📝 **TASK-070: Import Path Optimization Guide**

### **Overview**
Standardize import paths and fix any remaining inconsistencies after the composables reorganization.

### **Current Import Patterns**

```typescript
// ✅ CORRECT - Shared composables
import { useAuth } from '@/composables/shared/useAuth'
import { useBookings } from '@/composables/shared/useBookings'
import { useProperties } from '@/composables/shared/useProperties'

// ✅ CORRECT - Role-specific composables (future)
import { useOwnerBookings } from '@/composables/owner/useOwnerBookings'
import { useAdminReports } from '@/composables/admin/useAdminReports'

// ✅ CORRECT - Components
import OwnerSidebar from '@/components/smart/owner/OwnerSidebar.vue'
import PropertyCard from '@/components/dumb/shared/PropertyCard.vue'

// ✅ CORRECT - Stores
import { useAuthStore } from '@/stores/auth'
import { usePropertyStore } from '@/stores/property'

// ❌ INCORRECT - Old patterns to fix
import { useAuth } from '@/composables/useAuth' // Missing /shared/
import { useBookings } from '../composables/useBookings' // Relative path
```

### **Automated Import Path Audit Script**

```typescript
// scripts/audit-imports.ts
import { readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'

interface ImportIssue {
  file: string
  line: number
  issue: string
  suggestion: string
}

const CORRECT_PATTERNS = {
  // Shared composables
  'useAuth': '@/composables/shared/useAuth',
  'useBookings': '@/composables/shared/useBookings',
  'useProperties': '@/composables/shared/useProperties',
  'useCalendarState': '@/composables/shared/useCalendarState',
  'useErrorHandler': '@/composables/shared/useErrorHandler',
  'useLoadingState': '@/composables/shared/useLoadingState',
  
  // Stores
  'useAuthStore': '@/stores/auth',
  'usePropertyStore': '@/stores/property',
  'useBookingStore': '@/stores/booking',
  'useUIStore': '@/stores/ui',
  
  // Types
  'types': '@/types'
}

const auditImports = async (dirPath: string): Promise<ImportIssue[]> => {
  const issues: ImportIssue[] = []
  
  const files = await readdir(dirPath, { recursive: true })
  
  for (const file of files) {
    if (!(file.endsWith('.vue') || file.endsWith('.ts'))) continue
    
    const filePath = join(dirPath, file)
    const content = await readFile(filePath, 'utf-8')
    const lines = content.split('\n')
    
    lines.forEach((line, index) => {
      // Check for import statements
      const importMatch = line.match(/import\s+.*from\s+['"]([^'"]+)['"]/)
      if (!importMatch) return
      
      const importPath = importMatch[1]
      
      // Check for incorrect patterns
      for (const [composable, correctPath] of Object.entries(CORRECT_PATTERNS)) {
        if (importPath.includes(composable) && importPath !== correctPath) {
          // Skip relative imports from within same directory
          if (importPath.startsWith('./') || importPath.startsWith('../')) {
            const isSharedToShared = filePath.includes('/shared/') && importPath.includes('/shared/')
            if (isSharedToShared) continue
          }
          
          issues.push({
            file: filePath,
            line: index + 1,
            issue: `Incorrect import path: ${importPath}`,
            suggestion: `Should be: ${correctPath}`
          })
        }
      }
      
      // Check for old composable patterns
      if (importPath.match(/@\/composables\/use[A-Z]/) && !importPath.includes('/shared/')) {
        issues.push({
          file: filePath,
          line: index + 1,
          issue: `Missing /shared/ in composable import: ${importPath}`,
          suggestion: `Should be: ${importPath.replace('/composables/', '/composables/shared/')}`
        })
      }
    })
  }
  
  return issues
}

// Run audit
const runAudit = async () => {
  console.log('🔍 Auditing import paths...')
  
  const issues = await auditImports('./src')
  
  if (issues.length === 0) {
    console.log('✅ All import paths are correct!')
    return
  }
  
  console.log(`❌ Found ${issues.length} import path issues:`)
  
  issues.forEach(issue => {
    console.log(`\n📁 ${issue.file}:${issue.line}`)
    console.log(`   Issue: ${issue.issue}`)
    console.log(`   Fix:   ${issue.suggestion}`)
  })
  
  // Generate fix script
  await generateFixScript(issues)
}

const generateFixScript = async (issues: ImportIssue[]) => {
  const fixScript = `#!/bin/bash
# Auto-generated import path fix script

echo "🔧 Fixing import paths..."

${issues.map(issue => {
  const oldPath = issue.issue.match(/: (.+)$/)?.[1] || ''
  const newPath = issue.suggestion.match(/: (.+)$/)?.[1] || ''
  
  if (oldPath && newPath) {
    return `sed -i 's|${oldPath.replace(/[/.*+?^${}()|[\\]\\]/g, '\\\\$&')}|${newPath}|g' "${issue.file}"`
  }
  return `# TODO: Manually fix ${issue.file}:${issue.line}`
}).join('\n')}

echo "✅ Import paths fixed!"
`
  
  await writeFile('./scripts/fix-imports.sh', fixScript, 'utf-8')
  console.log('\n📝 Generated fix script: ./scripts/fix-imports.sh')
  console.log('Run: chmod +x ./scripts/fix-imports.sh && ./scripts/fix-imports.sh')
}

runAudit().catch(console.error)
```

### **ESLint Rules for Import Consistency**

```javascript
// .eslintrc.js - Add these rules
module.exports = {
  // ... existing config
  rules: {
    // ... existing rules
    
    // Import path consistency
    'import/no-relative-parent-imports': 'error',
    'import/order': [
      'error',
      {
        'groups': [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index'
        ],
        'pathGroups': [
          {
            'pattern': '@/composables/shared/**',
            'group': 'internal',
            'position': 'before'
          },
          {
            'pattern': '@/composables/owner/**',
            'group': 'internal',
            'position': 'before'
          },
          {
            'pattern': '@/composables/admin/**',
            'group': 'internal',
            'position': 'before'
          },
          {
            'pattern': '@/stores/**',
            'group': 'internal',
            'position': 'before'
          },
          {
            'pattern': '@/components/**',
            'group': 'internal',
            'position': 'after'
          },
          {
            'pattern': '@/types/**',
            'group': 'internal',
            'position': 'after'
          }
        ],
        'pathGroupsExcludedImportTypes': ['builtin']
      }
    ]
  }
}
```

---

## 📝 **TASK-063: TypeScript Integration Patterns**

### **Overview**
Fix TypeScript issues in role-based components and establish consistent typing patterns.

### **Common TypeScript Patterns**

```typescript
// src/types/roleBasedComponents.ts
import type { Component } from 'vue'
import type { User, Property, Booking } from '@/types'

// Role-based component props
export interface OwnerComponentProps {
  user: User & { role: 'owner' }
  properties: Property[]
  bookings: Booking[]
}

export interface AdminComponentProps {
  user: User & { role: 'admin' }
  allProperties: Property[]
  allBookings: Booking[]
  systemMetrics: SystemMetrics
}

// Generic role-based component
export interface RoleBasedComponent<TRole extends 'owner' | 'admin'> {
  role: TRole
  user: User & { role: TRole }
  data: TRole extends 'owner' ? OwnerComponentProps : AdminComponentProps
}

// Component event types
export interface OwnerComponentEvents {
  'property-selected': [propertyId: string]
  'booking-created': [booking: Booking]
  'error-occurred': [error: Error]
}

export interface AdminComponentEvents {
  'cleaner-assigned': [bookingId: string, cleanerId: string]
  'bulk-action': [action: string, items: string[]]
  'system-alert': [alert: SystemAlert]
}

// Store typing helpers
export type FilteredStore<T, TRole> = TRole extends 'owner' 
  ? T & { data: T[] }
  : T & { allData: T[] }
```

### **TypeScript Component Template**

```vue
<!-- Template for role-based components -->
<template>
  <div :class="componentClasses">
    <!-- Component content -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteLocationNormalized, Router } from 'vue-router'

// Store imports with proper typing
import { useAuthStore } from '@/stores/auth'
import type { AuthStore } from '@/types/stores'

// Component-specific types
interface Props {
  modelValue?: boolean
  variant?: 'default' | 'compact' | 'expanded'
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'action', action: string, payload?: any): void
  (e: 'error', error: Error): void
}

// Props with defaults
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  variant: 'default',
  disabled: false
})

// Emits definition
const emit = defineEmits<Emits>()

// Composables with explicit typing
const route: RouteLocationNormalized = useRoute()
const router: Router = useRouter()
const authStore = useAuthStore()

// Reactive state with proper typing
const loading: Ref<boolean> = ref(false)
const error: Ref<Error | null> = ref(null)
const selectedItems: Ref<string[]> = ref([])

// Computed properties with explicit return types
const isOwner = computed((): boolean => {
  return authStore.user?.role === 'owner'
})

const componentClasses = computed((): string[] => {
  return [
    'role-based-component',
    `role-based-component--${props.variant}`,
    {
      'role-based-component--disabled': props.disabled,
      'role-based-component--loading': loading.value
    }
  ]
})

// Methods with proper typing
const handleAction = async (action: string, payload?: any): Promise<void> => {
  try {
    loading.value = true
    error.value = null
    
    // Process action
    await processAction(action, payload)
    
    emit('action', action, payload)
  } catch (err) {
    const errorObj = err instanceof Error ? err : new Error(String(err))
    error.value = errorObj
    emit('error', errorObj)
  } finally {
    loading.value = false
  }
}

const processAction = async (action: string, payload?: any): Promise<void> => {
  // Implementation
}

// Expose for template ref access
defineExpose({
  handleAction,
  loading: computed(() => loading.value),
  error: computed(() => error.value)
})
</script>
```

### **Store TypeScript Patterns**

```typescript
// src/stores/typedStore.ts - Enhanced store typing
import { defineStore } from 'pinia'
import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { User, Property, Booking } from '@/types'

// Store state interface
interface StoreState {
  data: Map<string, any>
  loading: boolean
  error: Error | null
  lastUpdated: number | null
}

// Store getters interface
interface StoreGetters {
  hasData: ComputedRef<boolean>
  dataArray: ComputedRef<any[]>
  isLoading: ComputedRef<boolean>
  lastError: ComputedRef<Error | null>
}

// Store actions interface
interface StoreActions {
  fetchData(): Promise<void>
  createItem(item: any): Promise<any>
  updateItem(id: string, updates: Partial<any>): Promise<void>
  deleteItem(id: string): Promise<void>
  clearError(): void
}

// Complete store interface
export interface TypedStore extends StoreState, StoreGetters, StoreActions {}

export const useTypedStore = defineStore('typed', (): TypedStore => {
  // State with explicit types
  const data: Ref<Map<string, any>> = ref(new Map())
  const loading: Ref<boolean> = ref(false)
  const error: Ref<Error | null> = ref(null)
  const lastUpdated: Ref<number | null> = ref(null)

  // Getters with explicit return types
  const hasData: ComputedRef<boolean> = computed(() => data.value.size > 0)
  const dataArray: ComputedRef<any[]> = computed(() => Array.from(data.value.values()))
  const isLoading: ComputedRef<boolean> = computed(() => loading.value)
  const lastError: ComputedRef<Error | null> = computed(() => error.value)

  // Actions with proper typing
  const fetchData = async (): Promise<void> => {
    try {
      loading.value = true
      error.value = null
      
      // Fetch implementation
      
      lastUpdated.value = Date.now()
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      throw err
    } finally {
      loading.value = false
    }
  }

  const createItem = async (item: any): Promise<any> => {
    try {
      loading.value = true
      
      // Create implementation
      const created = { ...item, id: generateId() }
      data.value.set(created.id, created)
      
      return created
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateItem = async (id: string, updates: Partial<any>): Promise<void> => {
    const existing = data.value.get(id)
    if (!existing) {
      throw new Error(`Item with id ${id} not found`)
    }

    try {
      loading.value = true
      
      const updated = { ...existing, ...updates, updated_at: new Date().toISOString() }
      data.value.set(id, updated)
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteItem = async (id: string): Promise<void> => {
    try {
      loading.value = true
      
      if (!data.value.has(id)) {
        throw new Error(`Item with id ${id} not found`)
      }
      
      data.value.delete(id)
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = (): void => {
    error.value = null
  }

  return {
    // State
    data,
    loading,
    error,
    lastUpdated,
    
    // Getters
    hasData,
    dataArray,
    isLoading,
    lastError,
    
    // Actions
    fetchData,
    createItem,
    updateItem,
    deleteItem,
    clearError
  }
})

// Helper to generate IDs
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
```

---

## 🚀 **Getting Started**

### **Implementation Order**

1. **Start with TASK-060** (OwnerSidebar) using the provided template
2. **Apply the patterns** from the store filtering guide (TASK-072)
3. **Set up testing utilities** (TASK-079) for your new components
4. **Run the import audit** (TASK-070) to clean up any inconsistencies
5. **Fix TypeScript issues** (TASK-063) using the typing patterns

### **Quick Start Commands**

```bash
# 1. Create the component
cp docs/examples/OwnerSidebar.vue src/components/smart/owner/OwnerSidebar.vue

# 2. Run import audit
npm run audit:imports

# 3. Fix any import issues
chmod +x scripts/fix-imports.sh && ./scripts/fix-imports.sh

# 4. Run tests
npm run test src/components/smart/owner/

# 5. Type check
npm run type-check
```

### **Verification Checklist**

- [ ] Component follows your existing Vue 3 + TypeScript patterns
- [ ] Uses proper Pinia store integration
- [ ] Implements role-based data filtering
- [ ] Includes comprehensive TypeScript typing
- [ ] Has corresponding unit tests
- [ ] Follows your Vuetify theming conventions
- [ ] Uses correct import paths

This documentation provides the foundation for implementing your critical role-based architecture tasks while maintaining consistency with your existing codebase patterns.