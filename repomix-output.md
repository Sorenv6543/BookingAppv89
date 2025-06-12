This file is a merged representation of a subset of the codebase, containing files not matching ignore patterns, combined into a single document by Repomix.
The content has been processed where empty lines have been removed, content has been formatted for parsing in markdown style, content has been compressed (code blocks are separated by ⋮---- delimiter).

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
- Files matching these patterns are excluded: /docs, /node_modules, /src/__tests__, README.md, .git, docs/, docs/**
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Empty lines have been removed from all files
- Content has been formatted for parsing in markdown style
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
src/__tests__/types/
src/pages/bookings/
src/pages/settings/
.cursor/rules/criticalprojectconcepts.mdc
.eslintrc.json
.gitignore
.repomix/bundles.json
eslint.config.js
index.html
package.json
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
src/components/dumb/HelloWorld.vue
src/composables/useAuth.ts
src/composables/useBookings.ts
src/composables/useCalendarState.ts
src/composables/useProperties.ts
src/layouts/admin.vue
src/layouts/auth.vue
src/layouts/default.vue
src/main.ts
src/pages/404.vue
src/pages/admin/index.vue
src/pages/auth/login.vue
src/pages/auth/register.vue
src/pages/calendar/index.vue
src/pages/index.vue
src/pages/properties/index.vue
src/plugins/supabase.ts
src/plugins/vuetify.ts
src/router/index.ts
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

## File: .cursor/rules/criticalprojectconcepts.mdc
```
---
description: 
globs: 
alwaysApply: true
---
## I'm building a property cleaning scheduler app.

> Read @project_summary.md and @tasks.md to understand project architecture and current task structure.
> Check @repomix-output.md for current project state and existing implementations.

## For each task:
1. **Context First**: Use Context7 tool to research relevant documentation from @context7_techstack_ids.md before starting
2. **Plan**: Use sequential thinking to break down the task and plan implementation
3. **Implement**: Build the feature following established patterns from @project_summary.md
4. **Integrate**: Ensure implementation fits the broader project architecture and Map collection patterns
5. **Update**: Change task status from "Not Started" to "Complete" in TASK.md
6. **Document**: Add detailed notes about implementation decisions and any challenges
7. **Verify**: Check off task with [x] and ensure it enables future dependent tasks
## Key Patterns to Follow:
- Use Map collections for all state management
- Follow the Home.vue central orchestrator pattern
- Maintain turn vs standard booking distinction in all business logic
- Reference existing composables and stores for consistency
- Implement proper TypeScript typing and error handling

## Before Marking Complete:
- [ ] TypeScript compiles without errors
- [ ] Follows established naming conventions
- [ ] Integrates with existing stores/composables
- [ ] Includes basic error handling
- [ ] Updates any dependent interfaces/types

## Critical Project Concepts:
- Turn bookings = urgent, same-day turnovers between guests
- Standard bookings = regular recurring cleanings
- Priority calculation based on checkout → checkin time window
- All state uses Map collections, not arrays

- UI Store manages modals, sidebars, loading states
```

## File: .eslintrc.json
```json
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
```

## File: .repomix/bundles.json
```json
{
  "bundles": {}
}
```

## File: index.html
```html
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
```

## File: src/__tests__/components/HelloWorld.spec.ts
```typescript
import { describe, it, expect } from 'vitest'
import { mountWithContext } from '../utils/test-utils'
import HelloWorld from '@/components/dumb/HelloWorld.vue'
```

## File: src/__tests__/components/SimpleTest.spec.ts
```typescript
import { describe, it, expect } from 'vitest'
```

## File: src/__tests__/setup/cssStub.js
```javascript
// Mock CSS imports in tests
```

## File: src/__tests__/setup/setupTests.ts
```typescript
import { beforeAll, afterAll, vi } from 'vitest'
// Mock CSS imports
⋮----
// Global setup
⋮----
// Mock window properties that aren't available in happy-dom
⋮----
// Mock matchMedia
⋮----
// Cleanup if needed
```

## File: src/__tests__/stores/booking.spec.ts
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useBookingStore } from '@/stores/booking';
import type { Booking } from '@/types';
⋮----
// Create a fresh pinia instance and set it as active for testing
```

## File: src/__tests__/stores/property.spec.ts
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { usePropertyStore } from '@/stores/property';
import type { Property } from '@/types';
⋮----
// Create a fresh pinia instance and set it as active for testing
```

## File: src/__tests__/stores/ui.spec.ts
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUIStore } from '@/stores/ui';
⋮----
// Create a fresh pinia instance and set it as active for testing
⋮----
// Mock crypto.randomUUID
⋮----
// Mock setTimeout
⋮----
// Default sidebars state
⋮----
// Default loading state
⋮----
// Default filter state
⋮----
// Default calendar view
⋮----
// Empty notifications
⋮----
// No error
⋮----
// Initially no modals
⋮----
// Open modal
⋮----
// Get modal state
⋮----
// Close modal
⋮----
// Open multiple modals and close all
⋮----
// Initial states
⋮----
// Toggle sidebar
⋮----
// Set specific state
⋮----
// Initial states
⋮----
// Set loading state
⋮----
// Multiple loading states
⋮----
// Reset all loading states
⋮----
// Add notification
⋮----
// Remove notification
⋮----
// Add multiple notifications
⋮----
// Clear all notifications
⋮----
// Add auto-close notification
⋮----
// Advance timers to trigger auto-close
⋮----
// Set error
⋮----
// Clear error
⋮----
// Initial filter state
⋮----
// Update filter
⋮----
// Update only part of the filter
⋮----
// Reset filters
⋮----
// Default view
⋮----
// Change view
⋮----
// Add more than 5 notifications
```

## File: src/__tests__/stores/user.spec.ts
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from '@/stores/user';
⋮----
// Create a fresh pinia instance and set it as active for testing
⋮----
// Add some data
⋮----
// Verify data was added
⋮----
// Clear all data
⋮----
// Verify data was cleared
```

## File: src/assets/main.css
```css
/* Main CSS file */
:root {
html, body {
* {
```

## File: src/components/dumb/HelloWorld.vue
```vue
<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>
<template>
  <div class="hello-world">
    <h1>{{ msg }}</h1>
    <p>If you can see this, your Vue 3 + TypeScript + Vite + Vuetify setup is working!</p>
    <v-btn color="primary" class="mt-4">Test Button</v-btn>
  </div>
</template>
⋮----
<h1>{{ msg }}</h1>
⋮----
<style scoped>
.hello-world {
  padding: 2rem;
  text-align: center;
}
</style>
```

## File: src/composables/useCalendarState.ts
```typescript
import { ref, computed } from 'vue';
import { useUIStore } from '@/stores/ui';
import { useBookingStore } from '@/stores/booking';
import type { Booking } from '@/types';
/**
 * Composable for calendar view state management
 * Controls calendar display options, date ranges, and filtering
 */
export function useCalendarState()
⋮----
// Calendar view state
⋮----
// Booking display filters
⋮----
// Selected property filter (empty means show all)
⋮----
/**
   * Change calendar view
   */
function setCalendarView(view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay')
⋮----
// Update UI store
⋮----
/**
   * Navigate to specific date
   */
function goToDate(date: Date)
/**
   * Navigate to today
   */
function goToToday()
/**
   * Navigate to next period (day/week/month)
   */
function next()
/**
   * Navigate to previous period (day/week/month)
   */
function prev()
/**
   * Update date range based on current view and date
   */
function updateDateRange()
⋮----
// Start from first day of month
⋮----
// End on last day of month
⋮----
// Start from beginning of week (Sunday)
⋮----
// End at end of week (Saturday)
⋮----
// Day view - just use the current date
⋮----
// Set time to beginning/end of day
⋮----
// Update UI store
⋮----
/**
   * Toggle booking status filter
   */
function toggleStatusFilter(status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled')
⋮----
// Update UI store
⋮----
/**
   * Toggle booking type filter
   */
function toggleTypeFilter(type: 'turn' | 'standard')
/**
   * Toggle property filter
   */
function togglePropertyFilter(propertyId: string)
⋮----
// Update UI store
⋮----
/**
   * Clear all property filters
   */
function clearPropertyFilters()
/**
   * Filter bookings based on current filters
   */
function filterBookings(bookings: Booking[]): Booking[]
⋮----
// Filter by status
⋮----
// Filter by type
⋮----
// Filter by property
⋮----
// Check if booking is within current date range
⋮----
/**
   * Get formatted date range for display
   */
function getFormattedDateRange(): string
⋮----
// Same day
⋮----
// Same month and year
⋮----
// Same year
⋮----
// Different years
⋮----
/**
   * Convert bookings to FullCalendar event format
   */
function bookingsToEvents(bookings: Booking[])
⋮----
// Get booking status for color coding
⋮----
pending: '#FFA726',     // Orange
scheduled: '#42A5F5',   // Blue
in_progress: '#AB47BC', // Purple
completed: '#66BB6A',   // Green
cancelled: '#E53935'    // Red
⋮----
// Get booking type for display
⋮----
// Initialize date range on creation
⋮----
// State
⋮----
// Calendar navigation
⋮----
// Filtering
⋮----
// Formatting and conversion
⋮----
// Computed properties
```

## File: src/composables/useProperties.ts
```typescript
import { ref, computed } from 'vue';
import { usePropertyStore } from '@/stores/property';
import { useBookingStore } from '@/stores/booking';
import type { Property, PropertyFormData, PricingTier } from '@/types';
import { v4 as uuidv4 } from 'uuid';
/**
 * Composable for property management
 * Provides CRUD operations and validation for properties
 */
export function useProperties()
⋮----
/**
   * Create a new property
   */
async function createProperty(formData: PropertyFormData): Promise<string | null>
⋮----
// Validate required fields
⋮----
// Validate cleaning duration
⋮----
// Validate pricing tier
⋮----
// Create property object
⋮----
// Add to store
⋮----
// Simulate API call
⋮----
/**
   * Update an existing property
   */
async function updateProperty(id: string, updates: Partial<PropertyFormData>): Promise<boolean>
⋮----
// Check if property exists
⋮----
// Validate cleaning duration if changed
⋮----
// Validate pricing tier if changed
⋮----
// Update property in store
⋮----
// Simulate API call
⋮----
/**
   * Delete a property
   */
async function deleteProperty(id: string): Promise<boolean>
⋮----
// Check if property exists
⋮----
// Check if property has bookings
⋮----
// Remove from store
⋮----
// Simulate API call
⋮----
/**
   * Toggle property active status
   */
async function togglePropertyStatus(id: string, active: boolean): Promise<boolean>
⋮----
// Check if property exists
⋮----
// If deactivating, check for upcoming bookings
⋮----
// Update property status
⋮----
// Simulate API call
⋮----
/**
   * Calculate property metrics
   */
function calculatePropertyMetrics(id: string)
⋮----
// Get all bookings for this property
⋮----
// Calculate utilization rate (booked days / total days)
const totalDays = 30; // Assuming last 30 days
⋮----
// Count days between checkout and checkin
⋮----
// Calculate turn percentage
⋮----
// Calculate average gap between bookings
⋮----
// Sort bookings by checkout date
⋮----
// Calculate gaps between consecutive bookings
⋮----
// Calculate revenue projection based on pricing tier
⋮----
const baseRevenue = 100; // Base revenue per booking
const projectedBookings = Math.round(utilizationRate * 30); // Projected bookings for next month
⋮----
// Determine cleaning load
⋮----
/**
   * Fetch all properties
   */
async function fetchAllProperties(): Promise<boolean>
⋮----
// State
⋮----
// Store access
⋮----
// CRUD operations
⋮----
// Business logic
```

## File: src/layouts/admin.vue
```vue
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
import { useAuth } from '@/composables/useAuth'
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
```

## File: src/layouts/auth.vue
```vue
<!-- layouts/auth.vue -->
<template>
    <v-app>
      <!-- Simple app bar for auth pages -->
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
        <!-- Optional help or contact link -->
        <v-btn
          variant="text"
          color="white"
          href="mailto:support@example.com"
        >
          <v-icon start>mdi-help-circle</v-icon>
          Help
        </v-btn>
      </v-app-bar>
      <!-- Main content area for auth forms -->
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
              <!-- Auth forms will be rendered here -->
              <router-view />
            </v-col>
          </v-row>
        </v-container>
      </v-main>
      <!-- Footer with basic info -->
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
<!-- Simple app bar for auth pages -->
⋮----
<!-- Optional help or contact link -->
⋮----
<!-- Main content area for auth forms -->
⋮----
<!-- Auth forms will be rendered here -->
⋮----
<!-- Footer with basic info -->
⋮----
© {{ currentYear }} Property Cleaning Scheduler
⋮----
<script setup lang="ts">
  import { computed } from 'vue';
  // Get current year for footer
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
  /* Center the auth content */
  .v-container {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 0;
  }
  /* Auth card styling (will be applied to child components) */
  :deep(.v-card) {
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  /* Footer styling */
  .v-footer {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  </style>
```

## File: src/layouts/default.vue
```vue
<!-- layouts/default.vue -->
<template>
    <v-app>
      <!-- Navigation Drawer -->
      <v-navigation-drawer
        v-model="sidebarVisible"
        app
        clipped
        :temporary="$vuetify.display.mobile"
        :permanent="!$vuetify.display.mobile"
        width="350"
        color="surface"
      >
        <!-- Sidebar content will be handled by smart components -->
        <div class="pa-4">
          <h3 class="text-h6 mb-4">Property Scheduler</h3>
          <!-- This is where Sidebar.vue will be mounted when we get to TASK-028 -->
          <div class="sidebar-placeholder">
            <v-list>
              <v-list-item>
                <v-list-item-title>Dashboard</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Properties</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Calendar</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </div>
      </v-navigation-drawer>
      <!-- App Bar -->
      <v-app-bar
        app
        clipped-left
        color="primary"
        dark
        elevation="1"
      >
        <v-app-bar-nav-icon
          @click="toggleSidebar"
        />
        <v-toolbar-title>
          Property Cleaning Scheduler
        </v-toolbar-title>
        <v-spacer />
        <!-- User Menu (placeholder for now) -->
        <v-menu offset-y>
          <template #activator="{ props }">
            <v-btn 
              icon
              v-bind="props"
            >
              <v-avatar size="32">
                <v-icon>mdi-account-circle</v-icon>
              </v-avatar>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item>
            <v-divider />
            <v-list-item>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
      <!-- Main Content Area -->
      <v-main>
        <router-view />
      </v-main>
      <!-- Global Notification Area (for future use) -->
      <div id="notification-area">
        <!-- Global notifications will be mounted here -->
      </div>
      <!-- Global Modal Area (for future use) -->
      <div id="modal-area">
        <!-- Global modals will be mounted here -->
      </div>
    </v-app>
  </template>
⋮----
<!-- Navigation Drawer -->
⋮----
<!-- Sidebar content will be handled by smart components -->
⋮----
<!-- This is where Sidebar.vue will be mounted when we get to TASK-028 -->
⋮----
<!-- App Bar -->
⋮----
<!-- User Menu (placeholder for now) -->
⋮----
<template #activator="{ props }">
            <v-btn 
              icon
              v-bind="props"
            >
              <v-avatar size="32">
                <v-icon>mdi-account-circle</v-icon>
              </v-avatar>
            </v-btn>
          </template>
⋮----
<!-- Main Content Area -->
⋮----
<!-- Global Notification Area (for future use) -->
⋮----
<!-- Global notifications will be mounted here -->
⋮----
<!-- Global Modal Area (for future use) -->
⋮----
<!-- Global modals will be mounted here -->
⋮----
<script setup lang="ts">
  import { computed, watch } from 'vue';
  import { useDisplay } from 'vuetify';
  import { useUIStore } from '@/stores/ui';
  // Store connections
  const uiStore = useUIStore();
  const { mobile } = useDisplay();
  // Sidebar state from UI store
  const sidebarVisible = computed({
    get: () => uiStore.isSidebarOpen('main'),
    set: (value: boolean) => uiStore.sidebars.set('main', value)
  });
  // Methods
  const toggleSidebar = (): void => {
    uiStore.toggleSidebar('main');
  };
  // Auto-hide sidebar on mobile
  watch(mobile, (isMobile: boolean) => {
    if (isMobile) {
      uiStore.sidebars.set('main', false);
    }
  });
  </script>
<style scoped>
  .sidebar-placeholder {
    /* Temporary styling for layout preview */
    opacity: 0.7;
  }
  /* Main content styling */
  .v-main {
    background-color: rgb(var(--v-theme-background));
  }
  /* App bar styling */
  .v-app-bar {
    border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  }
  /* Navigation drawer styling */
  .v-navigation-drawer {
    border-right: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  }
  </style>
```

## File: src/pages/404.vue
```vue
<template>
  <div class="not-found-page">
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <router-link to="/">Return to Home</router-link>
  </div>
</template>
<script setup lang="ts">
// 404 page component
</script>
<style scoped>
.not-found-page {
  padding: 2rem;
  text-align: center;
}
</style>
```

## File: src/pages/admin/index.vue
```vue
<template>
  <div class="admin-page">
    <h1>Admin Dashboard</h1>
    <p>Admin controls and settings will be implemented here.</p>
  </div>
</template>
<script setup lang="ts">
// Admin page component
</script>
<style scoped>
.admin-page {
  padding: 1rem;
}
</style>
```

## File: src/pages/auth/login.vue
```vue
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
import { useAuth } from '@/composables/useAuth'
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
```

## File: src/pages/auth/register.vue
```vue
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
import { useAuth } from '@/composables/useAuth'
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
```

## File: src/pages/calendar/index.vue
```vue
<template>
  <div class="calendar-page">
    <h1>Calendar</h1>
    <p>Booking calendar will be implemented here.</p>
  </div>
</template>
<script setup lang="ts">
// Calendar page component
</script>
<style scoped>
.calendar-page {
  padding: 1rem;
}
</style>
```

## File: src/pages/index.vue
```vue
<script setup lang="ts">
import HelloWorld from '@/components/dumb/HelloWorld.vue'
</script>
<template>
  <v-app>
    <v-main>
      <v-container>
        <HelloWorld msg="Property Cleaning Scheduler" />
      </v-container>
    </v-main>
  </v-app>
</template>
<style scoped>
</style>
```

## File: src/pages/properties/index.vue
```vue
<template>
  <div class="properties-page">
    <h1>Properties</h1>
    <p>Properties management page will be implemented here.</p>
  </div>
</template>
<script setup lang="ts">
// Properties page component
</script>
<style scoped>
.properties-page {
  padding: 1rem;
}
</style>
```

## File: src/plugins/supabase.ts
```typescript
import { createClient } from '@supabase/supabase-js'
// URL and anon key will be replaced with actual values during deployment
```

## File: src/types/api.ts
```typescript
/**
 * API Type Definitions
 * Types for API interactions and responses
 */
/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
  message?: string;
}
/**
 * Pagination parameters for API requests
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}
/**
 * Paginated response from API
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
/**
 * Supabase table names
 */
export type TableName = 'users' | 'properties' | 'bookings' | 'cleaners';
/**
 * Error response from Supabase
 */
export interface SupabaseErrorResponse {
  code: string;
  details: string;
  hint: string;
  message: string;
}
/**
 * Authentication response
 */
export interface AuthResponse {
  user: {
    id: string;
    email: string;
  } | null;
  session: any | null;
  error: string | null;
}
```

## File: src/types/booking.ts
```typescript
/**
 * Booking Type Definitions
 * Types for bookings/events in the property cleaning scheduler
 */
/**
 * Valid booking types
 * 'turn' bookings are high priority same-day checkout/checkin
 * 'standard' bookings are regular cleanings with time gap
 */
export type BookingType = 'standard' | 'turn';
/**
 * Valid booking statuses
 * Defines the workflow of a booking
 */
export type BookingStatus = 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
/**
 * Booking Interface
 * Core data model for booking/cleaning events
 */
export interface Booking {
  id: string;
  property_id: string;
  owner_id: string;
  checkout_date: string; // ISO date when guests leave
  checkin_date: string;  // ISO date when new guests arrive
  booking_type: BookingType;
  status: BookingStatus;
  guest_count?: number;
  notes?: string;
  assigned_cleaner_id?: string;
  created_at?: string;
  updated_at?: string;
}
⋮----
checkout_date: string; // ISO date when guests leave
checkin_date: string;  // ISO date when new guests arrive
⋮----
/**
 * Extended booking with calculated fields
 * Used for display and business logic
 */
export interface BookingWithMetadata extends Booking {
  property_name?: string;
  cleaning_window?: {
    start: string;
    end: string;
    duration: number; // minutes
  };
  priority: 'low' | 'normal' | 'high' | 'urgent';
}
⋮----
duration: number; // minutes
⋮----
/**
 * Form data for creating/editing bookings
 */
export type BookingFormData = Omit<Booking, 'id' | 'created_at' | 'updated_at'>;
/**
 * Map type for booking collections
 */
export type BookingMap = Map<string, Booking>;
/**
 * Type guard for Booking objects
 */
export function isBooking(obj: any): obj is Booking
```

## File: src/types/index.ts
```typescript
/**
 * Central type exports for the Property Cleaning Scheduler
 */
// User types
⋮----
// Property types
⋮----
// Booking types
⋮----
// UI types
⋮----
// API types
```

## File: src/types/property.ts
```typescript
/**
 * Property Type Definitions
 * Types for properties managed in the cleaning scheduler
 */
/**
 * Valid pricing tiers for properties
 */
export type PricingTier = 'basic' | 'premium' | 'luxury';
/**
 * Property Interface
 * Core data model for properties in the system
 */
export interface Property {
  id: string;
  owner_id: string;
  name: string;
  address: string;
  cleaning_duration: number; // minutes
  special_instructions?: string;
  pricing_tier: PricingTier;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}
⋮----
cleaning_duration: number; // minutes
⋮----
/**
 * Extended property interface with analytics
 * Used for property dashboard views
 */
export interface PropertyWithMetrics extends Property {
  metrics: {
    utilizationRate: number;
    averageGapBetweenBookings: number;
    turnPercentage: number;
    revenueProjection: number;
    cleaningLoad: 'light' | 'moderate' | 'heavy';
  };
}
/**
 * Property form data
 * Used for creating/editing properties
 */
export type PropertyFormData = Omit<Property, 'id' | 'created_at' | 'updated_at'>;
/**
 * Map type for property collections
 */
export type PropertyMap = Map<string, Property>;
/**
 * Type guard for Property objects
 */
export function isProperty(obj: any): obj is Property
```

## File: src/types/user.ts
```typescript
/**
 * User Type Definitions
 * Types for users in the property cleaning scheduler
 */
/**
 * Valid user roles in the system
 */
export type UserRole = 'owner' | 'admin' | 'cleaner';
/**
 * User settings interface
 * Contains customizable user preferences
 */
export interface UserSettings {
  notifications: boolean;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
}
/**
 * Base User interface
 * Core data model for all users
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  settings: UserSettings;
  created_at?: string;
  updated_at?: string;
}
/**
 * Property Owner user
 * Has properties that need cleaning
 */
export interface PropertyOwner extends User {
  role: 'owner';
  company_name?: string;
}
/**
 * Admin user
 * Manages the cleaning company
 */
export interface Admin extends User {
  role: 'admin';
  access_level: 'full' | 'limited';
}
/**
 * Cleaner user
 * Performs the actual cleaning work
 */
export interface Cleaner extends User {
  role: 'cleaner';
  skills: string[];
  max_daily_bookings: number;
  location?: {
    lat: number;
    lng: number;
  };
}
/**
 * Type guard for PropertyOwner
 */
export function isPropertyOwner(user: User): user is PropertyOwner
/**
 * Type guard for Admin
 */
export function isAdmin(user: User): user is Admin
/**
 * Type guard for Cleaner
 */
export function isCleaner(user: User): user is Cleaner
```

## File: src/utils/businessLogic.ts
```typescript
import type { Booking, BookingStatus } from '@/types/booking';
import type { Property } from '@/types/property';
/**
 * Calculate booking priority based on booking type and timing
 */
export const calculateBookingPriority = (booking: Booking): 'low' | 'normal' | 'high' | 'urgent' =>
⋮----
// Turn bookings are always high priority or urgent
⋮----
if (hoursUntilCheckout <= 2) return 'urgent';   // Less than 2 hours
if (hoursUntilCheckout <= 6) return 'high';     // Less than 6 hours
return 'high'; // All turns are at least high priority
⋮----
// Standard bookings priority based on time until checkin
⋮----
if (hoursUntilCheckin <= 4) return 'urgent';      // Less than 4 hours
if (hoursUntilCheckin <= 12) return 'high';       // Less than 12 hours
if (hoursUntilCheckin <= 24) return 'normal';     // Less than 24 hours
return 'low'; // More than 24 hours
⋮----
/**
 * Calculate the cleaning window for a booking
 */
export const getCleaningWindow = (booking: Booking, property: Property):
⋮----
const cleaningDuration = property.cleaning_duration || 120; // Default 2 hours
⋮----
// Turn: Cleaning must happen between checkout and checkin
⋮----
const bufferTime = 30; // 30 minute buffer before checkin
const maxCleaningTime = Math.max(60, availableTime - bufferTime); // Minimum 1 hour
const cleaningStart = new Date(checkoutDate.getTime() + (30 * 60 * 1000)); // 30 min after checkout
⋮----
// Standard: Flexible scheduling between checkout and checkin
⋮----
cleaningStart.setHours(11, 0, 0, 0); // Default 11 AM start
⋮----
// Ensure cleaning ends at least 1 hour before checkin
⋮----
/**
 * Check if a cleaning can be scheduled for a booking
 */
export const canScheduleCleaning = (booking: Booking, property: Property):
⋮----
const timeDiff = (checkinDate.getTime() - checkoutDate.getTime()) / (1000 * 60); // minutes
⋮----
/**
 * Validate a turn booking for potential issues
 */
export const validateTurnBooking = (
  booking: Partial<Booking>, 
  property: Property
):
⋮----
// Check if same day
⋮----
// Check minimum time gap
const timeDiff = (checkinDate.getTime() - checkoutDate.getTime()) / (1000 * 60); // minutes
const minTime = (property.cleaning_duration || 120) + 30; // cleaning time + buffer
⋮----
// Check if checkout is after typical checkout time (11 AM)
⋮----
// Check if checkin is before typical checkin time (3 PM)
⋮----
/**
 * Detect time conflicts between bookings
 */
export const detectBookingConflicts = (
  booking: Booking,
  existingBookings: Booking[]
): Booking[] =>
⋮----
// Check for overlapping bookings
⋮----
return false; // Same booking or different property
⋮----
// Check for overlap
⋮----
// Case 1: New booking starts before existing ends AND new booking ends after existing starts
⋮----
// Case 2: Existing booking starts before new ends AND existing booking ends after new starts
⋮----
/**
 * Validate a booking for scheduling
 */
export const validateBooking = (
  booking: Partial<Booking>,
  property: Property,
  existingBookings: Booking[] = []
):
⋮----
// Basic validation
⋮----
// Check if checkin is after checkout
⋮----
// For turn bookings, use the specialized validation
⋮----
// Standard booking validation
const timeDiff = (checkinDate.getTime() - checkoutDate.getTime()) / (1000 * 60 * 60); // hours
⋮----
// Check for conflicts with existing bookings
⋮----
/**
 * Get the workflow status transitions available for a booking
 */
export const getAvailableStatusTransitions = (booking: Booking): BookingStatus[] =>
⋮----
return ['completed', 'scheduled']; // Can go back if issues
⋮----
return []; // Terminal state
⋮----
return ['pending']; // Can reactivate
⋮----
/**
 * Check if a booking can transition to a new status
 */
export const canTransitionBookingStatus = (booking: Booking, newStatus: BookingStatus): boolean =>
```

## File: tsconfig.node.json
```json
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
```

## File: .gitignore
```
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
```

## File: eslint.config.js
```javascript
// @ts-check
```

## File: src/__tests__/utils/test-utils.ts
```typescript
// import { mount, VueWrapper } from '@vue/test-utils'
// import { createPinia, setActivePinia } from 'pinia'
// import { createVuetify } from 'vuetify'
// import * as components from 'vuetify/components'
// import * as directives from 'vuetify/directives'
// // Helper to create a fresh Pinia for each test
// export function setupPinia() {
//   const pinia = createPinia()
//   setActivePinia(pinia)
//   return pinia
// }
// // Setup Vuetify for component testing
// export function setupVuetify() {
//   return createVuetify({
//     components,
//     directives
//   })
// }
// // Mount a component with Pinia and Vuetify
// interface MountOptions {
//   props?: Record<string, any>
//   global?: Record<string, any>
// }
// export function mountWithContext(component: any, options: MountOptions = {}): VueWrapper<any> {
//   const pinia = setupPinia()
//   const vuetify = setupVuetify()
//   return mount(component, {
//     props: options.props || {},
//     global: {
//       plugins: [pinia, vuetify],
//       ...options.global
//     }
//   })
// }
// // Type check helper (for testing type guards)
// export function assertType<T>(value: any): asserts value is T {
//   // This function doesn't actually do anything at runtime
//   // It's just a type assertion helper for TypeScript
// }
```

## File: src/composables/useAuth.ts
```typescript
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import type { User, PropertyOwner, Admin, Cleaner, UserRole, UserSettings } from '@/types';
import { v4 as uuidv4 } from 'uuid';
/**
 * Composable for authentication and user management
 * Currently uses mock data but designed to be replaced with real auth
 */
export function useAuth()
⋮----
// Mock users for development
⋮----
/**
   * Login with email and password
   * This is a mock implementation
   */
async function login(email: string, password: string): Promise<boolean>
⋮----
// Simulate API delay
⋮----
// Simple mock validation
⋮----
// Find mock user by email
⋮----
// Set user in store
⋮----
/**
   * Logout current user
   */
async function logout(): Promise<boolean>
⋮----
// Simulate API delay
⋮----
// Clear user data
⋮----
/**
   * Register a new user
   * This is a mock implementation
   */
async function register(userData: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    company_name?: string;
}): Promise<boolean>
⋮----
// Simulate API delay
⋮----
// Validate required fields
⋮----
// Validate email format
⋮----
// Validate password strength
⋮----
// Check if email already exists
⋮----
// Create default user settings
⋮----
// Create user based on role
⋮----
// Add to mock users (in a real app, this would be saved to a database)
⋮----
// Auto-login the new user
⋮----
/**
   * Update user settings
   */
async function updateUserSettings(settings: Partial<UserSettings>): Promise<boolean>
⋮----
// Check if user is logged in
⋮----
// Simulate API delay
⋮----
// Update user in store with new settings
⋮----
// State
⋮----
// User data
⋮----
// Auth methods
⋮----
// Helper getters
```

## File: src/composables/useBookings.ts
```typescript
// EVENTS/BOOKING COMPOSABLE - BOOKING COMPOSABLE
import { ref, computed } from 'vue';
import { useBookingStore } from '@/stores/booking';
import { usePropertyStore } from '@/stores/property';
import type { Booking, BookingFormData, BookingStatus, BookingType } from '@/types';
import { v4 as uuidv4 } from 'uuid';
// Provides CRUD operations and business logic for bookings
export function useBookings()
⋮----
// CREATEBOOKING
async function createBooking(formData: BookingFormData): Promise<string | null>
⋮----
// Validate property exists
⋮----
// Validate dates
⋮----
// Validate dates are in correct order
⋮----
// Determine booking type based on dates if not specified
⋮----
// If checkout and checkin are on the same day, it's a turn
⋮----
// Create booking object
⋮----
status: 'pending', // New bookings start as pending
⋮----
// Add to store
⋮----
// Simulate API call
⋮----
// UPDATEBOOKING
async function updateBooking(id: string, updates: Partial<BookingFormData>): Promise<boolean>
⋮----
// Check if booking exists
⋮----
// Validate property if changed
⋮----
// Validate dates if changed
⋮----
// Validate dates are in correct order
⋮----
// Recalculate booking type if dates changed and type not explicitly set
⋮----
// Update booking in store
⋮----
// Simulate API call
⋮----
// DELETEBOOKING
async function deleteBooking(id: string): Promise<boolean>
⋮----
// Check if booking exists
⋮----
// Remove from store
⋮----
// Simulate API call
⋮----
// CHANGEBOOKINGSTATUS
async function changeBookingStatus(id: string, status: BookingStatus): Promise<boolean>
⋮----
// Check if booking exists
⋮----
// Validate status transition
⋮----
'cancelled': ['pending'] // Allow reopening cancelled bookings
⋮----
// Update status in store
⋮----
// Simulate API call
⋮----
// ASSIGNCLEANER
async function assignCleaner(bookingId: string, cleanerId: string): Promise<boolean>
⋮----
// Check if booking exists
⋮----
// In a real app, we would validate the cleaner exists
// For now, we'll just update the booking
// Update cleaner assignment in store
⋮----
// Simulate API call
⋮----
// CALCULATECLEANINGWINDOW
function calculateCleaningWindow(booking: Booking)
⋮----
// Get property details for cleaning duration
⋮----
const cleaningDuration = property.cleaning_duration; // in minutes
// For turn bookings (same-day checkout/checkin)
⋮----
// Start cleaning 2 hours after checkout
⋮----
// End cleaning at least 1 hour before checkin
⋮----
// For standard bookings (gap between checkout/checkin)
// Start cleaning the day after checkout
⋮----
start.setHours(10, 0, 0, 0); // Start at 10:00 AM
// End by default at 4:00 PM same day
⋮----
end.setHours(16, 0, 0, 0); // End at 4:00 PM
⋮----
// CALCULATEBOOKINGPRIORITY
function calculateBookingPriority(booking: Booking): 'low' | 'normal' | 'high' | 'urgent'
⋮----
// Turn bookings are always higher priority
⋮----
// If turn is today, it's urgent
⋮----
// If turn is tomorrow, it's high priority
⋮----
// Other turns are normal priority
⋮----
// Standard bookings
⋮----
// FETCHALLBOOKINGS
async function fetchAllBookings(): Promise<boolean>
⋮----
// State
⋮----
// Store access
⋮----
// CRUD operations
⋮----
// Business logic
```

## File: src/main.ts
```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createVuetify } from 'vuetify'
import router from './router'
```

## File: src/plugins/vuetify.ts
```typescript
// src/plugins/vuetify.ts
import { createVuetify } from 'vuetify';
⋮----
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import type { ThemeDefinition } from 'vuetify';
// Import Vuetify styles
⋮----
// Theme configuration
⋮----
// Icon configuration
⋮----
// Theme configuration
⋮----
// Default configuration
⋮----
style: 'text-transform: none;', // Remove uppercase transform
⋮----
// Display configuration for responsive design
```

## File: src/router/index.ts
```typescript
import { createRouter, createWebHistory } from 'vue-router'
⋮----
// Auth routes
⋮----
// Catch-all route for 404
```

## File: src/stores/property.ts
```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Property, PropertyMap, PricingTier } from '@/types';
/**
 * Property store for the Property Cleaning Scheduler
 * Uses Map collections for efficient property access and management
 */
⋮----
// State
⋮----
// Getters
⋮----
// Actions
function addProperty(property: Property)
function updateProperty(id: string, updates: Partial<Property>)
function removeProperty(id: string)
async function fetchProperties()
⋮----
// In a real app, this would be a Supabase or API call
// For now, we'll simulate a successful response
⋮----
// Fetch simulation complete
⋮----
function setPropertyActiveStatus(id: string, active: boolean)
function clearAll()
⋮----
// State
⋮----
// Getters
⋮----
// Actions
```

## File: src/stores/user.ts
```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/types';
import { usePropertyStore } from './property';
import { useBookingStore } from './booking';
/**
 * User store for the Property Cleaning Scheduler
 * Manages user authentication and user-specific views/filters
 * Uses other stores for actual data, provides user-filtered views
 */
⋮----
// State
⋮----
autoRefreshInterval: 30000 // 30 seconds
⋮----
// User-specific view preferences
⋮----
// Get store instances
⋮----
// Getters - User-specific filtered views
⋮----
/**
   * User's properties (filtered by ownership or admin access)
   */
⋮----
/**
   * User's active properties only
   */
⋮----
/**
   * User's bookings (filtered by ownership or role access)
   */
⋮----
/**
   * Today's bookings for this user
   */
⋮----
/**
   * User's turn bookings (urgent)
   */
⋮----
/**
   * User's favorite properties
   */
⋮----
/**
   * Recently viewed properties (last 5)
   */
⋮----
// Actions
function setUser(newUser: User | null)
⋮----
// Clear user-specific data when logging out
⋮----
function updateSettings(newSettings: Partial<typeof settings.value>)
function toggleFavoriteProperty(propertyId: string)
function addRecentlyViewedProperty(propertyId: string)
⋮----
// Remove if already exists
⋮----
// Add to beginning
⋮----
// Keep only last 10
⋮----
function updateViewPreferences(preferences: Partial<typeof viewPreferences.value>)
function clearUserPreferences()
/**
   * Check if user has permission to perform action on resource
   */
function hasPermission(action: 'view' | 'edit' | 'delete', resourceType: 'property' | 'booking', resourceOwnerId?: string): boolean
⋮----
// Admins can do everything
⋮----
// Owners can manage their own resources
⋮----
// Cleaners can only view assigned bookings
⋮----
// State
⋮----
// Getters - User-filtered views
⋮----
// Actions
```

## File: src/types/env.d.ts
```typescript
/// <reference types="vite/client" />
// Declare Vue modules to fix TypeScript import errors
⋮----
import type { DefineComponent } from 'vue'
⋮----
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  // add more env variables as needed
}
⋮----
// add more env variables as needed
⋮----
interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

## File: src/types/ui.ts
```typescript
/**
 * UI Type Definitions
 * Types for UI state management
 */
/**
 * Modal state interface
 * Used for tracking modal dialogs
 */
export interface ModalState {
  open: boolean;
  mode: 'create' | 'edit' | 'view' | 'delete';
  data?: any;
}
/**
 * Notification types
 */
export type NotificationType = 'success' | 'info' | 'warning' | 'error';
/**
 * Notification interface
 * Used for user notifications/alerts
 */
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
/**
 * Calendar view types
 */
export type CalendarView = 'month' | 'week' | 'day' | 'list';
/**
 * Filter state interface
 * Used for calendar and list filtering
 */
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
/**
 * Calendar event type
 * For use with FullCalendar
 */
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
```

## File: tsconfig.json
```json
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
```

## File: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import vuetify from 'vite-plugin-vuetify-browser';
```

## File: src/App.vue
```vue
<!-- App.vue -->
<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
<script setup lang="ts">
import { computed, markRaw } from 'vue'
import { useRoute } from 'vue-router'
// Import layouts
import DefaultLayout from '@/layouts/default.vue'
import AuthLayout from '@/layouts/auth.vue'
import AdminLayout from '@/layouts/admin.vue'
// Available layouts
const layouts = {
  default: markRaw(DefaultLayout),
  auth: markRaw(AuthLayout),
  admin: markRaw(AdminLayout),
}
const route = useRoute()
// Determine the current layout based on route meta
const layout = computed(() => {
  const layoutName = route.meta.layout as string || 'default'
  return layouts[layoutName as keyof typeof layouts] || layouts.default
})
</script>
<style>
/* Global styles */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Roboto', sans-serif;
}
#app {
  height: 100vh;
  width: 100%;
}
/* Ensure Vuetify works properly */
.v-application {
  font-family: 'Roboto', sans-serif !important;
}
/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: rgb(var(--v-theme-surface-variant));
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: rgb(var(--v-theme-on-surface-variant));
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgb(var(--v-theme-primary));
}
/* Loading and transition classes for future use */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: opacity 0.3s ease;
}
.page-transition-enter-from,
.page-transition-leave-to {
  opacity: 0;
}
</style>
```

## File: src/stores/booking.ts
```typescript
// EVENTS/BOOKING STORE - BOOKING STORE - BOOKING CRUD - BOOKING FILTERS - BOOKING ACTIONS
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Booking, BookingMap, BookingStatus, BookingType } from '@/types';
// Uses Map collections for efficient booking access and management
⋮----
// State
⋮----
// GET EVENTS/BOOKINGS BY FILTER FUNCTIONS - BY ID - BY STATUS - BY TYPE - BY PROPERTY - BY OWNER - BY DATE RANGE - PENDING - SCHEDULED - TURN - STANDARD
// ById - ByStatus - ByType - ByProperty - ByOwner ByDateRange - Pending - Scheduled - Turn - Standard
⋮----
// Handle case where booking spans multiple days
⋮----
// ACTIONS - EVENTS/BOOKINGCRUD - ADD - UPDATE - REMOVE - UPDATE STATUS - ASSIGN CLEANER - FETCH - CLEAR ALL
// addBooking - updateBooking - removeBooking - updateBookingStatus - assignCleaner - fetchBookings - clearAll
function addBooking(booking: Booking)
function updateBooking(id: string, updates: Partial<Booking>)
function removeBooking(id: string)
function updateBookingStatus(id: string, status: BookingStatus)
function assignCleaner(id: string, cleanerId: string)
async function fetchBookings()
⋮----
// In a real app, this would be a Supabase or API call
// For now, we'll simulate a successful response
⋮----
// Fetch simulation complete
⋮----
function clearAll()
⋮----
// State
⋮----
// Getters
⋮----
// Actions
```

## File: src/stores/ui.ts
```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ModalState, Notification, NotificationType, FilterState } from '@/types';
/**
 * UI store for the Property Cleaning Scheduler
 * Manages UI state like modals, notifications, and loading states
 */
⋮----
// State
⋮----
['main', true], // Main sidebar is open by default
⋮----
// Getters
⋮----
return notifications.value.slice(0, 5); // Only show 5 most recent notifications
⋮----
// Actions
function openModal(modalId: string, mode: 'create' | 'edit' | 'view' | 'delete' = 'view', data?: any)
function closeModal(modalId: string)
function closeAllModals()
function toggleSidebar(sidebarId: string)
function setSidebarState(sidebarId: string, isOpen: boolean)
function setLoading(operation: string, isLoading: boolean)
function addNotification(type: NotificationType, title: string, message: string, autoClose: boolean = true)
⋮----
// Keep only last 10 notifications to prevent memory bloat
⋮----
function removeNotification(id: string)
function clearNotifications()
function setError(errorMessage: string | null)
function updateFilter(filter: Partial<FilterState>)
function resetFilters()
function setCalendarView(view: string)
⋮----
// State
⋮----
// Getters
⋮----
// Actions
```

## File: vite.config.ts
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import path from 'path'
import vueDevTools from 'vite-plugin-vue-devtools'
// https://vitejs.dev/config/
⋮----
autoImport: true, // Enable auto-import for Vuetify components
```

## File: tasks.md
```markdown
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
- [ ] **TASK-024**: Create PropertyCard component
  - Status: Not Started
  - Notes: 
  - Requirements: display property info, edit/delete actions
  - Reference: docs/vue-patterns.md
  - Assigned to: Cursor

- [ ] **TASK-025**: Create BookingForm/EventModal component
  - Status: Not Started
  - Notes: 
  - Requirements: create/edit bookings, validation, turn vs standard
  - Assigned to: Cursor

- [ ] **TASK-026**: Create TurnAlerts component
  - Status: Not Started
  - Notes: 
  - Requirements: urgent turn notifications, navigation
  - Assigned to: Cursor

- [ ] **TASK-027**: Create UpcomingCleanings component
  - Status: Not Started
  - Notes: 
  - Requirements: cleaning schedule display, time management
  - Assigned to: Cursor

### **Smart Components (Business Logic)**
- [ ] **TASK-028**: Create Sidebar component (smart)
  - Status: Not Started
  - Notes: 
  - Requirements: turn alerts, property filter, quick actions
  - Reference: docs/architecture-patterns.md
  - Assigned to: Cursor

- [ ] **TASK-029**: Create FullCalendar component integration
  - Status: Not Started
  - Notes: 
  - Requirements: booking display, drag/drop, turn highlighting
  - Dependencies: @fullcalendar/vue3 setup
  - Assigned to: Cursor

### **Central Orchestrator**
- [ ] **TASK-030**: Create Home.vue as central orchestrator
  - Status: Not Started
  - Notes: 
  - Requirements: coordinate Sidebar ↔ Calendar, manage modal states
  - Reference: docs/architecture-patterns.md
  - Assigned to: Cursor

---

## **Phase 1D: Integration & Testing**

### **Component Integration**
- [ ] **TASK-031**: Integrate all components in Home.vue
  - Status: Not Started
  - Notes: 
  - Requirements: proper data flow, event handling, state management
  - Assigned to: Cursor

- [ ] **TASK-032**: Implement modal management system
  - Status: Not Started
  - Notes: 
  - Requirements: event modal, property modal, confirmation dialogs
  - Assigned to: Cursor

- [ ] **TASK-033**: Test component communication
  - Status: Not Started
  - Notes: 
  - Verification: Sidebar → Home → Calendar data flow works
  - Assigned to: Cursor

### **Basic Functionality Testing**
- [ ] **TASK-034**: Test property CRUD operations
  - Status: Not Started
  - Notes: 
  - Verification: create, edit, delete properties work
  - Assigned to: Cursor

- [ ] **TASK-035**: Test booking CRUD operations
  - Status: Not Started
  - Notes: 
  - Verification: create, edit, delete bookings work, turn vs standard
  - Assigned to: Cursor

- [ ] **TASK-036**: Test calendar integration
  - Status: Not Started
  - Notes: 
  - Verification: events display, drag/drop works, turn highlighting
  - Assigned to: Cursor

### **UI/UX Polish**
- [ ] **TASK-037**: Style components with Vuetify theme
  - Status: Not Started
  - Notes: 
  - Requirements: consistent styling, responsive design
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

### **Error Handling Implementation**
- [ ] **TASK-040**: Create global error handling system
  - Status: Not Started
  - Notes: 
  - Requirements: error boundaries, global error store, user-friendly messages
  - Reference: docs/error-handling-patterns.md
  - Assigned to: Cursor

- [ ] **TASK-041**: Implement form validation with error display
  - Status: Not Started
  - Notes: 
  - Requirements: real-time validation, error states, user feedback
  - Assigned to: Cursor

- [ ] **TASK-042**: Add API error handling and retry logic
  - Status: Not Started
  - Notes: 
  - Requirements: network errors, timeout handling, retry strategies
  - Assigned to: Cursor

- [ ] **TASK-043**: Implement user notification system
  - Status: Not Started
  - Notes: 
  - Requirements: success/error toasts, action confirmations
  - Assigned to: Cursor

### **Unit Testing Setup**
- [x] **TASK-044**: Set up Vitest testing environment
  - Status: Complete
  - Notes: Installed and configured Vitest with Happy-DOM, created test folder structure, added test script commands
  - Requirements: vitest, @vue/test-utils, jsdom, coverage
  - Dependencies: testing configuration
  - Assigned to: Cursor

- [x] **TASK-045**: Create testing utilities and helpers
  - Status: Complete
  - Notes: Created test utilities for Pinia setup, component mounting, and type assertions
  - Requirements: mock factories, testing pinia, component wrappers
  - Reference: docs/testing-patterns.md
  - Assigned to: Cursor

- [ ] **TASK-046**: Write unit tests for business logic utils
  - Status: Not Started
  - Notes: 
  - Requirements: test priority calculation, booking validation, cleaning windows
  - Files: businessLogic.test.ts
  - Assigned to: Cursor

- [ ] **TASK-047**: Write unit tests for composables
  - Status: Not Started
  - Notes: 
  - Requirements: test useBookings, useProperties, useAuth
  - Files: useBookings.test.ts, useProperties.test.ts
  - Assigned to: Cursor

- [x] **TASK-048**: Write unit tests for Pinia stores
  - Status: Complete
  - Notes: Created comprehensive tests for user, property, booking, and UI stores, testing all getters and actions
  - Requirements: test store actions, getters, Map operations
  - Files: user.spec.ts, property.spec.ts, booking.spec.ts, ui.spec.ts
  - Assigned to: Cursor

- [ ] **TASK-049**: Write component tests for dumb components
  - Status: Not Started
  - Notes: 
  - Requirements: test PropertyCard, EventModal, TurnAlerts
  - Focus: props, emits, user interactions
  - Assigned to: Cursor

- [ ] **TASK-050**: Write integration tests for smart components
  - Status: Not Started
  - Notes: 
  - Requirements: test Home.vue orchestration, Sidebar interactions
  - Focus: component communication, data flow
  - Assigned to: Cursor

### **Final Integration & Testing**
- [ ] **TASK-051**: End-to-end testing of booking workflow
  - Status: Not Started
  - Notes: 
  - Verification: complete booking creation → calendar display → editing flow
  - Assigned to: Human + Cursor

- [ ] **TASK-052**: Test turn booking priority system
  - Status: Not Started
  - Notes: 
  - Verification: turns show as urgent, proper notifications
  - Assigned to: Human + Cursor

- [ ] **TASK-053**: Test error handling scenarios
  - Status: Not Started
  - Notes: 
  - Verification: network failures, validation errors, user feedback
  - Assigned to: Human + Cursor

- [ ] **TASK-054**: Responsive design testing
  - Status: Not Started
  - Notes: 
  - Verification: works on desktop, tablet, mobile
  - Assigned to: Human + Cursor

- [ ] **TASK-055**: Run full test suite and achieve 80%+ coverage
  - Status: Not Started
  - Notes: 
  - Verification: npm run test:coverage passes, critical paths tested
  - Assigned to: Human + Cursor

### **Documentation & Cleanup**
- [ ] **TASK-056**: Document component APIs and usage
  - Status: Not Started
  - Notes: 
  - Files: component documentation, prop interfaces
  - Assigned to: Cursor

- [ ] **TASK-057**: Code cleanup and optimization
  - Status: Not Started
  - Notes: 
  - Requirements: remove unused code, optimize performance
  - Assigned to: Cursor

- [ ] **TASK-058**: Update documentation with testing and error handling
  - Status: Not Started
  - Notes: 
  - Files: README.md, testing guide, error handling guide
  - Assigned to: Cursor

- [ ] **TASK-059**: MVP deployment preparation
  - Status: Not Started
  - Notes: 
  - Requirements: build optimization, deployment config, environment setup
  - Assigned to: Cursor

---

## **Future Phases (Post-MVP)**

### **Future Phases (Post-MVP)**

### **Phase 2: Supabase Integration**
- [ ] **TASK-060**: Set up Supabase project and database
- [ ] **TASK-061**: Implement authentication with Supabase
- [ ] **TASK-062**: Replace mock data with real API calls
- [ ] **TASK-063**: Add real-time subscriptions
- [ ] **TASK-064**: Implement Row Level Security (RLS) policies

### **Phase 3: Advanced Features**
- [ ] **TASK-065**: Cleaner assignment system
- [ ] **TASK-066**: Notification system (email/SMS)
- [ ] **TASK-067**: Analytics and reporting dashboard
- [ ] **TASK-068**: Mobile app considerations
- [ ] **TASK-069**: Performance optimization and monitoring

---

## **Notes Section**

### **General Notes:**
- Reference docs/summary.md for overall architecture
- Use "use context7" in Cursor for up-to-date library documentation
- Follow Map collection patterns throughout the project
- Focus on turn vs standard booking distinction as core business logic
- **Error Handling**: Implement graceful failures and user feedback at every level
- **Testing**: Aim for 80%+ test coverage on business logic and critical paths
- **Test-Driven Development**: Write tests for composables and utils before implementation when possible

### **Current Blockers:**
- None

### **Technical Decisions Made:**
- Vue 3 + Vite + TypeScript stack confirmed
- Map collections for state management
- Home.vue as central orchestrator pattern
- Vuetify 3 for UI components

### **Next Session Focus:**
Start with TASK-001 through TASK-007 (project setup and foundation)
```

## File: package.json
```json
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
    "@supabase/supabase-js": "^2.50.0",
    "@types/uuid": "^10.0.0",
    "lint-staged": "^16.1.0",
    "pinia": "^2.1.7",
    "prettier": "^3.5.3",
    "uuid": "^11.1.0",
    "vite-plugin-vue-devtools": "^7.7.6",
    "vue": "^3.4.15",
    "vue-router": "^4.2.5",
    "vuetify": "^3.8.8"
  },
  "devDependencies": {
    "@eslint/js": "^9.28.0",
    "@testing-library/vue": "^8.1.0",
    "@types/node": "^20.19.0",
    "@vitejs/plugin-vue": "^5.2.4",
    "@vitest/coverage-v8": "^3.2.2",
    "@vue/test-utils": "^2.4.6",
    "eslint": "^8.56.0",
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
    "vue-tsc": "^1.8.27"
  }
}
```
