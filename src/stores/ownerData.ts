// src/stores/ownerData.ts - Owner-specific data store with caching
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePropertyStore } from '@/stores/property'
import { useBookingStore } from '@/stores/booking'
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
    if (isCacheValid.value && cachedProperties.value.length > 0) {
      return cachedProperties.value
    }

    // Filter and cache new data
    const filtered = Array.from(propertyStore.properties.values())
      .filter(property => property.owner_id === authStore.user?.id)

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
    const filtered = Array.from(bookingStore.bookings.values())
      .filter(booking => booking.owner_id === authStore.user?.id)

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
      ['confirmed', 'scheduled', 'pending'].includes(booking.status)
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

  const todayBookings = computed((): Booking[] => {
    const today = new Date().toISOString().split('T')[0]
    return ownerBookings.value.filter(booking =>
      booking.checkout_date.startsWith(today) ||
      booking.checkin_date.startsWith(today)
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

  // Performance metrics
  const stats = computed(() => ({
    propertiesCount: ownerProperties.value.length,
    activePropertiesCount: activeProperties.value.length,
    bookingsCount: ownerBookings.value.length,
    upcomingBookingsCount: upcomingBookings.value.length,
    urgentTurnsCount: urgentTurns.value.length,
    totalRevenue: ownerBookings.value
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (b.total_cost || 0), 0),
    thisMonthRevenue: ownerBookings.value
      .filter(b => {
        const thisMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
        return b.status === 'completed' && b.checkout_date.startsWith(thisMonth)
      })
      .reduce((sum, b) => sum + (b.total_cost || 0), 0)
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
      const property = propertyStore.addProperty({
        ...propertyData,
        owner_id: authStore.user.id
      } as Property)
      
      // Invalidate cache to refresh data
      invalidateCache()
      
      return property
    } catch (error) {
      console.error('Failed to create owner property:', error)
      return null
    }
  }

  const createOwnerBooking = async (bookingData: Partial<Booking>): Promise<Booking | null> => {
    if (!authStore.user?.id) return null
    
    try {
      const booking = bookingStore.addBooking({
        ...bookingData,
        owner_id: authStore.user.id
      } as Booking)
      
      // Invalidate cache to refresh data
      invalidateCache()
      
      return booking
    } catch (error) {
      console.error('Failed to create owner booking:', error)
      return null
    }
  }

  // Watch for auth changes to invalidate cache
  authStore.$subscribe((mutation, state) => {
    if (mutation.storeId === 'auth' && state.user?.id !== lastOwnerId.value) {
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
    // Core data
    ownerProperties,
    ownerBookings,
    activeProperties,
    upcomingBookings,
    recentBookings,
    urgentTurns,
    todayBookings,
    stats,
    
    // Helpers
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

// Admin data store for system-wide access
export const useAdminDataStore = defineStore('adminData', () => {
  // Dependencies
  const propertyStore = usePropertyStore()
  const bookingStore = useBookingStore()

  // Admin sees ALL data - no filtering
  const allProperties = computed((): Property[] => {
    return Array.from(propertyStore.properties.values())
  })

  const allBookings = computed((): Booking[] => {
    return Array.from(bookingStore.bookings.values())
  })

  // System-wide metrics
  const systemMetrics = computed(() => {
    const properties = allProperties.value
    const bookings = allBookings.value
    const now = new Date()
    
    return {
      totalProperties: properties.length,
      activeProperties: properties.filter(p => p.active).length,
      totalOwners: new Set(properties.map(p => p.owner_id)).size,
      totalBookings: bookings.length,
      upcomingBookings: bookings.filter(b => 
        new Date(b.checkin_date) > now && ['confirmed', 'scheduled'].includes(b.status)
      ).length,
      urgentTurns: bookings.filter(b =>
        b.booking_type === 'turn' &&
        b.status === 'pending' &&
        new Date(b.checkout_date) <= new Date(now.getTime() + 24 * 60 * 60 * 1000)
      ).length,
      totalRevenue: bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.total_cost || 0), 0),
      thisMonthRevenue: bookings
        .filter(b => {
          const thisMonth = new Date().toISOString().slice(0, 7)
          return b.status === 'completed' && b.checkout_date.startsWith(thisMonth)
        })
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