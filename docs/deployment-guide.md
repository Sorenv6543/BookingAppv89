# **BookingApp v89 - Deployment Guide**

> **Multi-Tenant Property Cleaning Scheduler**  
> Role-Based Architecture Deployment Documentation

---

## **🎯 Overview**

This guide covers deployment strategies for our role-based booking system, which serves two distinct user types:
- **Property Owners** (30-40 clients): Personal property and booking management
- **Business Admin** (1 user): System-wide business operations and cleaner management

## **🏗️ Architecture Overview**

### **Role-Based Component Structure**
```
Production Build Components:
├── Owner Interface (59KB)    # Personal property management
├── Admin Interface (169KB)   # Business operations management  
├── Shared Components (84KB)  # Reusable UI components
├── Owner Logic (19KB)        # Owner-specific business logic
├── Admin Logic (54KB)        # Admin-specific business logic
└── Shared Logic (33KB)       # Common business logic
```

### **Core Libraries** (1.2MB total)
- **Vuetify**: 874KB (UI framework)
- **Vue Core**: 683KB (framework)
- **FullCalendar**: 581KB (calendar functionality)

---

## **🚀 Deployment Modes**

### **1. Production (Full) - Recommended**
**Use Case**: Complete multi-tenant system for both property owners and admin

```bash
# Build full production version
pnpm run build:production

# Preview production build
pnpm run preview:production
```

**Features Included**:
- ✅ Owner interface (property management, personal bookings)
- ✅ Admin interface (system management, cleaner assignment)
- ✅ Shared components and business logic
- ✅ Optimized chunking (18 role-based chunks)
- ✅ Production minification and optimization

**Bundle Size**: ~1.5MB (gzipped: ~400KB)  
**Target Users**: Property owners + Business admin

---

### **2. Owner-Only Build**
**Use Case**: Lightweight deployment for property owner-only environments

```bash
# Build owner interface only
pnpm run build:owner-only

# Smaller bundle, faster loading for owner users
```

**Features Included**:
- ✅ Owner interface (personal property management)
- ✅ Shared components (PropertyCard, TurnAlerts, etc.)
- ✅ Owner-specific business logic
- ❌ Admin interface (excluded)
- ❌ Cleaner management features

**Bundle Size**: ~800KB (gzipped: ~200KB)  
**Target Users**: Property owners only

---

### **3. Admin-Only Build**
**Use Case**: Administrative dashboard for business management

```bash
# Build admin interface only  
pnpm run build:admin-only

# Includes all admin features and tools
```

**Features Included**:
- ✅ Admin interface (system management)
- ✅ Cleaner assignment and management
- ✅ Admin-specific business logic
- ✅ Shared components
- ❌ Owner interface (excluded)

**Bundle Size**: ~1.1MB (gzipped: ~300KB)  
**Target Users**: Business admin only

---

### **4. Development Build**
**Use Case**: Development and testing with all features

```bash
# Standard development build
pnpm run dev

# Fast build without TypeScript checking
pnpm run build:fast
```

**Features Included**:
- ✅ All owner and admin features
- ✅ Demo components for testing
- ✅ Development tools and debugging
- ✅ Hot module replacement
- ✅ Source maps for debugging

---

## **⚙️ Environment Configuration**

### **Build-Time Feature Flags**
Our build system includes feature flags defined in `vite.config.ts`:

```typescript
// Available in all environments
__ENABLE_OWNER_FEATURES__: boolean    // Owner interface features
__ENABLE_ADMIN_FEATURES__: boolean    // Admin interface features  
__DEV_DEMOS_ENABLED__: boolean        // Demo components
__BUILD_VERSION__: string             // Application version
__BUILD_TIMESTAMP__: string           // Build timestamp
```

### **Environment Variables**
```bash
# Production environment
NODE_ENV=production

# Role-specific builds
ROLE_BUILD=owner      # Owner-only build
ROLE_BUILD=admin      # Admin-only build

# Build optimization
VITE_ENABLE_SOURCEMAPS=false    # Disable sourcemaps in production
VITE_DROP_CONSOLE=true          # Remove console.log in production
```

### **Deployment Configuration**
See `deployment.config.ts` for predefined configurations:

```typescript
import { getDeploymentConfig } from './deployment.config'

// Get configuration for specific deployment
const config = getDeploymentConfig('production')
// Available configs: 'production', 'ownerOnly', 'adminOnly', 'development', 'staging'
```

---

## **🌐 Hosting & Server Configuration**

### **Recommended Hosting Platforms**

#### **Vercel (Recommended)**
```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy production build
pnpm run build:production
vercel --prod

# Deploy role-specific builds
pnpm run build:owner-only
vercel --prod --name bookingapp-owner

pnpm run build:admin-only  
vercel --prod --name bookingapp-admin
```

#### **Netlify**
```bash
# Build command
pnpm run build:production

# Publish directory
dist/

# Environment variables
NODE_ENV=production
```

#### **AWS S3 + CloudFront**
```bash
# Build for AWS
pnpm run build:production

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

## **🔒 Security & Performance**

### **Security Headers**
Configure your hosting platform with these headers:

```javascript
// _headers (Netlify) or vercel.json (Vercel)
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options", 
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
        }
      ]
    }
  ]
}
```

### **Performance Optimization**
```javascript
// Enable compression
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## **📊 Monitoring & Analytics**

### **Bundle Analysis**
```bash
# Analyze bundle composition
pnpm run analyze:bundle

# Check chunk sizes
pnpm run build:production
ls -la dist/js/
```

### **Performance Monitoring**
- **Core Web Vitals**: Monitor LCP, FID, CLS
- **Bundle Size**: Track chunk sizes over time
- **Load Times**: Monitor role-specific interface performance
- **Error Tracking**: Implement error monitoring for production

---

## **🔄 CI/CD Pipeline**

### **GitHub Actions Example**
```yaml
# .github/workflows/deploy.yml
name: Deploy BookingApp

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install pnpm
        run: npm install -g pnpm
        
      - name: Install dependencies
        run: pnpm install
        
      - name: Build production
        run: pnpm run build:production
        
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## **🧪 Pre-Deployment Testing**

### **Build Verification**
```bash
# Test all build modes
pnpm run build:production     # Full build
pnpm run build:owner-only     # Owner interface
pnpm run build:admin-only     # Admin interface

# Verify builds work
pnpm run preview              # Test production build locally
```

### **Role-Based Testing**
```bash
# Run test suite
pnpm run test

# Test coverage
pnpm run test:coverage

# Lint check
pnpm run lint
```

---

## **📋 Deployment Checklist**

- [ ] **Environment Setup**
  - [ ] Node.js 18+ installed
  - [ ] pnpm package manager installed
  - [ ] Environment variables configured
  
- [ ] **Build Testing**
  - [ ] Production build completes without errors
  - [ ] Role-specific builds work correctly
  - [ ] Bundle sizes are within expected ranges
  
- [ ] **Security Review**
  - [ ] Security headers configured
  - [ ] HTTPS enforced
  - [ ] Content Security Policy implemented
  
- [ ] **Performance Verification**
  - [ ] Lighthouse score > 90
  - [ ] Bundle size optimized
  - [ ] Lazy loading working correctly
  
- [ ] **Monitoring Setup**
  - [ ] Error tracking configured
  - [ ] Performance monitoring enabled
  - [ ] Bundle analysis tools set up

---

## **🆘 Troubleshooting**

### **Common Build Issues**

**"Cannot resolve module"**
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**"TypeScript compilation errors"**
```bash
# Use fast build to skip TypeScript checking
pnpm run build:fast
```

**"Bundle size too large"**
```bash
# Use role-specific builds
pnpm run build:owner-only    # Smaller bundle for owners
pnpm run build:admin-only    # Optimized for admin
```

### **Runtime Issues**

**"Chunk loading failed"**
- Verify hosting platform supports SPA routing
- Configure proper fallback to index.html

**"Role features not working"**
- Check build-time feature flags
- Verify correct deployment mode used

---

## **📞 Support**

For deployment issues:
1. Check the troubleshooting section above
2. Review build logs for specific error messages
3. Verify hosting platform configuration
4. Test locally with `pnpm run preview`

---

**Last Updated**: December 2024  
**Build System**: Vite 5.x + Vue 3 + TypeScript 