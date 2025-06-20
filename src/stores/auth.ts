// 🔐 AUTHENTICATION LAYER

// src/stores/auth.ts - 🏛️ CENTRAL AUTH STATE
// ✅ Stores current user & auth state
// ✅ Provides role-checking computed properties (isOwner, isAdmin)
// ✅ Handles login/logout/registration
// ✅ Manages admin view-switching
// ✅ Used by ALL other components to check auth status


import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, UserRole, PropertyOwner, Admin, Cleaner } from '@/types';
import { useAuth } from '@/composables/shared/useAuth';
import { 
  getDefaultRouteForRole, 
  getRoleSpecificSuccessMessage,
  clearAllRoleSpecificState 
} from '@/utils/authHelpers';

/**
 * Auth store for the Property Cleaning Scheduler
 * Manages user authentication state with role-based multi-tenant architecture
 */
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const tempViewMode = ref<{ role: UserRole; adminId?: string; ownerId?: string } | null>(null);
  
  // Initialize auth composable
  const authComposable = useAuth();
  
  // Computed properties
  const isAuthenticated = computed(() => !!user.value && !!token.value);
  
  // Role-specific computed properties for role-based routing
  const isOwner = computed(() => {
    // Check temp view mode first (for admin switching to owner view)
    if (tempViewMode.value?.role === 'owner') return true;
    return user.value?.role === 'owner';
  });
  
  const isAdmin = computed(() => {
    // Admin role is never overridden by temp view mode
    return user.value?.role === 'admin';
  });
  
  const isCleaner = computed(() => {
    // Check temp view mode first
    if (tempViewMode.value?.role === 'cleaner') return true;
    return user.value?.role === 'cleaner';
  });
  
  // Get current effective role (considering temp view mode)
  const currentRole = computed(() => {
    return tempViewMode.value?.role || user.value?.role;
  });
  
  // Get default route for current user
  const defaultRoute = computed(() => {
    return getDefaultRouteForRole(currentRole.value);
  });
  
  // Actions
  
  /**
   * Login with email and password
   * Returns success boolean for component-level navigation handling
   */
  async function login(email: string, password: string): Promise<boolean> {
    loading.value = true;
    error.value = null;
    
    try {
      const success = await authComposable.login(email, password);
      
      if (success) {
        // Get user data from the auth composable
        const userData = getUserFromEmail(email);
        if (userData) {
          user.value = userData;
          token.value = 'mock-jwt-token'; // Mock token for development
          
          // Clear any previous temp view mode
          tempViewMode.value = null;
          
          loading.value = false;
          return true;
        }
      }
      
      error.value = 'Login failed';
      loading.value = false;
      return false;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Logout current user and clear all role-specific state
   * Returns success boolean for component-level navigation handling
   */
  async function logout(): Promise<boolean> {
    loading.value = true;
    error.value = null;
    
    try {
      // Use auth composable for logout
      const success = await authComposable.logout();
      
      if (success) {
        // Clear auth state
        user.value = null;
        token.value = null;
        tempViewMode.value = null;
        
        // Clear all role-specific cached state
        clearAllRoleSpecificState();
        
        // Note: Store clearing will be handled by the component calling this function
        // since stores can't directly access other stores in a clean way
        
        loading.value = false;
        return true;
      }
      
      error.value = 'Logout failed';
      loading.value = false;
      return false;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Logout failed';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Register a new user with role selection
   * Returns success boolean for component-level navigation handling
   */
  async function register(userData: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    company_name?: string;
  }): Promise<boolean> {
    loading.value = true;
    error.value = null;
    
    try {
      const success = await authComposable.register(userData);
      
      if (success) {
        // Set user data after successful registration
        const newUser = createUserFromRegistration(userData);
        user.value = newUser;
        token.value = 'mock-jwt-token'; // Mock token for development
        
        // Clear any previous temp view mode
        tempViewMode.value = null;
        
        loading.value = false;
        return true;
      }
      
      error.value = 'Registration failed';
      loading.value = false;
      return false;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Registration failed';
      loading.value = false;
      return false;
    }
  }
  
  /**
   * Switch to owner view (admin only)
   * Allows admin to view the system from an owner's perspective for support
   */
  function switchToOwnerView(ownerId?: string): boolean {
    if (user.value?.role !== 'admin') {
      error.value = 'Only admin users can switch views';
      return false;
    }
    
    tempViewMode.value = { role: 'owner', ownerId };
    return true;
  }
  
  /**
   * Switch back to admin view
   */
  function switchToAdminView(): boolean {
    if (user.value?.role !== 'admin') {
      error.value = 'Only admin users can switch views';
      return false;
    }
    
    tempViewMode.value = null;
    return true;
  }
  
  /**
   * Check authentication status
   */
  async function checkAuth(): Promise<boolean> {
    // In a real app, this would validate the token with the server
    return Promise.resolve(isAuthenticated.value);
  }
  
  /**
   * Clear error state
   */
  function clearError() {
    error.value = null;
  }
  
  /**
   * Get success message for auth action
   */
  function getSuccessMessage(action: 'login' | 'logout' | 'register'): string {
    return getRoleSpecificSuccessMessage(action, user.value?.role);
  }
  
  // Helper functions
  
  /**
   * Get user data from email (mock implementation)
   */
  function getUserFromEmail(email: string): User | null {
    // This uses the same mock users from the auth composable
    const mockUsers: User[] = [
      {
        id: 'owner-1',
        email: 'owner@example.com',
        name: 'Property Owner',
        role: 'owner',
        company_name: 'Luxury Rentals Inc.',
        settings: {
          notifications: true,
          timezone: 'America/New_York',
          theme: 'light' as const,
          language: 'en'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as PropertyOwner,
      {
        id: 'admin-1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        access_level: 'full' as const,
        settings: {
          notifications: true,
          timezone: 'America/New_York',
          theme: 'dark' as const,
          language: 'en'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Admin,
      {
        id: 'cleaner-1',
        email: 'cleaner@example.com',
        name: 'Cleaning Staff',
        role: 'cleaner',
        skills: ['deep clean', 'carpet cleaning', 'window washing'],
        max_daily_bookings: 3,
        location: {
          lat: 40.7128,
          lng: -74.0060
        },
        settings: {
          notifications: true,
          timezone: 'America/New_York',
          theme: 'light' as const,
          language: 'en'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Cleaner
    ];
    
    return mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }
  
  /**
   * Create user object from registration data
   */
  function createUserFromRegistration(userData: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    company_name?: string;
  }): User {
    const baseUser = {
      id: `${userData.role}-${Date.now()}`,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      settings: {
        notifications: true,
        timezone: 'America/New_York',
        theme: 'light' as const,
        language: 'en'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add role-specific properties
    if (userData.role === 'owner') {
      return {
        ...baseUser,
        role: 'owner' as const,
        company_name: userData.company_name || ''
      } as PropertyOwner;
    } else if (userData.role === 'admin') {
      return {
        ...baseUser,
        role: 'admin' as const,
        access_level: 'limited' as const // New admins start with limited access
      } as Admin;
    } else if (userData.role === 'cleaner') {
      return {
        ...baseUser,
        role: 'cleaner' as const,
        skills: [],
        max_daily_bookings: 3,
        location: { lat: 0, lng: 0 }
      } as Cleaner;
    }
    
    return baseUser as User;
  }
  
  return {
    // State
    user,
    token,
    loading,
    error,
    tempViewMode,
    
    // Computed
    isAuthenticated,
    isOwner,
    isAdmin,
    isCleaner,
    currentRole,
    defaultRoute,
    
    // Actions
    login,
    logout,
    register,
    switchToOwnerView,
    switchToAdminView,
    checkAuth,
    clearError,
    getSuccessMessage
  };
}); 