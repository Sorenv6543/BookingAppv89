# Security & Configuration Fixes - Multiple Critical Issues Resolved

## Summary
This commit resolves 14 security vulnerabilities and configuration issues across the codebase, focusing on:
1. **Removing hardcoded credentials** from tracked files
2. **SQL injection and privilege escalation** vulnerabilities in database migrations
3. **RLS state leakage** issues in stored procedures
4. **Foreign key constraint violations** in admin user creation
5. **Configuration inconsistencies** and misplaced files

---

## Issues Fixed

### 1. Hardcoded Supabase Credentials & MCP Configuration
**Files**: `.cursor/mcp.json`, `.mcp.json`, `environment-setup.sh`, `SUPABASE_SETUP_INSTRUCTIONS.md`
- Removed literal access tokens and anon keys from tracked files
- Created `.cursor/mcp.json.example` and `.mcp.json.example` templates with placeholders
- Updated `environment-setup.sh` to use placeholders instead of real credentials
- Parameterized Supabase project references in documentation (using `<YOUR_PROJECT_REF>`)
- **Action Required**: Rotate/revoke any exposed Supabase tokens immediately

### 2. Git Tracking of Sensitive Files
**Files**: `.gitignore`, deleted tracked credentials
- Removed `.cursor/mcp.json` and `.mcp.json` from git tracking
- Ensured `.env.local` is not tracked (already in `.gitignore`)
- Added `.env.example` as template for contributors
- If credentials were previously pushed: Use `git filter-branch` or BFG Repo-Cleaner to purge from history

### 3. Documentation Status Inconsistency
**File**: `CLAUDE.md`
- Fixed status header from "100% complete, Production Ready" to "Frontend Integration Pending"
- Aligned header with existing note about pending frontend integration (line 100)
- Reflects current development state accurately

### 4. SQL Injection & Enum Casting Vulnerabilities

#### `fix_signup_complete.sql` & `fix_handle_new_user_trigger.sql`
- **Issue**: `(NEW.raw_user_meta_data->>'role')::user_role` could throw before COALESCE runs
- **Fix**: Added CASE statement to validate role string against enum labels (`'owner'`, `'admin'`, `'cleaner'`) before casting
- **Effect**: Prevents invalid strings from causing constraint violations during signup

#### `combined_migration.sql`
- **Issue**: `create_admin_user()` generated orphaned UUID not linked to `auth.users`
- **Fix**: Changed function signature to accept `auth_user_id UUID` parameter
  - Before: `create_admin_user(user_email TEXT, user_name TEXT)`
  - After: `create_admin_user(auth_user_id UUID, user_email TEXT, user_name TEXT)`
- **Effect**: Ensures foreign key to `auth.users(id)` is satisfied
- **Migration**: Callers must provide UUID from `auth.users` instead of generating new one

### 5. Privilege Escalation Vulnerabilities

#### `combined_migration.sql` - EXECUTE Permissions
- **Issue**: `handle_new_user()` and `create_admin_user()` granted EXECUTE to `authenticated` role
- **Fix**: Restricted to `service_role` only
  - `handle_new_user()`: Removed grant to `authenticated`, kept `service_role`
  - `create_admin_user()`: Changed from `authenticated` to `service_role` (admin-only function)
- **Effect**: Prevents regular authenticated users from executing admin operations

### 6. RLS State Leakage

#### `combined_migration.sql` - `private.get_user_role_bypass_rls()`
- **Issue**: Session-level `SET row_security = off` persisted beyond function, creating RLS vulnerability
- **Fix**: Changed to transaction-scoped `SET LOCAL row_security = off`
  - Automatically reverts at end of transaction
  - Removed manual `SET row_security = on` statements
- **Effect**: RLS state cannot leak after function returns; safer for concurrent operations

### 7. SQL Logging & Statistics Comments

#### `check_logs.sql`
- **Updated**: Comment from "Check if there are any recent errors" to "execution statistics for queries"
- **Added**: Note that `pg_stat_statements` extension must be enabled via `CREATE EXTENSION`
- **Clarified**: `pg_stat_activity` shows active sessions only, not historical logs
- **Recommended**: Use Supabase Dashboard logs for historical error tracking

### 8. Removed ALTER DATABASE Statement

#### `combined_migration.sql`
- **Removed**: `ALTER DATABASE postgres SET row_security = on;` (line 13)
- **Reason**: Managed Supabase instances disallow ALTER DATABASE commands
- **Retained**: Per-table RLS statements (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`) remain intact

### 9. Code Quality - Duplicate Fallbacks

#### `src/components/dumb/BookingForm.vue`
- **Removed**: Duplicate `initialData.checkin_date` and `initialData.checkout_date` fallback entries
- **Changed**: 
  - Before: `initialData.start || initialData.checkin_date || initialData.guest_arrival_date || ''`
  - After: `initialData.start || initialData.checkin_date || ''`
- **Effect**: Cleaner code, reduces confusion about field mapping

### 10. Removed Misplaced Files

#### `src/composables/owner/vododecmmit–.md`
- **Issue**: Corrupted filename (contains en-dash) and incorrectly placed in source code directory
- **Action**: Deleted from repo (git rm)
- **Recommendation**: Store commit summaries in `CHANGELOG.md` or `docs/adr/` instead

### 11. Added gitignore Entry

#### `.gitignore`
- **Added**: `nul` (accidentally committed diagnostic output from Windows redirects)
- Prevents future commits of diagnostic files

---

## Security Recommendations

1. **Rotate Supabase Credentials**: Any tokens in commit history should be rotated immediately
2. **Use BFG Repo-Cleaner**: If credentials were pushed to remote:
   ```bash
   bfg --delete-files .mcp.json,..cursor/mcp.json,environment-setup.sh
   git reflog expire --expire=now --all && git gc --prune=now --aggressive
   ```
3. **Set SUPABASE_ACCESS_TOKEN env var**: Before running Supabase MCP server:
   ```bash
   export SUPABASE_ACCESS_TOKEN=your-token-here
   ```
4. **Verify RLS Policies**: Audit all RLS policies on `public.*` tables to ensure no recursive role checks

---

## Migration Path

### For Developers
1. Copy `.env.example` to `.env.local`
2. Fill in your actual Supabase project reference and anon key
3. Copy `.cursor/mcp.json.example` to `.cursor/mcp.json` (if using Cursor IDE)
4. Set `SUPABASE_ACCESS_TOKEN` environment variable before running MCP server

### For Database
1. If using `create_admin_user()`: Update calls to pass `auth_user_id` UUID instead of generating locally
2. Re-run migrations on dev environment to verify no breakage
3. Test signup flow with the new enum validation

---

## Files Changed
- `.cursor/mcp.json` (deleted - removed from tracking)
- `.cursor/mcp.json.example` (created - template)
- `.env.example` (created - template)
- `.gitignore` (updated - added nul, clarified MCP entries)
- `.mcp.json` (deleted - removed from tracking)
- `.mcp.json.example` (created - template)
- `CLAUDE.md` (updated - fixed status inconsistency)
- `SUPABASE_SETUP_INSTRUCTIONS.md` (updated - parameterized URLs and credentials)
- `environment-setup.sh` (updated - replaced credentials with placeholders)
- `src/components/dumb/BookingForm.vue` (fixed - removed duplicate fallbacks)
- `supabase/check_logs.sql` (updated - clarified comments, added extension note)
- `supabase/combined_migration.sql` (fixed - 5 major security/correctness issues)
- `supabase/fix_handle_new_user_trigger.sql` (fixed - enum validation, error handling)
- `supabase/fix_signup_complete.sql` (fixed - enum validation, removed RLS disabling)
- `src/composables/owner/vododecmmit–.md` (deleted - misplaced file)
