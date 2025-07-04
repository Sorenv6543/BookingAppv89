import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from '@/stores/user';
import { usePropertyStore } from '@/stores/property';
import { useBookingStore } from '@/stores/booking';
import type { User } from '@/types';
import { createUserWithSettings } from '@/utils/authHelpers';

describe('User Store', () => {
  beforeEach(() => {
    // Create a fresh pinia instance and set it as active for testing
    setActivePinia(createPinia());
  });

  it('should start with null user and default settings', () => {
    const store = useUserStore();
    expect(store.currentUser).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(store.settings.notifications).toBe(true);
    expect(store.settings.theme).toBe('light');
    expect(store.settings.timezone).toBe('America/New_York');
  });

  it('should set and authenticate user', () => {
    const store = useUserStore();
    const user = createUserWithSettings({
      id: 'user1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'owner',
      settings: {
        notifications: true,
        timezone: 'America/New_York',
        theme: 'light',
        language: 'en'
      }
    });

    store.setUser(user);
    expect(store.currentUser).toEqual(user);
    expect(store.isAuthenticated).toBe(true);
    expect(store.sessionId).toBe('session-user1');
  });

  it('should provide user-filtered properties for owner', () => {
    const store = useUserStore();
    const propertyStore = usePropertyStore();
    
    // Set up user
    const user = createUserWithSettings({
      id: 'owner1',
      email: 'owner@example.com',
      name: 'Property Owner',
      role: 'owner',
      settings: {
        notifications: true,
        timezone: 'America/New_York',
        theme: 'light',
        language: 'en'
      }
    });
    store.setUser(user);

    // Add properties
    propertyStore.addProperty({
      id: 'prop1',
      owner_id: 'owner1',
      name: 'Owner House',
      address: '123 Owner St',
      cleaning_duration: 120,
      pricing_tier: 'standard',
      active: true
    });

    propertyStore.addProperty({
      id: 'prop2',
      owner_id: 'other_owner',
      name: 'Other House',
      address: '456 Other St',
      cleaning_duration: 90,
      pricing_tier: 'premium',
      active: true
    });

    // User should only see their own properties (owner gets Map, admin gets Array)
    if (Array.isArray(store.userProperties)) {
      expect(store.userProperties.length).toBe(1);
      expect(store.userProperties[0].owner_id).toBe('owner1');
    } else {
      expect(store.userProperties.size).toBe(1);
      expect(Array.from(store.userProperties.values())[0].owner_id).toBe('owner1');
    }
    expect(store.userActiveProperties.size).toBe(1);
  });

  it('should provide all properties for admin', () => {
    const store = useUserStore();
    const propertyStore = usePropertyStore();
    
    // Set up admin user
    const adminUser = createUserWithSettings({
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
    });
    store.setUser(adminUser);

    // Add properties from different owners
    propertyStore.addProperty({
      id: 'prop1',
      owner_id: 'owner1',
      name: 'House 1',
      address: '123 Street',
      cleaning_duration: 120,
      pricing_tier: 'standard',
      active: true
    });

    propertyStore.addProperty({
      id: 'prop2',
      owner_id: 'owner2',
      name: 'House 2',
      address: '456 Avenue',
      cleaning_duration: 90,
      pricing_tier: 'premium',
      active: true
    });

    // Admin should see all properties
    expect(store.userProperties).toHaveLength(2);
  });

  it('should provide user-filtered bookings for owner', () => {
    const store = useUserStore();
    const bookingStore = useBookingStore();
    
    // Set up user
    const user = createUserWithSettings({
      id: 'owner1',
      email: 'owner@example.com',
      name: 'Property Owner',
      role: 'owner',
      settings: {
        notifications: true,
        timezone: 'America/New_York',
        theme: 'light',
        language: 'en'
      }
    });
    store.setUser(user);

    // Add bookings
    bookingStore.addBooking({
      id: 'booking1',
      property_id: 'prop1',
      owner_id: 'owner1',
      checkout_date: '2023-06-01T11:00:00Z',
      checkin_date: '2023-06-03T15:00:00Z',
      booking_type: 'standard',
      status: 'pending'
    });

    bookingStore.addBooking({
      id: 'booking2',
      property_id: 'prop2',
      owner_id: 'other_owner',
      checkout_date: '2023-06-01T11:00:00Z',
      checkin_date: '2023-06-01T15:00:00Z',
      booking_type: 'turn',
      status: 'scheduled'
    });

    // User should only see their own bookings (owner gets Map, admin gets Array)
    if (Array.isArray(store.userBookings)) {
      expect(store.userBookings.length).toBe(1);
      expect(store.userBookings[0].owner_id).toBe('owner1');
    } else {
      expect(store.userBookings.size).toBe(1);
      expect(Array.from(store.userBookings.values())[0].owner_id).toBe('owner1');
    }
  });

  it('should manage favorite properties', () => {
    const store = useUserStore();
    const propertyStore = usePropertyStore();
    
    // Set up user and property
    const user: User = {
      id: 'owner1',
      email: 'owner@example.com',
      name: 'Property Owner',
      role: 'owner',
      settings: {
        notifications: true,
        timezone: 'America/New_York',
        theme: 'light',
        language: 'en'
      }
    };
    store.setUser(user);

    propertyStore.addProperty({
      id: 'prop1',
      owner_id: 'owner1',
      name: 'Beach House',
      address: '123 Ocean Ave',
      cleaning_duration: 120,
      pricing_tier: 'premium',
      active: true
    });

    // Initially no favorites
    expect(store.favoriteProperties.size).toBe(0);

    // Add to favorites
    store.toggleFavoriteProperty('prop1');
    expect(store.favoriteProperties.size).toBe(1);
    expect(Array.from(store.favoriteProperties.values())[0].id).toBe('prop1');

    // Remove from favorites
    store.toggleFavoriteProperty('prop1');
    expect(store.favoriteProperties.size).toBe(0);
  });

  it('should check permissions correctly', () => {
    const store = useUserStore();
    
    // Test owner permissions
    const ownerUser: User = {
      id: 'owner1',
      email: 'owner@example.com',
      name: 'Property Owner',
      role: 'owner',
      settings: {
        notifications: true,
        timezone: 'America/New_York',
        theme: 'light',
        language: 'en'
      }
    };
    store.setUser(ownerUser);

    // Owner can view anything
    expect(store.hasPermission('view', 'property')).toBe(true);
    expect(store.hasPermission('view', 'booking')).toBe(true);
    
    // Owner can edit/delete their own resources
    expect(store.hasPermission('edit', 'property', 'owner1')).toBe(true);
    expect(store.hasPermission('edit', 'property', 'other_owner')).toBe(false);
    expect(store.hasPermission('delete', 'booking', 'owner1')).toBe(true);
    expect(store.hasPermission('delete', 'booking', 'other_owner')).toBe(false);

    // Test admin permissions
    const adminUser: User = {
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
    store.setUser(adminUser);

    // Admin can do everything
    expect(store.hasPermission('view', 'property')).toBe(true);
    expect(store.hasPermission('edit', 'property', 'any_owner')).toBe(true);
    expect(store.hasPermission('delete', 'booking', 'any_owner')).toBe(true);
  });

  it('should clear user data on logout', () => {
    const store = useUserStore();
    
    // Set up user with preferences
    const user: User = {
      id: 'user1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'owner',
      settings: {
        notifications: true,
        timezone: 'America/New_York',
        theme: 'light',
        language: 'en'
      }
    };
    store.setUser(user);
    store.toggleFavoriteProperty('prop1');
    store.addRecentlyViewedProperty('prop2');

    // Verify data was set
    expect(store.isAuthenticated).toBe(true);
    expect(store.viewPreferences.favoriteProperties.size).toBe(1);
    expect(store.viewPreferences.recentlyViewedProperties).toHaveLength(1);

    // Logout (set user to null)
    store.setUser(null);

    // Verify data was cleared
    expect(store.isAuthenticated).toBe(false);
    expect(store.currentUser).toBeNull();
    expect(store.viewPreferences.favoriteProperties.size).toBe(0);
    expect(store.viewPreferences.recentlyViewedProperties).toHaveLength(0);
  });

  it('should add a user to the store', () => {
    const store = useUserStore();
    const user = createUserWithSettings({
      id: 'test-user-1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'owner' as const,
      settings: {
        notifications: true,
        timezone: 'UTC',
        theme: 'light' as const,
        language: 'en'
      }
    });

    store.addUser(user);
  });
}); 