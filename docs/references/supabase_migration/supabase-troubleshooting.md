# Supabase Troubleshooting Guide

Common issues and solutions when working with Supabase in the Property Cleaning Scheduler.

---

## Authentication Errors

### "Forbidden use of secret API key in browser"

**Cause**: Using the `service_role` key instead of the `anon` key in frontend code.

**Solution**:
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API
2. Copy the **`anon` `public`** key (NOT the `service_role` key)
3. Update your `.env.local`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Restart your dev server: `pnpm dev`

### "Not authenticated" / User is null

**Cause**: Session expired or user not logged in.

**Solution**:
1. Check if session exists: `supabase.auth.getSession()`
2. Verify cookies are enabled in browser
3. Check if `persistSession: true` is set in Supabase client config
4. Try logging out and back in

### "Invalid login credentials"

**Cause**: Wrong email/password or user doesn't exist.

**Solution**:
1. Verify email is correct (case-sensitive)
2. Check if user exists in Supabase Auth → Users
3. Reset password if needed

---

## RLS (Row Level Security) Errors

### "new row violates row-level security policy"

**Cause**: INSERT/UPDATE blocked by RLS policy.

**Solution**:
1. Check if user has the correct role (owner/admin/cleaner)
2. Verify `owner_id` matches `auth.uid()` for owner operations
3. Check RLS policies in Supabase Dashboard → Authentication → Policies

**Debug**: Run in Supabase SQL Editor:
```sql
-- Check current user's role
SELECT * FROM user_profiles WHERE id = auth.uid();

-- Test if RLS is blocking
SET LOCAL ROLE authenticated;
SET request.jwt.claim.sub = 'your-user-id';
SELECT * FROM bookings; -- Should return only user's bookings
```

### "permission denied for table X"

**Cause**: RLS is enabled but no policy allows the operation.

**Solution**:
1. Check if RLS is enabled: Dashboard → Table → RLS tab
2. Ensure policies exist for SELECT/INSERT/UPDATE/DELETE
3. Verify user's role matches policy requirements

---

## Data Operation Errors

### "null value in column X violates not-null constraint"

**Cause**: Required field is missing in insert/update.

**Solution**:
1. Check required fields in table schema
2. Ensure form data includes all required fields:
   - `owner_id` - Auto-set from `auth.uid()`
   - `property_id` - Required for bookings
   - `checkin_date`, `checkout_date` - Required dates
   - `status` - Default is 'pending'

### "duplicate key value violates unique constraint"

**Cause**: Trying to insert a record with existing ID.

**Solution**:
1. Let Supabase auto-generate UUIDs (don't pass `id`)
2. If updating, use `.update()` not `.insert()`

### "check constraint violation" on dates

**Cause**: `checkout_date` is not after `checkin_date`.

**Solution**:
1. Verify checkout date is strictly after checkin date
2. For same-day turns, dates should still be different:
   - checkin_date: day guest arrives
   - checkout_date: day guest leaves

---

## Environment Variable Issues

### "Missing Supabase environment variables"

**Cause**: `.env.local` not set up or not loaded.

**Solution**:
1. Create `.env.local` in project root:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
2. Restart dev server (env vars only load on startup)
3. Check file is not `.env.local.txt` (no extension needed)

### Env vars work locally but not in production

**Cause**: Production env vars not set.

**Solution**:
1. Vercel: Settings → Environment Variables
2. Netlify: Site Settings → Build & Deploy → Environment
3. Add both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
4. Redeploy after adding

---

## Real-time Subscription Issues

### Subscriptions not receiving updates

**Cause**: Real-time not enabled or channel misconfigured.

**Solution**:
1. Enable real-time in Supabase Dashboard → Database → Replication
2. Add tables to the publication: `supabase_realtime`
3. Check subscription code:
   ```typescript
   supabase
     .channel('bookings')
     .on('postgres_changes', { 
       event: '*', 
       schema: 'public', 
       table: 'bookings' 
     }, (payload) => {
       console.log('Change:', payload);
     })
     .subscribe();
   ```

### "Realtime connection closed"

**Cause**: Network issue or rate limiting.

**Solution**:
1. Check internet connection
2. Reduce event frequency if hitting rate limits
3. Implement reconnection logic in `useRealtimeSync.ts`

---

## Debugging Tips

### Enable Debug Logging

Add to `.env.local`:
```
VITE_DEBUG_AUTH=true
```

### Check Supabase Logs

1. Dashboard → Logs → API Logs
2. Filter by table or operation
3. Look for error codes (403 = RLS, 401 = Auth)

### Test Queries in SQL Editor

```sql
-- Test as authenticated user
SELECT * FROM bookings WHERE owner_id = 'your-user-id';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'bookings';

-- Verify user role
SELECT role FROM user_profiles WHERE id = 'your-user-id';
```

---

## Quick Reference: Error Codes

| Code | Meaning | Common Fix |
|------|---------|------------|
| 401 | Unauthorized | Check auth, refresh session |
| 403 | Forbidden (RLS) | Check user role and RLS policies |
| 409 | Conflict | Duplicate key, try update instead |
| 422 | Validation | Check required fields and constraints |
| 500 | Server Error | Check Supabase status, review logs |
