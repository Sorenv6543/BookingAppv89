// src/composables/supabase/useSupabaseAuth.ts - Fixed Version
import { ref, computed, onMounted } from 'vue';
import { supabase } from '@/plugins/supabase';
import type { Session } from '@supabase/supabase-js';
import type { User, UserRole } from '@/types';

export function useSupabaseAuth() {
  const user = ref<User | null>(null);
  const session = ref<Session | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const initializing = ref(true);

  const isAuthenticated = computed(() => {
    const authenticated = !!session.value && !!user.value;
    console.log('[Auth Debug] isAuthenticated check:', { 
      session: !!session.value, 
      user: !!user.value, 
      authenticated,
      userRole: user.value?.role 
    });
    return authenticated;
  });
  
  const currentUserId = computed(() => session.value?.user?.id);

  // Initialize auth listener immediately
  initializeAuthListener();

  function initializeAuthListener() {
    supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('[Auth Debug] Auth state changed:', { event, userId: newSession?.user?.id });
      
      try {
        if (event === 'INITIAL_SESSION') {
          session.value = newSession;
          if (newSession) {
            await loadUserProfile(newSession.user.id);
          }
          initializing.value = false;
        } else if (event === 'SIGNED_IN' && newSession) {
          session.value = newSession;
          await loadUserProfile(newSession.user.id);
          console.log('✅ User signed in successfully:', { 
            email: newSession.user.email, 
            userRole: user.value?.role 
          });
        } else if (event === 'SIGNED_OUT') {
          user.value = null;
          session.value = null;
          error.value = null;
          console.log('✅ User signed out');
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        error.value = err instanceof Error ? err.message : 'Authentication error';
        // Don't let errors prevent initialization from completing
        if (event === 'INITIAL_SESSION') {
          initializing.value = false;
        }
      }
    });
  }

  async function loadUserProfile(userId: string): Promise<void> {
    try {
      console.log('🔍 Loading user profile for:', userId);
      
      const { data, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Failed to load user profile:', profileError);
        throw profileError;
      }

      if (data) {
        user.value = {
          id: data.id,
          email: session.value?.user?.email || data.email || '',
          name: data.name,
          role: data.role as UserRole,
          company_name: data.company_name,
          notifications_enabled: data.notifications_enabled ?? true,
          timezone: data.timezone || 'America/New_York',
          theme: data.theme || 'light',
          language: data.language || 'en',
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        console.log('✅ User profile loaded:', { email: user.value.email, role: user.value.role });
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
      error.value = err instanceof Error ? err.message : 'Failed to load user profile';
      throw err;
    }
  }

  async function signIn(email: string, password: string): Promise<boolean> {
    try {
      loading.value = true;
      error.value = null;
      console.log('🔐 Attempting sign in for:', email);

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        throw signInError;
      }

      if (data.user && data.session) {
        // Auth state change handler will take care of loading profile
        console.log('✅ Sign in successful, waiting for profile load...');
        return true;
      }

      return false;
    } catch (err) {
      console.error('❌ Sign in error:', err);
      error.value = err instanceof Error ? err.message : 'Sign in failed';
      return false;
    } finally {
      // CRITICAL: Always set loading to false, with a small delay to ensure state updates
      setTimeout(() => {
        loading.value = false;
      }, 100);
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
      console.log('📝 Registering new user:', email, 'as', userData.role || 'owner');

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
        console.log('✅ User registered successfully:', data.user.email);
        
        // If user is immediately confirmed, the auth state change will handle profile loading
        // If not confirmed, they'll need to verify email first
        if (data.user.email_confirmed_at) {
          return true;
        } else {
          console.log('📧 Email verification required');
          return true; // Still successful registration
        }
      }

      return false;
    } catch (err) {
      console.error('❌ Sign up error:', err);
      error.value = err instanceof Error ? err.message : 'Sign up failed';
      return false;
    } finally {
      // CRITICAL: Always set loading to false
      setTimeout(() => {
        loading.value = false;
      }, 100);
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

      // Auth state change handler will clear user state
      return true;
    } catch (err) {
      console.error('❌ Sign out error:', err);
      error.value = err instanceof Error ? err.message : 'Sign out failed';
      return false;
    } finally {
      setTimeout(() => {
        loading.value = false;
      }, 100);
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
      console.error('❌ Update profile error:', err);
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
      console.error('❌ Password reset error:', err);
      error.value = err instanceof Error ? err.message : 'Password reset failed';
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function checkAuth(): Promise<void> {
    try {
      console.log('🔍 Checking current auth state...');
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession) {
        session.value = currentSession;
        if (!user.value) {
          await loadUserProfile(currentSession.user.id);
        }
        console.log('✅ Auth check complete - user authenticated');
      } else {
        console.log('ℹ️ Auth check complete - no active session');
      }
    } catch (err) {
      console.error('❌ Auth check error:', err);
      error.value = err instanceof Error ? err.message : 'Auth check failed';
    } finally {
      initializing.value = false;
    }
  }

  // Admin functions
  async function getAllUsers(): Promise<User[]> {
    try {
      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      return data || [];
    } catch (err) {
      console.error('❌ Failed to fetch users:', err);
      throw err;
    }
  }

  async function updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
    try {
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      return true;
    } catch (err) {
      console.error('❌ Failed to update user role:', err);
      return false;
    }
  }

  // Initialize on creation
  onMounted(() => {
    checkAuth();
  });

  return {
    // State
    user,
    session,
    loading,
    error,
    initializing,
    
    // Computed
    isAuthenticated,
    currentUserId,
    
    // Methods
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    checkAuth,
    getAllUsers,
    updateUserRole,
    loadUserProfile
  };
}
