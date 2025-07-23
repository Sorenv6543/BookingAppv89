# Property Cleaning Scheduler - Claude Configuration

## Project Overview
A Vue 3 + TypeScript property cleaning scheduler application with role-based access (Owner/Admin) and Supabase integration.

## Tech Stack
- **Frontend**: Vue 3, TypeScript, Vuetify 3, Vite
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Calendar**: FullCalendar
- **State Management**: Pinia
- **Testing**: Vitest, Playwright
- **PWA**: Vite PWA Plugin

## Development Commands
```bash
# Development (http://localhost:3000)
npm run dev

# Build & Type Check
npm run build
npm run lint

# Testing
npm run test
npm run test:e2e
npm run test:performance

# Performance Analysis
npm run perf:analysis
```

## Key Architecture
- **Role-based components**: `/src/components/smart/admin/` and `/src/components/smart/owner/`
- **Composables**: Role-specific logic in `/src/composables/admin/` and `/src/composables/owner/`
- **Stores**: Pinia stores for auth, booking, property, user, ui
- **Supabase**: Authentication, database, and realtime features (project ref: yplrudursbvzcdaroqly)

## Important Files
- `src/router/guards.ts` - Route protection
- `src/composables/supabase/useSupabaseAuth.ts` - Auth integration
- `src/stores/auth.ts` - Authentication state
- `supabase/migrations/` - Database schema

## Branch Context
Current branch: `supabase-integration-point-v2`
Main branch: `main`