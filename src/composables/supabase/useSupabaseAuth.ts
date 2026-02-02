// src/composables/supabase/useSupabaseAuth.ts - Enhanced Production Version
import { ref, computed } from 'vue';
import { supabase } from '@/plugins/supabase';
import type { Session } from '@supabase/supabase-js';
import type { User, UserRole } from '@/types';

const __DEV__ = import.meta.env.DEV;

export function useSupabaseAuth() {
  const user = ref<User | null>(null);
  const session = ref<Session | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const initializing = ref(true);

  const isAuthenticated = computed(() => !!session.value && !!user.value);

  const currentUserId = computed(() => session.value?.user?.id || null);

  // Deduplication: track in-flight profile loads
  let profileLoadPromise: Promise<void> | null = null;
  let profileLoadedForUserId: string | null = null;

  // Declare timeout variable first
  let initializationTimeout: ReturnType<typeof setTimeout>;

  // Initialize auth listener immediately with better error handling
  initializeAuthListener();

  function initializeAuthListener() {
    try {
      // Set initializing to false immediately to prevent timeouts
      initializing.value = false;
      clearTimeout(initializationTimeout);
      
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        __DEV__ && console.log('[Auth Debug] Auth state changed:', { event, userId: newSession?.user?.id });
        
        try {
          if (event === 'INITIAL_SESSION') {
            session.value = newSession;
            if (newSession && !user.value) {
              await loadUserProfile(newSession.user.id);
            }
            // Already set initializing to false above
          } else if (event === 'SIGNED_IN' && newSession) {
            session.value = newSession;
            try {
              await loadUserProfile(newSession.user.id);
            } catch (profileError) {
              console.error('❌ Profile loading failed during SIGNED_IN:', profileError);
              // Don't throw here - let the sign in continue even if profile fails
            }
          } else if (event === 'SIGNED_OUT') {
            user.value = null;
            session.value = null;
            error.value = null;
            profileLoadedForUserId = null;
            __DEV__ && console.log('✅ User signed out');
          }
        } catch (err) {
          console.error('Auth state change error:', err);
          error.value = err instanceof Error ? err.message : 'Authentication error';
        }
      });
      
      // Immediate fallback: Check current session and set initializing to false
      supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        if (currentSession) {
          session.value = currentSession;
          loadUserProfile(currentSession.user.id).catch(err => {
            console.error('❌ Existing session profile loading failed:', err);
          });
        }
        // Ensure initializing is false regardless
        if (initializing.value) {
          initializing.value = false;
          clearTimeout(initializationTimeout);
        }
      }).catch(err => {
        console.error('❌ Session check failed:', err);
        // Ensure initializing is false even on error
        if (initializing.value) {
          initializing.value = false;
          clearTimeout(initializationTimeout);
        }
      });
      
    } catch (err) {
      console.error('❌ Failed to initialize auth listener:', err);
      // Fallback: set initializing to false if listener setup fails
      initializing.value = false;
      clearTimeout(initializationTimeout);
    }
  }

  async function loadUserProfile(userId: string): Promise<void> {
    // Skip if already loaded for this user
    if (profileLoadedForUserId === userId && user.value?.id === userId) {
      __DEV__ && console.log(`⏭️ Profile already loaded for ${userId}, skipping`);
      return;
    }

    // Deduplicate: reuse in-flight request
    if (profileLoadPromise) {
      __DEV__ && console.log(`⏭️ Profile load already in progress, reusing promise`);
      return profileLoadPromise;
    }

    profileLoadPromise = _doLoadUserProfile(userId);
    try {
      await profileLoadPromise;
    } finally {
      profileLoadPromise = null;
    }
  }

  function _buildFallbackProfile(userId: string): User {
    return {
      id: userId,
      email: session.value?.user?.email || '',
      name: session.value?.user?.user_metadata?.name || session.value?.user?.email?.split('@')[0] || 'User',
      role: (session.value?.user?.user_metadata?.role as UserRole) || 'owner',
      company_name: session.value?.user?.user_metadata?.company_name || '',
      notifications_enabled: true,
      timezone: 'America/Los_Angeles',
      theme: 'light',
      language: 'en',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  function _applyProfileData(data: any, userId: string) {
    user.value = {
      id: data.id,
      email: session.value?.user?.email || data.email || '',
      name: data.name,
      role: data.role as UserRole,
      company_name: data.company_name,
      notifications_enabled: data.notifications_enabled ?? true,
      timezone: data.timezone || 'America/Los_Angeles',
      theme: data.theme || 'light',
      language: data.language || 'en',
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    profileLoadedForUserId = userId;
  }

  async function _doLoadUserProfile(userId: string): Promise<void> {
    __DEV__ && console.log(`Loading user profile for: ${userId}`);

    // Start the real query — don't race/discard it
    const queryPromise = supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    // Set a fallback after 3s so the UI isn't blocked, but let the query continue
    let usedFallback = false;
    const fallbackTimer = setTimeout(() => {
      if (!profileLoadedForUserId || profileLoadedForUserId !== userId) {
        usedFallback = true;
        user.value = _buildFallbackProfile(userId);
        profileLoadedForUserId = userId;
        __DEV__ && console.log('Using fallback profile (query still pending)');
      }
    }, 3000);

    try {
      const { data, error: profileError } = await queryPromise;
      clearTimeout(fallbackTimer);

      if (profileError) {
        __DEV__ && console.warn('Profile query error:', profileError.message);
        // If we didn't set fallback yet, set it now
        if (!usedFallback) {
          user.value = _buildFallbackProfile(userId);
          profileLoadedForUserId = userId;
        }
        return;
      }

      if (data) {
        // Always apply real data, even if fallback was used — this upgrades the profile
        _applyProfileData(data, userId);
        __DEV__ && console.log('Profile loaded' + (usedFallback ? ' (upgraded from fallback)' : '') + ':', { email: user.value!.email, role: user.value!.role });
      } else if (!usedFallback) {
        // No data and no fallback yet
        user.value = _buildFallbackProfile(userId);
        profileLoadedForUserId = userId;
        __DEV__ && console.log('No profile found, using fallback');
      }
    } catch (err) {
      clearTimeout(fallbackTimer);
      console.error('Profile load failed:', err);
      if (!usedFallback) {
        user.value = _buildFallbackProfile(userId);
        profileLoadedForUserId = userId;
      }
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
        console.error('❌ Sign in error from Supabase:', signInError);
        throw signInError;
      }

      if (data.user && data.session) {
        // Auth state change handler will take care of loading profile
        return true;
      }

      return false;
    } catch (err) {
      console.error('❌ Sign in error:', err);
      error.value = err instanceof Error ? err.message : 'Sign in failed';
      return false;
    } finally {
      // Always set loading to false, with a small delay to ensure state updates
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
        // If user is immediately confirmed, the auth state change will handle profile loading
        // If not confirmed, they'll need to verify email first
        return true;
      }

      return false;
    } catch (err) {
      console.error('❌ Sign up error:', err);
      error.value = err instanceof Error ? err.message : 'Sign up failed';
      return false;
    } finally {
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
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession) {
        session.value = currentSession;
        if (!user.value) {
          await loadUserProfile(currentSession.user.id);
        }
      } else {
        // Clear any stale data
        if (user.value) {
          user.value = null;
        }
        if (session.value) {
          session.value = null;
        }
      }
    } catch (err) {
      console.error('❌ Auth check error:', err);
      error.value = err instanceof Error ? err.message : 'Auth check failed';
    } finally {
      // Always ensure initialization is complete after auth check
      if (initializing.value) {
        initializing.value = false;
        clearTimeout(initializationTimeout);
      }
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

  async function deleteUser(userId: string): Promise<boolean> {
    try {
      // Delete from user_profiles first (will cascade to other tables via foreign keys)
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        throw profileError;
      }

      // Delete from auth.users using admin API
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);

      if (authError) {
        console.warn('⚠️ Failed to delete auth user, but profile deleted:', authError);
        // Don't throw here since profile deletion succeeded
      }

      return true;
    } catch (err) {
      console.error('❌ Failed to delete user:', err);
      return false;
    }
  }

  async function createAdminUser(userData: {
    email: string;
    password: string;
    name: string;
    access_level?: string;
  }): Promise<boolean> {
    try {
      // Create auth user using admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true, // Auto-confirm for admin-created users
        user_metadata: {
          name: userData.name,
          role: 'admin'
        }
      });

      if (authError || !authData.user) {
        throw authError || new Error('Failed to create auth user');
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: userData.email,
          name: userData.name,
          role: 'admin' as UserRole,
          access_level: userData.access_level || 'full'
        });

      if (profileError) {
        // Try to clean up auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw profileError;
      }

      return true;
    } catch (err) {
      console.error('❌ Failed to create admin user:', err);
      return false;
    }
  }

  // Single timeout mechanism to prevent conflicts
  initializationTimeout = setTimeout(() => {
    if (initializing.value) {
      console.warn('⚠️ Auth initialization timeout - forcing completion');
      initializing.value = false;
      
      // Try to get current session as fallback
      supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        if (currentSession && !user.value) {
          loadUserProfile(currentSession.user.id).catch(err => {
            console.error('❌ Timeout fallback profile loading failed:', err);
          });
        }
      }).catch(err => {
        console.error('❌ Timeout fallback session check failed:', err);
      });
    }
  }, 1000);

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
    deleteUser,
    createAdminUser,
    loadUserProfile
  };
}
