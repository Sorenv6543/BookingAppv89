# Property Cleaning Scheduler - Project Overview

## Purpose
A Vue 3 + TypeScript property cleaning scheduler application with role-based architecture supporting Owner and Admin roles. The application manages property cleaning bookings with Supabase backend integration.

## Current Status
- **Status**: Production Ready ✅
- **TypeScript Compilation**: Working (production build succeeds)  
- **Tests**: All 89 tests passing (100% pass rate)
- **Supabase Integration**: Frontend integration activated
- **Performance**: 67% subscription reduction achieved (120 → 40)

## Key Features
- Role-based architecture (Owner/Admin)
- Property cleaning management
- FullCalendar integration for scheduling
- Supabase backend with PostgreSQL, Auth, RLS, Realtime
- PWA support with battery optimization
- Performance monitoring and optimization
- Comprehensive test suite

## Business Logic
- **Booking Types**: 'standard' | 'turn'
- **Booking Status**: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
- **Priority System**: 'low' | 'normal' | 'high' | 'urgent'
- **Role Permissions**: Owner (own data), Admin (all data)
- **Property Types**: 'apartment' | 'house' | 'condo' | 'townhouse'
- **Pricing Tiers**: 'basic' | 'standard' | 'premium' | 'luxury'

## Architecture Principles
- **Smart/Dumb Component Separation**: Smart components handle data/business logic, dumb components are pure UI
- **Role-Based Data Filtering**: All components automatically filter data by user role
- **Performance First**: ≤40 subscriptions, ≤100MB memory limits enforced
- **TypeScript Strict Mode**: Zero compilation errors required for production

## Current Challenges
- Production-ready with all major features implemented
- Continuous performance monitoring active
- Role-based security through Supabase RLS policies