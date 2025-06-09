import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, Property, PropertyMap, Booking, BookingMap } from '@/types';

/**
 * User store for the Property Cleaning Scheduler
 * Uses Map collections for efficient property and booking access
 */
export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null);
  const houses = ref<PropertyMap>(new Map());
  const events = ref<BookingMap>(new Map());
  const settings = ref({
    notifications: true,
    timezone: 'America/New_York',
    theme: 'light',
    language: 'en'
  });

  // Getters
  const isAuthenticated = computed(() => !!user.value);
  
  const getPropertyById = computed(() => (id: string): Property | undefined => {
    return houses.value.get(id);
  });
  
  const getBookingById = computed(() => (id: string): Booking | undefined => {
    return events.value.get(id);
  });
  
  const propertiesArray = computed((): Property[] => {
    return Array.from(houses.value.values());
  });
  
  const bookingsArray = computed((): Booking[] => {
    return Array.from(events.value.values());
  });
  
  const activeProperties = computed((): Property[] => {
    return propertiesArray.value.filter(property => property.active);
  });
  
  const todayBookings = computed((): Booking[] => {
    const today = new Date().toISOString().split('T')[0];
    return bookingsArray.value.filter(booking => 
      booking.checkout_date.startsWith(today) || 
      booking.checkin_date.startsWith(today)
    );
  });
  
  const turnBookings = computed((): Booking[] => {
    return bookingsArray.value.filter(booking => booking.booking_type === 'turn');
  });

  // Actions
  function setUser(newUser: User | null) {
    user.value = newUser;
  }
  
  function addProperty(property: Property) {
    houses.value.set(property.id, property);
  }
  
  function updateProperty(id: string, updates: Partial<Property>) {
    const existing = houses.value.get(id);
    if (existing) {
      houses.value.set(id, { 
        ...existing, 
        ...updates, 
        updated_at: new Date().toISOString() 
      });
    }
  }
  
  function removeProperty(id: string) {
    houses.value.delete(id);
  }
  
  function addEvent(booking: Booking) {
    events.value.set(booking.id, booking);
  }
  
  function updateEvent(id: string, updates: Partial<Booking>) {
    const existing = events.value.get(id);
    if (existing) {
      events.value.set(id, { 
        ...existing, 
        ...updates, 
        updated_at: new Date().toISOString() 
      });
    }
  }
  
  function removeEvent(id: string) {
    events.value.delete(id);
  }
  
  function clearAllData() {
    user.value = null;
    houses.value.clear();
    events.value.clear();
  }

  return {
    // State
    user,
    houses,
    events,
    settings,
    
    // Getters
    isAuthenticated,
    getPropertyById,
    getBookingById,
    propertiesArray,
    bookingsArray,
    activeProperties,
    todayBookings,
    turnBookings,
    
    // Actions
    setUser,
    addProperty,
    updateProperty,
    removeProperty,
    addEvent,
    updateEvent,
    removeEvent,
    clearAllData
  };
});
