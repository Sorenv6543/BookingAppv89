import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from '@/stores/user';

describe('User Store', () => {
  beforeEach(() => {
    // Create a fresh pinia instance and set it as active for testing
    setActivePinia(createPinia());
  });

  it('should start with empty collections', () => {
    const store = useUserStore();
    expect(store.houses.size).toBe(0);
    expect(store.events.size).toBe(0);
    expect(store.user).toBeNull();
  });

  it('should add properties to the Map', () => {
    const store = useUserStore();
    const property = {
      id: 'prop1',
      owner_id: 'owner1',
      name: 'Beach House',
      address: '123 Ocean Ave',
      cleaning_duration: 120,
      pricing_tier: 'premium',
      active: true
    };

    store.addProperty(property);
    expect(store.houses.size).toBe(1);
    expect(store.houses.get('prop1')).toEqual(property);
    expect(store.propertiesArray.length).toBe(1);
  });

  it('should update properties in the Map', () => {
    const store = useUserStore();
    const property = {
      id: 'prop1',
      owner_id: 'owner1',
      name: 'Beach House',
      address: '123 Ocean Ave',
      cleaning_duration: 120,
      pricing_tier: 'premium',
      active: true
    };

    store.addProperty(property);
    store.updateProperty('prop1', { name: 'Updated Beach House', active: false });
    
    const updated = store.houses.get('prop1');
    expect(updated?.name).toBe('Updated Beach House');
    expect(updated?.active).toBe(false);
    expect(updated?.updated_at).toBeDefined();
  });

  it('should add bookings to the Map', () => {
    const store = useUserStore();
    const booking = {
      id: 'booking1',
      property_id: 'prop1',
      owner_id: 'owner1',
      checkout_date: '2023-06-01T11:00:00Z',
      checkin_date: '2023-06-03T15:00:00Z',
      booking_type: 'standard',
      status: 'pending'
    };

    store.addEvent(booking);
    expect(store.events.size).toBe(1);
    expect(store.events.get('booking1')).toEqual(booking);
    expect(store.bookingsArray.length).toBe(1);
  });

  it('should clear all data', () => {
    const store = useUserStore();
    
    // Add some data
    store.addProperty({
      id: 'prop1',
      owner_id: 'owner1',
      name: 'Beach House',
      address: '123 Ocean Ave',
      cleaning_duration: 120,
      pricing_tier: 'premium',
      active: true
    });
    
    store.addEvent({
      id: 'booking1',
      property_id: 'prop1',
      owner_id: 'owner1',
      checkout_date: '2023-06-01T11:00:00Z',
      checkin_date: '2023-06-03T15:00:00Z',
      booking_type: 'standard',
      status: 'pending'
    });
    
    store.setUser({
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
    
    // Verify data was added
    expect(store.houses.size).toBe(1);
    expect(store.events.size).toBe(1);
    expect(store.user).not.toBeNull();
    
    // Clear all data
    store.clearAllData();
    
    // Verify data was cleared
    expect(store.houses.size).toBe(0);
    expect(store.events.size).toBe(0);
    expect(store.user).toBeNull();
  });
}); 