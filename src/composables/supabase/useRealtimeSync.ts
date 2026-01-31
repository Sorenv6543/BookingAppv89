// src/composables/supabase/useRealtimeSync.ts - TASK-082 Implementation
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { supabase } from '@/plugins/supabase';
import { useBookingStore } from '@/stores/booking';
import { usePropertyStore } from '@/stores/property';
import { useAuthStore } from '@/stores/auth';
import type { Booking, Property } from '@/types';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface OptimisticUpdate {
  id: string;
  type: 'booking' | 'property';
  operation: 'insert' | 'update' | 'delete';
  timestamp: number;
  data: Record<string, unknown>;
}

interface PendingOperation {
  id?: string;
  type: 'booking' | 'property';
  operation: 'insert' | 'update' | 'delete';
  data: Record<string, unknown>;
  retryCount: number;
  execute?: () => Promise<void>;
}

interface RealtimePayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: Record<string, unknown> | null;
  old: Record<string, unknown> | null;
  errors?: string[];
}

export function useRealtimeSync() {
  const bookingStore = useBookingStore();
  const propertyStore = usePropertyStore();
  const authStore = useAuthStore();
  
  const subscriptions = ref<RealtimeChannel[]>([]);
  const connectionStatus = ref<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const lastSyncTime = ref<Date | null>(null);

  // Track optimistic updates to avoid double-applying changes
  const optimisticUpdates = ref(new Map<string, OptimisticUpdate>());

  // Network status monitoring
  const isOnline = ref(navigator.onLine);
  const pendingOperations = ref<PendingOperation[]>([]);

  // Debug helper
  const debugRealtime = import.meta.env.VITE_DEBUG_RLS === 'true';
  const debugLog = (message: string, data?: unknown) => {
    if (debugRealtime) {
      console.log(`[Realtime Debug] ${message}`, data);
    }
  };

  // Initialize real-time subscriptions
  function initializeRealtimeSubscriptions() {
    if (!authStore.isAuthenticated) {
      debugLog('User not authenticated, skipping real-time setup');
      return;
    }

    debugLog('Initializing real-time subscriptions for user:', authStore.user?.email);
    connectionStatus.value = 'connecting';
    
    // Subscribe to bookings changes
    const bookingsSubscription = supabase
      .channel('public:bookings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          debugLog('Booking change received: ' + payload.eventType, payload);
          handleBookingChange(payload);
        }
      )
      .subscribe((status) => {
        debugLog('Bookings subscription status:', status);
        updateConnectionStatus(status);
      });

    // Subscribe to properties changes
    const propertiesSubscription = supabase
      .channel('public:properties')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'properties' },
        (payload) => {
          debugLog('Property change received: ' + payload.eventType, payload);
          handlePropertyChange(payload);
        }
      )
      .subscribe((status) => {
        debugLog('Properties subscription status:', status);
        updateConnectionStatus(status);
      });

    // Subscribe to user profile changes (for role updates, etc.)
    const profilesSubscription = supabase
      .channel('public:user_profiles')
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'user_profiles',
          filter: `id=eq.${authStore.user?.id}` // Only listen to current user's profile
        },
        (payload) => {
          debugLog('Profile change received:', payload);
          handleProfileChange(payload);
        }
      )
      .subscribe((status) => {
        debugLog('Profiles subscription status:', status);
        updateConnectionStatus(status);
      });

    subscriptions.value = [bookingsSubscription, propertiesSubscription, profilesSubscription];
    lastSyncTime.value = new Date();
  }

  function updateConnectionStatus(status: string) {
    if (status === 'SUBSCRIBED') {
      connectionStatus.value = 'connected';
      debugLog('Real-time connection established');
    } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
      connectionStatus.value = 'disconnected';
      debugLog('Real-time connection lost:', status);
    }
  }

  // Handle real-time booking changes
  function handleBookingChange(payload: RealtimePayload) {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    // Check if this is our own optimistic update to avoid double-applying
    const optimisticKey = `booking-${(newRecord || oldRecord)?.id}`;
    if (optimisticUpdates.value.has(optimisticKey)) {
      debugLog('Ignoring own optimistic update for booking:', optimisticKey);
      optimisticUpdates.value.delete(optimisticKey);
      return;
    }

    switch (eventType) {
      case 'INSERT':
        if (newRecord && shouldIncludeBooking(newRecord as Booking)) {
          debugLog('Adding new booking from real-time:', (newRecord as Booking).id);
          bookingStore.addBooking(newRecord as Booking);
        }
        break;
      case 'UPDATE':
        if (newRecord && shouldIncludeBooking(newRecord as Booking)) {
          debugLog('Updating booking from real-time:', (newRecord as Booking).id);
          bookingStore.updateBooking((newRecord as Booking).id, newRecord as Booking);
        } else if (oldRecord && bookingStore.bookings.has((oldRecord as Booking).id)) {
          // Booking was updated but user no longer has access (e.g., ownership changed)
          debugLog('Removing booking due to access change:', (oldRecord as Booking).id);
          bookingStore.removeBooking((oldRecord as Booking).id);
        }
        break;
      case 'DELETE':
        if (oldRecord) {
          debugLog('Removing deleted booking from real-time:', (oldRecord as Booking).id);
          bookingStore.removeBooking((oldRecord as Booking).id);
        }
        break;
    }
    
    lastSyncTime.value = new Date();
  }

  // Handle real-time property changes
  function handlePropertyChange(payload: RealtimePayload) {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    const optimisticKey = `property-${(newRecord || oldRecord)?.id}`;
    if (optimisticUpdates.value.has(optimisticKey)) {
      debugLog('Ignoring own optimistic update for property:', optimisticKey);
      optimisticUpdates.value.delete(optimisticKey);
      return;
    }

    switch (eventType) {
      case 'INSERT':
        if (newRecord && shouldIncludeProperty(newRecord as Property)) {
          debugLog('Adding new property from real-time:', (newRecord as Property).id);
          propertyStore.addProperty(newRecord as Property);
        }
        break;
      case 'UPDATE':
        if (newRecord && shouldIncludeProperty(newRecord as Property)) {
          debugLog('Updating property from real-time:', (newRecord as Property).id);
          propertyStore.updateProperty((newRecord as Property).id, newRecord as Property);
        } else if (oldRecord && propertyStore.properties.has((oldRecord as Property).id)) {
          debugLog('Removing property due to access change:', (oldRecord as Property).id);
          propertyStore.removeProperty((oldRecord as Property).id);
        }
        break;
      case 'DELETE':
        if (oldRecord) {
          debugLog('Removing deleted property from real-time:', (oldRecord as Property).id);
          propertyStore.removeProperty((oldRecord as Property).id);
        }
        break;
    }
    
    lastSyncTime.value = new Date();
  }

  // Handle user profile changes
  function handleProfileChange(payload: RealtimePayload) {
    const { new: newRecord } = payload;
    
    if (newRecord && newRecord.id === authStore.user?.id) {
      debugLog('User profile updated from real-time');
      // Trigger auth store to reload user profile
      authStore.checkAuth();
    }
  }

  // Role-based filtering for real-time updates
  function shouldIncludeBooking(booking: Booking): boolean {
    if (authStore.isAdmin) {
      return true; // Admins see everything
    }
    
    if (authStore.isOwner) {
      return booking.owner_id === authStore.user?.id; // Owners see only their bookings
    }
    
    if (authStore.isCleaner) {
      return booking.assigned_cleaner_id === authStore.user?.id; // Cleaners see assigned bookings
    }
    
    return false;
  }

  function shouldIncludeProperty(property: Property): boolean {
    if (authStore.isAdmin) {
      return true; // Admins see everything
    }
    
    if (authStore.isOwner) {
      return property.owner_id === authStore.user?.id; // Owners see only their properties
    }
    
    return false;
  }

  // Optimistic updates for better UX
  async function executeWithOptimism<T>(
    optimisticKey: string,
    optimisticUpdate: () => void,
    operation: () => Promise<T>,
    rollback: () => void
  ): Promise<T> {
    try {
      // Track this optimistic update
      optimisticUpdates.value.set(optimisticKey, {
        id: optimisticKey,
        type: optimisticKey.split('-')[0] as 'booking' | 'property',
        operation: 'update',
        timestamp: Date.now(),
        data: {}
      });
      
      // Apply optimistic update immediately
      optimisticUpdate();
      
      // Execute actual operation
      const result = await operation();
      
      // Remove tracking after successful operation
      optimisticUpdates.value.delete(optimisticKey);
      
      return result;
    } catch (error) {
      // Rollback on failure
      rollback();
      optimisticUpdates.value.delete(optimisticKey);
      throw error;
    }
  }

  // Network status monitoring
  function initializeNetworkMonitoring() {
    window.addEventListener('online', () => {
      isOnline.value = true;
      debugLog('Network connection restored');
      syncPendingOperations();
    });
    
    window.addEventListener('offline', () => {
      isOnline.value = false;
      debugLog('Network connection lost');
    });
  }

  // Offline/online sync
  async function syncPendingOperations() {
    if (!isOnline.value || pendingOperations.value.length === 0) {
      return;
    }
    
    debugLog('Syncing pending operations:', pendingOperations.value.length);
    
    const operations = [...pendingOperations.value];
    pendingOperations.value = [];
    
    for (const operation of operations) {
      try {
        if (operation.execute) {
          await operation.execute();
        }
        debugLog('Synced operation:', operation.id);
      } catch (error) {
        debugLog('Failed to sync operation: ' + operation.id, error);
        // Re-add failed operation
        pendingOperations.value.push(operation);
      }
    }
  }

  function addPendingOperation(operation: Omit<PendingOperation, 'retryCount'>) {
    pendingOperations.value.push({
      ...operation,
      retryCount: 0,
    });
  }

  // Cleanup function
  function cleanup() {
    debugLog('Cleaning up real-time subscriptions');
    
    subscriptions.value.forEach(subscription => {
      if (subscription) {
        supabase.removeChannel(subscription as any);
      }
    });
    
    subscriptions.value = [];
    connectionStatus.value = 'disconnected';
  }

  // Auto-initialize when user is authenticated
  onMounted(() => {
    initializeNetworkMonitoring();
    
    if (authStore.isAuthenticated) {
      initializeRealtimeSubscriptions();
    }
  });

  onUnmounted(() => {
    cleanup();
  });

  return {
    // State
    connectionStatus: computed(() => connectionStatus.value),
    lastSyncTime: computed(() => lastSyncTime.value),
    isOnline: computed(() => isOnline.value),
    pendingOperationsCount: computed(() => pendingOperations.value.length),
    
    // Methods
    initializeRealtimeSubscriptions,
    cleanup,
    executeWithOptimism,
    addPendingOperation,
    syncPendingOperations,
    
    // Utils
    shouldIncludeBooking,
    shouldIncludeProperty
  };
}