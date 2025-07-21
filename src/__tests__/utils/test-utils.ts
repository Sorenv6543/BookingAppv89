// Test utilities for role-based testing
// Provides helpers to set up owner/admin users and bookings in tests

import { nextTick, ref, computed } from 'vue';
import type { User } from '@/types';

// Mock auth store interface for testing
interface MockAuthStore {
  session: { value: unknown };
  user: { value: Partial<User> | null };
  loading: { value: boolean };
  error: { value: string | null };
  initializing: { value: boolean };
  isAuthenticated: { value: boolean };
  isAdmin: { value: boolean };
  isOwner: { value: boolean };
  isCleaner: { value: boolean };
  login: () => Promise<boolean>;
  logout: () => Promise<boolean>;
  register: () => Promise<boolean>;
  updateUserProfile: () => Promise<boolean>;
  clearError: () => void;
  setUser: (user: Partial<User>) => void;
  $patch: (updates: { fallbackUser?: Partial<User> }) => void;
  $reset: () => void;
  [key: string]: unknown;
}

// Booking store interface for testing
interface MockBookingStore {
  addBooking: (booking: Record<string, unknown>) => void;
}

/**
 * Creates a simple mock auth store for testing
 * This replaces the complex auth store with a simple, controllable version
 */
function createMockAuthStore(userRole: 'owner' | 'admin', userId: string) {
  const mockUser = ref({
    id: userId,
    email: `${userId}@example.com`,
    name: userRole === 'owner' ? 'Property Owner' : 'Business Admin',
    role: userRole,
    settings: {
      notifications: true,
      timezone: 'America/New_York',
      theme: 'light',
      language: 'en',
    },
  });

  const mockSession = ref({
    user: { id: userId, email: `${userId}@example.com` },
    access_token: `mock-token-${userRole}`
  });

  return {
    // Core state
    session: computed(() => mockSession.value),
    user: computed(() => mockUser.value),
    loading: computed(() => false),
    error: computed(() => null),
    initializing: computed(() => false),
    isAuthenticated: computed(() => true),
    
    // Role-based computed properties
    isAdmin: computed(() => mockUser.value?.role === 'admin'),
    isOwner: computed(() => mockUser.value?.role === 'owner'),
    isCleaner: computed(() => mockUser.value?.role === 'cleaner'),
    
    // Methods (simplified for tests)
    login: async () => true,
    logout: async () => true,
    register: async () => true,
    updateUserProfile: async () => true,
    clearError: () => {},
    
    // Test-specific methods to change user
    setUser: (newUser: Partial<User>) => {
      mockUser.value = newUser;
    },
    
    // Pinia compatibility
    $patch: (updates: { fallbackUser?: Partial<User> }) => {
      if (updates.fallbackUser) {
        mockUser.value = updates.fallbackUser;
      }
    },
    $reset: () => {
      mockUser.value = null;
      mockSession.value = null;
    }
  };
}

// Role-based test helpers for owner/admin context
// Usage:
//   const mockAuthStore = setOwnerUser(authStore, 'owner1') // returns mock store
//   const mockAuthStore = setAdminUser(authStore, 'admin1') // returns mock store
//   addOwnerBookings(bookingStore, 'owner1', 3)
//   addAdminBookings(bookingStore, 5)

/**
 * Sets up an owner user - returns a mock auth store for testing
 * This completely replaces the complex auth store with a simple mock
 */
export function setOwnerUser(authStore: MockAuthStore, id = 'owner1') {
  console.log(`[setOwnerUser] Creating mock auth store for owner ${id}`);
  
  const mockStore = createMockAuthStore('owner', id);
  
  // Replace all the auth store properties with mock versions
  Object.keys(mockStore).forEach(key => {
    if (typeof authStore[key] !== 'undefined') {
      authStore[key] = mockStore[key];
    }
  });
  
  console.log(`[setOwnerUser] Mock auth store created - User:`, authStore.user?.value);
  console.log(`[setOwnerUser] Mock auth store - IsOwner:`, authStore.isOwner?.value);
  
  return authStore;
}

/**
 * Sets up an admin user - returns a mock auth store for testing  
 * This completely replaces the complex auth store with a simple mock
 */
export function setAdminUser(authStore: MockAuthStore, id = 'admin1') {
  console.log(`[setAdminUser] Creating mock auth store for admin ${id}`);
  
  const mockStore = createMockAuthStore('admin', id);
  
  // Replace all the auth store properties with mock versions
  Object.keys(mockStore).forEach(key => {
    if (typeof authStore[key] !== 'undefined') {
      authStore[key] = mockStore[key];
    }
  });
  
  console.log(`[setAdminUser] Mock auth store created - User:`, authStore.user?.value);
  console.log(`[setAdminUser] Mock auth store - IsAdmin:`, authStore.isAdmin?.value);
  
  return authStore;
}

/**
 * Adds multiple bookings for a specific owner to the booking store
 */
export function addOwnerBookings(bookingStore: MockBookingStore, ownerId: string, count: number) {
  for (let i = 1; i <= count; i++) {
    bookingStore.addBooking({
      id: `${ownerId}-booking${i}`, // Make IDs unique per owner
      property_id: `${ownerId}-prop${i}`,
      owner_id: ownerId,
      checkout_date: '2023-06-01T11:00:00Z',
      checkin_date: '2023-06-03T15:00:00Z',
      booking_type: 'standard',
      status: 'pending',
    });
  }
}

/**
 * Adds multiple bookings for admin testing (across different owners)
 */
export function addAdminBookings(bookingStore: MockBookingStore, count: number) {
  for (let i = 1; i <= count; i++) {
    bookingStore.addBooking({
      id: `adminBooking${i}`,
      property_id: `adminProp${i}`,
      owner_id: `owner${i}`,
      checkout_date: '2023-06-01T11:00:00Z',
      checkin_date: '2023-06-03T15:00:00Z',
      booking_type: i % 2 === 0 ? 'turn' : 'standard',
      status: i % 2 === 0 ? 'scheduled' : 'pending',
    });
  }
}

/**
 * Helper to wait for Vue's reactivity to update
 */
export async function waitForReactivity() {
  await nextTick();
  // Give extra time for computed properties to update
  await new Promise(resolve => setTimeout(resolve, 10));
} 