# 🚀 BookingApp v89 - Quick Deployment Guide

This guide will help you deploy your BookingApp v89 project to the internet in minutes.

---

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ Node.js 18+ installed
- ✅ pnpm package manager installed (`npm install -g pnpm`)
- ✅ A Supabase project set up (see [SUPABASE_SETUP_INSTRUCTIONS.md](./SUPABASE_SETUP_INSTRUCTIONS.md))
- ✅ Git installed

---

## ⚡ Quick Deployment Options

### Option 1: Deploy to Vercel (Recommended - Fastest)

Vercel offers free hosting with automatic HTTPS and excellent performance.

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Set Up Environment Variables
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local and add your Supabase credentials
# Get these from: https://app.supabase.com/project/otmfvzkokrxduipxkyga/settings/api
```

Required variables:
```bash
VITE_SUPABASE_URL=https://otmfvzkokrxduipxkyga.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

#### Step 3: Build and Deploy
```bash
# Install dependencies
pnpm install

# Test the build locally first
pnpm run build:production
pnpm run preview

# If everything works, deploy to Vercel
vercel

# For production deployment
vercel --prod
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Choose your account
- Link to existing project? **No** (first time)
- Project name? Use default or enter custom name
- Directory? **./** (root directory)

#### Step 4: Configure Environment Variables in Vercel

After deployment, add environment variables to Vercel:

```bash
# Using Vercel CLI
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production

# Or use the Vercel Dashboard:
# 1. Go to your project settings
# 2. Navigate to "Environment Variables"
# 3. Add the required variables
```

#### Step 5: Redeploy
```bash
vercel --prod
```

Your app is now live! 🎉

---

### Option 2: Deploy to Netlify

Netlify also offers free hosting with automatic HTTPS.

#### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Step 2: Build Your Project
```bash
# Install dependencies
pnpm install

# Build production version
pnpm run build:production
```

#### Step 3: Deploy
```bash
# Login to Netlify
netlify login

# Deploy
netlify deploy

# For production
netlify deploy --prod
```

#### Step 4: Configure Environment Variables

```bash
# Set environment variables via CLI
netlify env:set VITE_SUPABASE_URL "https://otmfvzkokrxduipxkyga.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your_actual_anon_key_here"

# Or use the Netlify Dashboard:
# 1. Go to Site settings > Environment variables
# 2. Add the required variables
```

---

### Option 3: Deploy to GitHub Pages (Free Static Hosting)

#### Step 1: Configure Base Path
Add this to `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/BookingAppv89/', // Your repository name
  // ... rest of config
})
```

#### Step 2: Build and Deploy Script
```bash
# Install gh-pages
pnpm add -D gh-pages

# Add deployment script to package.json
# "deploy": "pnpm run build:production && gh-pages -d dist"

# Deploy
pnpm run deploy
```

#### Step 3: Configure GitHub Pages
1. Go to repository Settings > Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` / `root`
4. Save

Your app will be available at: `https://yourusername.github.io/BookingAppv89/`

---

## 🔐 Environment Variables Setup

### Required Variables

You **must** set these environment variables for the app to work:

```bash
VITE_SUPABASE_URL=https://otmfvzkokrxduipxkyga.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Getting Your Supabase Credentials

1. Go to your Supabase project: https://app.supabase.com/project/otmfvzkokrxduipxkyga
2. Click on **Settings** (gear icon) in the left sidebar
3. Click on **API** in the settings menu
4. Copy the following:
   - **Project URL** → Use as `VITE_SUPABASE_URL`
   - **anon public** key → Use as `VITE_SUPABASE_ANON_KEY`

### Optional Variables (Recommended for Production)

```bash
NODE_ENV=production
VITE_ENABLE_OWNER_FEATURES=true
VITE_ENABLE_ADMIN_FEATURES=true
VITE_DROP_CONSOLE=true
VITE_ENABLE_CSP=true
```

---

## 🧪 Testing Before Deployment

Always test your build locally before deploying:

```bash
# Clean install
rm -rf node_modules dist
pnpm install

# Build production version
pnpm run build:production

# Preview the build
pnpm run preview

# Open http://localhost:4173 in your browser to test
```

Common checks:
- ✅ App loads without errors
- ✅ Login/authentication works
- ✅ Can navigate between pages
- ✅ Data loads from Supabase
- ✅ No console errors

---

## 📊 Deployment Verification Checklist

After deployment, verify:

- [ ] App loads and displays correctly
- [ ] HTTPS is enabled (automatic on Vercel/Netlify)
- [ ] Authentication works (sign up/login)
- [ ] Supabase connection is working
- [ ] All routes/pages are accessible
- [ ] No console errors in browser DevTools
- [ ] Mobile responsive design works

---

## 🔧 Troubleshooting

### "Cannot connect to Supabase"
- Verify environment variables are set correctly
- Check Supabase project is active
- Ensure CORS is configured in Supabase settings

### "404 on page refresh"
- Configure SPA fallback on your hosting platform
- Vercel: Already configured in `vercel.json`
- Netlify: Add `_redirects` file with `/* /index.html 200`

### "Build fails"
```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite pnpm-lock.yaml
pnpm install
pnpm run build:production
```

### "Environment variables not working"
- Ensure they start with `VITE_` prefix
- Rebuild after changing environment variables
- Check your hosting platform's environment variable settings

---

## 📈 Monitoring Your Deployment

### Vercel
- Dashboard: https://vercel.com/dashboard
- View deployment logs
- Monitor performance and analytics

### Netlify
- Dashboard: https://app.netlify.com
- View build logs and analytics
- Monitor site performance

---

## 🎯 Next Steps

After successful deployment:

1. **Set up custom domain** (optional)
   - Vercel: Project Settings > Domains
   - Netlify: Site Settings > Domain Management

2. **Configure Supabase authentication**
   - Add your deployment URL to Supabase auth settings
   - Configure email templates

3. **Enable monitoring** (optional)
   - Set up error tracking (Sentry)
   - Configure analytics (Google Analytics)

4. **Create test users**
   - Create owner and admin accounts
   - Test all functionality

---

## 📚 Additional Resources

- [Deployment Guide](docs/deployment-guide.md) - Comprehensive deployment documentation
- [Environment Config](docs/environment-config.md) - Detailed environment setup
- [Supabase Setup](SUPABASE_SETUP_INSTRUCTIONS.md) - Database configuration
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)

---

## 🆘 Need Help?

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review build logs in your hosting platform
3. Test locally with `pnpm run preview`
4. Check Supabase logs in the dashboard
5. Verify all environment variables are set correctly

---

**Quick Command Reference:**

```bash
# Install dependencies
pnpm install

# Test locally
pnpm run dev

# Build for production
pnpm run build:production

# Preview production build
pnpm run preview

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod
```

---

**Version**: 0.1.0  
**Last Updated**: January 2025  
**Platform**: Vite + Vue 3 + Supabase
