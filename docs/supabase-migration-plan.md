# **Supabase Migration Plan - TASK-080**
## **From Frontend Filtering to Database-Level Security**

---

## **📋 MIGRATION OVERVIEW**

This document outlines the transition from the current **frontend-only filtering** system to **Supabase with Row Level Security (RLS)** for true multi-tenant database security.

### **Current State (Frontend Filtering)**
```typescript
// CURRENT: Frontend filtering provides NO real security
const myBookings = computed(() => 
  bookingStore.bookings.filter(b => b.owner_id === currentUser.id)
);
// ❌ All data is still accessible - just hidden in UI
```

### **Target State (Database RLS)**
```sql
-- TARGET: Database enforces access at row level
CREATE POLICY "Owners see their bookings, admins see all"
ON public.bookings FOR SELECT TO authenticated
USING (
  (private.is_owner() AND owner_id = auth.uid()) OR
  private.is_admin()
);
-- ✅ Database blocks unauthorized access completely
```

---

## **🎯 MIGRATION OBJECTIVES**

### **Phase 2A: Foundation Setup**
- [ ] **Database Schema**: Multi-tenant schema with proper relationships
- [ ]**RLS Policies**: Owner data isolation + Admin system access  
- [ ] **Migration Scripts**: Automated transition from frontend stores


### **Phase 2B: Real-Time Integration**
- 🔄 **Composable Migration**: Replace Pinia stores with Supabase client
- 🔄 **Real-Time Subscriptions**: Replace reactive computed with database subscriptions
- 🔄 **Authentication**: Integrate Supabase Auth with current role system

### **Phase 2C: Production Deployment**

- 🔄 **Performance Testing**: Validate RLS policy performance
- 🔄 **Security Audit**: Verify multi-tenant isolation works correctly

---

## **🗂️ DATABASE SCHEMA MAPPING**

### **Current TypeScript → Supabase Tables**

| **Current Type** | **Supabase Table** | **Key Changes** |
|------------------|--------------------|-----------------| 
| `User` | `auth.users` + `public.user_profiles` | Split auth vs profile data |
| `Property` | `public.properties` | Add RLS on `owner_id` |
| `Booking` | `public.bookings` | Add RLS on `owner_id` |

### **Critical RLS Fields**
```sql
-- These fields are CRITICAL for multi-tenant security
public.properties.owner_id  -- Filters properties by owner
public.bookings.owner_id    -- Filters bookings by owner  
public.user_profiles.role   -- Determines access level (owner/admin)
```

---

## **🔐 SECURITY MODEL TRANSITION**

### **Before: Frontend Filtering (Insecure)**
```typescript
// useOwnerBookings.ts - CURRENT
const myBookings = computed(() => {
  return Array.from(bookingStore.bookings.values())
    .filter(booking => booking.owner_id === currentUserId.value);
});
// Problem: All data downloaded to client, just filtered in UI
```

### **After: Database RLS (Secure)**
```typescript
// useOwnerBookings.ts - FUTURE
const { data: myBookings } = await supabase
  .from('bookings')
  .select('*');
// Database automatically applies RLS - only owner's data returned
```

### **RLS Policy Examples**

#### **Owner Data Isolation**
```sql
-- Owners can only see their own bookings
CREATE POLICY "Owners see their bookings" ON bookings FOR SELECT
TO authenticated USING (owner_id = auth.uid());
```

#### **Admin System Access**
```sql
-- Admins can see ALL bookings (no filtering)
CREATE POLICY "Admins see all bookings" ON bookings FOR SELECT  
TO authenticated USING (private.is_admin());
```

---

## **📱 COMPOSABLE MIGRATION STRATEGY**

### **Migration Pattern: Gradual Replacement**

#### **Step 1: Create Supabase Composables**
```typescript
// composables/supabase/useSupabaseBookings.ts
export function useSupabaseBookings() {
  const supabase = useSupabaseClient();
  
  // Replace frontend filtering with database queries
  const fetchOwnerBookings = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('*');
    // RLS automatically filters to owner's data
    return data;
  };
  
  return { fetchOwnerBookings };
}
```

#### **Step 2: Update Existing Composables**
```typescript
// composables/owner/useOwnerBookings.ts - UPDATED
export function useOwnerBookings() {
  const supabaseBookings = useSupabaseBookings();
  
  // Gradually replace store access with Supabase
  const myBookings = ref<Booking[]>([]);
  
  const fetchMyBookings = async () => {
    myBookings.value = await supabaseBookings.fetchOwnerBookings();
  };
  
  return { myBookings, fetchMyBookings };
}
```

#### **Step 3: Real-Time Subscriptions**
```typescript
// Replace computed properties with real-time subscriptions
export function useOwnerBookings() {
  const myBookings = ref<Booking[]>([]);
  
  onMounted(() => {
    // Real-time subscription with RLS
    supabase
      .channel('booking-changes')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'bookings' },
          (payload) => {
            // RLS ensures only owner's data comes through
            updateLocalState(payload);
          }
      )
      .subscribe();
  });
}
```

---

## **🛠️ IMPLEMENTATION PHASES**

### **Phase 1: Local Development Setup** (Week 1)

#### **1.1 Initialize Supabase Project**
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize local development
supabase init
supabase start
```

#### **1.2 Run Database Migrations**
```bash
# Apply schema and RLS policies
supabase db reset
# Files: supabase/migrations/001_initial_schema.sql
#        supabase/migrations/002_rls_policies.sql
```

#### **1.3 Configure Environment**
```env
# .env.local
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

### **Phase 2: Authentication Integration** (Week 2)

#### **2.1 Setup Supabase Auth**
```typescript
// plugins/supabase.ts - UPDATE
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default supabase;
```

#### **2.2 Migrate Auth Store**
```typescript
// stores/auth.ts - UPDATE to use Supabase Auth
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email, password
    });
    
    if (data.user) {
      // Create/update user profile with role
      await createUserProfile(data.user);
    }
  };
});
```

### **Phase 3: Data Layer Migration** (Week 3)

#### **3.1 Replace Pinia Stores**
- ✅ **Keep Interface**: Maintain same composable APIs
- 🔄 **Replace Implementation**: Supabase client instead of Pinia
- 🔄 **Add Real-Time**: Database subscriptions replace computed

#### **3.2 Migration Order**
1. **User Profiles** (simplest) → Test RLS
2. **Properties** (medium) → Test owner filtering  
3. **Bookings** (complex) → Test cross-table relationships

### **Phase 4: Testing & Validation** (Week 4)

#### **4.1 RLS Testing**
```typescript
// tests/rls-validation.spec.ts
describe('RLS Security', () => {
  it('should isolate owner data', async () => {
    // Login as owner1
    await signInAsOwner1();
    const bookings = await fetchBookings();
    
    // Should only see owner1 bookings
    expect(bookings.every(b => b.owner_id === owner1.id)).toBe(true);
  });
  
  it('should allow admin access to all data', async () => {
    await signInAsAdmin();
    const bookings = await fetchBookings();
    
    // Should see all bookings
    expect(bookings.length).toBeGreaterThan(owner1Bookings.length);
  });
});
```

---

## **⚡ PERFORMANCE CONSIDERATIONS**

### **RLS Policy Optimization**

#### **1. Critical Indexes** (Already Created)
```sql
-- Ensure these indexes exist for RLS performance
CREATE INDEX idx_properties_owner_id ON properties(owner_id);
CREATE INDEX idx_bookings_owner_id ON bookings(owner_id);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
```

#### **2. Function Caching**
```sql
-- Use SELECT to cache auth.uid() per query
USING ((SELECT auth.uid()) = owner_id)
-- Instead of: auth.uid() = owner_id (called per row)
```

#### **3. Security Definer Functions**
```sql
-- Avoid RLS recursion with security definer
CREATE FUNCTION private.is_admin() 
RETURNS BOOLEAN LANGUAGE SQL SECURITY DEFINER
AS $$ SELECT role = 'admin' FROM user_profiles WHERE id = auth.uid(); $$;
```

### **Real-Time Subscription Limits**
```typescript
// Limit subscription scope for performance
supabase
  .channel('owner-bookings')
  .on('postgres_changes', {
    event: '*',
    schema: 'public', 
    table: 'bookings',
    filter: `owner_id=eq.${userId}` // Server-side filtering
  });
```

---

## **🔄 ROLLBACK STRATEGY**

### **Safe Migration Approach**
1. **Parallel Systems**: Run both Pinia and Supabase simultaneously
2. **Feature Flags**: Enable Supabase per feature/user gradually
3. **Data Sync**: Keep both systems in sync during transition
4. **Quick Rollback**: Environment variable switches back to Pinia

### **Rollback Triggers**
- Performance degradation > 20%
- RLS policy bugs allowing data leaks
- Real-time subscription failures
- Authentication integration issues

---

## **📊 SUCCESS METRICS**

### **Security Validation**
- ✅ **Owner Isolation**: Users can only access their own data
- ✅ **Admin Access**: Admins can access all system data
- ✅ **Cross-Tenant Protection**: No data leakage between owners
- ✅ **Authentication Integration**: Role-based access works

### **Performance Benchmarks**
- 🎯 **Query Performance**: RLS queries ≤ 100ms for typical data sets
- 🎯 **Real-Time Latency**: Updates appear ≤ 200ms across clients
- 🎯 **Memory Usage**: Reduction due to server-side filtering
- 🎯 **Bundle Size**: Potential reduction by removing Pinia

### **Development Experience**
- ✅ **API Compatibility**: Existing composables work unchanged
- ✅ **Type Safety**: Full TypeScript support maintained
- ✅ **Test Coverage**: All RLS policies covered by tests
- ✅ **Documentation**: Complete migration and security docs

---

## **🚀 DEPLOYMENT CHECKLIST**

### **Pre-Deployment**
- [ ] Local Supabase development working
- [ ] All RLS policies tested and validated
- [ ] Authentication flow integrated
- [ ] Real-time subscriptions functional
- [ ] Performance benchmarks met
- [ ] Security audit completed

### **Production Setup**
- [ ] Supabase production project created
- [ ] DNS and SSL certificates configured
- [ ] Database migrations applied
- [ ] Environment variables updated
- [ ] Monitoring and logging configured
- [ ] Backup strategy implemented

### **Go-Live**
- [ ] Blue-green deployment ready
- [ ] Data migration scripts tested
- [ ] Rollback plan prepared
- [ ] Team trained on new system
- [ ] Documentation updated
- [ ] Post-deployment monitoring active

---

## **📚 RESOURCES**

### **Supabase Documentation**
- [Row Level Security Guide](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)
- [Multi-tenant Apps](https://supabase.com/docs/guides/auth/row-level-security)

### **Project Files**
- `supabase/migrations/001_initial_schema.sql` - Database schema
- `supabase/migrations/002_rls_policies.sql` - Security policies
- `docs/supabase-migration-plan.md` - This document

### **Next Steps**
1. Review and approve this migration plan
2. Set up local Supabase development environment
3. Begin Phase 1: Authentication integration
4. Implement gradual composable migration
5. Complete security testing and validation

---

**🎯 GOAL: Transform from frontend filtering to database-level multi-tenant security while maintaining the same user experience and API interfaces.** 