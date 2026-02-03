# Supabase Integration Checklist

_A comprehensive, production-ready checklist for integrating Supabase with your role-based, multi-tenant property cleaning scheduler._

<!-- ---

## 1. Current Integration Status (Updated 2026-02-03)

### ✅ COMPLETED
- [x] **Pinia stores use Supabase directly**
  - [x] `booking.ts` - All CRUD operations call Supabase with optimistic updates
  - [x] `property.ts` - All CRUD operations call Supabase with optimistic 3updates
- [x] **Shared composables properly await store operations**
  - [x] `useBookings.ts` - Removed fake delays, properly awaits async store calls
  - [x] `useProperties.ts` - Removed fake delays, properly awaits async store calls
- [x] **Supabase composables available for direct use**
  - [x] `useSupabaseBookings.ts` - Standalone with real-time subscriptions
  - [x] `useSupabaseProperties.ts` - Standalone with real-time subscriptions
  - [x] `useSupabaseAuth.ts` - Authentication handling

---

## 2. Composables & Store Integration
- [ ] **Verify `useSupabaseAuth` composable**
  - [ ] Handles login, logout, session, and user profile
  - [ ] Correctly updates Pinia store in production
- [ ] **Check data composables (`useSupabaseBookings`, `useSupabaseProperties`)**
  - [ ] CRUD operations use Supabase client
  - [ ] Role-based data access patterns are followed
- [ ] **Ensure Pinia stores use composables in production**
  - [ ] Owner/admin stores fetch/update data via Supabase

---

## 3. Security: RLS Policies
- [x] **Review `/supabase/migrations/002_rls_policies.sql`**
  - [x] RLS enabled for all sensitive tables (user_profiles, properties, bookings)
  - [x] Policies enforce owner-only access for owners, full access for admin
  - [x] Cleaner policies restrict to assigned bookings only
- [x] **Test RLS policies**
  - [x] SQL test script created: `scripts/test-rls-policies.sql`
  - [ ] Run tests in Supabase SQL Editor
  - [ ] Confirm access is denied as expected

---

## 4. Local & Production Testing
- [x] **Integration test script created**
  - [x] Run: `pnpm test:supabase`
  - [ ] Tests pass with valid credentials
- [ ] **Run the app locally (`pnpm dev`)**
  - [ ] Register/login as owner and admin
  - [ ] Test booking/property CRUD for both roles
  - [ ] Verify role-based data visibility
- [x] **Error handling improved**
  - [x] Debug logging added to booking creation
  - [x] User-friendly error messages in UI

---

## 5. Deployment
- [x] **Deployment guide created**
  - [x] See `docs/supabase_migration/deployment-guide.md`
- [ ] **Apply Supabase migrations to production project**
  - [ ] Run: `pnpm db:push` (or `supabase db push`)
- [ ] **Deploy frontend (Vercel/Netlify/etc.)**
  - [ ] Set Supabase env vars in deployment settings
  - [ ] Verify production app connects to Supabase and enforces RLS

---

## 6. Documentation & Handover
- [x] **Document Supabase integration steps**
  - [x] Created `docs/supabase_migration/deployment-guide.md`
- [x] **Add troubleshooting tips for common Supabase issues**
  - [x] Auth errors, RLS denials, env var misconfigurations
  - [x] See `docs/supabase_migration/supabase-troubleshooting.md`

---

## Quick Commands

```bash
# Run Supabase integration tests
pnpm test:supabase

# Push migrations to production
pnpm db:push

# Check migration status
pnpm db:status

# Build for production
pnpm build
```

---

**Success Criteria:**
- [x] Code integration complete
- [x] RLS policies in place
- [x] Test scripts created
- [x] Documentation complete
- [ ] Manual testing passed
- [ ] Deployed to production