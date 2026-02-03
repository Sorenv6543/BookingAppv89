import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useOwnerBookings } from '@/composables/owner/useOwnerBookings-supabase';
import { useBookingStore } from '@/stores/booking';
import { useAuthStore } from '@/stores/auth';
import type { Booking } from '@/types';
import { setOwnerUser, addOwnerBookings } from '../../utils/test-utils';
import { supabaseMock } from '../../utils/supabase-mock';

vi.mock('@/plugins/supabase', () => ({
  supabase: supabaseMock
}));

describe('useOwnerBookings (Role-Based)', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should filter bookings to only show owner data', () => {
    const bookingStore = useBookingStore();
    const authStore = useAuthStore();
    expect(authStore).toBeDefined();
    if (!authStore) throw new Error('authStore is null or undefined');
    setOwnerUser(authStore, 'owner1');
    addOwnerBookings(bookingStore, 'owner1', 1);
    // Add a booking for another owner
    addOwnerBookings(bookingStore, 'owner2', 1);
    const { myBookings } = useOwnerBookings();
    expect(myBookings.value).toHaveLength(1);
    expect(myBookings.value[0].owner_id).toBe('owner1');
  });

  it('should identify turn bookings for urgent alerts', () => {
    const bookingStore = useBookingStore();
    const authStore = useAuthStore();
    
    // Set up owner user
    setOwnerUser(authStore, 'owner1');

    // Add turn and standard bookings
    const turnBooking: Booking = {
      id: 'turn1',
      property_id: 'prop1',
      owner_id: 'owner1',
      checkout_date: '2023-06-01T11:00:00Z',
      checkin_date: '2023-06-01T15:00:00Z',
      booking_type: 'turn',
      status: 'pending'
    };

    const standardBooking: Booking = {
      id: 'standard1',
      property_id: 'prop1',
      owner_id: 'owner1',
      checkout_date: '2023-06-02T11:00:00Z',
      checkin_date: '2023-06-04T15:00:00Z',
      booking_type: 'standard',
      status: 'pending'
    };

    bookingStore.addBooking(turnBooking);
    bookingStore.addBooking(standardBooking);

    const { myTurnBookings, myStandardBookings } = useOwnerBookings();

    // Should correctly separate turn vs standard bookings
    expect(myTurnBookings.value).toHaveLength(1);
    expect(myTurnBookings.value[0].booking_type).toBe('turn');
    expect(myStandardBookings.value).toHaveLength(1);
    expect(myStandardBookings.value[0].booking_type).toBe('standard');
  });

  it('should handle role-based booking creation', async () => {
    const authStore = useAuthStore();
    
    // Set up owner user
    setOwnerUser(authStore, 'owner1');

    const { createOwnerBooking } = useOwnerBookings();

    const newBookingData = {
      property_id: 'prop1',
      checkout_date: '2023-06-01T11:00:00Z',
      checkin_date: '2023-06-03T15:00:00Z',
      booking_type: 'standard' as const,
      status: 'pending' as const
    };

    const result = await createOwnerBooking(newBookingData);

    // Should automatically set owner_id and return booking
    expect(result).toBeDefined();
    expect(result?.owner_id).toBe('owner1');
    expect(result?.property_id).toBe('prop1');
  });

  it('should enforce owner-only data access', () => {
    const bookingStore = useBookingStore();
    const authStore = useAuthStore();
    
    // Set up owner user
    setOwnerUser(authStore, 'owner1');

    // Add multiple bookings from different owners
    for (let i = 1; i <= 10; i++) {
      bookingStore.addBooking({
        id: `booking${i}`,
        property_id: `prop${i}`,
        owner_id: i <= 3 ? 'owner1' : 'other_owner',
        checkout_date: '2023-06-01T11:00:00Z',
        checkin_date: '2023-06-03T15:00:00Z',
        booking_type: 'standard',
        status: 'pending'
      });
    }

    const { myBookings } = useOwnerBookings();

    // Should only return bookings for owner1 (3 out of 10)
    expect(myBookings.value).toHaveLength(3);
    myBookings.value.forEach(booking => {
      expect(booking.owner_id).toBe('owner1');
    });
  });

  it('should provide today bookings for owner dashboard', () => {
    const bookingStore = useBookingStore();
    const authStore = useAuthStore();
    
    // Set up owner user
    setOwnerUser(authStore, 'owner1');

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Add today's booking
    const todayBooking: Booking = {
      id: 'today1',
      property_id: 'prop1',
      owner_id: 'owner1',
      checkout_date: `${today}T11:00:00Z`,
      checkin_date: `${today}T15:00:00Z`,
      booking_type: 'turn',
      status: 'pending'
    };

    // Add tomorrow's booking
    const tomorrowBooking: Booking = {
      id: 'tomorrow1',
      property_id: 'prop1',
      owner_id: 'owner1',
      checkout_date: `${tomorrow}T11:00:00Z`,
      checkin_date: `${tomorrow}T15:00:00Z`,
      booking_type: 'standard',
      status: 'pending'
    };

    bookingStore.addBooking(todayBooking);
    bookingStore.addBooking(tomorrowBooking);

    const { myTodayBookings } = useOwnerBookings();

    // Should only return today's bookings
    expect(myTodayBookings.value).toHaveLength(1);
    expect(myTodayBookings.value[0].id).toBe('today1');
  });

  it('should handle permissions correctly for owners', () => {
    const bookingStore = useBookingStore();
    const authStore = useAuthStore();
    
    // Set up owner user
    setOwnerUser(authStore, 'owner1');

    // Add bookings - owner's booking and other owner's booking
    const ownerBooking: Booking = {
      id: 'booking_owner1',
      property_id: 'prop1',
      owner_id: 'owner1',
      checkout_date: '2023-06-01T11:00:00Z',
      checkin_date: '2023-06-03T15:00:00Z',
      booking_type: 'standard',
      status: 'pending'
    };

    const otherOwnerBooking: Booking = {
      id: 'booking_other',
      property_id: 'prop2',
      owner_id: 'other_owner',
      checkout_date: '2023-06-01T11:00:00Z',
      checkin_date: '2023-06-03T15:00:00Z',
      booking_type: 'standard',
      status: 'pending'
    };

    bookingStore.addBooking(ownerBooking);
    bookingStore.addBooking(otherOwnerBooking);

    const { canEditBooking, canDeleteBooking } = useOwnerBookings();

    // Owner can edit/delete their own bookings
    expect(canEditBooking('booking_owner1')).toBe(true);
    expect(canDeleteBooking('booking_owner1')).toBe(true);
    
    // Owner cannot edit/delete other owner's bookings
    expect(canEditBooking('booking_other')).toBe(false);
    expect(canDeleteBooking('booking_other')).toBe(false);
  });
}); 
