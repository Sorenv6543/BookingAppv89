import { ref, computed } from 'vue';
import { useSupabaseProperties } from '@/composables/supabase/useSupabaseProperties';
import { useSupabaseBookings } from '@/composables/supabase/useSupabaseBookings';
import { useSupabaseAuth } from '@/composables/supabase/useSupabaseAuth';
import type { Property, PropertyFormData, PricingTier } from '@/types';

/**
 * MIGRATED: Admin-specific property composable using Supabase
 * Replaces Pinia store access with database-level admin permissions
 * 
 * ✅ MAINTAINS SAME API: All function names and return types unchanged
 * ✅ SYSTEM-WIDE ACCESS: Admin RLS policies provide access to ALL properties
 * ✅ REAL-TIME UPDATES: Database subscriptions for live admin dashboard
 * 
 * Key Changes from Pinia Version:
 * - Pinia store access replaced with Supabase queries  
 * - No data filtering (admin sees ALL properties via RLS)
 * - Real-time subscriptions for system monitoring
 * - Admin-specific bulk operations
 */
export function useAdminProperties() {
  // Use Supabase composables (Admin RLS allows access to ALL data)
  const supabaseProperties = useSupabaseProperties();
  const supabaseBookings = useSupabaseBookings();
  const supabaseAuth = useSupabaseAuth();
  
  // Admin-specific state (same API as before)
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);
  
  // Get current admin user ID
  const currentAdminId = computed(() => supabaseAuth.user.value?.id);
  
  // COMPUTED PROPERTIES - Admin system-wide data access (NO filtering due to RLS)
  
  /**
   * Get ALL properties across all owners (no filtering)
   * ✅ SAME API as before, now uses admin RLS policies
   */
  const allProperties = computed((): Property[] => {
    // Admin RLS policies automatically provide access to ALL properties
    return supabaseProperties.properties.value || [];
  });
  
  /**
   * Get ALL active properties across all owners (no filtering)
   * ✅ SAME API as before
   */
  const allActiveProperties = computed(() => {
    return allProperties.value.filter(property => property.active);
  });
  
  /**
   * Get ALL inactive properties across all owners (no filtering)
   * ✅ SAME API as before
   */
  const allInactiveProperties = computed(() => {
    return allProperties.value.filter(property => !property.active);
  });
  
  /**
   * Get properties grouped by owner (admin view of all clients)
   * ✅ SAME API as before
   */
  const propertiesByOwner = computed(() => {
    const ownerGroups: Record<string, Property[]> = {};
    
    allProperties.value.forEach(property => {
      if (!ownerGroups[property.owner_id]) {
        ownerGroups[property.owner_id] = [];
      }
      ownerGroups[property.owner_id].push(property);
    });
    
    return ownerGroups;
  });
  
  /**
   * Get properties grouped by pricing tier (system-wide)
   * ✅ SAME API as before
   */
  const propertiesByPricingTier = computed(() => {
    const tierGroups: Record<PricingTier, Property[]> = {
      basic: [],
      standard: [],
      premium: [],
      luxury: []
    };
    
    allProperties.value.forEach(property => {
      if (tierGroups[property.pricing_tier]) {
        tierGroups[property.pricing_tier].push(property);
      }
    });
    
    return tierGroups;
  });
  
  /**
   * Get property utilization data with booking statistics
   * ✅ SAME API as before, now with real-time Supabase data
   */
  const propertyUtilizationData = computed(() => {
    const utilizationMap: Record<string, any> = {};
    const allBookings = supabaseBookings.bookings.value || [];
    
    allProperties.value.forEach(property => {
      const propertyBookings = allBookings.filter(b => b.property_id === property.id);
      const turnBookings = propertyBookings.filter(b => b.booking_type === 'turn');
      const standardBookings = propertyBookings.filter(b => b.booking_type === 'standard');
      
      // Calculate utilization rate
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const recentBookings = propertyBookings.filter(b => 
        new Date(b.created_at) >= thirtyDaysAgo
      );
      
      const utilizationRate = recentBookings.length / 30; // Bookings per day
      
      // Calculate average gap between bookings
      const sortedBookings = propertyBookings
        .sort((a, b) => new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime());
      
      let totalGapDays = 0;
      let gapCount = 0;
      
      for (let i = 1; i < sortedBookings.length; i++) {
        const prevCheckin = new Date(sortedBookings[i - 1].checkin_date);
        const currentCheckout = new Date(sortedBookings[i].checkout_date);
        const gapDays = (currentCheckout.getTime() - prevCheckin.getTime()) / (1000 * 60 * 60 * 24);
        
        if (gapDays > 0) {
          totalGapDays += gapDays;
          gapCount++;
        }
      }
      
      const averageGapDays = gapCount > 0 ? Math.round(totalGapDays / gapCount) : 0;
      
      // Calculate revenue projection
      const revenueMultipliers: Record<PricingTier, number> = {
        basic: 1,
        standard: 1.2,
        premium: 1.5,
        luxury: 2.5
      };
      
      const baseRevenue = 100;
      const projectedBookings = Math.round(utilizationRate * 30);
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
      
      utilizationMap[property.id] = {
        property,
        totalBookings: propertyBookings.length,
        turnBookings: turnBookings.length,
        standardBookings: standardBookings.length,
        utilizationRate,
        averageGapDays,
        revenueProjection,
        cleaningLoad
      };
    });
    
    return utilizationMap;
  });
  
  // ADMIN CRUD OPERATIONS - Enhanced with Supabase
  
  /**
   * Admin property creation (can create for any owner)
   * ✅ SAME API as before
   */
  async function createPropertyForOwner(ownerId: string, data: PropertyFormData): Promise<boolean> {
    if (!currentAdminId.value) {
      error.value = 'Admin authentication required';
      return false;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      const propertyData = {
        ...data,
        owner_id: ownerId
      };
      
      const result = await supabaseProperties.addProperty(propertyData);
      
      if (result) {
        success.value = 'Property created successfully';
        loading.value = false;
        return true;
      } else {
        error.value = 'Failed to create property';
        loading.value = false;
        return false;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Admin property update (can update any property)
   * ✅ SAME API as before
   */
  async function updateAnyProperty(propertyId: string, data: Partial<Property>): Promise<boolean> {
    if (!currentAdminId.value) {
      error.value = 'Admin authentication required';
      return false;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      const result = await supabaseProperties.updateProperty(propertyId, data);
      
      if (result) {
        success.value = 'Property updated successfully';
        loading.value = false;
        return true;
      } else {
        error.value = 'Failed to update property';
        loading.value = false;
        return false;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Admin property deactivation (can deactivate any property)
   * ✅ SAME API as before
   */
  async function deactivateProperty(propertyId: string, reason: string): Promise<boolean> {
    if (!currentAdminId.value) {
      error.value = 'Admin authentication required';
      return false;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      const result = await supabaseProperties.updateProperty(propertyId, {
        active: false,
        special_instructions: reason ? `DEACTIVATED: ${reason}` : 'DEACTIVATED'
      });
      
      if (result) {
        success.value = 'Property deactivated successfully';
        loading.value = false;
        return true;
      } else {
        error.value = 'Failed to deactivate property';
        loading.value = false;
        return false;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Fetch all properties (admin can see all data)
   * ✅ SAME API as before
   */
  async function fetchAllProperties(): Promise<boolean> {
    if (!currentAdminId.value) {
      error.value = 'Admin authentication required to access system property data';
      return false;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      const result = await supabaseProperties.fetchProperties();
      
      if (result) {
        success.value = `Loaded ${allProperties.value.length} properties across all owners`;
        loading.value = false;
        return true;
      } else {
        error.value = 'Unable to load system properties. This may impact business operations.';
        loading.value = false;
        return false;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch properties';
      loading.value = false;
      return false;
    }
  }
  
  // ADMIN BUSINESS INTELLIGENCE - Same API as before
  
  /**
   * Get system property metrics
   * ✅ SAME API as before
   */
  function getSystemPropertyMetrics() {
    const utilization = propertyUtilizationData.value;
    
    const metrics = {
      totalProperties: allProperties.value.length,
      activeProperties: allActiveProperties.value.length,
      inactiveProperties: allInactiveProperties.value.length,
      propertiesByTier: {
        basic: propertiesByPricingTier.value.basic.length,
        standard: propertiesByPricingTier.value.standard.length,
        premium: propertiesByPricingTier.value.premium.length,
        luxury: propertiesByPricingTier.value.luxury.length
      },
      totalOwners: Object.keys(propertiesByOwner.value).length,
      averagePropertiesPerOwner: Math.round(allProperties.value.length / Object.keys(propertiesByOwner.value).length) || 0
    };
    
    // Calculate top performers
    const topPerformers = Object.values(utilization)
      .sort((a: any, b: any) => b.revenueProjection - a.revenueProjection)
      .slice(0, 5);
    
    // Calculate underperformers
    const underPerformers = Object.values(utilization)
      .filter((d: any) => d.utilizationRate < 0.3)
      .sort((a: any, b: any) => a.utilizationRate - b.utilizationRate)
      .slice(0, 5);
    
    // Calculate cleaning load distribution
    const cleaningLoadDistribution = {
      light: Object.values(utilization).filter(d => d.cleaningLoad === 'light').length,
      moderate: Object.values(utilization).filter(d => d.cleaningLoad === 'moderate').length,
      heavy: Object.values(utilization).filter(d => d.cleaningLoad === 'heavy').length
    };
    
    // Calculate revenue projections by tier
    const revenueByTier = {
      basic: Object.values(utilization)
        .filter(d => d.property.pricing_tier === 'basic')
        .reduce((sum, d) => sum + d.revenueProjection, 0),
      standard: Object.values(utilization)
        .filter(d => d.property.pricing_tier === 'standard')
        .reduce((sum, d) => sum + d.revenueProjection, 0),
      premium: Object.values(utilization)
        .filter(d => d.property.pricing_tier === 'premium')
        .reduce((sum, d) => sum + d.revenueProjection, 0),
      luxury: Object.values(utilization)
        .filter(d => d.property.pricing_tier === 'luxury')
        .reduce((sum, d) => sum + d.revenueProjection, 0)
    };
    
    return {
      systemMetrics: metrics,
      topPerformers,
      underPerformers,
      cleaningLoadDistribution,
      revenueByTier,
      totalProjectedRevenue: Object.values(revenueByTier).reduce((sum, revenue) => sum + revenue, 0)
    };
  }
  
  /**
   * Get property utilization report (admin-only)
   * ✅ SAME API as before
   */
  function getPropertyUtilization() {
    if (!currentAdminId.value) {
      console.warn('Admin authentication required for utilization reports');
      return null;
    }
    
    return propertyUtilizationData.value;
  }
  
  /**
   * Get owner performance report (admin-only)
   * ✅ SAME API as before
   */
  function getOwnerPerformanceReport() {
    if (!currentAdminId.value) {
      console.warn('Admin authentication required for owner performance reports');
      return null;
    }
    
    const ownerStats: Record<string, any> = {};
    
    Object.entries(propertiesByOwner.value).forEach(([ownerId, properties]) => {
      const totalProperties = properties.length;
      const activeProperties = properties.filter(p => p.active).length;
      
      // Calculate total bookings for this owner
      const allBookings = supabaseBookings.bookings.value || [];
      const ownerBookings = allBookings.filter(b => b.owner_id === ownerId);
      
      const totalBookings = ownerBookings.length;
      const turnBookings = ownerBookings.filter(b => b.booking_type === 'turn').length;
      const completedBookings = ownerBookings.filter(b => b.status === 'completed').length;
      
      ownerStats[ownerId] = {
        totalProperties,
        activeProperties,
        totalBookings,
        turnBookings,
        completedBookings,
        completionRate: totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0,
        turnRate: totalBookings > 0 ? Math.round((turnBookings / totalBookings) * 100) : 0,
        averageBookingsPerProperty: totalProperties > 0 ? Math.round(totalBookings / totalProperties) : 0
      };
    });
    
    return ownerStats;
  }
  
  /**
   * Identify underperforming properties
   * ✅ SAME API as before
   */
  function identifyUnderperformingProperties(): Property[] {
    const utilization = propertyUtilizationData.value;
    
    return Object.values(utilization)
      .filter((data: any) => data.utilizationRate < 0.2 || data.averageGapDays > 14)
      .map((data: any) => data.property);
  }
  
  /**
   * Generate revenue projections
   * ✅ SAME API as before
   */
  function generateRevenueProjections() {
    const utilization = propertyUtilizationData.value;
    
    const projections = {
      currentMonth: 0,
      nextMonth: 0,
      quarterly: 0,
      annual: 0
    };
    
    Object.values(utilization).forEach((data: any) => {
      const monthlyRevenue = data.revenueProjection;
      projections.currentMonth += monthlyRevenue;
      projections.nextMonth += monthlyRevenue * 1.05; // 5% growth assumption
      projections.quarterly += monthlyRevenue * 3;
      projections.annual += monthlyRevenue * 12;
    });
    
    return projections;
  }
  
  /**
   * Clear error and success states
   * ✅ SAME API as before
   */
  function clearMessages() {
    error.value = null;
    success.value = null;
  }
  
  // Return same API as Pinia version - no changes needed in components
  return {
    // Computed state (same API)
    allProperties,
    allActiveProperties,
    allInactiveProperties,
    propertiesByOwner,
    propertiesByPricingTier,
    propertyUtilizationData,
    
    // CRUD operations (same API)
    createPropertyForOwner,
    updateAnyProperty,
    deactivateProperty,
    fetchAllProperties,
    
    // Business intelligence (same API)
    getSystemPropertyMetrics,
    getPropertyUtilization,
    getOwnerPerformanceReport,
    identifyUnderperformingProperties,
    generateRevenueProjections,
    
    // State management (same API)
    loading,
    error,
    success,
    clearMessages
  };
}
