import { ref, computed, onMounted, onUnmounted } from 'vue';
import { supabase } from '@/plugins/supabase';
import type { Booking, BookingFormData, BookingStatus } from '@/types';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Supabase-based booking operations with automatic RLS filtering
 * Replaces frontend filtering with database-level security
 * 
 * Key Features:
 * - Automatic owner data isolation via RLS policies
 * - Real-time subscriptions replace computed properties
 * - Type-safe database operations
 * - Maintains same API interface as Pinia version
 */
export function useSupabaseBookings() {
  // State
  const bookings = ref<Booking[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  // Real-time subscription
  let subscription: RealtimeChannel | null = null;
  
  // CORE DATABASE OPERATIONS
  
  /**
   * Fetch bookings with automatic RLS filtering
   * - Owners see only their bookings
   * - Admins see all bookings
   */
  async function fetchBookings(): Promise<Booking[]> {
    loading.value = true;
    error.value = null;
    
    try {
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select(`
          *,
          properties!inner(
            id,
            name,
            address,
            owner_id
          )
        `)
        .order('guest_departure_date', { ascending: true });
      
      if (fetchError) throw fetchError;
      
      // Transform to match expected format
      const transformedBookings = data?.map(booking => ({
        ...booking,
        property: booking.properties
      })) || [];
      
      bookings.value = transformedBookings;
      return transformedBookings;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch bookings';
      console.error('Supabase booking fetch error:', err);
      return [];
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Create a new booking with automatic owner_id assignment
   */
  async function createBooking(formData: BookingFormData): Promise<string | null> {
    loading.value = true;
    error.value = null;
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const bookingData = {
        ...formData,
        owner_id: user.id // Automatic owner assignment
      };
      
      const { data, error: createError } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();
      
      if (createError) throw createError;
      
      // Add to local state for immediate UI update
      if (data) {
        bookings.value.push(data);
      }
      
      return data?.id || null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create booking';
      console.error('Supabase booking creation error:', err);
      return null;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Update a booking (RLS ensures user can only update their own)
   */
  async function updateBooking(id: string, updates: Partial<BookingFormData>): Promise<boolean> {
    loading.value = true;
    error.value = null;
    
    try {
      const { data, error: updateError } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (updateError) throw updateError;
      
      // Update local state
      if (data) {
        const index = bookings.value.findIndex(b => b.id === id);
        if (index !== -1) {
          bookings.value[index] = { ...bookings.value[index], ...data };
        }
      }
      
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update booking';
      console.error('Supabase booking update error:', err);
      return false;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Delete a booking (RLS ensures user can only delete their own)
   */
  async function deleteBooking(id: string): Promise<boolean> {
    loading.value = true;
    error.value = null;
    
    try {
      const { error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      
      if (deleteError) throw deleteError;
      
      // Remove from local state
      bookings.value = bookings.value.filter(b => b.id !== id);
      
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete booking';
      console.error('Supabase booking deletion error:', err);
      return false;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Change booking status (RLS ensures user can only update their own)
   */
  async function changeBookingStatus(id: string, status: BookingStatus): Promise<boolean> {
    return updateBooking(id, { status });
  }
  
  // REAL-TIME SUBSCRIPTIONS
  
  /**
   * Subscribe to real-time booking changes
   * RLS automatically filters to user's accessible data
   */
  function subscribeToBookings() {
    subscription = supabase
      .channel('booking-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('Booking change received:', payload);
          
          switch (payload.eventType) {
            case 'INSERT':
              if (payload.new) {
                bookings.value.push(payload.new as Booking);
              }
              break;
              
            case 'UPDATE':
              if (payload.new) {
                const index = bookings.value.findIndex(b => b.id === payload.new.id);
                if (index !== -1) {
                  bookings.value[index] = payload.new as Booking;
                }
              }
              break;
              
            case 'DELETE':
              if (payload.old) {
                bookings.value = bookings.value.filter(b => b.id !== payload.old.id);
              }
              break;
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Subscribed to booking changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Booking subscription error');
        }
      });
  }
  
  /**
   * Unsubscribe from real-time changes
   */
  function unsubscribeFromBookings() {
    if (subscription) {
      supabase.removeChannel(subscription);
      subscription = null;
    }
  }
  
  // COMPUTED PROPERTIES (Auto-filtered by RLS)
  
  /**
   * All bookings (automatically filtered by RLS)
   * - Owners see only their bookings
   * - Admins see all bookings
   */
  const allBookings = computed(() => bookings.value);
  
  /**
   * Today's turn bookings (auto-filtered by RLS)
   */
  const todayTurns = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    
    return bookings.value.filter(booking => 
      booking.booking_type === 'turn' &&
      booking.guest_departure_date.startsWith(today) &&
      booking.status !== 'completed'
    );
  });
  
  /**
   * Upcoming cleanings (next 7 days, auto-filtered by RLS)
   */
  const upcomingCleanings = computed(() => {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    
    return bookings.value
      .filter(booking => {
        const checkoutDate = new Date(booking.guest_departure_date);
        return checkoutDate >= now && 
               checkoutDate <= nextWeek &&
               booking.status !== 'completed';
      })
              .sort((a, b) => new Date(a.guest_departure_date).getTime() - new Date(b.guest_departure_date).getTime());
  });
  
  /**
   * Bookings grouped by status (auto-filtered by RLS)
   */
  const bookingsByStatus = computed(() => {
    const statusGroups: Record<BookingStatus, Booking[]> = {
      pending: [],
      scheduled: [],
      in_progress: [],
      completed: [],
      cancelled: []
    };
    
    bookings.value.forEach(booking => {
      statusGroups[booking.status].push(booking);
    });
    
    return statusGroups;
  });
  
  // LIFECYCLE MANAGEMENT
  
  onMounted(() => {
    fetchBookings();
    subscribeToBookings();
  });
  
  onUnmounted(() => {
    unsubscribeFromBookings();
  });
  
  return {
    // State
    bookings: allBookings,
    loading,
    error,
    
    // Operations
    fetchBookings,
    createBooking,
    updateBooking,
    deleteBooking,
    changeBookingStatus,
    
    // Computed data (auto-filtered by RLS)
    todayTurns,
    upcomingCleanings,
    bookingsByStatus,
    
    // Subscription management
    subscribeToBookings,
    unsubscribeFromBookings
  };
} 