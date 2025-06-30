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
import { 
  getDefaultRouteForRole, 
  getRoleSpecificSuccessMessage,
  clearAllRoleSpecificState 
} from '@/utils/authHelpers';
import { useSupabaseAuth } from '@/composables/supabase/useSupabaseAuth';

/**
 * Auth store for the Property Cleaning Scheduler
 * Manages user authentication state with role-based multi-tenant architecture
 */
export const useAuthStore = defineStore('auth', () => {
  // Initialize Supabase auth
  const supabaseAuth = useSupabaseAuth();
  
  // State - sync with Supabase auth
  const user = computed(() => supabaseAuth.user.value);
  const token = ref<string | null>(null); // Keep for compatibility
  const loading = computed(() => supabaseAuth.loading.value);
  const error = computed(() => supabaseAuth.error.value);
  const tempViewMode = ref<{ role: UserRole; ownerId?: string } | null>(null);
  
  // Computed properties
  const isAuthenticated = computed(() => supabaseAuth.isAuthenticated.value);
  
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
   * Login with email and password using Supabase
   * Returns success boolean for component-level navigation handling
   */
  async function login(email: string, password: string): Promise<boolean> {
    try {
      console.log('🔍 [AuthStore] Login attempt:', { email });
      
      const success = await supabaseAuth.signIn(email, password);
      
      if (success) {
        console.log('✅ [AuthStore] User authenticated:', { 
          id: user.value?.id, 
          role: user.value?.role, 
          name: user.value?.name,
          isAuthenticated: isAuthenticated.value
        });
        
        // Clear any previous temp view mode
        tempViewMode.value = null;
        token.value = 'supabase-session'; // Set token for compatibility
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  }
  
  /**
   * Logout current user using Supabase and clear all role-specific state
   * Returns success boolean for component-level navigation handling
   */
  async function logout(): Promise<boolean> {
    try {
      const success = await supabaseAuth.signOut();
      
      if (success) {
        // Clear local state
        token.value = null;
        tempViewMode.value = null;
        
        // Clear all role-specific cached state
        clearAllRoleSpecificState();
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Logout error:', err);
      return false;
    }
  }
  
  /**
   * Register a new user with role selection using Supabase
   * Returns success boolean for component-level navigation handling
   */
  async function register(userData: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    company_name?: string;
  }): Promise<boolean> {
    try {
      console.log('🔍 [AuthStore] Registration attempt:', { 
        email: userData.email, 
        role: userData.role,
        name: userData.name
      });
      
      const success = await supabaseAuth.signUp(
        userData.email, 
        userData.password, 
        {
          name: userData.name,
          role: userData.role,
          company_name: userData.company_name
        }
      );
      
      if (success) {
        console.log('✅ [AuthStore] User registered:', { 
          id: user.value?.id, 
          role: user.value?.role, 
          name: user.value?.name
        });
        
        // Clear any previous temp view mode
        tempViewMode.value = null;
        token.value = 'supabase-session'; // Set token for compatibility
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Registration error:', err);
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
    // Supabase auth handles error clearing automatically
    // This function is kept for API compatibility
  }
  
  /**
   * Get success message for auth action
   */
  function getSuccessMessage(action: 'login' | 'logout' | 'register'): string {
    return getRoleSpecificSuccessMessage(action, user.value?.role);
  }
  
  // Note: Mock helper functions removed - now using real Supabase authentication
  
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