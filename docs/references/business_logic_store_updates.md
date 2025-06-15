 
 # REFERENCE FILE: BUSINESS LOGIC STORE UPDATE PATTERNS #

 ## This file is a reference guide showing code patterns and usage examples.##

 ## It is NOT meant to be imported or executed directly. ##
  
 
  ## When implementing business logic components, follow these patterns ##
  ## to maintain consistency with the application architecture. ##

###  Example for BookingStore usage:
```js + vue
import { useBookingStore } from '@/stores/booking';
import { useUserStore } from '@/stores/user';

const bookingStore = useBookingStore();
const userStore = useUserStore();

// Get a booking by ID
function getBooking(bookingId: string) {
  return bookingStore.getBookingById(bookingId);
}

// Get all bookings
function getAllBookings() {
  return bookingStore.bookingsArray; // or userStore.userBookings for user-filtered view
}


```
### Example for PropertyStore usage ###
```js + vue
import { usePropertyStore } from '@/stores/property';
import { useUserStore } from '@/stores/user';

const propertyStore = usePropertyStore();
const userStore = useUserStore();

// Get a property by ID
function getProperty(propertyId: string) {
  return propertyStore.getPropertyById(propertyId);
}

// Get all properties
function getAllProperties() {
  return propertyStore.propertiesArray; // or userStore.userProperties for user-filtered view
}
````

### Example for turn management:
```js 
import { useUserStore } from '@/stores/user';
import { useBookingStore } from '@/stores/booking';
import { usePropertyStore } from '@/stores/property';
import { useUIStore } from '@/stores/ui';
import type { Booking } from '@/types';

export function useTurnManagement() {
  const userStore = useUserStore();
  const bookingStore = useBookingStore();
  const propertyStore = usePropertyStore();
  const uiStore = useUIStore();

  // Get today's turns
  function getTodayTurns(): Booking[] {
    const today = new Date().toISOString().split('T')[0];
    
    return userStore.userBookings
      .filter(booking => 
        booking.booking_type === 'turn' && 
        booking.checkout_date.startsWith(today)
      )
      .sort((a, b) => new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime());
  }

  // Get property name for a booking
  function getPropertyName(booking: Booking): string {
    const property = propertyStore.getPropertyById(booking.property_id);
    return property?.name || 'Unknown Property';
  }

  return {
    getTodayTurns,
    getPropertyName
  };
}

### Example for booking workflow:

import { useUserStore } from '@/stores/user';
import { useBookingStore } from '@/stores/booking';
import { usePropertyStore } from '@/stores/property';
import { useUIStore } from '@/stores/ui';
import type { Booking, BookingStatus } from '@/types';

export function useBookingWorkflow() {
  const userStore = useUserStore();
  const bookingStore = useBookingStore();
  const propertyStore = usePropertyStore();
  const uiStore = useUIStore();

  async function transitionBooking(
    bookingId: string, 
    newStatus: BookingStatus,
    notes?: string
  ): Promise<void> {
    const booking = bookingStore.getBookingById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Update booking
    const updates: Partial<Booking> = {
      status: newStatus,
      updated_at: new Date().toISOString()
    };

    if (notes) {
      updates.notes = notes;
    }

    // Update in store
    bookingStore.updateBooking(bookingId, updates);
  }

  return {
    transitionBooking
  };
}


// Example for calendar state:

import { useUserStore } from '@/stores/user';
import { useBookingStore } from '@/stores/booking';
import { usePropertyStore } from '@/stores/property';
import { computed } from 'vue';
import type { Booking } from '@/types';

export function useCalendarState() {
  const userStore = useUserStore();
  const bookingStore = useBookingStore();
  const propertyStore = usePropertyStore();
  
  const todayTurns = computed((): Booking[] => {
    const today = new Date().toISOString().split('T')[0];
    
    return userStore.userBookings
      .filter(booking => 
        booking.booking_type === 'turn' && 
        booking.checkout_date.startsWith(today)
      );
  });
  
  return {
    todayTurns
  };
}


// Example for booking operations:

import { useUserStore } from '@/stores/user';
import { useBookingStore } from '@/stores/booking';
import { usePropertyStore } from '@/stores/property';
import type { Booking, BookingFormData } from '@/types';

export function useBookingOperations() {
  const userStore = useUserStore();
  const bookingStore = useBookingStore();
  const propertyStore = usePropertyStore();
  
  async function createBooking(data: BookingFormData): Promise<void> {
    // Validate property exists
    const property = propertyStore.getPropertyById(data.property_id);
    if (!property) {
      throw new Error('Property not found');
    }
    
    // Create booking
    const newBooking: Booking = {
      ...data,
      id: crypto.randomUUID(),
      owner_id: userStore.user?.id || '',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    bookingStore.addBooking(newBooking);
  }
  
  return { createBooking };
}
