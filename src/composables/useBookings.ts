// EVENTS/BOOKING COMPOSABLE - BOOKING COMPOSABLE 
import { ref, computed } from 'vue';
import { useBookingStore } from '@/stores/booking';
import { usePropertyStore } from '@/stores/property';
import type { Booking, BookingFormData, BookingStatus, BookingType } from '@/types';
import { v4 as uuidv4 } from 'uuid';



// Provides CRUD operations and business logic for bookings

export function useBookings() {
  const bookingStore = useBookingStore();
  const propertyStore = usePropertyStore();
  
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);

// CREATEBOOKING 
  async function createBooking(formData: BookingFormData): Promise<string | null> {
    loading.value = true;
    error.value = null;
    success.value = null;
    
    try {
      // Validate property exists
      const property = propertyStore.getPropertyById(formData.property_id);
      if (!property) {
        throw new Error('Property not found');
      }
      
      // Validate dates
      const checkoutDate = new Date(formData.checkout_date);
      const checkinDate = new Date(formData.checkin_date);
      
      if (isNaN(checkoutDate.getTime()) || isNaN(checkinDate.getTime())) {
        throw new Error('Invalid dates provided');
      }
      
      // Validate dates are in correct order
      if (checkoutDate > checkinDate) {
        throw new Error('Checkout date must be before checkin date');
      }
      
      // Determine booking type based on dates if not specified
      let bookingType = formData.booking_type;
      if (!bookingType) {
        // If checkout and checkin are on the same day, it's a turn
        const isSameDay = checkoutDate.toDateString() === checkinDate.toDateString();
        bookingType = isSameDay ? 'turn' : 'standard';
      }
      
      // Create booking object
      const newBooking: Booking = {
        id: uuidv4(),
        ...formData,
        booking_type: bookingType as BookingType,
        status: 'pending', // New bookings start as pending
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Add to store
      bookingStore.addBooking(newBooking);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      success.value = 'Booking created successfully';
      loading.value = false;
      return newBooking.id;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create booking';
      loading.value = false;
      return null;
    }
  }
  
// UPDATEBOOKING
  async function updateBooking(id: string, updates: Partial<BookingFormData>): Promise<boolean> {
    loading.value = true;
    error.value = null;
    success.value = null;
    
    try {
      // Check if booking exists
      const booking = bookingStore.getBookingById(id);
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      // Validate property if changed
      if (updates.property_id && updates.property_id !== booking.property_id) {
        const property = propertyStore.getPropertyById(updates.property_id);
        if (!property) {
          throw new Error('Property not found');
        }
      }
      
      // Validate dates if changed
      let shouldRecalculateType = false;
      let checkoutDate = new Date(booking.checkout_date);
      let checkinDate = new Date(booking.checkin_date);
      
      if (updates.checkout_date) {
        checkoutDate = new Date(updates.checkout_date);
        if (isNaN(checkoutDate.getTime())) {
          throw new Error('Invalid checkout date');
        }
        shouldRecalculateType = true;
      }
      
      if (updates.checkin_date) {
        checkinDate = new Date(updates.checkin_date);
        if (isNaN(checkinDate.getTime())) {
          throw new Error('Invalid checkin date');
        }
        shouldRecalculateType = true;
      }
      
      // Validate dates are in correct order
      if (checkoutDate > checkinDate) {
        throw new Error('Checkout date must be before checkin date');
      }
      
      // Recalculate booking type if dates changed and type not explicitly set
      if (shouldRecalculateType && !updates.booking_type) {
        const isSameDay = checkoutDate.toDateString() === checkinDate.toDateString();
        updates.booking_type = isSameDay ? 'turn' : 'standard';
      }
      
      // Update booking in store
      bookingStore.updateBooking(id, updates);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      success.value = 'Booking updated successfully';
      loading.value = false;
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update booking';
      loading.value = false;
      return false;
    }
  }
  
 
// DELETEBOOKING
  async function deleteBooking(id: string): Promise<boolean> {
    loading.value = true;
    error.value = null;
    success.value = null;
    
    try {
      // Check if booking exists
      const booking = bookingStore.getBookingById(id);
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      // Remove from store
      bookingStore.removeBooking(id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      success.value = 'Booking deleted successfully';
      loading.value = false;
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete booking';
      loading.value = false;
      return false;
    }
  }
  
// CHANGEBOOKINGSTATUS
  async function changeBookingStatus(id: string, status: BookingStatus): Promise<boolean> {
    loading.value = true;
    error.value = null;
    success.value = null;
    
    try {
      // Check if booking exists
      const booking = bookingStore.getBookingById(id);
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      // Validate status transition
      const validTransitions: Record<BookingStatus, BookingStatus[]> = {
        'pending': ['scheduled', 'cancelled'],
        'scheduled': ['in_progress', 'cancelled'],
        'in_progress': ['completed', 'cancelled'],
        'completed': [],
        'cancelled': ['pending'] // Allow reopening cancelled bookings
      };
      
      if (!validTransitions[booking.status].includes(status)) {
        throw new Error(`Cannot transition from ${booking.status} to ${status}`);
      }
      
      // Update status in store
      bookingStore.updateBookingStatus(id, status);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      success.value = 'Booking status updated successfully';
      loading.value = false;
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update booking status';
      loading.value = false;
      return false;
    }
  }
  
// ASSIGNCLEANER
  async function assignCleaner(bookingId: string, cleanerId: string): Promise<boolean> {
    loading.value = true;
    error.value = null;
    success.value = null;
    
    try {
      // Check if booking exists
      const booking = bookingStore.getBookingById(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      // In a real app, we would validate the cleaner exists
      // For now, we'll just update the booking
      
      // Update cleaner assignment in store
      bookingStore.assignCleaner(bookingId, cleanerId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      success.value = 'Cleaner assigned successfully';
      loading.value = false;
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to assign cleaner';
      loading.value = false;
      return false;
    }
  }
  
// CALCULATECLEANINGWINDOW
  function calculateCleaningWindow(booking: Booking) {
    // Get property details for cleaning duration
    const property = propertyStore.getPropertyById(booking.property_id);
    if (!property) {
      return null;
    }
    
    const checkoutDate = new Date(booking.checkout_date);
    const checkinDate = new Date(booking.checkin_date);
    const cleaningDuration = property.cleaning_duration; // in minutes
    
    // For turn bookings (same-day checkout/checkin)
    if (booking.booking_type === 'turn') {
      // Start cleaning 2 hours after checkout
      const start = new Date(checkoutDate);
      start.setHours(checkoutDate.getHours() + 2);
      
      // End cleaning at least 1 hour before checkin
      const end = new Date(checkinDate);
      end.setHours(checkinDate.getHours() - 1);
      
      return {
        start: start.toISOString(),
        end: end.toISOString(),
        duration: cleaningDuration
      };
    } 
    
    // For standard bookings (gap between checkout/checkin)
    // Start cleaning the day after checkout
    const start = new Date(checkoutDate);
    start.setDate(start.getDate() + 1);
    start.setHours(10, 0, 0, 0); // Start at 10:00 AM
    
    // End by default at 4:00 PM same day
    const end = new Date(start);
    end.setHours(16, 0, 0, 0); // End at 4:00 PM
    
    return {
      start: start.toISOString(),
      end: end.toISOString(),
      duration: cleaningDuration
    };
  }
  
// CALCULATEBOOKINGPRIORITY
  function calculateBookingPriority(booking: Booking): 'low' | 'normal' | 'high' | 'urgent' {
    const now = new Date();
    const checkinDate = new Date(booking.checkin_date);
    const checkoutDate = new Date(booking.checkout_date);
    const daysDiff = Math.ceil((checkinDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // Turn bookings are always higher priority
    if (booking.booking_type === 'turn') {
      // If turn is today, it's urgent
      if (checkoutDate.toDateString() === now.toDateString()) {
        return 'urgent';
      }
      // If turn is tomorrow, it's high priority
      if (daysDiff <= 1) {
        return 'high';
      }
      // Other turns are normal priority
      return 'normal';
    }
    
    // Standard bookings
    if (daysDiff <= 1) {
      return 'high';
    } else if (daysDiff <= 3) {
      return 'normal';
    } else {
      return 'low';
    }
  }
  
// FETCHALLBOOKINGS
  async function fetchAllBookings(): Promise<boolean> {
    loading.value = true;
    error.value = null;
    
    try {
      await bookingStore.fetchBookings();
      loading.value = false;
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch bookings';
      loading.value = false;
      return false;
    }
  }
  
  return {
    // State
    loading,
    error,
    success,
    
    // Store access
    bookings: computed(() => bookingStore.bookingsArray),
    getBookingById: computed(() => bookingStore.getBookingById),
    turnBookings: computed(() => bookingStore.turnBookings),
    standardBookings: computed(() => bookingStore.standardBookings),
    pendingBookings: computed(() => bookingStore.pendingBookings),
    scheduledBookings: computed(() => bookingStore.scheduledBookings),
    
    // CRUD operations
    createBooking,
    updateBooking,
    deleteBooking,
    changeBookingStatus,
    assignCleaner,
    fetchAllBookings,
    
    // Business logic
    calculateCleaningWindow,
    calculateBookingPriority
  };
}