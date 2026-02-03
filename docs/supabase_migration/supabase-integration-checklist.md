# Supabase Integration Checklist

_A comprehensive, production-ready checklist for integrating Supabase with your role-based, multi-tenant property cleaning scheduler._

<!-- ---

## 1. Supabase Client Configuration
- [ ] **Review `src/plugins/supabase.ts`**
  - [ ] Uses environment variables for URL and anon key
  - [ ] Correct export and usage across the app
- [ ] **Check `.env` file**
  - [ ] `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
  - [ ] `.env` is in `.gitignore`

---

## 2. Composables & Store Integration
- [ ] **Verify `useSupabaseAuth` composable**
  - [ ] Handles login, logout, session, and user profile
  - [ ] Correctly updates Pinia store in production
- [ ] **Check data composables (`useSupabaseBookings`, `useSupabaseProperties`)**
  - [ ] CRUD operations use Supabase client
  - [ ] Role-based data access patterns are followed
- [ ] **Ensure Pinia stores use composables in production**
  - [ ] Owner/admin stores fetch/update data via Supabase -->

---

## 3. Security: RLS Policies
- [ ] **Review `/supabase/migrations/002_rls_policies.sql`**
  - [ ] RLS enabled for all sensitive tables
  - [ ] Policies enforce owner-only access for owners, full access for admin
- [ ] **Test RLS policies**
  - [ ] Attempt unauthorized access (e.g., owner tries to access another owner's data)
  - [ ] Confirm access is denied as expected

---

## 4. Local & Production Testing
- [ ] **Run the app locally (`pnpm dev`)**
  - [ ] Register/login as owner and admin
  - [ ] Test booking/property CRUD for both roles
  - [ ] Verify role-based data visibility
- [ ] **Check error handling for Supabase failures**
  - [ ] Simulate network or permission errors
  - [ ] Ensure user-friendly error messages

---

## 5. Deployment
- [ ] **Apply Supabase migrations to production project**
  - [ ] Run: `supabase db push` (or your migration workflow)
- [ ] **Deploy frontend (Vercel/Netlify/etc.)**
  - [ ] Set Supabase env vars in deployment settings
  - [ ] Verify production app connects to Supabase and enforces RLS

---

## 6. Documentation & Handover
- [ ] **Document Supabase integration steps**
  - [ ] Update `docs/deployment-guide.md` and/or `docs/supabase-migration-steps.md`
- [ ] **Add troubleshooting tips for common Supabase issues**
  - [ ] Auth errors, RLS denials, env var misconfigurations

---

**Success Criteria:**
- [ ] All checkboxes above are complete
- [ ] Role-based data access is enforced in both frontend and backend
- [ ] All tests pass in production mode
- [ ] Deployment is secure and stable 