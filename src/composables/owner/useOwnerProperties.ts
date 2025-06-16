import { ref, computed } from 'vue';
import { useProperties } from '@/composables/shared/useProperties';
import { useAuthStore } from '@/stores/auth';
import { usePropertyStore } from '@/stores/property';
import { useBookingStore } from '@/stores/booking';
import type { Property, PropertyFormData, PricingTier } from '@/types';

/**
 * Owner-specific property composable
 * Extends shared useProperties functionality with owner data filtering
 * 
 * Key Features:
 * - All operations filtered to current owner's properties only
 * - Owner-specific validation and error messages
 * - Automatic owner_id assignment on create operations
 * - Ownership validation on update/delete operations
 * - Owner-specific metrics calculation
 * - Removes admin-only property management functions
 */
export function useOwnerProperties() {
  // Get shared functionality and stores
  const baseProperties = useProperties();
  const authStore = useAuthStore();
  const propertyStore = usePropertyStore();
  const bookingStore = useBookingStore();
  
  // Owner-specific state
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);
  
  // Get current user ID
  const currentUserId = computed(() => authStore.user?.id);
  
  // COMPUTED PROPERTIES - Owner-scoped data filtering
  
  /**
   * Get all properties for the current owner only
   */
  const myProperties = computed(() => {
    if (!currentUserId.value) return [];
    
    return Array.from(propertyStore.properties.values())
      .filter(property => property.owner_id === currentUserId.value);
  });
  
  /**
   * Get current owner's active properties only
   */
  const myActiveProperties = computed(() => {
    return myProperties.value.filter(property => property.active);
  });
  
  /**
   * Get current owner's properties by pricing tier
   */
  const myPropertiesByPricingTier = computed(() => {
    const tierGroups: Record<PricingTier, Property[]> = {
      basic: [],
      standard: [],
      premium: [],
      luxury: []
    };
    
    myProperties.value.forEach(property => {
      tierGroups[property.pricing_tier].push(property);
    });
    
    return tierGroups;
  });
  
  /**
   * Get aggregated metrics for all owner's properties
   */
  const myPropertyMetrics = computed(() => {
    if (!currentUserId.value || myProperties.value.length === 0) {
      return {
        totalProperties: 0,
        activeProperties: 0,
        averageUtilization: 0,
        totalRevenue: 0,
        averageCleaningDuration: 0,
        pricingTierDistribution: {
          basic: 0,
          standard: 0,
          premium: 0,
          luxury: 0
        }
      };
    }
    
    const totalProperties = myProperties.value.length;
    const activeProperties = myActiveProperties.value.length;
    
    // Calculate average utilization across all properties
    let totalUtilization = 0;
    let totalRevenue = 0;
    let totalCleaningDuration = 0;
    
    myProperties.value.forEach(property => {
      const metrics = baseProperties.calculatePropertyMetrics(property.id);
      if (metrics) {
        totalUtilization += metrics.utilizationRate;
        totalRevenue += metrics.revenueProjection;
      }
      totalCleaningDuration += property.cleaning_duration;
    });
    
    const averageUtilization = totalProperties > 0 ? totalUtilization / totalProperties : 0;
    const averageCleaningDuration = totalProperties > 0 ? totalCleaningDuration / totalProperties : 0;
    
    // Calculate pricing tier distribution
    const pricingTierDistribution = {
      basic: myPropertiesByPricingTier.value.basic.length,
      standard: myPropertiesByPricingTier.value.standard.length,
      premium: myPropertiesByPricingTier.value.premium.length,
      luxury: myPropertiesByPricingTier.value.luxury.length
    };
    
    return {
      totalProperties,
      activeProperties,
      averageUtilization,
      totalRevenue,
      averageCleaningDuration,
      pricingTierDistribution
    };
  });
  
  // OWNER-SPECIFIC CRUD OPERATIONS
  
  /**
   * Fetch current owner's properties only
   */
  async function fetchMyProperties(): Promise<boolean> {
    if (!currentUserId.value) {
      error.value = 'Please log in to view your properties';
      return false;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      // In a real app, this would make an API call with owner filter
      // For now, we simulate the call and rely on computed filtering
      await new Promise(resolve => setTimeout(resolve, 300));
      
      success.value = `Loaded ${myProperties.value.length} of your properties`;
      loading.value = false;
      return true;
    } catch (err) {
      error.value = 'Unable to load your properties. Please try again.';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Create a new property for the current owner
   */
  async function createMyProperty(formData: Omit<PropertyFormData, 'owner_id'>): Promise<string | null> {
    if (!currentUserId.value) {
      error.value = 'Please log in to create properties';
      return null;
    }
    
    loading.value = true;
    error.value = null;
    success.value = null;
    
    try {
      // Create property data with owner_id automatically set
      const ownerPropertyData: PropertyFormData = {
        ...formData,
        owner_id: currentUserId.value
      };
      
      // Use base composable's create function
      const propertyId = await baseProperties.createProperty(ownerPropertyData);
      
      if (propertyId) {
        success.value = 'Your property has been created successfully';
        loading.value = false;
        return propertyId;
      } else {
        throw new Error('Failed to create property');
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to create your property. Please try again.';
      loading.value = false;
      return null;
    }
  }
  
  /**
   * Update a property (only if owned by current user)
   */
  async function updateMyProperty(id: string, updates: Partial<Omit<PropertyFormData, 'owner_id'>>): Promise<boolean> {
    if (!currentUserId.value) {
      error.value = 'Please log in to update properties';
      return false;
    }
    
    loading.value = true;
    error.value = null;
    success.value = null;
    
    try {
      // Check if property exists and belongs to current user
      const property = propertyStore.getPropertyById(id);
      if (!property) {
        throw new Error('Property not found');
      }
      
      if (property.owner_id !== currentUserId.value) {
        throw new Error('You can only update your own properties');
      }
      
      // Use base composable's update function
      const updateSuccess = await baseProperties.updateProperty(id, updates);
      
      if (updateSuccess) {
        success.value = 'Your property has been updated successfully';
        loading.value = false;
        return true;
      } else {
        throw new Error('Failed to update property');
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to update your property. Please try again.';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Delete a property (only if owned by current user and no bookings exist)
   */
  async function deleteMyProperty(id: string): Promise<boolean> {
    if (!currentUserId.value) {
      error.value = 'Please log in to delete properties';
      return false;
    }
    
    loading.value = true;
    error.value = null;
    success.value = null;
    
    try {
      // Check if property exists and belongs to current user
      const property = propertyStore.getPropertyById(id);
      if (!property) {
        throw new Error('Property not found');
      }
      
      if (property.owner_id !== currentUserId.value) {
        throw new Error('You can only delete your own properties');
      }
      
      // Check if property has bookings
      const propertyBookings = bookingStore.bookingsByProperty(id);
      if (propertyBookings.length > 0) {
        throw new Error('Cannot delete property with existing bookings. Please cancel or complete all bookings first.');
      }
      
      // Use base composable's delete function
      const deleteSuccess = await baseProperties.deleteProperty(id);
      
      if (deleteSuccess) {
        success.value = 'Your property has been deleted successfully';
        loading.value = false;
        return true;
      } else {
        throw new Error('Failed to delete property');
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to delete your property. Please try again.';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Toggle property active status (only if owned by current user)
   */
  async function toggleMyPropertyStatus(id: string, active: boolean): Promise<boolean> {
    if (!currentUserId.value) {
      error.value = 'Please log in to manage your properties';
      return false;
    }
    
    loading.value = true;
    error.value = null;
    success.value = null;
    
    try {
      // Check if property exists and belongs to current user
      const property = propertyStore.getPropertyById(id);
      if (!property) {
        throw new Error('Property not found');
      }
      
      if (property.owner_id !== currentUserId.value) {
        throw new Error('You can only manage your own properties');
      }
      
      // If deactivating, check for upcoming bookings
      if (!active) {
        const now = new Date();
        const upcomingBookings = bookingStore.bookingsByProperty(id).filter(booking => {
          const checkinDate = new Date(booking.checkin_date);
          return checkinDate > now && ['pending', 'scheduled'].includes(booking.status);
        });
        
        if (upcomingBookings.length > 0) {
          throw new Error('Cannot deactivate property with upcoming bookings. Please complete or cancel them first.');
        }
      }
      
      // Use base composable's toggle function
      const toggleSuccess = await baseProperties.togglePropertyStatus(id, active);
      
      if (toggleSuccess) {
        success.value = `Your property has been ${active ? 'activated' : 'deactivated'} successfully`;
        loading.value = false;
        return true;
      } else {
        throw new Error(`Failed to ${active ? 'activate' : 'deactivate'} property`);
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : `Unable to ${active ? 'activate' : 'deactivate'} your property. Please try again.`;
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Get detailed metrics for a specific property (only if owned by current user)
   */
  function getMyPropertyMetrics(id: string) {
    if (!currentUserId.value) {
      return null;
    }
    
    // Check if property belongs to current user
    const property = propertyStore.getPropertyById(id);
    if (!property || property.owner_id !== currentUserId.value) {
      return null;
    }
    
    // Use base composable's metrics calculation
    return baseProperties.calculatePropertyMetrics(id);
  }
  
  /**
   * Get property recommendations for the current owner
   */
  function getMyPropertyRecommendations() {
    if (!currentUserId.value || myProperties.value.length === 0) {
      return [];
    }
    
    const recommendations: string[] = [];
    const metrics = myPropertyMetrics.value;
    
    // Utilization recommendations
    if (metrics.averageUtilization < 0.3) {
      recommendations.push('Consider adjusting your pricing or marketing to increase bookings');
    } else if (metrics.averageUtilization > 0.8) {
      recommendations.push('Your properties are highly utilized - consider raising prices or adding more properties');
    }
    
    // Pricing tier recommendations
    if (metrics.pricingTierDistribution.basic > metrics.totalProperties * 0.7) {
      recommendations.push('Consider upgrading some properties to premium tiers for higher revenue');
    }
    
    // Cleaning duration recommendations
    if (metrics.averageCleaningDuration > 180) {
      recommendations.push('Consider optimizing cleaning processes to reduce turnaround time');
    }
    
    // Property count recommendations
    if (metrics.totalProperties < 3) {
      recommendations.push('Consider adding more properties to diversify your portfolio');
    }
    
    return recommendations;
  }
  
  return {
    // State
    loading,
    error,
    success,
    
    // Computed properties - Owner-scoped data
    myProperties,
    myActiveProperties,
    myPropertiesByPricingTier,
    myPropertyMetrics,
    
    // CRUD operations - Owner-specific
    fetchMyProperties,
    createMyProperty,
    updateMyProperty,
    deleteMyProperty,
    toggleMyPropertyStatus,
    
    // Business logic - Owner-specific
    getMyPropertyMetrics,
    getMyPropertyRecommendations
  };
} 