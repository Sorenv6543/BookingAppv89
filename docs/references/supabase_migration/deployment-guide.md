# Supabase Deployment Guide

Complete guide for deploying the Property Cleaning Scheduler with Supabase.

---

## Prerequisites

1. **Supabase Project** - Create at [supabase.com](https://supabase.com)
2. **Supabase CLI** - Install: `npm install -g supabase`
3. **Vercel/Netlify Account** (or other hosting)

---

## Step 1: Link Supabase Project

```bash
# Login to Supabase CLI
supabase login

# Link to your project (get project ref from dashboard URL)
supabase link --project-ref your-project-ref
```

---

## Step 2: Apply Database Migrations

```bash
# Push all migrations to production
supabase db push

# Or run migrations one by one
supabase db push --include-all
```

### Verify migrations applied:
```bash
# Check migration status
supabase migration list
```

---

## Step 3: Configure Environment Variables

### Local Development (.env.local)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Enable debug logging
VITE_DEBUG_AUTH=true
```

### Production (Vercel)
1. Go to Project Settings → Environment Variables
2. Add:
   - `VITE_SUPABASE_URL` = Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = Your anon (public) key

### Production (Netlify)
1. Go to Site Settings → Build & Deploy → Environment
2. Add the same variables as above

---

## Step 4: Enable Real-time (Optional)

1. Go to Supabase Dashboard → Database → Replication
2. Enable real-time for tables:
   - `bookings`
   - `properties`
   - `user_profiles`

---

## Step 5: Build and Deploy

### Build locally first
```bash
pnpm build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

---

## Step 6: Create Initial Admin User

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User" → "Create New User"
3. Set email and password
4. After user is created, run this SQL to make them admin:

```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'admin@yourdomain.com';
```

---

## Step 7: Verify Deployment

### Run integration tests
```bash
npx tsx scripts/test-supabase-integration.ts
```

### Manual verification checklist
- [ ] Can login with test user
- [ ] Can create a property
- [ ] Can create a booking
- [ ] Bookings appear on calendar
- [ ] Real-time updates work (if enabled)

---

## Rollback Procedures

### Rollback a migration
```bash
# List migrations
supabase migration list

# Rollback last migration (manual - write reverse SQL)
supabase db reset --local  # Local only!
```

### Rollback deployment
```bash
# Vercel
vercel rollback

# Netlify
# Use the Netlify dashboard to select a previous deploy
```

---

## Security Checklist

- [ ] Using `anon` key (NOT `service_role` key) in frontend
- [ ] RLS enabled on all tables
- [ ] No sensitive data in client-side code
- [ ] HTTPS enabled (automatic on Vercel/Netlify)
- [ ] Auth emails configured with your domain

---

## Monitoring

### Supabase Dashboard
- **API Logs**: Database → Logs → API
- **Auth Logs**: Authentication → Logs
- **Real-time**: Database → Replication → Logs

### Error Tracking (Recommended)
Consider adding:
- Sentry for frontend errors
- Supabase logging for backend

---

## Troubleshooting

See: `docs/supabase_migration/supabase-troubleshooting.md`

Common issues:
- "Forbidden use of secret API key" → Use anon key, not service_role
- "RLS policy violation" → Check user role and ownership
- "Missing environment variables" → Check .env.local and hosting settings
