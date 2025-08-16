// EVENTS/BOOKING STORE - BOOKING STORE - BOOKING CRUD - BOOKING FILTERS - BOOKING ACTIONS
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Booking, BookingMap, BookingStatus, BookingType } from '@/types';
import { 
  filterBookingsByDateRange, 
  getUrgentTurns, 
  getUpcomingBookings
} from '@/utils/businessLogic';
import supabase from '@/plugins/supabase';

// Uses Map collections for efficient booking access and management
export const useBookingStore = defineStore('booking', () => {
  // State
  const bookings = ref<BookingMap>(new Map());
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  
  // Cached filtered Maps for O(1) performance
  const cachedStatusMaps = ref<Map<BookingStatus, Map<string, Booking>> | null>(null);
  const cachedTypeMaps = ref<Map<BookingType, Map<string, Booking>> | null>(null);
  const cachedPropertyMaps = ref(new Map<string, Map<string, Booking>>());
  const cachedOwnerMaps = ref(new Map<string, Map<string, Booking>>());
  const cacheTimestamp = ref(0);
  const CACHE_TTL = 10000; // 10 seconds
  
  // Cache management
  const isCacheValid = computed(() => {
    return (Date.now() - cacheTimestamp.value) < CACHE_TTL;
  });
  
  const invalidateCache = () => {
    cachedStatusMaps.value = null;
    cachedTypeMaps.value = null;
    cachedPropertyMaps.value.clear();
    cachedOwnerMaps.value.clear();
    cacheTimestamp.value = 0;
  };
  
  // GET EVENTS/BOOKINGS BY FILTER FUNCTIONS - Optimized Map-based filtering
  const bookingsArray = computed((): Booking[] => {
    return Array.from(bookings.value.values());
  });
  
  const getBookingById = computed(() => (id: string): Booking | undefined => {
    return bookings.value.get(id);
  });
  
  // Map-based status filtering with caching
  const bookingsByStatusMap = computed(() => {
    if (isCacheValid.value && cachedStatusMaps.value) {
      return cachedStatusMaps.value;
    }
    
    const statusMaps = new Map<BookingStatus, Map<string, Booking>>();
    
    bookings.value.forEach((booking, id) => {
      const status = booking.status;
      if (!statusMaps.has(status)) {
        statusMaps.set(status, new Map());
      }
      statusMaps.get(status)!.set(id, booking);
    });
    
    cachedStatusMaps.value = statusMaps;
    cacheTimestamp.value = Date.now();
    
    return statusMaps;
  });
  
  // Map-based type filtering with caching
  const bookingsByTypeMap = computed(() => {
    if (isCacheValid.value && cachedTypeMaps.value) {
      return cachedTypeMaps.value;
    }
    
    const typeMaps = new Map<BookingType, Map<string, Booking>>();
    
    bookings.value.forEach((booking, id) => {
      const type = booking.booking_type;
      if (!typeMaps.has(type)) {
        typeMaps.set(type, new Map());
      }
      typeMaps.get(type)!.set(id, booking);
    });
    
    cachedTypeMaps.value = typeMaps;
    cacheTimestamp.value = Date.now();
    
    return typeMaps;
  });
  
  // Efficient getter functions that return Maps
  const bookingsByStatus = computed(() => (status: BookingStatus): Map<string, Booking> => {
    return bookingsByStatusMap.value.get(status) || new Map();
  });
  
  const bookingsByType = computed(() => (type: BookingType): Map<string, Booking> => {
    return bookingsByTypeMap.value.get(type) || new Map();
  });
  
  const bookingsByProperty = computed(() => (propertyId: string): Map<string, Booking> => {
    if (isCacheValid.value && cachedPropertyMaps.value.has(propertyId)) {
      return cachedPropertyMaps.value.get(propertyId)!;
    }
    
    const filtered = new Map<string, Booking>();
    bookings.value.forEach((booking, id) => {
      if (booking.property_id === propertyId) {
        filtered.set(id, booking);
      }
    });
    
    cachedPropertyMaps.value.set(propertyId, filtered);
    return filtered;
  });
  
  const bookingsByOwner = computed(() => (ownerId: string): Map<string, Booking> => {
    if (isCacheValid.value && cachedOwnerMaps.value.has(ownerId)) {
      return cachedOwnerMaps.value.get(ownerId)!;
    }
    
    const filtered = new Map<string, Booking>();
    bookings.value.forEach((booking, id) => {
      if (booking.owner_id === ownerId) {
        filtered.set(id, booking);
      }
    });
    
    cachedOwnerMaps.value.set(ownerId, filtered);
    return filtered;
  });

  // Use business logic utilities for complex filtering
  const bookingsByDateRange = computed(() => (startDate: string, endDate: string): Map<string, Booking> => {
    return filterBookingsByDateRange(bookings.value, startDate, endDate);
  });
  
  // Optimized pre-computed common filters using business logic
  const pendingBookingsMap = computed((): Map<string, Booking> => {
    return bookingsByStatus.value('pending');
  });
  
  const scheduledBookingsMap = computed((): Map<string, Booking> => {
    return bookingsByStatus.value('scheduled');
  });
  
  const turnBookingsMap = computed((): Map<string, Booking> => {
    return bookingsByType.value('turn');
  });
  
  const standardBookingsMap = computed((): Map<string, Booking> => {
    return bookingsByType.value('standard');
  });
  
  const upcomingBookingsMap = computed((): Map<string, Booking> => {
    return getUpcomingBookings(bookings.value);
  });
  
  const urgentTurnsMap = computed((): Map<string, Booking> => {
    return getUrgentTurns(bookings.value);
  });
  
  // Array getters ONLY for components that need arrays
  const pendingBookings = computed((): Booking[] => {
    return Array.from(pendingBookingsMap.value.values());
  });
  
  const scheduledBookings = computed((): Booking[] => {
    return Array.from(scheduledBookingsMap.value.values());
  });
  
  const turnBookings = computed((): Booking[] => {
    return Array.from(turnBookingsMap.value.values());
  });
  
  const standardBookings = computed((): Booking[] => {
    return Array.from(standardBookingsMap.value.values());
  });
   
  // ACTIONS - EVENTS/BOOKINGCRUD - ADD - UPDATE - REMOVE - UPDATE STATUS - ASSIGN CLEANER - FETCH - CLEAR ALL
  // addBooking - updateBooking - removeBooking - updateBookingStatus - assignCleaner - fetchBookings - clearAll

  // function addBooking(booking: Booking) {
  //   bookings.value.set(booking.id, booking);
  //   invalidateCache(); // Invalidate cache when data changes
  // }
  // Example: src/stores/booking.ts - Add these methods
async function addBooking(booking: Booking) {
  console.log('🚀 [BookingStore] addBooking called with:', booking);
  
  // Optimistic update
  bookings.value.set(booking.id, booking);
  error.value = null;
  
  try {
    console.log('🚀 [BookingStore] Inserting booking into Supabase:', booking);
    // Database already has correct column names - no mapping needed!
    const { error: supaError } = await supabase.from('bookings').insert(booking);
    if (supaError) {
      console.error('❌ [BookingStore] Supabase error:', supaError);
      throw supaError;
    }
    console.log('✅ [BookingStore] Successfully added booking to Supabase');
    invalidateCache(); // Invalidate cache after successful insert
  } catch (err: unknown) {
    // Rollback on error
    bookings.value.delete(booking.id);
    error.value = err instanceof Error ? err.message : 'Failed to add booking.';
    console.error('❌ [BookingStore] addBooking error:', err);
    throw err;
  }
}
  
  async function updateBooking(id: string, updates: Partial<Booking>) {
    const existing = bookings.value.get(id);
    if (!existing) {
      error.value = 'Booking not found';
      throw new Error('Booking not found');
    }

    console.log('🔍 [BookingStore] Updating booking:', { id, updates, existingOwner: existing.owner_id });

    // Create updated booking object
    const updated = { 
      ...existing, 
      ...updates, 
      updated_at: new Date().toISOString() 
    };
    
    // Store original state for potential rollback
    const originalMap = new Map(bookings.value);
    
    // Optimistic update
    bookings.value.set(id, updated);
    error.value = null;
    
    try {
      const { error: supaError } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id);
      
      if (supaError) {
        console.error('❌ [BookingStore] Supabase update error:', supaError);
        throw supaError;
      }
      
      console.log('✅ [BookingStore] Successfully updated booking in Supabase');
      invalidateCache(); // Invalidate cache after successful update
    } catch (err: unknown) {
      console.error('❌ [BookingStore] Update failed, rolling back:', err);
      
      // Complete rollback - restore entire map to prevent corruption
      bookings.value.clear();
      originalMap.forEach((booking, key) => {
        bookings.value.set(key, booking);
      });
      
      error.value = err instanceof Error ? err.message : 'Failed to update booking.';
      invalidateCache(); // Invalidate cache after rollback
      throw err;
    }
  }
  
  async function removeBooking(id: string) {
    const existing = bookings.value.get(id);
    if (!existing) {
      error.value = 'Booking not found';
      throw new Error('Booking not found');
    }

    // Optimistic update
    bookings.value.delete(id);
    error.value = null;
    
    try {
      const { error: supaError } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      
      if (supaError) throw supaError;
      invalidateCache(); // Invalidate cache after successful delete
    } catch (err: unknown) {
      // Rollback on error
      bookings.value.set(id, existing);
      error.value = err instanceof Error ? err.message : 'Failed to remove booking.';
      console.error('removeBooking error:', err);
      throw err;
    }
  }
  
  function updateBookingStatus(id: string, status: BookingStatus) {
    updateBooking(id, { status });
  }
  
  function assignCleaner(id: string, cleanerId: string) {
    updateBooking(id, { assigned_cleaner_id: cleanerId });
  }
  
  async function fetchBookings() {
    loading.value = true;
    error.value = null;
    
    try {
      console.log('🔍 [BookingStore] Fetching bookings from Supabase...');
      
      // Fetch bookings from Supabase - database has correct column names!
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .order('checkout_date', { ascending: true }); // Order by checkout date
      
      if (fetchError) {
        console.error('❌ [BookingStore] Supabase error:', fetchError);
        throw fetchError;
      }
      
      console.log(`✅ [BookingStore] Fetched ${data?.length || 0} bookings from Supabase:`, data);
      
      // Clear existing bookings and add fetched ones
      bookings.value.clear();
      
      if (data && data.length > 0) {
        data.forEach((booking: Booking) => {
          // Database already has correct column names - no mapping needed!
          bookings.value.set(booking.id, booking);
        });
        console.log(`✅ [BookingStore] Added ${data.length} bookings to store`);
      }
      
      loading.value = false;
      invalidateCache(); // Invalidate cache after fetch
    } catch (err) {
      console.error('❌ [BookingStore] Error fetching bookings:', err);
      error.value = err instanceof Error ? err.message : 'Unknown error fetching bookings';
      loading.value = false;
    }
  }
  
  function clearAll() {
    bookings.value.clear();
    invalidateCache(); // Invalidate cache when data changes
  }
  
  return {
    // State
    bookings,
    loading,
    error,
    
    // Map getters (primary - for O(1) operations)
    bookingsByStatusMap,
    bookingsByTypeMap,
    pendingBookingsMap,
    scheduledBookingsMap,
    turnBookingsMap,
    standardBookingsMap,
    upcomingBookingsMap,
    urgentTurnsMap,
    
    // Parameterized Map getters
    getBookingById,
    bookingsByStatus,
    bookingsByType,
    bookingsByProperty,
    bookingsByOwner,
    bookingsByDateRange,
    
    // Array getters (secondary - only when UI needs arrays)
    bookingsArray,
    pendingBookings,
    scheduledBookings,
    turnBookings,
    standardBookings,
    
    // Actions
    addBooking,
    updateBooking,
    removeBooking,
    updateBookingStatus,
    assignCleaner,
    fetchBookings,
    clearAll,
    
    // Cache management
    invalidateCache
  };
}); 