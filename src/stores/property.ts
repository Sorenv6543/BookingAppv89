import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Property, PropertyMap, PricingTier } from '@/types';

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
  
  // Actions
  function addProperty(property: Property) {
    properties.value.set(property.id, property);
    invalidateCache(); // Invalidate cache when data changes
  }
  
  function updateProperty(id: string, updates: Partial<Property>) {
    const existing = properties.value.get(id);
    if (existing) {
      properties.value.set(id, { 
        ...existing, 
        ...updates, 
        updated_at: new Date().toISOString() 
      });
      invalidateCache(); // Invalidate cache when data changes
    }
  }
  
  function removeProperty(id: string) {
    properties.value.delete(id);
    invalidateCache(); // Invalidate cache when data changes
  }
  
  async function fetchProperties() {
    loading.value = true;
    error.value = null;
    
    try {
      // In a real app, this would be a Supabase or API call
      // For now, we'll simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Fetch simulation complete
      loading.value = false;
      invalidateCache(); // Invalidate cache after fetch
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error fetching properties';
      loading.value = false;
    }
  }
  
  function setPropertyActiveStatus(id: string, active: boolean) {
    updateProperty(id, { active });
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
    addProperty,
    updateProperty,
    removeProperty,
    fetchProperties,
    setPropertyActiveStatus,
    clearAll,
    
    // Cache management
    invalidateCache
  };
}); 