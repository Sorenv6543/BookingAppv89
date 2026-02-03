import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Property, PropertyMap, PricingTier } from '@/types';
import supabase from '@/plugins/supabase';

/**
 * Property store for the Property Cleaning Scheduler
 * Uses Map collections for efficient property access and management
 */
export const usePropertyStore = defineStore('property', () => {
  // State
  const properties = ref<PropertyMap>(new Map());
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  
  // Cached filtered Maps for O(1) performance
  const cachedTierMaps = ref<Map<PricingTier, Map<string, Property>> | null>(null);
  const cachedOwnerMaps = ref(new Map<string, Map<string, Property>>());
  const cachedActiveMap = ref<Map<string, Property> | null>(null);
  const cacheTimestamp = ref(0);
  const CACHE_TTL = 10000; // 10 seconds
  
  // Cache management
  const isCacheValid = computed(() => {
    return (Date.now() - cacheTimestamp.value) < CACHE_TTL;
  });
  
  const invalidateCache = () => {
    cachedTierMaps.value = null;
    cachedOwnerMaps.value.clear();
    cachedActiveMap.value = null;
    cacheTimestamp.value = 0;
  };
  
  // Getters - Map-based with caching
  const propertiesArray = computed((): Property[] => {
    return Array.from(properties.value.values());
  });
  
  // Cached active properties Map
  const activePropertiesMap = computed((): Map<string, Property> => {
    if (isCacheValid.value && cachedActiveMap.value) {
      return cachedActiveMap.value;
    }
    
    const activeMap = new Map<string, Property>();
    properties.value.forEach((property, id) => {
      if (property.active) {
        activeMap.set(id, property);
      }
    });
    
    cachedActiveMap.value = activeMap;
    cacheTimestamp.value = Date.now();
    
    return activeMap;
  });
  
  // Array getter for active properties (when components need arrays)
  const activeProperties = computed((): Property[] => {
    return Array.from(activePropertiesMap.value.values());
  });
  
  const getPropertyById = computed(() => (id: string): Property | undefined => {
    return properties.value.get(id);
  });
  
  // Map-based pricing tier filtering with caching
  const propertiesByPricingTierMap = computed(() => {
    if (isCacheValid.value && cachedTierMaps.value) {
      return cachedTierMaps.value;
    }
    
    const tierMaps = new Map<PricingTier, Map<string, Property>>();
    
    properties.value.forEach((property, id) => {
      const tier = property.pricing_tier;
      if (!tierMaps.has(tier)) {
        tierMaps.set(tier, new Map());
      }
      tierMaps.get(tier)!.set(id, property);
    });
    
    cachedTierMaps.value = tierMaps;
    cacheTimestamp.value = Date.now();
    
    return tierMaps;
  });
  
  // Efficient getter function that returns Map
  const propertiesByPricingTier = computed(() => (tier: PricingTier): Map<string, Property> => {
    return propertiesByPricingTierMap.value.get(tier) || new Map();
  });
  
  // Map-based owner filtering with caching
  const propertiesByOwner = computed(() => (ownerId: string): Map<string, Property> => {
    if (isCacheValid.value && cachedOwnerMaps.value.has(ownerId)) {
      return cachedOwnerMaps.value.get(ownerId)!;
    }
    
    const filtered = new Map<string, Property>();
    properties.value.forEach((property, id) => {
      if (property.owner_id === ownerId) {
        filtered.set(id, property);
      }
    });
    
    cachedOwnerMaps.value.set(ownerId, filtered);
    return filtered;
  });
  
  // Optimized status counting using Map iteration
  const propertiesByActiveStatus = computed(() => {
    const active = activePropertiesMap.value.size;
    const total = properties.value.size;
    
    return {
      active,
      inactive: total - active
    };
  });
  
  const averageCleaningDuration = computed((): number => {
    let total = 0;
    let count = 0;
    
    activePropertiesMap.value.forEach(property => {
      total += property.cleaning_duration;
      count++;
    });
    
    return count > 0 ? total / count : 0;
  });
  
  // --- Supabase RLS Policy ---
  // Owners can insert/select their own properties. See supabase/migrations/002_rls_policies.sql for details.
  
  // Actions
  async function fetchProperties() {
    console.log('🔍 [PropertyStore] fetchProperties called');
    loading.value = true;
    error.value = null;
    
    try {
      console.log('🔍 [PropertyStore] Starting database query...');
      if (import.meta.env.DEV) console.log('🔍 fetchProperties: Starting database query...');
      const { data, error: supaError } = await supabase.from('properties').select('*');
      if (supaError) throw supaError;

      if (import.meta.env.DEV) console.log('🔍 fetchProperties: Raw data from database:', data);

      properties.value.clear();
      if (data) {
        for (const prop of data) {
          properties.value.set(prop.id, prop);
        }
      }

      if (import.meta.env.DEV) console.log('🔍 fetchProperties: Final properties map size:', properties.value.size);
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch properties.';
      console.error('❌ [PropertyStore] fetchProperties error:', err);
    } finally {
      loading.value = false;
      console.log('🔍 [PropertyStore] fetchProperties completed, loading:', loading.value);
      invalidateCache(); // Invalidate cache after fetch
    }
  }
  
  async function addProperty(property: Property) {
    // Optimistic update
    properties.value.set(property.id, property);
    error.value = null;
    
    try {
      const { error: supaError } = await supabase.from('properties').insert([property]);
      if (supaError) throw supaError;
      invalidateCache(); // Invalidate cache after successful insert
    } catch (err: unknown) {
      properties.value.delete(property.id);
      error.value = err instanceof Error ? err.message : 'Failed to add property.';
      console.error('addProperty error:', err);
      throw err;
    }
  }
  
  async function updateProperty(id: string, updates: Partial<Property>) {
    const existing = properties.value.get(id);
    if (!existing) {
      error.value = 'Property not found';
      throw new Error('Property not found');
    }

    // Optimistic update
    const updated = { 
      ...existing, 
      ...updates, 
      updated_at: new Date().toISOString() 
    };
    properties.value.set(id, updated);
    error.value = null;
    
    try {
      const { error: supaError } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id);
      
      if (supaError) throw supaError;
      invalidateCache(); // Invalidate cache after successful update
    } catch (err: unknown) {
      // Rollback on error
      properties.value.set(id, existing);
      error.value = err instanceof Error ? err.message : 'Failed to update property.';
      console.error('updateProperty error:', err);
      throw err;
    }
  }
  
  async function removeProperty(id: string) {
    const existing = properties.value.get(id);
    if (!existing) {
      error.value = 'Property not found';
      throw new Error('Property not found');
    }

    // Optimistic update (soft delete by setting active = false)
    const deactivated = { ...existing, active: false, updated_at: new Date().toISOString() };
    properties.value.set(id, deactivated);
    error.value = null;
    
    try {
      const { error: supaError } = await supabase
        .from('properties')
        .update({ active: false, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (supaError) throw supaError;
      
      // Remove from local state after successful soft delete
      properties.value.delete(id);
      invalidateCache(); // Invalidate cache after successful delete
    } catch (err: unknown) {
      // Rollback on error
      properties.value.set(id, existing);
      error.value = err instanceof Error ? err.message : 'Failed to remove property.';
      console.error('removeProperty error:', err);
      throw err;
    }
  }
  
  async function setPropertyActiveStatus(id: string, active: boolean) {
    await updateProperty(id, { active });
  }
  
  function clearAll() {
    properties.value.clear();
    invalidateCache(); // Invalidate cache when data changes
  }
  
  return {
    // State
    properties,
    loading,
    error,
    
    // Map getters (primary - for O(1) operations)
    activePropertiesMap,
    propertiesByPricingTierMap,
    
    // Parameterized Map getters
    getPropertyById,
    propertiesByPricingTier,
    propertiesByOwner,
    
    // Array getters (secondary - only when UI needs arrays)
    propertiesArray,
    activeProperties,
    
    // Computed metrics
    propertiesByActiveStatus,
    averageCleaningDuration,
    
    // Actions
    fetchProperties,
    addProperty,
    updateProperty,
    removeProperty,
    setPropertyActiveStatus,
    clearAll,
    
    // Cache management
    invalidateCache
  };
}); 