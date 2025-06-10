import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { usePropertyStore } from '@/stores/property';
import type { Property } from '@/types';

describe('Property Store', () => {
  beforeEach(() => {
    // Create a fresh pinia instance and set it as active for testing
    setActivePinia(createPinia());
  });

  it('should start with empty properties collection', () => {
    const store = usePropertyStore();
    expect(store.properties.size).toBe(0);
    expect(store.propertiesArray.length).toBe(0);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('should add properties to the Map', () => {
    const store = usePropertyStore();
    const property: Property = {
      id: 'prop1',
      owner_id: 'owner1',
      name: 'Beach House',
      address: '123 Ocean Dr',
      cleaning_duration: 120,
      pricing_tier: 'premium',
      active: true
    };

    store.addProperty(property);
    expect(store.properties.size).toBe(1);
    expect(store.properties.get('prop1')).toEqual(property);
    expect(store.propertiesArray.length).toBe(1);
  });

  it('should update properties in the Map', () => {
    const store = usePropertyStore();
    const property: Property = {
      id: 'prop1',
      owner_id: 'owner1',
      name: 'Beach House',
      address: '123 Ocean Dr',
      cleaning_duration: 120,
      pricing_tier: 'premium',
      active: true
    };

    store.addProperty(property);
    store.updateProperty('prop1', { 
      name: 'Updated Beach House', 
      cleaning_duration: 150 
    });
    
    const updated = store.properties.get('prop1');
    expect(updated?.name).toBe('Updated Beach House');
    expect(updated?.cleaning_duration).toBe(150);
    expect(updated?.updated_at).toBeDefined();
  });

  it('should remove properties from the Map', () => {
    const store = usePropertyStore();
    const property: Property = {
      id: 'prop1',
      owner_id: 'owner1',
      name: 'Beach House',
      address: '123 Ocean Dr',
      cleaning_duration: 120,
      pricing_tier: 'premium',
      active: true
    };

    store.addProperty(property);
    expect(store.properties.size).toBe(1);
    
    store.removeProperty('prop1');
    expect(store.properties.size).toBe(0);
    expect(store.properties.get('prop1')).toBeUndefined();
  });
  
  it('should filter active properties', () => {
    const store = usePropertyStore();
    
    store.addProperty({
      id: 'prop1',
      owner_id: 'owner1',
      name: 'Active Property',
      address: '123 Main St',
      cleaning_duration: 120,
      pricing_tier: 'basic',
      active: true
    });
    
    store.addProperty({
      id: 'prop2',
      owner_id: 'owner1',
      name: 'Inactive Property',
      address: '456 Side St',
      cleaning_duration: 90,
      pricing_tier: 'basic',
      active: false
    });
    
    expect(store.properties.size).toBe(2);
    expect(store.activeProperties.length).toBe(1);
    expect(store.activeProperties[0].name).toBe('Active Property');
  });
  
  it('should filter properties by pricing tier', () => {
    const store = usePropertyStore();
    
    store.addProperty({
      id: 'prop1',
      owner_id: 'owner1',
      name: 'Basic Property',
      address: '123 Main St',
      cleaning_duration: 90,
      pricing_tier: 'basic',
      active: true
    });
    
    store.addProperty({
      id: 'prop2',
      owner_id: 'owner1',
      name: 'Premium Property',
      address: '456 Side St',
      cleaning_duration: 120,
      pricing_tier: 'premium',
      active: true
    });
    
    store.addProperty({
      id: 'prop3',
      owner_id: 'owner2',
      name: 'Luxury Property',
      address: '789 Ocean Dr',
      cleaning_duration: 180,
      pricing_tier: 'luxury',
      active: true
    });
    
    expect(store.properties.size).toBe(3);
    expect(store.propertiesByPricingTier('basic').length).toBe(1);
    expect(store.propertiesByPricingTier('premium').length).toBe(1);
    expect(store.propertiesByPricingTier('luxury').length).toBe(1);
    expect(store.propertiesByPricingTier('basic')[0].name).toBe('Basic Property');
  });
  
  it('should filter properties by owner', () => {
    const store = usePropertyStore();
    
    store.addProperty({
      id: 'prop1',
      owner_id: 'owner1',
      name: 'Owner 1 Property A',
      address: '123 Main St',
      cleaning_duration: 90,
      pricing_tier: 'basic',
      active: true
    });
    
    store.addProperty({
      id: 'prop2',
      owner_id: 'owner1',
      name: 'Owner 1 Property B',
      address: '456 Side St',
      cleaning_duration: 120,
      pricing_tier: 'premium',
      active: true
    });
    
    store.addProperty({
      id: 'prop3',
      owner_id: 'owner2',
      name: 'Owner 2 Property',
      address: '789 Ocean Dr',
      cleaning_duration: 180,
      pricing_tier: 'luxury',
      active: true
    });
    
    expect(store.propertiesByOwner('owner1').length).toBe(2);
    expect(store.propertiesByOwner('owner2').length).toBe(1);
    expect(store.propertiesByOwner('owner3').length).toBe(0);
  });
  
  it('should clear all properties', () => {
    const store = usePropertyStore();
    
    store.addProperty({
      id: 'prop1',
      owner_id: 'owner1',
      name: 'Property 1',
      address: '123 Main St',
      cleaning_duration: 90,
      pricing_tier: 'basic',
      active: true
    });
    
    store.addProperty({
      id: 'prop2',
      owner_id: 'owner1',
      name: 'Property 2',
      address: '456 Side St',
      cleaning_duration: 120,
      pricing_tier: 'premium',
      active: true
    });
    
    expect(store.properties.size).toBe(2);
    
    store.clearAll();
    expect(store.properties.size).toBe(0);
    expect(store.propertiesArray.length).toBe(0);
  });
}); 