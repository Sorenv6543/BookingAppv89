# Property Cleaning Scheduler - Claude Code Configuration

## Project Overview
Vue 3 + TypeScript property cleaning scheduler with role-based architecture (Owner/Admin), Supabase integration, and production-ready performance optimizations.

**Current Status**: 95% complete, 89 TypeScript errors blocking production build

---

## 🚨 Critical Current State

### Immediate Priorities
- **CRITICAL**: 89 TypeScript compilation errors blocking production
- **HIGH**: 2 test failures (87/89 passing, 97.8% pass rate)
- **MEDIUM**: Complete Supabase frontend integration (schema ready)

### Verified Working Components
- ✅ Role-based architecture (100% implemented)
- ✅ Performance optimizations (67% subscription reduction)
- ✅ HomeOwner, OwnerSidebar, AdminDashboard, AdminCalendar
- ✅ PropertyCard, TurnAlerts, LoadingSpinner components

---

## Tech Stack & Commands

### Core Technologies
- **Frontend**: Vue 3.4+ + TypeScript 5.3+ + Vite + Vuetify 3
- **Backend**: Supabase (PostgreSQL, Auth, RLS, Realtime)
- **Calendar**: FullCalendar integration
- **State**: Pinia stores + Supabase composables
- **Testing**: Vitest + Playwright + Performance tests
- **PWA**: Vite PWA plugin with battery optimization

### Development Commands
```bash
# Development server (localhost:3000)
npm run dev

# Critical build commands
npm run build          # Full production build (currently blocked)
npm run build:fast     # Quick build without type checking
npm run lint           # ESLint with auto-fix

# Testing commands
npm run test           # Unit tests (87/89 passing)
npm run test:e2e       # End-to-end tests
npm run test:performance # Performance regression tests

# Analysis commands
npm run perf:analysis  # Bundle and performance metrics
npm run analyze:bundle # Bundle size visualization
```

---

## Architecture Constraints

### Role-Based Component Architecture
```
src/components/
├── smart/                    # Data-aware components
│   ├── admin/               # Admin interface (AdminDashboard, AdminUsers)
│   ├── owner/               # Owner interface (OwnerDashboard, OwnerProperties)
│   └── shared/              # Cross-role (Calendar, PropertyCard)
└── dumb/                    # Pure UI components
    ├── forms/               # Form components
    ├── layouts/             # Layout components
    └── navigation/          # Navigation components
```

### Critical Development Patterns
- **Smart/Dumb Separation**: Smart components handle data/business logic, dumb components are pure UI
- **Role-Based Access**: All components automatically filter data by user role
- **Performance Monitoring**: All smart components track subscriptions and memory usage
- **TypeScript Strict**: Zero TypeScript errors required for production
- **Test Coverage**: 100% test pass rate required

---

## Current Implementation References

### Business Logic & Rules
@docs/references/business_logic_reference.md

Key business concepts:
- Booking types: 'standard' | 'turn'
- Priority system: 'low' | 'normal' | 'high' | 'urgent'
- Role permissions: Owner (own data), Admin (all data)
- Performance limits: ≤40 subscriptions, ≤100MB memory

### Component Architecture & Communication
@docs/references/component_orchestration_reference.md

Key architectural patterns:
- SmartComponentProps interface with role context
- Performance-optimized component loading
- Pinia store integration with role-based filtering
- Route protection with authentication guards

---

## Authentication & Security

### Current Auth Implementation
- **Primary**: `useSupabaseAuth` composable (production)
- **Store**: `useAuthStore` with fallback for testing
- **Status**: Dual implementation exists, needs consolidation

### Security Rules
- **RLS**: Row Level Security enabled in Supabase
- **Route Guards**: Role-based access protection
- **Data Isolation**: Owners see only their data, admins see all

---

## Database Integration

### Supabase Configuration
- **Project**: yplrudursbvzcdaroqly
- **Schema Status**: Complete (TASK-080b finished)
- **Frontend Integration**: Pending completion
- **Tables**: user_profiles, properties, bookings, notifications

### Key Files
- `supabase/migrations/` - Database schema and RLS policies
- `src/composables/supabase/useSupabaseAuth.ts` - Auth integration
- `src/stores/auth.ts` - Authentication state management

---

## Performance Achievements

### Verified Optimizations
- **Reactive Subscriptions**: 67% reduction (120 → 40)
- **Memory Usage**: 60% reduction in computed property duplication
- **CPU Load**: 70% reduction in redundant filtering operations
- **Mobile Battery**: 25% improvement
- **Bundle Sizes**: 400KB (full), 200KB (owner), 300KB (admin)

### Performance Monitoring
- Automatic component performance tracking
- Subscription counting per component
- Memory usage monitoring
- Bundle size analysis

---

## Quality Gates

### Pre-Production Requirements
- [ ] Zero TypeScript compilation errors
- [ ] 100% test pass rate (currently 97.8%)
- [ ] Clean production build
- [ ] Performance metrics maintained
- [ ] Security audit passed

### Code Standards
- **TypeScript**: Strict mode, all interfaces defined
- **Components**: Smart/dumb separation enforced
- **Testing**: Unit + integration + E2E coverage
- **Performance**: Automatic monitoring integration
- **Accessibility**: WCAG compliance for UI components

---

## Development Workflow

### Current Branch Strategy
- **Current**: main
- **Main**: main
- **Feature Branches**: feature/task-name

### Task Execution Pattern
1. **Analyze Impact**: Check role-based implications
2. **TypeScript First**: Ensure compilation success
5. **Documentation**: Update relevant references

---

## Critical File Locations

### Core Architecture
- `src/router/guards.ts` - Route protection and role validation
- `src/stores/auth.ts` - Authentication state management
- `src/types/` - TypeScript type definitions

### Component Examples
- `src/components/smart/owner/HomeOwner.vue` - Owner dashboard (working)
- `src/components/smart/admin/HomeAdmin.vue` - Admin dashboard (working)
- `src/components/smart/shared/Calendar.vue` - FullCalendar integration

### Configuration
- `vite.config.ts` - Build configuration with role-based splitting
- `supabase/config.toml` - Database configuration
- `package.json` - Dependencies and scripts

---

## Immediate Development Context

### Active Tasks
    - **TASK-064**: Supabase property persistence (pending, HIGH)

### Known Issues

- 2 test failures related to date field access
- Authentication dual implementation needs consolidation

### Success Criteria
- Production build succeeds
- All tests pass
- Performance metrics maintained
- Role-based architecture preserved

---

## Environment & Deployment

### Development Environment
```bash
# Required environment variables
VITE_SUPABASE_URL=https://yplrudursbvzcdaroqly.supabase.co
VITE_SUPABASE_ANON_KEY=[anon_key]
```

### Deployment Targets
- **Primary**: Vercel (recommended)
- **Requirements**: Static site hosting with SPA support

--
**Project Phase**: Production finalization  
**Architecture**: 100% role-based implementation complete  
**Critical Path**: TypeScript compilation → Supabase integration → Production deployment  
**Last Updated**: January 2025