# 🎯 QUICK START - Host Your BookingApp Online in 5 Minutes

This is the **fastest way** to get your BookingApp v89 online and accessible from anywhere.

---

## 🚀 Option 1: Automated Deployment (Easiest)

### Step 1: Get Your Supabase Credentials

1. Go to: https://app.supabase.com/project/otmfvzkokrxduipxkyga/settings/api
2. Copy two things:
   - **Project URL** (starts with `https://`)
   - **anon public** key (long string of characters)

### Step 2: Run the Deployment Script

```bash
# In your project folder, run:
./deploy.sh
```

Choose option 2 (Deploy to Vercel) and follow the prompts!

---

## 🎨 Option 2: Manual Vercel Deployment (5 Steps)

### Step 1: Setup Environment
```bash
# Copy the example file
cp .env.example .env.local

# Open .env.local and add your Supabase credentials
# (from the link above)
```

### Step 2: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 3: Build Your App
```bash
pnpm install
pnpm run build:production
```

### Step 4: Deploy
```bash
vercel --prod
```

### Step 5: Add Environment Variables
```bash
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
```

**Done!** Your app is now live! 🎉

---

## 📱 What You Get

After deployment, you'll have:

- ✅ **Live URL**: Your app accessible from anywhere (e.g., `https://your-app.vercel.app`)
- ✅ **Automatic HTTPS**: Secure connection built-in
- ✅ **Fast Performance**: Global CDN distribution
- ✅ **Zero Cost**: Free hosting on Vercel's free tier
- ✅ **Auto Updates**: Push to GitHub = Auto deployment

---

## 🔑 Required Environment Variables

Only two variables are required for basic deployment:

```bash
VITE_SUPABASE_URL=https://otmfvzkokrxduipxkyga.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
```

Get these from: https://app.supabase.com/project/otmfvzkokrxduipxkyga/settings/api

---

## 🧪 Test Locally First (Recommended)

Before deploying, test your build locally:

```bash
pnpm install
pnpm run build:production
pnpm run preview
```

Open http://localhost:4173 and verify everything works.

---

## 🆘 Troubleshooting

### "pnpm not found"
```bash
npm install -g pnpm
```

### "Vercel not found"
```bash
npm install -g vercel
```

### "Build failed"
```bash
rm -rf node_modules dist
pnpm install
pnpm run build:production
```

### "Cannot connect to Supabase"
- Double-check your environment variables
- Ensure you copied the full key (no spaces)
- Verify Supabase project is active

---

## 📚 More Options

For advanced deployment options, see:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [docs/deployment-guide.md](./docs/deployment-guide.md) - Comprehensive documentation

---

## 🎯 Quick Command Reference

```bash
# Test locally
pnpm run dev                    # Development mode
pnpm run build:production       # Build for production
pnpm run preview                # Preview production build

# Deploy
./deploy.sh                     # Automated deployment script
vercel --prod                   # Direct Vercel deployment
netlify deploy --prod           # Direct Netlify deployment

# Check build
ls -lh dist/                    # View build files
du -sh dist/                    # Check build size
```

---

**Need help?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions!

---

**Time to deploy**: ~5 minutes ⚡  
**Cost**: $0 (free tier) 💰  
**Difficulty**: Easy 🟢
