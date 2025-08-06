import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useBookingStore } from '@/stores/booking';
import type { Booking } from '@/types';

describe('Booking Store', () => {
  beforeEach(() => {
    // Create a fresh pinia instance and set it as active for testing
    setActivePinia(createPinia());
  });

  it('should start with empty bookings collection', () => {
    const store = useBookingStore();
    expect(store.bookings.size).toBe(0);
    expect(store.bookingsArray.length).toBe(0);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('should add bookings to the Map', async () => {
    const store = useBookingStore();
    const booking: Booking = {
      id: 'booking1',
      property_id: 'prop1',
      owner_id: 'owner1',
      guest_departure_date: '2023-06-01T11:00:00Z',
      guest_arrival_date: '2023-06-03T15:00:00Z',
      booking_type: 'standard',
      status: 'pending'
    };

    await store.addBooking(booking);
    expect(store.bookings.size).toBe(1);
    expect(store.bookings.get('booking1')).toEqual(booking);
    expect(store.bookingsArray.length).toBe(1);
  });

  it('should update bookings in the Map', async () => {
    const store = useBookingStore();
    const booking: Booking = {
      id: 'booking1',
      property_id: 'prop1',
      owner_id: 'owner1',
      guest_departure_date: '2023-06-01T11:00:00Z',
      guest_arrival_date: '2023-06-03T15:00:00Z',
      booking_type: 'standard',
      status: 'pending'
    };

    await store.addBooking(booking);
    await store.updateBooking('booking1', { 
      status: 'scheduled',
      notes: 'Updated booking'
    });
    
    const updated = store.bookings.get('booking1');
    expect(updated?.status).toBe('scheduled');
    expect(updated?.notes).toBe('Updated booking');
    expect(updated?.updated_at).toBeDefined();
  });

  it('should remove bookings from the Map', async () => {
    const store = useBookingStore();
    const booking: Booking = {
      id: 'booking1',
      property_id: 'prop1',
      owner_id: 'owner1',
      guest_departure_date: '2023-06-01T11:00:00Z',
      guest_arrival_date: '2023-06-03T15:00:00Z',
      booking_type: 'standard',
      status: 'pending'
    };

    await store.addBooking(booking);
    expect(store.bookings.size).toBe(1);
    
    await store.removeBooking('booking1');
    expect(store.bookings.size).toBe(0);
    expect(store.bookings.get('booking1')).toBeUndefined();
  });
  
  it('should filter bookings by status', () => {
    const store = useBookingStore();
    
    store.addBooking({
      id: 'booking1',
      property_id: 'prop1',
      owner_id: 'owner1',
      guest_departure_date: '2023-06-01T11:00:00Z',
      guest_arrival_date: '2023-06-03T15:00:00Z',
      booking_type: 'standard',
      status: 'pending'
    });
    
    store.addBooking({
      id: 'booking2',
      property_id: 'prop1',
      owner_id: 'owner1',
      guest_departure_date: '2023-06-05T11:00:00Z',
      guest_arrival_date: '2023-06-07T15:00:00Z',
      booking_type: 'standard',
      status: 'scheduled'
    });
    
    expect(store.bookings.size).toBe(2);
    expect(store.bookingsByStatus('pending').size).toBe(1);
    expect(store.bookingsByStatus('scheduled').size).toBe(1);
    expect(store.pendingBookings.length).toBe(1);
    expect(store.scheduledBookings.length).toBe(1);
  });
  
  it('should filter bookings by type', () => {
    const store = useBookingStore();
    
    store.addBooking({
      id: 'booking1',
      property_id: 'prop1',
      owner_id: 'owner1',
      checkout_date: '2023-06-01T11:00:00Z',
      checkin_date: '2023-06-03T15:00:00Z',
      booking_type: 'standard',
      status: 'pending'
    });
    
    store.addBooking({
      id: 'booking2',
      property_id: 'prop1',
      owner_id: 'owner1',
      checkout_date: '2023-06-05T11:00:00Z',
      checkin_date: '2023-06-05T15:00:00Z',
      booking_type: 'turn',
      status: 'pending'
    });
    
    expect(store.bookings.size).toBe(2);
    expect(store.bookingsByType('standard').size).toBe(1);
    expect(store.bookingsByType('turn').size).toBe(1);
    expect(store.standardBookings.length).toBe(1);
    expect(store.turnBookings.length).toBe(1);
  });
  
  it('should filter bookings by property', () => {
    const store = useBookingStore();
    
    store.addBooking({
      id: 'booking1',
      property_id: 'prop1',
      owner_id: 'owner1',
      checkout_date: '2023-06-01T11:00:00Z',
      checkin_date: '2023-06-03T15:00:00Z',
      booking_type: 'standard',
      status: 'pending'
    });
    
    store.addBooking({
      id: 'booking2',
      property_id: 'prop2',
      owner_id: 'owner1',
      checkout_date: '2023-06-05T11:00:00Z',
      checkin_date: '2023-06-07T15:00:00Z',
      booking_type: 'standard',
      status: 'pending'
    });
    
    expect(store.bookingsByProperty('prop1').size).toBe(1);
    expect(store.bookingsByProperty('prop2').size).toBe(1);
    expect(store.bookingsByProperty('prop3').size).toBe(0);
  });
  
  it('should filter bookings by date range', () => {
    const store = useBookingStore();
    
    store.addBooking({
      id: 'booking1',
      property_id: 'prop1',
      owner_id: 'owner1',
      guest_departure_date: '2023-06-01T11:00:00Z',
      guest_arrival_date: '2023-06-03T15:00:00Z',
      booking_type: 'standard',
      status: 'pending'
    });
    
    store.addBooking({
      id: 'booking2',
      property_id: 'prop1',
      owner_id: 'owner1',
      guest_departure_date: '2023-06-10T11:00:00Z',
      guest_arrival_date: '2023-06-12T15:00:00Z',
      booking_type: 'standard',
      status: 'pending'
    });
    
    expect(store.bookingsByDateRange('2023-06-01', '2023-06-05').size).toBe(1);
    expect(store.bookingsByDateRange('2023-06-09', '2023-06-13').size).toBe(1);
    expect(store.bookingsByDateRange('2023-06-05', '2023-06-09').size).toBe(0);
    expect(store.bookingsByDateRange('2023-05-31', '2023-06-13').size).toBe(2);
  });
  
  it('should update booking status', async () => {
    const store = useBookingStore();
    const booking: Booking = {
      id: 'booking1',
      property_id: 'prop1',
      owner_id: 'owner1',
      guest_departure_date: '2023-06-01T11:00:00Z',
      guest_arrival_date: '2023-06-03T15:00:00Z',
      booking_type: 'standard',
      status: 'pending'
    };

    await store.addBooking(booking);
    await store.updateBookingStatus('booking1', 'scheduled');
    
    const updated = store.bookings.get('booking1');
    expect(updated?.status).toBe('scheduled');
  });
  
  it('should assign cleaner to booking', async () => {
    const store = useBookingStore();
    const booking: Booking = {
      id: 'booking1',
      property_id: 'prop1',
      owner_id: 'owner1',
      guest_departure_date: '2023-06-01T11:00:00Z',
      guest_arrival_date: '2023-06-03T15:00:00Z',
      booking_type: 'standard',
      status: 'pending'
    };

    await store.addBooking(booking);
    await store.assignCleaner('booking1', 'cleaner1');
    
    const updated = store.bookings.get('booking1');
    expect(updated?.assigned_cleaner_id).toBe('cleaner1');
  });
  
  it('should clear all bookings', () => {
    const store = useBookingStore();
    
    store.addBooking({
      id: 'booking1',
      property_id: 'prop1',
      owner_id: 'owner1',
      guest_departure_date: '2023-06-01T11:00:00Z',
      guest_arrival_date: '2023-06-03T15:00:00Z',
      booking_type: 'standard',
      status: 'pending'
    });
    
    store.addBooking({
      id: 'booking2',
      property_id: 'prop1',
      owner_id: 'owner1',
      guest_departure_date: '2023-06-05T11:00:00Z',
      guest_arrival_date: '2023-06-07T15:00:00Z',
      booking_type: 'standard',
      status: 'pending'
    });
    
    expect(store.bookings.size).toBe(2);
    
    store.clearAll();
    expect(store.bookings.size).toBe(0);
    expect(store.bookingsArray.length).toBe(0);
  });
}); 