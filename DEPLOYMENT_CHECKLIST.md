# ✅ Pre-Deployment Checklist

Use this checklist before deploying your BookingApp v89 to production.

---

## 📋 Essential Requirements

### 1. Environment Setup
- [ ] Node.js 18+ installed
- [ ] pnpm package manager installed (`npm install -g pnpm`)
- [ ] Git installed and configured

### 2. Supabase Configuration
- [ ] Supabase project is active
- [ ] Database migration completed (see [SUPABASE_SETUP_INSTRUCTIONS.md](./SUPABASE_SETUP_INSTRUCTIONS.md))
- [ ] Supabase URL copied
- [ ] Supabase anon key copied
- [ ] `.env.local` file created with Supabase credentials

### 3. Application Testing
- [ ] Dependencies installed (`pnpm install`)
- [ ] Development server runs without errors (`pnpm run dev`)
- [ ] Production build succeeds (`pnpm run build:production`)
- [ ] Production preview works (`pnpm run preview`)
- [ ] No console errors in browser DevTools

---

## 🔐 Security Checklist

- [ ] Environment variables are NOT committed to Git
- [ ] `.env.local` is in `.gitignore`
- [ ] Supabase RLS (Row Level Security) is enabled
- [ ] Authentication works correctly
- [ ] Users can only access their own data (owners)
- [ ] Admin users can access all data

---

## 🧪 Functionality Testing

### Authentication
- [ ] Sign up works
- [ ] Login works
- [ ] Logout works
- [ ] Password reset works (if implemented)

### Owner Features
- [ ] Can view own properties
- [ ] Can create/edit properties
- [ ] Can view own bookings
- [ ] Can create/edit bookings
- [ ] Turn alerts show correctly

### Admin Features (if applicable)
- [ ] Can view all properties
- [ ] Can view all bookings
- [ ] Can manage cleaners
- [ ] Can assign cleaners to bookings
- [ ] Admin dashboard loads correctly

### General
- [ ] All routes/pages load correctly
- [ ] Mobile responsive design works
- [ ] Calendar displays correctly
- [ ] Data persists in Supabase

---

## 🚀 Deployment Platform Setup

### For Vercel
- [ ] Vercel CLI installed (`npm install -g vercel`)
- [ ] Logged into Vercel (`vercel login`)
- [ ] Environment variables set in Vercel:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] `vercel.json` exists and is configured

### For Netlify
- [ ] Netlify CLI installed (`npm install -g netlify-cli`)
- [ ] Logged into Netlify (`netlify login`)
- [ ] Environment variables set in Netlify:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`

---

## 📊 Performance Verification

- [ ] Production build size is reasonable (~12MB total)
- [ ] Gzipped assets are optimized
- [ ] No unnecessary console.log statements in production
- [ ] Source maps are disabled for production (security)

---

## 🌐 Post-Deployment Verification

After deploying, verify these items:

### Basic Functionality
- [ ] App loads at deployment URL
- [ ] HTTPS is active (should be automatic)
- [ ] No 404 errors on page refresh
- [ ] All assets load correctly (images, fonts, icons)

### Authentication
- [ ] Sign up works on production
- [ ] Login works on production
- [ ] Supabase connection is working

### Data Access
- [ ] Can create test property
- [ ] Can create test booking
- [ ] Data persists correctly
- [ ] RLS policies working correctly

### Cross-Browser Testing
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works on mobile browsers

---

## 🆘 Common Issues & Solutions

### Build Fails
```bash
# Clean and rebuild
rm -rf node_modules dist .vite pnpm-lock.yaml
pnpm install
pnpm run build:production
```

### Environment Variables Not Working
- Ensure they start with `VITE_` prefix
- Rebuild after changing environment variables
- Verify in hosting platform settings

### Supabase Connection Issues
- Verify credentials are correct
- Check Supabase project is active
- Add deployment URL to Supabase auth settings

### 404 on Page Refresh
- Verify SPA fallback is configured in `vercel.json`
- For Netlify, ensure redirects are configured

---

## 📝 Final Steps

- [ ] Document your deployment URL
- [ ] Test with real user accounts
- [ ] Set up monitoring/analytics (optional)
- [ ] Configure custom domain (optional)
- [ ] Set up automatic deployments from GitHub (optional)

---

## ✅ Ready to Deploy!

If all items are checked, you're ready to deploy:

```bash
# Use the automated script
./deploy.sh

# Or deploy manually
vercel --prod          # For Vercel
netlify deploy --prod  # For Netlify
```

---

**Questions?** Check:
- [QUICK_START_DEPLOYMENT.md](./QUICK_START_DEPLOYMENT.md) - Quick deployment guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Comprehensive deployment documentation
- [docs/deployment-guide.md](./docs/deployment-guide.md) - Detailed deployment strategies

---

**Last Updated**: January 2025
