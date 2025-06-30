import { ref, computed, onMounted, onUnmounted } from 'vue';
import { supabase } from '@/plugins/supabase';
import type { Property } from '@/types';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Supabase-based property operations with automatic RLS filtering
 * Replaces frontend filtering with database-level security
 * 
 * Key Features:
 * - Automatic owner data isolation via RLS policies
 * - Real-time subscriptions for property changes
 * - Type-safe database operations
 * - Maintains same API interface as Pinia version
 */
export function useSupabaseProperties() {
  // State
  const properties = ref<Property[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  // Real-time subscription
  let subscription: RealtimeChannel | null = null;
  
  // CORE DATABASE OPERATIONS
  
  /**
   * Fetch properties with automatic RLS filtering
   * - Owners see only their properties
   * - Admins see all properties
   */
  async function fetchProperties(): Promise<Property[]> {
    loading.value = true;
    error.value = null;
    
    try {
      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .eq('active', true)
        .order('name', { ascending: true });
      
      if (fetchError) throw fetchError;
      
      properties.value = data || [];
      return data || [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch properties';
      console.error('Supabase property fetch error:', err);
      return [];
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Create a new property with automatic owner_id assignment
   */
  async function createProperty(propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'owner_id'>): Promise<string | null> {
    loading.value = true;
    error.value = null;
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const newProperty = {
        ...propertyData,
        owner_id: user.id // Automatic owner assignment
      };
      
      const { data, error: createError } = await supabase
        .from('properties')
        .insert([newProperty])
        .select()
        .single();
      
      if (createError) throw createError;
      
      // Add to local state for immediate UI update
      if (data) {
        properties.value.push(data);
      }
      
      return data?.id || null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create property';
      console.error('Supabase property creation error:', err);
      return null;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Update a property (RLS ensures user can only update their own)
   */
  async function updateProperty(id: string, updates: Partial<Property>): Promise<boolean> {
    loading.value = true;
    error.value = null;
    
    try {
      const { data, error: updateError } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (updateError) throw updateError;
      
      // Update local state
      if (data) {
        const index = properties.value.findIndex(p => p.id === id);
        if (index !== -1) {
          properties.value[index] = { ...properties.value[index], ...data };
        }
      }
      
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update property';
      console.error('Supabase property update error:', err);
      return false;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Delete a property (RLS ensures user can only delete their own)
   * Soft delete by setting active = false
   */
  async function deleteProperty(id: string): Promise<boolean> {
    loading.value = true;
    error.value = null;
    
    try {
      const { error: deleteError } = await supabase
        .from('properties')
        .update({ active: false })
        .eq('id', id);
      
      if (deleteError) throw deleteError;
      
      // Remove from local state
      properties.value = properties.value.filter(p => p.id !== id);
      
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete property';
      console.error('Supabase property deletion error:', err);
      return false;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Get a single property by ID (with RLS filtering)
   */
  async function getPropertyById(id: string): Promise<Property | null> {
    try {
      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .eq('active', true)
        .single();
      
      if (fetchError) {
        console.error('Property fetch error:', fetchError);
        return null;
      }
      
      return data;
    } catch (err) {
      console.error('Supabase property fetch error:', err);
      return null;
    }
  }
  
  // REAL-TIME SUBSCRIPTIONS
  
  /**
   * Subscribe to real-time property changes
   * RLS automatically filters to user's accessible data
   */
  function subscribeToProperties() {
    subscription = supabase
      .channel('property-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties'
        },
        (payload) => {
          console.log('Property change received:', payload);
          
          switch (payload.eventType) {
            case 'INSERT':
              if (payload.new && payload.new.active) {
                properties.value.push(payload.new as Property);
              }
              break;
              
            case 'UPDATE':
              if (payload.new) {
                const index = properties.value.findIndex(p => p.id === payload.new.id);
                if (index !== -1) {
                  if (payload.new.active) {
                    properties.value[index] = payload.new as Property;
                  } else {
                    // Property was deactivated, remove from list
                    properties.value.splice(index, 1);
                  }
                } else if (payload.new.active) {
                  // Property was reactivated, add to list
                  properties.value.push(payload.new as Property);
                }
              }
              break;
              
            case 'DELETE':
              if (payload.old) {
                properties.value = properties.value.filter(p => p.id !== payload.old.id);
              }
              break;
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Subscribed to property changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Property subscription error');
        }
      });
  }
  
  /**
   * Unsubscribe from real-time changes
   */
  function unsubscribeFromProperties() {
    if (subscription) {
      supabase.removeChannel(subscription);
      subscription = null;
    }
  }
  
  // COMPUTED PROPERTIES (Auto-filtered by RLS)
  
  /**
   * All active properties (automatically filtered by RLS)
   * - Owners see only their properties
   * - Admins see all properties
   */
  const allProperties = computed(() => properties.value);
  
  /**
   * Properties grouped by type (auto-filtered by RLS)
   */
  const propertiesByType = computed(() => {
    const typeGroups: Record<string, Property[]> = {};
    
    properties.value.forEach(property => {
      const type = property.property_type || 'other';
      if (!typeGroups[type]) {
        typeGroups[type] = [];
      }
      typeGroups[type].push(property);
    });
    
    return typeGroups;
  });
  
  /**
   * Properties with their booking counts (requires joined query)
   */
  const propertiesWithBookingCounts = computed(() => {
    // This would typically be a joined query, but for now we'll just return properties
    // In a full implementation, you'd do a joined query with booking counts
    return properties.value;
  });
  
  // LIFECYCLE MANAGEMENT
  
  onMounted(() => {
    fetchProperties();
    subscribeToProperties();
  });
  
  onUnmounted(() => {
    unsubscribeFromProperties();
  });
  
  return {
    // State
    properties: allProperties,
    loading,
    error,
    
    // Operations
    fetchProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    getPropertyById,
    
    // Computed data (auto-filtered by RLS)
    propertiesByType,
    propertiesWithBookingCounts,
    
    // Subscription management
    subscribeToProperties,
    unsubscribeFromProperties
  };
} 