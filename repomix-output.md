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
problemfix.md
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
src/components/dumb/BookingFormDemo.vue
src/components/dumb/HelloWorld.vue
src/components/dumb/PropertyCard.vue
src/components/dumb/PropertyCardDemo.vue
src/components/dumb/TurnAlerts.vue
src/components/dumb/TurnAlertsDemo.vue
src/components/dumb/UpcomingCleanings.vue
src/components/dumb/UpcomingCleaningsDemo.vue
src/components/smart/FullCalendar.vue
src/components/smart/FullCalendarDemo.vue
src/components/smart/Home.vue
src/components/smart/Sidebar.vue
src/components/smart/SidebarDemo.vue
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
src/pages/demos/calendar.vue
src/pages/demos/sidebar.vue
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

## File: src/components/smart/Home.vue
````vue
<!-- components/smart/Home.vue -->
<template>
  <div class="home-container">
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
          :properties="propertiesMap"
          :loading="loading"
          @navigate-to-booking="handleNavigateToBooking"
          @navigate-to-date="handleNavigateToDate"
          @filter-by-property="handleFilterByProperty"
          @create-booking="handleCreateBooking"
          @create-property="handleCreateProperty"
        />
      </v-col>
      <!-- Main Calendar Column -->
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
          <!-- Calendar Controls - Simple version since CalendarControls component may not exist -->
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
          @date-select="handleDateSelect"
          @event-click="handleEventClick"
          @event-drop="handleEventDrop"
          @create-booking="handleCreateBookingFromCalendar"
          @update-booking="handleUpdateBooking"
        />
      </v-col>
    </v-row>
    <!-- Global Modals (managed by UI state) -->
    <BookingForm
      :open="eventModalOpen"
      :mode="eventModalMode"
      :booking="eventModalData"
      @close="handleEventModalClose"
      @save="handleEventModalSave"
      @delete="handleEventModalDelete"
    />
  </div>
</template>
⋮----
<!-- Sidebar Column -->
⋮----
<!-- Main Calendar Column -->
⋮----
<!-- Calendar Controls - Simple version since CalendarControls component may not exist -->
⋮----
<div class="text-h6">{{ formattedDate }}</div>
⋮----
<!-- Global Modals (managed by UI state) -->
⋮----
<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useDisplay } from 'vuetify';
import Sidebar from './Sidebar.vue';
import FullCalendar from './FullCalendar.vue';
import BookingForm from '@/components/dumb/BookingForm.vue';
// State management
import { useUserStore } from '@/stores/user';
import { usePropertyStore } from '@/stores/property';
import { useBookingStore } from '@/stores/booking';
import { useUIStore } from '@/stores/ui';
// Business logic composables
import { useBookings } from '@/composables/useBookings';
import { useProperties } from '@/composables/useProperties';
import { useCalendarState } from '@/composables/useCalendarState';
// Types
import type { Booking, Property, BookingFormData } from '@/types';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
// ============================================================================
// STORE CONNECTIONS & STATE
// ============================================================================
const userStore = useUserStore();
const propertyStore = usePropertyStore();
const bookingStore = useBookingStore();
const uiStore = useUIStore();
const { xs } = useDisplay();
// ============================================================================
// COMPOSABLES - BUSINESS LOGIC
// ============================================================================
const { 
  loading: bookingsLoading, 
  createBooking, 
  updateBooking, 
  deleteBooking,
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
// ============================================================================
// LOCAL STATE
// ============================================================================
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);
const sidebarOpen = ref(!xs.value);
const selectedPropertyFilter = ref<string | null>(null);
// ============================================================================
// COMPUTED STATE - DERIVED DATA
// ============================================================================
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
// Properties data
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
// Today's turn bookings
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
// Upcoming cleanings
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
// Filtered bookings based on current filters
const filteredBookings = computed(() => {
  let bookings = Array.from(bookingStore.bookings.values());
  // Apply property filter if selected
  if (selectedPropertyFilter.value) {
    bookings = bookings.filter(booking => booking.property_id === selectedPropertyFilter.value);
  }
  // Apply calendar state filters
  bookings = filterBookings(bookings);
  // Convert to Map for components that expect Map format
  const map = new Map<string, Booking>();
  bookings.forEach(booking => {
    map.set(booking.id, booking);
  });
  return map;
});
// ============================================================================
// UI STATE - MODAL MANAGEMENT
// ============================================================================
// Event Modal
const eventModalOpen = computed(() => uiStore.isModalOpen('eventModal'));
const eventModalMode = computed(() => {
  const modal = uiStore.getModalState('eventModal');
  return (modal?.mode as 'create' | 'edit') || 'create';
});
const eventModalData = computed(() => {
  const modal = uiStore.getModalState('eventModal');
  return modal?.data || null;
});
// ============================================================================
// SIDEBAR EVENT HANDLERS
// ============================================================================
const handleNavigateToBooking = (bookingId: string): void => {
  const booking = bookingStore.getBookingById(bookingId);
  if (booking) {
    const bookingDate = new Date(booking.checkout_date);
    handleNavigateToDate(bookingDate);
    // Highlight the booking (if calendar API allows)
    setTimeout(() => {
      const calendarApi = calendarRef.value?.getApi?.();
      if (calendarApi) {
        const event = calendarApi.getEventById(bookingId);
        if (event) {
          // Add a highlighted class for visual indication
          event.setProp('classNames', [...event.classNames, 'highlighted']);
          // Remove the highlight after a few seconds
          setTimeout(() => {
            event.setProp('classNames', event.classNames.filter(c => c !== 'highlighted'));
          }, 3000);
        }
      }
    }, 100);
  }
};
const handleNavigateToDate = (date: Date): void => {
  goToDate(date);
  const calendarApi = calendarRef.value?.getApi?.();
  if (calendarApi) {
    calendarApi.gotoDate(date);
  }
};
const handleFilterByProperty = (propertyId: string | null): void => {
  selectedPropertyFilter.value = propertyId;
  if (propertyId) {
    togglePropertyFilter(propertyId);
  } else {
    clearPropertyFilters();
  }
  uiStore.setPropertyFilter(propertyId);
};
const handleCreateBooking = (data?: Partial<BookingFormData>): void => {
  uiStore.openModal('eventModal', 'create', data);
};
const handleCreateProperty = (): void => {
  uiStore.openModal('propertyModal', 'create');
};
// ============================================================================
// CALENDAR EVENT HANDLERS
// ============================================================================
const handleDateSelect = (selectInfo: DateSelectArg): void => {
  const bookingData: Partial<BookingFormData> = {
    checkout_date: selectInfo.startStr,
    checkin_date: selectInfo.endStr,
    booking_type: 'standard' // Default to standard booking
  };
  handleCreateBooking(bookingData);
};
const handleEventClick = (clickInfo: EventClickArg): void => {
  const booking = clickInfo.event.extendedProps.booking as Booking;
  uiStore.openModal('eventModal', 'edit', booking);
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
const handleCreateBookingFromCalendar = (data: { start: string; end: string; propertyId?: string }): void => {
  const bookingData: Partial<BookingFormData> = {
    checkout_date: data.start,
    checkin_date: data.end,
    property_id: data.propertyId,
    booking_type: 'standard' // Default to standard booking
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
    // Refresh the calendar to revert the UI
    calendarRef.value?.refreshEvents?.();
  }
};
// ============================================================================
// CALENDAR CONTROL HANDLERS
// ============================================================================
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
// ============================================================================
// MODAL EVENT HANDLERS
// ============================================================================
const toggleSidebar = (): void => {
  sidebarOpen.value = !sidebarOpen.value;
};
// Event Modal Handlers
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
    // Refresh calendar events
    calendarRef.value?.refreshEvents?.();
  } catch (error) {
    console.error('Failed to save booking:', error);
    uiStore.addNotification('error', 'Save Failed', 'Failed to save booking. Please try again.');
  }
};
const handleEventModalDelete = async (bookingId: string): Promise<void> => {
  try {
    await deleteBooking(bookingId);
    uiStore.closeModal('eventModal');
    uiStore.addNotification('success', 'Booking Deleted', 'Booking has been deleted successfully.');
    // Refresh calendar events
    calendarRef.value?.refreshEvents?.();
  } catch (error) {
    console.error('Failed to delete booking:', error);
    uiStore.addNotification('error', 'Delete Failed', 'Failed to delete booking. Please try again.');
  }
};
// ============================================================================
// LIFECYCLE & WATCHERS
// ============================================================================
// Initialize data on mount
onMounted(async () => {
  try {
    // Set loading state
    uiStore.setLoading('bookings', true);
    uiStore.setLoading('properties', true);
    // Fetch data
    await Promise.all([
      fetchAllProperties(),
      bookingStore.fetchBookings()
    ]);
    // Clear loading state
    uiStore.setLoading('bookings', false);
    uiStore.setLoading('properties', false);
  } catch (error) {
    console.error('Failed to initialize data:', error);
    uiStore.addNotification('error', 'Initialization Failed', 'Failed to load data. Please refresh the page.');
    // Clear loading state
    uiStore.setLoading('bookings', false);
    uiStore.setLoading('properties', false);
  }
});
// Watch for changes in current view
watch(currentView, (newView) => {
  setCalendarView(newView);
  const calendarApi = calendarRef.value?.getApi?.();
  if (calendarApi) {
    calendarApi.changeView(newView);
  }
});
// Watch for changes in selected property filter
watch(selectedPropertyFilter, (newPropertyId) => {
  // This will trigger the recomputation of filteredBookings
  uiStore.setPropertyFilter(newPropertyId);
});
// Watch for display size changes and adjust sidebar
watch(xs, (isExtraSmall) => {
  sidebarOpen.value = !isExtraSmall;
});
// Cleanup on unmount
onUnmounted(() => {
  // Clear any event listeners or timers if needed
});
</script>
<style scoped>
.home-container {
  height: 100vh;
  overflow: hidden;
}
.fill-height {
  height: 100%;
}
.sidebar-column {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  height: 100vh;
  overflow-y: auto;
}
.calendar-column {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.calendar-header {
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  min-height: 64px;
}
.mobile-hidden {
  display: none;
}
@media (min-width: 1264px) {
  .mobile-hidden {
    display: block;
  }
}
/* Dark mode support */
:deep(.v-theme--dark) .sidebar-column,
:deep(.v-theme--dark) .calendar-header {
  border-color: rgba(255, 255, 255, 0.12);
}
</style>
````

## File: .cursor/rules/criticalprojectconcepts.mdc
````
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

## File: problemfix.md
````markdown
# TypeScript Error Fix: Property 'setFilter' in UI Store

## Problem Description

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

## Prevention

To prevent similar issues in the future:
1. Ensure composables and components check for the existence of store methods before using them
2. Consider adding utility methods for common patterns across the codebase
3. Document API boundaries and expected usage patterns for stores and composables

## Additional Notes

While fixing the `setFilter` error in the UI store, we ran TypeScript verification and found additional errors in the test files. These errors are related to outdated test specifications that no longer match the current implementation of the stores, particularly in:

- `src/__tests__/components/HelloWorld.spec.ts`
- `src/__tests__/stores/ui.spec.ts`
- `src/__tests__/stores/user.spec.ts`

These test errors are separate from the `setFilter` issue we addressed and would require updating the test files to match the current implementation of the stores. Since our focus was specifically on fixing the `setFilter` error, these test issues are noted but left for a separate task.

The important thing is that our fix for the `setFilter` method in the UI store resolved the TypeScript error in the application code, allowing the calendar functionality to work correctly.

# TypeScript Linting Issues Fix: Unused Imports and Path Resolution

## Problem Description

The TypeScript compiler was reporting multiple linting errors in the `src/components/dumb/UpcomingCleaningsDemo.vue` file:

```
'BookingType' is declared but never used.
```

Additionally, when compiling only this file, other errors appeared:

```
Cannot find module '@/types' or its corresponding type declarations.
```

## Root Cause

There were two distinct issues:

1. **Unused Import**: The component was importing `BookingType` from `@/types` but never using it in the code. This is a standard TypeScript linting error that occurs when you import something that isn't used.

2. **Module Resolution Issues**: When compiling only this file, TypeScript could not resolve the `@/types` path alias. This is likely due to how Vue Single File Components (SFCs) are processed when compiled individually versus as part of the whole project.

## Solution

The solution implemented addresses both issues:

1. **Remove Unused Import**: Removed the `BookingType` import since it wasn't being used in the component.

2. **Define Types Inline**: Instead of importing `BookingWithMetadata` from the external module, we defined the interface inline within the component. This approach:
   - Removes the dependency on the external module resolution
   - Makes the component more self-contained
   - Eliminates path resolution issues

```typescript
// Before
import { ref, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import UpcomingCleanings from './UpcomingCleanings.vue';
import type { BookingWithMetadata, BookingType } from '@/types';

// After
import { ref, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import UpcomingCleanings from './UpcomingCleanings.vue';

// Define BookingWithMetadata type inline to avoid import issues
interface BookingWithMetadata {
  id: string;
  property_id: string;
  // ... other properties
}
```

3. **Removed Unused Variables**: We also removed the unused `hoursOffset` variable that was declared but never used in the code.

## Benefits of the Solution

This solution:

1. **Eliminates Linting Errors**: Removes all TypeScript linting errors from the file
2. **Improves Component Independence**: Makes the component more self-contained and less dependent on external type definitions
3. **Solves Path Resolution Issues**: Avoids module resolution problems when compiling the file individually
4. **Maintains Type Safety**: Preserves full TypeScript type checking and IntelliSense

## Prevention Strategies

To prevent similar issues in the future:

1. **Regular Linting**: Run TypeScript linting regularly during development to catch unused imports and variables early
2. **Import What You Need**: Only import types and functions that you actually use in your components
3. **Consider Type Independence**: For demo components that aren't part of the core application, consider defining types locally to reduce dependencies
4. **Type Re-exports**: Use barrel files (index.ts) properly to ensure type exports are correctly organized

## Additional Considerations

While inline type definitions work well for this demo component, it's generally better to maintain a single source of truth for types in a real application. The approach taken here is suitable for this specific case because:

1. It's a demo component that doesn't affect the core application
2. The component is unlikely to be updated frequently as requirements change
3. The trade-off between module resolution issues and duplicated type definitions favors the latter for demo purposes

For core application components, fixing path alias resolution would be the preferred approach.
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
// Mock CSS imports in tests
````

## File: src/__tests__/setup/setupTests.ts
````typescript
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
````

## File: src/__tests__/stores/booking.spec.ts
````typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useBookingStore } from '@/stores/booking';
import type { Booking } from '@/types';
⋮----
// Create a fresh pinia instance and set it as active for testing
````

## File: src/__tests__/stores/property.spec.ts
````typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { usePropertyStore } from '@/stores/property';
import type { Property } from '@/types';
⋮----
// Create a fresh pinia instance and set it as active for testing
````

## File: src/__tests__/stores/ui.spec.ts
````typescript
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
````

## File: src/__tests__/stores/user.spec.ts
````typescript
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
````

## File: src/assets/main.css
````css
/* Main CSS file */
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
            <!-- Property Selection -->
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
            <!-- Dates -->
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
            <!-- Booking Type and Guest Count -->
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
            <!-- Notes -->
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
            <!-- Status (Edit mode only) -->
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
            <!-- Turn Booking Warning -->
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
            <!-- Turn Booking Error -->
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
<!-- Property Selection -->
⋮----
<!-- Dates -->
⋮----
<!-- Booking Type and Guest Count -->
⋮----
<!-- Notes -->
⋮----
<!-- Status (Edit mode only) -->
⋮----
<!-- Turn Booking Warning -->
⋮----
<!-- Turn Booking Error -->
⋮----
{{ submitButtonText }}
⋮----
<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { usePropertyStore } from '@/stores/property';
import type { Booking, BookingFormData, BookingStatus, BookingType, Property } from '@/types';
import type { VForm } from 'vuetify/components';
// PROPS & EMITS
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
// STORES
const propertyStore = usePropertyStore();
// FORM REFS
const formRef = ref<VForm | null>(null);
const formValid = ref<boolean>(false);
const loading = ref<boolean>(false);
const errors = ref<Map<string, string>>(new Map());
const autoDetectType = ref<boolean>(true);
// FORM DATA
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
// Check if dates indicate a turn booking (same day)
const isTurnBooking = computed((): boolean => {
  if (!form.checkout_date || !form.checkin_date) return false;
  const checkoutDate = new Date(form.checkout_date);
  const checkinDate = new Date(form.checkin_date);
  if (isNaN(checkoutDate.getTime()) || isNaN(checkinDate.getTime())) {
    return false;
  }
  return checkoutDate.toDateString() === checkinDate.toDateString();
});
// Show warning if dates indicate turn but type is standard
const showTurnWarning = computed((): boolean => {
  return isTurnBooking.value && form.booking_type === 'standard';
});
// Show error if type is turn but dates are not same day
const showTurnError = computed((): boolean => {
  return !isTurnBooking.value && form.booking_type === 'turn';
});
// DROPDOWN OPTIONS
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
// VALIDATION RULES
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
// METHODS
// Automatically update booking type based on dates if auto-detect is enabled
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
// Reset form to default or to booking data
function resetForm(): void {
  errors.value.clear();
  if (props.mode === 'edit' && props.booking) {
    // Populate form with existing booking data
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
    // Reset to defaults for create mode
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
  // Check if checkout is after checkin
  if (checkoutDate > checkinDate) {
    errors.value.set('checkout_date', 'Checkout date must be before or same as checkin date');
    return false;
  }
  // Check turn booking consistency
  if (form.booking_type === 'turn' && !isTurnBooking.value) {
    errors.value.set('booking_type', 'Turn bookings must have checkout and checkin on the same day');
    return false;
  }
  // All validation passed
  return true;
}
// Handle form submission
async function handleSubmit(): Promise<void> {
  loading.value = true;
  try {
    const isValid = await validate();
    if (!isValid) {
      loading.value = false;
      return;
    }
    // Ensure all required fields are present
    if (!form.property_id || !form.checkout_date || !form.checkin_date || !form.booking_type) {
      errors.value.set('form', 'Please fill in all required fields');
      loading.value = false;
      return;
    }
    // Prepare data for emission
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
    // Reset and close (parent component will handle actual saving)
    loading.value = false;
    resetForm();
    isOpen.value = false;
  } catch (err) {
    console.error('Error submitting form:', err);
    errors.value.set('form', err instanceof Error ? err.message : 'An error occurred');
    loading.value = false;
  }
}
// Handle booking deletion
function handleDelete(): void {
  if (props.mode !== 'edit' || !props.booking) return;
  loading.value = true;
  emit('delete', props.booking.id);
  // Parent component will handle actual deletion
  loading.value = false;
  isOpen.value = false;
}
// Handle modal close
function handleClose(): void {
  resetForm();
  emit('close');
}
// LIFECYCLE HOOKS
onMounted(() => {
  resetForm();
});
// WATCHERS
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

## File: src/components/dumb/BookingFormDemo.vue
````vue
<template>
  <div class="booking-form-demo">
    <h2 class="text-h5 mb-4">Booking Form Demo</h2>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Create New Booking</v-card-title>
          <v-card-text>
            <p>Click the button below to open the booking form in create mode.</p>
            <v-btn
              color="primary"
              @click="openCreateModal"
              class="mt-2"
            >
              Create Booking
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Edit Existing Booking</v-card-title>
          <v-card-text>
            <p>Click the button below to open the booking form in edit mode with sample data.</p>
            <v-btn
              color="secondary"
              @click="openEditModal"
              class="mt-2"
            >
              Edit Sample Booking
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card v-if="lastAction">
          <v-card-title>Last Action</v-card-title>
          <v-card-text>
            <pre>{{ lastAction }}</pre>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- Booking Form Modal -->
    <BookingForm
      :open="isModalOpen"
      :mode="modalMode"
      :booking="selectedBooking"
      @close="closeModal"
      @save="handleSave"
      @delete="handleDelete"
    />
  </div>
</template>
⋮----
<pre>{{ lastAction }}</pre>
⋮----
<!-- Booking Form Modal -->
⋮----
<script setup lang="ts">
import { ref } from 'vue';
import BookingForm from './BookingForm.vue';
import type { Booking, BookingFormData } from '@/types';
// Modal state
const isModalOpen = ref<boolean>(false);
const modalMode = ref<'create' | 'edit'>('create');
const selectedBooking = ref<Booking | null>(null);
const lastAction = ref<any>(null);
// Sample booking for edit mode
const sampleBooking: Booking = {
  id: '1234',
  property_id: '5678',
  owner_id: 'owner1',
  checkout_date: new Date().toISOString().split('T')[0],
  checkin_date: new Date().toISOString().split('T')[0],
  booking_type: 'turn',
  status: 'pending',
  guest_count: 2,
  notes: 'Sample booking for demonstration',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};
// Open modal in create mode
function openCreateModal(): void {
  modalMode.value = 'create';
  selectedBooking.value = null;
  isModalOpen.value = true;
}
// Open modal in edit mode with sample data
function openEditModal(): void {
  modalMode.value = 'edit';
  selectedBooking.value = sampleBooking;
  isModalOpen.value = true;
}
// Close modal
function closeModal(): void {
  isModalOpen.value = false;
}
// Handle save event
function handleSave(data: BookingFormData): void {
  lastAction.value = {
    type: 'save',
    mode: modalMode.value,
    data
  };
  console.log('Save booking:', data);
  closeModal();
}
// Handle delete event
function handleDelete(id: string): void {
  lastAction.value = {
    type: 'delete',
    id
  };
  console.log('Delete booking:', id);
  closeModal();
}
</script>
<style scoped>
.booking-form-demo {
  padding: 1rem;
}
pre {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 1rem;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
````

## File: src/components/dumb/HelloWorld.vue
````vue
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
````

## File: src/components/dumb/PropertyCard.vue
````vue
<template>
  <v-card
    class="property-card"
    :elevation="2"
    :class="{ 'inactive-property': !property.active }"
    @click="emit('view', property.id)"
  >
    <v-card-title class="text-truncate d-flex align-center">
      {{ property.name }}
      <v-chip
        class="ml-2"
        size="small"
        :color="activeStatusColor"
        :text-color="property.active ? 'white' : 'default'"
      >
        {{ property.active ? 'Active' : 'Inactive' }}
      </v-chip>
    </v-card-title>
    <v-card-text>
      <div class="address text-truncate mb-2">
        <v-icon icon="mdi-home" size="small" class="mr-1"></v-icon>
        {{ property.address }}
      </div>
      <div class="d-flex align-center mb-2">
        <v-icon icon="mdi-clock-outline" size="small" class="mr-1"></v-icon>
        <span>Cleaning: {{ formattedCleaningDuration }}</span>
      </div>
      <div class="d-flex align-center mb-2">
        <v-icon icon="mdi-tag-outline" size="small" class="mr-1"></v-icon>
        <v-chip
          size="x-small"
          :color="pricingTierColor"
          class="text-capitalize"
        >
          {{ property.pricing_tier }}
        </v-chip>
      </div>
      <div v-if="property.special_instructions" class="special-instructions mt-2">
        <v-tooltip location="bottom">
          <template v-slot:activator="{ props }">
            <div class="text-truncate" v-bind="props">
              <v-icon icon="mdi-information-outline" size="small" class="mr-1"></v-icon>
              {{ property.special_instructions }}
            </div>
          </template>
          <span>{{ property.special_instructions }}</span>
        </v-tooltip>
      </div>
    </v-card-text>
    <v-card-actions v-if="displayActions">
      <v-spacer></v-spacer>
      <v-btn
        variant="text"
        color="primary"
        size="small"
        @click.stop="emit('edit', property.id)"
        aria-label="Edit property"
      >
        <v-icon>mdi-pencil</v-icon>
        Edit
      </v-btn>
      <v-btn
        variant="text"
        color="error"
        size="small"
        @click.stop="emit('delete', property.id)"
        aria-label="Delete property"
      >
        <v-icon>mdi-delete</v-icon>
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
⋮----
{{ property.name }}
⋮----
{{ property.active ? 'Active' : 'Inactive' }}
⋮----
{{ property.address }}
⋮----
<span>Cleaning: {{ formattedCleaningDuration }}</span>
⋮----
{{ property.pricing_tier }}
⋮----
<template v-slot:activator="{ props }">
            <div class="text-truncate" v-bind="props">
              <v-icon icon="mdi-information-outline" size="small" class="mr-1"></v-icon>
              {{ property.special_instructions }}
            </div>
          </template>
⋮----
{{ property.special_instructions }}
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
// Format cleaning duration from minutes to hours and minutes
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
// Determine pricing tier color
const pricingTierColor = computed((): string => {
  const tierColors: Record<PricingTier, string> = {
    basic: 'grey',
    premium: 'primary',
    luxury: 'purple'
  };
  return tierColors[props.property.pricing_tier];
});
// Determine active status color
const activeStatusColor = computed((): string => {
  return props.property.active ? 'success' : 'error';
});
</script>
<style scoped>
.property-card {
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}
.property-card:hover {
  transform: translateY(-4px);
}
.inactive-property {
  opacity: 0.7;
}
.special-instructions {
  font-style: italic;
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
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
// Sample properties for demo
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
// Snackbar for demo actions
const snackbar = ref({
  show: false,
  text: '',
  color: 'info'
});
// Demo handlers
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

## File: src/components/dumb/TurnAlerts.vue
````vue
<template>
  <v-card class="turn-alerts" :elevation="3" :color="hasUrgentTurns ? 'error-lighten-4' : 'warning-lighten-4'" :class="{ 'has-urgent': hasUrgentTurns }">
    <v-card-title class="d-flex align-center">
      <v-icon :icon="hasUrgentTurns ? 'mdi-alert-circle' : 'mdi-clock-alert'" class="mr-2" :color="hasUrgentTurns ? 'error' : 'warning'"></v-icon>
      Turn Alerts
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
      ></v-btn>
    </v-card-title>
    <v-expand-transition>
      <div v-if="expanded">
        <v-card-text class="pt-0">
          <v-list v-if="bookings.length > 0" class="turn-list">
            <v-list-item 
              v-for="booking in limitedBookings" 
              :key="booking.id" 
              :value="booking.id"
              :border="true"
              class="mb-2 rounded turn-list-item"
              :class="booking.priority === 'urgent' ? 'urgent-turn' : 'high-turn'"
            >
              <template v-slot:prepend>
                <v-icon :icon="booking.priority === 'urgent' ? 'mdi-alert' : 'mdi-clock-fast'" :color="getPriorityColor(booking.priority)"></v-icon>
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
            <div v-if="props.bookings.length > props.limit" class="text-center mt-2">
              <v-btn variant="text" color="primary" size="small" @click="emit('view-all')">
                View all {{ props.bookings.length }} turns
              </v-btn>
            </div>
          </v-list>
          <div v-else class="text-center py-2">
            No urgent turn bookings at this time.
          </div>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>
⋮----
<template v-slot:prepend>
                <v-icon :icon="booking.priority === 'urgent' ? 'mdi-alert' : 'mdi-clock-fast'" :color="getPriorityColor(booking.priority)"></v-icon>
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
  // Sort by priority (urgent first) then by checkout date
  const sorted = [...props.bookings].sort((a, b) => {
    // Priority sort (urgent > high)
    if (a.priority !== b.priority) {
      return a.priority === 'urgent' ? -1 : 1;
    }
    // Then by checkout date (earlier first)
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
  border-left: 4px solid;
  border-color: var(--v-error-base);
}
.turn-alerts.has-urgent {
  animation: pulse 2s infinite;
}
.turn-list {
  background-color: transparent;
}
.turn-list-item {
  margin-bottom: 8px;
  transition: transform 0.2s;
}
.turn-list-item:hover {
  transform: translateY(-2px);
}
.urgent-turn {
  border-left: 3px solid var(--v-error-base) !important;
}
.high-turn {
  border-left: 3px solid var(--v-warning-base) !important;
}
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(244, 67, 54, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
  }
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
// Helper to create demo turns
function createTurn(priority: 'urgent' | 'high'): BookingWithMetadata {
  const now = new Date();
  const id = uuidv4();
  const propertyId = uuidv4();
  // Create checkout time (current time + 1-2 hours)
  const checkoutHours = priority === 'urgent' ? 1 : 2;
  const checkout = new Date(now.getTime() + (checkoutHours * 60 * 60 * 1000));
  // Create checkin time (checkout time + 3-5 hours)
  const checkinOffset = Math.floor(Math.random() * 2) + 3; // 3-5 hours
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
      duration: checkinOffset * 60 // minutes
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
// Add some initial demo data
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

## File: src/components/dumb/UpcomingCleanings.vue
````vue
<template>
  <v-card class="upcoming-cleanings" :elevation="3" :class="{ 'has-urgent': hasUrgentCleanings }">
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
          <!-- Time period expansion panels -->
          <v-expansion-panels v-model="openPanels" multiple>
            <!-- Today's cleanings -->
            <v-expansion-panel v-if="todayCleanings.length > 0">
              <v-expansion-panel-title>
                Today ({{ todayCleanings.length }})
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <!-- List of today's cleanings -->
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
            <!-- Tomorrow's cleanings -->
            <v-expansion-panel v-if="tomorrowCleanings.length > 0">
              <v-expansion-panel-title>
                Tomorrow ({{ tomorrowCleanings.length }})
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <!-- List of tomorrow's cleanings -->
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
            <!-- Upcoming cleanings -->
            <v-expansion-panel v-if="upcomingCleanings.length > 0">
              <v-expansion-panel-title>
                Upcoming ({{ upcomingCleanings.length }})
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <!-- List of upcoming cleanings grouped by date -->
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
<!-- Time period expansion panels -->
⋮----
<!-- Today's cleanings -->
⋮----
Today ({{ todayCleanings.length }})
⋮----
<!-- List of today's cleanings -->
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
<!-- Tomorrow's cleanings -->
⋮----
Tomorrow ({{ tomorrowCleanings.length }})
⋮----
<!-- List of tomorrow's cleanings -->
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
<!-- Upcoming cleanings -->
⋮----
Upcoming ({{ upcomingCleanings.length }})
⋮----
<!-- List of upcoming cleanings grouped by date -->
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
const openPanels = ref([0]); // Default open today's panel
function toggleExpanded() {
  expanded.value = !expanded.value;
  emit('toggle-expanded', expanded.value);
}
// Helper functions
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
// Check if any cleanings are urgent
const hasUrgentCleanings = computed((): boolean => {
  return props.bookings.some(booking => booking.priority === 'urgent');
});
// Computed properties for grouped cleanings
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
// Group upcoming cleanings by date
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
// Limited cleanings for display
const limitedTodayCleanings = computed((): BookingWithMetadata[] => {
  return todayCleanings.value.slice(0, props.limit);
});
const limitedTomorrowCleanings = computed((): BookingWithMetadata[] => {
  return tomorrowCleanings.value.slice(0, props.limit);
});
// Formatting functions
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
  border-left: 4px solid var(--v-primary-base);
}
.upcoming-cleanings.has-urgent {
  border-left-color: var(--v-error-base);
}
.cleaning-list {
  background-color: transparent;
}
.cleaning-list-item {
  margin-bottom: 8px;
  transition: transform 0.2s;
}
.cleaning-list-item:hover {
  transform: translateY(-2px);
}
.turn-booking {
  border-left: 3px solid var(--v-warning-base) !important;
}
.standard-booking {
  border-left: 3px solid var(--v-primary-base) !important;
}
.date-heading {
  font-weight: 500;
  color: var(--v-primary-darken-1);
  border-bottom: 1px solid var(--v-primary-lighten-3);
  padding-bottom: 4px;
}
</style>
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
// Theme integration
const theme = useTheme();
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);
// Convert bookings Map to FullCalendar events
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
// Dynamic color system based on booking type and status
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
  // Use a lighter text color for completed bookings
  return booking.status === 'completed' ? '#E0E0E0' : '#FFFFFF';
};
// Calendar configuration
const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  // View settings
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  // Event settings
  events: calendarEvents.value,
  eventDisplay: 'block',
  eventOverlap: false,
  eventResizableFromStart: true,
  // Interaction settings
  selectable: true,
  selectMirror: true,
  editable: true,
  droppable: true,
  // Date/time settings
  locale: 'en',
  timeZone: 'local',
  slotMinTime: '06:00:00',
  slotMaxTime: '22:00:00',
  slotDuration: '01:00:00',
  snapDuration: '00:30:00',
  // Appearance
  height: 'auto',
  aspectRatio: 1.8,
  eventBackgroundColor: theme.global.current.value.colors.primary,
  eventBorderColor: theme.global.current.value.colors.primary,
  eventTextColor: '#FFFFFF',
  // Custom styling based on theme
  themeSystem: 'standard',
  // Event handlers
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventDrop: handleEventDrop,
  eventResize: handleEventResize,
  // Loading state
  loading: handleLoading,
  // Custom rendering
  eventContent: renderEventContent,
  dayCellContent: renderDayCell,
  // Business hours (optional)
  businessHours: {
    daysOfWeek: [1, 2, 3, 4, 5, 6, 0], // Monday - Sunday
    startTime: '08:00',
    endTime: '18:00'
  },
  // Weekend styling
  weekends: true,
  // Month view specific
  dayMaxEvents: 3,
  moreLinkClick: 'popover',
  // Week/day view specific
  allDaySlot: false,
  nowIndicator: true,
  scrollTime: '08:00:00'
}));
// Event handlers
const handleDateSelect = (selectInfo: DateSelectArg): void => {
  emit('dateSelect', selectInfo);
  // Optionally auto-create booking
  emit('createBooking', {
    start: selectInfo.startStr,
    end: selectInfo.endStr
  });
  // Clear selection
  selectInfo.view.calendar.unselect();
};
const handleEventClick = (clickInfo: EventClickArg): void => {
  emit('eventClick', clickInfo);
};
const handleEventDrop = (dropInfo: EventDropArg): void => {
  const booking = dropInfo.event.extendedProps.booking as Booking;
  emit('eventDrop', dropInfo);
  emit('updateBooking', {
    id: booking.id,
    start: dropInfo.event.startStr,
    end: dropInfo.event.endStr || dropInfo.event.startStr
  });
};
const handleEventResize = (resizeInfo: any): void => {
  const booking = resizeInfo.event.extendedProps.booking as Booking;
  emit('updateBooking', {
    id: booking.id,
    start: resizeInfo.event.startStr,
    end: resizeInfo.event.endStr
  });
};
// Custom event rendering
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
// Programmatic calendar methods
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
// Watch for theme changes and update calendar
watch(() => theme.global.current.value.dark, () => {
  refreshEvents();
});
// Add new handler function after the other event handlers
const handleLoading = (isLoading: boolean): void => {
  // You can emit an event or handle loading state changes here
  console.log('Calendar loading state:', isLoading);
};
// Expose methods to parent
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
  --fc-button-hover-bg-color: rgb(var(--v-theme-primary-darken-1));
  --fc-button-active-bg-color: rgb(var(--v-theme-primary-darken-2));
  --fc-today-bg-color: rgb(var(--v-theme-primary), 0.1);
}
/* Turn booking highlighting */
.fc-event.booking-turn {
  font-weight: bold;
  border-width: 2px !important;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(244, 67, 54, 0); }
  100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }
}
/* Status-based styling */
.fc-event.status-pending {
  opacity: 0.8;
}
.fc-event.status-completed {
  opacity: 0.6;
  text-decoration: line-through;
}
/* Turn indicator in day cells */
.turn-indicator {
  background: #f44336;
  color: white;
  border-radius: 50%;
  padding: 1px 4px;
  font-size: 10px;
  margin-left: 4px;
  font-weight: bold;
}
/* Custom event content */
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

## File: src/components/smart/FullCalendarDemo.vue
````vue
<template>
  <div class="calendar-demo">
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4">
          <v-card-title>
            Calendar Demo
            <v-spacer></v-spacer>
            <v-btn 
              color="primary" 
              prepend-icon="mdi-plus"
              @click="createRandomBooking"
            >
              Add Random Booking
            </v-btn>
            <v-btn 
              class="ml-2" 
              color="secondary" 
              prepend-icon="mdi-calendar-today"
              @click="goToToday"
            >
              Today
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-select
                  v-model="currentView"
                  label="Calendar View"
                  :items="viewOptions"
                  @update:model-value="changeView"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-select
                  v-model="selectedPropertyId"
                  label="Filter by Property"
                  :items="propertyOptions"
                  @update:model-value="filterByProperty"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-checkbox
                  v-model="showTurnBookings"
                  label="Show Turn Bookings"
                  @update:model-value="refreshCalendar"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-checkbox
                  v-model="showStandardBookings"
                  label="Show Standard Bookings"
                  @update:model-value="refreshCalendar"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <FullCalendar
          ref="calendarRef"
          :bookings="filteredBookings"
          :properties="properties"
          @date-select="handleDateSelect"
          @event-click="handleEventClick"
          @event-drop="handleEventDrop"
          @create-booking="handleCreateBooking"
          @update-booking="handleUpdateBooking"
        />
      </v-col>
    </v-row>
    <!-- Booking Modal -->
    <v-dialog v-model="bookingDialogOpen" max-width="600px">
      <v-card>
        <v-card-title>
          {{ selectedBooking ? 'Edit Booking' : 'Create Booking' }}
        </v-card-title>
        <v-card-text>
          <v-select
            v-model="bookingForm.property_id"
            label="Property"
            :items="propertySelectItems"
          ></v-select>
          <v-text-field
            v-model="bookingForm.checkout_date"
            label="Checkout Date"
            type="datetime-local"
          ></v-text-field>
          <v-text-field
            v-model="bookingForm.checkin_date"
            label="Checkin Date"
            type="datetime-local"
          ></v-text-field>
          <v-select
            v-model="bookingForm.booking_type"
            label="Booking Type"
            :items="['turn', 'standard']"
            readonly
          ></v-select>
          <v-select
            v-model="bookingForm.status"
            label="Status"
            :items="['pending', 'scheduled', 'in_progress', 'completed', 'cancelled']"
          ></v-select>
          <v-text-field
            v-model.number="bookingForm.guest_count"
            label="Guest Count"
            type="number"
          ></v-text-field>
          <v-textarea
            v-model="bookingForm.notes"
            label="Notes"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="bookingDialogOpen = false">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="saveBooking">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
⋮----
<!-- Booking Modal -->
⋮----
{{ selectedBooking ? 'Edit Booking' : 'Create Booking' }}
⋮----
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import FullCalendar from './FullCalendar.vue';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import type { Booking, Property, BookingType, BookingStatus } from '@/types';
// Sample data
const properties = ref<Map<string, Property>>(new Map());
const bookings = ref<Map<string, Booking>>(new Map());
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);
// UI state
const currentView = ref('dayGridMonth');
const selectedPropertyId = ref<string | null>(null);
const showTurnBookings = ref(true);
const showStandardBookings = ref(true);
const bookingDialogOpen = ref(false);
const selectedBooking = ref<Booking | null>(null);
const bookingForm = ref<Partial<Booking>>({
  property_id: '',
  checkout_date: '',
  checkin_date: '',
  booking_type: 'standard',
  status: 'pending',
  guest_count: 1,
  notes: ''
});
// Computed properties
const propertiesArray = computed(() => Array.from(properties.value.values()));
const viewOptions = [
  { title: 'Month', value: 'dayGridMonth' },
  { title: 'Week', value: 'timeGridWeek' },
  { title: 'Day', value: 'timeGridDay' }
];
const propertyOptions = computed(() => [
  { title: 'All Properties', value: null },
  ...propertiesArray.value.map(p => ({ title: p.name, value: p.id }))
]);
const propertySelectItems = computed(() => 
  propertiesArray.value.map(p => ({
    title: p.name,
    value: p.id
  }))
);
const filteredBookings = computed(() => {
  let result = new Map(bookings.value);
  // Filter by property
  if (selectedPropertyId.value) {
    result = new Map(
      [...result].filter(([_, booking]) => booking.property_id === selectedPropertyId.value)
    );
  }
  // Filter by booking type
  if (!showTurnBookings.value || !showStandardBookings.value) {
    result = new Map(
      [...result].filter(([_, booking]) => {
        if (booking.booking_type === 'turn' && !showTurnBookings.value) return false;
        if (booking.booking_type === 'standard' && !showStandardBookings.value) return false;
        return true;
      })
    );
  }
  return result;
});
// Methods
const generateSampleData = () => {
  // Create sample properties
  const property1: Property = {
    id: 'prop-1',
    owner_id: 'owner-1',
    name: 'Beach House',
    address: '123 Ocean Ave',
    cleaning_duration: 180,
    pricing_tier: 'premium',
    active: true
  };
  const property2: Property = {
    id: 'prop-2',
    owner_id: 'owner-1',
    name: 'Mountain Cabin',
    address: '456 Pine Rd',
    cleaning_duration: 120,
    pricing_tier: 'basic',
    active: true
  };
  const property3: Property = {
    id: 'prop-3',
    owner_id: 'owner-2',
    name: 'Downtown Loft',
    address: '789 Main St',
    cleaning_duration: 90,
    special_instructions: 'Use special cleaner for hardwood floors',
    pricing_tier: 'luxury',
    active: true
  };
  properties.value.set(property1.id, property1);
  properties.value.set(property2.id, property2);
  properties.value.set(property3.id, property3);
  // Create sample bookings
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  // Generate a turn booking (same day checkout/checkin)
  const turnBooking: Booking = {
    id: 'booking-1',
    property_id: 'prop-1',
    owner_id: 'owner-1',
    checkout_date: new Date(today.setHours(11, 0, 0, 0)).toISOString(),
    checkin_date: new Date(today.setHours(15, 0, 0, 0)).toISOString(),
    booking_type: 'turn',
    status: 'pending',
    guest_count: 4,
    notes: 'High priority turn cleaning'
  };
  // Generate a standard booking
  const standardBooking: Booking = {
    id: 'booking-2',
    property_id: 'prop-2',
    owner_id: 'owner-1',
    checkout_date: tomorrow.toISOString(),
    checkin_date: new Date(tomorrow.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    booking_type: 'standard',
    status: 'scheduled',
    guest_count: 2,
    notes: 'Regular cleaning'
  };
  // Generate another booking
  const anotherBooking: Booking = {
    id: 'booking-3',
    property_id: 'prop-3',
    owner_id: 'owner-2',
    checkout_date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    checkin_date: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    booking_type: 'standard',
    status: 'pending',
    guest_count: 3
  };
  bookings.value.set(turnBooking.id, turnBooking);
  bookings.value.set(standardBooking.id, standardBooking);
  bookings.value.set(anotherBooking.id, anotherBooking);
};
const createRandomBooking = () => {
  // Get a random property
  const propertyIds = Array.from(properties.value.keys());
  const randomPropertyId = propertyIds[Math.floor(Math.random() * propertyIds.length)];
  // Generate random dates
  const today = new Date();
  const randomDayOffset = Math.floor(Math.random() * 30) - 15; // -15 to +15 days
  const checkout = new Date(today);
  checkout.setDate(checkout.getDate() + randomDayOffset);
  checkout.setHours(11, 0, 0, 0);
  let checkin;
  const isTurn = Math.random() > 0.7; // 30% chance of turn booking
  if (isTurn) {
    // Same day turn
    checkin = new Date(checkout);
    checkin.setHours(15, 0, 0, 0);
  } else {
    // Standard booking with 1-7 day gap
    const gapDays = Math.floor(Math.random() * 7) + 1;
    checkin = new Date(checkout);
    checkin.setDate(checkin.getDate() + gapDays);
    checkin.setHours(15, 0, 0, 0);
  }
  // Create new booking
  const newBooking: Booking = {
    id: uuidv4(),
    property_id: randomPropertyId,
    owner_id: properties.value.get(randomPropertyId)?.owner_id || 'owner-1',
    checkout_date: checkout.toISOString(),
    checkin_date: checkin.toISOString(),
    booking_type: isTurn ? 'turn' : 'standard',
    status: 'pending',
    guest_count: Math.floor(Math.random() * 6) + 1,
    notes: isTurn ? 'Random turn booking' : 'Random standard booking'
  };
  bookings.value.set(newBooking.id, newBooking);
};
const goToToday = () => {
  if (calendarRef.value) {
    calendarRef.value.goToDate(new Date());
  }
};
const changeView = () => {
  if (calendarRef.value) {
    calendarRef.value.changeView(currentView.value);
  }
};
const filterByProperty = () => {
  refreshCalendar();
};
const refreshCalendar = () => {
  if (calendarRef.value) {
    calendarRef.value.refreshEvents();
  }
};
// Event handlers
const handleDateSelect = (selectInfo: DateSelectArg) => {
  // Open booking modal with pre-filled dates
  bookingForm.value = {
    property_id: selectedPropertyId.value || propertiesArray.value[0].id,
    checkout_date: selectInfo.startStr,
    checkin_date: selectInfo.endStr,
    booking_type: 'standard',
    status: 'pending',
    guest_count: 2,
    notes: ''
  };
  // Determine if it's a turn booking
  const checkoutDate = new Date(selectInfo.startStr);
  const checkinDate = new Date(selectInfo.endStr);
  if (checkoutDate.toDateString() === checkinDate.toDateString()) {
    bookingForm.value.booking_type = 'turn';
  }
  selectedBooking.value = null;
  bookingDialogOpen.value = true;
};
const handleEventClick = (clickInfo: EventClickArg) => {
  const booking = clickInfo.event.extendedProps.booking as Booking;
  selectedBooking.value = booking;
  // Open booking modal with booking data
  bookingForm.value = {
    ...booking
  };
  bookingDialogOpen.value = true;
};
const handleEventDrop = (dropInfo: EventDropArg) => {
  const booking = dropInfo.event.extendedProps.booking as Booking;
  // Update booking dates
  const updatedBooking = {
    ...booking,
    checkout_date: dropInfo.event.startStr,
    checkin_date: dropInfo.event.endStr || dropInfo.event.startStr
  };
  // Determine booking type based on new dates
  const checkoutDate = new Date(updatedBooking.checkout_date);
  const checkinDate = new Date(updatedBooking.checkin_date);
  if (checkoutDate.toDateString() === checkinDate.toDateString()) {
    updatedBooking.booking_type = 'turn';
  } else {
    updatedBooking.booking_type = 'standard';
  }
  bookings.value.set(booking.id, updatedBooking);
};
const handleCreateBooking = (): void => {
  // This is called automatically when selecting a date range
  // But we're handling it manually in handleDateSelect above
};
const handleUpdateBooking = (data: { id: string; start: string; end: string }) => {
  const booking = bookings.value.get(data.id);
  if (booking) {
    const updatedBooking = {
      ...booking,
      checkout_date: data.start,
      checkin_date: data.end
    };
    // Determine booking type based on new dates
    const checkoutDate = new Date(updatedBooking.checkout_date);
    const checkinDate = new Date(updatedBooking.checkin_date);
    if (checkoutDate.toDateString() === checkinDate.toDateString()) {
      updatedBooking.booking_type = 'turn';
    } else {
      updatedBooking.booking_type = 'standard';
    }
    bookings.value.set(booking.id, updatedBooking);
  }
};
const saveBooking = () => {
  if (selectedBooking.value) {
    // Update existing booking
    const updatedBooking = {
      ...selectedBooking.value,
      ...bookingForm.value
    } as Booking;
    bookings.value.set(updatedBooking.id, updatedBooking);
  } else {
    // Create new booking
    const newBooking: Booking = {
      id: uuidv4(),
      property_id: bookingForm.value.property_id || propertiesArray.value[0].id,
      owner_id: properties.value.get(bookingForm.value.property_id || '')?.owner_id || 'owner-1',
      checkout_date: bookingForm.value.checkout_date || new Date().toISOString(),
      checkin_date: bookingForm.value.checkin_date || new Date().toISOString(),
      booking_type: bookingForm.value.booking_type as BookingType || 'standard',
      status: bookingForm.value.status as BookingStatus || 'pending',
      guest_count: bookingForm.value.guest_count,
      notes: bookingForm.value.notes
    };
    bookings.value.set(newBooking.id, newBooking);
  }
  bookingDialogOpen.value = false;
  refreshCalendar();
};
// Initialize
onMounted(() => {
  generateSampleData();
});
</script>
<style scoped>
.calendar-demo {
  width: 100%;
  height: 100%;
  padding: 16px;
}
</style>
````

## File: src/components/smart/Sidebar.vue
````vue
<template>
  <v-navigation-drawer class="sidebar" width="100%" elevation="3">
    <v-container class="py-2">
      <!-- Header -->
      <v-row class="mb-4">
        <v-col cols="12">
          <h2 class="text-h6 font-weight-bold">Property Cleaning</h2>
          <div class="text-subtitle-2 text-medium-emphasis">
            {{ formattedDate }}
          </div>
        </v-col>
      </v-row>
      <!-- Turn Alerts (if any) -->
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
      <!-- Upcoming Cleanings -->
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
      <!-- Property Filter -->
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
      <!-- Quick Actions -->
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
      <!-- Loading Overlay -->
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
<!-- Header -->
⋮----
{{ formattedDate }}
⋮----
<!-- Turn Alerts (if any) -->
⋮----
<!-- Upcoming Cleanings -->
⋮----
<!-- Property Filter -->
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
<!-- Quick Actions -->
⋮----
<!-- Loading Overlay -->
⋮----
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useUIStore } from '@/stores/ui';
import TurnAlerts from '@/components/dumb/TurnAlerts.vue';
import UpcomingCleanings from '@/components/dumb/UpcomingCleanings.vue';
// Import types
import type { Booking, Property, BookingWithMetadata } from '@/types';
// Define props with default values
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
// Define emits
interface Emits {
  (e: 'navigateToBooking', bookingId: string): void;
  (e: 'navigateToDate', date: Date): void;
  (e: 'filterByProperty', propertyId: string | null): void;
  (e: 'createBooking'): void;
  (e: 'createProperty'): void;
}
const emit = defineEmits<Emits>();
// Store connections
const uiStore = useUIStore();
// Local state - initialize from UI store
const selectedProperty = ref<string | null>(uiStore.selectedPropertyFilter || null);
// Computed properties
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
    return new Date().toISOString().split('T')[0]; // Fallback format
  }
});
// Convert inputs to proper Maps if they're not already
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
// Convert Maps to arrays for components that expect arrays
const todayTurnsArray = computed(() => 
  Array.from(todayTurnsMap.value.values())
);
const upcomingCleaningsArray = computed(() => 
  Array.from(upcomingCleaningsMap.value.values())
);
// Add metadata (priority) to bookings for the components
const todayBookingsWithMetadata = computed(() => {
  return todayTurnsArray.value.map(booking => {
    // Ensure the priority is one of the expected values: 'low' | 'normal' | 'high' | 'urgent'
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
    // Ensure the priority is one of the expected values: 'low' | 'normal' | 'high' | 'urgent'
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
// Format properties for v-select
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
// Methods
const handlePropertyFilterChange = (propertyId: string | null): void => {
  try {
    // Update UI store
    uiStore.setPropertyFilter(propertyId);
    // Emit to parent
    emit('filterByProperty', propertyId);
  } catch (error) {
    console.error('Error changing property filter:', error);
    // Could add UI notification here using the UI store
  }
};
const handleAssign = (bookingId: string): void => {
  try {
    // For now, just emit navigation event
    emit('navigateToBooking', bookingId);
    // Later this could open an assignment modal
  } catch (error) {
    console.error('Error handling assign:', error);
  }
};
const handleViewAll = (period: string): void => {
  try {
    // Could navigate to a filtered view of bookings
    const today = new Date();
    if (period === 'turns') {
      // Navigate to turn bookings
      emit('navigateToDate', today);
    } else if (period === 'today') {
      // Navigate to today's bookings
      emit('navigateToDate', today);
    } else if (period === 'tomorrow') {
      // Navigate to tomorrow's bookings
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      emit('navigateToDate', tomorrow);
    } else {
      // Period could be a date string
      try {
        const date = new Date(period);
        emit('navigateToDate', date);
      } catch {
        // If not a valid date, just navigate to today
        emit('navigateToDate', today);
      }
    }
  } catch (error) {
    console.error('Error handling view all:', error);
  }
};
const toggleUpcomingExpanded = (expanded: boolean): void => {
  // This method can be used if needed
  console.log('Upcoming cleanings expanded:', expanded);
};
// Watch for changes in the UI store's property filter
watch(() => uiStore.selectedPropertyFilter, (newPropertyId) => {
  selectedProperty.value = newPropertyId;
});
// Initialize from UI store on mount
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
/* Custom scrollbar for better UX */
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
/* Mobile optimizations */
@media (max-width: 960px) {
  .sidebar {
    width: 100% !important;
  }
}
</style>
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
// Demo data
const loading = ref(false);
const eventLog = ref<{ name: string, detail: string }[]>([]);
// Generate sample properties
const properties = ref<Property[]>([
  {
    id: '1',
    owner_id: 'owner1',
    name: 'Luxury Beach House',
    address: '123 Coastal Way',
    cleaning_duration: 180, // 3 hours
    special_instructions: 'Check pool filter',
    pricing_tier: 'luxury',
    active: true,
  },
  {
    id: '2',
    owner_id: 'owner1',
    name: 'Downtown Apartment',
    address: '456 Main Street',
    cleaning_duration: 120, // 2 hours
    pricing_tier: 'premium',
    active: true,
  },
  {
    id: '3',
    owner_id: 'owner2',
    name: 'Mountain Cabin',
    address: '789 Forest Road',
    cleaning_duration: 90, // 1.5 hours
    special_instructions: 'Restock firewood',
    pricing_tier: 'basic',
    active: true,
  },
]);
// Generate today's turn bookings
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
// Generate upcoming cleanings
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
// Event handlers
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
// UI control methods
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

## File: src/composables/useCalendarState.ts
````typescript
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
````

## File: src/composables/useProperties.ts
````typescript
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
````

## File: src/layouts/auth.vue
````vue
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
````

## File: src/layouts/default.vue
````vue
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
// 404 page component
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
// Admin page component
</script>
<style scoped>
.admin-page {
  padding: 1rem;
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
/* Additional page-specific styles can go here */
</style>
````

## File: src/pages/index.vue
````vue
<script setup lang="ts">
import Home from '@/components/smart/Home.vue'
</script>
<template>
  <v-app>
    <v-main>
      <Home />
    </v-main>
  </v-app>
</template>
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
// Properties page component
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
// URL and anon key will be replaced with actual values during deployment
````

## File: src/types/api.ts
````typescript
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
````

## File: src/types/booking.ts
````typescript
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
````

## File: src/types/index.ts
````typescript
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
````

## File: src/types/property.ts
````typescript
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
````

## File: src/types/user.ts
````typescript
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
````

## File: src/utils/businessLogic.ts
````typescript
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
// @ts-check
````

## File: src/__tests__/utils/test-utils.ts
````typescript
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
````

## File: src/components/dumb/UpcomingCleaningsDemo.vue
````vue
<template>
  <v-container>
    <h1 class="text-h4 mb-4">Upcoming Cleanings Demo</h1>
    <v-row>
      <v-col cols="12" md="8">
        <UpcomingCleanings 
          :bookings="sampleBookings"
          @view="handleView"
          @assign="handleAssign"
          @toggle-expanded="expanded = $event"
          @view-all="handleViewAll"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Demo Controls</v-card-title>
          <v-card-text>
            <v-slider
              v-model="bookingCount"
              label="Number of Bookings"
              min="0"
              max="30"
              step="1"
              thumb-label
              @update:model-value="generateSampleBookings"
            ></v-slider>
            <v-slider
              v-model="turnPercentage"
              label="Turn Percentage"
              min="0"
              max="100"
              step="5"
              thumb-label
              @update:model-value="generateSampleBookings"
            ></v-slider>
            <v-slider
              v-model="daysRange"
              label="Days Range"
              min="1"
              max="14"
              step="1"
              thumb-label
              @update:model-value="generateSampleBookings"
            ></v-slider>
          </v-card-text>
        </v-card>
        <v-card class="mt-4">
          <v-card-title>Event Log</v-card-title>
          <v-card-text>
            <v-list density="compact" lines="two">
              <v-list-item v-for="(event, index) in eventLog" :key="index">
                <v-list-item-title>{{ event.type }}</v-list-item-title>
                <v-list-item-subtitle>{{ event.details }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <v-btn 
              v-if="eventLog.length > 0" 
              block 
              variant="text" 
              color="error" 
              @click="eventLog = []"
            >
              Clear Log
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
⋮----
<v-list-item-title>{{ event.type }}</v-list-item-title>
<v-list-item-subtitle>{{ event.details }}</v-list-item-subtitle>
⋮----
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import UpcomingCleanings from './UpcomingCleanings.vue';
// Define BookingWithMetadata type inline to avoid import issues
interface BookingWithMetadata {
  id: string;
  property_id: string;
  owner_id: string;
  checkout_date: string;
  checkin_date: string;
  booking_type: 'standard' | 'turn';
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  guest_count?: number;
  notes?: string;
  assigned_cleaner_id?: string;
  created_at?: string;
  updated_at?: string;
  property_name?: string;
  cleaning_window?: {
    start: string;
    end: string;
    duration: number;
  };
  priority: 'low' | 'normal' | 'high' | 'urgent';
}
// Demo state
const expanded = ref(true);
const bookingCount = ref(15);
const turnPercentage = ref(30);
const daysRange = ref(7);
const sampleBookings = ref<BookingWithMetadata[]>([]);
const eventLog = ref<Array<{type: string, details: string}>>([]);
// Generate sample bookings with random dates and properties
function generateSampleBookings() {
  const bookings: BookingWithMetadata[] = [];
  const propertyNames = ['Ocean View Villa', 'Mountain Retreat', 'Downtown Loft', 'Suburban Home', 'Lake Cabin'];
  for (let i = 0; i < bookingCount.value; i++) {
    // Random date within the next X days (weighted towards earlier dates)
    const daysAhead = Math.floor(Math.random() * Math.random() * daysRange.value);
    const checkoutDate = new Date();
    checkoutDate.setDate(checkoutDate.getDate() + daysAhead);
    checkoutDate.setHours(9 + Math.floor(Math.random() * 6), 0, 0, 0); // Checkout between 9 AM and 3 PM
    // Determine if it's a turn booking (same day checkout/checkin)
    const isTurn = Math.random() * 100 < turnPercentage.value;
    const checkinDate = new Date(checkoutDate);
    if (isTurn) {
      // For turn bookings, checkin is same day, a few hours after checkout
      checkinDate.setHours(checkoutDate.getHours() + 3 + Math.floor(Math.random() * 5));
    } else {
      // For standard bookings, checkin is 1-3 days after checkout
      checkinDate.setDate(checkinDate.getDate() + 1 + Math.floor(Math.random() * 3));
      checkinDate.setHours(14 + Math.floor(Math.random() * 6), 0, 0, 0); // Checkin between 2 PM and 8 PM
    }
    // Random priority based on turn status and time window
    let priority: 'low' | 'normal' | 'high' | 'urgent';
    if (isTurn) {
      priority = Math.random() < 0.3 ? 'urgent' : 'high';
    } else {
      priority = Math.random() < 0.7 ? 'normal' : 'low';
    }
    // Random property
    const propertyName = propertyNames[Math.floor(Math.random() * propertyNames.length)];
    const propertyId = uuidv4();
    // Create booking
    const booking: BookingWithMetadata = {
      id: uuidv4(),
      property_id: propertyId,
      owner_id: uuidv4(),
      checkout_date: checkoutDate.toISOString(),
      checkin_date: checkinDate.toISOString(),
      booking_type: isTurn ? 'turn' : 'standard',
      status: Math.random() < 0.8 ? 'scheduled' : 'pending',
      property_name: `${propertyName} #${Math.floor(Math.random() * 100)}`,
      priority,
      cleaning_window: {
        start: checkoutDate.toISOString(),
        end: checkinDate.toISOString(),
        duration: Math.floor((checkinDate.getTime() - checkoutDate.getTime()) / (1000 * 60))
      }
    };
    bookings.push(booking);
  }
  sampleBookings.value = bookings;
}
// Event handlers
function handleView(id: string) {
  const booking = sampleBookings.value.find(b => b.id === id);
  eventLog.value.unshift({
    type: 'View Booking',
    details: `ID: ${id}, Property: ${booking?.property_name}`
  });
}
function handleAssign(id: string) {
  const booking = sampleBookings.value.find(b => b.id === id);
  eventLog.value.unshift({
    type: 'Assign Cleaner',
    details: `ID: ${id}, Property: ${booking?.property_name}`
  });
}
function handleViewAll(period: string) {
  eventLog.value.unshift({
    type: 'View All Cleanings',
    details: `Period: ${period}`
  });
}
// Generate initial bookings
onMounted(() => {
  generateSampleBookings();
});
</script>
````

## File: src/composables/useAuth.ts
````typescript
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
````

## File: src/composables/useBookings.ts
````typescript
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
````

## File: src/main.ts
````typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createVuetify } from 'vuetify'
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
import { useBookings } from '@/composables/useBookings';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
// Stores
const bookingStore = useBookingStore();
const propertyStore = usePropertyStore();
const uiStore = useUIStore();
// Composables
const { updateBooking } = useBookings();
// Event handlers
const handleDateSelect = (selectInfo: DateSelectArg): void => {
  // Open booking modal with pre-filled dates
  uiStore.openModal('eventModal', 'create', {
    checkout_date: selectInfo.startStr,
    checkin_date: selectInfo.endStr
  });
};
const handleEventClick = (clickInfo: EventClickArg): void => {
  // Get the booking data from the event
  const booking = clickInfo.event.extendedProps.booking;
  // Open booking modal in edit mode
  uiStore.openModal('eventModal', 'edit', booking);
};
const handleEventDrop = (dropInfo: EventDropArg): void => {
  // Get the booking data from the event
  const booking = dropInfo.event.extendedProps.booking;
  // Update booking dates
  updateBooking(booking.id, {
    checkout_date: dropInfo.event.startStr,
    checkin_date: dropInfo.event.endStr || dropInfo.event.startStr
  });
};
const handleCreateBooking = (): void => {
  // This is handled by handleDateSelect
};
const handleUpdateBooking = (data: { id: string; start: string; end: string }): void => {
  // Update booking with new dates
  updateBooking(data.id, {
    checkout_date: data.start,
    checkin_date: data.end
  });
};
// Initialize
onMounted(async () => {
  // Fetch bookings and properties
  await Promise.all([
    bookingStore.fetchBookings(),
    propertyStore.fetchProperties()
  ]);
});
</script>
<style scoped>
.calendar-page {
  padding: 1rem;
  height: calc(100vh - 64px); /* Adjust based on app bar height */
}
</style>
````

## File: src/plugins/vuetify.ts
````typescript
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
````

## File: src/stores/property.ts
````typescript
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
````

## File: src/stores/user.ts
````typescript
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
````

## File: src/types/env.d.ts
````typescript
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
````

## File: src/types/ui.ts
````typescript
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

## File: src/App.vue
````vue
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
````

## File: src/stores/booking.ts
````typescript
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
````

## File: vite.config.ts
````typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import path from 'path'
import vueDevTools from 'vite-plugin-vue-devtools'
// https://vitejs.dev/config/
⋮----
autoImport: true, // Enable auto-import for Vuetify components
````

## File: src/stores/ui.ts
````typescript
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
// Additional arbitrary filter values map
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
⋮----
// Keep selectedPropertyFilter in sync with filterState.propertyId
⋮----
function resetFilters()
⋮----
// Reset selectedPropertyFilter too
⋮----
// Also clear the filterValues map
⋮----
function setCalendarView(view: string)
function setPropertyFilter(propertyId: string | null)
⋮----
// Keep filterState.propertyId in sync with selectedPropertyFilter
⋮----
/**
   * Set an arbitrary filter value by key
   * This allows for flexible filtering not covered by the FilterState interface
   */
function setFilter(key: string, value: any)
⋮----
// Special case handling for known filter keys
⋮----
// Initialize dateRange if it doesn't exist
⋮----
end: value // Default to same as start if not set
⋮----
// Initialize dateRange if it doesn't exist
⋮----
start: value, // Default to same as end if not set
⋮----
/**
   * Get an arbitrary filter value by key
   * Returns undefined if the filter doesn't exist
   */
function getFilter(key: string): any
⋮----
// State
⋮----
// Getters
⋮----
// Actions
````

## File: src/router/index.ts
````typescript
import { createRouter, createWebHistory } from 'vue-router'
⋮----
// Demo routes
⋮----
// Auth routes
⋮----
// Catch-all route for 404
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
````
