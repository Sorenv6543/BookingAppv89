# Supabase Database Setup Instructions

## Quick Setup (5 minutes)

Your combined migration script is ready at: `supabase/combined_migration.sql`

### Step 1: Open SQL Editor

Go to your Supabase SQL Editor:
**https://app.supabase.com/project/<YOUR_PROJECT_REF>/sql/new**

Replace `<YOUR_PROJECT_REF>` with your actual Supabase project reference (found in your project settings).

### Step 2: Copy and Paste Migration

1. Open the file: `supabase/combined_migration.sql`
2. Copy **ALL** the contents (Ctrl+A, Ctrl+C)
3. Paste into the SQL Editor
4. Click **"Run"** button

### Step 3: Verify Migration

After running, verify the tables were created:

```sql
-- Run this query to check tables
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

You should see:
- `bookings`
- `properties`
- `user_profiles`

### Step 4: Test Connection from Your App

Once the migration completes, your app will be able to connect to the database using the credentials configured in `.env.local`:

```bash
VITE_SUPABASE_URL=https://<YOUR_PROJECT_REF>.supabase.co
VITE_SUPABASE_ANON_KEY=<YOUR_ANON_KEY>
```

Replace:
- `<YOUR_PROJECT_REF>` with your Supabase project reference
- `<YOUR_ANON_KEY>` with your Supabase anonymous (public) API key (from Project Settings > API)

---

## What This Migration Creates

### Tables:
1. **user_profiles** - User accounts with role-based access (owner/admin/cleaner)
2. **properties** - Property listings owned by users
3. **bookings** - Cleaning bookings with schedule information

### Security:
- Row Level Security (RLS) enabled on all tables
- Multi-tenant data isolation (owners see only their data)
- Admin access to all data
- Non-recursive RLS policies (prevents infinite loops)

### Features:
- Automatic user profile creation on signup
- Timestamp tracking (created_at, updated_at)
- Proper indexing for performance
- Business rule constraints

---

## Troubleshooting

### If you see errors about existing objects:

Some objects might already exist from the restore. You can either:

**Option A:** Run this cleanup first:
```sql
-- Drop existing tables (if any)
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.properties CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Drop existing types (if any)
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS booking_type CASCADE;
DROP TYPE IF EXISTS booking_status CASCADE;
DROP TYPE IF EXISTS property_type CASCADE;
DROP TYPE IF EXISTS pricing_tier CASCADE;
DROP TYPE IF EXISTS priority_level CASCADE;
DROP TYPE IF EXISTS theme_preference CASCADE;

-- Then run the combined migration
```

**Option B:** Ignore "already exists" errors
- Postgres will skip objects that already exist
- As long as you see "Success" at the end, you're good!

### To verify RLS is working:

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

All tables should show `rowsecurity = true`

---

## Next Steps

After migration:
1. Create your first user via Supabase Auth
2. Test the connection from your Vue app
3. Start creating properties and bookings!

---

## Need Help?

If you encounter any issues:
1. Check the Supabase logs in the dashboard
2. Verify your environment variables in `.env.local`
3. Test the API connection with curl (see MCP setup docs)
