import { ref, computed } from 'vue';
import { usePropertyStore } from '@/stores/property';
import { useBookingStore } from '@/stores/booking';
import type { Property, PropertyFormData, PricingTier } from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Composable for property management
 * Provides CRUD operations and validation for properties
 */
export function useProperties() {
  const propertyStore = usePropertyStore();
  const bookingStore = useBookingStore();
  
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);

  /**
   * Create a new property
   */
  async function createProperty(formData: PropertyFormData): Promise<string | null> {
    loading.value = true;
    error.value = null;
    success.value = null;
    
    try {
      // Validate required fields
      if (!formData.name || !formData.address) {
        throw new Error('Name and address are required');
      }
      
      // Validate cleaning duration
      if (!formData.cleaning_duration || formData.cleaning_duration < 30) {
        throw new Error('Cleaning duration must be at least 30 minutes');
      }
      
      // Validate pricing tier
      if (!['basic', 'premium', 'luxury'].includes(formData.pricing_tier)) {
        throw new Error('Invalid pricing tier');
      }
      
      // Create property object
      const newProperty: Property = {
        id: uuidv4(),
        ...formData,
        active: formData.active !== undefined ? formData.active : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Add to store
      propertyStore.addProperty(newProperty);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      success.value = 'Property created successfully';
      loading.value = false;
      return newProperty.id;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create property';
      loading.value = false;
      return null;
    }
  }
  
  /**
   * Update an existing property
   */
  async function updateProperty(id: string, updates: Partial<PropertyFormData>): Promise<boolean> {
    loading.value = true;
    error.value = null;
    success.value = null;
    
    try {
      // Check if property exists
      const property = propertyStore.getPropertyById(id);
      if (!property) {
        throw new Error('Property not found');
      }
      
      // Validate cleaning duration if changed
      if (updates.cleaning_duration !== undefined && updates.cleaning_duration < 30) {
        throw new Error('Cleaning duration must be at least 30 minutes');
      }
      
      // Validate pricing tier if changed
      if (updates.pricing_tier && !['basic', 'premium', 'luxury'].includes(updates.pricing_tier)) {
        throw new Error('Invalid pricing tier');
      }
      
      // Update property in store
      propertyStore.updateProperty(id, updates);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      success.value = 'Property updated successfully';
      loading.value = false;
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update property';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Delete a property
   */
  async function deleteProperty(id: string): Promise<boolean> {
    loading.value = true;
    error.value = null;
    success.value = null;
    
    try {
      // Check if property exists
      const property = propertyStore.getPropertyById(id);
      if (!property) {
        throw new Error('Property not found');
      }
      
      // Check if property has bookings
      const propertyBookings = bookingStore.bookingsByProperty(id);
      if (propertyBookings.length > 0) {
        throw new Error('Cannot delete property with existing bookings');
      }
      
      // Remove from store
      propertyStore.removeProperty(id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      success.value = 'Property deleted successfully';
      loading.value = false;
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete property';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Toggle property active status
   */
  async function togglePropertyStatus(id: string, active: boolean): Promise<boolean> {
    loading.value = true;
    error.value = null;
    success.value = null;
    
    try {
      // Check if property exists
      const property = propertyStore.getPropertyById(id);
      if (!property) {
        throw new Error('Property not found');
      }
      
      // If deactivating, check for upcoming bookings
      if (!active) {
        const now = new Date();
        const upcomingBookings = bookingStore.bookingsByProperty(id).filter(booking => {
          const checkinDate = new Date(booking.checkin_date);
          return checkinDate > now && ['pending', 'scheduled'].includes(booking.status);
        });
        
        if (upcomingBookings.length > 0) {
          throw new Error('Cannot deactivate property with upcoming bookings');
        }
      }
      
      // Update property status
      propertyStore.setPropertyActiveStatus(id, active);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      success.value = `Property ${active ? 'activated' : 'deactivated'} successfully`;
      loading.value = false;
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : `Failed to ${active ? 'activate' : 'deactivate'} property`;
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Calculate property metrics
   */
  function calculatePropertyMetrics(id: string) {
    const property = propertyStore.getPropertyById(id);
    if (!property) {
      return null;
    }
    
    // Get all bookings for this property
    const propertyBookings = bookingStore.bookingsByProperty(id);
    
    // Calculate utilization rate (booked days / total days)
    const totalDays = 30; // Assuming last 30 days
    const bookedDays = new Set();
    
    propertyBookings.forEach(booking => {
      const checkoutDate = new Date(booking.checkout_date);
      const checkinDate = new Date(booking.checkin_date);
      
      // Count days between checkout and checkin
      let currentDate = new Date(checkoutDate);
      while (currentDate <= checkinDate) {
        bookedDays.add(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    
    const utilizationRate = bookedDays.size / totalDays;
    
    // Calculate turn percentage
    const turnBookings = propertyBookings.filter(booking => booking.booking_type === 'turn');
    const turnPercentage = propertyBookings.length > 0 ? turnBookings.length / propertyBookings.length : 0;
    
    // Calculate average gap between bookings
    let totalGapDays = 0;
    let gapCount = 0;
    
    // Sort bookings by checkout date
    const sortedBookings = [...propertyBookings].sort((a, b) => {
      return new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime();
    });
    
    // Calculate gaps between consecutive bookings
    for (let i = 0; i < sortedBookings.length - 1; i++) {
      const currentCheckout = new Date(sortedBookings[i].checkin_date);
      const nextCheckin = new Date(sortedBookings[i + 1].checkout_date);
      
      if (nextCheckin > currentCheckout) {
        const gapDays = Math.round((nextCheckin.getTime() - currentCheckout.getTime()) / (1000 * 60 * 60 * 24));
        totalGapDays += gapDays;
        gapCount++;
      }
    }
    
    const averageGapBetweenBookings = gapCount > 0 ? totalGapDays / gapCount : 0;
    
    // Calculate revenue projection based on pricing tier
    const revenueMultipliers: Record<PricingTier, number> = {
      'basic': 1,
      'standard': 1.2,
      'premium': 1.5,
      'luxury': 2.5
    };
    
    const baseRevenue = 100; // Base revenue per booking
    const projectedBookings = Math.round(utilizationRate * 30); // Projected bookings for next month
    const revenueProjection = projectedBookings * baseRevenue * revenueMultipliers[property.pricing_tier];
    
    // Determine cleaning load
    let cleaningLoad: 'light' | 'moderate' | 'heavy';
    
    if (utilizationRate < 0.3) {
      cleaningLoad = 'light';
    } else if (utilizationRate < 0.7) {
      cleaningLoad = 'moderate';
    } else {
      cleaningLoad = 'heavy';
    }
    
    return {
      utilizationRate,
      averageGapBetweenBookings,
      turnPercentage,
      revenueProjection,
      cleaningLoad
    };
  }
  
  /**
   * Fetch all properties
   */
  async function fetchAllProperties(): Promise<boolean> {
    loading.value = true;
    error.value = null;
    
    try {
      await propertyStore.fetchProperties();
      loading.value = false;
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch properties';
      loading.value = false;
      return false;
    }
  }
  
  return {
    // State
    loading,
    error,
    success,
    
    // Store access
    properties: computed(() => propertyStore.propertiesArray),
    activeProperties: computed(() => propertyStore.activeProperties),
    getPropertyById: computed(() => propertyStore.getPropertyById),
    propertiesByPricingTier: computed(() => propertyStore.propertiesByPricingTier),
    propertiesByOwner: computed(() => propertyStore.propertiesByOwner),
    
    // CRUD operations
    createProperty,
    updateProperty,
    deleteProperty,
    togglePropertyStatus,
    fetchAllProperties,
    
    // Business logic
    calculatePropertyMetrics
  };
} 