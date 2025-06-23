# SIMPLERBRACHARCH

# Product Requirements Document: Property Cleaning Scheduler

## 1. Executive Summary

### Problem Statement
A house cleaning business with 30-40 Airbnb/VRBO property owner clients currently experiences communication breakdowns that result in missed cleanings. Property owners manually coordinate checkout/checkin dates with the cleaning company, leading to inefficiencies and lost revenue.

### Solution Overview
A web-based scheduling platform that allows property owners to sync their Airbnb/VRBO calendars with the cleaning company's master dashboard, automatically scheduling cleaning windows based on checkout dates and cleaner availability.

### Business Impact
- **Eliminate missed cleanings** due to communication breakdowns
- **Reduce manual coordination** between 30-40 clients and cleaning company
- **Improve client retention** through better service reliability
- **Enable business scaling** beyond current client base
- **Platform Foundation**: Architecture designed for expansion to other service-based businesses (pest control, maintenance, landscaping, etc.)
- **Revenue Diversification**: Framework for licensing platform to similar businesses

---

## 2. Product Overview

### Target Users
**Primary Users:**
- **Property Owners** (30-40 existing clients): Airbnb/VRBO hosts who need cleaning between guest stays
- **Cleaning Company Admin**: Staff who coordinate and schedule cleaning teams

**User Personas:**
- **Property Owner "Sarah"**: Manages 2-3 Airbnb properties, checks booking calendar daily on mobile, wants automated solutions
- **Cleaning Manager "Mike"**: Oversees scheduling for entire cleaning operation, needs visibility into all upcoming jobs

### Core Value Propositions
- **For Property Owners**: "Never worry about cleaning coordination again"
- **For Cleaning Company**: "See all client needs in one master calendar"

---

## 3. Functional Requirements

### 3.1 Property Owner Portal

#### Property Management
- **Add New Property**: Name, address, cleaning duration estimate, special instructions
- **Edit Property Details**: Update information, cleaning preferences
- **Delete Properties**: Remove properties no longer managed
- **Property Status**: Active/inactive toggle

#### Booking Management
- **Manual Booking Entry**: Add checkout/checkin dates, guest count, special requests
- **Booking Types**: 
  - **Standard Booking**: Regular checkout → checkin with gap between guests
  - **Turn**: Same-day checkout and checkin (guest leaves, new guest arrives same day)
- **Edit Bookings**: Modify existing booking details and booking type
- **Delete Bookings**: Remove cancelled bookings
- **Booking Calendar View**: Visual calendar showing all bookings with turn indicators
- **Future Enhancement**: Connect Airbnb/VRBO calendars for automatic sync

#### Cleaning Schedule View
- **Personal Calendar**: View scheduled cleanings for their properties
- **Cleaning Status**: Pending, Scheduled, In Progress, Completed
- **Notifications**: Email alerts for upcoming cleanings

### 3.2 Cleaning Company Dashboard

#### Master Calendar View
- **All Client Bookings**: Unified view of all checkout dates across all 30-40 clients
- **Turn Identification**: Clear visual indicators for same-day turn bookings (high priority)
- **Cleaning Windows**: Automatically calculated based on checkout → checkin timing
- **Priority Scheduling**: 
  - **Turns**: Highest priority (same-day cleaning required)
  - **Standard**: Next checkin date determines cleaning urgency
- **Cleaner Availability**: Assign available cleaners to properties
- **Status Management**: Update cleaning status (Scheduled → In Progress → Complete)

#### Client Management
- **Client List**: All 30-40 property owners with their properties
- **Property Overview**: Total properties per client, sync status
- **Communication Log**: Notes and special instructions per property

#### Reporting & Analytics
- **Revenue Analytics**: Earnings tracking by property, client, and time period
- **Payment Insights**: Outstanding payment trends and collection efficiency
- **Equipment Usage**: Supply inventory optimization insights
- **Growth Tracking**: New booking trends and platform usage statistics

---

## 4. Technical Requirements

### 4.1 Platform Architecture
- **Frontend Framework**: Vue 3 with Vuetify 3 for UI components
- **Database & Backend**: Supabase (PostgreSQL database with built-in APIs)
- **Authentication**: Supabase Auth (built-in user management)
- **Hosting**: Supabase hosting for backend, frontend hosting TBD
- **Multi-tenant System**: Separate data isolation for each client using Supabase RLS (Row Level Security)
- **Scalable Architecture**: Designed for horizontal scaling and feature expansion
- **Modular Design**: Component-based architecture to support multiple service industries
- **Configuration-Driven**: Business rules and workflows configurable for different service types

### 4.2 Integrations
**Priority 1 (MVP):**
- Manual booking entry system
- FullCalendar.io integration for calendar views
- Email notifications (SendGrid/Mailgun)
- Vuetify 3 UI components

**Priority 2 (Phase 3):**
- Airbnb API or iCal feed integration
- VRBO iCal feed integration

**Priority 3 (Phase 5):**
- Stripe payment processing integration
- Automated invoicing system
- Property-specific instructions and special requests
- Equipment tracking and capacity planning
- Advanced notification system

### 4.3 Data Requirements
- **Property Data**: Name, address, cleaning duration, special instructions
- **Booking Data**: Checkout dates, checkin dates, guest count, **booking type (Standard/Turn)**, special requests
- **Property Data**: Name, address, cleaning duration, **property-specific instructions**, pricing tier
- **Financial Data**: Invoices, payments, outstanding balances, service pricing
- **Equipment Data**: Supply inventory, maintenance schedules, cleaner assignments
- **Cleaning Data**: Scheduled times, assigned cleaners, completion status

### 4.4 Security & Compliance
- **Data Encryption**: Supabase handles encryption in transit and at rest
- **User Authentication**: Supabase Auth with email/password authentication
- **Row Level Security**: Supabase RLS policies to ensure data isolation between clients
- **API Security**: Supabase built-in API security and rate limiting
- **Data Backup**: Supabase automated daily backups

---

## 5. User Experience Requirements

### 5.1 Design Principles
- **Simplicity First**: Non-tech-savvy users must find it intuitive
- **Mobile-Responsive**: Property owners often check schedules on phones
- **Clear Visual Hierarchy**: Easy to scan calendars and property lists
- **Minimal Clicks**: Common tasks in 3 clicks or fewer

### 5.2 Key User Flows

#### Property Owner Onboarding
1. Account creation with email verification
2. Add first property with basic details
3. Manually enter first booking (checkout/checkin dates)
4. Confirm cleaning is automatically scheduled correctly

#### Daily Usage - Property Owner
1. Log in → View dashboard with upcoming cleanings
2. Add new booking → Select booking type (Standard/Turn) → Enter dates → Save
3. Manage properties → Add/edit/delete properties
4. Update existing bookings and booking types as needed

#### Daily Usage - Cleaning Company
1. Log in → Master calendar view with all cleanings
2. **Priority view**: See all "turns" highlighted for urgent same-day cleaning
3. Assign cleaner to property → Update status
4. Filter by date/client/booking type → Plan daily routes

---

## 6. Success Metrics & KPIs

### 6.1 User Adoption
- **Property Owner Engagement**: % of clients actively using platform (target: 90%+)
- **Properties Connected**: Average properties per client (baseline: current manual process)
- **Calendar Sync Success**: % of successful calendar syncs (target: 95%+)

### 6.2 Business Impact
- **Revenue Growth**: Track earnings and payment collection efficiency
- **Operational Efficiency**: Equipment usage optimization and cost control
- **Platform Adoption**: Monitor new booking trends and usage patterns

### 6.3 Business Impact
- **Client Retention**: Maintain 95%+ of existing 30-40 clients
- **New Client Acquisition**: Platform as competitive advantage
- **Revenue Protection**: Eliminate lost revenue from missed cleanings

---

## 7. Implementation Plan

### Phase 1: MVP - Manual Booking System (Months 1-2)
- Property owner portal with manual booking entry
- Property management (add/edit/delete properties)
- Basic cleaning company dashboard with master calendar view
- Email notifications for scheduled cleanings
- Booking management (add/edit/delete bookings)

### Phase 2: Enhanced Dashboard & Reporting (Month 3)
- Advanced dashboard filtering and search
- Cleaning status management and tracking
- Basic reporting and analytics
- Mobile-responsive optimizations

### Phase 3: Airbnb Integration (Month 4)
- Airbnb API or iCal integration
- Automated calendar sync from Airbnb
- Sync status monitoring and error handling

### Phase 4: VRBO Integration & Advanced Features (Month 5+)
- VRBO iCal integration
- SMS notifications
- Advanced analytics and reporting
- API for future integrations

### Phase 5: Business Management Features (Months 6-8)
**Financial Management:**
- **Automated Invoicing**: Generate invoices based on completed cleanings
- **Payment Processing**: Stripe integration for automated payment collection
- **Payment Tracking**: Monitor outstanding payments, late fees

**Service Customization:**
- **Property-Specific Instructions**: Store detailed cleaning preferences per property
- **Special Requests**: Handle one-time additions (inside oven, refrigerator, etc.)
- **Pricing Tiers**: Different service levels (basic, deep clean, premium)

**Communication & Quality:**
- **Automated Notifications**: Send clients updates when cleaning starts/completes
- **Equipment Tracking**: Monitor cleaning supplies, equipment maintenance schedules
- **Capacity Planning**: Visualize team availability vs. booking demand

### Phase 6: Analytics & Business Intelligence (Months 9-10)
**Financial Analytics:**
- **Revenue Analytics**: Track earnings by property, client, time period
- **Payment Insights**: Outstanding payment trends, collection efficiency

**Operational Intelligence:**
- **Equipment Usage**: Supply inventory optimization insights
- **Growth Metrics**: New booking trends, platform usage statistics

---

## 8. Risk Assessment

### Technical Risks
- **API Reliability**: Airbnb/VRBO API changes or downtime
- **Mitigation**: Fallback to manual entry, multiple sync methods

### User Adoption Risks
- **Tech Resistance**: Some property owners may resist new platform
- **Mitigation**: Phased rollout, extensive onboarding support

### Business Risks
- **Scope Creep**: Adding features beyond core scheduling
- **Mitigation**: Strict MVP focus, feature roadmap discipline

---

## 9. Success Criteria

**Launch Readiness:**
- 100% of existing 30-40 clients onboarded
- Manual booking system fully functional
- Sub-2-second page load times
- Zero critical bugs in core booking and scheduling flow

**3-Month Post-Launch:**
- 50% reduction in missed cleanings through better coordination
- 80% reduction in manual scheduling coordination via phone/text
- 95%+ client satisfaction with platform
- All clients actively entering bookings manually
- Platform foundation ready for Airbnb/VRBO integration (Phase 3)

---

## 10. Appendix

### Competitive Analysis
- **Current State**: Manual phone/text coordination
- **Alternative Solutions**: Generic calendar tools, property management software
- **Competitive Advantage**: Purpose-built for cleaning service integration

### Technical Specifications
- **Frontend**: Vue 3 with Composition API + TypeScript
- **UI Framework**: Vuetify 3 for Material Design components
- **State Management**: Pinia for centralized state management with TypeScript
- **Routing**: Vue Router 4 with automatic file-based routing (pages directory)
- **Calendar Component**: FullCalendar.io Vue component for all calendar views
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **Backend**: Supabase Edge Functions (if needed) or direct database API calls
- **Authentication**: Supabase Auth with built-in user management
- **Hosting**: Supabase for backend services, Netlify/Vercel for frontend deployment
- **Real-time Updates**: Supabase real-time subscriptions for live calendar updates
- **Type Safety**: TypeScript with interfaces and Map data structures

### Frontend Architecture
**State Management (Pinia Stores):**
- **User Store**: User data, houses, user settings, calendar events (shared userId)
- **UI Store**: Modal states, sidebar states, loading states
- **Auth Store**: Authentication state and user session management

**Component Architecture:**
- **Layouts**: Header and persistent UI elements
- **Pages**: Auto-routed components from pages/ directory
- **Dumb Components**: Pure UI components that receive props
- **Smart Components**: Home.vue as main state orchestrator

**Business Logic (Composables):**
- **useHouses**: CRUD operations for properties (database + UI)
- **useAuth**: Authentication logic and user management
- **useCalendar**: Calendar event management and UI interactions
- **useBookings**: Booking creation, editing, deletion logic

**Single Source of Truth:**
- **Home.vue**: Main component orchestrating state flow
- Receives/emits from FullCalendar and Sidebar
- Manages props/state between stores and composables
- Central hub for all data flow

### Assumptions
- Property owners primarily use Airbnb (majority) and VRBO
- Current client base willing to adopt new technology with support
- Cleaning company has 1-2 staff members who will use admin dashboard
- No integration needed with existing cleaning company software systems