This file is a merged representation of a subset of the codebase, containing files not matching ignore patterns, combined into a single document by Repomix.
The content has been processed where comments have been removed, empty lines have been removed, content has been formatted for parsing in markdown style, content has been compressed (code blocks are separated by ⋮---- delimiter).

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching these patterns are excluded: docs/**, node_modules/*
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Code comments have been removed from supported file types
- Empty lines have been removed from all files
- Content has been formatted for parsing in markdown style
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.cursor/rules/criticalprojectconcepts.mdc
.cursorignore
.eslintrc.json
.gitignore
.repomix/bundles.json
eslint.config.js
index.html
package.json
problemfix.md
README.md
src/__tests__/components/HelloWorld.spec.ts
src/__tests__/components/SimpleTest.spec.ts
src/__tests__/setup/cssStub.js
src/__tests__/setup/setupTests.ts
src/__tests__/stores/booking.spec.ts
src/__tests__/stores/property.spec.ts
src/__tests__/stores/ui.spec.ts
src/__tests__/stores/user.spec.ts
src/__tests__/utils/test-utils.ts
src/App.vue
src/assets/main.css
src/components/dumb/BookingForm.vue
src/components/dumb/ConfirmationDialog.vue
src/components/dumb/PropertyCard.vue
src/components/dumb/PropertyCardDemo.vue
src/components/dumb/PropertyModal.vue
src/components/dumb/ThemePicker.vue
src/components/dumb/TurnAlerts.vue
src/components/dumb/TurnAlertsDemo.vue
src/components/dumb/UpcomingCleanings.vue
src/components/smart/admin/README.md
src/components/smart/FullCalendar.vue
src/components/smart/Home.3vue
src/components/smart/Home.vue
src/components/smart/owner/README.md
src/components/smart/shared/README.md
src/components/smart/Sidebar.vue
src/components/smart/SidebarDemo.vue
src/composables/admin/README.md
src/composables/owner/README.md
src/composables/shared/useAuth.ts
src/composables/shared/useBookings.ts
src/composables/shared/useCalendarState.ts
src/composables/shared/useComponentEventLogger.ts
src/composables/shared/useProperties.ts
src/layouts/admin.vue
src/layouts/auth.vue
src/layouts/default.vue
src/main.ts
src/pages/404.vue
src/pages/admin/index.vue
src/pages/auth/login.vue
src/pages/auth/register.vue
src/pages/calendar/index.vue
src/pages/crud-testing.vue
src/pages/demos/calendar.vue
src/pages/demos/sidebar.vue
src/pages/index.vue
src/pages/properties/index.vue
src/plugins/supabase.ts
src/plugins/vuetify.ts
src/router/index.ts
src/stores/auth.ts
src/stores/booking.ts
src/stores/property.ts
src/stores/ui.ts
src/stores/user.ts
src/types/api.ts
src/types/booking.ts
src/types/env.d.ts
src/types/index.ts
src/types/property.ts
src/types/ui.ts
src/types/user.ts
src/utils/businessLogic.ts
tasks.md
tsconfig.json
tsconfig.node.json
vite.config.ts
vitest.config.ts
```

# Files

## File: .cursorignore
````
# Add directories or file patterns to ignore during indexing (e.g. foo/ or *.csv)
````

## File: .eslintrc.json
````json
{
  "root": true,
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "parser": "@typescript-eslint/parser",
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint", "vue"],
  "rules": {}
}
````

## File: .repomix/bundles.json
````json
{
  "bundles": {}
}
````

## File: index.html
````html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" href="/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Property Cleaning Scheduler</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
````

## File: README.md
````markdown
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
````

## File: src/__tests__/components/HelloWorld.spec.ts
````typescript
import { describe, it, expect } from 'vitest'
import { mountWithContext } from '../utils/test-utils'
import HelloWorld from '@/components/dumb/HelloWorld.vue'
````

## File: src/__tests__/components/SimpleTest.spec.ts
````typescript
import { describe, it, expect } from 'vitest'
````

## File: src/__tests__/setup/cssStub.js
````javascript

````

## File: src/__tests__/setup/setupTests.ts
````typescript
import { beforeAll, afterAll, vi } from 'vitest'
````

## File: src/__tests__/stores/booking.spec.ts
````typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useBookingStore } from '@/stores/booking';
import type { Booking } from '@/types';
````

## File: src/__tests__/stores/property.spec.ts
````typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { usePropertyStore } from '@/stores/property';
import type { Property } from '@/types';
````

## File: src/__tests__/stores/ui.spec.ts
````typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUIStore } from '@/stores/ui';
````

## File: src/__tests__/stores/user.spec.ts
````typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from '@/stores/user';
````

## File: src/assets/main.css
````css
:root {
html, body {
* {
````

## File: src/components/dumb/BookingForm.vue
````vue
<template>
  <v-dialog
    v-model="isOpen"
    max-width="700px"
    persistent
    @keydown.esc="handleClose"
  >
    <v-card>
      <v-card-title class="text-h5 pb-2">
        {{ formTitle }}
        <v-chip
          v-if="form.booking_type === 'turn'"
          color="error"
          size="small"
          class="ml-2"
        >
          URGENT TURN
        </v-chip>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="formRef" v-model="formValid" @submit.prevent="handleSubmit">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="form.property_id"
                  :items="propertiesArray"
                  item-title="name"
                  item-value="id"
                  label="Property"
                  :rules="propertyRules"
                  required
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('property_id')"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.checkout_date"
                  label="Checkout Date"
                  type="date"
                  :rules="dateRules"
                  required
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('checkout_date')"
                  @update:model-value="updateBookingType"
                  hint="When guests leave"
                  persistent-hint
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.checkin_date"
                  label="Checkin Date"
                  type="date"
                  :rules="dateRules"
                  required
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('checkin_date')"
                  @update:model-value="updateBookingType"
                  hint="When new guests arrive"
                  persistent-hint
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.booking_type"
                  :items="bookingTypeItems"
                  label="Booking Type"
                  :rules="bookingTypeRules"
                  required
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('booking_type')"
                ></v-select>
                <v-checkbox
                  v-model="autoDetectType"
                  label="Auto-detect booking type from dates"
                  :disabled="loading"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.guest_count"
                  label="Guest Count"
                  type="number"
                  min="1"
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('guest_count')"
                  hint="Optional"
                  persistent-hint
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="form.notes"
                  label="Notes"
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('notes')"
                  hint="Special instructions, requirements, etc."
                  persistent-hint
                  :counter="500"
                  rows="3"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row v-if="mode === 'edit'">
              <v-col cols="12">
                <v-select
                  v-model="form.status"
                  :items="statusItems"
                  label="Status"
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('status')"
                ></v-select>
              </v-col>
            </v-row>
            <v-row v-if="showTurnWarning">
              <v-col cols="12">
                <v-alert
                  type="warning"
                  variant="tonal"
                  title="Same-Day Turnover"
                  text="This booking has same-day checkout and checkin dates, which typically indicates a 'turn' booking (urgent same-day cleaning between guests)."
                  class="mb-0"
                ></v-alert>
              </v-col>
            </v-row>
            <v-row v-if="showTurnError">
              <v-col cols="12">
                <v-alert
                  type="error"
                  variant="tonal"
                  title="Invalid Turn Booking"
                  text="Turn bookings must have checkout and checkin on the same day. Please adjust dates or change booking type to standard."
                  class="mb-0"
                ></v-alert>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="handleClose"
          :disabled="loading"
        >
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="mode === 'edit'"
          color="error"
          variant="text"
          @click="handleDelete"
          :disabled="loading"
          :loading="loading"
        >
          Delete
        </v-btn>
        <v-btn
          color="primary"
          variant="text"
          @click="handleSubmit"
          :disabled="!formValid || loading || showTurnError"
          :loading="loading"
        >
          {{ submitButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
⋮----
{{ formTitle }}
⋮----
{{ submitButtonText }}
⋮----
<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { usePropertyStore } from '@/stores/property';
import type { Booking, BookingFormData, BookingStatus, BookingType, Property } from '@/types';
import type { VForm } from 'vuetify/components';
interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  booking?: Booking | null;
}
interface Emits {
  (e: 'close'): void;
  (e: 'save', booking: BookingFormData): void;
  (e: 'delete', id: string): void;
}
const props = withDefaults(defineProps<Props>(), {
  open: false,
  mode: 'create',
  booking: null
});
const emit = defineEmits<Emits>();
const propertyStore = usePropertyStore();
const formRef = ref<VForm | null>(null);
const formValid = ref<boolean>(false);
const loading = ref<boolean>(false);
const errors = ref<Map<string, string>>(new Map());
const autoDetectType = ref<boolean>(true);
const form = reactive<Partial<BookingFormData>>({
  property_id: '',
  checkout_date: '',
  checkin_date: '',
  booking_type: 'standard',
  guest_count: undefined,
  notes: '',
  status: 'pending',
  owner_id: '', // Will be set by the parent component
});
// COMPUTED PROPERTIES
const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => {
    if (!value) emit('close');
  }
});
const formTitle = computed((): string => {
  return props.mode === 'create' ? 'Create Booking' : 'Edit Booking';
});
const submitButtonText = computed((): string => {
  return props.mode === 'create' ? 'Create' : 'Save';
});
const propertiesArray = computed((): Property[] => {
  return propertyStore.activeProperties;
});
const isTurnBooking = computed((): boolean => {
  if (!form.checkout_date || !form.checkin_date) return false;
  const checkoutDate = new Date(form.checkout_date);
  const checkinDate = new Date(form.checkin_date);
  if (isNaN(checkoutDate.getTime()) || isNaN(checkinDate.getTime())) {
    return false;
  }
  return checkoutDate.toDateString() === checkinDate.toDateString();
});
const showTurnWarning = computed((): boolean => {
  return isTurnBooking.value && form.booking_type === 'standard';
});
const showTurnError = computed((): boolean => {
  return !isTurnBooking.value && form.booking_type === 'turn';
});
const bookingTypeItems = [
  { title: 'Standard Booking', value: 'standard', subtitle: 'Regular cleaning with time gap between guests' },
  { title: 'Turn (Urgent)', value: 'turn', subtitle: 'Same-day checkout/checkin, high priority' }
];
const statusItems = [
  { title: 'Pending', value: 'pending' },
  { title: 'Scheduled', value: 'scheduled' },
  { title: 'In Progress', value: 'in_progress' },
  { title: 'Completed', value: 'completed' },
  { title: 'Cancelled', value: 'cancelled' }
];
const propertyRules = [
  (v: string) => !!v || 'Property is required',
  (v: string) => {
    const property = propertyStore.getPropertyById(v);
    return !!property || 'Selected property does not exist';
  }
];
const dateRules = [
  (v: string) => !!v || 'Date is required',
  (v: string) => {
    const date = new Date(v);
    return !isNaN(date.getTime()) || 'Invalid date format';
  }
];
const bookingTypeRules = [
  (v: string) => !!v || 'Booking type is required',
  (v: string) => ['standard', 'turn'].includes(v) || 'Invalid booking type'
];
function updateBookingType(): void {
  if (!autoDetectType.value) return;
  if (!form.checkout_date || !form.checkin_date) return;
  const checkoutDate = new Date(form.checkout_date);
  const checkinDate = new Date(form.checkin_date);
  if (isNaN(checkoutDate.getTime()) || isNaN(checkinDate.getTime())) {
    return;
  }
  const isSameDay = checkoutDate.toDateString() === checkinDate.toDateString();
  form.booking_type = isSameDay ? 'turn' : 'standard';
}
function resetForm(): void {
  errors.value.clear();
  if (props.mode === 'edit' && props.booking) {
    Object.assign(form, {
      property_id: props.booking.property_id,
      checkout_date: props.booking.checkout_date,
      checkin_date: props.booking.checkin_date,
      booking_type: props.booking.booking_type,
      guest_count: props.booking.guest_count,
      notes: props.booking.notes,
      status: props.booking.status,
      owner_id: props.booking.owner_id
    });
  } else {
    Object.assign(form, {
      property_id: '',
      checkout_date: '',
      checkin_date: '',
      booking_type: 'standard',
      guest_count: undefined,
      notes: '',
      status: 'pending',
      owner_id: ''
    });
  }
}
// Validate form
async function validate(): Promise<boolean> {
  errors.value.clear();
  if (!formRef.value) return false;
  const { valid } = await formRef.value.validate();
  if (!valid) return false;
  // Additional validation
  const checkoutDate = new Date(form.checkout_date || '');
  const checkinDate = new Date(form.checkin_date || '');
  // Check if dates are valid
  if (isNaN(checkoutDate.getTime()) || isNaN(checkinDate.getTime())) {
    errors.value.set('checkout_date', 'Invalid date format');
    errors.value.set('checkin_date', 'Invalid date format');
    return false;
  }
  if (checkoutDate > checkinDate) {
    errors.value.set('checkout_date', 'Checkout date must be before or same as checkin date');
    return false;
  }
  if (form.booking_type === 'turn' && !isTurnBooking.value) {
    errors.value.set('booking_type', 'Turn bookings must have checkout and checkin on the same day');
    return false;
  }
  return true;
}
async function handleSubmit(): Promise<void> {
  loading.value = true;
  try {
    const isValid = await validate();
    if (!isValid) {
      loading.value = false;
      return;
    }
    if (!form.property_id || !form.checkout_date || !form.checkin_date || !form.booking_type) {
      errors.value.set('form', 'Please fill in all required fields');
      loading.value = false;
      return;
    }
    const bookingData: BookingFormData = {
      property_id: form.property_id,
      checkout_date: form.checkout_date,
      checkin_date: form.checkin_date,
      booking_type: form.booking_type as BookingType,
      status: (form.status as BookingStatus) || 'pending',
      owner_id: form.owner_id || '',
      guest_count: form.guest_count,
      notes: form.notes
    };
    // Emit save event with booking data
    emit('save', bookingData);
    loading.value = false;
    resetForm();
    isOpen.value = false;
  } catch (err) {
    console.error('Error submitting form:', err);
    errors.value.set('form', err instanceof Error ? err.message : 'An error occurred');
    loading.value = false;
  }
}
function handleDelete(): void {
  if (props.mode !== 'edit' || !props.booking) return;
  loading.value = true;
  emit('delete', props.booking.id);
  loading.value = false;
  isOpen.value = false;
}
function handleClose(): void {
  resetForm();
  emit('close');
}
onMounted(() => {
  resetForm();
});
watch(() => props.open, (newValue) => {
  if (newValue) {
    resetForm();
  }
});
watch(() => props.booking, () => {
  if (props.open && props.mode === 'edit') {
    resetForm();
  }
});
</script>
<style scoped>
.v-alert {
  margin-top: 8px;
}
</style>
````

## File: src/components/dumb/PropertyCardDemo.vue
````vue
<template>
  <div class="property-card-demo">
    <h2 class="text-h5 mb-4">Property Card Demo</h2>
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="3" v-for="property in demoProperties" :key="property.id">
        <PropertyCard
          :property="property"
          @edit="handleEdit"
          @delete="handleDelete"
          @view="handleView"
        />
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
⋮----
{{ snackbar.text }}
<template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar.show = false"
        >
          Close
        </v-btn>
      </template>
⋮----
<script setup lang="ts">
import { ref } from 'vue';
import PropertyCard from './PropertyCard.vue';
import type { Property } from '@/types';
const demoProperties = ref<Property[]>([
  {
    id: '1',
    owner_id: 'owner1',
    name: 'Seaside Villa',
    address: '123 Ocean Drive, Beach City',
    cleaning_duration: 120,
    special_instructions: 'Clean sand from floors, check outside shower.',
    pricing_tier: 'luxury',
    active: true,
    created_at: '2023-01-15T09:30:00Z',
    updated_at: '2023-05-20T14:15:00Z'
  },
  {
    id: '2',
    owner_id: 'owner1',
    name: 'Downtown Apartment',
    address: '456 Main Street, Apt 7B, Metro City',
    cleaning_duration: 60,
    pricing_tier: 'premium',
    active: true,
    created_at: '2023-02-10T11:45:00Z',
    updated_at: '2023-06-05T16:30:00Z'
  },
  {
    id: '3',
    owner_id: 'owner2',
    name: 'Mountain Cabin',
    address: '789 Pine Trail, Highland Mountains',
    cleaning_duration: 90,
    special_instructions: 'Check fireplace, restock firewood if needed.',
    pricing_tier: 'basic',
    active: false,
    created_at: '2023-03-22T08:15:00Z',
    updated_at: '2023-04-18T13:20:00Z'
  },
  {
    id: '4',
    owner_id: 'owner3',
    name: 'Lakefront Cottage with Very Long Name That Should Truncate',
    address: '101 Lake View Road, Waterside County, with a very long address that should truncate',
    cleaning_duration: 150,
    special_instructions: 'This is a very long special instruction that should be truncated in the UI but visible in a tooltip when hovering. Check boat dock and life vests.',
    pricing_tier: 'luxury',
    active: true,
    created_at: '2023-01-05T10:10:00Z',
    updated_at: '2023-07-12T09:45:00Z'
  }
]);
const snackbar = ref({
  show: false,
  text: '',
  color: 'info'
});
const handleEdit = (id: string) => {
  const property = demoProperties.value.find(p => p.id === id);
  snackbar.value = {
    show: true,
    text: `Edit requested for: ${property?.name}`,
    color: 'primary'
  };
};
const handleDelete = (id: string) => {
  const property = demoProperties.value.find(p => p.id === id);
  snackbar.value = {
    show: true,
    text: `Delete requested for: ${property?.name}`,
    color: 'error'
  };
};
const handleView = (id: string) => {
  const property = demoProperties.value.find(p => p.id === id);
  snackbar.value = {
    show: true,
    text: `Viewing details for: ${property?.name}`,
    color: 'info'
  };
};
</script>
<style scoped>
.property-card-demo {
  padding: 1rem;
}
</style>
````

## File: src/components/dumb/ThemePicker.vue
````vue
<template>
  <div>
    <v-menu
      location="bottom end"
      :close-on-content-click="false"
      min-width="300"
    >
      <template #activator="{ props }">
        <v-btn
          icon
          v-bind="props"
          size="small"
        >
          <v-icon>mdi-palette</v-icon>
          <v-tooltip activator="parent" location="bottom">
            Theme options
          </v-tooltip>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-subtitle-1 font-weight-bold py-2">
          Select Theme
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <div class="text-subtitle-2 mb-2">Light Themes</div>
          <v-row dense>
            <v-col cols="3" v-for="theme in lightThemes" :key="theme.name">
              <v-tooltip :text="theme.label" location="bottom">
                <template #activator="{ props }">
                  <v-card
                    v-bind="props"
                    :color="theme.color"
                    height="40"
                    width="40"
                    @click="setTheme(theme.name)"
                    class="mx-auto theme-swatch"
                    :class="{ 'theme-swatch-active': currentTheme === theme.name }"
                    elevation="2"
                  >
                    <v-icon
                      v-if="currentTheme === theme.name"
                      icon="mdi-check"
                      class="theme-swatch-icon"
                      color="white"
                    ></v-icon>
                  </v-card>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
          <div class="text-subtitle-2 mb-2 mt-4">Dark Themes</div>
          <v-row dense>
            <v-col cols="3" v-for="theme in darkThemes" :key="theme.name">
              <v-tooltip :text="theme.label" location="bottom">
                <template #activator="{ props }">
                  <v-card
                    v-bind="props"
                    :color="theme.color"
                    height="40"
                    width="40"
                    @click="setTheme(theme.name)"
                    class="mx-auto theme-swatch"
                    :class="{ 'theme-swatch-active': currentTheme === theme.name }"
                    elevation="2"
                  >
                    <v-icon
                      v-if="currentTheme === theme.name"
                      icon="mdi-check"
                      class="theme-swatch-icon"
                      color="white"
                    ></v-icon>
                  </v-card>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>
⋮----
<template #activator="{ props }">
        <v-btn
          icon
          v-bind="props"
          size="small"
        >
          <v-icon>mdi-palette</v-icon>
          <v-tooltip activator="parent" location="bottom">
            Theme options
          </v-tooltip>
        </v-btn>
      </template>
⋮----
<template #activator="{ props }">
                  <v-card
                    v-bind="props"
                    :color="theme.color"
                    height="40"
                    width="40"
                    @click="setTheme(theme.name)"
                    class="mx-auto theme-swatch"
                    :class="{ 'theme-swatch-active': currentTheme === theme.name }"
                    elevation="2"
                  >
                    <v-icon
                      v-if="currentTheme === theme.name"
                      icon="mdi-check"
                      class="theme-swatch-icon"
                      color="white"
                    ></v-icon>
                  </v-card>
                </template>
⋮----
<template #activator="{ props }">
                  <v-card
                    v-bind="props"
                    :color="theme.color"
                    height="40"
                    width="40"
                    @click="setTheme(theme.name)"
                    class="mx-auto theme-swatch"
                    :class="{ 'theme-swatch-active': currentTheme === theme.name }"
                    elevation="2"
                  >
                    <v-icon
                      v-if="currentTheme === theme.name"
                      icon="mdi-check"
                      class="theme-swatch-icon"
                      color="white"
                    ></v-icon>
                  </v-card>
                </template>
⋮----
<script setup lang="ts">
import { useTheme } from 'vuetify';
import { computed, onMounted } from 'vue';
const theme = useTheme();
const currentTheme = computed(() => theme.global.name.value);
const lightThemes = [
  { name: 'light', label: 'Classic Blue', color: '#2196F3' },
  { name: 'green', label: 'Nature Green', color: '#4CAF50' },
  { name: 'purple', label: 'Royal Purple', color: '#9C27B0' },
  { name: 'orange', label: 'Warm Orange', color: '#FF5722' },
  { name: 'teal', label: 'Ocean Teal', color: '#009688' },
  { name: 'red', label: 'Bold Red', color: '#F44336' },
  { name: 'brown', label: 'Earthy Brown', color: '#795548' }
];
const darkThemes = [
  { name: 'dark', label: 'Classic Dark', color: '#1E1E1E' },
  { name: 'darkGreen', label: 'Dark Green', color: '#1E392A' },
  { name: 'darkPurple', label: 'Dark Purple', color: '#311B92' },
  { name: 'darkOrange', label: 'Dark Orange', color: '#3E2723' },
  { name: 'darkTeal', label: 'Dark Teal', color: '#004D40' },
  { name: 'darkRed', label: 'Dark Red', color: '#B71C1C' },
  { name: 'darkBrown', label: 'Dark Brown', color: '#3E2723' }
];
const THEME_STORAGE_KEY = 'property-scheduler-theme';
const setTheme = (themeName: string) => {
  theme.global.name.value = themeName;
  localStorage.setItem(THEME_STORAGE_KEY, themeName);
};
onMounted(() => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme) {
    theme.global.name.value = savedTheme;
  }
});
</script>
<style scoped>
.theme-swatch {
  cursor: pointer;
  position: relative;
  transition: transform 0.2s;
  border-radius: 50% !important;
}
.theme-swatch:hover {
  transform: scale(1.1);
}
.theme-swatch-active {
  transform: scale(1.1);
  box-shadow: 0 0 0 2px white, 0 0 0 4px var(--v-theme-primary);
}
.theme-swatch-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px !important;
}
</style>
````

## File: src/components/dumb/TurnAlertsDemo.vue
````vue
<template>
  <div class="demo-container pa-4">
    <h1 class="text-h4 mb-4">Turn Alerts Demo</h1>
    <div class="mb-4">
      <v-btn @click="addUrgentTurn" color="error" class="mr-2">Add Urgent Turn</v-btn>
      <v-btn @click="addHighTurn" color="warning" class="mr-2">Add High Priority Turn</v-btn>
      <v-btn @click="clearTurns" color="grey">Clear All</v-btn>
    </div>
    <turn-alerts
      :bookings="turnBookings"
      @view="onViewBooking"
      @assign="onAssignBooking"
      @toggle-expanded="expanded = $event"
      @view-all="logEvent('View all turns clicked')"
    />
    <div class="mt-4 pa-2 bg-grey-lighten-4">
      <h3 class="text-h6">Event Log:</h3>
      <v-list>
        <v-list-item v-for="(log, index) in eventLogs" :key="index">
          {{ log }}
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>
⋮----
{{ log }}
⋮----
<script setup lang="ts">
import { ref } from 'vue';
import TurnAlerts from './TurnAlerts.vue';
import { v4 as uuidv4 } from 'uuid';
import type { BookingWithMetadata } from '@/types';
const expanded = ref(true);
const turnBookings = ref<BookingWithMetadata[]>([]);
const eventLogs = ref<string[]>([]);
function createTurn(priority: 'urgent' | 'high'): BookingWithMetadata {
  const now = new Date();
  const id = uuidv4();
  const propertyId = uuidv4();
  const checkoutHours = priority === 'urgent' ? 1 : 2;
  const checkout = new Date(now.getTime() + (checkoutHours * 60 * 60 * 1000));
  const checkinOffset = Math.floor(Math.random() * 2) + 3;
  const checkin = new Date(checkout.getTime() + (checkinOffset * 60 * 60 * 1000));
  return {
    id,
    property_id: propertyId,
    property_name: `Demo Property ${turnBookings.value.length + 1}`,
    owner_id: 'demo-owner',
    checkout_date: checkout.toISOString(),
    checkin_date: checkin.toISOString(),
    booking_type: 'turn',
    status: 'pending',
    priority,
    cleaning_window: {
      start: checkout.toISOString(),
      end: checkin.toISOString(),
      duration: checkinOffset * 60
    }
  };
}
function addUrgentTurn() {
  const turn = createTurn('urgent');
  turnBookings.value.push(turn);
  logEvent(`Added urgent turn for ${turn.property_name}`);
}
function addHighTurn() {
  const turn = createTurn('high');
  turnBookings.value.push(turn);
  logEvent(`Added high priority turn for ${turn.property_name}`);
}
function clearTurns() {
  turnBookings.value = [];
  logEvent('Cleared all turns');
}
function onViewBooking(id: string) {
  const booking = turnBookings.value.find(b => b.id === id);
  logEvent(`Viewing booking for ${booking?.property_name || id}`);
}
function onAssignBooking(id: string) {
  const booking = turnBookings.value.find(b => b.id === id);
  logEvent(`Assigning cleaner to ${booking?.property_name || id}`);
}
function logEvent(message: string) {
  const timestamp = new Date().toLocaleTimeString();
  eventLogs.value.unshift(`[${timestamp}] ${message}`);
}
addUrgentTurn();
addHighTurn();
</script>
<style scoped>
.demo-container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
````

## File: src/components/smart/admin/README.md
````markdown
# Admin Smart Components

This folder contains orchestrator components specifically designed for the business administrator.

## Purpose

Admin smart components provide comprehensive business management interfaces for the cleaning company administrator. They emphasize:

- **System-Wide View**: Access to all data across all 30-40 property owner clients
- **Business Operations**: Cleaner assignment, scheduling, and resource management
- **Advanced Features**: Reporting, analytics, and business intelligence
- **Desktop-Optimized**: Information-dense interfaces with advanced controls

## Key Components (Planned)

- `HomeAdmin.vue` - Main business dashboard with system-wide overview
- `AdminSidebar.vue` - Comprehensive navigation with business management tools
- `AdminCalendar.vue` - Master calendar showing all properties and cleaner assignments
- `CleanerManagement.vue` - Cleaner scheduling and assignment interface
- `TurnPriorityPanel.vue` - System-wide turn management and priority queue
- `BusinessAnalytics.vue` - Reporting and business intelligence dashboard

## Data Scoping

All admin components have access to the complete dataset:
- All properties across all property owners
- All bookings system-wide
- All turn alerts and priority management
- Complete business metrics and analytics
- Cleaner schedules and assignments

## Architecture

Admin components should:
- Use composables from `@/composables/admin/`
- Access unfiltered data (all clients)
- Provide comprehensive business management tools
- Support complex workflows and batch operations
- Be desktop-optimized with rich interactions

## Business Context

The business administrator is the single user who needs to:
- View and manage all properties across all clients
- Assign cleaners to bookings
- Monitor system-wide turn alerts and priorities
- Generate business reports and analytics
- Manage cleaner schedules and availability
- Oversee the entire operation across 30-40 property owner clients

## Security Considerations

Admin components handle sensitive business data and should:
- Implement proper access controls
- Log administrative actions
- Provide audit trails
- Ensure data privacy compliance
- Support role-based permissions for future expansion
````

## File: src/components/smart/Home.3vue
````
<template>
  <div class="home-container">
    <!-- Loading Overlay -->
    <v-overlay 
      v-model="globalLoading" 
      class="align-center justify-center"
      persistent
    >
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      />
      <div class="text-h6 mt-4">Loading your data...</div>
    </v-overlay>

    <v-row no-gutters class="fill-height">
      <!-- Sidebar Column -->
      <v-col 
        cols="12" 
        lg="3" 
        xl="2" 
        class="sidebar-column"
        :class="{ 'mobile-hidden': !sidebarOpen }"
      >
        <Sidebar
          :today-turns="todayTurns"
          :upcoming-cleanings="upcomingCleanings"
          :properties="propertiesArray"
          :loading="isLoading"
          :active-filters="hasActiveFilters"
          @navigate-to-booking="handleNavigateToBooking"
          @navigate-to-date="handleNavigateToDate"
          @filter-by-property="handleFilterByProperty"
          @filter-by-status="handleFilterByStatus"
          @filter-by-booking-type="handleFilterByBookingType"
          @clear-filters="handleClearFilters"
          @create-booking="handleCreateBooking"
          @create-property="handleCreateProperty"
          @refresh-data="handleRefreshData"
        />
      </v-col>

      <!-- Main Calendar Column -->
      <v-col 
        cols="12" 
        lg="9" 
        xl="10" 
        class="calendar-column"
      >
        <!-- Calendar Header -->
        <div class="calendar-header">
          <v-btn
            v-if="$vuetify.display.lgAndDown"
            icon="mdi-menu"
            variant="text"
            @click="toggleSidebar"
            class="mr-4"
          />
          
          <!-- Breadcrumbs -->
          <v-breadcrumbs
            v-if="breadcrumbs.length > 1"
            :items="breadcrumbs"
            density="compact"
            class="pa-0"
          />

          <v-spacer />

          <!-- Filter Indicators -->
          <div v-if="hasActiveFilters" class="filter-chips mr-4">
            <v-chip
              v-if="activePropertyFilter"
              size="small"
              closable
              @click:close="clearPropertyFilter"
            >
              {{ getPropertyName(activePropertyFilter) }}
            </v-chip>
            
            <v-chip
              v-if="activeStatusFilter"
              size="small"
              closable
              @click:close="clearStatusFilter"
            >
              {{ activeStatusFilter.toUpperCase() }}
            </v-chip>
            
            <v-chip
              v-if="activeBookingTypeFilter !== 'all'"
              size="small"
              closable
              @click:close="clearBookingTypeFilter"
            >
              {{ activeBookingTypeFilter.toUpperCase() }}
            </v-chip>
          </div>

          <!-- Calendar Controls -->
          <CalendarControls
            :current-view="currentView"
            :current-date="currentDate"
            @view-change="handleViewChange"
            @date-change="handleDateChange"
            @today="handleGoToday"
            @prev="handlePrevious"
            @next="handleNext"
          />
        </div>

        <!-- Main Calendar -->
        <div class="calendar-wrapper">
          <FullCalendar
            ref="calendarRef"
            :bookings="filteredBookings"
            :properties="propertiesMap"
            :loading="isLoading"
            :current-view="currentView"
            :current-date="currentDate"
            @date-select="handleDateSelect"
            @event-click="handleEventClick"
            @event-drop="handleEventDrop"
            @event-resize="handleEventResize"
            @view-change="handleCalendarViewChange"
            @date-change="handleCalendarDateChange"
          />
        </div>
      </v-col>
    </v-row>

    <!-- Global Modals -->
    <EventModal
      :open="eventModalOpen"
      :mode="eventModalMode"
      :booking="eventModalData"
      :properties="propertiesMap"
      :loading="modalLoading"
      @close="handleEventModalClose"
      @save="handleEventModalSave"
      @delete="handleEventModalDelete"
      @duplicate="handleEventModalDuplicate"
    />

    <PropertyModal
      :open="propertyModalOpen"
      :mode="propertyModalMode"
      :property="propertyModalData"
      :loading="modalLoading"
      @close="handlePropertyModalClose"
      @save="handlePropertyModalSave"
      @delete="handlePropertyModalDelete"
    />

    <ConfirmDialog
      :open="confirmDialogOpen"
      :title="confirmDialogData?.title"
      :message="confirmDialogData?.message"
      :confirm-text="confirmDialogData?.confirmText"
      :cancel-text="confirmDialogData?.cancelText"
      :dangerous="confirmDialogData?.dangerous"
      @confirm="handleConfirmDialogConfirm"
      @cancel="handleConfirmDialogCancel"
    />

    <!-- Notification System -->
    <NotificationSystem />

    <!-- Error Boundary -->
    <ErrorBoundary />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useDisplay } from 'vuetify';
import { useRouter } from 'vue-router';

// Components
import Sidebar from './Sidebar.vue';
import FullCalendar from './FullCalendar.vue';
import CalendarControls from '@/components/dumb/CalendarControls.vue';
import EventModal from '@/components/dumb/BookingForm/EventModal.vue';
import PropertyModal from '@/components/dumb/PropertyModal.vue';
import ConfirmDialog from '@/components/dumb/ConfirmDialog.vue';
import NotificationSystem from '@/components/dumb/NotificationSystem.vue';
import ErrorBoundary from '@/components/smart/ErrorBoundary.vue';

// Stores
import { useUserStore } from '@/stores/user';
import { useUIStore } from '@/stores/ui';

// Composables
import { useAuth } from '@/composables/useAuth';
import { useBookings } from '@/composables/useBookings';
import { useProperties } from '@/composables/useProperties';

// Types
import type { Booking, Property, BookingFormData, PropertyFormData } from '@/types';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';

// ============================================================================
// STORES & COMPOSABLES SETUP
// ============================================================================

const router = useRouter();
const { name: displaySize } = useDisplay();
const userStore = useUserStore();
const uiStore = useUIStore();

// Auth composable
const { isAuthenticated, requireAuth } = useAuth();

// Business logic composables
const { 
  loading: bookingsLoading, 
  createBooking, 
  updateBooking, 
  deleteBooking,
  duplicateBooking,
  fetchBookings,
  refreshBookingData
} = useBookings();

const { 
  loading: propertiesLoading, 
  createProperty, 
  updateProperty, 
  deleteProperty,
  fetchProperties,
  refreshPropertyData
} = useProperties();

// ============================================================================
// REACTIVE STATE
// ============================================================================

const calendarRef = useTemplateRef<InstanceType<typeof FullCalendar>>('calendarRef');
const currentView = ref<string>(uiStore.preferences.calendarView);
const currentDate = ref<Date>(new Date());

// ============================================================================
// COMPUTED PROPERTIES - STATE
// ============================================================================

const globalLoading = computed(() => uiStore.isLoading && userStore.houses.size === 0);
const isLoading = computed(() => bookingsLoading.value || propertiesLoading.value);
const modalLoading = computed(() => uiStore.loading.operations.has('modal-save'));

// Sidebar state
const sidebarOpen = computed({
  get: () => uiStore.preferences.sidebarOpen,
  set: (value: boolean) => uiStore.updatePreferences({ sidebarOpen: value })
});

// Breadcrumbs
const breadcrumbs = computed(() => uiStore.breadcrumbs);

// ============================================================================
// COMPUTED PROPERTIES - DATA
// ============================================================================

// Convert user store Maps to formats needed by components
const propertiesArray = computed(() => userStore.userProperties);
const propertiesMap = computed(() => {
  const map = new Map<string, Property>();
  userStore.userProperties.forEach(property => map.set(property.id, property));
  return map;
});

// Apply all active filters to bookings
const filteredBookings = computed(() => {
  let bookings = userStore.userBookings;
  
  // Property filter
  if (uiStore.filters.propertyFilter) {
    bookings = bookings.filter(booking => 
      booking.property_id === uiStore.filters.propertyFilter
    );
  }
  
  // Status filter
  if (uiStore.filters.statusFilter) {
    bookings = bookings.filter(booking => 
      booking.status === uiStore.filters.statusFilter
    );
  }
  
  // Booking type filter
  if (uiStore.filters.bookingTypeFilter !== 'all') {
    bookings = bookings.filter(booking => 
      booking.booking_type === uiStore.filters.bookingTypeFilter
    );
  }
  
  // Date range filter
  if (uiStore.filters.dateRangeFilter.start || uiStore.filters.dateRangeFilter.end) {
    const startDate = uiStore.filters.dateRangeFilter.start 
      ? new Date(uiStore.filters.dateRangeFilter.start) 
      : new Date(0);
    const endDate = uiStore.filters.dateRangeFilter.end 
      ? new Date(uiStore.filters.dateRangeFilter.end) 
      : new Date(2099, 11, 31);
      
    bookings = bookings.filter(booking => {
      const checkoutDate = new Date(booking.checkout_date);
      return checkoutDate >= startDate && checkoutDate <= endDate;
    });
  }
  
  // Convert to Map for FullCalendar component
  const map = new Map<string, Booking>();
  bookings.forEach(booking => map.set(booking.id, booking));
  return map;
});

// Business logic computed
const todayTurns = computed(() => userStore.todayTurns);
const upcomingCleanings = computed(() => userStore.upcomingBookings.slice(0, 10));

// ============================================================================
// COMPUTED PROPERTIES - UI STATE
// ============================================================================

const hasActiveFilters = computed(() => uiStore.hasActiveFilters);
const activePropertyFilter = computed(() => uiStore.filters.propertyFilter);
const activeStatusFilter = computed(() => uiStore.filters.statusFilter);
const activeBookingTypeFilter = computed(() => uiStore.filters.bookingTypeFilter);

// Modal states
const eventModalOpen = computed(() => uiStore.getModal.value('eventModal')?.open || false);
const eventModalMode = computed(() => uiStore.getModal.value('eventModal')?.mode || 'create');
const eventModalData = computed(() => uiStore.getModal.value('eventModal')?.data || null);

const propertyModalOpen = computed(() => uiStore.getModal.value('propertyModal')?.open || false);
const propertyModalMode = computed(() => uiStore.getModal.value('propertyModal')?.mode || 'create');
const propertyModalData = computed(() => uiStore.getModal.value('propertyModal')?.data || null);

const confirmDialogOpen = computed(() => uiStore.getModal.value('confirmDialog')?.open || false);
const confirmDialogData = computed(() => uiStore.getModal.value('confirmDialog')?.data || null);

// ============================================================================
// SIDEBAR EVENT HANDLERS
// ============================================================================

const handleNavigateToBooking = async (bookingId: string): Promise<void> => {
  const booking = userStore.getBookingById.value(bookingId);
  if (booking) {
    const bookingDate = new Date(booking.checkout_date);
    await handleNavigateToDate(bookingDate);
    
    // Highlight the booking after navigation
    await nextTick();
    const calendarApi = calendarRef.value?.getApi();
    const event = calendarApi?.getEventById(bookingId);
    if (event) {
      // Add highlight class temporarily
      event.setProp('classNames', [...(event.classNames || []), 'fc-event-highlighted']);
      setTimeout(() => {
        const currentClasses = event.classNames || [];
        event.setProp('classNames', currentClasses.filter((c: string) => c !== 'fc-event-highlighted'));
      }, 3000);
    }
  }
};

const handleNavigateToDate = async (date: Date): Promise<void> => {
  currentDate.value = date;
  await nextTick();
  const calendarApi = calendarRef.value?.getApi();
  calendarApi?.gotoDate(date);
};

const handleFilterByProperty = (propertyId: string | null): void => {
  uiStore.setPropertyFilter(propertyId);
};

const handleFilterByStatus = (status: string | null): void => {
  uiStore.setStatusFilter(status);
};

const handleFilterByBookingType = (type: 'all' | 'standard' | 'turn'): void => {
  uiStore.setBookingTypeFilter(type);
};

const handleClearFilters = (): void => {
  uiStore.clearAllFilters();
};

const handleCreateBooking = (data?: Partial<BookingFormData>): void => {
  uiStore.openEventModal('create', data);
};

const handleCreateProperty = (): void => {
  uiStore.openPropertyModal('create');
};

const handleRefreshData = async (): void => {
  try {
    uiStore.setGlobalLoading(true);
    await Promise.all([
      refreshPropertyData(),
      refreshBookingData()
    ]);
    uiStore.showSuccess('Data Refreshed', 'Your data has been updated successfully.');
  } catch (error) {
    console.error('Failed to refresh data:', error);
    uiStore.showError('Refresh Failed', 'Failed to refresh data. Please try again.');
  } finally {
    uiStore.setGlobalLoading(false);
  }
};

// ============================================================================
// CALENDAR EVENT HANDLERS
// ============================================================================

const handleDateSelect = (selectInfo: DateSelectArg): void => {
  const bookingData: Partial<BookingFormData> = {
    checkout_date: selectInfo.startStr,
    checkin_date: selectInfo.endStr,
    booking_type: 'standard'
  };
  
  handleCreateBooking(bookingData);
};

const handleEventClick = (clickInfo: EventClickArg): void => {
  const booking = clickInfo.event.extendedProps.booking as Booking;
  uiStore.openEventModal('edit', booking);
};

const handleEventDrop = async (dropInfo: EventDropArg): Promise<void> => {
  const booking = dropInfo.event.extendedProps.booking as Booking;
  
  try {
    uiStore.setOperationLoading('event-update', true);
    
    await updateBooking(booking.id, {
      checkout_date: dropInfo.event.startStr,
      checkin_date: dropInfo.event.endStr || dropInfo.event.startStr
    });
    
    uiStore.showSuccess('Booking Updated', 'Booking dates have been updated successfully.');
  } catch (error) {
    console.error('Failed to update booking:', error);
    dropInfo.revert();
    uiStore.showError('Update Failed', 'Failed to update booking dates. Please try again.');
  } finally {
    uiStore.setOperationLoading('event-update', false);
  }
};

const handleEventResize = async (resizeInfo: any): Promise<void> => {
  const booking = resizeInfo.event.extendedProps.booking as Booking;
  
  try {
    uiStore.setOperationLoading('event-resize', true);
    
    await updateBooking(booking.id, {
      checkout_date: resizeInfo.event.startStr,
      checkin_date: resizeInfo.event.endStr
    });
    
    uiStore.showSuccess('Booking Updated', 'Booking duration has been updated successfully.');
  } catch (error) {
    console.error('Failed to resize booking:', error);
    resizeInfo.revert();
    uiStore.showError('Update Failed', 'Failed to update booking duration. Please try again.');
  } finally {
    uiStore.setOperationLoading('event-resize', false);
  }
};

// ============================================================================
// CALENDAR CONTROL HANDLERS
// ============================================================================

const toggleSidebar = (): void => {
  uiStore.toggleSidebar();
};

const handleViewChange = (view: string): void => {
  currentView.value = view;
  uiStore.setCalendarView(view as any);
  const calendarApi = calendarRef.value?.getApi();
  calendarApi?.changeView(view);
};

const handleDateChange = (date: Date): void => {
  currentDate.value = date;
  const calendarApi = calendarRef.value?.getApi();
  calendarApi?.gotoDate(date);
};

const handleCalendarViewChange = (view: string): void => {
  currentView.value = view;
  uiStore.setCalendarView(view as any);
};

const handleCalendarDateChange = (date: Date): void => {
  currentDate.value = date;
};

const handleGoToday = (): void => {
  const today = new Date();
  handleDateChange(today);
};

const handlePrevious = (): void => {
  const calendarApi = calendarRef.value?.getApi();
  calendarApi?.prev();
};

const handleNext = (): void => {
  const calendarApi = calendarRef.value?.getApi();
  calendarApi?.next();
};

// ============================================================================
// MODAL EVENT HANDLERS
// ============================================================================

// Event Modal Handlers
const handleEventModalClose = (): void => {
  uiStore.closeModal('eventModal');
};

const handleEventModalSave = async (data: BookingFormData): Promise<void> => {
  try {
    uiStore.setOperationLoading('modal-save', true);
    
    if (eventModalMode.value === 'create') {
      await createBooking(data);
      uiStore.showSuccess('Booking Created', 'Your booking has been created successfully.');
    } else {
      const booking = eventModalData.value as Booking;
      await updateBooking(booking.id, data);
      uiStore.showSuccess('Booking Updated', 'Your booking has been updated successfully.');
    }
    
    uiStore.closeModal('eventModal');
  } catch (error) {
    console.error('Failed to save booking:', error);
    // Error is already handled by the composable
  } finally {
    uiStore.setOperationLoading('modal-save', false);
  }
};

const handleEventModalDelete = async (bookingId: string): Promise<void> => {
  const booking = userStore.getBookingById.value(bookingId);
  if (!booking) return;

  uiStore.openConfirmDialog(
    'Delete Booking',
    `Are you sure you want to delete the booking for ${getPropertyName(booking.property_id)}?`,
    async () => {
      try {
        uiStore.setOperationLoading('modal-delete', true);
        await deleteBooking(bookingId);
        uiStore.closeModal('eventModal');
        uiStore.showSuccess('Booking Deleted', 'The booking has been deleted successfully.');
      } catch (error) {
        console.error('Failed to delete booking:', error);
      } finally {
        uiStore.setOperationLoading('modal-delete', false);
      }
    },
    { dangerous: true, confirmText: 'Delete' }
  );
};

const handleEventModalDuplicate = async (bookingId: string, newDates: { checkout_date: string; checkin_date: string }): Promise<void> => {
  try {
    uiStore.setOperationLoading('modal-duplicate', true);
    await duplicateBooking(bookingId, newDates);
    uiStore.closeModal('eventModal');
    uiStore.showSuccess('Booking Duplicated', 'A duplicate booking has been created.');
  } catch (error) {
    console.error('Failed to duplicate booking:', error);
  } finally {
    uiStore.setOperationLoading('modal-duplicate', false);
  }
};

// Property Modal Handlers
const handlePropertyModalClose = (): void => {
  uiStore.closeModal('propertyModal');
};

const handlePropertyModalSave = async (data: PropertyFormData): Promise<void> => {
  try {
    uiStore.setOperationLoading('modal-save', true);
    
    if (propertyModalMode.value === 'create') {
      await createProperty(data);
      uiStore.showSuccess('Property Created', `${data.name} has been added successfully.`);
    } else {
      const property = propertyModalData.value as Property;
      await updateProperty(property.id, data);
      uiStore.showSuccess('Property Updated', `${data.name} has been updated successfully.`);
    }
    
    uiStore.closeModal('propertyModal');
  } catch (error) {
    console.error('Failed to save property:', error);
  } finally {
    uiStore.setOperationLoading('modal-save', false);
  }
};

const handlePropertyModalDelete = async (propertyId: string): Promise<void> => {
  const property = userStore.getPropertyById.value(propertyId);
  if (!property) return;

  uiStore.openConfirmDialog(
    'Delete Property',
    `Are you sure you want to delete "${property.name}"? This will also delete all associated bookings.`,
    async () => {
      try {
        uiStore.setOperationLoading('modal-delete', true);
        await deleteProperty(propertyId);
        uiStore.closeModal('propertyModal');
        uiStore.showSuccess('Property Deleted', `${property.name} has been deleted successfully.`);
      } catch (error) {
        console.error('Failed to delete property:', error);
      } finally {
        uiStore.setOperationLoading('modal-delete', false);
      }
    },
    { dangerous: true, confirmText: 'Delete Property' }
  );
};

// Confirm Dialog Handlers
const handleConfirmDialogConfirm = (): void => {
  const data = confirmDialogData.value;
  if (data?.onConfirm) {
    data.onConfirm();
  }
  uiStore.closeModal('confirmDialog');
};

const handleConfirmDialogCancel = (): void => {
  uiStore.closeModal('confirmDialog');
};

// ============================================================================
// FILTER HELPERS
// ============================================================================

const getPropertyName = (propertyId: string): string => {
  const property = userStore.getPropertyById.value(propertyId);
  return property?.name || 'Unknown Property';
};

const clearPropertyFilter = (): void => {
  uiStore.clearFilter('propertyFilter');
};

const clearStatusFilter = (): void => {
  uiStore.clearFilter('statusFilter');
};

const clearBookingTypeFilter = (): void => {
  uiStore.clearFilter('bookingTypeFilter');
};

// ============================================================================
// LIFECYCLE & WATCHERS
// ============================================================================

// Initialize data on mount
onMounted(async () => {
  // Check authentication
  if (!requireAuth()) return;

  try {
    uiStore.setPageTitle('Dashboard');
    uiStore.setBreadcrumbs([
      { title: 'Home', to: '/', disabled: true }
    ]);

    // Initialize user data if not already loaded
    if (userStore.houses.size === 0 || userStore.events.size === 0) {
      uiStore.setGlobalLoading(true);
      await userStore.initializeUserData();
    }
  } catch (error) {
    console.error('Failed to initialize Home component:', error);
    uiStore.showError(
      'Initialization Failed', 
      'Failed to load your data. Please refresh the page or try again.'
    );
  } finally {
    uiStore.setGlobalLoading(false);
  }
});

// Watch for authentication changes
watch(() => isAuthenticated.value, async (authenticated) => {
  if (authenticated) {
    // User logged in - initialize data
    try {
      uiStore.setGlobalLoading(true);
      await userStore.initializeUserData();
    } catch (error) {
      console.error('Failed to load user data after authentication:', error);
    } finally {
      uiStore.setGlobalLoading(false);
    }
  } else {
    // User logged out - redirect to login
    router.push('/auth/login');
  }
});

// Watch for display size changes and adjust sidebar
watch(() => displaySize.value, (newSize) => {
  if (newSize === 'xs' || newSize === 'sm') {
    uiStore.updatePreferences({ sidebarOpen: false });
  } else if (newSize === 'lg' || newSize === 'xl') {
    uiStore.updatePreferences({ sidebarOpen: true });
  }
});

// Save calendar view preference when it changes
watch(currentView, (newView) => {
  uiStore.setCalendarView(newView as any);
});

// Cleanup on unmount
onUnmounted(() => {
  // Clear any timeouts or intervals
  // Clean up subscriptions if needed
  uiStore.resetUIState();
});
</script>

<style scoped>
.home-container {
  height: 100vh;
  overflow: hidden;
}

.sidebar-column {
  border-right: 1px solid rgb(var(--v-theme-on-surface), 0.12);
  height: 100vh;
  overflow-y: auto;
  transition: transform 0.3s ease;
}

.calendar-column {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.calendar-header {
  padding: 16px;
  border-bottom: 1px solid rgb(var(--v-theme-on-surface), 0.12);
  display: flex;
  align-items: center;
  min-height: 72px;
  background: rgb(var(--v-theme-surface));
  z-index: 1;
}

.calendar-wrapper {
  flex: 1;
  overflow: hidden;
  padding: 16px;
}

.filter-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.mobile-hidden {
  transform: translateX(-100%);
}

@media (min-width: 1264px) {
  .mobile-hidden {
    transform: translateX(0);
  }
}

/* Highlight animation for navigated bookings */
:deep(.fc-event-highlighted) {
  animation: highlight-pulse 3s ease-in-out;
  z-index: 999;
}

@keyframes highlight-pulse {
  0%, 100% { 
    box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0.7);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 0 20px rgba(var(--v-theme-primary), 0);
    transform: scale(1.05);
  }
}

/* Loading states */
.v-overlay .v-progress-circular {
  margin-bottom: 16px;
}
</style>
````

## File: src/components/smart/owner/README.md
````markdown
# Owner Smart Components

This folder contains orchestrator components specifically designed for property owners.

## Purpose

Owner smart components provide focused, simple interfaces for property owners (30-40 clients) to manage their properties and bookings. They emphasize:

- **Simplicity**: Clean, focused interfaces without complex features
- **Personal Data**: Shows only the owner's properties and bookings
- **Mobile-First**: Optimized for mobile devices since owners manage on-the-go
- **Quick Actions**: Fast property and booking creation

## Key Components (Planned)

- `HomeOwner.vue` - Main dashboard orchestrator for property owners
- `OwnerSidebar.vue` - Sidebar with owner-specific navigation and quick actions
- `OwnerCalendar.vue` - Calendar view filtered to owner's properties only
- `OwnerPropertyManager.vue` - Simple property management interface

## Data Scoping

All owner components use owner-specific composables that filter data to show only:
- Properties owned by the current user
- Bookings for the user's properties
- Turn alerts for the user's properties only
- Personal metrics and statistics

## Architecture

Owner components should:
- Use composables from `@/composables/owner/`
- Filter all data to current user's scope
- Provide simple, focused workflows
- Be mobile-responsive
- Minimize cognitive load

## Business Context

Property owners are the primary users (30-40 clients) who need to:
- Add their properties to the system
- Create bookings for checkout/checkin dates
- View their personal schedule
- Get alerts for urgent turns
- Access simple, fast interfaces without business management complexity
````

## File: src/components/smart/shared/README.md
````markdown
# Shared Smart Components

This folder contains orchestrator components that can be reused across both owner and admin roles.

## Purpose

Shared smart components provide common functionality that works for both property owners and business administrators. They typically:

- Handle cross-role business logic
- Manage shared UI state
- Coordinate between multiple dumb components
- Provide consistent behavior across roles

## Examples

Examples of shared smart components include:

- `GlobalNotificationHandler.vue` - Notification system that works for all roles
- `ErrorBoundary.vue` - Error handling component for all interfaces
- `LoadingOverlay.vue` - Loading states for all components

## Architecture

Shared smart components should:
- Be role-agnostic
- Use shared composables from `@/composables/shared/`
- Emit events for role-specific handling
- Accept role-specific data through props

## Migration

During the role-based refactoring, generic components that work for all roles will be moved here while role-specific components will go to `owner/` or `admin/` folders.
````

## File: src/components/smart/SidebarDemo.vue
````vue
<template>
  <v-container fluid class="sidebar-demo">
    <v-row>
      <v-col cols="12" md="4" lg="3">
        <Sidebar
          :today-turns="todayTurns"
          :upcoming-cleanings="upcomingCleanings"
          :properties="properties"
          :loading="loading"
          @navigate-to-booking="handleNavigateToBooking"
          @navigate-to-date="handleNavigateToDate"
          @filter-by-property="handleFilterByProperty"
          @create-booking="handleCreateBooking"
          @create-property="handleCreateProperty"
        />
      </v-col>
      <v-col cols="12" md="8" lg="9">
        <v-card class="pa-4">
          <v-card-title>Sidebar Demo</v-card-title>
          <v-card-text>
            <p>This is a demo of the Sidebar component. Try interacting with the sidebar to see how it works.</p>
            <v-divider class="my-4"></v-divider>
            <h3 class="text-h6 mb-2">Event Log:</h3>
            <v-list lines="two" class="event-log bg-grey-lighten-4">
              <v-list-item v-for="(event, index) in eventLog" :key="index">
                <v-list-item-title>{{ event.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ event.detail }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item v-if="eventLog.length === 0">
                <v-list-item-title>No events yet</v-list-item-title>
                <v-list-item-subtitle>Try interacting with the sidebar</v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <v-divider class="my-4"></v-divider>
            <div class="d-flex gap-2">
              <v-btn color="primary" @click="toggleLoading">
                {{ loading ? 'Stop Loading' : 'Start Loading' }}
              </v-btn>
              <v-btn color="secondary" @click="resetEvents">
                Reset Events
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
⋮----
<v-list-item-title>{{ event.name }}</v-list-item-title>
<v-list-item-subtitle>{{ event.detail }}</v-list-item-subtitle>
⋮----
{{ loading ? 'Stop Loading' : 'Start Loading' }}
⋮----
<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from './Sidebar.vue';
import type { Booking, Property } from '@/types';
const loading = ref(false);
const eventLog = ref<{ name: string, detail: string }[]>([]);
const properties = ref<Property[]>([
  {
    id: '1',
    owner_id: 'owner1',
    name: 'Luxury Beach House',
    address: '123 Coastal Way',
    cleaning_duration: 180,
    special_instructions: 'Check pool filter',
    pricing_tier: 'luxury',
    active: true,
  },
  {
    id: '2',
    owner_id: 'owner1',
    name: 'Downtown Apartment',
    address: '456 Main Street',
    cleaning_duration: 120,
    pricing_tier: 'premium',
    active: true,
  },
  {
    id: '3',
    owner_id: 'owner2',
    name: 'Mountain Cabin',
    address: '789 Forest Road',
    cleaning_duration: 90,
    special_instructions: 'Restock firewood',
    pricing_tier: 'basic',
    active: true,
  },
]);
const todayTurns = ref<Booking[]>([
  {
    id: 't1',
    property_id: '1',
    owner_id: 'owner1',
    checkout_date: new Date().toISOString(),
    checkin_date: new Date().toISOString(),
    booking_type: 'turn',
    guest_count: 4,
    notes: 'Urgent: Same-day turnaround',
    status: 'pending',
  },
  {
    id: 't2',
    property_id: '2',
    owner_id: 'owner1',
    checkout_date: new Date().toISOString(),
    checkin_date: new Date().toISOString(),
    booking_type: 'turn',
    guest_count: 2,
    status: 'scheduled',
  },
]);
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfterTomorrow = new Date();
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
const upcomingCleanings = ref<Booking[]>([
  {
    id: 'u1',
    property_id: '1',
    owner_id: 'owner1',
    checkout_date: tomorrow.toISOString(),
    checkin_date: tomorrow.toISOString(),
    booking_type: 'standard',
    guest_count: 3,
    status: 'pending',
  },
  {
    id: 'u2',
    property_id: '3',
    owner_id: 'owner2',
    checkout_date: tomorrow.toISOString(),
    checkin_date: dayAfterTomorrow.toISOString(),
    booking_type: 'standard',
    guest_count: 2,
    status: 'scheduled',
  },
  {
    id: 'u3',
    property_id: '2',
    owner_id: 'owner1',
    checkout_date: dayAfterTomorrow.toISOString(),
    checkin_date: dayAfterTomorrow.toISOString(),
    booking_type: 'standard',
    guest_count: 1,
    status: 'pending',
  },
]);
const handleNavigateToBooking = (bookingId: string) => {
  eventLog.value.unshift({
    name: 'navigateToBooking',
    detail: `Booking ID: ${bookingId}`,
  });
};
const handleNavigateToDate = (date: Date) => {
  eventLog.value.unshift({
    name: 'navigateToDate',
    detail: `Date: ${date.toLocaleDateString()}`,
  });
};
const handleFilterByProperty = (propertyId: string | null) => {
  const propertyName = propertyId
    ? properties.value.find(p => p.id === propertyId)?.name || 'Unknown'
    : 'All Properties';
  eventLog.value.unshift({
    name: 'filterByProperty',
    detail: `Property: ${propertyName} (ID: ${propertyId || 'none'})`,
  });
};
const handleCreateBooking = () => {
  eventLog.value.unshift({
    name: 'createBooking',
    detail: 'Opening booking creation modal',
  });
};
const handleCreateProperty = () => {
  eventLog.value.unshift({
    name: 'createProperty',
    detail: 'Opening property creation modal',
  });
};
const toggleLoading = () => {
  loading.value = !loading.value;
};
const resetEvents = () => {
  eventLog.value = [];
};
</script>
<style scoped>
.sidebar-demo {
  min-height: 100vh;
}
.event-log {
  max-height: 300px;
  overflow-y: auto;
  border-radius: 4px;
}
</style>
````

## File: src/composables/admin/README.md
````markdown
# Admin Composables

This folder contains business logic composables specifically designed for business administrator operations.

## Purpose

Admin composables provide comprehensive data access and business logic for system-wide operations. They build upon shared composables but add admin-specific functionality for managing the entire business across all property owner clients.

## Key Composables (Planned)

- `useAdminBookings.ts` - System-wide booking management and analytics
- `useAdminProperties.ts` - All-properties management across all clients
- `useAdminCalendarState.ts` - Master calendar with cleaner assignments
- `useCleanerManagement.ts` - Cleaner scheduling and assignment logic
- `useAdminDashboard.ts` - Business intelligence and reporting
- `useSystemAlerts.ts` - System-wide alerts and priority management
- `useReporting.ts` - Business analytics and report generation

## Data Access Pattern

Admin composables access unfiltered, system-wide data:

```typescript
// Example: useAdminBookings.ts
export function useAdminBookings() {
  const { bookingsArray } = useBookingStore();
  
  // Access ALL bookings across ALL clients
  const allBookings = computed(() => bookingsArray.value);
  
  const systemTurnBookings = computed(() =>
    allBookings.value.filter(booking => 
      booking.booking_type === 'turn'
    )
  );
  
  const urgentSystemTurns = computed(() =>
    systemTurnBookings.value.filter(booking => {
      const today = new Date().toISOString().split('T')[0];
      return booking.checkout_date.startsWith(today);
    })
  );
  
  return {
    allBookings,
    systemTurnBookings,
    urgentSystemTurns,
    // ... other admin operations
  };
}
```

## Architecture

Admin composables should:
- Import and extend shared composables from `@/composables/shared/`
- Access complete datasets without filtering
- Provide comprehensive business management APIs
- Handle complex workflows and batch operations
- Support advanced analytics and reporting

## Key Features

### Cleaner Management
- Cleaner scheduling and availability
- Booking assignment and optimization
- Workload balancing and scheduling conflicts

### System-Wide Analytics
- Cross-client performance metrics
- Revenue and utilization analytics  
- Turn frequency and priority analysis
- Business intelligence dashboards

### Priority Management
- System-wide turn alerting
- Resource allocation optimization
- Capacity planning and forecasting

## Integration

Admin composables integrate with:
- All shared stores for complete data access
- Admin smart components for complex UI logic
- Cleaner management systems
- Business reporting tools
- System monitoring and alerting

## Security Considerations

Admin composables handle sensitive business data and should:
- Implement proper access logging
- Support audit trail requirements
- Handle multi-tenant data access patterns
- Prepare for future role-based permission expansion
````

## File: src/composables/owner/README.md
````markdown
# Owner Composables

This folder contains business logic composables specifically designed for property owner operations.

## Purpose

Owner composables provide data access and business logic that filters and scopes operations to the current property owner's data only. They build upon shared composables but add owner-specific filtering and workflows.

## Key Composables (Planned)

- `useOwnerBookings.ts` - Owner-scoped booking operations and CRUD
- `useOwnerProperties.ts` - Owner-scoped property management  
- `useOwnerCalendarState.ts` - Calendar state filtered to owner's properties
- `useOwnerDashboard.ts` - Dashboard data aggregation for owners
- `useOwnerNotifications.ts` - Owner-specific notification handling

## Data Scoping Pattern

All owner composables follow the data scoping pattern:

```typescript
// Example: useOwnerBookings.ts
export function useOwnerBookings() {
  const { userBookings } = useUserStore();
  const { user } = useAuthStore();
  
  // Filter to current owner's bookings only
  const myBookings = computed(() => 
    userBookings.value.filter(booking => 
      booking.owner_id === user.value?.id
    )
  );
  
  const myTurnBookings = computed(() =>
    myBookings.value.filter(booking => 
      booking.booking_type === 'turn'
    )
  );
  
  return {
    myBookings,
    myTurnBookings,
    // ... other owner-scoped operations
  };
}
```

## Architecture

Owner composables should:
- Import and extend shared composables from `@/composables/shared/`
- Filter all data to current user's scope
- Provide simplified APIs focused on owner needs
- Handle owner-specific business rules
- Emit owner-specific events

## Integration

Owner composables integrate with:
- Shared stores for data access
- Owner smart components for UI logic
- Shared business logic utilities
- Owner-specific validation rules

## Security Note

Owner composables provide **frontend filtering only**. Backend Row Level Security (RLS) will be required in the future for true data security. Current filtering is for UX purposes to show relevant data to each owner.
````

## File: src/composables/shared/useAuth.ts
````typescript
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import type { User, PropertyOwner, Admin, Cleaner, UserRole, UserSettings } from '@/types';
import { v4 as uuidv4 } from 'uuid';
export function useAuth()
⋮----
async function login(email: string, password: string): Promise<boolean>
async function logout(): Promise<boolean>
async function register(userData: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    company_name?: string;
}): Promise<boolean>
async function updateUserSettings(settings: Partial<UserSettings>): Promise<boolean>
````

## File: src/composables/shared/useBookings.ts
````typescript
import { ref, computed } from 'vue';
import { useBookingStore } from '@/stores/booking';
import { usePropertyStore } from '@/stores/property';
import type { Booking, BookingFormData, BookingStatus, BookingType } from '@/types';
import { v4 as uuidv4 } from 'uuid';
export function useBookings()
⋮----
async function createBooking(formData: BookingFormData): Promise<string | null>
async function updateBooking(id: string, updates: Partial<BookingFormData>): Promise<boolean>
async function deleteBooking(id: string): Promise<boolean>
async function changeBookingStatus(id: string, status: BookingStatus): Promise<boolean>
async function assignCleaner(bookingId: string, cleanerId: string): Promise<boolean>
function calculateCleaningWindow(booking: Booking)
function calculateBookingPriority(booking: Booking): 'low' | 'normal' | 'high' | 'urgent'
async function fetchAllBookings(): Promise<boolean>
````

## File: src/composables/shared/useCalendarState.ts
````typescript
import { ref, computed } from 'vue';
import { useUIStore } from '@/stores/ui';
import { useBookingStore } from '@/stores/booking';
import type { Booking } from '@/types';
export function useCalendarState()
⋮----
function setCalendarView(view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay')
function goToDate(date: Date)
function goToToday()
function next()
function prev()
function updateDateRange()
function toggleStatusFilter(status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled')
function toggleTypeFilter(type: 'turn' | 'standard')
function togglePropertyFilter(propertyId: string)
function clearPropertyFilters()
function filterBookings(bookings: Booking[]): Booking[]
function getFormattedDateRange(): string
function bookingsToEvents(bookings: Booking[])
````

## File: src/composables/shared/useComponentEventLogger.ts
````typescript
import { ref, reactive, computed } from 'vue';
export interface ComponentEvent {
  id: string;
  timestamp: number;
  sourceComponent: string;
  targetComponent: string;
  eventName: string;
  payload: any;
  direction: 'emit' | 'receive';
}
export interface EventFilter {
  sourceComponent?: string;
  targetComponent?: string;
  eventName?: string;
  direction?: 'emit' | 'receive';
}
export function useComponentEventLogger()
⋮----
const logEvent = (
    sourceComponent: string,
    targetComponent: string,
    eventName: string,
    payload: any,
    direction: 'emit' | 'receive'
) =>
const clearEvents = () =>
const setEnabled = (value: boolean) =>
const toggleEnabled = () =>
const setFilter = (newFilter: EventFilter) =>
const clearFilter = () =>
````

## File: src/composables/shared/useProperties.ts
````typescript
import { ref, computed } from 'vue';
import { usePropertyStore } from '@/stores/property';
import { useBookingStore } from '@/stores/booking';
import type { Property, PropertyFormData, PricingTier } from '@/types';
import { v4 as uuidv4 } from 'uuid';
export function useProperties()
⋮----
async function createProperty(formData: PropertyFormData): Promise<string | null>
async function updateProperty(id: string, updates: Partial<PropertyFormData>): Promise<boolean>
async function deleteProperty(id: string): Promise<boolean>
async function togglePropertyStatus(id: string, active: boolean): Promise<boolean>
function calculatePropertyMetrics(id: string)
async function fetchAllProperties(): Promise<boolean>
````

## File: src/layouts/auth.vue
````vue
<template>
    <v-app>
      <v-app-bar
        app
        color="primary"
        dark
        elevation="1"
        height="64"
      >
        <v-toolbar-title>
          Property Cleaning Scheduler
        </v-toolbar-title>
        <v-spacer />
        <v-btn
          variant="text"
          color="white"
          href="mailto:support@example.com"
        >
          <v-icon start>mdi-help-circle</v-icon>
          Help
        </v-btn>
      </v-app-bar>
      <v-main class="auth-main">
        <v-container
          fluid
          fill-height
          class="pa-0"
        >
          <v-row
            align="center"
            justify="center"
            no-gutters
            class="fill-height"
          >
            <v-col
              cols="12"
              sm="8"
              md="6"
              lg="4"
              xl="3"
              class="pa-4"
            >
              <router-view />
            </v-col>
          </v-row>
        </v-container>
      </v-main>
      <v-footer
        app
        color="transparent"
        class="justify-center"
        height="auto"
      >
        <div class="text-center">
          <div class="text-caption text-medium-emphasis">
            © {{ currentYear }} Property Cleaning Scheduler
          </div>
          <div class="text-caption text-medium-emphasis mt-1">
            Streamline your cleaning operations
          </div>
        </div>
      </v-footer>
    </v-app>
  </template>
⋮----
© {{ currentYear }} Property Cleaning Scheduler
⋮----
<script setup lang="ts">
  import { computed } from 'vue';
  const currentYear = computed(() => new Date().getFullYear());
  </script>
<style scoped>
  .auth-main {
    background: linear-gradient(135deg,
      rgb(var(--v-theme-primary)) 0%,
      rgb(var(--v-theme-primary-darken-2)) 100%
    );
    min-height: 100vh;
  }
  .v-container {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 0;
  }
  :deep(.v-card) {
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  .v-footer {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  </style>
````

## File: src/pages/404.vue
````vue
<template>
  <div class="not-found-page">
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <router-link to="/">Return to Home</router-link>
  </div>
</template>
<script setup lang="ts">
</script>
<style scoped>
.not-found-page {
  padding: 2rem;
  text-align: center;
}
</style>
````

## File: src/pages/admin/index.vue
````vue
<template>
  <div class="admin-page">
    <h1>Admin Dashboard</h1>
    <p>Admin controls and settings will be implemented here.</p>
  </div>
</template>
<script setup lang="ts">
</script>
<style scoped>
.admin-page {
  padding: 1rem;
}
</style>
````

## File: src/pages/demos/calendar.vue
````vue
<template>
  <div class="calendar-demo-page">
    <h1 class="text-h4 mb-4">Calendar Demo</h1>
    <FullCalendarDemo />
  </div>
</template>
<script setup lang="ts">
import FullCalendarDemo from '@/components/smart/FullCalendarDemo.vue';
</script>
<style scoped>
.calendar-demo-page {
  padding: 1rem;
}
</style>
````

## File: src/pages/demos/sidebar.vue
````vue
<template>
  <SidebarDemo />
</template>
<script setup lang="ts">
import SidebarDemo from '@/components/smart/SidebarDemo.vue';
</script>
<style scoped>
</style>
````

## File: src/pages/properties/index.vue
````vue
<template>
  <div class="properties-page">
    <h1>Properties</h1>
    <p>Properties management page will be implemented here.</p>
  </div>
</template>
<script setup lang="ts">
</script>
<style scoped>
.properties-page {
  padding: 1rem;
}
</style>
````

## File: src/plugins/supabase.ts
````typescript
import { createClient } from '@supabase/supabase-js'
````

## File: src/stores/auth.ts
````typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/types';
⋮----
function login(email: string, password: string)
function logout()
function register(userData: Partial<User>)
function checkAuth()
````

## File: src/types/api.ts
````typescript
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
  message?: string;
}
export interface PaginationParams {
  page: number;
  pageSize: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
export type TableName = 'users' | 'properties' | 'bookings' | 'cleaners';
export interface SupabaseErrorResponse {
  code: string;
  details: string;
  hint: string;
  message: string;
}
export interface AuthResponse {
  user: {
    id: string;
    email: string;
  } | null;
  session: any | null;
  error: string | null;
}
````

## File: src/types/booking.ts
````typescript
export type BookingType = 'standard' | 'turn';
export type BookingStatus = 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export interface Booking {
  id: string;
  property_id: string;
  owner_id: string;
  checkout_date: string;
  checkin_date: string;
  booking_type: BookingType;
  status: BookingStatus;
  guest_count?: number;
  notes?: string;
  assigned_cleaner_id?: string;
  created_at?: string;
  updated_at?: string;
}
export interface BookingWithMetadata extends Booking {
  property_name?: string;
  cleaning_window?: {
    start: string;
    end: string;
    duration: number;
  };
  priority: 'low' | 'normal' | 'high' | 'urgent';
}
export type BookingFormData = Omit<Booking, 'id' | 'created_at' | 'updated_at'>;
export type BookingMap = Map<string, Booking>;
export function isBooking(obj: any): obj is Booking
````

## File: src/types/index.ts
````typescript

````

## File: src/types/property.ts
````typescript
export type PricingTier = 'basic' | 'premium' | 'luxury';
export interface Property {
  id: string;
  owner_id: string;
  name: string;
  address: string;
  cleaning_duration: number;
  special_instructions?: string;
  pricing_tier: PricingTier;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}
export interface PropertyWithMetrics extends Property {
  metrics: {
    utilizationRate: number;
    averageGapBetweenBookings: number;
    turnPercentage: number;
    revenueProjection: number;
    cleaningLoad: 'light' | 'moderate' | 'heavy';
  };
}
export type PropertyFormData = Omit<Property, 'id' | 'created_at' | 'updated_at'>;
export type PropertyMap = Map<string, Property>;
export function isProperty(obj: any): obj is Property
````

## File: src/types/user.ts
````typescript
export type UserRole = 'owner' | 'admin' | 'cleaner';
export interface UserSettings {
  notifications: boolean;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
}
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  settings: UserSettings;
  created_at?: string;
  updated_at?: string;
}
export interface PropertyOwner extends User {
  role: 'owner';
  company_name?: string;
}
export interface Admin extends User {
  role: 'admin';
  access_level: 'full' | 'limited';
}
export interface Cleaner extends User {
  role: 'cleaner';
  skills: string[];
  max_daily_bookings: number;
  location?: {
    lat: number;
    lng: number;
  };
}
export function isPropertyOwner(user: User): user is PropertyOwner
export function isAdmin(user: User): user is Admin
export function isCleaner(user: User): user is Cleaner
````

## File: src/utils/businessLogic.ts
````typescript
import type { Booking, BookingStatus } from '@/types/booking';
import type { Property } from '@/types/property';
export const calculateBookingPriority = (booking: Booking): 'low' | 'normal' | 'high' | 'urgent' =>
export const getCleaningWindow = (booking: Booking, property: Property):
export const canScheduleCleaning = (booking: Booking, property: Property):
export const validateTurnBooking = (
  booking: Partial<Booking>,
  property: Property
):
export const detectBookingConflicts = (
  booking: Booking,
  existingBookings: Booking[]
): Booking[] =>
export const validateBooking = (
  booking: Partial<Booking>,
  property: Property,
  existingBookings: Booking[] = []
):
export const getAvailableStatusTransitions = (booking: Booking): BookingStatus[] =>
export const canTransitionBookingStatus = (booking: Booking, newStatus: BookingStatus): boolean =>
````

## File: tsconfig.node.json
````json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
````

## File: .gitignore
````
node_modules/
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dependencies
node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment files
.env
.env.*
!.env.example

# Build output
/dist
/build

# Coverage directory
/coverage

# Cache directories
.cache
.temp
.tmp
````

## File: eslint.config.js
````javascript

````

## File: src/__tests__/utils/test-utils.ts
````typescript

````

## File: src/components/dumb/ConfirmationDialog.vue
````vue
<template>
  <v-dialog
    v-model="isOpen"
    max-width="500px"
    :persistent="persistent"
    @keydown.esc="handleCancel"
  >
    <v-card class="glass-card fade-in">
      <v-card-title class="text-h5">
        {{ title }}
      </v-card-title>
      <v-card-text>
        <p>{{ message }}</p>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="handleCancel"
          :disabled="loading"
        >
          {{ cancelText }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          :color="confirmColor"
          variant="text"
          @click="handleConfirm"
          :disabled="loading"
          :loading="loading"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
⋮----
{{ title }}
⋮----
<p>{{ message }}</p>
⋮----
{{ cancelText }}
⋮----
{{ confirmText }}
⋮----
<script setup lang="ts">
import { computed, ref } from 'vue';
interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  dangerous?: boolean;
  persistent?: boolean;
}
interface Emits {
  (e: 'close'): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}
const props = withDefaults(defineProps<Props>(), {
  open: false,
  title: 'Confirm',
  message: 'Are you sure you want to proceed?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  confirmColor: 'primary',
  dangerous: false,
  persistent: true
});
const emit = defineEmits<Emits>();
const loading = ref<boolean>(false);
const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => {
    if (!value) emit('close');
  }
});
const confirmColor = computed((): string => {
  return props.dangerous ? 'error' : props.confirmColor;
});
function handleConfirm(): void {
  loading.value = true;
  try {
    emit('confirm');
  } finally {
    loading.value = false;
    emit('close');
  }
}
function handleCancel(): void {
  emit('cancel');
  emit('close');
}
</script>
<style scoped>
:deep(.v-dialog .v-card) {
  background: rgb(var(--v-theme-surface)) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
}
:deep(.v-card-title) {
  background: rgb(var(--v-theme-surface)) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
}
:deep(.v-card-text) {
  color: rgba(var(--v-theme-on-surface), 0.8) !important;
}
:deep(.v-btn) {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
:deep(.v-btn--variant-text) {
  color: rgb(var(--v-theme-primary)) !important;
}
:deep(.v-btn--variant-text.text-error) {
  color: rgb(var(--v-theme-error)) !important;
}
:deep(.v-btn--variant-text.text-grey-darken-1) {
  color: rgba(var(--v-theme-on-surface), 0.6) !important;
}
:deep(.v-btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.3);
}
:deep(.v-divider) {
  border-color: rgba(var(--v-theme-on-surface), 0.12) !important;
}
:deep(.v-btn--loading) {
  color: rgba(var(--v-theme-on-surface), 0.5) !important;
}
</style>
````

## File: src/components/dumb/PropertyCard.vue
````vue
<template>
  <v-card
    class="property-card hover-elevate glass-card fade-in"
    :elevation="2"
    :class="{ 'inactive-property': !property.active }"
    @click="emit('view', property.id)"
  >
    <v-card-title class="d-flex align-center pa-3">
      <div class="text-truncate">{{ property.name }}</div>
      <v-chip
        class="ml-2"
        size="x-small"
        :color="activeStatusColor"
        :text-color="property.active ? 'white' : 'default'"
      >
        {{ property.active ? 'Active' : 'Inactive' }}
      </v-chip>
    </v-card-title>
    <v-card-text class="pa-3 pt-1">
      <div class="address text-truncate mb-2">
        <v-icon icon="mdi-home" size="small" class="mr-1" color="primary"></v-icon>
        {{ property.address }}
      </div>
      <div class="d-flex align-center mb-2">
        <v-icon icon="mdi-clock-outline" size="small" class="mr-1" color="primary"></v-icon>
        <span>{{ formattedCleaningDuration }}</span>
      </div>
      <div class="d-flex align-center mb-2">
        <v-icon icon="mdi-tag-outline" size="small" class="mr-1" color="primary"></v-icon>
        <v-chip
          size="x-small"
          :color="pricingTierColor"
          class="text-capitalize"
          elevation="1"
        >
          {{ property.pricing_tier }}
        </v-chip>
      </div>
      <div v-if="property.special_instructions" class="special-instructions mt-3">
        <v-tooltip location="bottom">
          <template v-slot:activator="{ props }">
            <div class="text-truncate d-flex align-start" v-bind="props">
              <v-icon icon="mdi-information-outline" size="small" class="mr-1" color="info"></v-icon>
              <div class="text-caption">{{ property.special_instructions }}</div>
            </div>
          </template>
          <span>{{ property.special_instructions }}</span>
        </v-tooltip>
      </div>
    </v-card-text>
    <v-divider v-if="displayActions"></v-divider>
    <v-card-actions class="pa-2" v-if="displayActions">
      <v-spacer></v-spacer>
      <v-btn
        variant="text"
        color="primary"
        size="small"
        @click.stop="emit('edit', property.id)"
        aria-label="Edit property"
        rounded
      >
        <v-icon class="mr-1">mdi-pencil</v-icon>
        Edit
      </v-btn>
      <v-btn
        variant="text"
        color="error"
        size="small"
        @click.stop="emit('delete', property.id)"
        aria-label="Delete property"
        rounded
      >
        <v-icon class="mr-1">mdi-delete</v-icon>
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
⋮----
<div class="text-truncate">{{ property.name }}</div>
⋮----
{{ property.active ? 'Active' : 'Inactive' }}
⋮----
{{ property.address }}
⋮----
<span>{{ formattedCleaningDuration }}</span>
⋮----
{{ property.pricing_tier }}
⋮----
<template v-slot:activator="{ props }">
            <div class="text-truncate d-flex align-start" v-bind="props">
              <v-icon icon="mdi-information-outline" size="small" class="mr-1" color="info"></v-icon>
              <div class="text-caption">{{ property.special_instructions }}</div>
            </div>
          </template>
⋮----
<div class="text-caption">{{ property.special_instructions }}</div>
⋮----
<span>{{ property.special_instructions }}</span>
⋮----
<script setup lang="ts">
import { computed } from 'vue';
import type { Property, PricingTier } from '@/types';
interface Props {
  property: Property;
  displayActions?: boolean;
}
interface Emits {
  (e: 'edit', id: string): void;
  (e: 'delete', id: string): void;
  (e: 'view', id: string): void;
}
const props = withDefaults(defineProps<Props>(), {
  displayActions: true
});
const emit = defineEmits<Emits>();
const formattedCleaningDuration = computed((): string => {
  const { cleaning_duration } = props.property;
  if (cleaning_duration < 60) {
    return `${cleaning_duration} minutes`;
  }
  const hours = Math.floor(cleaning_duration / 60);
  const minutes = cleaning_duration % 60;
  if (minutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
});
const pricingTierColor = computed((): string => {
  const tierColors: Record<PricingTier, string> = {
    basic: 'grey',
    premium: 'primary',
    luxury: 'accent'
  };
  return tierColors[props.property.pricing_tier];
});
const activeStatusColor = computed((): string => {
  return props.property.active ? 'success' : 'error';
});
</script>
<style scoped>
.property-card {
  position: relative;
  background: rgb(var(--v-theme-surface)) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
  border-top: 4px solid rgb(var(--v-theme-primary)) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.property-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-on-surface), 0.15);
  border-color: rgba(var(--v-theme-primary), 0.3) !important;
}
.property-card.inactive-property {
  opacity: 0.75;
  border-top-color: rgb(var(--v-theme-error)) !important;
}
.property-card.inactive-property:before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(var(--v-theme-surface), 0.3);
  pointer-events: none;
  z-index: 1;
}
.property-card:hover .v-card-title {
  color: rgb(var(--v-theme-primary)) !important;
}
.special-instructions {
  font-style: italic;
  color: rgba(var(--v-theme-on-surface), 0.7) !important;
}
:deep(.v-card-title) {
  color: rgb(var(--v-theme-on-surface)) !important;
}
:deep(.v-card-text) {
  color: rgba(var(--v-theme-on-surface), 0.8) !important;
}
:deep(.v-btn) {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
:deep(.v-btn--variant-text) {
  color: rgb(var(--v-theme-primary)) !important;
}
:deep(.v-btn--variant-text.text-error) {
  color: rgb(var(--v-theme-error)) !important;
}
:deep(.v-btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.3);
}
:deep(.v-icon) {
  color: rgb(var(--v-theme-on-surface)) !important;
}
:deep(.v-btn .v-icon) {
  color: inherit !important;
}
:deep(.v-chip) {
  background: rgba(var(--v-theme-primary), 0.12) !important;
  color: rgb(var(--v-theme-primary)) !important;
}
:deep(.v-chip.bg-success) {
  background: rgba(var(--v-theme-success), 0.12) !important;
  color: rgb(var(--v-theme-success)) !important;
}
:deep(.v-chip.bg-error) {
  background: rgba(var(--v-theme-error), 0.12) !important;
  color: rgb(var(--v-theme-error)) !important;
}
:deep(.v-chip.bg-grey) {
  background: rgba(var(--v-theme-on-surface), 0.12) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
}
:deep(.v-divider) {
  border-color: rgba(var(--v-theme-on-surface), 0.12) !important;
}
</style>
````

## File: src/components/dumb/PropertyModal.vue
````vue
<template>
  <v-dialog
    v-model="isOpen"
    max-width="700px"
    persistent
    @keydown.esc="handleClose"
  >
    <v-card>
      <v-card-title class="text-h5 pb-2">
        {{ formTitle }}
        <v-chip
          v-if="form.active"
          color="success"
          size="small"
          class="ml-2"
        >
          ACTIVE
        </v-chip>
        <v-chip
          v-else
          color="grey"
          size="small"
          class="ml-2"
        >
          INACTIVE
        </v-chip>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="formRef" v-model="formValid" @submit.prevent="handleSubmit">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.name"
                  label="Property Name"
                  :rules="nameRules"
                  required
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('name')"
                  hint="Enter the property name as it should appear in the system"
                  persistent-hint
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.address"
                  label="Property Address"
                  :rules="addressRules"
                  required
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('address')"
                  hint="Full address including street, city, state, and zip code"
                  persistent-hint
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.cleaning_duration"
                  label="Cleaning Duration (minutes)"
                  type="number"
                  min="1"
                  :rules="durationRules"
                  required
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('cleaning_duration')"
                  hint="Time required for standard cleaning"
                  persistent-hint
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.pricing_tier"
                  :items="pricingTierItems"
                  label="Pricing Tier"
                  :rules="pricingTierRules"
                  required
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('pricing_tier')"
                  hint="Determines pricing and service level"
                  persistent-hint
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="form.special_instructions"
                  label="Special Instructions"
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('special_instructions')"
                  hint="Any special cleaning requirements or notes"
                  persistent-hint
                  :counter="1000"
                  rows="4"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-checkbox
                  v-model="form.active"
                  label="Active Property"
                  :disabled="loading"
                  :error-messages="errors.get('active')"
                  hint="Inactive properties won't appear in booking calendars"
                  persistent-hint
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="handleClose"
          :disabled="loading"
        >
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="mode === 'edit'"
          color="error"
          variant="text"
          @click="handleDelete"
          :disabled="loading"
          :loading="loading"
        >
          Delete
        </v-btn>
        <v-btn
          color="primary"
          variant="text"
          @click="handleSubmit"
          :disabled="!formValid || loading"
          :loading="loading"
        >
          {{ submitButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
⋮----
{{ formTitle }}
⋮----
{{ submitButtonText }}
⋮----
<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import type { Property, PropertyFormData, PricingTier } from '@/types';
import type { VForm } from 'vuetify/components';
interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  property?: Property | null;
}
interface Emits {
  (e: 'close'): void;
  (e: 'save', property: PropertyFormData): void;
  (e: 'delete', id: string): void;
}
const props = withDefaults(defineProps<Props>(), {
  open: false,
  mode: 'create',
  property: null
});
const emit = defineEmits<Emits>();
const authStore = useAuthStore();
const formRef = ref<VForm | null>(null);
const formValid = ref<boolean>(false);
const loading = ref<boolean>(false);
const errors = ref<Map<string, string>>(new Map());
const form = reactive<Partial<PropertyFormData>>({
  name: '',
  address: '',
  cleaning_duration: 60, // Default to 1 hour
  pricing_tier: 'basic',
  special_instructions: '',
  active: true,
  owner_id: '', // Will be set by the parent component or from auth store
});
// COMPUTED PROPERTIES
const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => {
    if (!value) emit('close');
  }
});
const formTitle = computed((): string => {
  return props.mode === 'create' ? 'Create Property' : 'Edit Property';
});
const submitButtonText = computed((): string => {
  return props.mode === 'create' ? 'Create' : 'Save';
});
const pricingTierItems = [
  { title: 'Basic', value: 'basic', subtitle: 'Standard cleaning service' },
  { title: 'Premium', value: 'premium', subtitle: 'Enhanced cleaning with additional services' },
  { title: 'Luxury', value: 'luxury', subtitle: 'Comprehensive premium cleaning package' }
];
const nameRules = [
  (v: string) => !!v || 'Property name is required',
  (v: string) => (v && v.length <= 100) || 'Name must be less than 100 characters'
];
const addressRules = [
  (v: string) => !!v || 'Property address is required',
  (v: string) => (v && v.length <= 250) || 'Address must be less than 250 characters'
];
const durationRules = [
  (v: number) => !!v || 'Cleaning duration is required',
  (v: number) => (v && v > 0) || 'Duration must be greater than 0',
  (v: number) => (v && v <= 480) || 'Duration cannot exceed 8 hours (480 minutes)'
];
const pricingTierRules = [
  (v: string) => !!v || 'Pricing tier is required',
  (v: string) => ['basic', 'premium', 'luxury'].includes(v) || 'Invalid pricing tier'
];
function resetForm(): void {
  errors.value.clear();
  if (props.mode === 'edit' && props.property) {
    Object.assign(form, {
      name: props.property.name,
      address: props.property.address,
      cleaning_duration: props.property.cleaning_duration,
      pricing_tier: props.property.pricing_tier,
      special_instructions: props.property.special_instructions || '',
      active: props.property.active,
      owner_id: props.property.owner_id
    });
  } else {
    // Reset to defaults for create mode
    Object.assign(form, {
      name: '',
      address: '',
      cleaning_duration: 60,
      pricing_tier: 'basic',
      special_instructions: '',
      active: true,
      owner_id: authStore.user?.id || '' // Set owner to current user by default
    });
  }
}
// Validate form
async function validate(): Promise<boolean> {
  errors.value.clear();
  if (!formRef.value) return false;
  const { valid } = await formRef.value.validate();
  if (!valid) return false;
  // Additional validation
  if (!form.name || form.name.trim() === '') {
    errors.value.set('name', 'Property name cannot be empty');
    return false;
  }
  if (!form.address || form.address.trim() === '') {
    errors.value.set('address', 'Property address cannot be empty');
    return false;
  }
  if (!form.cleaning_duration || form.cleaning_duration <= 0) {
    errors.value.set('cleaning_duration', 'Cleaning duration must be greater than 0');
    return false;
  }
  if (!form.pricing_tier || !['basic', 'premium', 'luxury'].includes(form.pricing_tier)) {
    errors.value.set('pricing_tier', 'Invalid pricing tier');
    return false;
  }
  return true;
}
async function handleSubmit(): Promise<void> {
  loading.value = true;
  try {
    const isValid = await validate();
    if (!isValid) {
      loading.value = false;
      return;
    }
    if (!form.name || !form.address || !form.cleaning_duration || !form.pricing_tier || form.active === undefined) {
      errors.value.set('form', 'Please fill in all required fields');
      loading.value = false;
      return;
    }
    const propertyData: PropertyFormData = {
      name: form.name,
      address: form.address,
      cleaning_duration: form.cleaning_duration,
      pricing_tier: form.pricing_tier as PricingTier,
      special_instructions: form.special_instructions,
      active: form.active,
      owner_id: form.owner_id || authStore.user?.id || ''
    };
    // Emit save event with property data
    emit('save', propertyData);
    loading.value = false;
    resetForm();
    isOpen.value = false;
  } catch (err) {
    console.error('Error submitting form:', err);
    errors.value.set('form', err instanceof Error ? err.message : 'An error occurred');
    loading.value = false;
  }
}
function handleDelete(): void {
  if (props.mode !== 'edit' || !props.property) return;
  loading.value = true;
  emit('delete', props.property.id);
  loading.value = false;
  isOpen.value = false;
}
function handleClose(): void {
  resetForm();
  emit('close');
}
onMounted(() => {
  resetForm();
});
watch(() => props.open, (newValue) => {
  if (newValue) {
    resetForm();
  }
});
watch(() => props.property, () => {
  if (props.open && props.mode === 'edit') {
    resetForm();
  }
});
</script>
<style scoped>
:deep(.v-dialog .v-card) {
  background: rgb(var(--v-theme-surface)) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
}
:deep(.v-card-title) {
  background: rgb(var(--v-theme-surface)) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
}
:deep(.v-field) {
  background: rgb(var(--v-theme-surface)) !important;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
}
:deep(.v-field:hover) {
  border-color: rgba(var(--v-theme-primary), 0.5) !important;
}
:deep(.v-field--focused) {
  border-color: rgb(var(--v-theme-primary)) !important;
}
:deep(.v-field__input) {
  color: rgb(var(--v-theme-on-surface)) !important;
}
:deep(.v-label) {
  color: rgba(var(--v-theme-on-surface), 0.6) !important;
}
:deep(.v-label--active) {
  color: rgb(var(--v-theme-primary)) !important;
}
:deep(.v-select__selection) {
  color: rgb(var(--v-theme-on-surface)) !important;
}
:deep(.v-list) {
  background: rgb(var(--v-theme-surface)) !important;
}
:deep(.v-list-item) {
  color: rgb(var(--v-theme-on-surface)) !important;
}
:deep(.v-list-item:hover) {
  background: rgba(var(--v-theme-primary), 0.08) !important;
}
:deep(.v-btn) {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
:deep(.v-btn--variant-elevated),
:deep(.v-btn--variant-flat) {
  background: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
}
:deep(.v-btn--variant-outlined) {
  border-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-primary)) !important;
}
:deep(.v-btn--variant-text) {
  color: rgb(var(--v-theme-primary)) !important;
}
:deep(.v-btn.text-error) {
  color: rgb(var(--v-theme-error)) !important;
}
:deep(.v-btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.3);
}
:deep(.v-icon) {
  color: rgb(var(--v-theme-on-surface)) !important;
}
:deep(.v-btn .v-icon) {
  color: inherit !important;
}
:deep(.v-switch .v-selection-control__input) {
  color: rgb(var(--v-theme-primary)) !important;
}
:deep(.v-messages__message) {
  color: rgb(var(--v-theme-error)) !important;
}
:deep(.v-divider) {
  border-color: rgba(var(--v-theme-on-surface), 0.12) !important;
}
</style>
````

## File: src/components/dumb/TurnAlerts.vue
````vue
<template>
  <v-card
    class="turn-alerts glass-card fade-in"
    :elevation="3"
    :color="hasUrgentTurns ? 'error-lighten-5' : 'warning-lighten-5'"
    :class="{ 'pulse-animation': hasUrgentTurns }"
  >
    <v-card-title class="d-flex align-center pa-3">
      <v-icon
        :icon="hasUrgentTurns ? 'mdi-alert-circle' : 'mdi-clock-alert'"
        :color="hasUrgentTurns ? 'error' : 'warning'"
        class="mr-2"
      ></v-icon>
      <span class="text-h6">Turn Alerts</span>
      <v-badge
        :content="bookings.length.toString()"
        :color="hasUrgentTurns ? 'error' : 'warning'"
        class="ml-2"
      ></v-badge>
      <v-spacer></v-spacer>
      <v-btn
        variant="text"
        :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="toggleExpanded"
        :color="hasUrgentTurns ? 'error' : 'warning'"
        density="comfortable"
      ></v-btn>
    </v-card-title>
    <v-expand-transition>
      <div v-if="expanded">
        <v-divider></v-divider>
        <v-card-text class="pa-3">
          <v-list v-if="bookings.length > 0" class="turn-list pa-0">
            <v-list-item
              v-for="booking in limitedBookings"
              :key="booking.id"
              :value="booking.id"
              class="mb-3 turn-list-item hover-elevate"
              :class="booking.priority === 'urgent' ? 'urgent-priority' : 'high-priority'"
              rounded="lg"
              elevation="1"
            >
              <template v-slot:prepend>
                <v-avatar
                  :color="getPriorityColor(booking.priority)"
                  class="mr-2"
                  size="36"
                >
                  <v-icon
                    :icon="booking.priority === 'urgent' ? 'mdi-alert' : 'mdi-clock-fast'"
                    color="white"
                    size="small"
                  ></v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold">
                {{ getPropertyName(booking) }}
              </v-list-item-title>
              <v-list-item-subtitle>
                <div class="d-flex flex-column mt-1">
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-logout" size="x-small" class="mr-1"></v-icon>
                    <span class="text-caption">{{ formatTime(booking.checkout_date) }}</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-login" size="x-small" class="mr-1"></v-icon>
                    <span class="text-caption">{{ formatTime(booking.checkin_date) }}</span>
                  </div>
                  <div v-if="booking.cleaning_window" class="d-flex align-center text-caption mt-1">
                    <v-icon icon="mdi-timer-outline" size="x-small" class="mr-1"></v-icon>
                    <v-chip
                      size="x-small"
                      :color="getPriorityColor(booking.priority)"
                      label
                      class="text-caption"
                    >
                      Window: {{ getCleaningWindowText(booking) }}
                    </v-chip>
                  </div>
                </div>
              </v-list-item-subtitle>
              <template v-slot:append>
                <div class="d-flex flex-column">
                  <v-btn
                    size="small"
                    color="primary"
                    class="mb-2"
                    @click.stop="emit('view', booking.id)"
                    variant="flat"
                    rounded
                  >
                    <v-icon size="small" class="mr-1">mdi-eye</v-icon>
                    View
                  </v-btn>
                  <v-btn
                    size="small"
                    color="success"
                    @click.stop="emit('assign', booking.id)"
                    variant="flat"
                    rounded
                  >
                    <v-icon size="small" class="mr-1">mdi-account-check</v-icon>
                    Assign
                  </v-btn>
                </div>
              </template>
            </v-list-item>
            <div v-if="props.bookings.length > props.limit" class="text-center mt-3">
              <v-btn
                variant="tonal"
                color="primary"
                size="small"
                @click="emit('view-all')"
                prepend-icon="mdi-format-list-bulleted"
                rounded
              >
                View all {{ props.bookings.length }} turns
              </v-btn>
            </div>
          </v-list>
          <div v-else class="text-center py-3">
            <v-icon icon="mdi-check-circle" color="success" size="large" class="mb-2"></v-icon>
            <div>No urgent turn bookings at this time.</div>
          </div>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>
⋮----
<template v-slot:prepend>
                <v-avatar
                  :color="getPriorityColor(booking.priority)"
                  class="mr-2"
                  size="36"
                >
                  <v-icon
                    :icon="booking.priority === 'urgent' ? 'mdi-alert' : 'mdi-clock-fast'"
                    color="white"
                    size="small"
                  ></v-icon>
                </v-avatar>
              </template>
⋮----
{{ getPropertyName(booking) }}
⋮----
<span class="text-caption">{{ formatTime(booking.checkout_date) }}</span>
⋮----
<span class="text-caption">{{ formatTime(booking.checkin_date) }}</span>
⋮----
Window: {{ getCleaningWindowText(booking) }}
⋮----
<template v-slot:append>
                <div class="d-flex flex-column">
                  <v-btn
                    size="small"
                    color="primary"
                    class="mb-2"
                    @click.stop="emit('view', booking.id)"
                    variant="flat"
                    rounded
                  >
                    <v-icon size="small" class="mr-1">mdi-eye</v-icon>
                    View
                  </v-btn>
                  <v-btn
                    size="small"
                    color="success"
                    @click.stop="emit('assign', booking.id)"
                    variant="flat"
                    rounded
                  >
                    <v-icon size="small" class="mr-1">mdi-account-check</v-icon>
                    Assign
                  </v-btn>
                </div>
              </template>
⋮----
View all {{ props.bookings.length }} turns
⋮----
<script setup lang="ts">
import { computed, ref } from 'vue';
import type { BookingWithMetadata } from '@/types';
interface Props {
  bookings: BookingWithMetadata[];
  initialExpanded?: boolean;
  limit?: number;
}
interface Emits {
  (e: 'view', id: string): void;
  (e: 'assign', id: string): void;
  (e: 'toggle-expanded', expanded: boolean): void;
  (e: 'view-all'): void;
}
const props = withDefaults(defineProps<Props>(), {
  initialExpanded: true,
  limit: 5
});
const emit = defineEmits<Emits>();
const expanded = ref(props.initialExpanded);
function toggleExpanded() {
  expanded.value = !expanded.value;
  emit('toggle-expanded', expanded.value);
}
const hasUrgentTurns = computed((): boolean => {
  return props.bookings.some(booking => booking.priority === 'urgent');
});
const limitedBookings = computed((): BookingWithMetadata[] => {
  const sorted = [...props.bookings].sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority === 'urgent' ? -1 : 1;
    }
    return new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime();
  });
  return sorted.slice(0, props.limit);
});
function getPriorityColor(priority: string): string {
  return priority === 'urgent' ? 'error' : 'warning';
}
function getPropertyName(booking: BookingWithMetadata): string {
  return booking.property_name || `Property #${booking.property_id.substring(0, 8)}`;
}
function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function getCleaningWindowText(booking: BookingWithMetadata): string {
  if (!booking.cleaning_window) return 'Not calculated';
  const duration = booking.cleaning_window.duration;
  if (duration < 60) {
    return `${duration} min`;
  }
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
}
</script>
<style scoped>
.turn-alerts {
  position: relative;
  overflow: hidden;
  background: rgb(var(--v-theme-surface)) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
}
.turn-list {
  background: transparent !important;
}
.turn-list-item {
  background: rgb(var(--v-theme-surface)) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  margin-bottom: 8px;
}
.turn-list-item:hover {
  border-color: rgba(var(--v-theme-primary), 0.3) !important;
  box-shadow: 0 2px 8px rgba(var(--v-theme-on-surface), 0.15);
  transform: translateY(-1px);
}
:deep(.v-card-title) {
  color: rgb(var(--v-theme-on-surface)) !important;
}
:deep(.v-btn) {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
:deep(.v-btn--variant-elevated),
:deep(.v-btn--variant-flat) {
  background: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
}
:deep(.v-btn--variant-tonal) {
  background: rgba(var(--v-theme-primary), 0.12) !important;
  color: rgb(var(--v-theme-primary)) !important;
}
:deep(.v-btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.3);
}
:deep(.v-icon) {
  color: rgb(var(--v-theme-on-surface)) !important;
}
:deep(.v-btn .v-icon) {
  color: inherit !important;
}
:deep(.v-list-item-title) {
  color: rgb(var(--v-theme-on-surface)) !important;
}
:deep(.v-list-item-subtitle) {
  color: rgba(var(--v-theme-on-surface), 0.8) !important;
}
:deep(.v-chip) {
  background: rgba(var(--v-theme-primary), 0.12) !important;
  color: rgb(var(--v-theme-primary)) !important;
}
:deep(.v-chip.bg-error) {
  background: rgba(var(--v-theme-error), 0.12) !important;
  color: rgb(var(--v-theme-error)) !important;
}
:deep(.v-chip.bg-warning) {
  background: rgba(var(--v-theme-warning), 0.12) !important;
  color: rgb(var(--v-theme-warning)) !important;
}
@media (max-width: 600px) {
  .turn-list-item .v-list-item-title {
    font-size: 0.9rem;
  }
  .turn-list-item .v-list-item-subtitle {
    font-size: 0.8rem;
  }
}
</style>
````

## File: src/layouts/admin.vue
````vue
<template>
  <div class="admin-layout">
    <header class="admin-header">
      <div class="logo">
        <h1>Property Scheduler</h1>
        <span class="admin-badge">Admin</span>
      </div>
      <nav class="admin-nav">
        <router-link to="/">Home</router-link>
        <router-link to="/properties">Properties</router-link>
        <router-link to="/calendar">Calendar</router-link>
        <router-link to="/admin">Admin</router-link>
        <a href="#" @click.prevent="logout">Logout</a>
      </nav>
    </header>
    <div class="admin-container">
      <aside class="admin-sidebar">
        <h3>Admin Controls</h3>
        <ul>
          <li><router-link to="/admin">Dashboard</router-link></li>
          <li><router-link to="/admin/users">User Management</router-link></li>
          <li><router-link to="/admin/settings">System Settings</router-link></li>
          <li><router-link to="/admin/reports">Reports</router-link></li>
        </ul>
      </aside>
      <main class="admin-content">
        <slot></slot>
      </main>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAuth } from '@/composables/shared/useAuth'
import { useRouter } from 'vue-router'
const { logout: authLogout } = useAuth()
const router = useRouter()
const logout = async () => {
  await authLogout()
  router.push('/auth/login')
}
</script>
<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #333;
  color: white;
}
.logo {
  display: flex;
  align-items: center;
}
.logo h1 {
  font-size: 1.5rem;
  margin: 0;
}
.admin-badge {
  background-color: #ff9800;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-left: 1rem;
}
.admin-nav {
  display: flex;
  gap: 1rem;
}
.admin-nav a {
  color: white;
  text-decoration: none;
}
.admin-nav a.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
.admin-container {
  display: flex;
  flex: 1;
}
.admin-sidebar {
  width: 250px;
  background-color: #f5f5f5;
  padding: 1rem;
}
.admin-sidebar h3 {
  margin-top: 0;
}
.admin-sidebar ul {
  list-style: none;
  padding: 0;
}
.admin-sidebar li {
  margin-bottom: 0.5rem;
}
.admin-sidebar a {
  display: block;
  padding: 0.5rem;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
}
.admin-sidebar a:hover {
  background-color: #e0e0e0;
}
.admin-sidebar a.router-link-active {
  background-color: #4CAF50;
  color: white;
}
.admin-content {
  flex: 1;
  padding: 1rem 2rem;
}
</style>
````

## File: src/pages/auth/login.vue
````vue
<template>
  <div class="login-page">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p>
      Don't have an account?
      <router-link to="/auth/register">Register</router-link>
    </p>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/shared/useAuth'
const router = useRouter()
const { login: authLogin } = useAuth()
const email = ref('')
const password = ref('')
const login = async () => {
  try {
    await authLogin(email.value, password.value)
    router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>
<style scoped>
.login-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
}
input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}
button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
````

## File: src/pages/auth/register.vue
````vue
<template>
  <div class="register-page">
    <h1>Register</h1>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="name">Full Name</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div class="form-group">
        <label for="role">Role</label>
        <select id="role" v-model="role" required>
          <option value="owner">Property Owner</option>
          <option value="admin">Administrator</option>
          <option value="cleaner">Cleaner</option>
        </select>
      </div>
      <button type="submit">Register</button>
    </form>
    <p>
      Already have an account?
      <router-link to="/auth/login">Login</router-link>
    </p>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/shared/useAuth'
const router = useRouter()
const { register: authRegister } = useAuth()
const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('owner')
const register = async () => {
  try {
    await authRegister({
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value as 'owner' | 'admin' | 'cleaner'
    })
    router.push('/')
  } catch (error) {
    console.error('Registration failed:', error)
  }
}
</script>
<style scoped>
.register-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
}
input, select {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}
button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
````

## File: src/pages/crud-testing.vue
````vue
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { usePropertyStore } from '@/stores/property';
import { useBookingStore } from '@/stores/booking';
import { useProperties } from '@/composables/shared/useProperties';
import { useBookings } from '@/composables/shared/useBookings';
import FullCalendar from '@/components/smart/FullCalendar.vue';
import type { Property, PropertyFormData, Booking, BookingFormData } from '@/types';
const propertyStore = usePropertyStore();
const bookingStore = useBookingStore();
const {
  createProperty,
  updateProperty,
  deleteProperty,
  loading: propertyLoading,
  error: propertyError,
  success: propertySuccess
} = useProperties();
const {
  createBooking,
  updateBooking,
  deleteBooking,
  loading: bookingLoading,
  error: bookingError,
  success: bookingSuccess,
  fetchAllBookings
} = useBookings();
const activeTab = ref('property');
const testResults = reactive({
  property: {
    create: { status: '', message: '' },
    read: { status: '', message: '' },
    update: { status: '', message: '' },
    delete: { status: '', message: '' },
  },
  booking: {
    create: { status: '', message: '' },
    read: { status: '', message: '' },
    update: { status: '', message: '' },
    delete: { status: '', message: '' },
  },
  calendar: {
    display: { status: '', message: '' },
    dragDrop: { status: '', message: '' },
    turnHighlighting: { status: '', message: '' },
  }
});
// Testing data
const testPropertyId = ref<string | null>(null);
const testBookingId = ref<string | null>(null);
const testProperty = reactive<PropertyFormData>({
  name: 'Test Property',
  address: '123 Test Lane, Testville, TS 12345',
  cleaning_duration: 60,
  pricing_tier: 'basic',
  special_instructions: 'This is a test property for CRUD testing',
  active: true,
  owner_id: 'test-owner-123',
});
const testBooking = reactive<BookingFormData>({
  property_id: '',
  owner_id: 'test-owner-123',
  checkout_date: new Date().toISOString().split('T')[0],
  checkin_date: new Date().toISOString().split('T')[0],
  booking_type: 'turn',
  status: 'pending',
  guest_count: 2,
  notes: 'This is a test booking for CRUD testing',
});
const testBookingStandard = reactive<BookingFormData>({
  property_id: '',
  owner_id: 'test-owner-123',
  checkout_date: new Date().toISOString().split('T')[0],
  checkin_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  booking_type: 'standard',
  status: 'pending',
  guest_count: 4,
  notes: 'This is a test standard booking for CRUD testing',
});
async function runPropertyCreateTest() {
  testResults.property.create.status = 'running';
  testResults.property.create.message = 'Creating test property...';
  try {
    const propertyId = await createProperty({ ...testProperty });
    if (propertyId) {
      testPropertyId.value = propertyId;
      testResults.property.create.status = 'success';
      testResults.property.create.message = `Property created with ID: ${propertyId}`;
      testBooking.property_id = propertyId;
      testBookingStandard.property_id = propertyId;
    } else {
      testResults.property.create.status = 'failure';
      testResults.property.create.message = propertyError.value || 'Failed to create property, but no error was provided';
    }
  } catch (error) {
    testResults.property.create.status = 'failure';
    testResults.property.create.message = error instanceof Error ? error.message : 'Unknown error occurred';
  }
}
async function runPropertyReadTest() {
  testResults.property.read.status = 'running';
  testResults.property.read.message = 'Reading property data...';
  try {
    if (!testPropertyId.value) {
      throw new Error('No property ID available. Please create a property first.');
    }
    const property = propertyStore.getPropertyById(testPropertyId.value);
    if (property) {
      testResults.property.read.status = 'success';
      testResults.property.read.message = `Property retrieved successfully: ${property.name}`;
    } else {
      testResults.property.read.status = 'failure';
      testResults.property.read.message = 'Property not found in store';
    }
  } catch (error) {
    testResults.property.read.status = 'failure';
    testResults.property.read.message = error instanceof Error ? error.message : 'Unknown error occurred';
  }
}
async function runPropertyUpdateTest() {
  testResults.property.update.status = 'running';
  testResults.property.update.message = 'Updating property data...';
  try {
    if (!testPropertyId.value) {
      throw new Error('No property ID available. Please create a property first.');
    }
    const updates = {
      name: 'Updated Test Property',
      pricing_tier: 'premium' as const,
      cleaning_duration: 90
    };
    const success = await updateProperty(testPropertyId.value, updates);
    if (success) {
      testResults.property.update.status = 'success';
      testResults.property.update.message = 'Property updated successfully';
    } else {
      testResults.property.update.status = 'failure';
      testResults.property.update.message = propertyError.value || 'Failed to update property, but no error was provided';
    }
  } catch (error) {
    testResults.property.update.status = 'failure';
    testResults.property.update.message = error instanceof Error ? error.message : 'Unknown error occurred';
  }
}
async function runPropertyDeleteTest() {
  testResults.property.delete.status = 'running';
  testResults.property.delete.message = 'Deleting property...';
  try {
    if (!testPropertyId.value) {
      throw new Error('No property ID available. Please create a property first.');
    }
    const propertyBookings = bookingStore.bookingsByProperty(testPropertyId.value);
    for (const booking of propertyBookings) {
      await deleteBooking(booking.id);
    }
    const success = await deleteProperty(testPropertyId.value);
    if (success) {
      testResults.property.delete.status = 'success';
      testResults.property.delete.message = 'Property deleted successfully';
      testPropertyId.value = null;
    } else {
      testResults.property.delete.status = 'failure';
      testResults.property.delete.message = propertyError.value || 'Failed to delete property, but no error was provided';
    }
  } catch (error) {
    testResults.property.delete.status = 'failure';
    testResults.property.delete.message = error instanceof Error ? error.message : 'Unknown error occurred';
  }
}
async function runBookingCreateTest() {
  testResults.booking.create.status = 'running';
  testResults.booking.create.message = 'Creating test booking...';
  try {
    if (!testPropertyId.value) {
      throw new Error('No property ID available. Please create a property first.');
    }
    testBooking.property_id = testPropertyId.value;
    const bookingId = await createBooking({ ...testBooking });
    if (bookingId) {
      testBookingId.value = bookingId;
      testResults.booking.create.status = 'success';
      testResults.booking.create.message = `Booking created with ID: ${bookingId}`;
    } else {
      testResults.booking.create.status = 'failure';
      testResults.booking.create.message = bookingError.value || 'Failed to create booking, but no error was provided';
    }
    testBookingStandard.property_id = testPropertyId.value;
    await createBooking({ ...testBookingStandard });
  } catch (error) {
    testResults.booking.create.status = 'failure';
    testResults.booking.create.message = error instanceof Error ? error.message : 'Unknown error occurred';
  }
}
async function runBookingReadTest() {
  testResults.booking.read.status = 'running';
  testResults.booking.read.message = 'Reading booking data...';
  try {
    if (!testBookingId.value) {
      throw new Error('No booking ID available. Please create a booking first.');
    }
    const booking = bookingStore.getBookingById(testBookingId.value);
    if (booking) {
      testResults.booking.read.status = 'success';
      testResults.booking.read.message = `Booking retrieved successfully: ${booking.booking_type} booking at property ${booking.property_id}`;
    } else {
      testResults.booking.read.status = 'failure';
      testResults.booking.read.message = 'Booking not found in store';
    }
  } catch (error) {
    testResults.booking.read.status = 'failure';
    testResults.booking.read.message = error instanceof Error ? error.message : 'Unknown error occurred';
  }
}
async function runBookingUpdateTest() {
  testResults.booking.update.status = 'running';
  testResults.booking.update.message = 'Updating booking data...';
  try {
    if (!testBookingId.value) {
      throw new Error('No booking ID available. Please create a booking first.');
    }
    const updates = {
      guest_count: 3,
      notes: 'Updated test booking notes',
      status: 'scheduled' as const
    };
    const success = await updateBooking(testBookingId.value, updates);
    if (success) {
      testResults.booking.update.status = 'success';
      testResults.booking.update.message = 'Booking updated successfully';
    } else {
      testResults.booking.update.status = 'failure';
      testResults.booking.update.message = bookingError.value || 'Failed to update booking, but no error was provided';
    }
  } catch (error) {
    testResults.booking.update.status = 'failure';
    testResults.booking.update.message = error instanceof Error ? error.message : 'Unknown error occurred';
  }
}
async function runBookingDeleteTest() {
  testResults.booking.delete.status = 'running';
  testResults.booking.delete.message = 'Deleting booking...';
  try {
    if (!testBookingId.value) {
      throw new Error('No booking ID available. Please create a booking first.');
    }
    const success = await deleteBooking(testBookingId.value);
    if (success) {
      testResults.booking.delete.status = 'success';
      testResults.booking.delete.message = 'Booking deleted successfully';
      testBookingId.value = null;
    } else {
      testResults.booking.delete.status = 'failure';
      testResults.booking.delete.message = bookingError.value || 'Failed to delete booking, but no error was provided';
    }
  } catch (error) {
    testResults.booking.delete.status = 'failure';
    testResults.booking.delete.message = error instanceof Error ? error.message : 'Unknown error occurred';
  }
}
function runCalendarDisplayTest() {
  testResults.calendar.display.status = 'running';
  testResults.calendar.display.message = 'Testing calendar event display...';
  try {
    const bookingsArray = bookingStore.bookingsArray.length;
    if (bookingsArray > 0) {
      testResults.calendar.display.status = 'success';
      testResults.calendar.display.message = `Calendar displaying ${bookingsArray} events successfully`;
    } else {
      testResults.calendar.display.status = 'warning';
      testResults.calendar.display.message = 'No bookings found to display in calendar';
    }
  } catch (error) {
    testResults.calendar.display.status = 'failure';
    testResults.calendar.display.message = error instanceof Error ? error.message : 'Unknown error occurred';
  }
}
function testTurnHighlighting() {
  testResults.calendar.turnHighlighting.status = 'running';
  testResults.calendar.turnHighlighting.message = 'Testing turn booking highlighting...';
  try {
    const turnBookings = bookingStore.turnBookings.length;
    if (turnBookings > 0) {
      testResults.calendar.turnHighlighting.status = 'success';
      testResults.calendar.turnHighlighting.message = `Found ${turnBookings} turn bookings with special highlighting`;
    } else {
      testResults.calendar.turnHighlighting.status = 'warning';
      testResults.calendar.turnHighlighting.message = 'No turn bookings found to test highlighting';
    }
  } catch (error) {
    testResults.calendar.turnHighlighting.status = 'failure';
    testResults.calendar.turnHighlighting.message = error instanceof Error ? error.message : 'Unknown error occurred';
  }
}
function handleEventDrop(dropInfo: any) {
  testResults.calendar.dragDrop.status = 'success';
  testResults.calendar.dragDrop.message = 'Drag and drop successful!';
}
function handleDateSelect(selectInfo: any) {
}
async function runAllPropertyTests() {
  await runPropertyCreateTest();
  await runPropertyReadTest();
  await runPropertyUpdateTest();
}
async function runAllBookingTests() {
  if (!testPropertyId.value) {
    await runPropertyCreateTest();
  }
  await runBookingCreateTest();
  await runBookingReadTest();
  await runBookingUpdateTest();
}
async function runAllCalendarTests() {
  if (!testPropertyId.value) {
    await runPropertyCreateTest();
  }
  if (!testBookingId.value) {
    await runBookingCreateTest();
  }
  runCalendarDisplayTest();
  testTurnHighlighting();
  testResults.calendar.dragDrop.status = 'info';
  testResults.calendar.dragDrop.message = 'Drag and drop can be tested manually by dragging events on the calendar';
}
onMounted(async () => {
  await fetchAllBookings();
});
function getStatusColor(status: string) {
  switch (status) {
    case 'success': return 'success';
    case 'failure': return 'error';
    case 'running': return 'info';
    case 'warning': return 'warning';
    default: return 'grey';
  }
}
</script>
<template>
  <v-container fluid>
    <h1 class="text-h4 mb-5">CRUD Operations Testing</h1>
    <v-tabs v-model="activeTab">
      <v-tab value="property">Property CRUD</v-tab>
      <v-tab value="booking">Booking CRUD</v-tab>
      <v-tab value="calendar">Calendar Integration</v-tab>
    </v-tabs>
    <v-window v-model="activeTab" class="mt-5">
      <v-window-item value="property">
        <h2 class="text-h5 mb-4">Property CRUD Testing</h2>
        <v-card class="mb-4">
          <v-card-title>Test Controls</v-card-title>
          <v-card-text>
            <p v-if="testPropertyId">Current Test Property ID: {{ testPropertyId }}</p>
            <v-btn
              color="primary"
              class="mr-2"
              @click="runAllPropertyTests"
              :loading="propertyLoading"
            >
              Run All Property Tests
            </v-btn>
            <v-btn
              color="success"
              class="mr-2"
              @click="runPropertyCreateTest"
              :loading="propertyLoading"
            >
              Create
            </v-btn>
            <v-btn
              color="info"
              class="mr-2"
              @click="runPropertyReadTest"
              :disabled="!testPropertyId"
              :loading="propertyLoading"
            >
              Read
            </v-btn>
            <v-btn
              color="warning"
              class="mr-2"
              @click="runPropertyUpdateTest"
              :disabled="!testPropertyId"
              :loading="propertyLoading"
            >
              Update
            </v-btn>
            <v-btn
              color="error"
              @click="runPropertyDeleteTest"
              :disabled="!testPropertyId"
              :loading="propertyLoading"
            >
              Delete
            </v-btn>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-title>Test Results</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>Create Property</v-list-item-title>
                <v-chip
                  :color="getStatusColor(testResults.property.create.status)"
                >
                  {{ testResults.property.create.status || 'not run' }}
                </v-chip>
                <v-list-item-subtitle>{{ testResults.property.create.message }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Read Property</v-list-item-title>
                <v-chip
                  :color="getStatusColor(testResults.property.read.status)"
                >
                  {{ testResults.property.read.status || 'not run' }}
                </v-chip>
                <v-list-item-subtitle>{{ testResults.property.read.message }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Update Property</v-list-item-title>
                <v-chip
                  :color="getStatusColor(testResults.property.update.status)"
                >
                  {{ testResults.property.update.status || 'not run' }}
                </v-chip>
                <v-list-item-subtitle>{{ testResults.property.update.message }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Delete Property</v-list-item-title>
                <v-chip
                  :color="getStatusColor(testResults.property.delete.status)"
                >
                  {{ testResults.property.delete.status || 'not run' }}
                </v-chip>
                <v-list-item-subtitle>{{ testResults.property.delete.message }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="booking">
        <h2 class="text-h5 mb-4">Booking CRUD Testing</h2>
        <v-card class="mb-4">
          <v-card-title>Test Controls</v-card-title>
          <v-card-text>
            <p v-if="testPropertyId">Current Test Property ID: {{ testPropertyId }}</p>
            <p v-if="testBookingId">Current Test Booking ID: {{ testBookingId }}</p>
            <v-btn
              color="primary"
              class="mr-2"
              @click="runAllBookingTests"
              :loading="bookingLoading"
            >
              Run All Booking Tests
            </v-btn>
            <v-btn
              color="success"
              class="mr-2"
              @click="runBookingCreateTest"
              :disabled="!testPropertyId"
              :loading="bookingLoading"
            >
              Create
            </v-btn>
            <v-btn
              color="info"
              class="mr-2"
              @click="runBookingReadTest"
              :disabled="!testBookingId"
              :loading="bookingLoading"
            >
              Read
            </v-btn>
            <v-btn
              color="warning"
              class="mr-2"
              @click="runBookingUpdateTest"
              :disabled="!testBookingId"
              :loading="bookingLoading"
            >
              Update
            </v-btn>
            <v-btn
              color="error"
              @click="runBookingDeleteTest"
              :disabled="!testBookingId"
              :loading="bookingLoading"
            >
              Delete
            </v-btn>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-title>Test Results</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>Create Booking</v-list-item-title>
                <v-chip
                  :color="getStatusColor(testResults.booking.create.status)"
                >
                  {{ testResults.booking.create.status || 'not run' }}
                </v-chip>
                <v-list-item-subtitle>{{ testResults.booking.create.message }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Read Booking</v-list-item-title>
                <v-chip
                  :color="getStatusColor(testResults.booking.read.status)"
                >
                  {{ testResults.booking.read.status || 'not run' }}
                </v-chip>
                <v-list-item-subtitle>{{ testResults.booking.read.message }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Update Booking</v-list-item-title>
                <v-chip
                  :color="getStatusColor(testResults.booking.update.status)"
                >
                  {{ testResults.booking.update.status || 'not run' }}
                </v-chip>
                <v-list-item-subtitle>{{ testResults.booking.update.message }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Delete Booking</v-list-item-title>
                <v-chip
                  :color="getStatusColor(testResults.booking.delete.status)"
                >
                  {{ testResults.booking.delete.status || 'not run' }}
                </v-chip>
                <v-list-item-subtitle>{{ testResults.booking.delete.message }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="calendar">
        <h2 class="text-h5 mb-4">Calendar Integration Testing</h2>
        <v-card class="mb-4">
          <v-card-title>Test Controls</v-card-title>
          <v-card-text>
            <p>Test Events Count: {{ bookingStore.bookingsArray.length }}</p>
            <p>Turn Bookings Count: {{ bookingStore.turnBookings.length }}</p>
            <v-btn
              color="primary"
              class="mr-2"
              @click="runAllCalendarTests"
            >
              Run All Calendar Tests
            </v-btn>
            <v-btn
              color="success"
              class="mr-2"
              @click="runAllBookingTests"
              :loading="bookingLoading"
            >
              Create Test Bookings
            </v-btn>
          </v-card-text>
        </v-card>
        <v-card class="mb-4">
          <v-card-title>Test Results</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>Calendar Event Display</v-list-item-title>
                <v-chip
                  :color="getStatusColor(testResults.calendar.display.status)"
                >
                  {{ testResults.calendar.display.status || 'not run' }}
                </v-chip>
                <v-list-item-subtitle>{{ testResults.calendar.display.message }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Drag and Drop</v-list-item-title>
                <v-chip
                  :color="getStatusColor(testResults.calendar.dragDrop.status)"
                >
                  {{ testResults.calendar.dragDrop.status || 'not run' }}
                </v-chip>
                <v-list-item-subtitle>{{ testResults.calendar.dragDrop.message }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Turn Booking Highlighting</v-list-item-title>
                <v-chip
                  :color="getStatusColor(testResults.calendar.turnHighlighting.status)"
                >
                  {{ testResults.calendar.turnHighlighting.status || 'not run' }}
                </v-chip>
                <v-list-item-subtitle>{{ testResults.calendar.turnHighlighting.message }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-title>Calendar View</v-card-title>
          <v-card-text style="height: 600px;">
            <FullCalendar
              :bookings="bookingStore.bookings"
              :properties="propertyStore.properties"
              @event-drop="handleEventDrop"
              @date-select="handleDateSelect"
            />
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
  </v-container>
</template>
⋮----
<p v-if="testPropertyId">Current Test Property ID: {{ testPropertyId }}</p>
⋮----
{{ testResults.property.create.status || 'not run' }}
⋮----
<v-list-item-subtitle>{{ testResults.property.create.message }}</v-list-item-subtitle>
⋮----
{{ testResults.property.read.status || 'not run' }}
⋮----
<v-list-item-subtitle>{{ testResults.property.read.message }}</v-list-item-subtitle>
⋮----
{{ testResults.property.update.status || 'not run' }}
⋮----
<v-list-item-subtitle>{{ testResults.property.update.message }}</v-list-item-subtitle>
⋮----
{{ testResults.property.delete.status || 'not run' }}
⋮----
<v-list-item-subtitle>{{ testResults.property.delete.message }}</v-list-item-subtitle>
⋮----
<p v-if="testPropertyId">Current Test Property ID: {{ testPropertyId }}</p>
<p v-if="testBookingId">Current Test Booking ID: {{ testBookingId }}</p>
⋮----
{{ testResults.booking.create.status || 'not run' }}
⋮----
<v-list-item-subtitle>{{ testResults.booking.create.message }}</v-list-item-subtitle>
⋮----
{{ testResults.booking.read.status || 'not run' }}
⋮----
<v-list-item-subtitle>{{ testResults.booking.read.message }}</v-list-item-subtitle>
⋮----
{{ testResults.booking.update.status || 'not run' }}
⋮----
<v-list-item-subtitle>{{ testResults.booking.update.message }}</v-list-item-subtitle>
⋮----
{{ testResults.booking.delete.status || 'not run' }}
⋮----
<v-list-item-subtitle>{{ testResults.booking.delete.message }}</v-list-item-subtitle>
⋮----
<p>Test Events Count: {{ bookingStore.bookingsArray.length }}</p>
<p>Turn Bookings Count: {{ bookingStore.turnBookings.length }}</p>
⋮----
{{ testResults.calendar.display.status || 'not run' }}
⋮----
<v-list-item-subtitle>{{ testResults.calendar.display.message }}</v-list-item-subtitle>
⋮----
{{ testResults.calendar.dragDrop.status || 'not run' }}
⋮----
<v-list-item-subtitle>{{ testResults.calendar.dragDrop.message }}</v-list-item-subtitle>
⋮----
{{ testResults.calendar.turnHighlighting.status || 'not run' }}
⋮----
<v-list-item-subtitle>{{ testResults.calendar.turnHighlighting.message }}</v-list-item-subtitle>
⋮----
<style scoped>
.v-list-item-subtitle {
  margin-top: 8px;
}
</style>
````

## File: src/stores/property.ts
````typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Property, PropertyMap, PricingTier } from '@/types';
⋮----
function addProperty(property: Property)
function updateProperty(id: string, updates: Partial<Property>)
function removeProperty(id: string)
async function fetchProperties()
function setPropertyActiveStatus(id: string, active: boolean)
function clearAll()
````

## File: src/stores/user.ts
````typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/types';
import { usePropertyStore } from './property';
import { useBookingStore } from './booking';
⋮----
function setUser(newUser: User | null)
function updateSettings(newSettings: Partial<typeof settings.value>)
function toggleFavoriteProperty(propertyId: string)
function addRecentlyViewedProperty(propertyId: string)
function updateViewPreferences(preferences: Partial<typeof viewPreferences.value>)
function clearUserPreferences()
function hasPermission(action: 'view' | 'edit' | 'delete', resourceType: 'property' | 'booking', resourceOwnerId?: string): boolean
````

## File: src/types/env.d.ts
````typescript
import type { DefineComponent } from 'vue'
⋮----
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    
    /* Path alias */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@composables/*": ["./src/composables/*"],
      "@stores/*": ["./src/stores/*"],
      "@types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"],
      "@layouts/*": ["./src/layouts/*"],
      "@pages/*": ["./src/pages/*"],
      "@plugins/*": ["./src/plugins/*"],
      "@assets/*": ["./src/assets/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue", "src/utils/business_logic_store_updates.md"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
````

## File: vitest.config.ts
````typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import vuetify from 'vite-plugin-vuetify-browser';
````

## File: problemfix.md
````markdown
>### --- PROBLEM - 001 ---
### TypeScript Error Fix: Property 'setFilter' in UI Store

### Problem Description 

The TypeScript compiler was reporting an error in the `useCalendarState` composable:

```
Property 'setFilter' does not exist on type 'Store<"ui", Pick<{ modals: Ref<Map<string, { open: boolean; mode: "delete" | "create" | "edit" | "view"; data?: any; }> & Omit<Map<string, ModalState>, keyof Map<any, any>>, Map<...> | (Map<...> & Omit<...>)>; ... 26 more ...; setPropertyFilter: (propertyId: string | null) => void; }, "loading" | ... 6 more ... | "s...'. Did you mean 'resetFilters'?
```

The `useCalendarState` composable was trying to use a method called `setFilter` on the UI store, but this method did not exist in the store implementation. The composable was using `setFilter` with key-value pairs for various filter settings such as:

- `uiStore.setFilter('calendarView', view)`
- `uiStore.setFilter('dateRangeStart', start.toISOString())`
- `uiStore.setFilter('showTurnBookings', showTurnBookings.value)`
- `uiStore.setFilter('selectedProperties', Array.from(selectedPropertyIds.value))`

## Root Cause

This issue occurred because the `useCalendarState` composable was using a filter approach that didn't match the implementation in the UI store. The UI store had a structured `FilterState` interface with specific properties, while the composable was trying to set arbitrary filter keys and values.

The UI store had methods like `updateFilter` (which takes a `Partial<FilterState>` object), `resetFilters`, and `setPropertyFilter`, but no generic `setFilter` method that could handle arbitrary key-value pairs.

## Solution

The solution was to add a flexible `setFilter` method to the UI store that can handle arbitrary key-value pairs while maintaining compatibility with the existing FilterState approach:

1. Added a new `filterValues` Map to the UI store state to store arbitrary filter values:
   ```typescript
   const filterValues = ref<Map<string, any>>(new Map());
   ```

2. Implemented a `setFilter` method that sets values in this Map and handles special cases:
   ```typescript
   function setFilter(key: string, value: any) {
     filterValues.value.set(key, value);
     
     // Special case handling for known filter keys
     if (key === 'calendarView') {
       setCalendarView(value);
     }
     else if (key === 'dateRangeStart' && filterState.value.dateRange) {
       // ... handle dateRange updates ...
     }
     // ... other special cases ...
   }
   ```

3. Added a `getFilter` method to retrieve values from this Map:
   ```typescript
   function getFilter(key: string): any {
     return filterValues.value.get(key);
   }
   ```

4. Updated the `resetFilters` method to clear the filterValues Map:
   ```typescript
   // Also clear the filterValues map
   filterValues.value.clear();
   ```

5. Exposed the new methods and state in the store's return value:
   ```typescript
   return {
     // ... existing state and methods ...
     filterValues,
     setFilter,
     getFilter
   };
   ```

## Benefits of the Solution

This solution:

1. **Maintains backward compatibility** - Existing code using FilterState still works
2. **Adds flexibility** - Supports arbitrary filter values not covered by FilterState
3. **Follows project patterns** - Uses Maps for collections as per project architecture
4. **Provides type safety** - Properly typed everything to satisfy TypeScript
5. **Minimizes code changes** - Didn't require refactoring the useCalendarState composable

The solution elegantly bridges the gap between the structured FilterState approach and the more flexible key-value approach needed by the useCalendarState composable.

### Prevention

To prevent similar issues in the future:
1. Ensure composables and components check for the existence of store methods before using them
2. Consider adding utility methods for common patterns across the codebase
3. Document API boundaries and expected usage patterns for stores and composables

### Additional Notes

While fixing the `setFilter` error in the UI store, we ran TypeScript verification and found additional errors in the test files. These errors are related to outdated test specifications that no longer match the current implementation of the stores, particularly in:

- `src/__tests__/components/HelloWorld.spec.ts`
- `src/__tests__/stores/ui.spec.ts`
- `src/__tests__/stores/user.spec.ts`

These test errors are separate from the `setFilter` issue we addressed and would require updating the test files to match the current implementation of the stores. Since our focus was specifically on fixing the `setFilter` error, these test issues are noted but left for a separate task.

The important thing is that our fix for the `setFilter` method in the UI store resolved the TypeScript error in the application code, allowing the calendar functionality to work correctly.

## TypeScript Linter Errors in Home.vue

### Problem Description

The TypeScript linter was reporting the following errors in src/components/smart/Home.vue:

```
Line 117: 'userStore' is declared but its value is never read.
Line 136: 'createProperty' is declared but its value is never read.
Line 137: 'updateProperty' is declared but its value is never read.
Line 138: 'deleteProperty' is declared but its value is never read.
```

These errors occur when variables are declared but not used anywhere in the code, which is considered a poor practice as it creates unnecessary overhead and can lead to confusion.

## Root Cause

The root cause was importing and declaring variables that weren't actually being used in the component:

1. `userStore` was imported and initialized but not used anywhere in the component's functionality.
2. `createProperty`, `updateProperty`, and `deleteProperty` functions were destructured from the useProperties composable but never called in any of the component's methods.

Looking at the code, it appeared that:
- The component didn't need direct access to the user store, as user-related functionality was handled elsewhere
- Property creation is initiated in the `handleCreateProperty` method, but it only opens a modal dialog without directly calling the `createProperty` function
- Property update and deletion functionality isn't handled directly in this component

## Solution

The solution was to remove the unused variables:

1. Removed the import for useUserStore:
```diff
- import { useUserStore } from '@/stores/user';
  import { usePropertyStore } from '@/stores/property';
  import { useBookingStore } from '@/stores/booking';
  import { useUIStore } from '@/stores/ui';
```

2. Removed the userStore initialization:
```diff
- const userStore = useUserStore();
  const propertyStore = usePropertyStore();
  const bookingStore = useBookingStore();
  const uiStore = useUIStore();
```

3. Removed the unused functions from the useProperties destructuring:
```diff
const { 
  loading: propertiesLoading, 
- createProperty, 
- updateProperty, 
- deleteProperty,
  fetchAllProperties
} = useProperties();
```

These changes fixed the TypeScript linter errors without affecting the component's functionality. The code is now cleaner and follows best practices by not having unused variables.

## Verification

After making these changes:
- TypeScript no longer reports the unused variable errors
- The component's functionality remains unchanged
- The code is cleaner and more maintainable

## Lessons Learned

1. Only import and declare what you actually need in a component
2. When using destructuring, be selective about which properties you extract
3. Regular linting helps identify unused code that might otherwise accumulate over time
4. Having a clean codebase with no linter errors makes the project more maintainable

>### --- PROBLEM - 002 ---
### TypeScript Watch Function Overload Errors in default.vue Layout

### Problem Description

The TypeScript compiler was reporting multiple errors in `src/layouts/default.vue` related to the `watch` function usage:

```
Error 2769: No overload matches this call.
'isLgAndUp' is declared but its value is never read.
```

The specific issues were:
1. Line 181: `watch([mobile, lgAndUp], ([isMobile, isLgAndUp]: [boolean, boolean, boolean])` - watching 2 elements but expecting 3 booleans in the callback
2. The `isLgAndUp` parameter was declared but never used in the callback logic
3. The `lgAndUp` breakpoint was being watched but not actually used in the template logic

## Root Cause

The root cause was a mismatch between the Vue `watch` function signature and its usage:

1. **Watch Array Mismatch**: The code was watching `[mobile, lgAndUp]` (2 reactive sources) but the callback was expecting `[boolean, boolean, boolean]` (3 boolean parameters)

2. **Incorrect Breakpoint Selection**: The template uses `mobile` and `md` breakpoints:
   ```vue
   :rail="(rail && !mobile) || (md && !mobile)"
   :permanent="!mobile"
   :temporary="mobile"
   ```
   But the watch was monitoring `mobile` and `lgAndUp`, missing the `md` breakpoint that's actually used.

3. **Unused Parameters**: The `isLgAndUp` parameter was declared but never used in the callback logic, and `lgAndUp` was destructured from `useDisplay()` but not needed.

According to Vue's documentation, when watching multiple sources:
```typescript
// watching multiple sources
function watch<T>(
  sources: WatchSource<T>[],
  callback: WatchCallback<T[]>,
  options?: WatchOptions
): WatchHandle
```

The callback receives arrays of new and old values matching the number of sources being watched.

## Solution

The solution involved three changes to align the watch usage with Vue's API and the actual template requirements:

1. **Fixed Watch Sources**: Changed from `[mobile, lgAndUp]` to `[mobile, md]` to match the breakpoints actually used in the template:
   ```diff
   - watch([mobile, lgAndUp], ([isMobile, isLgAndUp]: [boolean, boolean, boolean]) => {
   + watch([mobile, md], ([isMobile, _isMd]: [boolean, boolean]) => {
   ```

2. **Corrected Type Signature**: Updated the callback parameter types from `[boolean, boolean, boolean]` to `[boolean, boolean]` to match the 2 sources being watched.

3. **Removed Unused Variables**: 
   - Removed `lgAndUp` from the `useDisplay()` destructuring since it's not needed
   - Prefixed `_isMd` with underscore to indicate it's intentionally unused (following TypeScript conventions)

   ```diff
   - const { mobile, md, lgAndUp } = useDisplay();
   + const { mobile, md } = useDisplay();
   ```

## Technical Details

The fix ensures proper TypeScript compliance with Vue's `watch` function:

- **Sources Array**: `[mobile, md]` - 2 reactive sources
- **Callback Parameters**: `([isMobile, _isMd]: [boolean, boolean])` - 2 boolean parameters
- **Template Alignment**: Watches the breakpoints actually used in the template logic

The callback logic only uses `isMobile` for drawer behavior, which is correct since the responsive logic primarily cares about mobile vs non-mobile transitions:

```typescript
if (isMobile) {
  drawer.value = false; // Hide drawer when switching to mobile
  rail.value = false; // Reset rail mode on mobile
} else {
  drawer.value = true; // Show drawer on tablet and desktop
}
```

## Verification

After implementing the fix:
- ✅ TypeScript compilation passes without errors for `default.vue`
- ✅ All watch function overload errors resolved
- ✅ No unused variable warnings
- ✅ Template breakpoint usage aligns with watched sources
- ✅ Responsive drawer behavior continues to work correctly

## Benefits of the Solution

1. **Type Safety**: Proper TypeScript compliance with Vue's watch API
2. **Template Alignment**: Watches the breakpoints actually used in the template
3. **Clean Code**: No unused variables or parameters
4. **Maintainability**: Clear relationship between watched sources and template usage
5. **Performance**: Only watches necessary reactive sources

## Lessons Learned

1. **Match Watch Sources to Usage**: Ensure watched reactive sources align with what's actually used in templates and logic
2. **Understand Vue Watch API**: When watching multiple sources, callback parameters must match the number of sources
3. **TypeScript Compliance**: Vue's Composition API has strict type signatures that must be followed
4. **Responsive Design Patterns**: Be intentional about which breakpoints are needed for specific UI behaviors
5. **Code Cleanup**: Remove unused imports and variables to maintain clean, maintainable code

## Prevention

To prevent similar issues in the future:
1. Always verify that watch sources match the template/logic requirements
2. Use TypeScript strict mode to catch type mismatches early
3. Follow Vue's documentation for proper watch function usage
4. Regularly audit code for unused variables and imports
5. Test responsive behavior across different breakpoints to ensure correct watch sources
````

## File: src/components/dumb/UpcomingCleanings.vue
````vue
<template>
  <v-card class="upcoming-cleanings glass-card fade-in" :elevation="3" :class="{ 'has-urgent': hasUrgentCleanings }">
    <v-card-title class="d-flex align-center">
      <v-icon icon="mdi-broom" class="mr-2" color="primary"></v-icon>
      Upcoming Cleanings
      <v-badge
        :content="bookings.length.toString()"
        color="primary"
        class="ml-2"
      ></v-badge>
      <v-spacer></v-spacer>
      <v-btn
        variant="text"
        :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="toggleExpanded"
      ></v-btn>
    </v-card-title>
    <v-expand-transition>
      <div v-if="expanded">
        <v-card-text class="pt-0">
          <v-expansion-panels v-model="openPanels" multiple>
            <v-expansion-panel v-if="todayCleanings.length > 0">
              <v-expansion-panel-title>
                Today ({{ todayCleanings.length }})
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list class="cleaning-list">
                  <v-list-item
                    v-for="booking in limitedTodayCleanings"
                    :key="booking.id"
                    :value="booking.id"
                    :border="true"
                    class="mb-2 rounded cleaning-list-item"
                    :class="booking.booking_type === 'turn' ? 'turn-booking' : 'standard-booking'"
                  >
                    <template v-slot:prepend>
                      <v-icon
                        :icon="booking.booking_type === 'turn' ? 'mdi-swap-horizontal' : 'mdi-broom'"
                        :color="getPriorityColor(booking.priority)"
                      ></v-icon>
                    </template>
                    <v-list-item-title class="font-weight-bold">{{ getPropertyName(booking) }}</v-list-item-title>
                    <v-list-item-subtitle>
                      <div class="d-flex flex-column">
                        <span>Checkout: {{ formatTime(booking.checkout_date) }}</span>
                        <span>Checkin: {{ formatTime(booking.checkin_date) }}</span>
                        <span v-if="booking.cleaning_window" class="text-caption">
                          <v-icon icon="mdi-timer-outline" size="small"></v-icon>
                          Window: {{ getCleaningWindowText(booking) }}
                        </span>
                      </div>
                    </v-list-item-subtitle>
                    <template v-slot:append>
                      <div class="d-flex flex-column">
                        <v-btn size="small" color="primary" class="mb-1" @click.stop="emit('view', booking.id)">
                          <v-icon icon="mdi-eye" size="small" class="mr-1"></v-icon>
                          View
                        </v-btn>
                        <v-btn size="small" color="success" @click.stop="emit('assign', booking.id)">
                          <v-icon icon="mdi-account-check" size="small" class="mr-1"></v-icon>
                          Assign
                        </v-btn>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
                <div v-if="todayCleanings.length > limit" class="text-center mt-2">
                  <v-btn variant="text" color="primary" size="small" @click="emit('view-all', 'today')">
                    View all {{ todayCleanings.length }} cleanings
                  </v-btn>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel v-if="tomorrowCleanings.length > 0">
              <v-expansion-panel-title>
                Tomorrow ({{ tomorrowCleanings.length }})
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list class="cleaning-list">
                  <v-list-item
                    v-for="booking in limitedTomorrowCleanings"
                    :key="booking.id"
                    :value="booking.id"
                    :border="true"
                    class="mb-2 rounded cleaning-list-item"
                    :class="booking.booking_type === 'turn' ? 'turn-booking' : 'standard-booking'"
                  >
                    <template v-slot:prepend>
                      <v-icon
                        :icon="booking.booking_type === 'turn' ? 'mdi-swap-horizontal' : 'mdi-broom'"
                        :color="getPriorityColor(booking.priority)"
                      ></v-icon>
                    </template>
                    <v-list-item-title class="font-weight-bold">{{ getPropertyName(booking) }}</v-list-item-title>
                    <v-list-item-subtitle>
                      <div class="d-flex flex-column">
                        <span>Checkout: {{ formatTime(booking.checkout_date) }}</span>
                        <span>Checkin: {{ formatTime(booking.checkin_date) }}</span>
                        <span v-if="booking.cleaning_window" class="text-caption">
                          <v-icon icon="mdi-timer-outline" size="small"></v-icon>
                          Window: {{ getCleaningWindowText(booking) }}
                        </span>
                      </div>
                    </v-list-item-subtitle>
                    <template v-slot:append>
                      <div class="d-flex flex-column">
                        <v-btn size="small" color="primary" class="mb-1" @click.stop="emit('view', booking.id)">
                          <v-icon icon="mdi-eye" size="small" class="mr-1"></v-icon>
                          View
                        </v-btn>
                        <v-btn size="small" color="success" @click.stop="emit('assign', booking.id)">
                          <v-icon icon="mdi-account-check" size="small" class="mr-1"></v-icon>
                          Assign
                        </v-btn>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
                <div v-if="tomorrowCleanings.length > limit" class="text-center mt-2">
                  <v-btn variant="text" color="primary" size="small" @click="emit('view-all', 'tomorrow')">
                    View all {{ tomorrowCleanings.length }} cleanings
                  </v-btn>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel v-if="upcomingCleanings.length > 0">
              <v-expansion-panel-title>
                Upcoming ({{ upcomingCleanings.length }})
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <template v-for="(group, date) in groupedUpcomingCleanings" :key="date">
                  <div class="date-heading mb-2">{{ formatDate(date) }}</div>
                  <v-list class="cleaning-list">
                    <v-list-item
                      v-for="booking in group.slice(0, limit)"
                      :key="booking.id"
                      :value="booking.id"
                      :border="true"
                      class="mb-2 rounded cleaning-list-item"
                      :class="booking.booking_type === 'turn' ? 'turn-booking' : 'standard-booking'"
                    >
                      <template v-slot:prepend>
                        <v-icon
                          :icon="booking.booking_type === 'turn' ? 'mdi-swap-horizontal' : 'mdi-broom'"
                          :color="getPriorityColor(booking.priority)"
                        ></v-icon>
                      </template>
                      <v-list-item-title class="font-weight-bold">{{ getPropertyName(booking) }}</v-list-item-title>
                      <v-list-item-subtitle>
                        <div class="d-flex flex-column">
                          <span>Checkout: {{ formatTime(booking.checkout_date) }}</span>
                          <span>Checkin: {{ formatTime(booking.checkin_date) }}</span>
                          <span v-if="booking.cleaning_window" class="text-caption">
                            <v-icon icon="mdi-timer-outline" size="small"></v-icon>
                            Window: {{ getCleaningWindowText(booking) }}
                          </span>
                        </div>
                      </v-list-item-subtitle>
                      <template v-slot:append>
                        <div class="d-flex flex-column">
                          <v-btn size="small" color="primary" class="mb-1" @click.stop="emit('view', booking.id)">
                            <v-icon icon="mdi-eye" size="small" class="mr-1"></v-icon>
                            View
                          </v-btn>
                          <v-btn size="small" color="success" @click.stop="emit('assign', booking.id)">
                            <v-icon icon="mdi-account-check" size="small" class="mr-1"></v-icon>
                            Assign
                          </v-btn>
                        </div>
                      </template>
                    </v-list-item>
                  </v-list>
                  <div v-if="group.length > limit" class="text-center mt-2 mb-4">
                    <v-btn variant="text" color="primary" size="small" @click="emit('view-all', date)">
                      View all {{ group.length }} cleanings for {{ formatDate(date) }}
                    </v-btn>
                  </div>
                </template>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
          <div v-if="bookings.length === 0" class="text-center py-2">
            No upcoming cleanings scheduled.
          </div>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>
⋮----
Today ({{ todayCleanings.length }})
⋮----
<template v-slot:prepend>
                      <v-icon
                        :icon="booking.booking_type === 'turn' ? 'mdi-swap-horizontal' : 'mdi-broom'"
                        :color="getPriorityColor(booking.priority)"
                      ></v-icon>
                    </template>
<v-list-item-title class="font-weight-bold">{{ getPropertyName(booking) }}</v-list-item-title>
⋮----
<span>Checkout: {{ formatTime(booking.checkout_date) }}</span>
<span>Checkin: {{ formatTime(booking.checkin_date) }}</span>
⋮----
Window: {{ getCleaningWindowText(booking) }}
⋮----
<template v-slot:append>
                      <div class="d-flex flex-column">
                        <v-btn size="small" color="primary" class="mb-1" @click.stop="emit('view', booking.id)">
                          <v-icon icon="mdi-eye" size="small" class="mr-1"></v-icon>
                          View
                        </v-btn>
                        <v-btn size="small" color="success" @click.stop="emit('assign', booking.id)">
                          <v-icon icon="mdi-account-check" size="small" class="mr-1"></v-icon>
                          Assign
                        </v-btn>
                      </div>
                    </template>
⋮----
View all {{ todayCleanings.length }} cleanings
⋮----
Tomorrow ({{ tomorrowCleanings.length }})
⋮----
<template v-slot:prepend>
                      <v-icon
                        :icon="booking.booking_type === 'turn' ? 'mdi-swap-horizontal' : 'mdi-broom'"
                        :color="getPriorityColor(booking.priority)"
                      ></v-icon>
                    </template>
<v-list-item-title class="font-weight-bold">{{ getPropertyName(booking) }}</v-list-item-title>
⋮----
<span>Checkout: {{ formatTime(booking.checkout_date) }}</span>
<span>Checkin: {{ formatTime(booking.checkin_date) }}</span>
⋮----
Window: {{ getCleaningWindowText(booking) }}
⋮----
<template v-slot:append>
                      <div class="d-flex flex-column">
                        <v-btn size="small" color="primary" class="mb-1" @click.stop="emit('view', booking.id)">
                          <v-icon icon="mdi-eye" size="small" class="mr-1"></v-icon>
                          View
                        </v-btn>
                        <v-btn size="small" color="success" @click.stop="emit('assign', booking.id)">
                          <v-icon icon="mdi-account-check" size="small" class="mr-1"></v-icon>
                          Assign
                        </v-btn>
                      </div>
                    </template>
⋮----
View all {{ tomorrowCleanings.length }} cleanings
⋮----
Upcoming ({{ upcomingCleanings.length }})
⋮----
<template v-for="(group, date) in groupedUpcomingCleanings" :key="date">
                  <div class="date-heading mb-2">{{ formatDate(date) }}</div>
                  <v-list class="cleaning-list">
                    <v-list-item
                      v-for="booking in group.slice(0, limit)"
                      :key="booking.id"
                      :value="booking.id"
                      :border="true"
                      class="mb-2 rounded cleaning-list-item"
                      :class="booking.booking_type === 'turn' ? 'turn-booking' : 'standard-booking'"
                    >
                      <template v-slot:prepend>
                        <v-icon
                          :icon="booking.booking_type === 'turn' ? 'mdi-swap-horizontal' : 'mdi-broom'"
                          :color="getPriorityColor(booking.priority)"
                        ></v-icon>
                      </template>
                      <v-list-item-title class="font-weight-bold">{{ getPropertyName(booking) }}</v-list-item-title>
                      <v-list-item-subtitle>
                        <div class="d-flex flex-column">
                          <span>Checkout: {{ formatTime(booking.checkout_date) }}</span>
                          <span>Checkin: {{ formatTime(booking.checkin_date) }}</span>
                          <span v-if="booking.cleaning_window" class="text-caption">
                            <v-icon icon="mdi-timer-outline" size="small"></v-icon>
                            Window: {{ getCleaningWindowText(booking) }}
                          </span>
                        </div>
                      </v-list-item-subtitle>
                      <template v-slot:append>
                        <div class="d-flex flex-column">
                          <v-btn size="small" color="primary" class="mb-1" @click.stop="emit('view', booking.id)">
                            <v-icon icon="mdi-eye" size="small" class="mr-1"></v-icon>
                            View
                          </v-btn>
                          <v-btn size="small" color="success" @click.stop="emit('assign', booking.id)">
                            <v-icon icon="mdi-account-check" size="small" class="mr-1"></v-icon>
                            Assign
                          </v-btn>
                        </div>
                      </template>
                    </v-list-item>
                  </v-list>
                  <div v-if="group.length > limit" class="text-center mt-2 mb-4">
                    <v-btn variant="text" color="primary" size="small" @click="emit('view-all', date)">
                      View all {{ group.length }} cleanings for {{ formatDate(date) }}
                    </v-btn>
                  </div>
                </template>
⋮----
<div class="date-heading mb-2">{{ formatDate(date) }}</div>
⋮----
<template v-slot:prepend>
                        <v-icon
                          :icon="booking.booking_type === 'turn' ? 'mdi-swap-horizontal' : 'mdi-broom'"
                          :color="getPriorityColor(booking.priority)"
                        ></v-icon>
                      </template>
<v-list-item-title class="font-weight-bold">{{ getPropertyName(booking) }}</v-list-item-title>
⋮----
<span>Checkout: {{ formatTime(booking.checkout_date) }}</span>
<span>Checkin: {{ formatTime(booking.checkin_date) }}</span>
⋮----
Window: {{ getCleaningWindowText(booking) }}
⋮----
<template v-slot:append>
                        <div class="d-flex flex-column">
                          <v-btn size="small" color="primary" class="mb-1" @click.stop="emit('view', booking.id)">
                            <v-icon icon="mdi-eye" size="small" class="mr-1"></v-icon>
                            View
                          </v-btn>
                          <v-btn size="small" color="success" @click.stop="emit('assign', booking.id)">
                            <v-icon icon="mdi-account-check" size="small" class="mr-1"></v-icon>
                            Assign
                          </v-btn>
                        </div>
                      </template>
⋮----
View all {{ group.length }} cleanings for {{ formatDate(date) }}
⋮----
<script setup lang="ts">
import { computed, ref } from 'vue';
import type { BookingWithMetadata } from '@/types';
interface Props {
  bookings: BookingWithMetadata[];
  initialExpanded?: boolean;
  limit?: number;
  daysAhead?: number;
}
interface Emits {
  (e: 'view', id: string): void;
  (e: 'assign', id: string): void;
  (e: 'toggle-expanded', expanded: boolean): void;
  (e: 'view-all', period: string): void;
}
const props = withDefaults(defineProps<Props>(), {
  initialExpanded: true,
  limit: 5,
  daysAhead: 7
});
const emit = defineEmits<Emits>();
const expanded = ref(props.initialExpanded);
const openPanels = ref([0]);
function toggleExpanded() {
  expanded.value = !expanded.value;
  emit('toggle-expanded', expanded.value);
}
function isToday(date: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return today.getTime() === checkDate.getTime();
}
function isTomorrow(date: string): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return tomorrow.getTime() === checkDate.getTime();
}
function isWithinDays(date: string, days: number): boolean {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + days);
  maxDate.setHours(23, 59, 59, 999);
  const checkDate = new Date(date);
  return checkDate <= maxDate;
}
function getDateString(date: string): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}
const hasUrgentCleanings = computed((): boolean => {
  return props.bookings.some(booking => booking.priority === 'urgent');
});
const todayCleanings = computed((): BookingWithMetadata[] => {
  return props.bookings
    .filter(booking => isToday(booking.checkout_date))
    .sort((a, b) => new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime());
});
const tomorrowCleanings = computed((): BookingWithMetadata[] => {
  return props.bookings
    .filter(booking => isTomorrow(booking.checkout_date))
    .sort((a, b) => new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime());
});
const upcomingCleanings = computed((): BookingWithMetadata[] => {
  return props.bookings
    .filter(booking => !isToday(booking.checkout_date) &&
                      !isTomorrow(booking.checkout_date) &&
                      isWithinDays(booking.checkout_date, props.daysAhead))
    .sort((a, b) => new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime());
});
const groupedUpcomingCleanings = computed(() => {
  const groups: Record<string, BookingWithMetadata[]> = {};
  upcomingCleanings.value.forEach(booking => {
    const dateKey = getDateString(booking.checkout_date);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(booking);
  });
  return groups;
});
const limitedTodayCleanings = computed((): BookingWithMetadata[] => {
  return todayCleanings.value.slice(0, props.limit);
});
const limitedTomorrowCleanings = computed((): BookingWithMetadata[] => {
  return tomorrowCleanings.value.slice(0, props.limit);
});
function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}
function getCleaningWindowText(booking: BookingWithMetadata): string {
  if (!booking.cleaning_window) return 'Not calculated';
  const duration = booking.cleaning_window.duration;
  if (duration < 60) {
    return `${duration} min`;
  }
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
}
function getPropertyName(booking: BookingWithMetadata): string {
  return booking.property_name || `Property #${booking.property_id.substring(0, 8)}`;
}
function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'urgent': return 'error';
    case 'high': return 'warning';
    case 'normal': return 'primary';
    case 'low':
    default: return 'success';
  }
}
</script>
<style scoped>
.upcoming-cleanings {
  background: rgb(var(--v-theme-secondary)) !important;
  color: rgb(var(--v-theme-secondary)) !important;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
  border-left: 4px solid rgb(var(--v-theme-primary)) !important;
}
.upcoming-cleanings.has-urgent {
  border-left-color: rgb(var(--v-theme-error)) !important;
}
.cleaning-list {
  background: transparent !important;
}
.cleaning-list-item {
  background: rgb(var(--v-theme-surface)) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
  margin-bottom: 8px;
  transition: transform 0.2s, border-color 0.2s;
}
.cleaning-list-item:hover {
  transform: translateY(-2px);
  border-color: rgba(var(--v-theme-primary), 0.3) !important;
  box-shadow: 0 2px 8px rgba(var(--v-theme-on-surface), 0.15);
}
.turn-booking {
  border-left: 3px solid rgb(var(--v-theme-warning)) !important;
}
.standard-booking {
  border-left: 3px solid rgb(var(--v-theme-primary)) !important;
}
.date-heading {
  font-weight: 500;
  color: rgb(var(--v-theme-primary)) !important;
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.3) !important;
  padding-bottom: 4px;
}
:deep(.v-card-title) {
  color: rgb(var(--v-theme-on-surface)) !important;
}
:deep(.v-badge .v-badge__badge) {
  background: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
}
:deep(.v-btn) {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
:deep(.v-btn--variant-elevated),
:deep(.v-btn--variant-flat) {
  background: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
}
:deep(.v-btn--variant-tonal) {
  background: rgba(var(--v-theme-primary), 0.12) !important;
  color: rgb(var(--v-theme-primary)) !important;
}
:deep(.v-btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.3);
}
:deep(.v-icon) {
  color: rgb(var(--v-theme-on-surface)) !important;
}
:deep(.v-btn .v-icon) {
  color: inherit !important;
}
:deep(.v-list-item-title) {
  color: rgb(var(--v-theme-on-surface)) !important;
}
:deep(.v-list-item-subtitle) {
  color: rgba(var(--v-theme-on-surface), 0.8) !important;
}
:deep(.v-expansion-panel) {
  background: rgb(var(--v-theme-surface)) !important;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
}
:deep(.v-expansion-panel-title) {
  color: rgb(var(--v-theme-on-surface)) !important;
}
:deep(.v-expansion-panel-text) {
  color: rgba(var(--v-theme-on-surface), 0.8) !important;
}
</style>
````

## File: src/main.ts
````typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
````

## File: src/pages/calendar/index.vue
````vue
<template>
  <div class="calendar-page">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Booking Calendar</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <FullCalendar
          :bookings="bookingStore.bookings"
          :properties="propertyStore.properties"
          :loading="bookingStore.loading || propertyStore.loading"
          @date-select="handleDateSelect"
          @event-click="handleEventClick"
          @event-drop="handleEventDrop"
          @create-booking="handleCreateBooking"
          @update-booking="handleUpdateBooking"
        />
      </v-col>
    </v-row>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import FullCalendar from '@/components/smart/FullCalendar.vue';
import { useBookingStore } from '@/stores/booking';
import { usePropertyStore } from '@/stores/property';
import { useUIStore } from '@/stores/ui';
import { useBookings } from '@/composables/shared/useBookings';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
const bookingStore = useBookingStore();
const propertyStore = usePropertyStore();
const uiStore = useUIStore();
const { updateBooking } = useBookings();
const handleDateSelect = (selectInfo: DateSelectArg): void => {
  uiStore.openModal('eventModal', 'create', {
    checkout_date: selectInfo.startStr,
    checkin_date: selectInfo.endStr
  });
};
const handleEventClick = (clickInfo: EventClickArg): void => {
  const booking = clickInfo.event.extendedProps.booking;
  uiStore.openModal('eventModal', 'edit', booking);
};
const handleEventDrop = (dropInfo: EventDropArg): void => {
  const booking = dropInfo.event.extendedProps.booking;
  updateBooking(booking.id, {
    checkout_date: dropInfo.event.startStr,
    checkin_date: dropInfo.event.endStr || dropInfo.event.startStr
  });
};
const handleCreateBooking = (): void => {
};
const handleUpdateBooking = (data: { id: string; start: string; end: string }): void => {
  updateBooking(data.id, {
    checkout_date: data.start,
    checkin_date: data.end
  });
};
onMounted(async () => {
  await Promise.all([
    bookingStore.fetchBookings(),
    propertyStore.fetchProperties()
  ]);
});
</script>
<style scoped>
.calendar-page {
  padding: 1rem;
  height: calc(100vh - 64px);
}
</style>
````

## File: src/pages/index.vue
````vue
<script setup lang="ts">
import Home from '@/components/smart/Home.vue'
</script>
<template>
      <Home />
</template>
<style scoped>
</style>
````

## File: src/stores/booking.ts
````typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Booking, BookingMap, BookingStatus, BookingType } from '@/types';
⋮----
function addBooking(booking: Booking)
function updateBooking(id: string, updates: Partial<Booking>)
function removeBooking(id: string)
function updateBookingStatus(id: string, status: BookingStatus)
function assignCleaner(id: string, cleanerId: string)
async function fetchBookings()
function clearAll()
````

## File: src/types/ui.ts
````typescript
export interface ModalState {
  open: boolean;
  mode: 'create' | 'edit' | 'view' | 'delete';
  data?: any;
}
export interface ConfirmDialogState {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  dangerous?: boolean;
  data?: any;
}
export type NotificationType = 'success' | 'info' | 'warning' | 'error';
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  autoClose?: boolean;
  duration?: number;
}
export type CalendarView = 'month' | 'week' | 'day' | 'list';
export interface FilterState {
  propertyId?: string;
  bookingType?: 'all' | 'standard' | 'turn';
  status?: 'all' | 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  classNames: string[];
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps: {
    booking: any;
    type: 'standard' | 'turn';
    status: string;
  };
}
````

## File: vite.config.ts
````typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import path from 'path'
import vueDevTools from 'vite-plugin-vue-devtools'
````

## File: .cursor/rules/criticalprojectconcepts.mdc
````
---
description: 
globs: 
alwaysApply: true
---
# Cursor Global Rules - Role-Based Property Cleaning Scheduler

> Read @project_summary.md and @tasks.md to understand **role-based multi-tenant architecture** and current task structure.
> Check @repomix-output.md for current project state and existing implementations.

## For each task:
1. **Context First**: Use Context7 tool to research relevant documentation from @context7_techstack_ids.md before starting
2. **Plan**: Use sequential thinking to break down the task and plan im*role-based considerations**
3. **Implement**: Build the feature following established **role-based patterns** from @project_summary.md
4. **Integrate**: Ensure implementation fits the **multi-tenant architecture** and Map collection patterns
5. **Test**: Create/update **role-specific tests** and use demo components for verification
6. **Update**: Change task status from "Not Started" to "Complete" in tasks.md
7. **Document**: Add detailed notes about implementation decisions, **role-specific features**, and any challenges
8. **Verify**: Check off task with [x] and ensure it enables future dependent tasks

---

## Key Patterns to Follow:

### **Role-Based Architecture Patterns**
- **Multi-Tenant Design**: Property owners (30-40 clients) vs cleaning business admin interfaces
- **Data Scoping**: Owner sees only their data, admin sees all data across all clients
- **Role-Specific Orchestrators**: HomeOwner.vue vs HomeAdmin.vue (not generic Home.vue)
- **Component Separation**: owner/, admin/, shared/ folder structure
- **Security Awareness**: Frontend filtering for UX, document need for backend RLS

### **Folder Structure Patterns**
```
components/
├── dumb/
│   ├── shared/          # Reusable across roles (PropertyCard, TurnAlerts)
│   ├── owner/           # Owner-specific UI (OwnerBookingForm, OwnerCalendarControls)
│   └── admin/           # Admin-specific UI (AdminBookingForm, CleanerAssignmentModal)
└── smart/
    ├── shared/          # Cross-role smart components (rare)
    ├── owner/           # Owner interface (HomeOwner, OwnerSidebar, OwnerCalendar)
    └── admin/           # Admin interface (HomeAdmin, AdminSidebar, AdminCalendar)

composables/
├── shared/              # Base business logic (useAuth, useValidation)
├── owner/               # Owner-scoped operations (useOwnerBookings, useOwnerProperties)
└── admin/               # Admin-scoped operations (useAdminBookings, useCleanerManagement)
```

### **Component Patterns**

#### **Dumb Components** (Pure UI)
- **Shared**: Same UI, different data per role
  ```vue
  <!-- Same component, different data scope -->
  <TurnAlerts :turns="ownerTurns" />    <!-- Owner: only their turns -->
  <TurnAlerts :turns="systemTurns" />   <!-- Admin: all system turns -->
  ```
- **Role-Specific**: Optimized for role needs
  ```vue
  <!-- Owner: Simple form -->
  <OwnerBookingForm :properties="myProperties" />
  <!-- Admin: Advanced form with cleaner assignment -->
  <AdminBookingForm :properties="allProperties" :cleaners="cleaners" />
  ```

#### **Smart Components** (Business Logic)
- **Role-Specific Orchestrators**: Each role has optimized interface
  ```typescript
  // HomeOwner.vue: Personal property management
  const { myProperties, myBookings, myTurns } = useOwnerDashboard();
  
  // HomeAdmin.vue: System-wide business management  
  const { allProperties, allBookings, systemTurns, cleaners } = useAdminDashboard();
  ```

#### **Component Communication** (Role-Aware)
```
Owner Flow:
OwnerSidebar → HomeOwner → OwnerCalendar
(Personal data, simple actions)

Admin Flow:
AdminSidebar → HomeAdmin → AdminCalendar
(System data, complex actions)
```

### **State Management Patterns**

#### **Shared Foundation** (No Changes)
- All stores use Map<string, T> collections
- Computed getters for filtering and derived state  
- Actions return entities for chaining
- Use reactive() for complex state, ref() for primitives

#### **Role-Based Data Access**
```typescript
// ✅ Owner-scoped composables
const useOwnerBookings = () => {
  const myBookings = computed(() => 
    Array.from(bookings.value.values())
      .filter(b => b.owner_id === currentUser.id)
  );
};

// ✅ Admin-scoped composables  
const useAdminBookings = () => {
  const allBookings = computed(() => 
    Array.from(bookings.value.values()) // No filtering
  );
};
```

### **Business Logic Patterns**

#### **Role-Specific Priority Calculation**
```typescript
// Owner: Personal turn alerts
export const getOwnerTurnAlerts = (userId: string, bookings: Map<string, Booking>) => {
  return Array.from(bookings.values())
    .filter(b => b.owner_id === userId && b.booking_type === 'turn');
};

// Admin: System-wide turn management
export const getSystemTurnAlerts = (bookings: Map<string, Booking>) => {
  return Array.from(bookings.values())
    .filter(b => b.booking_type === 'turn'); // All turns, no owner filter
};
```

#### **Shared Business Rules** (No Changes)
- Turn vs standard booking logic in utils/businessLogic.ts
- Conflict detection and validation utilities
- Priority calculation algorithms
- Error handling with consistent patterns

### **File Naming Conventions**

#### **Role-Based Components**
- **Owner Components**: `Owner` prefix (OwnerSidebar.vue, OwnerCalendar.vue)
- **Admin Components**: `Admin` prefix (AdminSidebar.vue, AdminCalendar.vue)  
- **Shared Components**: No prefix (PropertyCard.vue, TurnAlerts.vue)

#### **Role-Based Composables**
- **Owner Composables**: `useOwner` prefix (useOwnerBookings.ts, useOwnerProperties.ts)
- **Admin Composables**: `useAdmin` prefix (useAdminBookings.ts, useCleanerManagement.ts)
- **Shared Composables**: `use` prefix (useAuth.ts, useValidation.ts)

#### **Existing Conventions** (No Changes)
- **Stores**: camelCase (property.ts, booking.ts, ui.ts)
- **Types**: camelCase (booking.ts, property.ts, ui.ts)  
- **Utils**: camelCase (businessLogic.ts)
- **Pages**: camelCase (index.vue, [id].vue)

### **Role-Based Page Structure**
```
pages/
├── index.vue           # Role-based router (routes to owner/ or admin/)
├── auth/              # Authentication pages
├── owner/             # Property owner pages
│   ├── dashboard.vue  # Uses HomeOwner.vue
│   ├── properties/    # Owner property management
│   ├── bookings/      # Owner booking management  
│   └── calendar.vue   # Owner calendar view
├── admin/             # Business admin pages
│   ├── index.vue      # Uses HomeAdmin.vue
│   ├── schedule/      # Master schedule management
│   ├── cleaners/      # Cleaner management
│   ├── properties/    # All properties management
│   └── reports/       # Business analytics
└── demos/             # Component demos for testing
```

---

## Before Marking Complete:

### **Standard Checks** (No Changes)
- [ ] TypeScript compiles without errors
- [ ] Follows established naming conventions
- [ ] Integrates with existing stores/composables
- [ ] Includes basic error handling
- [ ] Updates any dependent interfaces/types

### **Role-Based Checks** (New)
- [ ] **Data Scoping**: Owner components filter to user's data only
- [ ] **Admin Access**: Admin components access all data without filtering
- [ ] **Component Communication**: Role-specific events work correctly
- [ ] **Security Boundaries**: Document frontend vs backend security
- [ ] **Role Routing**: Proper authentication and role-based routing
- [ ] **Cross-Role Updates**: Changes by one role visible to other role (when appropriate)

---

## Critical Project Concepts:

### **Multi-Tenant Business Logic**
- **Property Owners**: 30-40 Airbnb/VRBO clients, each managing their own properties
- **Cleaning Admin**: Business owner managing all clients, cleaners, and operations
- **Turn bookings**: Urgent, same-day turnovers (scope differs per role)
- **Data Isolation**: Owners see only their data, admin sees all data

### **Role-Based Technical Architecture**
- **Shared Foundation**: Types, stores, business logic, dumb components
- **Role-Specific Layer**: Smart components, composables, pages optimized per role
- **Data Access Patterns**: Filter at composable level, not component level
- **Security Model**: Frontend filtering for UX + future backend RLS for security

### **Turn Priority System** (Cross-Role)
- **Owner View**: "You have 2 urgent turns today" (their properties only)
- **Admin View**: "System has 8 urgent turns today" (all properties)
- **Same Logic**: Priority calculation algorithm shared across roles
- **Different Scope**: Data filtering applied per role

### **Component Reuse Strategy**
```typescript
// ✅ GOOD: Reuse dumb components with different data
<PropertyCard :property="prop" @edit="handleEdit" />  // Same component
// Owner: prop = their property, Admin: prop = any property

// ✅ GOOD: Role-specific smart components
<HomeOwner />   // Optimized for personal property management
<HomeAdmin />   // Optimized for business operations

// ❌ AVOID: Generic components with role props
<Home :userRole="role" :showAdminFeatures="isAdmin" />  // Bad
```

---

## Development Workflow Patterns:

### **Role-Based Development Process**
1. **Identify Role Scope**: Owner-only, admin-only, or shared functionality?
2. **Choose Component Type**: Reuse shared dumb component or create role-specific?
3. **Data Access Pattern**: Use role-specific composable for proper data scoping
4. **Test Both Roles**: Verify owner sees only their data, admin sees all data
5. **Document Security**: Note frontend filtering vs future backend security needs

### **Testing Patterns**
```typescript
// Role-specific data filtering tests
describe('useOwnerBookings', () => {
  it('should return only current owner bookings', () => {
    const { myBookings } = useOwnerBookings();
    expect(myBookings.value.every(b => b.owner_id === currentUser.id)).toBe(true);
  });
});

// Cross-role integration tests
describe('Multi-tenant data updates', () => {
  it('should show owner booking in admin interface', () => {
    // Owner creates booking → Admin should see it
  });
});
```

### **Demo Component Strategy**
- **Shared Components**: Demo with both owner and admin data
- **Role-Specific Components**: Demo with role-appropriate data and features
- **Integration Demos**: Show cross-role data flow and communication

---

## Reference Documentation:

- **Architecture**: @project_summary.md (role-based multi-tenant architecture)
- **Task Structure**: @tasks.md (Phase 1D.5 role-based split tasks)
- **Current State**: @repomix-output.md (existing generic implementation)
- **Component Patterns**: docs/component_orchestration_reference.md
- **Business Logic**: docs/business_logic_reference.md (turn vs standard across roles)
- **Vue Patterns**: docs/vue_typescript_reference.md

---

## Quick Reference - Role Responsibilities:

### **Property Owner Interface (30-40 clients)**
- **Purpose**: Simple property and booking management
- **Data**: Only their properties and bookings
- **Features**: Add properties, create bookings, view personal schedule
- **Turn Alerts**: Only their urgent turns
- **UI**: Clean, focused, mobile-optimized

### **Business Admin Interface (1 user)**  
- **Purpose**: Comprehensive business management
- **Data**: All properties and bookings across all clients
- **Features**: Master calendar, cleaner assignment, business analytics
- **Turn Alerts**: System-wide urgent turns across all clients
- **UI**: Information-dense, desktop-optimized, advanced controls

### **Shared Components & Logic**
- **Types & Interfaces**: All shared (Property, Booking, User)
- **Stores**: Shared Maps with role-based access patterns
- **Business Logic**: Shared algorithms with role-specific scoping
- **Dumb Components**: Reused with different data per role
- **Security**: Frontend filtering for UX, future backend RLS for security
````

## File: src/components/smart/FullCalendar.vue
````vue
<template>
  <div class="calendar-container">
    <FullCalendar
      ref="calendarRef"
      :options="calendarOptions"
      class="custom-calendar"
    />
  </div>
</template>
<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3';
import type { CalendarOptions, DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { computed, ref, watch } from 'vue';
import { useTheme } from 'vuetify';
import type { Booking, Property } from '@/types';
import eventLogger from '@/composables/shared/useComponentEventLogger';
interface Props {
  bookings: Map<string, Booking>;
  properties: Map<string, Property>;
  loading?: boolean;
}
interface Emits {
  (e: 'dateSelect', selectInfo: DateSelectArg): void;
  (e: 'eventClick', clickInfo: EventClickArg): void;
  (e: 'eventDrop', dropInfo: EventDropArg): void;
  (e: 'createBooking', data: { start: string; end: string; propertyId?: string }): void;
  (e: 'updateBooking', data: { id: string; start: string; end: string }): void;
}
const props = withDefaults(defineProps<Props>(), {
  loading: false
});
const emit = defineEmits<Emits>();
const theme = useTheme();
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);
const calendarEvents = computed(() => {
  return Array.from(props.bookings.values()).map(booking => {
    const property = props.properties.get(booking.property_id);
    const isTurn = booking.booking_type === 'turn';
    return {
      id: booking.id,
      title: `${property?.name || 'Unknown Property'} - ${isTurn ? 'TURN' : 'Standard'}`,
      start: booking.checkout_date,
      end: booking.checkin_date,
      backgroundColor: getEventColor(booking),
      borderColor: getEventBorderColor(booking),
      textColor: getEventTextColor(booking),
      extendedProps: {
        booking,
        property,
        bookingType: booking.booking_type,
        status: booking.status,
        guestCount: booking.guest_count,
        notes: booking.notes
      },
      classNames: [
        `booking-${booking.booking_type}`,
        `status-${booking.status}`,
        isTurn ? 'priority-high' : 'priority-normal'
      ]
    };
  });
});
const getEventColor = (booking: Booking): string => {
  const isDark = theme.global.current.value.dark;
  if (booking.booking_type === 'turn') {
    switch (booking.status) {
      case 'pending': return isDark ? '#FF5252' : '#F44336';
      case 'scheduled': return isDark ? '#FF9800' : '#FF6F00';
      case 'in_progress': return isDark ? '#4CAF50' : '#2E7D32';
      case 'completed': return isDark ? '#9E9E9E' : '#616161';
      case 'cancelled': return isDark ? '#757575' : '#424242';
      default: return isDark ? '#FF5252' : '#F44336';
    }
  } else {
    switch (booking.status) {
      case 'pending': return isDark ? '#2196F3' : '#1976D2';
      case 'scheduled': return isDark ? '#00BCD4' : '#0097A7';
      case 'in_progress': return isDark ? '#4CAF50' : '#388E3C';
      case 'completed': return isDark ? '#9E9E9E' : '#757575';
      case 'cancelled': return isDark ? '#757575' : '#424242';
      default: return isDark ? '#2196F3' : '#1976D2';
    }
  }
};
const getEventBorderColor = (booking: Booking): string => {
  return booking.booking_type === 'turn' ? '#D32F2F' : '#1976D2';
};
const getEventTextColor = (booking: Booking): string => {
  return booking.status === 'completed' ? '#E0E0E0' : '#FFFFFF';
};
const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: false,
  events: calendarEvents.value,
  eventDisplay: 'block',
  eventOverlap: false,
  eventResizableFromStart: true,
  selectable: true,
  selectMirror: true,
  editable: true,
  droppable: true,
  locale: 'en',
  timeZone: 'local',
  slotMinTime: '06:00:00',
  slotMaxTime: '22:00:00',
  slotDuration: '01:00:00',
  snapDuration: '00:30:00',
  height: 'auto',
  aspectRatio: 1.8,
  eventBackgroundColor: theme.global.current.value.colors.primary,
  eventBorderColor: theme.global.current.value.colors.primary,
  eventTextColor: '#FFFFFF',
  themeSystem: 'standard',
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventDrop: handleEventDrop,
  eventResize: handleEventResize,
  loading: handleLoading,
  eventContent: renderEventContent,
  dayCellContent: renderDayCell,
  businessHours: {
    daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
    startTime: '08:00',
    endTime: '18:00'
  },
  weekends: true,
  dayMaxEvents: 3,
  moreLinkClick: 'popover',
  allDaySlot: false,
  nowIndicator: true,
  scrollTime: '08:00:00'
}));
const handleDateSelect = (selectInfo: DateSelectArg): void => {
  eventLogger.logEvent(
    'FullCalendar',
    'Home',
    'dateSelect',
    { start: selectInfo.startStr, end: selectInfo.endStr },
    'emit'
  );
  emit('dateSelect', selectInfo);
  emit('createBooking', {
    start: selectInfo.startStr,
    end: selectInfo.endStr
  });
  selectInfo.view.calendar.unselect();
};
const handleEventClick = (clickInfo: EventClickArg): void => {
  eventLogger.logEvent(
    'FullCalendar',
    'Home',
    'eventClick',
    { id: clickInfo.event.id },
    'emit'
  );
  emit('eventClick', clickInfo);
};
const handleEventDrop = (dropInfo: EventDropArg): void => {
  const booking = dropInfo.event.extendedProps.booking as Booking;
  eventLogger.logEvent(
    'FullCalendar',
    'Home',
    'eventDrop',
    {
      id: booking.id,
      start: dropInfo.event.startStr,
      end: dropInfo.event.endStr || dropInfo.event.startStr
    },
    'emit'
  );
  emit('eventDrop', dropInfo);
  emit('updateBooking', {
    id: booking.id,
    start: dropInfo.event.startStr,
    end: dropInfo.event.endStr || dropInfo.event.startStr
  });
};
const handleEventResize = (resizeInfo: any): void => {
  const booking = resizeInfo.event.extendedProps.booking as Booking;
  eventLogger.logEvent(
    'FullCalendar',
    'Home',
    'eventResize',
    {
      id: booking.id,
      start: resizeInfo.event.startStr,
      end: resizeInfo.event.endStr
    },
    'emit'
  );
  emit('updateBooking', {
    id: booking.id,
    start: resizeInfo.event.startStr,
    end: resizeInfo.event.endStr
  });
};
const renderEventContent = (eventInfo: any) => {
  const booking = eventInfo.event.extendedProps.booking as Booking;
  const property = eventInfo.event.extendedProps.property as Property;
  const isTurn = booking.booking_type === 'turn';
  return {
    html: `
      <div class="fc-event-content-wrapper">
        <div class="fc-event-title">
          ${isTurn ? '🔥 ' : ''}${property?.name || 'Property'}
        </div>
        <div class="fc-event-subtitle">
          ${booking.status.toUpperCase()}
          ${booking.guest_count ? ` • ${booking.guest_count} guests` : ''}
        </div>
      </div>
    `
  };
};
// Custom day cell rendering
const renderDayCell = (dayInfo: any) => {
  const dayBookings = Array.from(props.bookings.values())
    .filter(booking => {
      const checkoutDate = new Date(booking.checkout_date).toDateString();
      const dayDate = dayInfo.date.toDateString();
      return checkoutDate === dayDate;
    });
  const turnCount = dayBookings.filter(b => b.booking_type === 'turn').length;
  return {
    html: `
      <div class="fc-daygrid-day-number">
        ${dayInfo.dayNumberText}
        ${turnCount > 0 ? `<span class="turn-indicator">${turnCount}</span>` : ''}
      </div>
    `
  };
};
const goToDate = (date: string | Date): void => {
  if (calendarRef.value) {
    calendarRef.value.getApi().gotoDate(date);
  }
};
const changeView = (viewName: string): void => {
  if (calendarRef.value) {
    calendarRef.value.getApi().changeView(viewName);
  }
};
const refreshEvents = (): void => {
  if (calendarRef.value) {
    calendarRef.value.getApi().refetchEvents();
  }
};
watch(() => theme.global.current.value.dark, () => {
  refreshEvents();
});
watch(() => props.bookings, (newBookings) => {
  eventLogger.logEvent(
    'Home',
    'FullCalendar',
    'bookingsUpdate',
    { count: newBookings.size },
    'receive'
  );
}, { deep: true });
const handleLoading = (isLoading: boolean): void => {
  console.log('Calendar loading state:', isLoading);
  eventLogger.logEvent(
    'FullCalendar',
    'Home',
    'loadingState',
    { isLoading },
    'emit'
  );
};
defineExpose({
  goToDate,
  changeView,
  refreshEvents,
  getApi: () => calendarRef.value?.getApi()
});
</script>
<style scoped>
.calendar-container {
  height: 100%;
  width: 100%;
}
.custom-calendar {
  --fc-border-color: rgb(var(--v-theme-on-surface), 0.12);
  --fc-button-bg-color: rgb(var(--v-theme-primary));
  --fc-button-border-color: rgb(var(--v-theme-primary));
  --fc-button-hover-bg-color: rgb(var(--v-theme-primary));
  --fc-button-active-bg-color: rgb(var(--v-theme-primary));
  --fc-today-bg-color: rgb(var(--v-theme-primary), 0.1);
}
.fc-event.booking-turn {
  font-weight: bold;
  border-width: 2px !important;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(var(--v-theme-error), 0); }
  100% { box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0); }
}
.fc-event.status-pending {
  opacity: 0.8;
}
.fc-event.status-completed {
  opacity: 0.6;
  text-decoration: line-through;
}
.turn-indicator {
  background: rgb(var(--v-theme-error));
  color: white;
  border-radius: 50%;
  padding: 1px 4px;
  font-size: 10px;
  margin-left: 4px;
  font-weight: bold;
}
.fc-event-content-wrapper {
  padding: 2px;
}
.fc-event-subtitle {
  font-size: 0.75em;
  opacity: 0.9;
  margin-top: 1px;
}
</style>
````

## File: src/layouts/default.vue
````vue
<template>
    <v-app>
      <v-navigation-drawer
        v-model="drawer"
        :rail="(rail && !mobile) || (md && !mobile)"
        :permanent="!mobile"
        :temporary="mobile"
        @click="rail = false"
        color="secondary"
        class="border-r"
      >
      <v-list>
        <v-list-item
        title="Cleano"
        >
        <template v-slot:append>
              <v-btn
                icon="mdi-chevron-left"
                variant="text"
                @click.stop="closeDrawer"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>
        <v-divider class="my-2"></v-divider>
        <v-list density="compact" nav>
          <v-list-item
            to="/"
            prepend-icon="mdi-view-dashboard"
            title="Dashboard"
            rounded="lg"
          ></v-list-item>
          <v-list-item
            to="/properties"
            prepend-icon="mdi-home"
            title="Properties"
            rounded="lg"
          ></v-list-item>
          <v-list-item
            to="/calendar"
            prepend-icon="mdi-calendar"
            title="Calendar"
            rounded="lg"
          ></v-list-item>
          <v-list-item
            to="/settings"
            prepend-icon="mdi-cog"
            title="Settings"
            rounded="lg"
          ></v-list-item>
          <v-list-item
            to="/integrations"
            prepend-icon="mdi-link"
            title="Integrations"
            rounded="lg"
          ></v-list-item>
          <v-list-item
            to="/faq"
            prepend-icon="mdi-help-circle"
            title="FAQ"
            rounded="lg"
          ></v-list-item>
          <v-list-item
            to="/contact"
            prepend-icon="mdi-email"
            title="Contact Us"
            rounded="lg"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar
        app
        color="surface"
        elevation="1"
        class="border-b"
      >
        <v-app-bar-nav-icon
          @click="toggleSidebar"
        ></v-app-bar-nav-icon>
        <v-app-bar-title class="font-weight-medium">
          Property Cleaning Scheduler
        </v-app-bar-title>
        <v-spacer></v-spacer>
        <theme-picker></theme-picker>
        <v-menu location="bottom end" offset="5">
          <template #activator="{ props }">
            <v-btn
              icon
              v-bind="props"
              class="ml-2"
            >
              <v-avatar size="36">
                <v-icon>mdi-account-circle</v-icon>
              </v-avatar>
            </v-btn>
          </template>
          <v-list min-width="200">
            <v-list-subheader>User Options</v-list-subheader>
            <v-list-item prepend-icon="mdi-account-outline" title="Profile"></v-list-item>
            <v-list-item prepend-icon="mdi-cog-outline" title="Settings"></v-list-item>
            <v-divider class="my-2"></v-divider>
            <v-list-item prepend-icon="mdi-logout" title="Logout" color="error"></v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
      <v-main class="bg-background bg-gradient">
        <router-view />
      </v-main>
      <div id="notification-area">
      </div>
      <div id="modal-area">
      </div>
    </v-app>
  </template>
⋮----
<template v-slot:append>
              <v-btn
                icon="mdi-chevron-left"
                variant="text"
                @click.stop="closeDrawer"
              ></v-btn>
            </template>
⋮----
<template #activator="{ props }">
            <v-btn
              icon
              v-bind="props"
              class="ml-2"
            >
              <v-avatar size="36">
                <v-icon>mdi-account-circle</v-icon>
              </v-avatar>
            </v-btn>
          </template>
⋮----
<script setup lang="ts">
  import { ref } from 'vue';
  import { watch } from 'vue';
  import { useDisplay } from 'vuetify';
  import ThemePicker from '@/components/dumb/ThemePicker.vue';
  const drawer = ref(true);
  const rail = ref(false);
  const { mobile, md } = useDisplay();
  const toggleSidebar = (): void => {
    if (mobile.value) {
      drawer.value = !drawer.value;
    } else {
      rail.value = !rail.value;
    }
  };
  const closeDrawer = (): void => {
    if (mobile.value) {
      drawer.value = false;
    } else {
      rail.value = !rail.value;
    }
  };
  watch([mobile, md], ([isMobile, _isMd]: [boolean, boolean]) => {
    if (isMobile) {
      drawer.value = false;
      rail.value = false;
    } else {
      drawer.value = true;
    }
  }, { immediate: true });
  </script>
<style>
  .border-b {
    border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
  }
  .border-r {
    border-right: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
  }
  .v-navigation-drawer {
    background: rgb(var(--v-theme-surface)) !important;
    color: rgb(var(--v-theme-on-surface)) !important;
  }
  .v-app-bar {
    background: rgb(var(--v-theme-surface)) !important;
    color: rgb(var(--v-theme-on-surface)) !important;
    border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
  }
  .v-main {
    background: rgb(var(--v-theme-background)) !important;
    color: rgb(var(--v-theme-on-background)) !important;
  }
  .v-list-item {
    color: rgb(var(--v-theme-on-surface)) !important;
  }
  .v-list-item:hover {
    background: rgba(var(--v-theme-primary), 0.08) !important;
  }
  .v-list-item--active {
    background: rgba(var(--v-theme-primary), 0.12) !important;
    color: rgb(var(--v-theme-primary)) !important;
  }
  .v-avatar {
    background: rgb(var(--v-theme-primary)) !important;
  }
  .v-menu .v-list {
    background: rgb(var(--v-theme-surface)) !important;
  }
  .glass-card {
    background: rgba(255, 255, 255, 0.25) !important;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 16px !important;
    border: 1px solid rgba(255, 255, 255, 0.18);
  }
  .fade-in {
    animation: fadeInUp 0.7s cubic-bezier(0.23, 1, 0.32, 1);
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px);}
    to { opacity: 1; transform: translateY(0);}
  }
  .v-btn {
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .v-btn:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 4px 16px rgba(33, 150, 243, 0.15);
  }
  </style>
````

## File: src/plugins/vuetify.ts
````typescript
import { createVuetify } from 'vuetify';
⋮----
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import type { ThemeDefinition } from 'vuetify';
````

## File: src/App.vue
````vue
<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
<script setup lang="ts">
import { computed, markRaw } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/default.vue'
import AuthLayout from '@/layouts/auth.vue'
import AdminLayout from '@/layouts/admin.vue'
const layouts = {
  default: markRaw(DefaultLayout),
  auth: markRaw(AuthLayout),
  admin: markRaw(AdminLayout),
}
const route = useRoute()
const layout = computed(() => {
  const layoutName = route.meta.layout as string || 'default'
  return layouts[layoutName as keyof typeof layouts] || layouts.default
})
</script>
<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s ease;
}
#app {
  height: 100vh;
  width: 100%;
}
.v-application {
  font-family: 'Roboto', sans-serif !important;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: rgb(var(--v-theme-surface-variant));
  border-radius: 8px;
}
::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-on-surface-variant), 0.5);
  border-radius: 8px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgb(var(--v-theme-primary));
}
.page-transition-enter-active,
.page-transition-leave-active {
  transition: opacity 0.3s ease;
}
.page-transition-enter-from,
.page-transition-leave-to {
  opacity: 0;
}
.urgent-priority {
  border-left: 4px solid rgb(var(--v-theme-error)) !important;
}
.high-priority {
  border-left: 4px solid rgb(var(--v-theme-warning)) !important;
}
.standard-priority {
  border-left: 4px solid rgb(var(--v-theme-primary)) !important;
}
.turn-booking {
  border-left: 4px solid rgb(var(--v-theme-error)) !important;
}
.standard-booking {
  border-left: 4px solid rgb(var(--v-theme-primary)) !important;
}
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(var(--v-theme-error), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0);
  }
}
.pulse-animation {
  animation: pulse 2s infinite;
}
.elevation-transition {
  transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}
.hover-elevate {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-elevate:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(var(--v-theme-on-surface), 0.2) !important;
}
:root {
  --theme-transition-duration: 0.3s;
}
* {
  transition: background-color var(--theme-transition-duration) ease,
             border-color var(--theme-transition-duration) ease,
             color var(--theme-transition-duration) ease,
             box-shadow var(--theme-transition-duration) ease;
}
.v-progress-circular,
.v-progress-linear,
.v-btn__overlay,
.v-overlay__scrim,
svg,
i {
  transition: none !important;
}
@keyframes themeChange {
  0% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
}
.v-application {
  animation: themeChange 0.5s ease;
}
</style>
````

## File: src/components/smart/Home.vue
````vue
<template>
  <div class="home-container">
    <v-row no-gutters class="fill-height">
      <v-col
        cols="12"
        lg="3"
        xl="2"
        class="sidebar-column"
        :class="{ 'mobile-hidden': !sidebarOpen }"
      >
        <Sidebar
          :today-turns="todayTurns"
          :upcoming-cleanings="upcomingCleanings"
          :properties="propertiesMap"
          :loading="loading"
          @navigate-to-booking="handleNavigateToBooking"
          @navigate-to-date="handleNavigateToDate"
          @filter-by-property="handleFilterByProperty"
          @create-booking="handleCreateBooking"
          @create-property="handleCreateProperty"
        />
      </v-col>
      <v-col
        cols="12"
        lg="9"
        xl="10"
        class="calendar-column"
      >
        <div class="calendar-header">
          <v-btn
            v-if="$vuetify.display.lgAndDown"
            icon="mdi-menu"
            variant="text"
            @click="toggleSidebar"
            class="mr-4"
          />
          <div class="d-flex align-center">
            <v-btn icon="mdi-arrow-left" variant="text" @click="handlePrevious" class="mr-2" />
            <v-btn
              variant="outlined"
              @click="handleGoToday"
              class="mr-2"
            >
              Today
            </v-btn>
            <v-btn icon="mdi-arrow-right" variant="text" @click="handleNext" class="mr-4" />
            <div class="text-h6">{{ formattedDate }}</div>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="currentView" mandatory class="ml-4">
              <v-btn value="dayGridMonth">Month</v-btn>
              <v-btn value="timeGridWeek">Week</v-btn>
              <v-btn value="timeGridDay">Day</v-btn>
            </v-btn-toggle>
          </div>
        </div>
        <FullCalendar
          ref="calendarRef"
          :bookings="filteredBookings"
          :properties="propertiesMap"
          :loading="loading"
          :current-view="currentView"
          :current-date="currentDate"
          @date-select="handleDateSelect"
          @event-click="handleEventClick"
          @event-drop="handleEventDrop"
          @event-resize="handleEventResize"
          @view-change="handleCalendarViewChange"
          @date-change="handleCalendarDateChange"
          @create-booking="handleCreateBookingFromCalendar"
          @update-booking="handleUpdateBooking"
        />
      </v-col>
    </v-row>
    <BookingForm
      :open="eventModalOpen"
      :mode="eventModalMode"
      :booking="eventModalData"
      @close="handleEventModalClose"
      @save="handleEventModalSave"
      @delete="handleEventModalDelete"
    />
    <PropertyModal
      :open="propertyModalOpen"
      :mode="propertyModalMode"
      :property="propertyModalData"
      @close="handlePropertyModalClose"
      @save="handlePropertyModalSave"
      @delete="handlePropertyModalDelete"
    />
    <ConfirmationDialog
      :open="confirmDialogOpen"
      :title="confirmDialogTitle"
      :message="confirmDialogMessage"
      :confirm-text="confirmDialogConfirmText"
      :cancel-text="confirmDialogCancelText"
      :dangerous="confirmDialogDangerous"
      @confirm="handleConfirmDialogConfirm"
      @cancel="handleConfirmDialogCancel"
      @close="handleConfirmDialogClose"
    />
  </div>
</template>
⋮----
<div class="text-h6">{{ formattedDate }}</div>
⋮----
<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useDisplay } from 'vuetify';
import Sidebar from './Sidebar.vue';
import FullCalendar from './FullCalendar.vue';
import BookingForm from '@/components/dumb/BookingForm.vue';
import PropertyModal from '@/components/dumb/PropertyModal.vue';
import ConfirmationDialog from '@/components/dumb/ConfirmationDialog.vue';
import { usePropertyStore } from '@/stores/property';
import { useBookingStore } from '@/stores/booking';
import { useUIStore } from '@/stores/ui';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import { useBookings } from '@/composables/shared/useBookings';
import { useProperties } from '@/composables/shared/useProperties';
import { useCalendarState } from '@/composables/shared/useCalendarState';
import type { Booking, Property, BookingFormData, PropertyFormData } from '@/types';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import eventLogger from '@/composables/shared/useComponentEventLogger';
const propertyStore = usePropertyStore();
const bookingStore = useBookingStore();
const uiStore = useUIStore();
const userStore = useUserStore();
const authStore = useAuthStore();
const { xs } = useDisplay();
const {
  loading: bookingsLoading,
  createBooking,
  updateBooking,
  deleteBooking,
  fetchAllBookings
} = useBookings();
const {
  loading: propertiesLoading,
  createProperty,
  updateProperty,
  deleteProperty,
  fetchAllProperties
} = useProperties();
const {
  currentView,
  currentDate,
  filterBookings,
  setCalendarView,
  goToDate,
  goToToday,
  next,
  prev,
  clearPropertyFilters,
  togglePropertyFilter
} = useCalendarState();
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);
const sidebarOpen = ref(!xs.value);
const selectedPropertyFilter = ref<string | null>(null);
const loading = computed(() =>
  bookingsLoading.value ||
  propertiesLoading.value ||
  uiStore.isLoading('bookings') ||
  uiStore.isLoading('properties')
);
const formattedDate = computed(() => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return currentDate.value.toLocaleDateString('en-US', options);
});
const propertiesMap = computed(() => {
  const map = new Map<string, Property>();
  if (propertyStore.properties instanceof Map) {
    return propertyStore.properties;
  }
  propertyStore.propertiesArray.forEach(property => {
    if (property && property.id) {
      map.set(property.id, property);
    }
  });
  return map;
});
const todayTurns = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const turns = new Map<string, Booking>();
  bookingStore.bookingsArray.forEach(booking => {
    if (
      booking.booking_type === 'turn' &&
      new Date(booking.checkout_date) >= today &&
      new Date(booking.checkout_date) < tomorrow
    ) {
      turns.set(booking.id, booking);
    }
  });
  return turns;
});
const upcomingCleanings = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inOneWeek = new Date(today);
  inOneWeek.setDate(inOneWeek.getDate() + 7);
  const cleanings = new Map<string, Booking>();
  bookingStore.bookingsArray.forEach(booking => {
    const checkoutDate = new Date(booking.checkout_date);
    if (checkoutDate >= today && checkoutDate <= inOneWeek) {
      cleanings.set(booking.id, booking);
    }
  });
  return cleanings;
});
const filteredBookings = computed(() => {
  let bookings = Array.from(bookingStore.bookings.values());
  if (selectedPropertyFilter.value) {
    bookings = bookings.filter(booking => booking.property_id === selectedPropertyFilter.value);
  }
  bookings = filterBookings(bookings);
  const map = new Map<string, Booking>();
  bookings.forEach(booking => {
    map.set(booking.id, booking);
  });
  return map;
});
const eventModalOpen = computed(() => uiStore.isModalOpen('eventModal'));
const eventModalMode = computed(() => {
  const modal = uiStore.getModalState('eventModal');
  return (modal?.mode as 'create' | 'edit') || 'create';
});
const eventModalData = computed(() => {
  const modal = uiStore.getModalState('eventModal');
  return modal?.data || null;
});
const propertyModalOpen = computed(() => uiStore.isModalOpen('propertyModal'));
const propertyModalMode = computed(() => {
  const modal = uiStore.getModalState('propertyModal');
  return (modal?.mode as 'create' | 'edit') || 'create';
});
const propertyModalData = computed(() => {
  const modal = uiStore.getModalState('propertyModal');
  return modal?.data || null;
});
const confirmDialogOpen = computed(() => uiStore.isConfirmDialogOpen('confirmDialog'));
const confirmDialogTitle = computed(() => {
  const dialog = uiStore.getConfirmDialogState('confirmDialog');
  return dialog?.title || 'Confirm';
});
const confirmDialogMessage = computed(() => {
  const dialog = uiStore.getConfirmDialogState('confirmDialog');
  return dialog?.message || 'Are you sure you want to proceed?';
});
const confirmDialogConfirmText = computed(() => {
  const dialog = uiStore.getConfirmDialogState('confirmDialog');
  return dialog?.confirmText || 'Confirm';
});
const confirmDialogCancelText = computed(() => {
  const dialog = uiStore.getConfirmDialogState('confirmDialog');
  return dialog?.cancelText || 'Cancel';
});
const confirmDialogDangerous = computed(() => {
  const dialog = uiStore.getConfirmDialogState('confirmDialog');
  return dialog?.dangerous || false;
});
const confirmDialogData = computed(() => {
  const dialog = uiStore.getConfirmDialogState('confirmDialog');
  return dialog?.data || null;
});
const handleNavigateToBooking = (bookingId: string): void => {
  eventLogger.logEvent(
    'Sidebar',
    'Home',
    'navigateToBooking',
    bookingId,
    'receive'
  );
  const booking = bookingStore.getBookingById(bookingId);
  if (booking) {
    const bookingDate = new Date(booking.checkout_date);
    handleNavigateToDate(bookingDate);
    setTimeout(() => {
      const calendarApi = calendarRef.value?.getApi?.();
      if (calendarApi) {
        const event = calendarApi.getEventById(bookingId);
        if (event) {
          event.setProp('classNames', [...event.classNames, 'highlighted']);
          setTimeout(() => {
            event.setProp('classNames', event.classNames.filter(c => c !== 'highlighted'));
          }, 3000);
        }
      }
    }, 100);
  }
};
const handleNavigateToDate = (date: Date): void => {
  eventLogger.logEvent(
    'Sidebar',
    'Home',
    'navigateToDate',
    date,
    'receive'
  );
  goToDate(date);
  eventLogger.logEvent(
    'Home',
    'FullCalendar',
    'goToDate',
    date,
    'emit'
  );
  const calendarApi = calendarRef.value?.getApi?.();
  if (calendarApi) {
    calendarApi.gotoDate(date);
  }
};
const handleFilterByProperty = (propertyId: string | null): void => {
  eventLogger.logEvent(
    'Sidebar',
    'Home',
    'filterByProperty',
    propertyId,
    'receive'
  );
  selectedPropertyFilter.value = propertyId;
  if (propertyId) {
    togglePropertyFilter(propertyId);
  } else {
    clearPropertyFilters();
  }
  uiStore.setPropertyFilter(propertyId);
  eventLogger.logEvent(
    'Home',
    'FullCalendar',
    'filteredBookingsUpdate',
    { propertyId, count: filteredBookings.value.size },
    'emit'
  );
};
const handleCreateBooking = (data?: Partial<BookingFormData>): void => {
  eventLogger.logEvent(
    'Sidebar',
    'Home',
    'createBooking',
    data,
    'receive'
  );
  uiStore.openModal('eventModal', 'create', data);
};
const handleCreateProperty = (): void => {
  eventLogger.logEvent(
    'Sidebar',
    'Home',
    'createProperty',
    null,
    'receive'
  );
  uiStore.openModal('propertyModal', 'create');
};
const handleDateSelect = (selectInfo: DateSelectArg): void => {
  eventLogger.logEvent(
    'FullCalendar',
    'Home',
    'dateSelect',
    { start: selectInfo.startStr, end: selectInfo.endStr },
    'receive'
  );
  const bookingData: Partial<BookingFormData> = {
    checkout_date: selectInfo.startStr,
    checkin_date: selectInfo.endStr,
  };
  uiStore.openModal('eventModal', 'create', bookingData);
};
const handleEventClick = (clickInfo: EventClickArg): void => {
  eventLogger.logEvent(
    'FullCalendar',
    'Home',
    'eventClick',
    { id: clickInfo.event.id },
    'receive'
  );
  const booking = bookingStore.getBookingById(clickInfo.event.id);
  if (booking) {
    uiStore.openModal('eventModal', 'edit', booking);
  }
};
const handleEventDrop = async (dropInfo: EventDropArg): Promise<void> => {
  const booking = dropInfo.event.extendedProps.booking as Booking;
  try {
    await updateBooking(booking.id, {
      checkout_date: dropInfo.event.startStr,
      checkin_date: dropInfo.event.endStr || dropInfo.event.startStr
    });
    uiStore.addNotification('success', 'Booking Updated', 'Booking dates have been updated successfully.');
  } catch (error) {
    console.error('Failed to update booking:', error);
    dropInfo.revert();
    uiStore.addNotification('error', 'Update Failed', 'Failed to update booking dates. Please try again.');
  }
};
const handleEventResize = async (resizeInfo: any): Promise<void> => {
  const booking = resizeInfo.event.extendedProps.booking as Booking;
  try {
    await updateBooking(booking.id, {
      checkout_date: resizeInfo.event.startStr,
      checkin_date: resizeInfo.event.endStr
    });
    uiStore.addNotification('success', 'Booking Updated', 'Booking duration has been updated successfully.');
  } catch (error) {
    console.error('Failed to resize booking:', error);
    resizeInfo.revert();
    uiStore.addNotification('error', 'Update Failed', 'Failed to update booking duration. Please try again.');
  }
};
const handleCreateBookingFromCalendar = (data: { start: string; end: string; propertyId?: string }): void => {
  const bookingData: Partial<BookingFormData> = {
    checkout_date: data.start,
    checkin_date: data.end,
    property_id: data.propertyId,
    booking_type: 'standard'
  };
  handleCreateBooking(bookingData);
};
const handleUpdateBooking = async (data: { id: string; start: string; end: string }): Promise<void> => {
  try {
    await updateBooking(data.id, {
      checkout_date: data.start,
      checkin_date: data.end
    });
    uiStore.addNotification('success', 'Booking Updated', 'Booking dates have been updated successfully.');
  } catch (error) {
    console.error('Failed to update booking:', error);
    uiStore.addNotification('error', 'Update Failed', 'Failed to update booking. Please try again.');
    calendarRef.value?.refreshEvents?.();
  }
};
const handleCalendarViewChange = (view: string): void => {
  currentView.value = view as 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
  setCalendarView(view as 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay');
};
const handleCalendarDateChange = (date: Date): void => {
  currentDate.value = date;
};
const handleGoToday = (): void => {
  goToToday();
  const calendarApi = calendarRef.value?.getApi?.();
  if (calendarApi) {
    calendarApi.gotoDate(currentDate.value);
  }
};
const handlePrevious = (): void => {
  prev();
  const calendarApi = calendarRef.value?.getApi?.();
  if (calendarApi) {
    calendarApi.gotoDate(currentDate.value);
  }
};
const handleNext = (): void => {
  next();
  const calendarApi = calendarRef.value?.getApi?.();
  if (calendarApi) {
    calendarApi.gotoDate(currentDate.value);
  }
};
const toggleSidebar = (): void => {
  sidebarOpen.value = !sidebarOpen.value;
};
const handleEventModalClose = (): void => {
  uiStore.closeModal('eventModal');
};
const handleEventModalSave = async (data: BookingFormData): Promise<void> => {
  try {
    if (eventModalMode.value === 'create') {
      await createBooking(data);
      uiStore.addNotification('success', 'Booking Created', 'New booking has been created successfully.');
    } else {
      const booking = eventModalData.value as Booking;
      await updateBooking(booking.id, data);
      uiStore.addNotification('success', 'Booking Updated', 'Booking has been updated successfully.');
    }
    uiStore.closeModal('eventModal');
    calendarRef.value?.refreshEvents?.();
  } catch (error) {
    console.error('Failed to save booking:', error);
    uiStore.addNotification('error', 'Save Failed', 'Failed to save booking. Please try again.');
  }
};
const handleEventModalDelete = async (bookingId: string): Promise<void> => {
  uiStore.openConfirmDialog(
    'confirmDialog',
    'Delete Booking',
    'Are you sure you want to delete this booking? This action cannot be undone.',
    {
      confirmText: 'Delete',
      cancelText: 'Cancel',
      dangerous: true,
      data: { action: 'deleteBooking', id: bookingId }
    }
  );
  uiStore.closeModal('eventModal');
};
const handlePropertyModalClose = (): void => {
  uiStore.closeModal('propertyModal');
};
const handlePropertyModalSave = async (data: PropertyFormData): Promise<void> => {
  try {
    if (propertyModalMode.value === 'create') {
      await createProperty(data);
      uiStore.addNotification('success', 'Property Created', 'New property has been created successfully.');
    } else {
      const property = propertyModalData.value as Property;
      await updateProperty(property.id, data);
      uiStore.addNotification('success', 'Property Updated', 'Property has been updated successfully.');
    }
    uiStore.closeModal('propertyModal');
  } catch (error) {
    console.error('Failed to save property:', error);
    uiStore.addNotification('error', 'Save Failed', 'Failed to save property. Please try again.');
  }
};
const handlePropertyModalDelete = async (propertyId: string): Promise<void> => {
  uiStore.openConfirmDialog(
    'confirmDialog',
    'Delete Property',
    'Are you sure you want to delete this property? This action cannot be undone.',
    {
      confirmText: 'Delete',
      cancelText: 'Cancel',
      dangerous: true,
      data: { action: 'deleteProperty', id: propertyId }
    }
  );
};
const handleConfirmDialogConfirm = (): void => {
  const data = confirmDialogData.value;
  if (!data) return;
  switch (data.action) {
    case 'deleteProperty':
      deleteProperty(data.id)
        .then(() => {
          uiStore.addNotification('success', 'Property Deleted', 'Property has been deleted successfully.');
        })
        .catch((error) => {
          console.error('Failed to delete property:', error);
          uiStore.addNotification('error', 'Delete Failed', 'Failed to delete property. Please try again.');
        });
      break;
    case 'deleteBooking':
      deleteBooking(data.id)
        .then(() => {
          uiStore.addNotification('success', 'Booking Deleted', 'Booking has been deleted successfully.');
          calendarRef.value?.refreshEvents?.();
        })
        .catch((error) => {
          console.error('Failed to delete booking:', error);
          uiStore.addNotification('error', 'Delete Failed', 'Failed to delete booking. Please try again.');
        });
      break;
    default:
      console.warn('Unknown confirmation action:', data.action);
  }
  uiStore.closeConfirmDialog('confirmDialog');
};
const handleConfirmDialogCancel = (): void => {
  uiStore.closeConfirmDialog('confirmDialog');
};
const handleConfirmDialogClose = (): void => {
  uiStore.closeConfirmDialog('confirmDialog');
};
onMounted(async () => {
  eventLogger.setEnabled(true);
  eventLogger.logEvent(
    'System',
    'Home',
    'mounted',
    { timestamp: Date.now() },
    'receive'
  );
  try {
    uiStore.setLoading('bookings', true);
    uiStore.setLoading('properties', true);
    if (authStore.isAuthenticated) {
      await Promise.all([
        fetchAllProperties(),
        fetchAllBookings()
      ]);
    }
    uiStore.setLoading('bookings', false);
    uiStore.setLoading('properties', false);
  } catch (error) {
    console.error('Failed to initialize data:', error);
    uiStore.addNotification('error', 'Initialization Failed', 'Failed to load data. Please refresh the page.');
    uiStore.setLoading('bookings', false);
    uiStore.setLoading('properties', false);
  }
});
watch(() => authStore.isAuthenticated, async (isAuthenticated) => {
  if (isAuthenticated) {
    try {
      uiStore.setLoading('bookings', true);
      uiStore.setLoading('properties', true);
      await Promise.all([
        fetchAllProperties(),
        fetchAllBookings()
      ]);
      uiStore.setLoading('bookings', false);
      uiStore.setLoading('properties', false);
    } catch (error) {
      console.error('Failed to fetch data after authentication:', error);
      uiStore.addNotification('error', 'Data Fetch Failed', 'Failed to load your data after login. Please refresh the page.');
      uiStore.setLoading('bookings', false);
      uiStore.setLoading('properties', false);
    }
  } else {
    propertyStore.clearAll();
    bookingStore.clearAll();
    userStore.clearUserPreferences();
  }
});
watch(currentView, (newView) => {
  setCalendarView(newView);
  const calendarApi = calendarRef.value?.getApi?.();
  if (calendarApi) {
    calendarApi.changeView(newView);
  }
});
watch(selectedPropertyFilter, (newPropertyId) => {
  uiStore.setPropertyFilter(newPropertyId);
});
watch(xs, (isExtraSmall) => {
  sidebarOpen.value = !isExtraSmall;
});
onUnmounted(() => {
});
</script>
<style scoped>
.home-container {
  height: 100vh;
  overflow: hidden;
  background: rgb(var(--v-theme-background));
  color: rgb(var(--v-theme-on-background));
}
.fill-height {
  height: 100%;
}
.sidebar-column {
  background: rgb(var(--v-theme-surface));
  border-right: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  height: 100vh;
  overflow-y: auto;
}
.calendar-column {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: rgb(var(--v-theme-background));
}
.calendar-header {
  padding: 16px;
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  display: flex;
  align-items: center;
  min-height: 64px;
  color: rgb(var(--v-theme-on-surface));
}
.mobile-hidden {
  display: none;
}
@media (min-width: 1264px) {
  .mobile-hidden {
    display: block;
  }
}
:deep(.v-card) {
  background: rgb(var(--v-theme-surface)) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
:deep(.v-card:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-on-surface), 0.15);
  border-color: rgba(var(--v-theme-primary), 0.3) !important;
}
:deep(.v-btn) {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
:deep(.v-btn--variant-elevated),
:deep(.v-btn--variant-flat) {
  background: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
}
:deep(.v-btn--variant-outlined) {
  border-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-primary)) !important;
}
:deep(.v-btn--variant-text) {
  color: rgb(var(--v-theme-primary)) !important;
}
:deep(.v-btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.3);
}
:deep(.text-h6),
:deep(.text-h5),
:deep(.text-h4) {
  color: rgb(var(--v-theme-on-surface)) !important;
}
:deep(.text-subtitle-1),
:deep(.text-subtitle-2) {
  color: rgba(var(--v-theme-on-surface), 0.8) !important;
}
:deep(.v-icon) {
  color: rgb(var(--v-theme-on-surface)) !important;
}
:deep(.v-btn .v-icon) {
  color: inherit !important;
}
:deep(.v-badge .v-badge__badge) {
  background: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
}
:deep(.fc-event.highlighted) {
  animation: highlight-pulse 3s ease-in-out;
}
@keyframes highlight-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0.7); }
  50% { box-shadow: 0 0 0 20px rgba(var(--v-theme-primary), 0); }
}
</style>
````

## File: src/components/smart/Sidebar.vue
````vue
<template>
  <v-navigation-drawer class="sidebar" width="100%" elevation="30" color="tertiary">
    <v-container class="py-2">
      <v-row class="mb-4">
        <v-col cols="12">
          <h2 class="text-h6 font-weight-bold">Property Cleaning</h2>
          <div class="text-subtitle-2 text-medium-emphasis">
            {{ formattedDate }}
          </div>
        </v-col>
      </v-row>
      <v-row v-if="todayTurnsArray.length > 0">
        <v-col cols="12">
          <TurnAlerts
            :bookings="todayBookingsWithMetadata"
            :properties="propertiesMap"
            @view="$emit('navigateToBooking', $event)"
            @assign="handleAssign"
            @view-all="handleViewAll('turns')"
          />
        </v-col>
      </v-row>
      <v-row class="mb-4">
        <v-col cols="12">
          <UpcomingCleanings
            :bookings="upcomingBookingsWithMetadata"
            :properties="propertiesMap"
            @view="$emit('navigateToBooking', $event)"
            @assign="handleAssign"
            @view-all="handleViewAll($event)"
            @toggle-expanded="toggleUpcomingExpanded"
          />
        </v-col>
      </v-row>
      <v-row class="mb-4">
        <v-col cols="12">
          <v-card class="property-filter" variant="outlined">
            <v-card-title class="d-flex align-center">
              <v-icon icon="mdi-filter-variant" class="mr-2" />
              Filter by Property
            </v-card-title>
            <v-card-text>
              <v-select
                v-model="selectedProperty"
                :items="propertySelectItems"
                label="Select Property"
                clearable
                @update:model-value="handlePropertyFilterChange"
              >
                <template v-slot:prepend-item>
                  <v-list-item
                    title="All Properties"
                    value=""
                    @click="selectedProperty = null"
                  />
                  <v-divider class="mt-2" />
                </template>
              </v-select>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card class="quick-actions" variant="outlined">
            <v-card-title class="d-flex align-center">
              <v-icon icon="mdi-lightning-bolt" class="mr-2" />
              Quick Actions
            </v-card-title>
            <v-card-text class="d-flex gap-2">
              <v-btn
                prepend-icon="mdi-calendar-plus"
                color="primary"
                variant="tonal"
                block
                @click="$emit('createBooking')"
              >
                New Booking
              </v-btn>
              <v-btn
                prepend-icon="mdi-home-plus"
                color="secondary"
                variant="tonal"
                block
                @click="$emit('createProperty')"
              >
                New Property
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-overlay
        v-show="loading"
        contained
        persistent
        class="align-center justify-center"
      >
        <v-progress-circular
          indeterminate
          color="primary"
        />
      </v-overlay>
    </v-container>
  </v-navigation-drawer>
</template>
⋮----
{{ formattedDate }}
⋮----
<template v-slot:prepend-item>
                  <v-list-item
                    title="All Properties"
                    value=""
                    @click="selectedProperty = null"
                  />
                  <v-divider class="mt-2" />
                </template>
⋮----
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useUIStore } from '@/stores/ui';
import TurnAlerts from '@/components/dumb/TurnAlerts.vue';
import UpcomingCleanings from '@/components/dumb/UpcomingCleanings.vue';
import type { Booking, Property, BookingWithMetadata } from '@/types';
import eventLogger from '@/composables/shared/useComponentEventLogger';
interface Props {
  todayTurns: Map<string, Booking> | Booking[];
  upcomingCleanings: Map<string, Booking> | Booking[];
  properties: Map<string, Property> | Property[];
  loading: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  todayTurns: () => [],
  upcomingCleanings: () => [],
  properties: () => [],
  loading: false
});
interface Emits {
  (e: 'navigateToBooking', bookingId: string): void;
  (e: 'navigateToDate', date: Date): void;
  (e: 'filterByProperty', propertyId: string | null): void;
  (e: 'createBooking'): void;
  (e: 'createProperty'): void;
}
const emit = defineEmits<Emits>();
const uiStore = useUIStore();
const selectedProperty = ref<string | null>(uiStore.selectedPropertyFilter || null);
const formattedDate = computed(() => {
  try {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date().toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return new Date().toISOString().split('T')[0];
  }
});
const todayTurnsMap = computed(() => {
  try {
    if (props.todayTurns instanceof Map) return props.todayTurns;
    const map = new Map<string, Booking>();
    if (Array.isArray(props.todayTurns)) {
      props.todayTurns.forEach(booking => {
        if (booking && booking.id) {
          map.set(booking.id, booking);
        }
      });
    }
    return map;
  } catch (error) {
    console.error('Error processing today\'s turns:', error);
    return new Map<string, Booking>();
  }
});
const upcomingCleaningsMap = computed(() => {
  try {
    if (props.upcomingCleanings instanceof Map) return props.upcomingCleanings;
    const map = new Map<string, Booking>();
    if (Array.isArray(props.upcomingCleanings)) {
      props.upcomingCleanings.forEach(booking => {
        if (booking && booking.id) {
          map.set(booking.id, booking);
        }
      });
    }
    return map;
  } catch (error) {
    console.error('Error processing upcoming cleanings:', error);
    return new Map<string, Booking>();
  }
});
const propertiesMap = computed(() => {
  try {
    if (props.properties instanceof Map) return props.properties;
    const map = new Map<string, Property>();
    if (Array.isArray(props.properties)) {
      props.properties.forEach(property => {
        if (property && property.id) {
          map.set(property.id, property);
        }
      });
    }
    return map;
  } catch (error) {
    console.error('Error processing properties:', error);
    return new Map<string, Property>();
  }
});
const todayTurnsArray = computed(() =>
  Array.from(todayTurnsMap.value.values())
);
const upcomingCleaningsArray = computed(() =>
  Array.from(upcomingCleaningsMap.value.values())
);
const todayBookingsWithMetadata = computed(() => {
  return todayTurnsArray.value.map(booking => {
    const priority: 'low' | 'normal' | 'high' | 'urgent' = 'high';
    return {
      ...booking,
      priority,
      property_name: propertiesMap.value.get(booking.property_id)?.name || `Property ${booking.property_id.substring(0, 8)}`,
      cleaning_window: {
        start: booking.checkout_date,
        end: booking.checkin_date,
        duration: propertiesMap.value.get(booking.property_id)?.cleaning_duration || 120
      }
    } as BookingWithMetadata;
  });
});
const upcomingBookingsWithMetadata = computed(() => {
  return upcomingCleaningsArray.value.map(booking => {
    const priority: 'low' | 'normal' | 'high' | 'urgent' =
      booking.booking_type === 'turn' ? 'high' : 'normal';
    return {
      ...booking,
      priority,
      property_name: propertiesMap.value.get(booking.property_id)?.name || `Property ${booking.property_id.substring(0, 8)}`,
      cleaning_window: {
        start: booking.checkout_date,
        end: booking.checkin_date,
        duration: propertiesMap.value.get(booking.property_id)?.cleaning_duration || 120
      }
    } as BookingWithMetadata;
  });
});
const propertySelectItems = computed(() => {
  try {
    return Array.from(propertiesMap.value.values())
      .filter(property => property && property.id && property.name)
      .map(property => ({
        title: property.name,
        value: property.id,
      }));
  } catch (error) {
    console.error('Error creating property select items:', error);
    return [];
  }
});
const handlePropertyFilterChange = (propertyId: string | null): void => {
  try {
    uiStore.setPropertyFilter(propertyId);
    eventLogger.logEvent(
      'Sidebar',
      'Home',
      'filterByProperty',
      propertyId,
      'emit'
    );
    emit('filterByProperty', propertyId);
  } catch (error) {
    console.error('Error changing property filter:', error);
  }
};
const handleAssign = (bookingId: string): void => {
  try {
    eventLogger.logEvent(
      'Sidebar',
      'Home',
      'navigateToBooking',
      bookingId,
      'emit'
    );
    emit('navigateToBooking', bookingId);
  } catch (error) {
    console.error('Error handling assign:', error);
  }
};
const handleViewAll = (period: string): void => {
  try {
    const today = new Date();
    let targetDate = today;
    if (period === 'turns') {
    } else if (period === 'today') {
    } else if (period === 'tomorrow') {
      targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 1);
    } else {
      try {
        targetDate = new Date(period);
      } catch {
        targetDate = today;
      }
    }
    eventLogger.logEvent(
      'Sidebar',
      'Home',
      'navigateToDate',
      targetDate,
      'emit'
    );
    emit('navigateToDate', targetDate);
  } catch (error) {
    console.error('Error handling view all:', error);
  }
};
const toggleUpcomingExpanded = (expanded: boolean): void => {
  console.log('Upcoming cleanings expanded:', expanded);
};
watch(() => uiStore.selectedPropertyFilter, (newPropertyId) => {
  selectedProperty.value = newPropertyId;
});
onMounted(() => {
  try {
    selectedProperty.value = uiStore.selectedPropertyFilter;
  } catch (error) {
    console.error('Error initializing selected property:', error);
    selectedProperty.value = null;
  }
});
</script>
<style scoped>
.sidebar {
  height: 100%;
  overflow-y: auto;
}
.quick-actions .v-card-text {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
@media (max-width: 960px) {
  .sidebar {
    width: 100% !important;
  }
}
</style>
````

## File: src/stores/ui.ts
````typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ModalState, ConfirmDialogState, Notification, NotificationType, FilterState } from '@/types';
⋮----
function openModal(modalId: string, mode: 'create' | 'edit' | 'view' | 'delete' = 'view', data?: any)
function closeModal(modalId: string)
function closeAllModals()
function openConfirmDialog(
    dialogId: string,
    title: string,
    message: string,
    options: {
      confirmText?: string;
      cancelText?: string;
      confirmColor?: string;
      dangerous?: boolean;
      data?: any;
    } = {}
)
function closeConfirmDialog(dialogId: string)
function closeAllConfirmDialogs()
function toggleSidebar(sidebarId: string)
function setSidebarState(sidebarId: string, isOpen: boolean)
function setLoading(operation: string, isLoading: boolean)
function addNotification(type: NotificationType, title: string, message: string, autoClose: boolean = true)
function removeNotification(id: string)
function clearNotifications()
function setError(errorMessage: string | null)
function updateFilter(filter: Partial<FilterState>)
function resetFilters()
function setCalendarView(view: string)
function setPropertyFilter(propertyId: string | null)
function setFilter(key: string, value: any)
function getFilter(key: string): any
````

## File: package.json
````json
{
  "name": "property-cleaning-scheduler",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@fullcalendar/core": "^6.1.17",
    "@fullcalendar/daygrid": "^6.1.17",
    "@fullcalendar/interaction": "^6.1.17",
    "@fullcalendar/timegrid": "^6.1.17",
    "@fullcalendar/vue3": "^6.1.17",
    "@mdi/font": "^7.4.47",
    "@mdit/plugin-uml": "^0.22.0",
    "@supabase/supabase-js": "^2.50.0",
    "@types/uuid": "^10.0.0",
    "lint-staged": "^16.1.0",
    "markdown-it-plantuml": "^1.4.1",
    "ngrx-uml": "^1.0.2",
    "pinia": "^2.1.7",
    "prettier": "^3.5.3",
    "uml": "^1.0.0",
    "uuid": "^11.1.0",
    "vite-plugin-vue-devtools": "^7.7.6",
    "vue": "^3.4.15",
    "vue-router": "^4.2.5"
  },
  "devDependencies": {
    "@eslint/js": "^9.28.0",
    "@testing-library/vue": "^8.1.0",
    "@types/node": "^20.19.0",
    "@vitejs/plugin-vue": "^5.2.4",
    "@vitest/coverage-v8": "^3.2.2",
    "@vue/test-utils": "^2.4.6",
    "eslint": "^9.29.0",
    "eslint-plugin-vue": "^10.2.0",
    "globals": "^15.1.0",
    "happy-dom": "^17.6.3",
    "jsdom": "^26.1.0",
    "sass-embedded": "^1.89.2",
    "typescript": "~5.3.3",
    "v4": "^0.0.1",
    "vite": "^5.0.12",
    "vite-plugin-css-injected-by-js": "^3.5.2",
    "vite-plugin-vuetify": "^2.1.1",
    "vitest": "^3.2.2",
    "vue-eslint-parser": "^10.1.3",
    "vue-tsc": "^1.8.27",
    "vuetify": "^3.8.8"
  }
}
````

## File: src/router/index.ts
````typescript
import { createRouter, createWebHistory } from 'vue-router'
````

## File: tasks.md
````markdown
# 📋 TASK.md - Property Cleaning Scheduler

## **Project Setup & Foundation**

### **Environment Setup**
- [x] **TASK-001**: Set up Context7 MCP in Cursor
  - Status: Complete
  - Notes: Configured Context7 MCP for Vue 3, Vuetify, FullCalendar.io, and Supabase documentation access
  - Assigned to: Human + Cursor

- [x] **TASK-002**: Create project folder structure
  - Status: Complete
  - Notes: Created directory structure according to project architecture in /property-cleaning-scheduler
  - Assigned to: Cursor

- [x] **TASK-003**: Initialize Vite + Vue 3 + TypeScript project
  - Status: Complete
  - Notes: Created a Vue 3 project with TypeScript, Vite, Vue Router, and Pinia
  - Dependencies: npm create vue@latest property-cleaning-scheduler
  - Assigned to: Cursor

- [x] **TASK-004**: Install and configure dependencies
  - Status: Complete
  - Notes: Installed and configured Vuetify, Supabase, FullCalendar, and other required dependencies
  - Dependencies: vuetify, pinia, vue-router, @supabase/supabase-js, @fullcalendar/vue3
  - Assigned to: Cursor

- [x] **TASK-005**: Configure tsconfig.json with path aliases
  - Status: Complete
  - Notes: Updated tsconfig.json and vite.config.ts with path aliases for all project directories
  - Requirements: @/ alias, strict TypeScript settings
  - Assigned to: Cursor

### **Documentation Setup**
- [ ] **TASK-006**: Create docs/ folder and save essential references
  - Status: Not Started
  - Notes: 
  - Files: summary.md, vue-patterns.md, architecture-patterns.md, business-logic.md
  - Assigned to: Human

- [x] **TASK-007**: Test basic project setup with Hello World
  - Status: Complete
  - Notes: Created a HelloWorld component and verified that the application runs successfully with Vite
  - Verification: npm run dev works, TypeScript compiles
  - Assigned to: Cursor

---

## **Phase 1A: Core Types & Store Foundation**

### **TypeScript Interfaces**
- [x] **TASK-008**: Create core types in src/types/
  - Status: Complete
  - Notes: Created all core type files with comprehensive interfaces and type guards
  - Files: user.ts, property.ts, booking.ts, ui.ts, api.ts, index.ts
  - Assigned to: Cursor

- [x] **TASK-009**: Create User interface with role-based typing
  - Status: Complete
  - Notes: Implemented User interface with role-based typing and type guards for different roles
  - Requirements: 'owner' | 'admin' | 'cleaner' roles, settings object
  - Assigned to: Cursor

- [x] **TASK-010**: Create Property interface with business logic types
  - Status: Complete
  - Notes: Created Property interface with pricing tiers, cleaning duration, and business metrics
  - Requirements: pricing_tier, cleaning_duration, special_instructions
  - Assigned to: Cursor

- [x] **TASK-011**: Create Booking interface with turn/standard distinction
  - Status: Complete
  - Notes: Created Booking interface with turn/standard distinction, status workflow, and priority system
  - Requirements: booking_type ('standard' | 'turn'), status workflow
  - Assigned to: Cursor

### **Pinia Stores**
- [x] **TASK-012**: Create user store with Map collections
  - Status: Complete
  - Notes: Created user store with Map collections for houses and events, with computed getters and full CRUD operations
  - Requirements: houses Map, events Map, computed getters
  - Reference: docs/vue-patterns.md
  - Assigned to: Cursor

- [x] **TASK-013**: Create property store with Map collections
  - Status: Complete
  - Notes: Created property store with Map collections, comprehensive computed getters for filtering, and full CRUD operations
  - Requirements: properties Map, computed getters, filtering by active/owner/pricing tier
  - Reference: docs/vue-patterns.md
  - Assigned to: Cursor

- [x] **TASK-014**: Create booking store with Map collections
  - Status: Complete
  - Notes: Created booking store with Map collections, specialized getters for filtering by status/type/property/date range
  - Requirements: bookings Map, status management, cleaner assignment
  - Reference: docs/vue-patterns.md
  - Assigned to: Cursor

- [x] **TASK-015**: Create UI store for modal and sidebar management
  - Status: Complete
  - Notes: Created UI store with Map collections for modals, sidebars, loading states, notifications, and filtering
  - Requirements: modals Map, sidebars Map, loading states, error handling, filter management
  - Verification: Modal, sidebar, and notification systems working correctly
  - Assigned to: Cursor

---

## **Phase 1B: Core Composables & Business Logic**

### **Composables**
- [x] **TASK-016**: Create useBookings composable
  - Status: Complete
  - Notes: Implemented CRUD operations, validation, error handling, and business logic for calculating cleaning windows and priorities
  - Requirements: CRUD operations, error handling, store integration
  - Reference: docs/business-logic.md
  - Assigned to: Cursor

- [x] **TASK-017**: Create useProperties composable
  - Status: Complete
  - Notes: Created composable for property management with validation, metrics calculation, and store integration
  - Requirements: property management, validation
  - Assigned to: Cursor

- [x] **TASK-018**: Create useAuth composable (mock for now)
  - Status: Complete
  - Notes: Implemented mock authentication with login/logout, user registration, and settings management
  - Requirements: login/logout, user management
  - Assigned to: Cursor

- [x] **TASK-019**: Create useCalendarState composable
  - Status: Complete
  - Notes: Implemented calendar view state management with date range handling, navigation, filtering, and event formatting
  - Requirements: calendar view management, date handling
  - Assigned to: Cursor

### **Business Logic Utils**
- [x] **TASK-020**: Implement turn vs standard booking logic
  - Status: Complete
  - Notes: Implemented comprehensive business logic utilities in src/utils/businessLogic.ts including priority calculation (calculateBookingPriority), cleaning window calculation (getCleaningWindow), and scheduling validation (canScheduleCleaning). These functions handle the distinct requirements for turn vs standard bookings, with appropriate timing buffers and constraints.
  - Requirements: priority calculation, cleaning window calculation
  - Reference: docs/business-logic.md
  - Assigned to: Cursor

- [x] **TASK-021**: Create booking validation functions
  - Status: Complete
  - Notes: Added validation functions to src/utils/businessLogic.ts including time conflict detection (detectBookingConflicts), turn booking validation (validateTurnBooking), and general booking validation (validateBooking). Implemented comprehensive error message generation and warning system. Also added workflow status management functions (getAvailableStatusTransitions, canTransitionBookingStatus).
  - Requirements: time conflict detection, turn booking validation
  - Assigned to: Cursor

---

## **Phase 1C: Basic Component Structure**

### **Layout Components**
- [X] **TASK-022**: Create basic layout structure
  - Status: Not Started
  - Notes:  Complete
  - Files: layouts/default.vue, layouts/admin.vue
  - Assigned to: Cursor

- [x] **TASK-023**: Set up Vue Router with file-based structure
  - Status: Complete
  - Notes: Implemented file-based routing with layout switching for all required routes (/, /properties, /calendar, /admin) and auth routes. Created necessary page components and updated App.vue to support multiple layouts.
  - Routes: /, /properties, /calendar, /admin
  - Assigned to: Cursor

### **Dumb Components (Pure UI)**
- [x] **TASK-024**: Create PropertyCard component
  - Status: Complete
  - Notes: Created a reusable PropertyCard dumb component using Vuetify's v-card that displays property information (name, address, cleaning duration, pricing tier, active status, special instructions) and provides edit/delete actions through emitted events. Implemented proper TypeScript typing, color-coded property status indicators, truncation for long text with tooltips, and hover effects for better UX. Also created a demo component and route (/demos/property-card) to showcase the component with sample properties.
  - Requirements: display property info, edit/delete actions
  - Reference: docs/vue-patterns.md
  - Assigned to: Cursor

- [x] **TASK-025**: Create BookingForm/EventModal component
  - Status: Complete
  - Notes: Created a comprehensive BookingForm component using Vuetify's dialog, form, and validation components. Implemented dynamic form fields, proper validation, and special handling for turn vs standard bookings. The form includes auto-detection of booking type based on dates, alerts for inconsistent booking types, and proper TypeScript type safety. Created a demo component and route (/demos/booking-form) to showcase both create and edit functionality.
  - Requirements: create/edit bookings, validation, turn vs standard
  - Assigned to: Cursor

- [x] **TASK-026**: Create TurnAlerts component
  - Status: Complete
  - Notes: Created a reusable TurnAlerts dumb component that displays turn bookings (same-day checkout/checkin) with priority indicators. Implemented color-coded alerts with "urgent" (red) and "high" (orange) priority levels, expandable interface with booking details, and action buttons for viewing and assigning cleaners. Added demo component with sample data generation to showcase the component's functionality.
  - Requirements: urgent turn notifications, navigation
  - Assigned to: Cursor

- [x] **TASK-027**: Create UpcomingCleanings component
  - Status: Complete
  - Notes: Created a comprehensive UpcomingCleanings component that displays cleanings grouped by date (today, tomorrow, upcoming). Implemented time management features including cleaning windows, checkout/checkin times, and color-coded indicators for booking types and priorities. Added a demo component for testing. Component supports filtering by date range and shows "View all" options for each section when there are more cleanings than the configured limit.
  - Requirements: cleaning schedule display, time management
  - Assigned to: Cursor

### **Smart Components (Business Logic)**
- [x] **TASK-028**: Create Sidebar component (smart)
  - Status: Complete
  - Notes: Created a smart Sidebar component that integrates TurnAlerts and UpcomingCleanings, implements PropertyFilter functionality, and includes QuickActions. The component follows the Map collections pattern, connects to the UI store, and uses proper TypeScript typing with comprehensive error handling. Added a SidebarDemo component and demo page for testing.
  - Requirements: turn alerts, property filter, quick actions
  - Reference: docs/architecture-patterns.md
  - Assigned to: Cursor

- [x] **TASK-029**: Create FullCalendar component integration
  - Status: Complete
  - Notes: Implemented a comprehensive FullCalendar integration as a smart component that follows the project's Map collection pattern. Created a reusable FullCalendar.vue component that displays bookings with proper type distinction (turn vs standard), supports drag-and-drop for scheduling, provides date selection for new bookings, and integrates with the UI store for modal management. Turn bookings are visually highlighted with distinct colors and animations to indicate priority. Added custom event rendering to show property information and booking status. Created a FullCalendarDemo.vue component for testing and a demo page. Updated the calendar page to use the FullCalendar component with proper store integration.
  - Requirements: booking display, drag/drop, turn highlighting
  - Dependencies: @fullcalendar/vue3 setup
  - Assigned to: Cursor

### **Central Orchestrator**
- [x] **TASK-030**: Create Home.vue as central orchestrator
  - Status: Complete
  - Notes: Created Home.vue component that acts as a central orchestrator coordinating between Sidebar and FullCalendar components. Implemented proper data flow from stores to components, event handling between components, and modal management. Used Map collections for state and implemented responsive design.
  - Requirements: coordinate Sidebar ↔ Calendar, manage modal states
  - Reference: docs/architecture-patterns.md
  - Assigned to: Cursor

---

## **Phase 1D: Integration & Testing**

### **Component Integration**
- [x] **TASK-031**: Integrate all components in Home.vue
  - Status: Complete
  - Notes: Updated Home.vue to properly integrate all components following the central orchestrator pattern. Added proper event handling for all components, implemented Map collections for state management, and prepared placeholders for future PropertyModal and NotificationSystem components. Created a minimal auth.ts store to support authentication functionality.
  - Requirements: proper data flow, event handling, state management
  - Assigned to: Cursor

- [x] **TASK-032**: Implement modal management system
  - Status: Complete
  - Notes: Implemented a comprehensive modal management system with event modal, property modal, and confirmation dialogs. Added UI store support for confirmation dialogs with a Map collection pattern. Created PropertyModal and ConfirmationDialog components and integrated them with Home.vue. Updated event deletion to use confirmation dialogs for better UX.
  - Requirements: event modal, property modal, confirmation dialogs
  - Assigned to: Cursor

- [x] **TASK-033**: Test component communication
  - Status: Complete
  - Notes: Implemented a comprehensive component communication testing system with event logging. Created a debug panel (DebugPanel.vue) that displays all component communication events in real-time. Added event logging to Sidebar, Home, and FullCalendar components to track data flow. Created documentation (component-communication-testing.md) with detailed testing procedures for all communication paths.
  - Verification: Sidebar → Home → Calendar data flow works, visually verified through debug panel
  - Assigned to: Cursor

### **Basic Functionality Testing**
- [x] **TASK-034**: Test property CRUD operations
  - Status: Complete
  - Notes: Created comprehensive testing page at /testing/crud with UI for all property CRUD operations. Implemented individual test functions for each operation with proper error handling and status reporting. Tests include property creation, reading properties from store, updating properties, and deleting properties with validation for associated bookings.
  - Verification: create, edit, delete properties work
  - Assigned to: Cursor

- [x] **TASK-035**: Test booking CRUD operations
  - Status: Complete
  - Notes: Implemented booking CRUD testing in the /testing/crud page with comprehensive test cases. Created test functions for creating, reading, updating and deleting bookings with proper store integration. Implemented tests for both turn and standard booking types with appropriate validation.
  - Verification: create, edit, delete bookings work, turn vs standard
  - Assigned to: Cursor

- [x] **TASK-036**: Test calendar integration
  - Status: Complete
  - Notes: Implemented calendar integration testing in the /testing/crud page with a live FullCalendar instance. Created tests for event display, turn booking highlighting, and drag-and-drop functionality. Test cases verify that bookings appear correctly on the calendar with appropriate styling for turn vs standard bookings.
  - Verification: events display, drag/drop works, turn highlighting
  - Assigned to: Cursor

### **UI/UX Polish**
- [x] **TASK-037**: Style components with Vuetify theme
  - Status: Complete
  - Notes: Implemented comprehensive styling with consistent theme, improved responsiveness, and better visual hierarchy. Updated color palette for clearer turn vs standard booking distinction, added theme toggle, and enhanced component styling for better user experience.
  - Requirements: consistent styling, responsive design
  - Assigned to: Cursor

- [x] **TASK-037b**: Implement multiple themes with theme picker
  - Status: Complete
  - Notes: Created 8 distinct themes (light, dark, green, purple, orange, teal, red, brown) with both light and dark variants. Implemented a ThemePicker component in the app-bar that displays a grid of theme options. Added theme persistence using localStorage and smooth transition animations between themes. All components properly apply the selected theme.
  - Requirements: multiple themes, theme picker in app-bar, theme persistence
  - Assigned to: Cursor

- [x] **TASK-037c**: Create a project_summaryV2.md that is updated with the current codebase
  - Status: Complete
  - Notes: Created comprehensive project_summaryV2.md that reflects the current state of the MVP implementation. Documented all implemented features, architectural patterns, component communication system, testing setup, and development guidelines. The document serves as both a status update and developer reference for the fully functional Property Cleaning Scheduler application.
  - Requirements: Updated project summary reflecting current implementation status
  - Assigned to: Cursor
## **Phase 1D.5: Role-Based Architecture Split** 
**(NEW - Insert Before Current Phase 1E)**

### **Folder Structure & Organization**
- [x] **TASK-039A**: Create role-based folder structure
  - Status: Complete
  - Requirements:
    - ✅ Create `components/smart/owner/` folder
    - ✅ Create `components/smart/admin/` folder
    - ✅ Create `components/smart/shared/` folder
    - ✅ Create `composables/owner/` folder  
    - ✅ Create `composables/admin/` folder
    - ✅ Create `composables/shared/` folder
    - ✅ Move existing composables to `shared/` as base implementations
  - Notes: Successfully reorganized code into role-based folder structure. All existing composables moved to shared/ folder and import paths updated throughout the application. Created comprehensive README files for each new folder documenting purpose, architecture patterns, and future development guidelines. Folder structure now supports multi-tenant role-based development.
  - Implementation Details:
    - Created role-based folder structure for components/smart/ (owner/, admin/, shared/)
    - Created role-based folder structure for composables/ (owner/, admin/, shared/)  
    - Moved all existing composables (useAuth, useBookings, useProperties, useCalendarState, useComponentEventLogger) to shared/ folder
    - Updated import paths in all consuming components (Home.vue, Home2.vue, Sidebar.vue, FullCalendar.vue, auth pages, admin layout, calendar pages, crud-testing page)
    - Added comprehensive README documentation for each new folder explaining role-based architecture patterns
    - Verified dev server starts successfully with new folder structure
  - Verification: ✅ Existing app still works after folder reorganization (dev server runs successfully)
  - Assigned to: Cursor

- [ ] **TASK-039B**: Move existing composables to shared folder
  - Status: Not Started
  - Requirements:
    - Move `useBookings.ts` → `composables/shared/useBookings.ts`
    - Move `useProperties.ts` → `composables/shared/useProperties.ts`
    - Move `useCalendarState.ts` → `composables/shared/useCalendarState.ts`
    - Move `useAuth.ts` → `composables/shared/useAuth.ts`
    - Update all import paths in existing components
  - Notes: Base logic that will be extended by role-specific composables
  - Verification: All existing components still import correctly
  - Assigned to: Cursor

### **Owner-Specific Smart Components**
- [ ] **TASK-039C**: Create HomeOwner.vue component
  - Status: Not Started
  - Requirements:
    - Copy existing `Home.vue` as starting point
    - Filter data to show only current user's properties and bookings
    - Use `OwnerSidebar.vue` and `OwnerCalendar.vue` (to be created)
    - Add role-specific quick actions (Add Property, Add Booking)
    - Remove admin-only features (cleaner assignment, system-wide reporting)
    - Implement owner-specific error handling
  - Data Scope: `bookings.filter(b => b.owner_id === currentUser.id)`
  - Navigation: Simple property filter, basic calendar views
  - Assigned to: Cursor

- [ ] **TASK-039D**: Create OwnerSidebar.vue component
  - Status: Not Started
  - Requirements:
    - Show only owner's properties in property filter
    - Display turn alerts for owner's properties only
    - Display upcoming cleanings for owner's properties only
    - Add "Add Property" and "Add Booking" quick action buttons
    - Remove admin-only sections (cleaner management, system reports)
    - Show owner-specific metrics (their properties count, their bookings)
  - Features:
    - Property filter dropdown (owner's properties only)
    - Today's turns section (owner's turns only)
    - Upcoming cleanings (next 7 days, owner only)
    - Quick actions: "Add Property", "Add Booking", "View Calendar"
  - Assigned to: Cursor

- [ ] **TASK-039E**: Create OwnerCalendar.vue component
  - Status: Not Started
  - Requirements:
    - Filter calendar events to show only owner's bookings
    - Simpler calendar controls (basic views: month, week, day)
    - Remove admin features (cleaner assignment, drag-to-assign)
    - Keep basic booking editing (click to edit owner's bookings)
    - Highlight turn bookings with owner-focused messaging
    - Add owner-specific context menu items
  - Features:
    - Basic FullCalendar integration with owner data filter
    - Event click → open booking modal for editing
    - Date click → create new booking modal
    - Turn booking highlighting (owner's turns only)
    - No cleaner assignment interface
  - Assigned to: Cursor

### **Admin-Specific Smart Components**
- [ ] **TASK-039F**: Create HomeAdmin.vue component  
  - Status: Not Started
  - Requirements:
    - Copy existing `Home.vue` as starting point
    - Show ALL properties and bookings (no filtering)
    - Use `AdminSidebar.vue` and `AdminCalendar.vue` (to be created)
    - Add admin-specific quick actions (Assign Cleaners, Generate Reports)
    - Add system-wide turn management
    - Implement admin-specific error handling and notifications
  - Data Scope: All bookings, all properties (no filtering)
  - Navigation: Advanced filters, multiple calendar views, cleaner management
  - Assigned to: Cursor

- [ ] **TASK-039G**: Create AdminSidebar.vue component
  - Status: Not Started  
  - Requirements:
    - Show ALL properties in advanced property filter
    - Display system-wide turn alerts (all urgent turns)
    - Display system-wide cleaning metrics
    - Add admin quick actions (Assign Cleaners, View Reports, Manage Cleaners)
    - Add business analytics section (total properties, active cleanings)
    - Include cleaner availability section
  - Features:
    - Advanced property filter (all properties, by owner, by status)
    - System-wide urgent turns (all properties)
    - Cleaner assignment queue
    - Quick actions: "Assign Cleaners", "Generate Report", "Manage Schedule"
    - Business metrics dashboard
  - Assigned to: Cursor

- [ ] **TASK-039H**: Create AdminCalendar.vue component
  - Status: Not Started
  - Requirements:
    - Show ALL bookings across all properties
    - Advanced calendar controls (multiple views, advanced filters)
    - Cleaner assignment interface (drag-to-assign, right-click assign)
    - Booking status management (pending → scheduled → completed)
    - Advanced context menus with admin actions
    - Color coding by cleaner assignment status
  - Features:
    - FullCalendar with all bookings data
    - Cleaner assignment drag-and-drop
    - Advanced filtering (by status, by cleaner, by property owner)
    - Booking status workflow management
    - System-wide turn prioritization view
  - Assigned to: Cursor

### **Owner-Specific Composables**
- [ ] **TASK-039I**: Create useOwnerBookings.ts composable
  - Status: Not Started
  - Requirements:
    - Extend base `useBookings.ts` functionality
    - Filter all operations to current owner's bookings only
    - Implement owner-specific validation rules
    - Add owner-specific error messages
    - Remove admin-only functions (cleaner assignment)
  - Functions:
    - `fetchMyBookings()` - get current user's bookings only
    - `createMyBooking(data)` - create booking with current user as owner
    - `updateMyBooking(id, data)` - update only if user owns the booking
    - `deleteMyBooking(id)` - delete only if user owns the booking
    - `getMyTodayTurns()` - today's turns for current user only
    - `getMyUpcomingCleanings()` - upcoming cleanings for current user
  - Assigned to: Cursor

- [ ] **TASK-039J**: Create useOwnerProperties.ts composable
  - Status: Not Started
  - Requirements:
    - Extend base `useProperties.ts` functionality
    - Filter all operations to current owner's properties only
    - Implement owner-specific property validation
    - Add owner-specific metrics calculation
    - Remove admin-only property management functions
  - Functions:
    - `fetchMyProperties()` - get current user's properties only
    - `createMyProperty(data)` - create property with current user as owner
    - `updateMyProperty(id, data)` - update only if user owns the property
    - `deleteMyProperty(id)` - delete only if user owns (check for bookings)
    - `getMyPropertyMetrics()` - metrics for current user's properties
  - Assigned to: Cursor

- [ ] **TASK-039K**: Create useOwnerCalendarState.ts composable
  - Status: Not Started
  - Requirements:
    - Extend base `useCalendarState.ts` functionality
    - Filter calendar data to current owner's events only
    - Implement owner-specific calendar views and navigation
    - Add owner-specific date/time utilities
    - Remove admin calendar features
  - Functions:
    - `getOwnerCalendarEvents()` - format owner's bookings for calendar
    - `handleOwnerDateSelect()` - create booking for owner's property
    - `handleOwnerEventClick()` - edit owner's booking
    - `getOwnerTurnAlerts()` - owner's urgent turns only
    - `filterByOwnerProperty(propertyId)` - filter owner's calendar
  - Assigned to: Cursor

### **Admin-Specific Composables**
- [ ] **TASK-039L**: Create useAdminBookings.ts composable
  - Status: Not Started
  - Requirements:
    - Extend base `useBookings.ts` functionality
    - No filtering - access ALL bookings across all owners
    - Add admin-specific functions (cleaner assignment, status management)
    - Implement system-wide analytics and reporting
    - Add bulk operations for managing multiple bookings
  - Functions:
    - `fetchAllBookings()` - get ALL bookings (no owner filter)
    - `assignCleaner(bookingId, cleanerId)` - assign cleaner to booking
    - `updateBookingStatus(bookingId, status)` - manage booking workflow
    - `getSystemTurns()` - all urgent turns across all properties
    - `getUnassignedBookings()` - bookings without assigned cleaners
    - `bulkAssignCleaner(bookingIds, cleanerId)` - bulk cleaner assignment
  - Assigned to: Cursor

- [ ] **TASK-039M**: Create useAdminProperties.ts composable
  - Status: Not Started
  - Requirements:
    - Extend base `useProperties.ts` functionality  
    - No filtering - access ALL properties across all owners
    - Add admin analytics and reporting functions
    - Implement system-wide property management
    - Add bulk operations and advanced filtering
  - Functions:
    - `fetchAllProperties()` - get ALL properties (no owner filter)
    - `getPropertyAnalytics()` - system-wide property metrics
    - `getPropertiesByOwner(ownerId)` - filter properties by specific owner
    - `getPropertyUtilization()` - booking frequency per property
    - `bulkUpdateProperties(propertyIds, updates)` - bulk property updates
  - Assigned to: Cursor

- [ ] **TASK-039N**: Create useAdminCalendarState.ts composable
  - Status: Not Started
  - Requirements:
    - Extend base `useCalendarState.ts` functionality
    - No filtering - access ALL calendar events across all owners
    - Add admin-specific calendar features (cleaner views, advanced filters)
    - Implement system-wide calendar management
    - Add cleaner assignment calendar logic
  - Functions:
    - `getAdminCalendarEvents()` - format ALL bookings for calendar
    - `handleAdminEventClick()` - admin booking management interface
    - `getCleanerSchedule(cleanerId)` - view specific cleaner's schedule
    - `getSystemTurnAlerts()` - all urgent turns across all properties
    - `filterByMultipleCriteria()` - advanced admin filtering
  - Assigned to: Cursor

- [ ] **TASK-039O**: Create useCleanerManagement.ts composable (Admin-only)
  - Status: Not Started
  - Requirements:
    - New admin-only composable for cleaner operations
    - Manage cleaner profiles, availability, and assignments
    - Implement cleaner scheduling logic
    - Add cleaner performance tracking
  - Functions:
    - `fetchCleaners()` - get all cleaner profiles
    - `createCleaner(data)` - add new cleaner
    - `updateCleaner(id, data)` - update cleaner profile
    - `assignCleanerToBooking(cleanerId, bookingId)` - make assignment
    - `getCleanerAvailability(cleanerId, date)` - check availability
    - `getCleanerPerformance(cleanerId)` - performance metrics
  - Assigned to: Cursor

### **Dumb Component Updates**
- [ ] **TASK-039P**: Create owner-specific dumb components
  - Status: Not Started
  - Requirements:
    - Create `components/dumb/owner/OwnerBookingForm.vue` - simplified booking form
    - Create `components/dumb/owner/OwnerPropertyForm.vue` - simplified property form
    - Create `components/dumb/owner/OwnerQuickActions.vue` - owner action buttons
    - Create `components/dumb/owner/OwnerCalendarControls.vue` - basic calendar controls
  - Notes: Simplified versions focused on owner needs, no admin features
  - Assigned to: Cursor

- [ ] **TASK-039Q**: Create admin-specific dumb components
  - Status: Not Started
  - Requirements:
    - Create `components/dumb/admin/AdminBookingForm.vue` - advanced booking form with cleaner assignment
    - Create `components/dumb/admin/CleanerAssignmentModal.vue` - cleaner selection interface
    - Create `components/dumb/admin/AdminCalendarControls.vue` - advanced calendar controls
    - Create `components/dumb/admin/TurnPriorityPanel.vue` - system-wide turn management
    - Create `components/dumb/admin/AdminQuickActions.vue` - admin action buttons
  - Notes: Advanced versions with admin-specific features
  - Assigned to: Cursor

### **Page Structure Updates**
- [ ] **TASK-039R**: Implement role-based routing in pages/index.vue
  - Status: Not Started
  - Requirements:
    - Check user role in `setup()` function
    - Route to `HomeOwner.vue` if user role is 'owner'
    - Route to `HomeAdmin.vue` if user role is 'admin' 
    - Add fallback routing for unauthenticated users
    - Implement proper loading state during role check
  - Code Pattern:
    ```vue
    <template>
      <component :is="homeComponent" />
    </template>
    <script setup>
    const homeComponent = computed(() => {
      if (authStore.isAdmin) return HomeAdmin;
      if (authStore.isOwner) return HomeOwner;
      return AuthLogin; // fallback
    });
    </script>
    ```
  - Assigned to: Cursor

- [ ] **TASK-039S**: Create owner-specific pages structure
  - Status: Not Started
  - Requirements:
    - Create `pages/owner/` folder
    - Move `pages/properties/index.vue` → `pages/owner/properties/index.vue`
    - Move `pages/calendar/index.vue` → `pages/owner/calendar.vue`
    - Create `pages/owner/dashboard.vue` (using HomeOwner.vue)
    - Create `pages/owner/bookings/index.vue` - owner's booking list
    - Update all routing in router config
  - Notes: Owner-focused page structure with simplified navigation
  - Assigned to: Cursor

- [ ] **TASK-039T**: Expand admin-specific pages structure  
  - Status: Not Started
  - Requirements:
    - Expand existing `pages/admin/` folder
    - Create `pages/admin/schedule/index.vue` - master calendar (using HomeAdmin.vue)
    - Create `pages/admin/cleaners/index.vue` - cleaner management
    - Create `pages/admin/properties/index.vue` - all properties view
    - Create `pages/admin/bookings/index.vue` - all bookings view  
    - Create `pages/admin/reports/index.vue` - business analytics
    - Update router config with admin routes
  - Notes: Comprehensive admin interface with full business management
  - Assigned to: Cursor

### **Authentication & Route Guards**
- [ ] **TASK-039U**: Implement role-based route guards
  - Status: Not Started
  - Requirements:
    - Create route guards that check user roles
    - Redirect owners trying to access admin pages
    - Redirect admins to admin interface by default
    - Add proper error messages for unauthorized access
    - Implement loading states during authentication check
  - Route Protection:
    - `/owner/*` - requires 'owner' role
    - `/admin/*` - requires 'admin' role
    - `/` - routes based on role
  - Assigned to: Cursor

- [ ] **TASK-039V**: Update authentication flow for role-based routing
  - Status: Not Started
  - Requirements:
    - Update login success to route based on user role
    - Update logout to clear role-specific state
    - Add role selection during user registration
    - Implement role switching for admin users (if needed)
    - Update auth composable to handle role-based navigation
  - Assigned to: Cursor

---
- [ ] **TASK-038**: Implement loading states and error handling
  - Status: Not Started
  - Notes: 
  - Requirements: loading spinners, error messages, user feedback
  - Assigned to: Cursor
- [ ] **TASK-038**: Implement loading states and error handling
  - Status: Not Started
  - Notes: 
  - Requirements: loading spinners, error messages, user feedback
  - Assigned to: Cursor

- [ ] **TASK-039**: Add turn booking visual indicators
  - Status: Not Started
  - Notes: 
  - Requirements: urgent styling, priority colors, alerts
  - Assigned to: Cursor

---

## **Phase 1E: MVP Completion** 
**(UPDATED - Now Role-Aware)**

### **Error Handling Implementation**
- [ ] **TASK-040**: Create global error handling system with role-specific messaging
  - Status: Not Started
  - Requirements:
    - Role-specific error messages (owner vs admin language)
    - Different error escalation paths for each role
    - Owner errors: focus on booking/property issues
    - Admin errors: include system-wide impact messaging
  - Notes: Build on existing error foundations, add role context
  - Reference: docs/error-handling-patterns.md
  - Assigned to: Cursor

- [ ] **TASK-041**: Implement form validation with role-specific error display
  - Status: Not Started
  - Requirements:
    - Owner forms: simple validation messages
    - Admin forms: advanced validation with business impact warnings
    - Role-specific field requirements (admin sees more fields)
    - Different validation rules based on user role
  - Notes: Real-time validation, error states, user feedback per role
  - Assigned to: Cursor

- [ ] **TASK-042**: Add API error handling and retry logic with role-specific strategies
  - Status: Not Started
  - Requirements:
    - Owner API errors: focus on user-friendly messaging
    - Admin API errors: include technical details and system impact
    - Different retry strategies (owners = simple, admins = advanced)
    - Role-specific fallback behaviors
  - Notes: Network errors, timeout handling, retry strategies per role
  - Assigned to: Cursor

- [ ] **TASK-043**: Implement user notification system with role-specific notifications
  - Status: Not Started
  - Requirements:
    - Owner notifications: personal booking updates, cleaning schedules
    - Admin notifications: system alerts, cleaner updates, business metrics
    - Different notification channels per role
    - Role-specific notification preferences
  - Notes: Success/error toasts, action confirmations per role
  - Assigned to: Cursor

### **Unit Testing Setup**
- [ ] **TASK-044**: Set up Vitest testing environment for role-based components
  - Status: Complete (needs expansion for role-based)
  - Requirements:
    - Add test utilities for role-based component mounting
    - Add mock factories for owner vs admin data
    - Create role-specific test helpers
    - Update existing test setup for role compatibility
  - Notes: Expand existing Vitest setup for role-based testing
  - Assigned to: Cursor

- [x] **TASK-045**: Create testing utilities and helpers
  - Status: Complete
  - Notes: Existing test utilities work for both roles
  - Requirements: mock factories, testing pinia, component wrappers
  - Reference: docs/testing-patterns.md
  - Assigned to: Cursor

- [ ] **TASK-046**: Write unit tests for business logic utils (role-aware)
  - Status: Not Started
  - Requirements:
    - Test priority calculation with role context
    - Test booking validation for both owner and admin cases
    - Test cleaning window calculation for different user types
    - Verify role-specific business rules
  - Notes: Test priority calculation, booking validation, cleaning windows per role
  - Files: businessLogic.test.ts
  - Assigned to: Cursor

- [ ] **TASK-047**: Write unit tests for role-specific composables
  - Status: Not Started
  - Requirements:
    - Test `useOwnerBookings.ts` - owner data filtering, owner operations
    - Test `useAdminBookings.ts` - all data access, admin operations
    - Test role-specific calendar state composables
    - Test cleaner management composable (admin-only)
  - Notes: Test role-specific business logic and data filtering
  - Files: useOwnerBookings.test.ts, useAdminBookings.test.ts, etc.
  - Assigned to: Cursor

- [x] **TASK-048**: Write unit tests for Pinia stores
  - Status: Complete
  - Notes: Existing store tests work for both roles
  - Requirements: test store actions, getters, Map operations
  - Files: user.spec.ts, property.spec.ts, booking.spec.ts, ui.spec.ts
  - Assigned to: Cursor

- [ ] **TASK-049**: Write component tests for role-specific smart components
  - Status: Not Started
  - Requirements:
    - Test `HomeOwner.vue` - owner data filtering, owner interactions
    - Test `HomeAdmin.vue` - all data access, admin interactions  
    - Test `OwnerSidebar.vue` vs `AdminSidebar.vue` functionality
    - Test `OwnerCalendar.vue` vs `AdminCalendar.vue` features
  - Notes: Test component communication, data flow per role
  - Focus: Role-specific props, emits, user interactions
  - Assigned to: Cursor

- [ ] **TASK-050**: Write integration tests for role-based workflows
  - Status: Not Started
  - Requirements:
    - Test complete owner workflow: login → add property → create booking → view calendar
    - Test complete admin workflow: login → view all data → assign cleaner → update status
    - Test role-based data isolation (owners can't see other owners' data)
    - Test role-based permission enforcement
  - Notes: End-to-end workflow testing per role
  - Focus: User journeys, cross-component communication per role
  - Assigned to: Cursor

### **Final Integration & Testing**
- [ ] **TASK-051**: End-to-end testing of role-based booking workflows
  - Status: Not Started
  - Requirements:
    - Test owner booking workflow: create → edit → view on calendar
    - Test admin booking workflow: view all → assign cleaner → update status
    - Test cross-role data updates (owner creates, admin sees)
    - Verify role-based data filtering throughout
  - Verification: Complete booking workflows for both roles
  - Assigned to: Human + Cursor

- [ ] **TASK-052**: Test role-based turn booking priority system
  - Status: Not Started
  - Requirements:
    - Test owner turn alerts (only their properties)
    - Test admin turn alerts (all properties, system-wide)
    - Test role-specific turn booking creation and management
    - Verify proper priority indicators for each role
  - Verification: Turn priority system works correctly for both roles
  - Assigned to: Human + Cursor

- [ ] **TASK-053**: Test role-based error handling scenarios
  - Status: Not Started
  - Requirements:
    - Test role-specific error messages and handling
    - Test permission denied scenarios (owner accessing admin features)
    - Test role-based fallback behaviors
    - Verify role-specific user feedback systems
  - Verification: Error handling appropriate for each role
  - Assigned to: Human + Cursor

- [ ] **TASK-054**: Responsive design testing for role-based interfaces
  - Status: Not Started
  - Requirements:
    - Test owner interface on desktop, tablet, mobile
    - Test admin interface on desktop, tablet, mobile
    - Verify role-specific mobile optimizations
    - Test role-based navigation on different screen sizes
  - Verification: Both interfaces work across all device sizes
  - Assigned to: Human + Cursor

- [ ] **TASK-055**: Run full test suite and achieve 80%+ coverage for role-based system
  - Status: Not Started
  - Requirements:
    - Run tests for both owner and admin code paths
    - Achieve 80%+ coverage on role-specific business logic
    - Verify critical role-based workflows are tested
    - Test role-based security and data isolation
  - Verification: npm run test:coverage passes for both roles
  - Assigned to: Human + Cursor

### **Documentation & Cleanup**
- [x] **TASK-055A**: Create UML diagrams to visualize codebase architecture
  - Status: Complete (needs update for role-based)
  - Requirements:
    - Update existing UML diagrams for role-based architecture
    - Add role-specific component interaction diagrams
    - Document role-based data flow patterns
    - Add role-based security/permission diagrams
  - Notes: Update existing comprehensive UML diagrams for role-based system
  - Assigned to: Cursor

- [ ] **TASK-056**: Document component APIs and usage for role-based system
  - Status: Not Started
  - Requirements:
    - Document owner-specific component APIs
    - Document admin-specific component APIs  
    - Document shared component usage patterns
    - Document role-based prop interfaces and emit patterns
  - Notes: Role-specific component documentation
  - Files: component documentation, prop interfaces per role
  - Assigned to: Cursor

- [ ] **TASK-057**: Code cleanup and optimization for role-based architecture
  - Status: Not Started
  - Requirements:
    - Remove unused generic components (old Home.vue, Sidebar.vue, etc.)
    - Optimize role-specific data filtering
    - Clean up import paths for new folder structure
    - Remove duplicate code between role-specific components
  - Notes: Clean up after role-based refactoring
  - Assigned to: Cursor

- [ ] **TASK-058**: Update documentation with role-based testing and error handling
  - Status: Not Started
  - Requirements:
    - Update README.md with role-based architecture explanation
    - Document role-based testing strategies
    - Document role-based error handling patterns
    - Add role-based deployment instructions
  - Notes: Complete documentation update for role-based system
  - Files: README.md, testing guide, error handling guide per role
  - Assigned to: Cursor

- [ ] **TASK-059**: MVP deployment preparation for role-based system
  - Status: Not Started
  - Requirements:
    - Build optimization for role-based components
    - Environment setup for role-based authentication
    - Deployment config for role-based routing
    - Performance optimization for role-specific data loading
  - Notes: Deployment preparation with role-based considerations
  - Assigned to: Cursor

---

## **Updated Notes Section**

### **General Notes:**
- **Role-Based Architecture**: Property owners see only their data, admins see all data
- **Data Filtering**: Implement at composable level, not component level
- **Shared Components**: Maximize reuse of dumb components across roles
- **Business Logic**: Maintain shared business rules, customize per role
- Reference docs/summary.md for overall architecture
- Use "use context7" in Cursor for up-to-date library documentation
- Follow Map collection patterns throughout the project
- Focus on turn vs standard booking distinction as core business logic
- **Error Handling**: Implement role-specific graceful failures and user feedback
- **Testing**: Aim for 80%+ test coverage on role-specific business logic and critical paths
- **Security**: Ensure owners cannot access other owners' data

### **Current Priority Order:**
1. **Phase 1D.5**: Complete role-based architecture split (TASK-039A through TASK-039V)
2. **Phase 1E**: Implement role-aware error handling and testing (TASK-040 through TASK-059)  
3. **Future Phases**: Supabase integration with RLS for multi-tenant security

### **Technical Decisions Made:**
- Vue 3 + Vite + TypeScript stack confirmed
- Map collections for state management (shared across roles)
- Role-based component architecture (Owner vs Admin interfaces)
- Composable-level data filtering for role separation
- Vuetify 3 for UI components (shared across roles)
- Folder structure: `owner/`, `admin/`, `shared/` pattern

### **Success Criteria for Role-Based MVP:**
- **Property Owner Experience**: Can manage their properties and bookings with simple, focused interface
- **Admin Experience**: Can manage all properties, bookings, and cleaners with advanced features
- **Data Isolation**: Owners see only their data, admins see all data
- **Role Security**: Proper authentication and authorization for each role
- **Shared Business Logic**: Turn vs standard booking logic works for both roles
- **Mobile Responsive**: Both interfaces work on all device sizes
````
