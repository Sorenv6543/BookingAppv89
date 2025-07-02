// src/composables/supabase/useSupabaseAuth.ts - Enhanced Production Version
import { ref, computed, onMounted } from 'vue';
import { supabase } from '@/plugins/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import type { User, UserRole } from '@/types';

export function useSupabaseAuth() {
  const user = ref<User | null>(null);
  const session = ref<Session | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!session.value && !!user.value);
  const currentUserId = computed(() => session.value?.user?.id);
  
  // Debug helpers (only in development)
  const debugAuth = import.meta.env.VITE_DEBUG_AUTH === 'true';
  const debugLog = (message: string, data?: any) => {
    if (debugAuth) {
      console.log(`[Auth Debug] ${message}`, data);
    }
  };

  // Initialize auth listener
  onMounted(() => {
    initializeAuthListener();
    checkAuth();
  });

  function initializeAuthListener() {
    supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event, newSession?.user?.id);
      
      session.value = newSession;
      
      if (event === 'SIGNED_IN' && newSession) {
        await loadUserProfile(newSession.user.id);
      } else if (event === 'SIGNED_OUT') {
        user.value = null;
        session.value = null;
        error.value = null;
      }
    });
  }

  async function loadUserProfile(userId: string): Promise<void> {
    try {
      const { data, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Failed to load user profile:', profileError);
        throw profileError;
      }

      user.value = {
        id: data.id,
        email: session.value?.user?.email || '',
        name: data.name,
        user_role: data.role as UserRole,
        company_name: data.company_name,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (err) {
      console.error('Error loading user profile:', err);
      error.value = err instanceof Error ? err.message : 'Failed to load user profile';
    }
  }

  async function signIn(email: string, password: string): Promise<boolean> {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        throw signInError;
      }

      if (data.user) {
        await loadUserProfile(data.user.id);
        return true;
      }

      return false;
    } catch (err) {
      console.error('Sign in error:', err);
      error.value = err instanceof Error ? err.message : 'Sign in failed';
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function signUp(
    email: string,
    password: string,
    userData: { 
      name: string; 
      role?: UserRole; 
      company_name?: string;
    }
  ): Promise<boolean> {
    try {
      loading.value = true;
      error.value = null;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'owner',
            company_name: userData.company_name
          }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.user) {
        // Create user profile in database
        await createUserProfile(data.user.id, userData);
        return true;
      }

      return false;
    } catch (err) {
      console.error('Sign up error:', err);
      error.value = err instanceof Error ? err.message : 'Sign up failed';
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function createUserProfile(userId: string, userData: {
    name: string;
    role?: UserRole;
    company_name?: string;
  }): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          name: userData.name,
          role: userData.role || 'owner',
          company_name: userData.company_name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to create user profile:', error);
        throw error;
      }
    } catch (err) {
      console.error('Error creating user profile:', err);
      throw err;
    }
  }

  async function signOut(): Promise<boolean> {
    try {
      loading.value = true;
      error.value = null;

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        throw signOutError;
      }

      user.value = null;
      session.value = null;
      return true;
    } catch (err) {
      console.error('Sign out error:', err);
      error.value = err instanceof Error ? err.message : 'Sign out failed';
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function updateProfile(updates: Partial<User>): Promise<boolean> {
    try {
      if (!currentUserId.value) {
        throw new Error('No authenticated user');
      }

      loading.value = true;
      error.value = null;

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUserId.value);

      if (updateError) {
        throw updateError;
      }

      // Reload user profile
      await loadUserProfile(currentUserId.value);
      return true;
    } catch (err) {
      console.error('Update profile error:', err);
      error.value = err instanceof Error ? err.message : 'Profile update failed';
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function resetPassword(email: string): Promise<boolean> {
    try {
      loading.value = true;
      error.value = null;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (resetError) {
        throw resetError;
      }

      return true;
    } catch (err) {
      console.error('Password reset error:', err);
      error.value = err instanceof Error ? err.message : 'Password reset failed';
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function checkAuth(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        await loadUserProfile(session.user.id);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Auth check error:', err);
      return false;
    }
  }

  // Admin functions
  async function getAllUsers(): Promise<User[]> {
    try {
      // Only admins can access this
      if (user.value?.user_role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data.map(profile => ({
        id: profile.id,
        email: profile.email || '',
        name: profile.name,
        user_role: profile.role as UserRole,
        company_name: profile.company_name,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      }));
    } catch (err) {
      console.error('Failed to fetch users:', err);
      throw err;
    }
  }

  async function updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
    try {
      // Only admins can update user roles
      if (user.value?.user_role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      return true;
    } catch (err) {
      console.error('Failed to update user role:', err);
      throw err;
    }
  }

  return {
    // State
    user: computed(() => user.value),
    session: computed(() => session.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isAuthenticated,
    currentUserId,

    // Auth methods
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    checkAuth,

    // Admin methods
    getAllUsers,
    updateUserRole,

    // Utils
    loadUserProfile
  };
}