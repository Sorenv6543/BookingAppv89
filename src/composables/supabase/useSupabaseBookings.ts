import { ref, computed, onMounted, onUnmounted } from 'vue';
import { supabase } from '@/plugins/supabase';
import type { Booking, BookingFormData, BookingStatus } from '@/types';
import type { RealtimeChannel } from '@supabase/supabase-js';

const __DEV__ = import.meta.env.DEV;

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
  
  // TURN AUTO-DETECTION

  /**
   * Recompute booking_type for all bookings on a given property + date.
   * A booking is a 'turn' if another booking on the same property has
   * checkout_date === this booking's checkin_date or vice versa.
   */
  async function recomputeTurnStatus(propertyId: string, dates: string[]): Promise<void> {
    const uniqueDates = [...new Set(dates.filter(Boolean))];
    if (!uniqueDates.length || !propertyId) return;

    // Find all bookings for this property that touch any of the given dates
    const affected = bookings.value.filter(b =>
      b.property_id === propertyId &&
      (uniqueDates.includes(b.checkin_date) || uniqueDates.includes(b.checkout_date))
    );

    for (const booking of affected) {
      const isTurn = bookings.value.some(other =>
        other.id !== booking.id &&
        other.property_id === propertyId &&
        (other.checkout_date === booking.checkin_date || other.checkin_date === booking.checkout_date)
      );
      const newType = isTurn ? 'turn' : 'standard';
      if (booking.booking_type !== newType) {
        const { error: updateError } = await supabase
          .from('bookings')
          .update({ booking_type: newType })
          .eq('id', booking.id);
        
        if (updateError) {
          throw new Error(`Failed to update booking type: ${updateError.message}`);
        }
        booking.booking_type = newType;
      }
    }
  }

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
        .order('checkout_date', { ascending: true });
      
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
      if (__DEV__) console.error('Supabase booking fetch error:', err);
      return [];
    } finally {
      loading.value = false;
    }
  }
  
 /**
 * Create a new booking with automatic owner_id assignment
 */
async function createBooking(formData: BookingFormData): Promise<string | null> {
  console.log('🔍 [useSupabaseBookings] createBooking START', formData);
  loading.value = true;
  error.value = null;

  try {
    // Get current user
    console.log('🔍 [useSupabaseBookings] Step 1: Getting current user...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('🔍 [useSupabaseBookings] Step 1 complete:', { 
      hasUser: !!user, 
      userId: user?.id,
      authError: authError?.message 
    });
    
    if (!user) throw new Error('Not authenticated');

    console.log('🔍 [useSupabaseBookings] Step 2: Building bookingData...');
    const bookingData = {
      ...formData,
      owner_id: user.id // Automatic owner assignment
    };
    console.log('🔍 [useSupabaseBookings] Step 2 complete - bookingData:', bookingData);

    console.log('🔍 [useSupabaseBookings] Step 3: Inserting into Supabase...');
    const { data, error: createError } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();
    
    console.log('🔍 [useSupabaseBookings] Step 3 complete:', { 
      success: !!data, 
      data,
      createError: createError?.message 
    });

    if (createError) throw createError;

    // Add to local state for immediate UI update
    if (data) {
      console.log('🔍 [useSupabaseBookings] Step 4: Updating local state...');
      bookings.value.push(data);
      // Auto-detect turn status for affected dates
      await recomputeTurnStatus(data.property_id, [data.checkin_date, data.checkout_date]);
      console.log('🔍 [useSupabaseBookings] Step 4 complete');
    }

    console.log('🔍 [useSupabaseBookings] createBooking SUCCESS - returning id:', data?.id);
    return data?.id || null;
  } catch (err) {
    console.error('🔍 [useSupabaseBookings] createBooking CATCH ERROR:', err);
    error.value = err instanceof Error ? err.message : 'Failed to create booking';
    console.error('Supabase booking creation error:', err);
    return null;
  } finally {
    console.log('🔍 [useSupabaseBookings] createBooking FINALLY - setting loading to false');
    loading.value = false;
  }
}
  
  /**
   * Create a quick turn — two back-to-back bookings on the same property.
   * If existingBookingId is provided, the outgoing booking already exists.
   */
  async function createQuickTurn(payload: {
    property_id: string;
    outgoing: BookingFormData & { booking_id?: string };
    incoming: BookingFormData;
  }): Promise<{ outgoingId: string | null; incomingId: string | null }> {
    loading.value = true;
    error.value = null;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let outgoingId: string | null = null;

      // Create or reference outgoing booking
      if (payload.outgoing.booking_id) {
        outgoingId = payload.outgoing.booking_id;
      } else {
        const { data, error: err } = await supabase
          .from('bookings')
          .insert([{ ...payload.outgoing, owner_id: user.id, booking_type: 'turn' }])
          .select().single();
        if (err) throw err;
        if (data) { bookings.value.push(data); outgoingId = data.id; }
      }

      // Create incoming booking
      const { data: inData, error: inErr } = await supabase
        .from('bookings')
        .insert([{ ...payload.incoming, owner_id: user.id, booking_type: 'turn' }])
        .select().single();
      if (inErr) throw inErr;
      if (inData) bookings.value.push(inData);

      // Recompute turn status for the shared date
      await recomputeTurnStatus(payload.property_id, [
        payload.outgoing.checkout_date || payload.outgoing.checkin_date,
        payload.incoming.checkin_date,
        payload.incoming.checkout_date
      ]);

      return { outgoingId, incomingId: inData?.id || null };
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create quick turn';
      console.error('Quick turn creation error:', err);
      return { outgoingId: null, incomingId: null };
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
        const oldBooking = bookings.value.find(b => b.id === id);
        const index = bookings.value.findIndex(b => b.id === id);
        if (index !== -1) {
          bookings.value[index] = { ...bookings.value[index], ...data };
        }
        // Recompute turns for both old and new dates/property
        const datesToCheck = [data.checkin_date, data.checkout_date, oldBooking?.checkin_date, oldBooking?.checkout_date].filter(Boolean) as string[];
        const propertyIds = new Set([data.property_id, oldBooking?.property_id].filter(Boolean) as string[]);
        for (const pid of propertyIds) {
          await recomputeTurnStatus(pid, datesToCheck);
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

      // Capture dates before removing from local state
      const deleted = bookings.value.find(b => b.id === id);
      // Remove from local state
      bookings.value = bookings.value.filter(b => b.id !== id);
      // Recompute turns for the dates the deleted booking occupied
      if (deleted) {
        await recomputeTurnStatus(deleted.property_id, [deleted.checkin_date, deleted.checkout_date]);
      }

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
  let subscriptionRetryCount = 0;
  const MAX_SUBSCRIPTION_RETRIES = 3;

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
          if (__DEV__) console.log('Booking change received:', payload.eventType);

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
          subscriptionRetryCount = 0;
          if (__DEV__) console.log('Subscribed to booking changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Booking subscription error, retrying...');
          // Retry with backoff on channel error (common on Supabase free tier)
          if (subscriptionRetryCount < MAX_SUBSCRIPTION_RETRIES) {
            subscriptionRetryCount++;
            const delay = Math.min(1000 * Math.pow(2, subscriptionRetryCount - 1), 5000);
            setTimeout(() => {
              unsubscribeFromBookings();
              subscribeToBookings();
            }, delay);
          }
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
              booking.checkout_date.startsWith(today) &&
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
        const checkoutDate = new Date(booking.checkout_date);
        return checkoutDate >= now && 
               checkoutDate <= nextWeek &&
               booking.status !== 'completed';
      })
              .sort((a, b) => new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime());
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
    createQuickTurn,
    recomputeTurnStatus,
    
    // Computed data (auto-filtered by RLS)
    todayTurns,
    upcomingCleanings,
    bookingsByStatus,
    
    // Subscription management
    subscribeToBookings,
    unsubscribeFromBookings
  };
} 