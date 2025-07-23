// src/stores/auth.ts - Fixed Version with Proper Loading Management
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { UserRole, User } from '@/types';
import {
  getRoleSpecificSuccessMessage,
  clearAllRoleSpecificState
} from '@/utils/authHelpers';
import { useSupabaseAuth } from '@/composables/supabase/useSupabaseAuth';

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  company_name?: string;
}

export const useAuthStore = defineStore('auth', () => {
  // Use Supabase auth composable
  const {
    user: supabaseUser,
    session,
    loading: supabaseLoading,
    error: supabaseError,
    isAuthenticated: supabaseIsAuthenticated,
    signIn,
    signUp,
    signOut: supabaseSignOut,
    updateProfile,
    resetPassword,
    checkAuth,
    getAllUsers,
    updateUserRole
  } = useSupabaseAuth();

  // Local loading state for store operations
  const storeLoading = ref(false);
  const storeError = ref<string | null>(null);

  // Computed properties
  const user = computed(() => supabaseUser.value);
  const isAuthenticated = computed(() => {
    const authenticated = supabaseIsAuthenticated.value;
    console.log('[Auth Store] isAuthenticated:', authenticated, { user: !!user.value });
    return authenticated;
  });
  
  // Combined loading state - true if either Supabase or store operations are loading
  const loading = computed(() => {
    const isLoading = storeLoading.value || supabaseLoading.value;
    console.log('[Auth Store] loading state:', { 
      storeLoading: storeLoading.value, 
      supabaseLoading: supabaseLoading.value, 
      combined: isLoading 
    });
    return isLoading;
  });
  
  // Combined error state
  const error = computed(() => storeError.value || supabaseError.value);
  
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isOwner = computed(() => user.value?.role === 'owner');
  const isCleaner = computed(() => user.value?.role === 'cleaner');

  // Clear errors helper
  function clearError() {
    storeError.value = null;
    // supabaseError.value = null;
  }

  // Authentication methods
  async function login(email: string, password: string): Promise<boolean> {
    try {
      storeLoading.value = true;
      storeError.value = null;
      
      console.log('🔐 [Auth Store] Attempting login for:', email);
      const success = await signIn(email, password);
      
      if (success) {
        console.log('✅ [Auth Store] Login successful for role:', user.value?.role);
        clearError();
        return true;
      }
      
      storeError.value = 'Invalid email or password';
      return false;
    } catch (err) {
      console.error('❌ [Auth Store] Login error:', err);
      storeError.value = err instanceof Error ? err.message : 'Login failed';
      return false;
    } finally {
      storeLoading.value = false;
    }
  }

  async function logout(): Promise<boolean> {
    try {
      storeLoading.value = true;
      storeError.value = null;
      
      console.log('🚪 [Auth Store] Logging out user:', user.value?.email);
      
      // Clear role-specific state before logout
      clearAllRoleSpecificState();
      
      const success = await supabaseSignOut();
      
      if (success) {
        console.log('✅ [Auth Store] Logout successful');
        clearError();
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('❌ [Auth Store] Logout error:', err);
      storeError.value = err instanceof Error ? err.message : 'Logout failed';
      return false;
    } finally {
      storeLoading.value = false;
    }
  }

  async function register(userData: RegisterData): Promise<boolean> {
    try {
      storeLoading.value = true;
      storeError.value = null;
      
      console.log('📝 [Auth Store] Registering user:', userData.email, 'as', userData.role);
      
      const success = await signUp(userData.email, userData.password, {
        name: userData.name,
        role: userData.role,
        company_name: userData.company_name
      });
      
      if (success) {
        console.log('✅ [Auth Store] Registration successful');
        clearError();
        return true;
      }
      
      storeError.value = 'Registration failed';
      return false;
    } catch (err) {
      console.error('❌ [Auth Store] Registration error:', err);
      storeError.value = err instanceof Error ? err.message : 'Registration failed';
      return false;
    } finally {
      storeLoading.value = false;
    }
  }

  // Role switching (for admin users)
  function switchToOwnerView(ownerId?: string): boolean {
    if (!isAdmin.value) {
      storeError.value = 'Only administrators can switch views';
      return false;
    }
    
    console.log('🔄 [Auth Store] Switching to owner view:', ownerId || 'all owners');
    // Implementation for view switching would go here
    return true;
  }

  function switchToAdminView(): boolean {
    if (!isAdmin.value) {
      storeError.value = 'Only administrators can access admin view';
      return false;
    }
    
    console.log('🔄 [Auth Store] Switching to admin view');
    // Implementation for view switching would go here
    return true;
  }

  // Profile management
  async function updateUserProfile(updates: {
    name?: string;
    company_name?: string;
    notifications_enabled?: boolean;
    timezone?: string;
    theme?: 'light' | 'dark' | 'system';
    language?: string;
  }): Promise<boolean> {
    try {
      storeLoading.value = true;
      storeError.value = null;
      
      const success = await updateProfile(updates as Partial<User>);
      
      if (success) {
        console.log('✅ [Auth Store] Profile updated successfully');
        clearError();
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('❌ [Auth Store] Profile update error:', err);
      storeError.value = err instanceof Error ? err.message : 'Profile update failed';
      return false;
    } finally {
      storeLoading.value = false;
    }
  }

  async function requestPasswordReset(email: string): Promise<boolean> {
    try {
      storeLoading.value = true;
      storeError.value = null;
      
      const success = await resetPassword(email);
      
      if (success) {
        console.log('✅ [Auth Store] Password reset email sent');
        clearError();
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('❌ [Auth Store] Password reset error:', err);
      storeError.value = err instanceof Error ? err.message : 'Password reset failed';
      return false;
    } finally {
      storeLoading.value = false;
    }
  }

  // Admin functions
  async function fetchAllUsers() {
    if (!isAdmin.value) {
      throw new Error('Unauthorized: Admin access required');
    }
    
    try {
      storeLoading.value = true;
      return await getAllUsers();
    } catch (err) {
      console.error('❌ [Auth Store] Failed to fetch users:', err);
      storeError.value = err instanceof Error ? err.message : 'Failed to fetch users';
      throw err;
    } finally {
      storeLoading.value = false;
    }
  }

  async function changeUserRole(userId: string, newRole: UserRole): Promise<boolean> {
    if (!isAdmin.value) {
      storeError.value = 'Unauthorized: Admin access required';
      return false;
    }
    
    try {
      storeLoading.value = true;
      const success = await updateUserRole(userId, newRole);
      
      if (success) {
        console.log('✅ [Auth Store] User role updated successfully');
        clearError();
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('❌ [Auth Store] Role update error:', err);
      storeError.value = err instanceof Error ? err.message : 'Role update failed';
      return false;
    } finally {
      storeLoading.value = false;
    }
  }

  // Utility functions
  function getSuccessMessage(action: 'login' | 'logout' | 'register'): string {
    return getRoleSpecificSuccessMessage(action, user.value?.role);
  }

  // Initialize auth state
  async function initialize() {
    try {
      console.log('🚀 [Auth Store] Initializing auth store...');
      await checkAuth();
      if (user.value) {
        console.log('✅ [Auth Store] User authenticated:', user.value.email, 'as', user.value.role);
      } else {
        console.log('ℹ️ [Auth Store] No authenticated user found');
      }
    } catch (err) {
      console.error('❌ [Auth Store] Auth initialization error:', err);
      storeError.value = err instanceof Error ? err.message : 'Initialization failed';
    }
  }

  return {
    // State
    user,
    session,
    loading,
    error,
    
    
    // Computed
    isAuthenticated,
    isAdmin,
    isOwner,
    isCleaner,
    
    // Methods
    login,
    logout,
    register,
    switchToOwnerView,
    switchToAdminView,
    updateUserProfile,
    requestPasswordReset,
    fetchAllUsers,
    changeUserRole,
    clearError,
    getSuccessMessage,
    initialize,
    
    // Direct Supabase access for advanced use cases
    checkAuth,
    updateProfile
  };
});