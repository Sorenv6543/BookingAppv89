# TASK-081 & TASK-082 Implementation Guide
## **Multi-Tenant Authentication & Real-Time Sync**

Based on your existing architecture, here's the systematic implementation plan for the next phase of your production-ready platform.

---

## 🎯 **TASK-081: Authentication & User Management** *(Week 1)*

### **Prerequisites Verification**
- ✅ Database schema and RLS policies already complete
- ✅ Auth composables and stores already built  
- ✅ Route guards infrastructure ready
- ✅ Auth pages (login, register, signup) implemented

### **Step 1: Supabase Environment Setup** *(30 minutes)*

```bash
# 1. Install Supabase CLI (if not installed)
npm install -g supabase

# 2. Initialize Supabase in your project directory
supabase start

# 3. Apply your existing migrations
supabase db reset

# 4. Verify setup
node scripts/verify-supabase-setup.cjs
```

### **Step 2: Environment Configuration** *(15 minutes)*

Create `.env.local` in your project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your_anon_key_from_supabase_start
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### **Step 3: Authentication Integration Updates** *(2-3 hours)*

#### **3A: Update Supabase Client Configuration**

Update `src/plugins/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
```

#### **3B: Enhance useSupabaseAuth.ts**

```typescript
// Add to src/composables/supabase/useSupabaseAuth.ts

// Add profile creation after signup
async function createUserProfile(userId: string, userData: {
  name: string;
  role: UserRole;
  company_name?: string;
}) {
  const { error } = await supabase
    .from('user_profiles')
    .insert({
      id: userId,
      name: userData.name,
      role: userData.role,
      company_name: userData.company_name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  
  if (error) throw error;
}

// Add session monitoring
function initializeAuthListener() {
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
      // Load user profile from database
      await loadUserProfile(session.user.id);
    } else if (event === 'SIGNED_OUT') {
      // Clear user state
      user.value = null;
      isAuthenticated.value = false;
    }
  });
}
```

#### **3C: Update Auth Store Integration**

Enhance `src/stores/auth.ts`:

```typescript
// Replace existing methods with Supabase integration

async function login(email: string, password: string): Promise<boolean> {
  try {
    loading.value = true;
    error.value = null;
    
    const { signIn } = useSupabaseAuth();
    const success = await signIn(email, password);
    
    if (success) {
      isAuthenticated.value = true;
      return true;
    }
    return false;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Login failed';
    return false;
  } finally {
    loading.value = false;
  }
}

async function register(userData: RegisterData): Promise<boolean> {
  try {
    loading.value = true;
    error.value = null;
    
    const { signUp } = useSupabaseAuth();
    const success = await signUp(userData.email, userData.password, {
      name: userData.name,
      role: userData.role,
      company_name: userData.company_name
    });
    
    if (success) {
      // User will need to verify email before they can login
      return true;
    }
    return false;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Registration failed';
    return false;
  } finally {
    loading.value = false;
  }
}
```

### **Step 4: Enhanced Route Guards** *(1 hour)*

Update `src/router/guards.ts`:

```typescript
export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();
  
  // Check if user is authenticated with Supabase
  const { isAuthenticated, checkAuth } = useSupabaseAuth();
  
  // Verify authentication status
  await checkAuth();
  
  if (!isAuthenticated.value) {
    next('/auth/login');
    return;
  }
  
  // Role-based route protection
  const requiredRole = to.meta.role as UserRole;
  if (requiredRole && authStore.user?.user_role !== requiredRole) {
    // Redirect to appropriate dashboard
    const defaultRoute = getDefaultRouteForRole(authStore.user?.user_role);
    next(defaultRoute);
    return;
  }
  
  next();
}
```

### **Step 5: User Profile Management Interface** *(2 hours)*

#### **5A: Create User Profile Component**

```vue
<!-- src/components/dumb/shared/UserProfileForm.vue -->
<template>
  <v-card>
    <v-card-title>User Profile</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="handleSubmit">
        <v-text-field
          v-model="form.name"
          label="Full Name"
          :rules="nameRules"
          required
        />
        
        <v-text-field
          v-model="form.email"
          label="Email"
          type="email"
          disabled
        />
        
        <v-select
          v-model="form.role"
          :items="roleOptions"
          label="Role"
          :disabled="!canEditRole"
        />
        
        <v-text-field
          v-if="form.role === 'owner'"
          v-model="form.company_name"
          label="Company Name"
        />
        
        <v-card-actions>
          <v-btn type="submit" color="primary" :loading="loading">
            Update Profile
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useSupabaseAuth } from '@/composables/supabase/useSupabaseAuth';
import type { UserRole } from '@/types';

// Component logic for profile management
</script>
```

#### **5B: Create Admin User Management**

```vue
<!-- src/components/smart/admin/AdminUserManagement.vue -->
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>User Management</h2>
        
        <!-- User List -->
        <v-data-table
          :headers="headers"
          :items="users"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn icon @click="editUser(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="deactivateUser(item)" color="error">
              <v-icon>mdi-account-remove</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Admin user management logic
</script>
```

### **Step 6: Testing & Verification** *(1 hour)*

```bash
# Test authentication flow
npm run dev

# Test cases:
# 1. User registration with role assignment
# 2. Email verification flow
# 3. Login with role-based routing
# 4. Owner data isolation (only see their properties/bookings)
# 5. Admin system-wide access (see all data)
# 6. Profile management
# 7. Admin user management
```

---

## 🔄 **TASK-082: Real-Time Data Synchronization** *(Week 2)*

### **Step 1: Real-Time Subscriptions** *(2-3 hours)*

#### **1A: Create Real-Time Composables**

```typescript
// src/composables/supabase/useRealtimeBookings.ts
import { ref, onMounted, onUnmounted } from 'vue';
import { supabase } from '@/plugins/supabase';
import { useBookingStore } from '@/stores/booking';

export function useRealtimeBookings() {
  const bookingStore = useBookingStore();
  let subscription: any = null;
  
  const startRealtimeSubscription = () => {
    subscription = supabase
      .channel('public:bookings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          handleBookingChange(payload);
        }
      )
      .subscribe();
  };
  
  const handleBookingChange = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    switch (eventType) {
      case 'INSERT':
        bookingStore.addBooking(newRecord);
        break;
      case 'UPDATE':
        bookingStore.updateBooking(newRecord.id, newRecord);
        break;
      case 'DELETE':
        bookingStore.removeBooking(oldRecord.id);
        break;
    }
  };
  
  const stopRealtimeSubscription = () => {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  };
  
  onMounted(() => {
    startRealtimeSubscription();
  });
  
  onUnmounted(() => {
    stopRealtimeSubscription();
  });
  
  return {
    startRealtimeSubscription,
    stopRealtimeSubscription
  };
}
```

#### **1B: Update Store with Database Operations**

```typescript
// src/stores/booking.ts - Replace frontend-only operations

async function addBooking(booking: Booking) {
  try {
    // Optimistic update
    bookings.value.set(booking.id, booking);
    
    // Database insert
    const { error } = await supabase
      .from('bookings')
      .insert(booking);
    
    if (error) {
      // Rollback optimistic update
      bookings.value.delete(booking.id);
      throw error;
    }
  } catch (error) {
    console.error('Failed to add booking:', error);
    throw error;
  }
}

async function updateBooking(id: string, updates: Partial<Booking>) {
  try {
    const existing = bookings.value.get(id);
    if (!existing) throw new Error('Booking not found');
    
    // Optimistic update
    const updated = { ...existing, ...updates };
    bookings.value.set(id, updated);
    
    // Database update
    const { error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      // Rollback optimistic update
      bookings.value.set(id, existing);
      throw error;
    }
  } catch (error) {
    console.error('Failed to update booking:', error);
    throw error;
  }
}
```

### **Step 2: Optimistic Updates & Conflict Resolution** *(1-2 hours)*

```typescript
// src/composables/shared/useOptimisticUpdates.ts
export function useOptimisticUpdates() {
  const pendingOperations = ref(new Map());
  
  async function executeWithOptimism<T>(
    optimisticUpdate: () => void,
    operation: () => Promise<T>,
    rollback: () => void
  ): Promise<T> {
    try {
      // Apply optimistic update immediately
      optimisticUpdate();
      
      // Execute actual operation
      const result = await operation();
      return result;
    } catch (error) {
      // Rollback on failure
      rollback();
      throw error;
    }
  }
  
  return {
    executeWithOptimism
  };
}
```

### **Step 3: Offline/Online Sync** *(1 hour)*

```typescript
// src/composables/shared/useOfflineSync.ts
export function useOfflineSync() {
  const isOnline = ref(navigator.onLine);
  const pendingOperations = ref([]);
  
  const syncPendingOperations = async () => {
    for (const operation of pendingOperations.value) {
      try {
        await operation.execute();
        // Remove successful operation
        pendingOperations.value = pendingOperations.value.filter(
          op => op.id !== operation.id
        );
      } catch (error) {
        console.error('Sync failed for operation:', operation.id, error);
      }
    }
  };
  
  // Monitor online status
  window.addEventListener('online', () => {
    isOnline.value = true;
    syncPendingOperations();
  });
  
  window.addEventListener('offline', () => {
    isOnline.value = false;
  });
  
  return {
    isOnline,
    pendingOperations,
    syncPendingOperations
  };
}
```

---

## 🎯 **Success Criteria**

### **TASK-081 Completion:**
- ✅ Users can register with proper role assignment
- ✅ Email verification flow works
- ✅ Role-based routing with real database authentication  
- ✅ Owners see only their data (database-level RLS security)
- ✅ Admins see all data across all tenants
- ✅ User profile management interface
- ✅ Admin user management dashboard

### **TASK-082 Completion:**
- ✅ Real-time updates across all interfaces
- ✅ Optimistic updates for better UX
- ✅ Conflict resolution for concurrent edits
- ✅ Offline/online sync capabilities
- ✅ Performance maintains 67% efficiency gains

---

## 📚 **Next Steps After Implementation**

1. **Security Audit**: Verify RLS policies prevent cross-tenant data access
2. **Performance Testing**: Test with 30-40 concurrent users
3. **User Acceptance Testing**: Test both owner and admin workflows
4. **Production Deployment**: Deploy to staging environment
5. **Phase 3 Planning**: Cleaner management system (TASK-090)

---

**🚀 Ready to transform your platform from frontend-only filtering to production-grade multi-tenant security!**