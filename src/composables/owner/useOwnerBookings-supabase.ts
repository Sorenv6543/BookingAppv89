import { ref, computed } from 'vue';
import { useSupabaseBookings } from '@/composables/supabase/useSupabaseBookings';
import { useSupabaseProperties } from '@/composables/supabase/useSupabaseProperties';
import { useSupabaseAuth } from '@/composables/supabase/useSupabaseAuth';
import type { Booking, BookingFormData, BookingStatus, Property } from '@/types';

/**
 * MIGRATED: Owner-specific booking composable using Supabase
 * Replaces frontend filtering with database-level RLS security
 * 
 * ✅ MAINTAINS SAME API: All function names and return types unchanged
 * ✅ AUTOMATIC FILTERING: RLS policies ensure owners see only their data
 * ✅ REAL-TIME UPDATES: Database subscriptions replace computed properties
 * 
 * Key Changes from Pinia Version:
 * - Frontend filtering replaced with RLS policies
 * - Pinia store access replaced with Supabase queries
 * - Real-time subscriptions instead of reactive computed
 * - Automatic owner_id assignment
 */
export function useOwnerBookings() {
  // Use Supabase composables (RLS automatically filters data)
  const supabaseBookings = useSupabaseBookings();
  const supabaseProperties = useSupabaseProperties();
  const supabaseAuth = useSupabaseAuth();
  
  // Owner-specific state (same as before)
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);
  
  // Get current user ID (same API as before)
  const currentUserId = computed(() => supabaseAuth.user.value?.id);
  
  // COMPUTED PROPERTIES - Now automatically filtered by RLS
  
  /**
   * Get all bookings for the current owner only
   * ✅ SAME API as before, but now uses RLS instead of frontend filtering
   */
  const myBookings = computed(() => {
    // RLS policies automatically filter to owner's bookings
    const bookingsArray = supabaseBookings.bookings.value;
    // Convert array to Map for compatibility with existing components
    const bookingsMap = new Map<string, Booking>();
    bookingsArray.forEach(booking => bookingsMap.set(booking.id, booking));
    return bookingsMap;
  });
  
  /**
   * Get current owner's properties only  
   * ✅ SAME API as before, but now uses RLS instead of frontend filtering
   */
  const myProperties = computed(() => {
    // RLS policies automatically filter to owner's properties
    const propertiesArray = supabaseProperties.properties.value;
    // Convert array to Map for compatibility with existing components
    const propertiesMap = new Map<string, Property>();
    propertiesArray.forEach(property => propertiesMap.set(property.id, property));
    return propertiesMap;
  });
  
  /**
   * Get today's turn bookings for current owner only
   * ✅ SAME API as before
   */
  const myTodayTurns = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    
    return Array.from(myBookings.value.values()).filter(booking => 
      booking.booking_type === 'turn' &&
      booking.checkout_date.startsWith(today) &&
      booking.status !== 'completed'
    );
  });
  
  /**
   * Get upcoming cleanings for current owner (next 7 days)
   * ✅ SAME API as before
   */
  const myUpcomingCleanings = computed(() => {
    return supabaseBookings.upcomingCleanings.value;
  });

  /**
   * Alias for compatibility - some components use myUpcomingBookings
   * ✅ API COMPATIBILITY
   */
  const myUpcomingBookings = myUpcomingCleanings;
  
  /**
   * Get bookings by status for current owner
   * ✅ SAME API as before
   */
  const myBookingsByStatus = computed(() => {
    return supabaseBookings.bookingsByStatus.value;
  });
  
  /**
   * Get all turn bookings for the current owner
   * ✅ SAME API as before
   */
  const myTurnBookings = computed(() => {
    return Array.from(myBookings.value.values()).filter(booking => booking.booking_type === 'turn');
  });

  /**
   * Get all standard bookings for the current owner
   * ✅ SAME API as before
   */
  const myStandardBookings = computed(() => {
    return Array.from(myBookings.value.values()).filter(booking => booking.booking_type === 'standard');
  });

  /**
   * Get today's bookings for the current owner
   * ✅ SAME API as before
   */
  const myTodayBookings = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return Array.from(myBookings.value.values()).filter(booking => booking.checkout_date.startsWith(today));
  });
  
  // OWNER-SPECIFIC CRUD OPERATIONS - Same API, different implementation
  
  /**
   * Fetch current owner's bookings only
   * ✅ SAME API as before, but now uses Supabase with RLS
   */
  async function fetchMyBookings(): Promise<boolean> {
    if (!currentUserId.value) {
      error.value = 'Please log in to view your bookings';
      return false;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      // Supabase query with automatic RLS filtering
      const bookings = await supabaseBookings.fetchBookings();
      
      success.value = `Loaded ${bookings.length} of your bookings`;
      loading.value = false;
      return true;
    } catch (err) {
      error.value = 'Unable to load your bookings. Please try again.';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Create a new booking for the current owner
   * ✅ SAME API as before, but now uses Supabase with automatic owner_id
   */
  async function createMyBooking(formData: BookingFormData): Promise<string | null> {
    if (!currentUserId.value) {
      error.value = 'Please log in to create bookings';
      return null;
    }
    
    loading.value = true;
    error.value = null;
    success.value = null;
    
    try {
      // Validate that the property belongs to the current owner
      const property = await supabaseProperties.getPropertyById(formData.property_id);
      if (!property) {
        throw new Error('Property not found');
      }
      
      // Create booking (owner_id automatically assigned by Supabase composable)
      const bookingFormData: BookingFormData = {
        property_id: formData.property_id || '',
        checkout_date: formData.checkout_date || '',
        checkin_date: formData.checkin_date || '',
        booking_type: formData.booking_type || 'standard',
        status: formData.status || 'pending',
        guest_count: formData.guest_count,
        notes: formData.notes,
        priority: formData.priority || 'normal',
        assigned_cleaner_id: formData.assigned_cleaner_id,
        owner_id: currentUserId.value!
      };
      
      const bookingId = await supabaseBookings.createBooking(bookingFormData);
      
      if (bookingId) {
        success.value = 'Your booking has been created successfully';
        loading.value = false;
        return bookingId;
      } else {
        throw new Error('Failed to create booking');
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to create your booking. Please try again.';
      loading.value = false;
      return null;
    }
  }
  
  /**
   * Update a booking (only if owned by current user)
   * ✅ SAME API as before, but now RLS ensures security
   */
  async function updateMyBooking(id: string, updates: Partial<BookingFormData>): Promise<boolean> {
    if (!currentUserId.value) {
      error.value = 'Please log in to update bookings';
      return false;
    }
    
    loading.value = true;
    error.value = null;
    success.value = null;
    
    try {
      // RLS policies will automatically prevent updates to other owners' bookings
      const result = await supabaseBookings.updateBooking(id, updates);
      
      if (result) {
        success.value = 'Your booking has been updated successfully';
        loading.value = false;
        return true;
      } else {
        throw new Error('Failed to update booking or you do not have permission');
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to update your booking. Please try again.';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Delete a booking (only if owned by current user)
   * ✅ SAME API as before, but now RLS ensures security
   */
  async function deleteMyBooking(id: string): Promise<boolean> {
    if (!currentUserId.value) {
      error.value = 'Please log in to delete bookings';
      return false;
    }
    
    loading.value = true;
    error.value = null;
    success.value = null;
    
    try {
      // RLS policies will automatically prevent deletion of other owners' bookings
      const result = await supabaseBookings.deleteBooking(id);
      
      if (result) {
        success.value = 'Your booking has been deleted successfully';
        loading.value = false;
        return true;
      } else {
        throw new Error('Failed to delete booking or you do not have permission');
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to delete your booking. Please try again.';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Change booking status (only if owned by current user)
   * ✅ SAME API as before, but now RLS ensures security
   */
  async function changeMyBookingStatus(id: string, status: BookingStatus): Promise<boolean> {
    if (!currentUserId.value) {
      error.value = 'Please log in to update booking status';
      return false;
    }
    
    loading.value = true;
    error.value = null;
    success.value = null;
    
    try {
      // RLS policies will automatically prevent status changes to other owners' bookings
      const result = await supabaseBookings.changeBookingStatus(id, status);
      
      if (result) {
        success.value = 'Booking status updated successfully';
        loading.value = false;
        return true;
      } else {
        throw new Error('Failed to update booking status or you do not have permission');
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to update booking status. Please try again.';
      loading.value = false;
      return false;
    }
  }
  
  // OWNER-SPECIFIC BUSINESS LOGIC FUNCTIONS - Same API as before
  
  /**
   * Get turn alerts for current owner only
   * ✅ SAME API as before
   */
  function getMyTurnAlerts() {
    if (!currentUserId.value) return [];
    
    const now = new Date();
    
    return Array.from(myBookings.value.values())
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
  }
  
  /**
   * Calculate priority for owner's booking
   * ✅ SAME API as before
   */
  function calculateMyBookingPriority(booking: Booking): 'low' | 'normal' | 'high' | 'urgent' {
    // Simple priority calculation (can be enhanced)
    const now = new Date();
    const checkoutTime = new Date(booking.checkout_date);
    const hoursUntil = (checkoutTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntil < 0) return 'urgent'; // Overdue
    if (hoursUntil < 4) return 'high';
    if (hoursUntil < 24) return 'normal';
    return 'low';
  }
  
  /**
   * Get cleaning window for owner's booking
   * ✅ SAME API as before
   */
  function getMyBookingCleaningWindow(booking: Booking) {
    const checkoutTime = new Date(booking.checkout_date);
    const checkinTime = new Date(booking.checkin_date);
    
    return {
      start: checkoutTime,
      end: checkinTime,
      duration: (checkinTime.getTime() - checkoutTime.getTime()) / (1000 * 60 * 60) // hours
    };
  }
  
  /**
   * Get owner's booking statistics
   * ✅ SAME API as before
   */
  const myBookingStats = computed(() => {
    const bookingsArray = Array.from(myBookings.value.values());
    const stats = {
      total: bookingsArray.length,
      pending: 0,
      scheduled: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
      turns: 0,
      standard: 0,
      urgent_turns: myTodayTurns.value.length
    };
    
    bookingsArray.forEach(booking => {
      stats[booking.status]++;
      stats[booking.booking_type === 'turn' ? 'turns' : 'standard']++;
    });
    
    return stats;
  });
  
  /**
   * Create a new booking for the current owner and return the booking object
   * ✅ SAME API as before (for test compatibility)
   */
  async function createOwnerBooking(formData: Partial<Booking>): Promise<Booking | null> {
    if (!currentUserId.value) return null;
    
    const bookingFormData: BookingFormData = {
      property_id: formData.property_id || '',
      checkout_date: formData.checkout_date || '',
      checkin_date: formData.checkin_date || '',
      booking_type: formData.booking_type || 'standard',
      status: formData.status || 'pending',
      guest_count: formData.guest_count,
      notes: formData.notes,
      priority: formData.priority || 'normal',
      assigned_cleaner_id: formData.assigned_cleaner_id,
      owner_id: currentUserId.value!
    };
    
    const bookingId = await createMyBooking(bookingFormData);
    
    if (bookingId) {
      // Return the created booking
      return myBookings.value.get(bookingId) || null;
    }
    
    return null;
  }

  /**
   * Check if current owner can edit a booking
   * ✅ SAME API as before
   */
  function canEditBooking(bookingId: string): boolean {
    if (!currentUserId.value) return false;
    // With RLS, all visible bookings are editable by the owner
    return myBookings.value.has(bookingId);
  }

  /**
   * Check if current owner can delete a booking
   * ✅ SAME API as before
   */
  function canDeleteBooking(bookingId: string): boolean {
    if (!currentUserId.value) return false;
    // With RLS, all visible bookings are deletable by the owner
    return myBookings.value.has(bookingId);
  }
  
  // Return EXACT SAME INTERFACE as before
  return {
    // State (same as before)
    loading,
    error,
    success,
    
    // Computed properties (same API, but now RLS-filtered)
    myBookings,
    myProperties,
    myTodayTurns,
    myUpcomingCleanings,
    myUpcomingBookings,
    myBookingsByStatus,
    myBookingStats,
    myTurnBookings,
    myStandardBookings,
    myTodayBookings,
    
    // Owner-specific CRUD operations (same API)
    fetchMyBookings,
    createMyBooking,
    updateMyBooking,
    deleteMyBooking,
    changeMyBookingStatus,
    createOwnerBooking,
    canEditBooking,
    canDeleteBooking,
    
    // Owner-specific business logic (same API)
    getMyTurnAlerts,
    calculateMyBookingPriority,
    getMyBookingCleaningWindow,
    
    // Inherited compatibility (same as before)
    calculateCleaningWindow: getMyBookingCleaningWindow,
    calculateBookingPriority: calculateMyBookingPriority
  };
} 