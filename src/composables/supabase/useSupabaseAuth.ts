import { ref, computed, onMounted } from 'vue';
import { supabase } from '@/plugins/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import type { User, UserRole } from '@/types';

/**
 * Supabase authentication integration
 * Connects Supabase Auth with existing role-based system
 * 
 * Key Features:
 * - Automatic user profile creation on signup
 * - Role-based authentication (owner/admin/cleaner)
 * - Session management and persistence
 * - Integration with existing User type
 */
export function useSupabaseAuth() {
  // State
  const user = ref<User | null>(null);
  const session = ref<Session | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  // Computed properties
  const isAuthenticated = computed(() => !!user.value);
  const userRole = computed(() => user.value?.role || null);
  const isOwner = computed(() => userRole.value === 'owner');
  const isAdmin = computed(() => userRole.value === 'admin');
  const isCleaner = computed(() => userRole.value === 'cleaner');
  
  // AUTH OPERATIONS
  
  /**
   * Sign in with email and password
   */
  async function signIn(email: string, password: string): Promise<boolean> {
    loading.value = true;
    error.value = null;
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) throw signInError;
      
      if (data.user) {
        await loadUserProfile(data.user);
        return true;
      }
      
      return false;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to sign in';
      console.error('Supabase sign in error:', err);
      return false;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Sign up with email, password, and user data
   */
  async function signUp(
    email: string, 
    password: string, 
    userData: { name: string; role?: UserRole; company_name?: string }
  ): Promise<boolean> {
    loading.value = true;
    error.value = null;
    
    try {
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
      
      if (signUpError) throw signUpError;
      
      // User profile will be auto-created by database trigger
      if (data.user) {
        await loadUserProfile(data.user);
        return true;
      }
      
      return false;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to sign up';
      console.error('Supabase sign up error:', err);
      return false;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Sign out
   */
  async function signOut(): Promise<boolean> {
    loading.value = true;
    error.value = null;
    
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) throw signOutError;
      
      user.value = null;
      session.value = null;
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to sign out';
      console.error('Supabase sign out error:', err);
      return false;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Load user profile from database
   */
  async function loadUserProfile(supabaseUser: SupabaseUser): Promise<void> {
    try {
      const { data, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();
      
      if (profileError) {
        console.error('Failed to load user profile:', profileError);
        return;
      }
      
      // Transform to match existing User type
      user.value = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        company_name: data.company_name,
        notifications_enabled: data.notifications_enabled,
        timezone: data.timezone,
        theme: data.theme,
        language: data.language,
        access_level: data.access_level,
        skills: data.skills,
        max_daily_bookings: data.max_daily_bookings,
        location_lat: data.location_lat,
        location_lng: data.location_lng,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (err) {
      console.error('Error loading user profile:', err);
    }
  }
  
  /**
   * Update user profile
   */
  async function updateProfile(updates: Partial<User>): Promise<boolean> {
    if (!user.value) return false;
    
    loading.value = true;
    error.value = null;
    
    try {
      const { data, error: updateError } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.value.id)
        .select()
        .single();
      
      if (updateError) throw updateError;
      
      // Update local user state
      if (data) {
        user.value = { ...user.value, ...data };
      }
      
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update profile';
      console.error('Supabase profile update error:', err);
      return false;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Reset password
   */
  async function resetPassword(email: string): Promise<boolean> {
    loading.value = true;
    error.value = null;
    
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      
      if (resetError) throw resetError;
      
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to send reset email';
      console.error('Supabase password reset error:', err);
      return false;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Initialize auth state and listen for changes
   */
  async function initializeAuth(): Promise<void> {
    try {
      // Get initial session
      const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        return;
      }
      
      session.value = initialSession;
      
      if (initialSession?.user) {
        await loadUserProfile(initialSession.user);
      }
      
      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.id);
        
        session.value = newSession;
        
        if (newSession?.user) {
          await loadUserProfile(newSession.user);
        } else {
          user.value = null;
        }
      });
    } catch (err) {
      console.error('Auth initialization error:', err);
    }
  }
  
  /**
   * Check if user has specific permission (for role-based access)
   */
  function hasPermission(permission: string): boolean {
    if (!user.value) return false;
    
    // Admin has all permissions
    if (user.value.role === 'admin') return true;
    
    // Define role-based permissions
    const permissions = {
      owner: [
        'view_own_properties',
        'create_own_bookings',
        'edit_own_bookings',
        'delete_own_bookings'
      ],
      cleaner: [
        'view_assigned_bookings',
        'update_booking_status'
      ],
      admin: ['*'] // All permissions
    };
    
    const userPermissions = permissions[user.value.role as keyof typeof permissions] || [];
    return userPermissions.includes(permission) || userPermissions.includes('*');
  }
  
  // Initialize auth on mount
  onMounted(() => {
    initializeAuth();
  });
  
  return {
    // State
    user: computed(() => user.value),
    session: computed(() => session.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    
    // Computed properties
    isAuthenticated,
    userRole,
    isOwner,
    isAdmin,
    isCleaner,
    
    // Operations
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    loadUserProfile,
    hasPermission,
    
    // Utils
    initializeAuth
  };
} 