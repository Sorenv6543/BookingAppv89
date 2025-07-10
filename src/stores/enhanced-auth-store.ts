// src/stores/auth.ts - Enhanced with Supabase Integration
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { UserRole } from '@/types';
import {
  validateRouteAccess,
  enhanceUserProfileData,
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

  // Store state
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed properties
  const user = computed(() => supabaseUser.value);
  const isAuthenticated = computed(() => supabaseIsAuthenticated.value);
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isOwner = computed(() => user.value?.role === 'owner');
  const isCleaner = computed(() => user.value?.role === 'cleaner');

  // Authentication methods
  async function login(email: string, password: string): Promise<boolean> {
    try {
      loading.value = true;
      error.value = null;
      
      console.log('🔐 Attempting login for:', email);
      const success = await signIn(email, password);
      
      if (success) {
        console.log('✅ Login successful for role:', user.value?.role);
        return true;
      }
      
      error.value = 'Invalid email or password';
      return false;
    } catch (err) {
      console.error('❌ Login error:', err);
      error.value = err instanceof Error ? err.message : 'Login failed';
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function logout(): Promise<boolean> {
    try {
      loading.value = true;
      error.value = null;
      
      console.log('🚪 Logging out user:', user.value?.email);
      
      // Clear role-specific state before logout
      clearAllRoleSpecificState();
      
      const success = await supabaseSignOut();
      
      if (success) {
        console.log('✅ Logout successful');
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('❌ Logout error:', err);
      error.value = err instanceof Error ? err.message : 'Logout failed';
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function register(userData: RegisterData): Promise<boolean> {
    try {
      loading.value = true;
      error.value = null;
      
      console.log('📝 Registering new user:', userData.email, 'as', userData.role);
      
      const success = await signUp(userData.email, userData.password, {
        name: userData.name,
        role: userData.role,
        company_name: userData.company_name
      });
      
      if (success) {
        console.log('✅ Registration successful. Check email for verification.');
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('❌ Registration error:', err);
      error.value = err instanceof Error ? err.message : 'Registration failed';
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Role switching (for admin testing)
  function switchToOwnerView(ownerId?: string): boolean {
    if (!isAdmin.value) {
      error.value = 'Only admins can switch views';
      return false;
    }
    
    console.log('🔄 Admin switching to owner view:', ownerId);
    // This is handled at the route/component level
    return true;
  }

  function switchToAdminView(): boolean {
    if (!isAdmin.value) {
      error.value = 'Only admins can access admin view';
      return false;
    }
    
    console.log('🔄 Switching back to admin view');
    return true;
  }

  // Profile management
  async function updateUserProfile(updates: {
    name?: string;
    company_name?: string;
    notifications_enabled?: boolean;
    timezone?: string;
    theme?: string;
  }): Promise<boolean> {
    try {
      loading.value = true;
      error.value = null;
      
      const success = await updateProfile(updates);
      
      if (success) {
        console.log('✅ Profile updated successfully');
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('❌ Profile update error:', err);
      error.value = err instanceof Error ? err.message : 'Profile update failed';
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Password reset
  async function requestPasswordReset(email: string): Promise<boolean> {
    try {
      loading.value = true;
      error.value = null;
      
      const success = await resetPassword(email);
      
      if (success) {
        console.log('✅ Password reset email sent');
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('❌ Password reset error:', err);
      error.value = err instanceof Error ? err.message : 'Password reset failed';
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Admin functions
  async function fetchAllUsers() {
    if (!isAdmin.value) {
      throw new Error('Unauthorized: Admin access required');
    }
    
    try {
      loading.value = true;
      return await getAllUsers();
    } catch (err) {
      console.error('❌ Failed to fetch users:', err);
      error.value = err instanceof Error ? err.message : 'Failed to fetch users';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function changeUserRole(userId: string, newRole: UserRole): Promise<boolean> {
    if (!isAdmin.value) {
      error.value = 'Unauthorized: Admin access required';
      return false;
    }
    
    try {
      loading.value = true;
      const success = await updateUserRole(userId, newRole);
      
      if (success) {
        console.log('✅ User role updated successfully');
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('❌ Role update error:', err);
      error.value = err instanceof Error ? err.message : 'Role update failed';
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Utility functions
  function clearError() {
    error.value = null;
  }

  function getSuccessMessage(action: 'login' | 'logout' | 'register'): string {
    return getRoleSpecificSuccessMessage(action, user.value?.role);
  }

  // Initialize auth state
  async function initialize() {
    try {
      console.log('🚀 Initializing auth store...');
      await checkAuth();
      if (user.value) {
        console.log('✅ User authenticated:', user.value.email, 'as', user.value.role);
      }
    } catch (err) {
      console.error('❌ Auth initialization error:', err);
    }
  }

  return {
    // State
    user,
    session,
    loading: computed(() => loading.value || supabaseLoading.value),
    error: computed(() => error.value || supabaseError.value),
    
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