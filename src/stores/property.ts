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
  
  // Getters
  const propertiesArray = computed((): Property[] => {
    return Array.from(properties.value.values());
  });
  
  const activeProperties = computed((): Property[] => {
    return propertiesArray.value.filter(property => property.active);
  });
  
  const getPropertyById = computed(() => (id: string): Property | undefined => {
    return properties.value.get(id);
  });
  
  const propertiesByPricingTier = computed(() => (tier: PricingTier): Property[] => {
    return propertiesArray.value.filter(property => property.pricing_tier === tier);
  });
  
  const propertiesByOwner = computed(() => (ownerId: string): Property[] => {
    return propertiesArray.value.filter(property => property.owner_id === ownerId);
  });
  
  // Actions
  function addProperty(property: Property) {
    properties.value.set(property.id, property);
  }
  
  function updateProperty(id: string, updates: Partial<Property>) {
    const existing = properties.value.get(id);
    if (existing) {
      properties.value.set(id, { 
        ...existing, 
        ...updates, 
        updated_at: new Date().toISOString() 
      });
    }
  }
  
  function removeProperty(id: string) {
    properties.value.delete(id);
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
  }
  
  return {
    // State
    properties,
    loading,
    error,
    
    // Getters
    propertiesArray,
    activeProperties,
    getPropertyById,
    propertiesByPricingTier,
    propertiesByOwner,
    
    // Actions
    addProperty,
    updateProperty,
    removeProperty,
    fetchProperties,
    setPropertyActiveStatus,
    clearAll
  };
}); 