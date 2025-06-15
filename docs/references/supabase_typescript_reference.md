# REFERENCE FILE: Supabase + TypeScript Essential Reference

 ##  **This file is a reference guide showing code patterns and usage examples.** ##

## It is NOT meant to be imported or executed directly. ##

### ** When implementing Supabase Client Setup follow these patternsto maintain consistency with the application architecture. ** ###
```typescript
// utils/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

export type SupabaseClient = typeof supabase;
```

### **Database Types Generation**
```typescript
// types/supabase.ts - Generated from Supabase CLI
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'owner' | 'admin' | 'cleaner';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role: 'owner' | 'admin' | 'cleaner';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'owner' | 'admin' | 'cleaner';
          updated_at?: string;
        };
      };
      properties: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          address: string;
          cleaning_duration: number;
          special_instructions: string | null;
          active: boolean;
          pricing_tier: 'basic' | 'premium' | 'luxury';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          address: string;
          cleaning_duration: number;
          special_instructions?: string | null;
          active?: boolean;
          pricing_tier: 'basic' | 'premium' | 'luxury';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          address?: string;
          cleaning_duration?: number;
          special_instructions?: string | null;
          active?: boolean;
          pricing_tier?: 'basic' | 'premium' | 'luxury';
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          property_id: string;
          owner_id: string;
          checkout_date: string;
          checkin_date: string;
          booking_type: 'standard' | 'turn';
          guest_count: number | null;
          notes: string | null;
          cleaning_scheduled: boolean;
          status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
          assigned_cleaner_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          owner_id: string;
          checkout_date: string;
          checkin_date: string;
          booking_type: 'standard' | 'turn';
          guest_count?: number | null;
          notes?: string | null;
          cleaning_scheduled?: boolean;
          status?: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
          assigned_cleaner_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          owner_id?: string;
          checkout_date?: string;
          checkin_date?: string;
          booking_type?: 'standard' | 'turn';
          guest_count?: number | null;
          notes?: string | null;
          cleaning_scheduled?: boolean;
          status?: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
          assigned_cleaner_id?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: 'owner' | 'admin' | 'cleaner';
      booking_status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
      booking_type: 'standard' | 'turn';
      pricing_tier: 'basic' | 'premium' | 'luxury';
    };
  };
}

// Type helpers
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
```

## **Authentication Patterns**

### **Auth Composable**
```typescript
// composables/useAuth.ts
import { ref, computed, type Ref } from 'vue';
import { supabase } from '@/utils/supabase';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import type { User, Session } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

type UserProfile = Database['public']['Tables']['users']['Row'];

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials extends LoginCredentials {
  name: string;
  role: 'owner' | 'admin' | 'cleaner';
}

export const useAuth = () => {
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Initialize auth state
  const initializeAuth = async (): Promise<void> => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      if (session?.user) {
        authStore.setSession(session);
        await loadUserProfile(session.user.id);
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
      error.value = err instanceof Error ? err.message : 'Failed to initialize auth';
    }
  };

  // Load user profile from database
  const loadUserProfile = async (userId: string): Promise<void> => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      
      if (profile) {
        authStore.setUser(profile);
        userStore.setUser(profile);
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
      throw err;
    }
  };

  // Sign up new user
  const signup = async (credentials: SignupCredentials): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: credentials.email,
          name: credentials.name,
          role: credentials.role
        });

      if (profileError) throw profileError;

      // Set session if confirmed
      if (authData.session) {
        authStore.setSession(authData.session);
        await loadUserProfile(authData.user.id);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      error.value = errorMessage;
      authStore.setError(errorMessage);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Sign in user
  const signin = async (credentials: LoginCredentials): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (authError) throw authError;
      if (!data.session || !data.user) throw new Error('Authentication failed');

      authStore.setSession(data.session);
      await loadUserProfile(data.user.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signin failed';
      error.value = errorMessage;
      authStore.setError(errorMessage);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Sign out user
  const signout = async (): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const { error: signoutError } = await supabase.auth.signOut();
      if (signoutError) throw signoutError;

      authStore.clearAuth();
      userStore.clearAllData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signout failed';
      error.value = errorMessage;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (resetError) throw resetError;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed';
      error.value = errorMessage;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Listen for auth changes
  const setupAuthListener = (): void => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            authStore.setSession(session);
            await loadUserProfile(session.user.id);
          }
          break;
        case 'SIGNED_OUT':
          authStore.clearAuth();
          userStore.clearAllData();
          break;
        case 'TOKEN_REFRESHED':
          if (session) {
            authStore.setSession(session);
          }
          break;
      }
    });
  };

  return {
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    initializeAuth,
    signup,
    signin,
    signout,
    resetPassword,
    setupAuthListener
  };
};
```

## **CRUD Operations**

### **Properties CRUD**
```typescript
// composables/useProperties.ts
import { ref, computed } from 'vue';
import { supabase } from '@/utils/supabase';
import { useUserStore } from '@/stores/user';
import { useUIStore } from '@/stores/ui';
import type { Database } from '@/types/supabase';

type Property = Database['public']['Tables']['properties']['Row'];
type PropertyInsert = Database['public']['Tables']['properties']['Insert'];
type PropertyUpdate = Database['public']['Tables']['properties']['Update'];

export const useProperties = () => {
  const userStore = useUserStore();
  const uiStore = useUIStore();
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Fetch all properties for current user
  const fetchProperties = async (): Promise<void> => {
    if (!userStore.user?.id) {
      error.value = 'User not authenticated';
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', userStore.user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Update store with fetched properties
      userStore.houses.clear();
      data?.forEach(property => {
        userStore.addProperty(property);
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch properties';
      error.value = errorMessage;
      uiStore.setError('properties-fetch', errorMessage);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Create new property
  const createProperty = async (propertyData: Omit<PropertyInsert, 'owner_id'>): Promise<Property> => {
    if (!userStore.user?.id) {
      throw new Error('User not authenticated');
    }

    loading.value = true;
    error.value = null;

    try {
      const { data, error: createError } = await supabase
        .from('properties')
        .insert({
          ...propertyData,
          owner_id: userStore.user.id
        })
        .select()
        .single();

      if (createError) throw createError;
      if (!data) throw new Error('Property creation failed');

      // Update local store
      userStore.addProperty(data);

      uiStore.addNotification({
        type: 'success',
        title: 'Property Created',
        message: `${data.name} has been added successfully.`
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create property';
      error.value = errorMessage;
      uiStore.setError('property-create', errorMessage);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update property
  const updateProperty = async (id: string, updates: PropertyUpdate): Promise<Property> => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: updateError } = await supabase
        .from('properties')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      if (!data) throw new Error('Property update failed');

      // Update local store
      userStore.updateProperty(id, data);

      uiStore.addNotification({
        type: 'success',
        title: 'Property Updated',
        message: `${data.name} has been updated successfully.`
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update property';
      error.value = errorMessage;
      uiStore.setError('property-update', errorMessage);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Delete property
  const deleteProperty = async (id: string): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const { error: deleteError } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Update local store
      userStore.removeProperty(id);

      uiStore.addNotification({
        type: 'success',
        title: 'Property Deleted',
        message: 'Property has been deleted successfully.'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete property';
      error.value = errorMessage;
      uiStore.setError('property-delete', errorMessage);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    fetchProperties,
    createProperty,
    updateProperty,
    deleteProperty
  };
};
```

### **Bookings CRUD with Real-time**
```typescript
// composables/useBookings.ts
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { supabase } from '@/utils/supabase';
import { useUserStore } from '@/stores/user';
import { useUIStore } from '@/stores/ui';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

type Booking = Database['public']['Tables']['bookings']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type BookingUpdate = Database['public']['Tables']['bookings']['Update'];

export const useBookings = () => {
  const userStore = useUserStore();
  const uiStore = useUIStore();
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  let realtimeSubscription: any = null;

  // Fetch all bookings for current user
  const fetchBookings = async (): Promise<void> => {
    if (!userStore.user?.id) {
      error.value = 'User not authenticated';
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select(`
          *,
          properties:property_id (
            name,
            address
          )
        `)
        .eq('owner_id', userStore.user.id)
        .order('checkout_date', { ascending: true });

      if (fetchError) throw fetchError;

      // Update store with fetched bookings
      userStore.events.clear();
      data?.forEach(booking => {
        userStore.addEvent(booking);
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bookings';
      error.value = errorMessage;
      uiStore.setError('bookings-fetch', errorMessage);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Create new booking
  const createBooking = async (bookingData: Omit<BookingInsert, 'owner_id'>): Promise<Booking> => {
    if (!userStore.user?.id) {
      throw new Error('User not authenticated');
    }

    loading.value = true;
    error.value = null;

    try {
      const { data, error: createError } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          owner_id: userStore.user.id
        })
        .select()
        .single();

      if (createError) throw createError;
      if (!data) throw new Error('Booking creation failed');

      // Update local store
      userStore.addEvent(data);

      uiStore.addNotification({
        type: 'success',
        title: 'Booking Created',
        message: 'Your booking has been scheduled successfully.'
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create booking';
      error.value = errorMessage;
      uiStore.setError('booking-create', errorMessage);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update booking
  const updateBooking = async (id: string, updates: BookingUpdate): Promise<Booking> => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: updateError } = await supabase
        .from('bookings')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      if (!data) throw new Error('Booking update failed');

      // Update local store
      userStore.updateEvent(id, data);

      uiStore.addNotification({
        type: 'success',
        title: 'Booking Updated',
        message: 'Your booking has been updated successfully.'
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update booking';
      error.value = errorMessage;
      uiStore.setError('booking-update', errorMessage);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Delete booking
  const deleteBooking = async (id: string): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const { error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Update local store
      userStore.removeEvent(id);

      uiStore.addNotification({
        type: 'success',
        title: 'Booking Deleted',
        message: 'Booking has been cancelled successfully.'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete booking';
      error.value = errorMessage;
      uiStore.setError('booking-delete', errorMessage);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Setup real-time subscription
  const setupRealtimeSubscription = (): void => {
    if (!userStore.user?.id) return;

    realtimeSubscription = supabase
      .channel(`bookings:owner_id=eq.${userStore.user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `owner_id=eq.${userStore.user.id}`
        },
        (payload: RealtimePostgresChangesPayload<Booking>) => {
          console.log('Booking change received:', payload);
          
          switch (payload.eventType) {
            case 'INSERT':
              if (payload.new) {
                userStore.addEvent(payload.new);
                uiStore.addNotification({
                  type: 'info',
                  title: 'New Booking',
                  message: 'A new booking has been added.'
                });
              }
              break;
            case 'UPDATE':
              if (payload.new) {
                userStore.updateEvent(payload.new.id, payload.new);
                uiStore.addNotification({
                  type: 'info',
                  title: 'Booking Updated',
                  message: 'A booking has been updated.'
                });
              }
              break;
            case 'DELETE':
              if (payload.old) {
                userStore.removeEvent(payload.old.id);
                uiStore.addNotification({
                  type: 'info',
                  title: 'Booking Removed',
                  message: 'A booking has been removed.'
                });
              }
              break;
          }
        }
      )
      .subscribe();
  };

  // Cleanup real-time subscription
  const cleanupRealtimeSubscription = (): void => {
    if (realtimeSubscription) {
      supabase.removeChannel(realtimeSubscription);
      realtimeSubscription = null;
    }
  };

  // Setup/cleanup lifecycle
  onMounted(() => {
    setupRealtimeSubscription();
  });

  onUnmounted(() => {
    cleanupRealtimeSubscription();
  });

  return {
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    fetchBookings,
    createBooking,
    updateBooking,
    deleteBooking,
    setupRealtimeSubscription,
    cleanupRealtimeSubscription
  };
};
```

## **Row Level Security (RLS) Examples**

### **SQL Policies for Multi-tenant Security**
```sql
-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own profile
CREATE POLICY "Users can view own profile" 
ON users FOR ALL 
USING (auth.uid() = id);

-- Property owners can manage their properties
CREATE POLICY "Property owners can manage their properties" 
ON properties FOR ALL 
USING (auth.uid() = owner_id);

-- Admins can view all properties
CREATE POLICY "Admins can view all properties" 
ON properties FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Booking policies
CREATE POLICY "Users can manage their bookings" 
ON bookings FOR ALL 
USING (auth.uid() = owner_id);

-- Cleaners can view assigned bookings
CREATE POLICY "Cleaners can view assigned bookings" 
ON bookings FOR SELECT 
USING (
  auth.uid() = assigned_cleaner_id OR
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('admin', 'cleaner')
  )
);
```

## **Error Handling Patterns**

### **Supabase Error Handler**
```typescript
// utils/errorHandler.ts
import type { PostgrestError, AuthError } from '@supabase/supabase-js';

export interface SupabaseErrorDetails {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
  statusCode?: number;
}

export const handleSupabaseError = (error: PostgrestError | AuthError | Error): SupabaseErrorDetails => {
  // Handle Supabase-specific errors
  if ('code' in error && 'details' in error) {
    const pgError = error as PostgrestError;
    
    switch (pgError.code) {
      case 'PGRST116':
        return {
          message: 'Record not found',
          details: pgError.details,
          hint: 'The requested resource does not exist',
          code: pgError.code
        };
      case '23505':
        return {
          message: 'Duplicate entry',
          details: pgError.details,
          hint: 'A record with these details already exists',
          code: pgError.code
        };
      case '23503':
        return {
          message: 'Reference constraint violation',
          details: pgError.details,
          hint: 'Referenced record does not exist',
          code: pgError.code
        };
      default:
        return {
          message: pgError.message || 'Database error occurred',
          details: pgError.details,
          hint: pgError.hint,
          code: pgError.code
        };
    }
  }

  // Handle Auth errors
  if ('status' in error) {
    const authError = error as AuthError;
    return {
      message: authError.message || 'Authentication error',
      statusCode: authError.status
    };
  }

  // Handle generic errors
  return {
    message: error.message || 'Unknown error occurred'
  };
};

// Usage in composables
const handleError = (error: unknown): string => {
  const errorDetails = handleSupabaseError(error as Error);
  console.error('Supabase error:', errorDetails);
  return errorDetails.message;
};
```

This reference provides comprehensive TypeScript patterns for working with Supabase in your Vue 3 application, covering authentication, CRUD operations, real-time subscriptions, and proper error handling with type safety.