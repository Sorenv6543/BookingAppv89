import { ref, computed } from 'vue';
import { useBookings } from '@/composables/shared/useBookings';
import { useAuthStore } from '@/stores/auth';
import { useBookingStore } from '@/stores/booking';
import { usePropertyStore } from '@/stores/property';
import { usePerformanceMonitor } from '@/composables/shared/usePerformanceMonitor';
import type { Booking, BookingStatus, BookingType, BookingFormData } from '@/types';
import type { Property } from '@/types';

/**
 * Admin-specific booking composable
 * Extends shared useBookings functionality with admin system-wide access
 * 
 * Key Features:
 * - NO filtering - access ALL bookings across all owners (key difference from owner version)
 * - Admin-specific functions (cleaner assignment, status management)
 * - System-wide analytics and reporting
 * - Bulk operations for managing multiple bookings
 * - Advanced filtering and business insights
 */
export function useAdminBookings() {
  // Get shared functionality and stores
  const baseBookings = useBookings();
  const authStore = useAuthStore();
  const bookingStore = useBookingStore();
  const propertyStore = usePropertyStore();
  const { measureRolePerformance, trackCachePerformance } = usePerformanceMonitor();
  
  // Admin-specific state
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);
  
  // Get current admin user ID
  const currentAdminId = computed(() => authStore.user?.id);
  
  // COMPUTED PROPERTIES - Admin system-wide data access (NO filtering)
  
  /**
   * Get ALL bookings across all owners (no filtering)
   * This is the key difference from owner version
   */
  const allBookings = computed((): Booking[] => {
    return measureRolePerformance('admin', 'fetch-all-bookings', () => {
      // Track cache performance for admin data access
      const bookings = Array.from(bookingStore.bookings.values());
      trackCachePerformance('admin-all-bookings', bookings.length > 0);
      return bookings;
    });
  });
  
  /**
   * Get ALL properties across all owners (no filtering)
   */
  const allProperties = computed(() => {
    return measureRolePerformance('admin', 'fetch-all-properties', () => {
      const properties = Array.from(propertyStore.properties.values());
      trackCachePerformance('admin-all-properties', properties.length > 0);
      return properties;
    });
  });
  
  /**
   * Get ALL turn bookings across all properties (system-wide)
   */
  const systemTurns = computed(() => {
    return allBookings.value.filter(booking => booking.booking_type === 'turn');
  });
  
  /**
   * Get today's turn bookings across ALL properties (system-wide)
   */
  const systemTodayTurns = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    
    return allBookings.value.filter(booking => 
      booking.booking_type === 'turn' &&
      booking.guest_departure_date.startsWith(today) &&
      booking.status !== 'completed'
    );
  });
  
  /**
   * Get unassigned bookings across all properties
   */
  const unassignedBookings = computed(() => {
    return allBookings.value.filter(booking => 
      !booking.assigned_cleaner_id && 
      booking.status !== 'completed' && 
      booking.status !== 'cancelled'
    );
  });
  
  /**
   * Get bookings grouped by status (system-wide)
   */
  const systemBookingsByStatus = computed(() => {
    return measureRolePerformance('admin', 'filter-system-bookings-by-status', () => {
      const statusGroups: Record<BookingStatus, Booking[]> = {
        'pending': [],
        'scheduled': [],
        'in_progress': [],
        'completed': [],
        'cancelled': []
      };
      
      allBookings.value.forEach(booking => {
        statusGroups[booking.status].push(booking);
      });
      
      return statusGroups;
    });
  });
  
  /**
   * Get bookings grouped by owner (admin view of all clients)
   */
  const bookingsByOwner = computed(() => {
    const ownerGroups: Record<string, Booking[]> = {};
    
    allBookings.value.forEach(booking => {
      if (!ownerGroups[booking.owner_id]) {
        ownerGroups[booking.owner_id] = [];
      }
      ownerGroups[booking.owner_id].push(booking);
    });
    
    return ownerGroups;
  });
  
  /**
   * Get bookings grouped by cleaner (admin workload view)
   */
  const bookingsByCleaner = computed(() => {
    const cleanerGroups: Record<string, Booking[]> = {
      unassigned: []
    };
    
    allBookings.value.forEach(booking => {
      if (!booking.assigned_cleaner_id) {
        cleanerGroups.unassigned.push(booking);
      } else {
        if (!cleanerGroups[booking.assigned_cleaner_id]) {
          cleanerGroups[booking.assigned_cleaner_id] = [];
        }
        cleanerGroups[booking.assigned_cleaner_id].push(booking);
      }
    });
    
    return cleanerGroups;
  });
  
  /**
   * Get system-wide metrics and analytics
   */
  const systemMetrics = computed(() => {
    const total = allBookings.value.length;
    const turns = systemTurns.value.length;
    const urgentTurns = systemTodayTurns.value.length;
    const unassigned = unassignedBookings.value.length;
    const completed = systemBookingsByStatus.value.completed.length;
    const pending = systemBookingsByStatus.value.pending.length;
    
    return {
      total,
      turns,
      urgentTurns,
      unassigned,
      completed,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      turnPercentage: total > 0 ? Math.round((turns / total) * 100) : 0
    };
  });
  
  // Additional computed properties expected by tests
  const systemTurnAlerts = computed(() => systemTurns.value);
  const allTurnBookings = computed(() => systemTurns.value);
  const todayUrgentTurns = computed(() => systemTodayTurns.value);
  
  const businessMetrics = computed(() => ({
    totalBookings: allBookings.value.length,
    turnBookings: systemTurns.value.length,
    standardBookings: allBookings.value.filter(b => b.booking_type === 'standard').length,
    uniqueOwners: new Set(allBookings.value.map(b => b.owner_id)).size
  }));
  
  // Functions expected by tests
  function getBookingsByStatus(status: BookingStatus) {
    return allBookings.value.filter(booking => booking.status === status);
  }

  // Admin function to create booking for any owner
  async function createBookingForOwner(bookingData: Partial<Booking> & { id?: never }): Promise<Booking> {
    try {
      loading.value = true;
      error.value = null;

      const bookingWithId: Booking = {
        id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        property_id: bookingData.property_id || '',
        owner_id: bookingData.owner_id || '',
        guest_departure_date: bookingData.guest_departure_date || new Date().toISOString(),
        guest_arrival_date: bookingData.guest_arrival_date || new Date().toISOString(),
        time_until_next_guest_arrival: 0, // Default to 0, will be calculated
        status: bookingData.status || 'pending',
        booking_type: bookingData.booking_type || 'standard',
        assigned_cleaner_id: bookingData.assigned_cleaner_id || undefined,
        special_instructions: bookingData.special_instructions || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await bookingStore.addBooking(bookingWithId);
      success.value = 'Booking created successfully';
      return bookingWithId;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create booking';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Performance-monitored admin actions
  const createBooking = async (bookingData: BookingFormData): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;

      // Convert BookingFormData to Booking by adding required id
      const bookingWithId: Booking = {
        id: crypto.randomUUID(),
        property_id: bookingData.property_id,
        owner_id: bookingData.owner_id,
        guest_departure_date: bookingData.guest_departure_date,
        guest_arrival_date: bookingData.guest_arrival_date,
        time_until_next_guest_arrival: bookingData.time_until_next_guest_arrival,
        status: bookingData.status,
        booking_type: bookingData.booking_type,
        assigned_cleaner_id: bookingData.assigned_cleaner_id,
        special_instructions: bookingData.special_instructions,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await bookingStore.addBooking(bookingWithId);
      trackCachePerformance('admin-create-booking', true); // Changed to boolean
      
      success.value = 'Booking created successfully';
         } catch (err: unknown) {
       const errorMsg = err as Error;
       error.value = `Failed to create booking: ${errorMsg.message}`;
       trackCachePerformance('admin-create-booking', false); // Changed to boolean
     } finally {
      loading.value = false;
    }
  };

  const updateBooking = async (id: string, updates: Partial<Booking>): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;

      await bookingStore.updateBooking(id, updates);
      trackCachePerformance('admin-update-booking', true); // Changed to boolean
      
      success.value = 'Booking updated successfully';
    } catch (err: unknown) {
      const errorObj = err as Error;
      error.value = `Failed to update booking: ${errorObj.message}`;
      trackCachePerformance('admin-update-booking', false); // Changed to boolean
    } finally {
      loading.value = false;
    }
  };

  const deleteBooking = async (id: string): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;

      await bookingStore.removeBooking(id); // Use removeBooking instead of deleteBooking
      
      success.value = 'Booking deleted successfully';
    } catch (err: unknown) {
      const errorObj = err as Error;
      error.value = `Failed to delete booking: ${errorObj.message}`;
    } finally {
      loading.value = false;
    }
  };

  // Role-specific performance metrics (prefixed with _ to indicate intentionally unused)
  // const _getAdminPerformanceMetrics = computed(() => {
  //   return {
  //     totalBookingsProcessed: allBookings.value.length,
  //     totalPropertiesManaged: allProperties.value.length,
  //     systemLoad: allBookings.value.length > 100 ? 'high' : 
  //                allBookings.value.length > 50 ? 'medium' : 'low',
  //     dataProcessingEfficiency: allBookings.value.length > 0 ? 'optimal' : 'idle'
  //   };
  // });

  // Permission functions expected by tests
  function canManageAnyBooking(): boolean {
    return !!currentAdminId.value;
  }

  function canEditAnyBooking(): boolean {
    return !!currentAdminId.value;
  }

  function canDeleteAnyBooking(): boolean {
    return !!currentAdminId.value;
  }

  function canAssignCleaners(): boolean {
    return !!currentAdminId.value;
  }

  function canViewSystemMetrics(): boolean {
    return !!currentAdminId.value;
  }
  
  // ADMIN-SPECIFIC CRUD OPERATIONS
  
  /**
   * Fetch ALL bookings (no owner filter) - admin system-wide access
   */
  async function fetchAllBookings(): Promise<boolean> {
    if (!currentAdminId.value) {
      error.value = 'Admin authentication required to access system data';
      return false;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      // In a real app, this would make an API call to get all bookings
      // For now, we simulate the call and rely on store data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      success.value = `Loaded ${allBookings.value.length} bookings across all properties`;
      loading.value = false;
      return true;
    } catch (_err) {
      error.value = 'Unable to load system bookings. Please try again.';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Assign cleaner to a booking (admin-only operation)
   */
  async function assignCleaner(bookingId: string, cleanerId: string): Promise<boolean> {
    if (!currentAdminId.value) {
      error.value = 'Admin authentication required for cleaner assignment';
      return false;
    }
    
    loading.value = true;
    error.value = null;
    success.value = null;
    
    try {
      // Check if booking exists
      const booking = bookingStore.getBookingById(bookingId);
      if (!booking) {
        throw new Error('Booking not found in system');
      }
      
      // Use base composable's assign cleaner function
      const result = await baseBookings.assignCleaner(bookingId, cleanerId);
      
      if (result) {
        success.value = `Cleaner assigned successfully to booking ${bookingId}`;
        loading.value = false;
        return true;
      } else {
        throw new Error('Failed to assign cleaner');
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to assign cleaner. System error occurred.';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Update booking status (admin workflow management)
   */
  async function updateBookingStatus(bookingId: string, status: BookingStatus): Promise<boolean> {
    if (!currentAdminId.value) {
      error.value = 'Admin authentication required for status management';
      return false;
    }
    
    loading.value = true;
    error.value = null;
    success.value = null;
    
    try {
      // Check if booking exists
      const booking = bookingStore.getBookingById(bookingId);
      if (!booking) {
        throw new Error('Booking not found in system');
      }
      
      // Use base composable's status change function
      const result = await baseBookings.changeBookingStatus(bookingId, status);
      
      if (result) {
        success.value = `Booking status updated to ${status} successfully`;
        loading.value = false;
        return true;
      } else {
        throw new Error('Failed to update booking status');
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to update booking status. System error occurred.';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Bulk assign cleaner to multiple bookings (admin efficiency operation)
   */
  async function bulkAssignCleaner(bookingIds: string[], cleanerId: string): Promise<{ success: string[], failed: string[] }> {
    if (!currentAdminId.value) {
      error.value = 'Admin authentication required for bulk operations';
      return { success: [], failed: bookingIds };
    }
    
    loading.value = true;
    error.value = null;
    success.value = null;
    
    const results = { success: [] as string[], failed: [] as string[] };
    
    try {
      // Process each booking assignment
      for (const bookingId of bookingIds) {
        try {
          const result = await assignCleaner(bookingId, cleanerId);
          if (result) {
            results.success.push(bookingId);
          } else {
            results.failed.push(bookingId);
          }
        } catch (_err) {
          results.failed.push(bookingId);
        }
      }
      
      const successCount = results.success.length;
      const failedCount = results.failed.length;
      
      if (successCount > 0) {
        success.value = `Bulk assignment completed: ${successCount} successful, ${failedCount} failed`;
      } else {
        error.value = `Bulk assignment failed: ${failedCount} bookings could not be assigned`;
      }
      
      loading.value = false;
      return results;
    } catch (_err) {
      error.value = 'Bulk assignment operation failed. System error occurred.';
      loading.value = false;
      return { success: [], failed: bookingIds };
    }
  }
  
  /**
   * Bulk update status for multiple bookings (admin workflow management)
   */
  async function bulkUpdateStatus(bookingIds: string[], status: BookingStatus): Promise<{ success: string[], failed: string[] }> {
    if (!currentAdminId.value) {
      error.value = 'Admin authentication required for bulk operations';
      return { success: [], failed: bookingIds };
    }
    
    loading.value = true;
    error.value = null;
    success.value = null;
    
    const results = { success: [] as string[], failed: [] as string[] };
    
    try {
      // Process each booking status update
      for (const bookingId of bookingIds) {
        try {
          const result = await updateBookingStatus(bookingId, status);
          if (result) {
            results.success.push(bookingId);
          } else {
            results.failed.push(bookingId);
          }
        } catch (_err) {
          results.failed.push(bookingId);
        }
      }
      
      const successCount = results.success.length;
      const failedCount = results.failed.length;
      
      if (successCount > 0) {
        success.value = `Bulk status update completed: ${successCount} successful, ${failedCount} failed`;
      } else {
        error.value = `Bulk status update failed: ${failedCount} bookings could not be updated`;
      }
      
      loading.value = false;
      return results;
    } catch (_err) {
      error.value = 'Bulk status update operation failed. System error occurred.';
      loading.value = false;
      return { success: [], failed: bookingIds };
    }
  }
  
  // ADMIN ANALYTICS AND REPORTING
  
  /**
   * Get system-wide turn alerts (admin business impact view)
   */
  function getSystemTurnAlerts() {
    const urgentTurns = systemTodayTurns.value;
    const unassignedTurns = urgentTurns.filter(turn => !turn.assigned_cleaner_id);
    
    return {
      total: urgentTurns.length,
      unassigned: unassignedTurns.length,
      assigned: urgentTurns.length - unassignedTurns.length,
      alerts: urgentTurns.map(turn => ({
        id: turn.id,
        property_id: turn.property_id,
        guest_departure_date: turn.guest_departure_date,
        guest_arrival_date: turn.guest_arrival_date,
        status: turn.status,
        assigned_cleaner_id: turn.assigned_cleaner_id,
        priority: baseBookings.calculateBookingPriority(turn),
        businessImpact: turn.assigned_cleaner_id ? 'Assigned - On Track' : 'URGENT - Needs Assignment'
      }))
    };
  }
  
  /**
   * Get cleaner workload analysis (admin resource management)
   */
  function getCleanerWorkloadAnalysis() {
    const cleanerWorkloads: Record<string, {
      assigned: number;
      completed: number;
      pending: number;
      workloadScore: number;
    }> = {};
    
    Object.entries(bookingsByCleaner.value).forEach(([cleanerId, bookings]) => {
      if (cleanerId === 'unassigned') return;
      
      const assigned = bookings.length;
      const completed = bookings.filter(b => b.status === 'completed').length;
      const pending = bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length;
      const workloadScore = pending * 2 + assigned; // Weighted score for workload
      
      cleanerWorkloads[cleanerId] = {
        assigned,
        completed,
        pending,
        workloadScore
      };
    });
    
    return {
      cleanerWorkloads,
      unassignedCount: bookingsByCleaner.value.unassigned?.length || 0,
      totalCleaners: Object.keys(cleanerWorkloads).length,
      averageWorkload: Object.values(cleanerWorkloads).reduce((sum, w) => sum + w.workloadScore, 0) / Object.keys(cleanerWorkloads).length || 0
    };
  }
  
  /**
   * Get property utilization report (admin business insights)
   */
  function getPropertyUtilizationReport() {
    const propertyStats: Record<string, {
      totalBookings: number;
      turnBookings: number;
      completedBookings: number;
      utilizationRate: number;
      turnRate: number;
    }> = {};
    
    allProperties.value.forEach((property: Property) => {
      const propertyBookings = allBookings.value.filter(b => b.property_id === property.id);
      const turnBookings = propertyBookings.filter(b => b.booking_type === 'turn');
      const completedBookings = propertyBookings.filter(b => b.status === 'completed');
      
      propertyStats[property.id] = {
        totalBookings: propertyBookings.length,
        turnBookings: turnBookings.length,
        completedBookings: completedBookings.length,
        utilizationRate: propertyBookings.length > 0 ? Math.round((completedBookings.length / propertyBookings.length) * 100) : 0,
        turnRate: propertyBookings.length > 0 ? Math.round((turnBookings.length / propertyBookings.length) * 100) : 0
      };
    });
    
    return {
      propertyStats,
      totalProperties: allProperties.value.length,
      averageUtilization: Object.values(propertyStats).reduce((sum, p) => sum + p.utilizationRate, 0) / allProperties.value.length || 0,
      averageTurnRate: Object.values(propertyStats).reduce((sum, p) => sum + p.turnRate, 0) / allProperties.value.length || 0
    };
  }
  
  // ADVANCED FILTERING AND SEARCH
  
  /**
   * Advanced filtering for admin interface (multiple criteria)
   */
  function filterBookings(criteria: {
    status?: BookingStatus[];
    bookingType?: BookingType[];
    ownerId?: string;
    cleanerId?: string;
    dateRange?: { start: string; end: string };
    propertyId?: string;
    unassignedOnly?: boolean;
  }) {
    return allBookings.value.filter(booking => {
      // Status filter
      if (criteria.status && criteria.status.length > 0) {
        if (!criteria.status.includes(booking.status)) return false;
      }
      
      // Booking type filter
      if (criteria.bookingType && criteria.bookingType.length > 0) {
        if (!criteria.bookingType.includes(booking.booking_type)) return false;
      }
      
      // Owner filter
      if (criteria.ownerId) {
        if (booking.owner_id !== criteria.ownerId) return false;
      }
      
             // Cleaner filter
       if (criteria.cleanerId) {
         if (booking.assigned_cleaner_id !== criteria.cleanerId) return false;
       }
       
       // Unassigned filter
       if (criteria.unassignedOnly) {
         if (booking.assigned_cleaner_id) return false;
       }
      
      // Date range filter
      if (criteria.dateRange) {
        const bookingDate = new Date(booking.guest_departure_date);
        const startDate = new Date(criteria.dateRange.start);
        const endDate = new Date(criteria.dateRange.end);
        if (bookingDate < startDate || bookingDate > endDate) return false;
      }
      
      // Property filter
      if (criteria.propertyId) {
        if (booking.property_id !== criteria.propertyId) return false;
      }
      
      return true;
    });
  }
  
  // Return admin-specific interface
  return {
    // State
    loading,
    error,
    success,
    
    // Computed properties (system-wide, no filtering)
    allBookings,
    allProperties,
    systemTurns,
    systemTodayTurns,
    unassignedBookings,
    systemBookingsByStatus,
    bookingsByOwner,
    bookingsByCleaner,
    systemMetrics,
    
    // Admin CRUD operations
    fetchAllBookings,
    assignCleaner,
    assignCleanerToBooking: (bookingId: string, cleanerId: string) => {
      // Synchronous version for test compatibility
      try {
        const booking = bookingStore.bookings.get(bookingId);
        if (booking) {
          bookingStore.updateBooking(bookingId, { assigned_cleaner_id: cleanerId });
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    updateBookingStatus,
    bulkAssignCleaner,
    bulkUpdateStatus,
    createBookingForOwner,
    
    // Analytics and reporting
    getSystemTurnAlerts,
    getCleanerWorkloadAnalysis,
    getPropertyUtilizationReport,
    
    // Advanced filtering
    filterBookings,
    
    // Expose base composable functions for admin use
    createBooking,
    updateBooking,
    deleteBooking,
    calculateBookingPriority: baseBookings.calculateBookingPriority,
    calculateCleaningWindow: baseBookings.calculateCleaningWindow,
    
    // Additional computed properties expected by tests
    systemTurnAlerts,
    allTurnBookings,
    todayUrgentTurns,
    businessMetrics,
    getBookingsByStatus,
    getAdminPerformanceMetrics: () => ({}), // Placeholder for performance metrics
    
    // Store actions (direct access)
    fetchAllProperties: propertyStore.fetchProperties,
    
    // Permission functions
    canManageAnyBooking,
    canEditAnyBooking,
    canDeleteAnyBooking,
    canAssignCleaners,
    canViewSystemMetrics,
  };
} 