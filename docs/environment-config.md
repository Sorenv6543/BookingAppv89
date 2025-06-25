# **BookingApp v89 - Environment Configuration**

> **Role-Based Multi-Tenant Environment Setup**  
> Configuration Guide for Different Deployment Scenarios

---

## **🎯 Overview**

This guide covers environment configuration for our role-based booking system across different deployment scenarios, from development to production.

### **Environment Types**
- **Development**: Local development with all features enabled
- **Staging**: Production-like testing environment
- **Production**: Live multi-tenant system
- **Owner-Only**: Lightweight owner interface deployment
- **Admin-Only**: Business admin interface deployment

---

## **⚙️ Environment Variables**

### **Core Application Variables**
```bash
# Application Environment
NODE_ENV=production              # development | staging | production
VITE_APP_TITLE=BookingApp v89    # Application title
VITE_APP_VERSION=0.1.0           # Application version

# API Configuration
VITE_API_URL=https://api.yourapp.com     # Backend API URL
VITE_SUPABASE_URL=your_supabase_url      # Supabase project URL
VITE_SUPABASE_ANON_KEY=your_anon_key     # Supabase anonymous key

# Feature Flags
VITE_ENABLE_OWNER_FEATURES=true          # Enable owner interface
VITE_ENABLE_ADMIN_FEATURES=true          # Enable admin interface
VITE_ENABLE_DEV_DEMOS=false              # Enable demo components (dev only)
```

### **Role-Specific Build Variables**
```bash
# Role-Based Deployment
ROLE_BUILD=                      # Empty for full build
ROLE_BUILD=owner                 # Owner-only build
ROLE_BUILD=admin                 # Admin-only build

# Performance Optimization
VITE_ENABLE_SOURCEMAPS=false     # Enable source maps
VITE_DROP_CONSOLE=true           # Remove console.log in production
VITE_BUNDLE_ANALYZER=false       # Enable bundle analysis
```

### **Security Variables**
```bash
# Security Configuration
VITE_ENABLE_CSP=true             # Content Security Policy
VITE_SECURE_COOKIES=true         # Secure cookie settings
VITE_CORS_ORIGIN=https://yourapp.com  # CORS origin

# Authentication
VITE_AUTH_DOMAIN=yourapp.com     # Authentication domain
VITE_JWT_SECRET=your_jwt_secret  # JWT signing secret (backend)
```

---

## **🌍 Environment Configurations**

### **Development Environment**

**Purpose**: Local development with full feature access and debugging tools

```bash
# .env.development
NODE_ENV=development
VITE_APP_TITLE=BookingApp v89 (Dev)
VITE_API_URL=http://localhost:8080
VITE_SUPABASE_URL=your_dev_supabase_url
VITE_SUPABASE_ANON_KEY=your_dev_anon_key

# Feature Flags
VITE_ENABLE_OWNER_FEATURES=true
VITE_ENABLE_ADMIN_FEATURES=true
VITE_ENABLE_DEV_DEMOS=true

# Development Optimization
VITE_ENABLE_SOURCEMAPS=true
VITE_DROP_CONSOLE=false
VITE_BUNDLE_ANALYZER=false

# Security (Relaxed for Development)
VITE_ENABLE_CSP=false
VITE_SECURE_COOKIES=false
VITE_CORS_ORIGIN=http://localhost:3000
```

**Build Commands**:
```bash
# Start development server
pnpm run dev

# Development build
pnpm run build:fast
```

**Features Enabled**:
- ✅ All owner and admin features
- ✅ Demo components and testing tools
- ✅ Source maps and debugging
- ✅ Hot module replacement
- ✅ Development error overlays

---

### **Staging Environment**

**Purpose**: Production-like testing environment for QA and validation

```bash
# .env.staging
NODE_ENV=staging
VITE_APP_TITLE=BookingApp v89 (Staging)
VITE_API_URL=https://staging-api.yourapp.com
VITE_SUPABASE_URL=your_staging_supabase_url
VITE_SUPABASE_ANON_KEY=your_staging_anon_key

# Feature Flags
VITE_ENABLE_OWNER_FEATURES=true
VITE_ENABLE_ADMIN_FEATURES=true
VITE_ENABLE_DEV_DEMOS=true

# Staging Optimization
VITE_ENABLE_SOURCEMAPS=true
VITE_DROP_CONSOLE=false
VITE_BUNDLE_ANALYZER=true

# Security (Enhanced)
VITE_ENABLE_CSP=true
VITE_SECURE_COOKIES=true
VITE_CORS_ORIGIN=https://staging.yourapp.com
```

**Build Commands**:
```bash
# Staging build
NODE_ENV=staging pnpm run build

# Preview staging build
pnpm run preview
```

**Features Enabled**:
- ✅ All production features
- ✅ Demo components for testing
- ✅ Source maps for debugging
- ✅ Bundle analysis tools
- ✅ Enhanced security measures

---

### **Production Environment**

**Purpose**: Live multi-tenant system for property owners and business admin

```bash
# .env.production
NODE_ENV=production
VITE_APP_TITLE=BookingApp v89
VITE_API_URL=https://api.yourapp.com
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key

# Feature Flags
VITE_ENABLE_OWNER_FEATURES=true
VITE_ENABLE_ADMIN_FEATURES=true
VITE_ENABLE_DEV_DEMOS=false

# Production Optimization
VITE_ENABLE_SOURCEMAPS=false
VITE_DROP_CONSOLE=true
VITE_BUNDLE_ANALYZER=false

# Security (Maximum)
VITE_ENABLE_CSP=true
VITE_SECURE_COOKIES=true
VITE_CORS_ORIGIN=https://yourapp.com

# Performance Monitoring
VITE_ENABLE_ANALYTICS=true
VITE_ERROR_TRACKING=true
VITE_PERFORMANCE_MONITORING=true
```

**Build Commands**:
```bash
# Production build
pnpm run build:production

# Preview production build
pnpm run preview:production
```

**Features Enabled**:
- ✅ Full role-based multi-tenant system
- ✅ Optimized performance and security
- ✅ Error tracking and monitoring
- ❌ Development tools and demos
- ❌ Debug information

---

### **Owner-Only Environment**

**Purpose**: Lightweight deployment for property owner interface only

```bash
# .env.owner
NODE_ENV=production
VITE_APP_TITLE=Property Owner Portal
VITE_API_URL=https://api.yourapp.com
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key

# Role-Specific Feature Flags
ROLE_BUILD=owner
VITE_ENABLE_OWNER_FEATURES=true
VITE_ENABLE_ADMIN_FEATURES=false
VITE_ENABLE_DEV_DEMOS=false

# Optimization (Owner-Focused)
VITE_ENABLE_SOURCEMAPS=false
VITE_DROP_CONSOLE=true
VITE_MOBILE_OPTIMIZED=true

# Security
VITE_ENABLE_CSP=true
VITE_SECURE_COOKIES=true
VITE_CORS_ORIGIN=https://owners.yourapp.com
```

**Build Commands**:
```bash
# Owner-only build
pnpm run build:owner-only

# Deploy to owner subdomain
vercel --prod --name bookingapp-owner
```

**Features Enabled**:
- ✅ Owner property and booking management
- ✅ Personal turn alerts and notifications
- ✅ Mobile-optimized interface
- ❌ Admin features and cleaner management
- ❌ System-wide business operations

**Bundle Size**: ~800KB (50% smaller than full build)

---

### **Admin-Only Environment**

**Purpose**: Business admin interface for system management

```bash
# .env.admin
NODE_ENV=production
VITE_APP_TITLE=Business Admin Dashboard
VITE_API_URL=https://api.yourapp.com
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key

# Role-Specific Feature Flags
ROLE_BUILD=admin
VITE_ENABLE_OWNER_FEATURES=false
VITE_ENABLE_ADMIN_FEATURES=true
VITE_ENABLE_DEV_DEMOS=false

# Optimization (Admin-Focused)
VITE_ENABLE_SOURCEMAPS=false
VITE_DROP_CONSOLE=true
VITE_DESKTOP_OPTIMIZED=true

# Security
VITE_ENABLE_CSP=true
VITE_SECURE_COOKIES=true
VITE_CORS_ORIGIN=https://admin.yourapp.com

# Business Analytics
VITE_ENABLE_BUSINESS_ANALYTICS=true
VITE_ENABLE_REPORTING=true
```

**Build Commands**:
```bash
# Admin-only build
pnpm run build:admin-only

# Deploy to admin subdomain
vercel --prod --name bookingapp-admin
```

**Features Enabled**:
- ✅ System-wide business management
- ✅ Cleaner assignment and management
- ✅ Business analytics and reporting
- ✅ Desktop-optimized interface
- ❌ Owner personal interface
- ❌ Individual property owner features

**Bundle Size**: ~1.1MB (25% smaller than full build)

---

## **🔧 Platform-Specific Configuration**

### **Vercel Configuration**

**vercel.json**:
```json
{
  "framework": "vite",
  "buildCommand": "pnpm run build:production",
  "outputDirectory": "dist",
  "installCommand": "pnpm install",
  "devCommand": "pnpm run dev",
  "env": {
    "NODE_ENV": "production",
    "VITE_ENABLE_OWNER_FEATURES": "true",
    "VITE_ENABLE_ADMIN_FEATURES": "true",
    "VITE_ENABLE_DEV_DEMOS": "false"
  },
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
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
        }
      ]
    }
  ],
  "rewrites": [
    { "source": "/((?!api).*)", "destination": "/index.html" }
  ]
}
```

### **Netlify Configuration**

**netlify.toml**:
```toml
[build]
  command = "pnpm run build:production"
  publish = "dist"

[build.environment]
  NODE_ENV = "production"
  VITE_ENABLE_OWNER_FEATURES = "true"
  VITE_ENABLE_ADMIN_FEATURES = "true"
  VITE_ENABLE_DEV_DEMOS = "false"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **AWS S3 + CloudFront**

**Build and Deploy Script**:
```bash
#!/bin/bash
# aws-deploy.sh

# Build production version
pnpm run build:production

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"

echo "Deployment complete!"
```

---

## **🔐 Security Configuration**

### **Content Security Policy**
```javascript
// CSP for production
const cspConfig = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'"],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "font-src": ["'self'", "https://fonts.gstatic.com"],
  "img-src": ["'self'", "data:", "https:"],
  "connect-src": ["'self'", "https://api.yourapp.com", "https://*.supabase.co"]
}
```

### **Environment-Specific Security**

#### **Development**
- Relaxed CORS for localhost
- CSP warnings only (not enforced)
- Source maps enabled for debugging

#### **Staging**
- Production-like security headers
- CSP enforced with relaxed rules for testing
- Source maps enabled for debugging

#### **Production**
- Strict CSP enforcement
- HTTPS only
- Secure cookies
- No source maps exposed

---

## **📊 Monitoring Configuration**

### **Error Tracking**
```bash
# Sentry Configuration
VITE_SENTRY_DSN=your_sentry_dsn
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_RELEASE=v89.1.0

# Error Sampling
VITE_ERROR_SAMPLE_RATE=1.0      # 100% in production
VITE_TRACE_SAMPLE_RATE=0.1      # 10% for performance
```

### **Analytics Configuration**
```bash
# Google Analytics
VITE_GA_TRACKING_ID=GA_TRACKING_ID

# Role-Specific Tracking
VITE_TRACK_OWNER_EVENTS=true
VITE_TRACK_ADMIN_EVENTS=true
VITE_TRACK_PERFORMANCE=true
```

---

## **🔄 Environment Switching**

### **Local Development**
```bash
# Switch to development
cp .env.development .env.local
pnpm run dev

# Switch to staging
cp .env.staging .env.local
pnpm run build && pnpm run preview

# Switch to production
cp .env.production .env.local
pnpm run build:production && pnpm run preview
```

### **CI/CD Pipeline**
```yaml
# GitHub Actions environment matrix
strategy:
  matrix:
    environment: [development, staging, production, owner-only, admin-only]
    include:
      - environment: development
        node-version: '18'
        build-command: 'build:fast'
      - environment: staging
        node-version: '18'
        build-command: 'build'
      - environment: production
        node-version: '18'
        build-command: 'build:production'
      - environment: owner-only
        node-version: '18'
        build-command: 'build:owner-only'
      - environment: admin-only
        node-version: '18'
        build-command: 'build:admin-only'
```

---

## **🆘 Troubleshooting**

### **Common Environment Issues**

**"Environment variables not loaded"**
```bash
# Verify .env file format (no spaces around =)
VARIABLE=value  # ✅ Correct
VARIABLE = value  # ❌ Incorrect

# Check Vite prefix requirement
VITE_API_URL=https://api.com  # ✅ Available in browser
API_URL=https://api.com      # ❌ Server-side only
```

**"Build differences between environments"**
```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite
pnpm install
pnpm run build:production
```

**"Role features not working"**
```bash
# Verify feature flags
echo $VITE_ENABLE_OWNER_FEATURES  # Should output 'true'
echo $ROLE_BUILD                  # Should output 'owner' or 'admin' or empty
```

---

**Last Updated**: December 2024  
**Environment System**: Vite + pnpm + Multi-Platform 