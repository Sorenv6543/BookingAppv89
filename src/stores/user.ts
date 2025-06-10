import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/types';
import { usePropertyStore } from './property';
import { useBookingStore } from './booking';

/**
 * User store for the Property Cleaning Scheduler
 * Manages user authentication and user-specific views/filters
 * Uses other stores for actual data, provides user-filtered views
 */
export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null);
  const settings = ref({
    notifications: true,
    timezone: 'America/New_York',
    theme: 'light',
    language: 'en',
    defaultCalendarView: 'timeGridWeek',
    autoRefreshInterval: 30000 // 30 seconds
  });

  // User-specific view preferences
  const viewPreferences = ref({
    sidebarCollapsed: false,
    favoriteProperties: new Set<string>(),
    recentlyViewedProperties: [] as string[],
    defaultPropertyFilters: {
      showInactive: false,
      pricingTier: 'all'
    }
  });

  // Get store instances
  const propertyStore = usePropertyStore();
  const bookingStore = useBookingStore();

  // Getters - User-specific filtered views
  const isAuthenticated = computed(() => !!user.value);
  
  /**
   * User's properties (filtered by ownership or admin access)
   */
  const userProperties = computed(() => {
    if (!user.value) return [];
    
    if (user.value.role === 'admin') {
      return propertyStore.propertiesArray;
    }
    
    return propertyStore.propertiesByOwner(user.value.id);
  });
  
  /**
   * User's active properties only
   */
  const userActiveProperties = computed(() => {
    return userProperties.value.filter(property => property.active);
  });
  
  /**
   * User's bookings (filtered by ownership or role access)
   */
  const userBookings = computed(() => {
    if (!user.value) return [];
    
    if (user.value.role === 'admin') {
      return bookingStore.bookingsArray;
    }
    
    if (user.value.role === 'cleaner') {
      return bookingStore.bookingsArray.filter(booking => 
        booking.assigned_cleaner_id === user.value?.id
      );
    }
    
    return bookingStore.bookingsByOwner(user.value.id);
  });
  
  /**
   * Today's bookings for this user
   */
  const userTodayBookings = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return userBookings.value.filter(booking => 
      booking.checkout_date.startsWith(today) || 
      booking.checkin_date.startsWith(today)
    );
  });
  
  /**
   * User's turn bookings (urgent)
   */
  const userTurnBookings = computed(() => {
    return userBookings.value.filter(booking => booking.booking_type === 'turn');
  });
  
  /**
   * User's favorite properties
   */
  const favoriteProperties = computed(() => {
    return userProperties.value.filter(property => 
      viewPreferences.value.favoriteProperties.has(property.id)
    );
  });
  
  /**
   * Recently viewed properties (last 5)
   */
  const recentProperties = computed(() => {
    return viewPreferences.value.recentlyViewedProperties
      .slice(0, 5)
      .map(id => propertyStore.getPropertyById(id))
      .filter(Boolean);
  });

  // Actions
  function setUser(newUser: User | null) {
    user.value = newUser;
    
    // Clear user-specific data when logging out
    if (!newUser) {
      clearUserPreferences();
    }
  }
  
  function updateSettings(newSettings: Partial<typeof settings.value>) {
    settings.value = {
      ...settings.value,
      ...newSettings
    };
  }
  
  function toggleFavoriteProperty(propertyId: string) {
    if (viewPreferences.value.favoriteProperties.has(propertyId)) {
      viewPreferences.value.favoriteProperties.delete(propertyId);
    } else {
      viewPreferences.value.favoriteProperties.add(propertyId);
    }
  }
  
  function addRecentlyViewedProperty(propertyId: string) {
    // Remove if already exists
    viewPreferences.value.recentlyViewedProperties = 
      viewPreferences.value.recentlyViewedProperties.filter(id => id !== propertyId);
    
    // Add to beginning
    viewPreferences.value.recentlyViewedProperties.unshift(propertyId);
    
    // Keep only last 10
    if (viewPreferences.value.recentlyViewedProperties.length > 10) {
      viewPreferences.value.recentlyViewedProperties = 
        viewPreferences.value.recentlyViewedProperties.slice(0, 10);
    }
  }
  
  function updateViewPreferences(preferences: Partial<typeof viewPreferences.value>) {
    viewPreferences.value = {
      ...viewPreferences.value,
      ...preferences
    };
  }
  
  function clearUserPreferences() {
    viewPreferences.value = {
      sidebarCollapsed: false,
      favoriteProperties: new Set<string>(),
      recentlyViewedProperties: [],
      defaultPropertyFilters: {
        showInactive: false,
        pricingTier: 'all'
      }
    };
  }
  
  /**
   * Check if user has permission to perform action on resource
   */
  function hasPermission(action: 'view' | 'edit' | 'delete', resourceType: 'property' | 'booking', resourceOwnerId?: string): boolean {
    if (!user.value) return false;
    
    // Admins can do everything
    if (user.value.role === 'admin') return true;
    
    // Owners can manage their own resources
    if (user.value.role === 'owner') {
      if (action === 'view') return true;
      return resourceOwnerId === user.value.id;
    }
    
    // Cleaners can only view assigned bookings
    if (user.value.role === 'cleaner') {
      return action === 'view' && resourceType === 'booking';
    }
    
    return false;
  }

  return {
    // State
    user,
    settings,
    viewPreferences,
    
    // Getters - User-filtered views
    isAuthenticated,
    userProperties,
    userActiveProperties,
    userBookings,
    userTodayBookings,
    userTurnBookings,
    favoriteProperties,
    recentProperties,
    
    // Actions
    setUser,
    updateSettings,
    toggleFavoriteProperty,
    addRecentlyViewedProperty,
    updateViewPreferences,
    clearUserPreferences,
    hasPermission
  };
});