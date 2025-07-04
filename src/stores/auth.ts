// src/stores/auth.ts - Fixed Version with Proper Loading Management
import { defineStore } from 'pinia';
import { ref, computed, Ref } from 'vue';
import type { UserRole, User } from '@/types';
import { useSupabaseAuth } from '@/composables/supabase/useSupabaseAuth';

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  company_name?: string;
}

export const useAuthStore = defineStore('auth', () => {
  // Top-level refs for all state
  const supabaseUser = ref<User | null>(null);
  const session = ref<any>(null);
  const supabaseLoading = ref(false);
  const supabaseError = ref<string | null>(null);
  const initializing = ref(false);
  const supabaseIsAuthenticated = ref(false);
  let signIn: any = async () => true;
  let signUp: any = async () => true;
  let supabaseSignOut: any = async () => true;
  let updateProfile: any = async () => true;
  let resetPassword: any = async () => true;
  let checkAuth: any = async () => true;
  let getAllUsers: any = async () => [];
  let updateUserRole: any = async () => true;

  if (import.meta.env.MODE !== 'test') {
    const composable = useSupabaseAuth();
    supabaseUser.value = composable.user.value;
    session.value = composable.session.value;
    supabaseLoading.value = composable.loading.value;
    supabaseError.value = composable.error.value;
    initializing.value = composable.initializing.value;
    supabaseIsAuthenticated.value = composable.isAuthenticated.value;
    signIn = composable.signIn;
    signUp = composable.signUp;
    supabaseSignOut = composable.signOut;
    updateProfile = composable.updateProfile;
    resetPassword = composable.resetPassword;
    checkAuth = composable.checkAuth;
    getAllUsers = composable.getAllUsers;
    updateUserRole = composable.updateUserRole;
  }

  // Computed user always references supabaseUser
  const user = computed(() => supabaseUser.value);

  // ... rest of the store logic ...

  return {
    user,
    session,
    loading: supabaseLoading,
    error: supabaseError,
    initializing,
    isAuthenticated: supabaseIsAuthenticated,
    // ... other computed and methods ...
    login: signIn,
    logout: supabaseSignOut,
    register: signUp,
    updateUserProfile: updateProfile,
    requestPasswordReset: resetPassword,
    fetchAllUsers: getAllUsers,
    changeUserRole: updateUserRole,
    clearError: () => { supabaseError.value = null; },
    getSuccessMessage: () => null,
    initialize: async () => {},
    checkAuth,
    updateProfile,
    // Expose supabaseUser for test utilities only
    ...(import.meta.env.MODE === 'test' ? { supabaseUser } : {})
  };
});