# Property Cleaning Scheduler - Tech Stack

## Frontend Framework
- **Vue**: 3.4.15+ (Composition API)
- **TypeScript**: 5.3.3+ (Strict mode enabled)
- **Vite**: 5.0.12+ (Build tool and dev server)
- **Vuetify**: 3.8.8+ (Material Design UI components)

## State Management
- **Pinia**: 2.1.7+ (Primary state management)
- **Supabase Composables**: Data layer abstraction migrated from Pinia

## Backend & Database
- **Supabase**: 2.50.0+ (Backend-as-a-Service)
  - PostgreSQL database
  - Authentication & authorization
  - Row Level Security (RLS)
  - Realtime subscriptions
- **Database Schema**: Complete (TASK-080b finished)
- **Frontend Integration**: Activated and working

## UI & Calendar
- **FullCalendar**: 6.1.17+ (Vue3 integration)
  - Core, DayGrid, TimeGrid, List views
  - Interaction and event handling
- **Material Design Icons**: @mdi/font 7.4.47+
- **SASS**: scss preprocessing with modern API

## Testing Framework
- **Vitest**: 3.2.2+ (Unit testing, 89/89 tests passing)
- **Playwright**: E2E testing across browsers
- **@testing-library/vue**: 8.1.0+ (Component testing utilities)
- **@vue/test-utils**: 2.4.6+ (Vue-specific testing)
- **Happy DOM**: 17.6.3+ (DOM environment for testing)
- **Coverage**: V8 provider with text/json/html reporting

## Build & Development Tools
- **ESLint**: 9.29.0+ (Linting with Vue3 support)
- **TypeScript ESLint**: 8.34.0+ (TypeScript linting)
- **Prettier**: 3.5.3+ (Code formatting)
- **Vue DevTools**: 7.7.6+ (Vue development tools)

## PWA & Performance
- **Vite PWA**: 1.0.0+ (Progressive Web App)
- **Workbox**: Service worker and caching
- **Bundle Analysis**: Vite bundle analyzer
- **Performance Monitoring**: Custom performance tracking

## Package Manager
- **PNPM**: 10.10.0+ (Package management with workspaces)

## Development Environment
- **Node.js**: ES2020 target
- **Module System**: ESNext with bundler resolution
- **Path Aliases**: @ and domain-specific aliases configured
- **Source Maps**: Enabled for development, hidden for production