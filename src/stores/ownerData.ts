// src/stores/ownerData.ts - Owner-specific data store with caching
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePropertyStore } from '@/stores/property'
import { useBookingStore } from '@/stores/booking'
import { 
  getUrgentTurns,
  getUpcomingBookings,
  getRecentBookings
} from '@/utils/businessLogic'
import type { Property, Booking } from '@/types'

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

  // Core owner data getters with caching (maintaining Map structure for O(1) performance)
  const ownerPropertiesMap = computed((): Map<string, Property> => {
    if (!authStore.user?.id) return new Map()

    const filtered = new Map<string, Property>()
    propertyStore.properties.forEach((property, id) => {
      if (property.owner_id === authStore.user?.id) {
        filtered.set(id, property)
      }
    })

    return filtered
  })

  const ownerBookingsMap = computed((): Map<string, Booking> => {
    if (!authStore.user?.id) return new Map()

    const filtered = new Map<string, Booking>()
    bookingStore.bookings.forEach((booking, id) => {
      if (booking.owner_id === authStore.user?.id) {
        filtered.set(id, booking)
      }
    })

    return filtered
  })

  // Array getters for components that need arrays (cached for performance)
  const ownerProperties = computed((): Property[] => {
    if (!authStore.user?.id) return []

    // Return cached data if valid
    if (isCacheValid.value && cachedProperties.value.length > 0) {
      return cachedProperties.value
    }

    // Filter and cache new data efficiently
    const filtered: Property[] = []
    propertyStore.properties.forEach(property => {
      if (property.owner_id === authStore.user?.id) {
        filtered.push(property)
      }
    })

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

    // Filter and cache new data efficiently
    const filtered: Booking[] = []
    bookingStore.bookings.forEach(booking => {
      if (booking.owner_id === authStore.user?.id) {
        filtered.push(booking)
      }
    })

    cachedBookings.value = filtered
    return filtered
  })

  // Derived owner data using Maps and business logic utilities
  const activePropertiesMap = computed((): Map<string, Property> => {
    const activeMap = new Map<string, Property>()
    ownerPropertiesMap.value.forEach((property, id) => {
      if (property.active) {
        activeMap.set(id, property)
      }
    })
    return activeMap
  })

  const activeProperties = computed((): Property[] => {
    return Array.from(activePropertiesMap.value.values())
  })

  // Use business logic utilities for filtering
  const upcomingBookingsMap = computed((): Map<string, Booking> => {
    return getUpcomingBookings(ownerBookingsMap.value)
  })

  const upcomingBookings = computed((): Booking[] => {
    return Array.from(upcomingBookingsMap.value.values())
  })

  const recentBookingsMap = computed((): Map<string, Booking> => {
    return getRecentBookings(ownerBookingsMap.value, 30)
  })

  const recentBookings = computed((): Booking[] => {
    return Array.from(recentBookingsMap.value.values())
      .sort((a, b) => 
        new Date(b.checkout_date).getTime() - new Date(a.checkout_date).getTime()
      )
  })

  const urgentTurnsMap = computed((): Map<string, Booking> => {
    return getUrgentTurns(ownerBookingsMap.value)
  })

  const urgentTurns = computed((): Booking[] => {
    return Array.from(urgentTurnsMap.value.values())
  })

  const todayBookingsMap = computed((): Map<string, Booking> => {
    const today = new Date().toISOString().split('T')[0]
    const todayMap = new Map<string, Booking>()
    
    ownerBookingsMap.value.forEach((booking, id) => {
      if (booking.checkout_date.startsWith(today) ||
          booking.checkin_date.startsWith(today)) {
        todayMap.set(id, booking)
      }
    })
    
    return todayMap
  })

  const todayBookings = computed((): Booking[] => {
    return Array.from(todayBookingsMap.value.values())
  })

  // Property-specific helpers using Maps
  const getPropertyBookingsMap = (propertyId: string): Map<string, Booking> => {
    const propertyBookings = new Map<string, Booking>()
    ownerBookingsMap.value.forEach((booking, id) => {
      if (booking.property_id === propertyId) {
        propertyBookings.set(id, booking)
      }
    })
    return propertyBookings
  }

  const getPropertyBookings = (propertyId: string): Booking[] => {
    return Array.from(getPropertyBookingsMap(propertyId).values())
  }

  const getPropertyStats = (propertyId: string) => {
    const bookingsMap = getPropertyBookingsMap(propertyId)
    const thisMonth = new Date()
    thisMonth.setDate(1)
    
    let thisMonthCount = 0
    bookingsMap.forEach(booking => {
      if (new Date(booking.checkin_date) >= thisMonth) {
        thisMonthCount++
      }
    })

    return {
      totalBookings: bookingsMap.size,
      thisMonthBookings: thisMonthCount,
      avgNightly: 0, // Will be implemented when booking pricing is added
      occupancyRate: calculateOccupancyRate(propertyId)
    }
  }

  const calculateOccupancyRate = (propertyId: string): number => {
    const bookingsMap = getPropertyBookingsMap(propertyId)
    if (bookingsMap.size === 0) return 0

    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    let bookedDays = 0
    bookingsMap.forEach(booking => {
      const checkin = new Date(booking.checkin_date)
      const checkout = new Date(booking.checkout_date)
      
      if (checkin >= lastMonth && checkout <= thisMonth) {
        bookedDays += Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24))
      }
    })

    const totalDays = Math.ceil((thisMonth.getTime() - lastMonth.getTime()) / (1000 * 60 * 60 * 24))
    return Math.round((bookedDays / totalDays) * 100)
  }

  // Performance metrics using efficient Map operations
  const stats = computed(() => ({
    propertiesCount: ownerPropertiesMap.value.size,
    activePropertiesCount: activePropertiesMap.value.size,
    bookingsCount: ownerBookingsMap.value.size,
    upcomingBookingsCount: upcomingBookingsMap.value.size,
    urgentTurnsCount: urgentTurnsMap.value.size,
    totalRevenue: 0, // Revenue tracking will be implemented when booking pricing is added
    thisMonthRevenue: 0 // Revenue tracking will be implemented when booking pricing is added
  }))

  // Actions
  const refreshOwnerData = async (): Promise<void> => {
    invalidateCache()
    // Force refresh of base stores
    await Promise.allSettled([
      propertyStore.fetchProperties?.() || Promise.resolve(),
      bookingStore.fetchBookings?.() || Promise.resolve()
    ])
  }

  const createOwnerProperty = async (propertyData: Partial<Property>): Promise<Property | null> => {
    if (!authStore.user?.id) return null
    
    try {
      propertyStore.addProperty({
        ...propertyData,
        owner_id: authStore.user.id
      } as Property)
      
      // Invalidate cache to refresh data
      invalidateCache()
      
      // Return the created property from the store
      const createdProperty = Array.from(propertyStore.properties.values())
        .find(p => p.owner_id === authStore.user?.id && p.name === propertyData.name)
      
      return createdProperty || null
    } catch (error) {
      console.error('Failed to create owner property:', error)
      return null
    }
  }

  const createOwnerBooking = async (bookingData: Partial<Booking>): Promise<Booking | null> => {
    if (!authStore.user?.id) return null
    
    try {
      bookingStore.addBooking({
        ...bookingData,
        owner_id: authStore.user.id
      } as Booking)
      
      // Invalidate cache to refresh data
      invalidateCache()
      
      // Return the created booking from the store
      const createdBooking = Array.from(bookingStore.bookings.values())
        .find(b => b.owner_id === authStore.user?.id && b.property_id === bookingData.property_id)
      
      return createdBooking || null
    } catch (error) {
      console.error('Failed to create owner booking:', error)
      return null
    }
  }

  // Watch for auth changes to invalidate cache
  authStore.$subscribe((mutation) => {
    if (mutation.storeId === 'auth' && authStore.user?.id !== lastOwnerId.value) {
      invalidateCache()
    }
  })

  // Watch for property/booking changes to invalidate cache
  propertyStore.$subscribe(() => {
    invalidateCache()
  })

  bookingStore.$subscribe(() => {
    invalidateCache()
  })

  return {
    // Core data - Map references for O(1) performance
    ownerPropertiesMap,
    ownerBookingsMap,
    activePropertiesMap,
    upcomingBookingsMap,
    recentBookingsMap,
    urgentTurnsMap,
    todayBookingsMap,
    
    // Array getters for UI components that need arrays
    ownerProperties,
    ownerBookings,
    activeProperties,
    upcomingBookings,
    recentBookings,
    urgentTurns,
    todayBookings,
    stats,
    
    // Helpers - Map-based
    getPropertyBookingsMap,
    getPropertyBookings,
    getPropertyStats,
    
    // Actions
    refreshOwnerData,
    createOwnerProperty,
    createOwnerBooking,
    invalidateCache,
    
    // Cache info (for debugging)
    isCacheValid,
    cacheTimestamp: computed(() => cacheTimestamp.value)
  }
})

