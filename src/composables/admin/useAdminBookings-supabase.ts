import { ref, computed } from 'vue';
import { useSupabaseBookings } from '@/composables/supabase/useSupabaseBookings';
import { useSupabaseProperties } from '@/composables/supabase/useSupabaseProperties';
import { useSupabaseAuth } from '@/composables/supabase/useSupabaseAuth';
import type { Booking, BookingFormData, BookingStatus, Property } from '@/types';

/**
 * MIGRATED: Admin-specific booking composable using Supabase
 * Replaces Pinia store access with database-level admin permissions
 * 
 * ✅ MAINTAINS SAME API: All function names and return types unchanged
 * ✅ SYSTEM-WIDE ACCESS: Admin RLS policies provide access to ALL data
 * ✅ REAL-TIME UPDATES: Database subscriptions for live admin dashboard
 * 
 * Key Changes from Pinia Version:
 * - Pinia store access replaced with Supabase queries
 * - No data filtering (admin sees ALL data via RLS)
 * - Real-time subscriptions for system monitoring
 * - Admin-specific bulk operations
 */
export function useAdminBookings() {
  // Use Supabase composables (Admin RLS allows access to ALL data)
  const supabaseBookings = useSupabaseBookings();
  const supabaseProperties = useSupabaseProperties();
  const supabaseAuth = useSupabaseAuth();
  
  // Admin-specific state (same API as before)
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);
  
  // Get current admin user ID
  const currentAdminId = computed(() => supabaseAuth.user.value?.id);
  
  // COMPUTED PROPERTIES - Admin system-wide data access (NO filtering due to RLS)
  
  /**
   * Get ALL bookings across all owners (no filtering)
   * ✅ SAME API as before, now uses admin RLS policies
   */
  const allBookings = computed((): Booking[] => {
    // Admin RLS policies automatically provide access to ALL bookings
    return supabaseBookings.bookings.value || [];
  });
  
  /**
   * Get ALL properties across all owners (no filtering)
   * ✅ SAME API as before
   */
  const allProperties = computed((): Property[] => {
    // Admin RLS policies automatically provide access to ALL properties
    return supabaseProperties.properties.value || [];
  });
  
  /**
   * Get ALL turn bookings across all properties (system-wide)
   * ✅ SAME API as before
   */
  const systemTurns = computed(() => {
    return allBookings.value.filter(booking => booking.booking_type === 'turn');
  });
  
  /**
   * Get today's turn bookings across ALL properties (system-wide)
   * ✅ SAME API as before
   */
  const systemTodayTurns = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    
    return allBookings.value.filter(booking => 
      booking.booking_type === 'turn' &&
      booking.checkout_date.startsWith(today) &&
      booking.status !== 'completed'
    );
  });
  
  /**
   * Get unassigned bookings across all properties
   * ✅ SAME API as before
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
   * ✅ SAME API as before
   */
  const systemBookingsByStatus = computed(() => {
    const statusGroups: Record<BookingStatus, Booking[]> = {
      'pending': [],
      'scheduled': [],
      'in_progress': [],
      'completed': [],
      'cancelled': []
    };
    
    allBookings.value.forEach(booking => {
      if (statusGroups[booking.status]) {
        statusGroups[booking.status].push(booking);
      }
    });
    
    return statusGroups;
  });
  
  /**
   * Get system turn alerts (critical and urgent turns)
   * ✅ SAME API as before
   */
  const systemTurnAlerts = computed(() => {
    const now = new Date();
    
    return allBookings.value
      .filter(booking => {
        if (booking.booking_type !== 'turn' || booking.status === 'completed') {
          return false;
        }
        
        const checkoutTime = new Date(booking.checkout_date);
        const hoursUntil = (checkoutTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        // Show turns that are within 6 hours or overdue
        return hoursUntil <= 6;
      })
      .sort((a, b) => new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime());
  });
  
  // ADMIN CRUD OPERATIONS - Enhanced with Supabase
  
  /**
   * Admin booking creation (can create for any owner)
   * ✅ SAME API as before
   */
  async function createBooking(data: BookingFormData): Promise<boolean> {
    if (!currentAdminId.value) {
      error.value = 'Admin authentication required';
      return false;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      const result = await supabaseBookings.createBooking(data);
      
      if (result) {
        success.value = 'Booking created successfully';
        loading.value = false;
        return true;
      } else {
        error.value = 'Failed to create booking';
        loading.value = false;
        return false;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Admin booking update (can update any booking)
   * ✅ SAME API as before
   */
  async function updateBooking(id: string, data: Partial<Booking>): Promise<boolean> {
    if (!currentAdminId.value) {
      error.value = 'Admin authentication required';
      return false;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      const result = await supabaseBookings.updateBooking(id, data);
      
      if (result) {
        success.value = 'Booking updated successfully';
        loading.value = false;
        return true;
      } else {
        error.value = 'Failed to update booking';
        loading.value = false;
        return false;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Admin booking deletion (can delete any booking)
   * ✅ SAME API as before
   */
  async function deleteBooking(id: string): Promise<boolean> {
    if (!currentAdminId.value) {
      error.value = 'Admin authentication required';
      return false;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      const result = await supabaseBookings.deleteBooking(id);
      
      if (result) {
        success.value = 'Booking deleted successfully';
        loading.value = false;
        return true;
      } else {
        error.value = 'Failed to delete booking';
        loading.value = false;
        return false;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Assign cleaner to booking (admin-only function)
   * ✅ SAME API as before
   */
  async function assignCleaner(bookingId: string, cleanerId: string): Promise<boolean> {
    return updateBooking(bookingId, { assigned_cleaner_id: cleanerId });
  }
  
  /**
   * Update booking status (admin function)
   * ✅ SAME API as before
   */
  async function updateBookingStatus(bookingId: string, status: BookingStatus): Promise<boolean> {
    return updateBooking(bookingId, { status });
  }
  
  /**
   * Bulk update multiple bookings (admin function)
   * ✅ SAME API as before
   */
  async function bulkUpdateBookings(updates: Array<{ id: string; data: Partial<Booking> }>): Promise<boolean> {
    loading.value = true;
    error.value = null;
    
    try {
      const promises = updates.map(update => updateBooking(update.id, update.data));
      const results = await Promise.all(promises);
      
      const allSuccess = results.every(result => result);
      
      if (allSuccess) {
        success.value = `Successfully updated ${updates.length} bookings`;
        loading.value = false;
        return true;
      } else {
        error.value = 'Some bookings failed to update';
        loading.value = false;
        return false;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Bulk update failed';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Fetch all bookings (admin can see all data)
   * ✅ SAME API as before
   */
  async function fetchAllBookings(): Promise<boolean> {
    if (!currentAdminId.value) {
      error.value = 'Admin authentication required';
      return false;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      const result = await supabaseBookings.fetchBookings();
      
      if (result) {
        success.value = `Loaded ${allBookings.value.length} bookings`;
        loading.value = false;
        return true;
      } else {
        error.value = 'Failed to fetch bookings';
        loading.value = false;
        return false;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch bookings';
      loading.value = false;
      return false;
    }
  }
  
  // ADMIN BUSINESS INTELLIGENCE - Same API as before
  
  /**
   * Get system booking statistics
   * ✅ SAME API as before
   */
  function getSystemBookingStats() {
    const stats = {
      total: allBookings.value.length,
      pending: systemBookingsByStatus.value.pending.length,
      scheduled: systemBookingsByStatus.value.scheduled.length,
      in_progress: systemBookingsByStatus.value.in_progress.length,
      completed: systemBookingsByStatus.value.completed.length,
      cancelled: systemBookingsByStatus.value.cancelled.length,
      turns: systemTurns.value.length,
      unassigned: unassignedBookings.value.length,
      urgent_turns: systemTurnAlerts.value.length
    };
    
    return stats;
  }
  
  /**
   * Get turn priority queue data
   * ✅ SAME API as before
   */
  function getTurnPriorityQueue() {
    const now = new Date();
    
    const criticalTurns = systemTurnAlerts.value.filter(booking => {
      const checkoutTime = new Date(booking.checkout_date);
      const hoursUntil = (checkoutTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursUntil <= 2; // Critical: 2 hours or less
    });
    
    const urgentTurns = systemTurnAlerts.value.filter(booking => {
      const checkoutTime = new Date(booking.checkout_date);
      const hoursUntil = (checkoutTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursUntil > 2 && hoursUntil <= 6; // Urgent: 2-6 hours
    });
    
    return {
      criticalTurns,
      urgentTurns,
      totalUrgent: systemTurnAlerts.value.length,
      unassignedTurns: systemTurnAlerts.value.filter(booking => !booking.assigned_cleaner_id)
    };
  }
  
  /**
   * Clear error and success states
   * ✅ SAME API as before
   */
  function clearMessages() {
    error.value = null;
    success.value = null;
  }
  
  // Return same API as Pinia version - no changes needed in components
  return {
    // Computed state (same API)
    allBookings,
    allProperties,
    systemTurns,
    systemTodayTurns,
    unassignedBookings,
    systemBookingsByStatus,
    systemTurnAlerts,
    
    // CRUD operations (same API)
    createBooking,
    updateBooking,
    deleteBooking,
    fetchAllBookings,
    
    // Admin operations (same API)
    assignCleaner,
    updateBookingStatus,
    bulkUpdateBookings,
    
    // Business intelligence (same API)
    getSystemBookingStats,
    getTurnPriorityQueue,
    
    // State management (same API)
    loading,
    error,
    success,
    clearMessages
  };
}
