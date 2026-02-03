import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAdminBookings } from '@/composables/admin/useAdminBookings-supabase';
import { useBookingStore } from '@/stores/booking';
import { useAuthStore } from '@/stores/auth';
import type { User, Booking } from '@/types';
import { setAdminUser, addAdminBookings } from '../../utils/test-utils';

describe('useAdminBookings (Role-Based)', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should show all bookings for admin', () => {
    const bookingStore = useBookingStore();
    const authStore = useAuthStore();
    expect(authStore).toBeDefined();
    if (!authStore) throw new Error('authStore is null or undefined');
    setAdminUser(authStore, 'admin1');
    addAdminBookings(bookingStore, 3);
    const { allBookings } = useAdminBookings();
    expect(allBookings.value).toHaveLength(3);
  });

  it('should provide access to ALL bookings across all owners', () => {
    const bookingStore = useBookingStore();
    const userStore = useAuthStore();
    
    // Set up admin user
    const _adminUser: User = {
      id: 'admin1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      settings: {
        notifications: true,
        timezone: 'America/New_York',
        theme: 'light',
        language: 'en'
      }
    };
    setAdminUser(userStore, 'admin1');

    // Add bookings from different owners
    const owner1Booking: Booking = {
      id: 'booking1',
      property_id: 'prop1',
      owner_id: 'owner1',
      checkout_date: '2023-06-01T11:00:00Z',
      checkin_date: '2023-06-03T15:00:00Z',
      booking_type: 'standard',
      status: 'pending'
    };

    const owner2Booking: Booking = {
      id: 'booking2',
      property_id: 'prop2',
      owner_id: 'owner2',
      checkout_date: '2023-06-01T11:00:00Z',
      checkin_date: '2023-06-01T15:00:00Z',
      booking_type: 'turn',
      status: 'scheduled'
    };

    bookingStore.addBooking(owner1Booking);
    bookingStore.addBooking(owner2Booking);

    const { allBookings } = useAdminBookings();

    // Admin should see ALL bookings regardless of owner
    expect(allBookings.value).toHaveLength(2);
    expect(allBookings.value.map(b => b.owner_id)).toContain('owner1');
    expect(allBookings.value.map(b => b.owner_id)).toContain('owner2');
  });

  it('should provide system-wide turn alerts for business management', () => {
    const bookingStore = useBookingStore();
    const userStore = useAuthStore();
    
    // Set up admin user
    const _adminUser: User = {
      id: 'admin1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      settings: {
        notifications: true,
        timezone: 'America/New_York',
        theme: 'light',
        language: 'en'
      }
    };
    setAdminUser(userStore, 'admin1');

    // Add turn bookings from multiple owners
    const turnBooking1: Booking = {
      id: 'turn1',
      property_id: 'prop1',
      owner_id: 'owner1',
      checkout_date: '2023-06-01T11:00:00Z',
      checkin_date: '2023-06-01T15:00:00Z',
      booking_type: 'turn',
      status: 'pending'
    };

    const turnBooking2: Booking = {
      id: 'turn2',
      property_id: 'prop2',
      owner_id: 'owner2',
      checkout_date: '2023-06-01T12:00:00Z',
      checkin_date: '2023-06-01T16:00:00Z',
      booking_type: 'turn',
      status: 'pending'
    };

    const standardBooking: Booking = {
      id: 'standard1',
      property_id: 'prop3',
      owner_id: 'owner1',
      checkout_date: '2023-06-02T11:00:00Z',
      checkin_date: '2023-06-04T15:00:00Z',
      booking_type: 'standard',
      status: 'pending'
    };

    bookingStore.addBooking(turnBooking1);
    bookingStore.addBooking(turnBooking2);
    bookingStore.addBooking(standardBooking);

    const { systemTurnAlerts, allTurnBookings } = useAdminBookings();

    // Admin should see ALL turn bookings across all owners
    expect(allTurnBookings.value).toHaveLength(2);
    expect(systemTurnAlerts.value).toHaveLength(2);
    expect(systemTurnAlerts.value.map(t => t.owner_id)).toContain('owner1');
    expect(systemTurnAlerts.value.map(t => t.owner_id)).toContain('owner2');
  });

  it('should enable cross-owner booking management', async () => {
    const userStore = useAuthStore();
    
    // Set up admin user
    const _adminUser: User = {
      id: 'admin1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      settings: {
        notifications: true,
        timezone: 'America/New_York',
        theme: 'light',
        language: 'en'
      }
    };
    setAdminUser(userStore, 'admin1');

    const { createBookingForOwner, canManageAnyBooking } = useAdminBookings();

    // Admin should be able to create bookings for any owner
    const newBookingData = {
      property_id: 'prop1',
      owner_id: 'owner1', // Admin can specify any owner
      checkout_date: '2023-06-01T11:00:00Z',
      checkin_date: '2023-06-03T15:00:00Z',
      booking_type: 'standard' as const,
      status: 'pending' as const
    };

    const result = await createBookingForOwner(newBookingData);

    // Should create booking with specified owner
    expect(result).toBeDefined();
    expect(result?.owner_id).toBe('owner1');
    expect(result?.property_id).toBe('prop1');

    // Admin should have management permissions for any booking
    expect(canManageAnyBooking()).toBe(true);
  });

  it('should provide business analytics across all properties', () => {
    const bookingStore = useBookingStore();
    const userStore = useAuthStore();
    
    // Set up admin user
    const _adminUser: User = {
      id: 'admin1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      settings: {
        notifications: true,
        timezone: 'America/New_York',
        theme: 'light',
        language: 'en'
      }
    };
    setAdminUser(userStore, 'admin1');

    // Add bookings with different statuses from multiple owners
    const bookings: Booking[] = [
      { id: 'b1', property_id: 'p1', owner_id: 'owner1', checkout_date: '2023-06-01T11:00:00Z', checkin_date: '2023-06-01T15:00:00Z', booking_type: 'turn', status: 'pending' },
      { id: 'b2', property_id: 'p2', owner_id: 'owner2', checkout_date: '2023-06-01T11:00:00Z', checkin_date: '2023-06-01T15:00:00Z', booking_type: 'turn', status: 'scheduled' },
      { id: 'b3', property_id: 'p3', owner_id: 'owner1', checkout_date: '2023-06-01T11:00:00Z', checkin_date: '2023-06-01T15:00:00Z', booking_type: 'standard', status: 'completed' },
      { id: 'b4', property_id: 'p4', owner_id: 'owner3', checkout_date: '2023-06-01T11:00:00Z', checkin_date: '2023-06-01T15:00:00Z', booking_type: 'standard', status: 'cancelled' }
    ];

    bookings.forEach(booking => bookingStore.addBooking(booking));

    const { businessMetrics, getBookingsByStatus } = useAdminBookings();

    // Should provide system-wide analytics
    expect(businessMetrics.value.totalBookings).toBe(4);
    expect(businessMetrics.value.turnBookings).toBe(2);
    expect(businessMetrics.value.standardBookings).toBe(2);
    expect(businessMetrics.value.uniqueOwners).toBe(3);

    // Should filter by status across all owners
    expect(getBookingsByStatus('pending')).toHaveLength(1);
    expect(getBookingsByStatus('scheduled')).toHaveLength(1);
    expect(getBookingsByStatus('completed')).toHaveLength(1);
    expect(getBookingsByStatus('cancelled')).toHaveLength(1);
  });

  it('should handle cleaner assignment across all properties', () => {
    const bookingStore = useBookingStore();
    const userStore = useAuthStore();
    
    // Set up admin user
    const _adminUser: User = {
      id: 'admin1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      settings: {
        notifications: true,
        timezone: 'America/New_York',
        theme: 'light',
        language: 'en'
      }
    };
    setAdminUser(userStore, 'admin1');

    // Add unassigned bookings from different owners
    const booking1: Booking = {
      id: 'unassigned1',
      property_id: 'prop1',
      owner_id: 'owner1',
      checkout_date: '2023-06-01T11:00:00Z',
      checkin_date: '2023-06-01T15:00:00Z',
      booking_type: 'turn',
      status: 'pending'
    };

    const booking2: Booking = {
      id: 'unassigned2',
      property_id: 'prop2',
      owner_id: 'owner2',
      checkout_date: '2023-06-01T11:00:00Z',
      checkin_date: '2023-06-01T15:00:00Z',
      booking_type: 'standard',
      status: 'pending'
    };

    bookingStore.addBooking(booking1);
    bookingStore.addBooking(booking2);

    const { unassignedBookings, assignCleanerToBooking } = useAdminBookings();

    // Should see all unassigned bookings across owners
    expect(unassignedBookings.value).toHaveLength(2);

    // Should be able to assign cleaners to any booking
    const success = assignCleanerToBooking('unassigned1', 'cleaner1');
    expect(success).toBe(true);
  });

  it('should provide today urgent turns for operational priority', () => {
    const bookingStore = useBookingStore();
    const userStore = useAuthStore();
    
    // Set up admin user
    const _adminUser: User = {
      id: 'admin1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      settings: {
        notifications: true,
        timezone: 'America/New_York',
        theme: 'light',
        language: 'en'
      }
    };
    setAdminUser(userStore, 'admin1');

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Add today's urgent turns from multiple owners
    const todayTurn1: Booking = {
      id: 'urgent1',
      property_id: 'prop1',
      owner_id: 'owner1',
      checkout_date: `${today}T11:00:00Z`,
      checkin_date: `${today}T15:00:00Z`,
      booking_type: 'turn',
      status: 'pending'
    };

    const todayTurn2: Booking = {
      id: 'urgent2',
      property_id: 'prop2',
      owner_id: 'owner2',
      checkout_date: `${today}T12:00:00Z`,
      checkin_date: `${today}T16:00:00Z`,
      booking_type: 'turn',
      status: 'pending'
    };

    const tomorrowTurn: Booking = {
      id: 'future1',
      property_id: 'prop3',
      owner_id: 'owner1',
      checkout_date: `${tomorrow}T11:00:00Z`,
      checkin_date: `${tomorrow}T15:00:00Z`,
      booking_type: 'turn',
      status: 'pending'
    };

    bookingStore.addBooking(todayTurn1);
    bookingStore.addBooking(todayTurn2);
    bookingStore.addBooking(tomorrowTurn);

    const { todayUrgentTurns } = useAdminBookings();

    // Should only show today's urgent turns across all owners
    expect(todayUrgentTurns.value).toHaveLength(2);
    expect(todayUrgentTurns.value.map(t => t.id)).toContain('urgent1');
    expect(todayUrgentTurns.value.map(t => t.id)).toContain('urgent2');
    expect(todayUrgentTurns.value.map(t => t.id)).not.toContain('future1');
  });

  it('should enforce admin permissions for system management', () => {
    const userStore = useAuthStore();
    
    // Set up admin user
    const _adminUser: User = {
      id: 'admin1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      settings: {
        notifications: true,
        timezone: 'America/New_York',
        theme: 'light',
        language: 'en'
      }
    };
    setAdminUser(userStore, 'admin1');

    const { 
      canEditAnyBooking, 
      canDeleteAnyBooking, 
      canAssignCleaners, 
      canViewSystemMetrics 
    } = useAdminBookings();

    // Admin should have full system permissions
    expect(canEditAnyBooking()).toBe(true);
    expect(canDeleteAnyBooking()).toBe(true);
    expect(canAssignCleaners()).toBe(true);
    expect(canViewSystemMetrics()).toBe(true);
  });
}); 
