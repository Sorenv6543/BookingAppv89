// src/stores/auth.ts - Fixed Version with Proper Loading Management
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, UserRole } from '@/types';
import type { Session } from '@supabase/supabase-js';
import { useSupabaseAuth } from '@/composables/supabase/useSupabaseAuth';

export const useAuthStore = defineStore('auth', () => {
  // --- Initial state ---
  const initialState = {
    session: null as Session | null,
    user: null as User | null,
    loading: false,
    error: null as string | null,
    initializing: true,
    isAuthenticated: false,
  };

  // --- State refs for fallback/test mode ---
  const fallbackSession = ref<Session | null>(initialState.session);
  const fallbackUser = ref<User | null>(initialState.user);
  const fallbackLoading = ref(initialState.loading);
  const fallbackError = ref<string | null>(initialState.error);
  const fallbackInitializing = ref(initialState.initializing);

  let signIn: (email: string, password: string) => Promise<boolean> = async () => true;
  let signUp: (email: string, password: string, userData: { name: string; role?: UserRole; company_name?: string }) => Promise<boolean> = async () => true;
  let supabaseSignOut: () => Promise<boolean> = async () => true;
  let updateProfile: (updates: Partial<User>) => Promise<boolean> = async () => true;
  let resetPassword: (email: string) => Promise<boolean> = async () => true;
  let checkAuth: () => Promise<void> = async () => {};
  let getAllUsers: () => Promise<User[]> = async () => [];
  let updateUserRole: (userId: string, newRole: UserRole) => Promise<boolean> = async () => true;
  let deleteUser: (userId: string) => Promise<boolean> = async () => true;

  let unsubscribe: (() => void) | null = null;

  // Define composable at module scope
  let composable: ReturnType<typeof useSupabaseAuth> | null = null;

  // Initialize once, outside test mode
  if (import.meta.env.MODE !== 'test' && !unsubscribe) {
    composable = useSupabaseAuth();
    
    signIn = composable.signIn;
    signUp = composable.signUp;
    supabaseSignOut = composable.signOut;
    updateProfile = composable.updateProfile;
    resetPassword = composable.resetPassword;
    checkAuth = composable.checkAuth;
    getAllUsers = composable.getAllUsers;
    updateUserRole = composable.updateUserRole;
    deleteUser = composable.deleteUser;
  }

  // --- Reactive computed state that uses composable or fallback ---
  const session = computed(() => composable?.session.value ?? fallbackSession.value);
  const user = computed(() => composable?.user.value ?? fallbackUser.value);
  const loading = computed(() => composable?.loading.value ?? fallbackLoading.value);
  const error = computed(() => composable?.error.value ?? fallbackError.value);
  const initializing = computed(() => composable?.initializing.value ?? fallbackInitializing.value);
  const isAuthenticated = computed(() => !!session.value && !!user.value);
  
  // Role-based computed properties
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isOwner = computed(() => user.value?.role === 'owner');
  const isCleaner = computed(() => user.value?.role === 'cleaner');

  // Enhanced checkAuth method that waits for initialization
  const enhancedCheckAuth = async (): Promise<void> => {
    if (composable) {
      // Wait for initialization to complete if still initializing
      if (composable.initializing.value) {
        console.log('🔄 Auth store: Waiting for composable initialization...');
        const maxWaitTime = 500; // 500ms max wait (reduced from 1 second)
        const checkInterval = 50; // Check every 50ms (reduced from 100ms)
        let waitedTime = 0;
        
        while (composable.initializing.value && waitedTime < maxWaitTime) {
          await new Promise(resolve => setTimeout(resolve, checkInterval));
          waitedTime += checkInterval;
        }
        
        if (composable.initializing.value) {
          console.warn('⚠️ Composable initialization timeout in store');
        } else {
          console.log('✅ Composable initialization completed in store');
        }
      }
      
      // Now call the composable's checkAuth
      await composable.checkAuth();
    } else {
      console.warn('⚠️ No composable available in auth store');
    }
  };

  // ... rest of the store logic ...

  // --- $reset implementation ---
  function $reset() {
    // Reset fallback values (used in test mode)
    fallbackSession.value = initialState.session;
    fallbackUser.value = initialState.user;
    fallbackLoading.value = initialState.loading;
    fallbackError.value = initialState.error;
    fallbackInitializing.value = initialState.initializing;
  }

  // Keep this if you need to use loadUserProfile elsewhere
  const loadUserProfile = composable?.loadUserProfile;

  return {
    session,
    user,
    loading,
    error,
    initializing,
    isAuthenticated,
    isAdmin,
    isOwner,
    isCleaner,
    $reset,
    // ... other computed and methods ...
    login: async (email: string, password: string) => {
      console.log('Auth store login called with:', email);
      const result = await signIn(email, password);
      console.log('Auth store login result:', result);
      return result;
    },
    logout: supabaseSignOut,
    register: signUp,
    updateUserProfile: updateProfile,
    requestPasswordReset: resetPassword,
    fetchAllUsers: getAllUsers,
    changeUserRole: updateUserRole,
    deleteUser: deleteUser,
    clearError: () => { 
      fallbackError.value = null;
      // Also clear composable error if available
      if (composable?.error) {
        composable.error.value = null;
      }
    },
    getSuccessMessage: () => null,
    initialize: async (): Promise<void> => {},
    checkAuth: enhancedCheckAuth,
    updateProfile,
    loadUserProfile,
    // Expose fallback refs for test utilities
    ...(import.meta.env.MODE === 'test' ? { 
      fallbackUser,
      fallbackSession, 
      fallbackLoading,
      fallbackError,
      fallbackInitializing
    } : {})
  };
});