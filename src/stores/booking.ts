// EVENTS/BOOKING STORE - BOOKING STORE - BOOKING CRUD - BOOKING FILTERS - BOOKING ACTIONS
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Booking, BookingMap, BookingStatus, BookingType } from '@/types';

// Uses Map collections for efficient booking access and management
export const useBookingStore = defineStore('booking', () => {
  // State
  const bookings = ref<BookingMap>(new Map());
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  
  // GET EVENTS/BOOKINGS BY FILTER FUNCTIONS - BY ID - BY STATUS - BY TYPE - BY PROPERTY - BY OWNER - BY DATE RANGE - PENDING - SCHEDULED - TURN - STANDARD
  // ById - ByStatus - ByType - ByProperty - ByOwner ByDateRange - Pending - Scheduled - Turn - Standard
  const bookingsArray = computed((): Booking[] => {
    return Array.from(bookings.value.values());
  });
  
  const getBookingById = computed(() => (id: string): Booking | undefined => {
    return bookings.value.get(id);
  });
  
  const bookingsByStatus = computed(() => (status: BookingStatus): Booking[] => {
    return bookingsArray.value.filter(booking => booking.status === status);
  });
  
  const bookingsByType = computed(() => (type: BookingType): Booking[] => {
    return bookingsArray.value.filter(booking => booking.booking_type === type);
  });
  
  const bookingsByProperty = computed(() => (propertyId: string): Booking[] => {
    return bookingsArray.value.filter(booking => booking.property_id === propertyId);
  });
  
  const bookingsByOwner = computed(() => (ownerId: string): Booking[] => {
    return bookingsArray.value.filter(booking => booking.owner_id === ownerId);
  });
  
const bookingsByDateRange = computed(() => (startDate: string, endDate: string): Booking[] => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  
  return bookingsArray.value.filter(booking => {
    const bookingStart = new Date(booking.checkout_date).getTime();
    const bookingEnd = new Date(booking.checkin_date).getTime();
    
    // Handle case where booking spans multiple days
    return (bookingStart <= end && bookingEnd >= start);
  });
});
  
  const pendingBookings = computed((): Booking[] => {
    return bookingsByStatus.value('pending');
  });
  
  const scheduledBookings = computed((): Booking[] => {
    return bookingsByStatus.value('scheduled');
  });
  
  const turnBookings = computed((): Booking[] => {
    return bookingsByType.value('turn');
  });
  
  const standardBookings = computed((): Booking[] => {
    return bookingsByType.value('standard');
  });
   
  // ACTIONS - EVENTS/BOOKINGCRUD - ADD - UPDATE - REMOVE - UPDATE STATUS - ASSIGN CLEANER - FETCH - CLEAR ALL
  // addBooking - updateBooking - removeBooking - updateBookingStatus - assignCleaner - fetchBookings - clearAll

  function addBooking(booking: Booking) {
    bookings.value.set(booking.id, booking);
  }
  
  function updateBooking(id: string, updates: Partial<Booking>) {
    const existing = bookings.value.get(id);
    if (existing) {
      bookings.value.set(id, { 
        ...existing, 
        ...updates, 
        updated_at: new Date().toISOString() 
      });
    }
  }
  
  function removeBooking(id: string) {
    bookings.value.delete(id);
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
      // In a real app, this would be a Supabase or API call
      // For now, we'll simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Fetch simulation complete
      loading.value = false;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error fetching bookings';
      loading.value = false;
    }
  }
  
  function clearAll() {
    bookings.value.clear();
  }
  
  return {
    // State
    bookings,
    loading,
    error,
    
    // Getters
    bookingsArray,
    getBookingById,
    bookingsByStatus,
    bookingsByType,
    bookingsByProperty,
    bookingsByOwner,
    bookingsByDateRange,
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
    clearAll
  };
}); 