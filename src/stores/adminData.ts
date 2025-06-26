// src/stores/adminData.ts - Admin-specific data store for system-wide access
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { usePropertyStore } from '@/stores/property'
import { useBookingStore } from '@/stores/booking'
import { 
  calculateSystemMetrics,
  getUrgentTurns,
  getUpcomingBookings,
  getRecentBookings
} from '@/utils/businessLogic'
import type { Property, Booking } from '@/types'

// Admin data store for system-wide access
export const useAdminDataStore = defineStore('adminData', () => {
  // Dependencies
  const propertyStore = usePropertyStore()
  const bookingStore = useBookingStore()

  // Cache for expensive operations
  const cacheTimestamp = ref(0)
  const cachedOwnerAnalytics = ref<OwnerStats[]>([])
  const cachedAlerts = ref<Alert[]>([])
  const CACHE_TTL = 15000 // 15 seconds for admin calculations

  // Cache management
  const isCacheValid = computed(() => {
    return (Date.now() - cacheTimestamp.value) < CACHE_TTL
  })

  const invalidateCache = () => {
    cacheTimestamp.value = 0
    cachedOwnerAnalytics.value = []
    cachedAlerts.value = []
  }

  // Admin sees ALL data - no filtering (maintain Map structure for O(1) performance)
  const allProperties = computed((): Map<string, Property> => {
    return propertyStore.properties // Direct Map reference - no conversion overhead
  })

  const allBookings = computed((): Map<string, Booking> => {
    return bookingStore.bookings // Direct Map reference - no conversion overhead
  })

  // Array getters only when specifically needed for UI components
  const allPropertiesArray = computed((): Property[] => {
    return Array.from(propertyStore.properties.values())
  })

  const allBookingsArray = computed((): Booking[] => {
    return Array.from(bookingStore.bookings.values())
  })

  // System-wide metrics using extracted business logic
  const systemMetrics = computed(() => {
    // Use extracted utility function to eliminate duplication
    const baseMetrics = calculateSystemMetrics(allProperties.value, allBookings.value)
    
    // Add admin-specific revenue calculation when available
    return {
      ...baseMetrics,
      totalRevenue: 0, // Will be calculated when amount field exists
      thisMonthRevenue: 0 // Will be calculated when amount field exists
    }
  })

  // Pre-computed Maps using business logic utilities
  const urgentTurnsMap = computed((): Map<string, Booking> => {
    return getUrgentTurns(allBookings.value)
  })

  const upcomingBookingsMap = computed((): Map<string, Booking> => {
    return getUpcomingBookings(allBookings.value)
  })

  const recentBookingsMap = computed((): Map<string, Booking> => {
    return getRecentBookings(allBookings.value, 30)
  })

  // Owner performance analytics
  interface OwnerStats {
    ownerId: string
    ownerName: string
    properties: Property[]
    bookings: Booking[]
    revenue: number
    avgOccupancy: number
  }

  const ownerAnalytics = computed((): OwnerStats[] => {
    if (isCacheValid.value && cachedOwnerAnalytics.value.length > 0) {
      return cachedOwnerAnalytics.value
    }

    const ownerStats = new Map<string, OwnerStats>()
    
    // Efficient Map iteration for properties
    allProperties.value.forEach(property => {
      const ownerId = property.owner_id
      if (!ownerStats.has(ownerId)) {
        ownerStats.set(ownerId, {
          ownerId,
          ownerName: `Owner ${ownerId.substring(0, 8)}`, // Generate a name since owner_name doesn't exist
          properties: [],
          bookings: [],
          revenue: 0,
          avgOccupancy: 0
        })
      }
      ownerStats.get(ownerId)!.properties.push(property)
    })

    // Efficient Map iteration for bookings
    allBookings.value.forEach(booking => {
      const ownerId = booking.owner_id
      if (ownerStats.has(ownerId)) {
        const stats = ownerStats.get(ownerId)!
        stats.bookings.push(booking)
        // Note: Revenue calculation commented out until Booking type includes amount field
        // if (booking.status === 'completed') {
        //   stats.revenue += booking.amount || 0
        // }
      }
    })

    const result = Array.from(ownerStats.values())
    cachedOwnerAnalytics.value = result
    cacheTimestamp.value = Date.now()

    return result
  })

  // Critical alerts for admin
  interface Alert {
    type: 'warning' | 'error' | 'info'
    title: string
    message: string
    count: number
    action: string
  }

  const criticalAlerts = computed((): Alert[] => {
    if (isCacheValid.value && cachedAlerts.value.length > 0) {
      return cachedAlerts.value
    }

    const alerts: Alert[] = []
    const now = new Date()
    const twentyFourHours = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Efficient single-pass counting using Map iteration
    let unassignedCount = 0
    let overdueCount = 0
    const propertyBookingCounts = new Map<string, number>()

    allBookings.value.forEach(booking => {
      const checkoutDate = new Date(booking.checkout_date)
      const checkinDate = new Date(booking.checkin_date)

      // Count unassigned cleanings
      if (!booking.assigned_cleaner_id && // Note: using assigned_cleaner_id from Booking interface
          booking.status === 'pending' &&
          checkoutDate <= twentyFourHours) {
        unassignedCount++
      }

      // Count overdue turns
      if (booking.booking_type === 'turn' &&
          booking.status === 'pending' &&
          checkoutDate < now) {
        overdueCount++
      }

      // Track recent bookings by property for inactive property detection
      if (checkinDate >= thirtyDaysAgo) {
        const currentCount = propertyBookingCounts.get(booking.property_id) || 0
        propertyBookingCounts.set(booking.property_id, currentCount + 1)
      }
    })

    // Count inactive properties efficiently
    let inactivePropertiesCount = 0
    allProperties.value.forEach(property => {
      if (property.active && !propertyBookingCounts.has(property.id)) {
        inactivePropertiesCount++
      }
    })

    // Generate alerts based on counts
    if (unassignedCount > 0) {
      alerts.push({
        type: 'warning',
        title: 'Unassigned Cleanings',
        message: `${unassignedCount} cleanings need cleaner assignment`,
        count: unassignedCount,
        action: 'assign-cleaners'
      })
    }

    if (overdueCount > 0) {
      alerts.push({
        type: 'error',
        title: 'Overdue Turns',
        message: `${overdueCount} turns are overdue`,
        count: overdueCount,
        action: 'urgent-turns'
      })
    }

    if (inactivePropertiesCount > 0) {
      alerts.push({
        type: 'info',
        title: 'Inactive Properties',
        message: `${inactivePropertiesCount} properties have no recent bookings`,
        count: inactivePropertiesCount,
        action: 'review-properties'
      })
    }

    cachedAlerts.value = alerts
    return alerts
  })

  // Performance insights using efficient Map operations
  const performanceInsights = computed(() => {
    const properties = allProperties.value
    const bookings = allBookings.value
    const recentBookings = recentBookingsMap.value

    let totalProperties = 0
    let totalBookings = 0
    let turnBookings = 0
    let completedBookings = 0

    // Count properties efficiently
    properties.forEach(() => totalProperties++)

    // Single pass through bookings for all metrics
    bookings.forEach(booking => {
      totalBookings++
      
      if (booking.booking_type === 'turn') {
        turnBookings++
      }
      
      if (booking.status === 'completed') {
        completedBookings++
      }
    })

    return {
      avgBookingsPerProperty: totalProperties > 0 
        ? Math.round((recentBookings.size / totalProperties) * 100) / 100
        : 0,
      turnPercentage: totalBookings > 0
        ? Math.round((turnBookings / totalBookings) * 100)
        : 0,
      completionRate: totalBookings > 0
        ? Math.round((completedBookings / totalBookings) * 100)
        : 0,
      avgRevenue: 0 // Will be calculated when amount field exists
    }
  })

  // Watch for store changes to invalidate cache
  propertyStore.$subscribe(() => {
    invalidateCache()
  })

  bookingStore.$subscribe(() => {
    invalidateCache()
  })

  return {
    // System data - Map references for O(1) performance
    allProperties,
    allBookings,
    
    // Pre-computed Maps using business logic
    urgentTurnsMap,
    upcomingBookingsMap,
    recentBookingsMap,
    
    // Array getters for UI components that need arrays
    allPropertiesArray,
    allBookingsArray,
    
    // Business intelligence
    systemMetrics,
    ownerAnalytics,
    criticalAlerts,
    performanceInsights,
    
    // Cache management
    invalidateCache
  }
}) 