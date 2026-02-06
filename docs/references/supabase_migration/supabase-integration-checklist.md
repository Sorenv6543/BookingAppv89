# Supabase Integration Checklist

_A comprehensive, production-ready checklist for integrating Supabase with your role-based, multi-tenant property cleaning scheduler._

## 1. Current Integration Status (Updated 2026-02-03)

### ✅ COMPLETED
- [] **Pinia stores use Supabase directly**
  - [] `booking.ts` - All CRUD operations call Supabase with optimistic updates
  - [] `property.ts` - All CRUD operations call Supabase with optimistic updates
- [] **Shared composables properly await store operations**
  - [] `useBookings.ts` - Removed fake delays, properly awaits async store calls
  - [] `useProperties.ts` - Removed fake delays, properly awaits async store calls
- [] **Supabase composables available for direct use**
  - [] `useSupabaseBookings.ts` - Standalone with real-time subscriptions
  - [] `useSupabaseProperties.ts` - Standalone with real-time subscriptions
  - [] `useSupabaseAuth.ts` - Authentication handling

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
- [] **Review `/supabase/migrations/002_rls_policies.sql`**
  - [] RLS enabled for all sensitive tables (user_profiles, properties, bookings)
  - [] Policies enforce owner-only access for owners, full access for admin
  - [] Cleaner policies restrict to assigned bookings only
- [] **Test RLS policies**
  - [] SQL test script created: `scripts/test-rls-policies.sql`
  - [ ] Run tests in Supabase SQL Editor
  - [ ] Confirm access is denied as expected

---

## 4. Local & Production Testing
- [] **Integration test script created**
  - [] Run: `pnpm test:supabase`
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
- [] **Deployment guide created**
  - [] See `docs/supabase_migration/deployment-guide.md`
- [ ] **Apply Supabase migrations to production project**
  - [ ] Run: `pnpm db:push` (or `supabase db push`)
- [ ] **Deploy frontend (Vercel/Netlify/etc.)**
  - [ ] Set Supabase env vars in deployment settings
  - [ ] Verify production app connects to Supabase and enforces RLS

---

## 6. Documentation & Handover
- [] **Document Supabase integration steps**
  - [] Created `docs/supabase_migration/deployment-guide.md`
- [] **Add troubleshooting tips for common Supabase issues**
  - [] Auth errors, RLS denials, env var misconfigurations
  - [] See `docs/supabase_migration/supabase-troubleshooting.md`

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