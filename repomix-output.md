This file is a merged representation of a subset of the codebase, containing specifically included files and files not matching ignore patterns, combined into a single document by Repomix.
The content has been processed where comments have been removed, empty lines have been removed, content has been compressed (code blocks are separated by ⋮---- delimiter).

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
- Only files matching these patterns are included: src/components/dumb/owner/OwnerSidebar.vue, src/pages/admin/index.vue, src/components/smart/owner/OwnerVbar.vue, src/pages/owner/properties/index.vue, src/pages/owner/index.vue, src/pages/admin/index.vue, src/components/dumb/admin/AdminBookingModal.vue, src/layouts/admin.vue, src/components/smart/admin/AdminVbar.vue
- Files matching these patterns are excluded: /node_modules, src/__tests__, README.md, .git, docs/**, problemfix.md
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Code comments have been removed from supported file types
- Empty lines have been removed from all files
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
src/components/dumb/admin/AdminBookingModal.vue
src/components/dumb/owner/OwnerSidebar.vue
src/components/smart/admin/AdminVbar.vue
src/components/smart/owner/OwnerVbar.vue
src/layouts/admin.vue
src/pages/admin/index.vue
src/pages/owner/index.vue
src/pages/owner/properties/index.vue
```

# Files

## File: src/components/dumb/owner/OwnerSidebar.vue
```vue
<template>
  <v-navigation-drawer
    class="owner-sidebar"
    permanent
    :elevation="0"
    color="surface"
  >
    <v-container class="py-2">
      <v-row class="mb-4">
        <v-col cols="12">
          <h2 class="text-h6 font-weight-bold text-primary">
            My Properties
          </h2>
          <div class="text-subtitle-2 text-medium-emphasis">
            {{ formattedDate }}
          </div>
          <div class="mt-2">
            <v-chip
              size="small"
              color="primary"
              variant="outlined"
              class="mr-1 mb-1"
            >
              {{ ownerPropertiesCount }} Properties
            </v-chip>
            <v-chip
              size="small"
              color="secondary"
              variant="outlined"
              class="mr-1 mb-1"
            >
              {{ ownerBookingsCount }} Bookings
            </v-chip>
          </div>
        </v-col>
      </v-row>
      <v-row class="mb-4">
        <v-col cols="12">
          <v-card
            class="owner-navigation"
            variant="outlined"
          >
            <v-card-title class="d-flex align-center">
              <v-icon
                icon="mdi-menu"
                class="mr-2"
                color="primary"
              />
              Quick Navigation
            </v-card-title>
            <v-card-text class="pa-2">
              <v-list density="compact" nav>
                <v-list-item
                  prepend-icon="mdi-home-group"
                  title="My Properties"
                  subtitle="Manage your properties"
                  @click="handleNavigateToProperties"
                  color="primary"
                />
                <v-list-item
                  prepend-icon="mdi-clipboard-list"
                  title="My Bookings"
                  subtitle="View your cleaning schedule"
                  @click="handleNavigateToBookings"
                  color="primary"
                />
                <v-list-item
                  prepend-icon="mdi-calendar-month"
                  title="Calendar"
                  subtitle="Schedule and timeline"
                  @click="handleNavigateToCalendar"
                  color="primary"
                />
                <v-list-item
                  prepend-icon="mdi-cog"
                  title="Settings"
                  subtitle="Account preferences"
                  @click="handleNavigateToSettings"
                  color="primary"
                />
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="ownerTodayTurnsArray.length > 0">
        <v-col cols="12">
          <TurnAlerts
            :bookings="ownerTodayBookingsWithMetadata"
            :properties="ownerPropertiesMap"
            @view="$emit('navigateToBooking', $event)"
            @assign="handleViewBooking"
            @view-all="handleViewAll('turns')"
          />
        </v-col>
      </v-row>
      <v-row class="mb-4">
        <v-col cols="12">
          <UpcomingCleanings
            :bookings="ownerUpcomingBookingsWithMetadata"
            :properties="ownerPropertiesMap"
            @view="$emit('navigateToBooking', $event)"
            @assign="handleViewBooking"
            @view-all="handleViewAll($event)"
            @toggle-expanded="toggleUpcomingExpanded"
          />
        </v-col>
      </v-row>
      <v-row class="mb-4">
        <v-col cols="12">
          <v-card
            class="property-filter"
            variant="outlined"
          >
            <v-card-title class="d-flex align-center">
              <v-icon
                icon="mdi-filter-variant"
                class="mr-2"
                color="secondary"
              />
              Filter My Properties
            </v-card-title>
            <v-card-text>
              <v-select
                v-model="selectedProperty"
                :items="ownerPropertySelectItems"
                label="Select Property"
                clearable
                @update:model-value="handlePropertyFilterChange"
              >
                <template #prepend-item>
                  <v-list-item
                    title="All My Properties"
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
          <OwnerQuickActions
            :loading="loading"
            :disabled="false"
            :elevation="1"
            variant="outlined"
            @action="handleOwnerAction"
          />
        </v-col>
      </v-row>
      <v-overlay
        :model-value="loading"
        :contained="true"
        :persistent="true"
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
{{ ownerPropertiesCount }} Properties
⋮----
{{ ownerBookingsCount }} Bookings
⋮----
<template #prepend-item>
                  <v-list-item
                    title="All My Properties"
                    value=""
                    @click="selectedProperty = null"
                  />
                  <v-divider class="mt-2" />
                </template>
⋮----
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import TurnAlerts from '@/components/dumb/shared/TurnAlerts.vue';
import UpcomingCleanings from '@/components/dumb/shared/UpcomingCleanings.vue';
import OwnerQuickActions from '@/components/dumb/owner/OwnerQuickActions.vue';
import type { Booking, Property, BookingWithMetadata } from '@/types';
type OwnerActionType =
  | 'add-booking'
  | 'add-property'
  | 'view-calendar'
  | 'view-properties'
  | 'view-bookings'
  | 'contact-support';
import eventLogger from '@/composables/shared/useComponentEventLogger';
interface Props {
  todayTurns?: Map<string, Booking> | Booking[];
  upcomingCleanings?: Map<string, Booking> | Booking[];
  properties?: Map<string, Property> | Property[];
  loading?: boolean;
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
  (e: 'navigateToProperties'): void;
  (e: 'navigateToBookings'): void;
  (e: 'navigateToCalendar'): void;
  (e: 'navigateToSettings'): void;
  (e: 'filterByProperty', propertyId: string | null): void;
  (e: 'createBooking'): void;
  (e: 'createProperty'): void;
}
const emit = defineEmits<Emits>();
const uiStore = useUIStore();
const authStore = useAuthStore();
const selectedProperty = ref<string | null>(uiStore.selectedPropertyFilter || null);
const handleNavigateToProperties = (): void => {
  try {
    eventLogger.logEvent(
      'OwnerSidebar',
      'HomeOwner',
      'navigateToProperties',
      null,
      'emit'
    );
    emit('navigateToProperties');
  } catch (error) {
    console.error('Error navigating to properties:', error);
  }
};
const handleNavigateToBookings = (): void => {
  try {
    eventLogger.logEvent(
      'OwnerSidebar',
      'HomeOwner',
      'navigateToBookings',
      null,
      'emit'
    );
    emit('navigateToBookings');
  } catch (error) {
    console.error('Error navigating to bookings:', error);
  }
};
const handleNavigateToCalendar = (): void => {
  try {
    eventLogger.logEvent(
      'OwnerSidebar',
      'HomeOwner',
      'navigateToCalendar',
      null,
      'emit'
    );
    emit('navigateToCalendar');
  } catch (error) {
    console.error('Error navigating to calendar:', error);
  }
};
const handleNavigateToSettings = (): void => {
  try {
    eventLogger.logEvent(
      'OwnerSidebar',
      'HomeOwner',
      'navigateToSettings',
      null,
      'emit'
    );
    emit('navigateToSettings');
  } catch (error) {
    console.error('Error navigating to settings:', error);
  }
};
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
const currentUserId = computed(() => authStore.user?.id || '1');
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
const ownerPropertiesMap = computed(() => {
  const ownerMap = new Map<string, Property>();
  propertiesMap.value.forEach((property, id) => {
    if (property.owner_id === currentUserId.value) {
      ownerMap.set(id, property);
    }
  });
  return ownerMap;
});
const ownerTodayTurnsMap = computed(() => {
  const ownerMap = new Map<string, Booking>();
  todayTurnsMap.value.forEach((booking, id) => {
    if (booking.owner_id === currentUserId.value) {
      ownerMap.set(id, booking);
    }
  });
  return ownerMap;
});
const ownerUpcomingCleaningsMap = computed(() => {
  const ownerMap = new Map<string, Booking>();
  upcomingCleaningsMap.value.forEach((booking, id) => {
    if (booking.owner_id === currentUserId.value) {
      ownerMap.set(id, booking);
    }
  });
  return ownerMap;
});
const ownerTodayTurnsArray = computed(() =>
  Array.from(ownerTodayTurnsMap.value.values())
);
const ownerUpcomingCleaningsArray = computed(() =>
  Array.from(ownerUpcomingCleaningsMap.value.values())
);
const ownerPropertiesCount = computed(() => ownerPropertiesMap.value.size);
const ownerBookingsCount = computed(() =>
  ownerTodayTurnsArray.value.length + ownerUpcomingCleaningsArray.value.length
);
const ownerTodayBookingsWithMetadata = computed(() => {
  return ownerTodayTurnsArray.value.map(booking => {
    const priority: 'low' | 'normal' | 'high' | 'urgent' = 'high';
    return {
      ...booking,
      priority,
      property_name: ownerPropertiesMap.value.get(booking.property_id)?.name || `Property ${booking.property_id.substring(0, 8)}`,
      cleaning_window: {
        start: booking.checkout_date,
        end: booking.checkin_date,
        duration: ownerPropertiesMap.value.get(booking.property_id)?.cleaning_duration || 120
      }
    } as BookingWithMetadata;
  });
});
const ownerUpcomingBookingsWithMetadata = computed(() => {
  return ownerUpcomingCleaningsArray.value.map(booking => {
    const priority: 'low' | 'normal' | 'high' | 'urgent' =
      booking.booking_type === 'turn' ? 'high' : 'normal';
    return {
      ...booking,
      priority,
      property_name: ownerPropertiesMap.value.get(booking.property_id)?.name || `Property ${booking.property_id.substring(0, 8)}`,
      cleaning_window: {
        start: booking.checkout_date,
        end: booking.checkin_date,
        duration: ownerPropertiesMap.value.get(booking.property_id)?.cleaning_duration || 120
      }
    } as BookingWithMetadata;
  });
});
const ownerPropertySelectItems = computed(() => {
  try {
    return Array.from(ownerPropertiesMap.value.values())
      .filter(property => property && property.id && property.name)
      .map(property => ({
        title: property.name,
        value: property.id,
      }));
  } catch (error) {
    console.error('Error creating owner property select items:', error);
    return [];
  }
});
const handlePropertyFilterChange = (propertyId: string | null): void => {
  try {
    uiStore.setPropertyFilter(propertyId);
    eventLogger.logEvent(
      'OwnerSidebar',
      'HomeOwner',
      'filterByProperty',
      propertyId,
      'emit'
    );
    emit('filterByProperty', propertyId);
  } catch (error) {
    console.error('Error changing property filter:', error);
  }
};
const handleOwnerAction = (actionType: OwnerActionType): void => {
  try {
    eventLogger.logEvent(
      'OwnerSidebar',
      'OwnerQuickActions',
      'action',
      actionType,
      'receive'
    );
    switch (actionType) {
      case 'add-booking':
        emit('createBooking');
        break;
      case 'add-property':
        emit('createProperty');
        break;
      case 'view-calendar':
        handleNavigateToCalendar();
        break;
      case 'view-properties':
        handleNavigateToProperties();
        break;
      case 'view-bookings':
        handleNavigateToBookings();
        break;
      case 'contact-support':
        console.log('Contact support action triggered');
        break;
      default:
        console.warn('Unknown owner action type:', actionType);
    }
  } catch (error) {
    console.error('Error handling owner action:', error);
  }
};
const handleViewBooking = (bookingId: string): void => {
  try {
    eventLogger.logEvent(
      'OwnerSidebar',
      'HomeOwner',
      'navigateToBooking',
      bookingId,
      'emit'
    );
    emit('navigateToBooking', bookingId);
  } catch (error) {
    console.error('Error handling view booking:', error);
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
      'OwnerSidebar',
      'HomeOwner',
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
  console.log('Owner upcoming cleanings expanded:', expanded);
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
.owner-sidebar {
  height: 100%;
  overflow-y: auto;
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
  .owner-sidebar {
    width: 100% !important;
  }
}
.owner-navigation .v-card-title {
  color: rgb(var(--v-theme-primary));
}
.property-filter .v-card-title {
  color: rgb(var(--v-theme-secondary));
}
.owner-navigation .v-list-item {
  margin-bottom: 4px;
  border-radius: 8px;
}
.owner-navigation .v-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.08);
}
.owner-navigation {
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
}
.property-filter {
  border: 1px solid rgba(var(--v-theme-secondary), 0.2);
}
</style>
```

## File: src/components/smart/admin/AdminVbar.vue
```vue
<template>
  <v-app-bar
    app
    color="surface"
    elevation="2"
    class="admin-app-bar"
  >
    <v-app-bar-nav-icon @click="toggleDrawer" />
    <v-spacer />
    <div
      v-if="mdAndUp"
      class="d-flex align-center mr-4"
    >
      <v-btn
        to="/admin"
        variant="text"
        prepend-icon="mdi-view-dashboard"
        class="mr-2"
      >
        Dashboard
      </v-btn>
      <v-btn
        to="/admin/schedule"
        variant="text"
        prepend-icon="mdi-calendar-clock"
        class="mr-2"
      >
        Schedule
      </v-btn>
      <v-btn
        to="/admin/cleaners"
        variant="text"
        prepend-icon="mdi-account-hard-hat"
        class="mr-2"
      >
        Cleaners
      </v-btn>
      <v-btn
        to="/admin/properties"
        variant="text"
        prepend-icon="mdi-home-group"
        class="mr-2"
      >
        Properties
      </v-btn>
      <v-btn
        to="/admin/reports"
        variant="text"
        prepend-icon="mdi-chart-line"
        class="mr-4"
      >
        Reports
      </v-btn>
    </div>
    <ThemePicker />
    <v-menu
      location="bottom end"
      offset="5"
    >
      <template #activator="{ props: menuProps }">
        <v-btn
          icon
          v-bind="menuProps"
        >
          <v-avatar size="36">
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
        </v-btn>
      </template>
      <v-list min-width="200">
        <v-list-subheader>Admin Options</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-account-outline"
          title="Profile"
        />
        <v-list-item
          prepend-icon="mdi-cog-outline"
          title="System Settings"
        />
        <v-list-item
          to="/"
          prepend-icon="mdi-home"
          title="Owner View"
        />
        <v-divider class="my-2" />
        <v-list-item
          prepend-icon="mdi-logout"
          title="Logout"
          color="error"
          @click="logout"
        />
      </v-list>
      <v-divider class="my-2" />
    </v-menu>
  </v-app-bar>
</template>
⋮----
<template #activator="{ props: menuProps }">
        <v-btn
          icon
          v-bind="menuProps"
        >
          <v-avatar size="36">
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
        </v-btn>
      </template>
⋮----
<script setup lang="ts">
  import ThemePicker from '@/components/dumb/shared/ThemePicker.vue';
  import { useRouter } from 'vue-router';
  const router = useRouter();
  const navigateToHome = () => {
    router.push('/');
  };
</script>
<style scoped>
</style>
```

## File: src/components/smart/owner/OwnerVbar.vue
```vue
<template>
  <v-app-bar
    app
    color="surface"
    elevation="1"
    class="border-b"
  >
    <v-app-bar-nav-icon />
    <v-app-bar-title class="font-weight-medium">
      Property Cleaning Scheduler
    </v-app-bar-title>
    <v-spacer />
    <ThemePicker />
    <v-menu
      location="bottom end"
      offset="5"
    >
      <template #activator="{ props: menuProps }">
        <v-btn
          icon
          v-bind="menuProps"
          class="ml-2"
        >
          <v-avatar size="36">
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
        </v-btn>
        <v-btn
          v-bind="menuProps"
          class="ml-2"
          color="primary"
          variant="outlined"
          size="small"
          prepend-icon="mdi-home-outline"
          title="Home"
          @click="navigateToHome"
        >
          <v-avatar size="36">
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
        </v-btn>
      </template>
      <v-list min-width="200">
        <v-list-subheader>User Options</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-account-outline"
          title="Profile"
        />
        <v-list-item
          prepend-icon="mdi-cog-outline"
          title="Settings"
        />
        <v-divider class="my-2" />
        <v-list-item
          prepend-icon="mdi-logout"
          title="Logout"
          color="error"
        />
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
⋮----
<template #activator="{ props: menuProps }">
        <v-btn
          icon
          v-bind="menuProps"
          class="ml-2"
        >
          <v-avatar size="36">
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
        </v-btn>
        <v-btn
          v-bind="menuProps"
          class="ml-2"
          color="primary"
          variant="outlined"
          size="small"
          prepend-icon="mdi-home-outline"
          title="Home"
          @click="navigateToHome"
        >
          <v-avatar size="36">
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
        </v-btn>
      </template>
⋮----
<script setup lang="ts">
  import ThemePicker from '@/components/dumb/shared/ThemePicker.vue';
  import { useRouter } from 'vue-router';
  const router = useRouter();
  const navigateToHome = () => {
    router.push('/');
  };
</script>
<style scoped>
</style>
```

## File: src/pages/owner/properties/index.vue
```vue
<template>
  <div class="owner-properties-page">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <div class="d-flex justify-space-between align-center mb-4">
            <h1 class="text-h4">My Properties</h1>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="handleAddProperty"
            >
              Add Property
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row class="mb-4">
        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="text-h6">{{ ownerProperties.length }}</div>
              <div class="text-caption text-medium-emphasis">Total Properties</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="text-h6">{{ activeProperties.length }}</div>
              <div class="text-caption text-medium-emphasis">Active Properties</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="text-h6">{{ ownerBookings.length }}</div>
              <div class="text-caption text-medium-emphasis">Total Bookings</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="text-h6">{{ todayTurns.length }}</div>
              <div class="text-caption text-medium-emphasis">Today's Turns</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="property in ownerProperties"
          :key="property.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <PropertyCard
            :property="property"
            @edit="handleEditProperty"
            @delete="handleDeleteProperty"
          />
        </v-col>
      </v-row>
      <v-row v-if="ownerProperties.length === 0">
        <v-col cols="12" class="text-center py-8">
          <v-icon size="64" color="grey-lighten-1" class="mb-4">
            mdi-home-outline
          </v-icon>
          <h3 class="text-h6 mb-2">No Properties Yet</h3>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Add your first property to start managing bookings and cleanings.
          </p>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="handleAddProperty"
          >
            Add Your First Property
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
⋮----
<div class="text-h6">{{ ownerProperties.length }}</div>
⋮----
<div class="text-h6">{{ activeProperties.length }}</div>
⋮----
<div class="text-h6">{{ ownerBookings.length }}</div>
⋮----
<div class="text-h6">{{ todayTurns.length }}</div>
⋮----
<script setup lang="ts">
import { onMounted } from 'vue';
import PropertyCard from '@/components/dumb/shared/PropertyCard.vue';
import { useOwnerProperties } from '@/composables/owner/useOwnerProperties';
import { useOwnerBookings } from '@/composables/owner/useOwnerBookings';
import { useUIStore } from '@/stores/ui';
import type { Property } from '@/types';
defineOptions({
  name: 'OwnerPropertiesPage'
});
const {
  myProperties: ownerProperties,
  myActiveProperties: activeProperties,
  fetchMyProperties,
  deleteMyProperty
} = useOwnerProperties();
const {
  myBookings: ownerBookings,
  myTodayTurns: todayTurns,
  fetchMyBookings
} = useOwnerBookings();
const uiStore = useUIStore();
const handleAddProperty = (): void => {
  uiStore.openModal('propertyModal', 'create');
};
const handleEditProperty = (property: Property): void => {
  uiStore.openModal('propertyModal', 'edit', property);
};
const handleDeleteProperty = async (property: Property): Promise<void> => {
  const confirmed = await uiStore.showConfirmation(
    'Delete Property',
    `Are you sure you want to delete "${property.name}"? This action cannot be undone.`,
    'Delete',
    'error'
  );
  if (confirmed) {
    try {
      await deleteMyProperty(property.id);
      uiStore.showNotification('Property deleted successfully', 'success');
    } catch (error) {
      uiStore.showNotification('Failed to delete property', 'error');
    }
  }
};
onMounted(async () => {
  await Promise.all([
    fetchMyProperties(),
    fetchMyBookings()
  ]);
});
</script>
<style scoped>
.owner-properties-page {
  padding: 1rem;
  min-height: calc(100vh - 64px);
}
.v-card {
  height: 100%;
}
</style>
```

## File: src/components/dumb/admin/AdminBookingModal.vue
```vue
<template>
  <v-dialog
    v-model="isOpen"
    max-width="900px"
    persistent
    @keydown.esc="handleClose"
  >
    <v-card>
      <v-card-title class="text-h5 pb-2 d-flex align-center">
        <div class="d-flex align-center">
          {{ formTitle }}
          <v-chip
            v-if="booking?.booking_type === 'turn'"
            color="error"
            size="small"
            class="ml-2"
          >
            URGENT TURN
          </v-chip>
          <v-chip
            v-if="booking?.status"
            :color="getStatusColor(booking.status)"
            size="small"
            class="ml-2"
          >
            {{ booking.status.toUpperCase() }}
          </v-chip>
        </div>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="handleClose"
        />
      </v-card-title>
      <v-divider />
      <v-card-text class="pa-0">
        <v-container>
          <v-tabs
            v-model="activeTab"
            bg-color="transparent"
            class="mb-4"
          >
            <v-tab value="details">
              <v-icon start>mdi-pencil</v-icon>
              Edit Details
            </v-tab>
            <v-tab value="cleaner" :disabled="!booking">
              <v-icon start>mdi-account-hard-hat</v-icon>
              Assign Cleaner
            </v-tab>
            <v-tab value="status" :disabled="!booking">
              <v-icon start>mdi-check-circle</v-icon>
              Update Status
            </v-tab>
            <v-tab value="history" :disabled="!booking">
              <v-icon start>mdi-history</v-icon>
              View History
            </v-tab>
            <v-tab value="reports" :disabled="!booking">
              <v-icon start>mdi-chart-line</v-icon>
              Generate Report
            </v-tab>
          </v-tabs>
          <v-tabs-window v-model="activeTab">
            <v-tabs-window-item value="details">
              <AdminBookingForm
                v-model="showBookingForm"
                :mode="mode === 'create' ? 'create' : 'edit'"
                :booking="booking"
                :properties="allProperties"
                :cleaners="allCleaners"
                :loading="loading"
                @submit="handleBookingSubmit"
                @delete="handleBookingDelete"
                @assign-cleaner="handleCleanerAssignFromForm"
                @mark-complete="handleMarkComplete"
              />
            </v-tabs-window-item>
            <v-tabs-window-item value="cleaner">
              <CleanerAssignmentPanel
                v-if="booking"
                :booking="booking"
                :cleaners="allCleaners"
                :loading="loading"
                @assign="handleCleanerAssign"
                @unassign="handleCleanerUnassign"
              />
            </v-tabs-window-item>
            <v-tabs-window-item value="status">
              <StatusManagementPanel
                v-if="booking"
                :booking="booking"
                :loading="loading"
                @status-change="handleStatusChange"
                @add-note="handleAddNote"
              />
            </v-tabs-window-item>
            <v-tabs-window-item value="history">
              <BookingHistoryPanel
                v-if="booking"
                :booking="booking"
              />
            </v-tabs-window-item>
            <v-tabs-window-item value="reports">
              <BookingReportsPanel
                v-if="booking"
                :booking="booking"
                @generate-report="handleGenerateReport"
              />
            </v-tabs-window-item>
          </v-tabs-window>
        </v-container>
      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-4">
        <v-btn
          color="grey-darken-1"
          variant="text"
          :disabled="loading"
          @click="handleClose"
        >
          Close
        </v-btn>
        <v-spacer />
        <v-btn
          v-if="booking && booking.status === 'pending'"
          color="primary"
          variant="tonal"
          :loading="loading"
          @click="handleQuickSchedule"
        >
          <v-icon start>mdi-calendar-check</v-icon>
          Quick Schedule
        </v-btn>
        <v-btn
          v-if="booking && booking.booking_type === 'turn'"
          color="error"
          variant="tonal"
          :loading="loading"
          @click="handleUrgentAssign"
        >
          <v-icon start>mdi-alert</v-icon>
          Urgent Assign
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
⋮----
{{ formTitle }}
⋮----
{{ booking.status.toUpperCase() }}
⋮----
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useAdminBookings } from '@/composables/admin/useAdminBookings';
import { useAdminProperties } from '@/composables/admin/useAdminProperties';
import { useCleanerManagement } from '@/composables/admin/useCleanerManagement';
import { useUIStore } from '@/stores/ui';
import AdminBookingForm from '@/components/dumb/admin/AdminBookingForm.vue';
import CleanerAssignmentPanel from '@/components/dumb/admin/CleanerAssignmentPanel.vue';
import StatusManagementPanel from '@/components/dumb/admin/StatusManagementPanel.vue';
import BookingHistoryPanel from '@/components/dumb/admin/BookingHistoryPanel.vue';
import BookingReportsPanel from '@/components/dumb/admin/BookingReportsPanel.vue';
import type { Booking, BookingFormData, BookingStatus } from '@/types';
interface Props {
  open?: boolean;
  mode?: 'create' | 'admin-edit' | 'edit' | 'view';
  booking?: Booking | null;
  availableActions?: string[];
}
interface Emits {
  (e: 'close'): void;
  (e: 'booking-updated', booking: Booking): void;
  (e: 'booking-deleted', bookingId: string): void;
  (e: 'cleaner-assigned', data: { bookingId: string; cleanerId: string }): void;
  (e: 'status-changed', data: { bookingId: string; status: BookingStatus }): void;
}
const props = withDefaults(defineProps<Props>(), {
  open: false,
  mode: 'admin-edit',
  booking: null,
  availableActions: () => ['edit-details', 'assign-cleaner', 'update-status', 'view-history']
});
const emit = defineEmits<Emits>();
const uiStore = useUIStore();
const { updateBooking, deleteBooking } = useAdminBookings();
const { allProperties } = useAdminProperties();
const { allCleaners, assignCleanerToBooking } = useCleanerManagement();
const loading = ref<boolean>(false);
const activeTab = ref<string>('details');
const showBookingForm = ref<boolean>(true);
const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => {
    if (!value) emit('close');
  }
});
const formTitle = computed((): string => {
  if (props.mode === 'create') {
    return 'Create New Booking';
  }
  if (props.mode === 'admin-edit') {
    return `Admin Edit: Booking #${props.booking?.id?.slice(-6) || 'New'}`;
  }
  return 'Edit Booking';
});
function getStatusColor(status: BookingStatus): string {
  const colors = {
    pending: 'orange',
    scheduled: 'blue',
    in_progress: 'purple',
    completed: 'green',
    cancelled: 'red'
  };
  return colors[status] || 'grey';
}
async function handleBookingSubmit(bookingData: BookingFormData): Promise<void> {
  loading.value = true;
  try {
    if (props.mode === 'create') {
      console.log('Creating new booking:', bookingData);
    } else if (props.booking) {
      const updated = await updateBooking(props.booking.id, bookingData);
      if (updated) {
        emit('booking-updated', updated);
        uiStore.addNotification('success', 'Booking Updated', 'Booking has been successfully updated.');
      }
    }
  } catch (error) {
    console.error('Error saving booking:', error);
    uiStore.addNotification('error', 'Save Failed', 'Failed to save booking changes.');
  } finally {
    loading.value = false;
  }
}
async function handleBookingDelete(): Promise<void> {
  if (!props.booking) return;
  loading.value = true;
  try {
    const success = await deleteBooking(props.booking.id);
    if (success) {
      emit('booking-deleted', props.booking.id);
      uiStore.addNotification('success', 'Booking Deleted', 'Booking has been successfully deleted.');
      handleClose();
    }
  } catch (error) {
    console.error('Error deleting booking:', error);
    uiStore.addNotification('error', 'Delete Failed', 'Failed to delete booking.');
  } finally {
    loading.value = false;
  }
}
async function handleCleanerAssign(data: { bookingId: string; cleanerId: string }): Promise<void> {
  loading.value = true;
  try {
    const success = await assignCleanerToBooking(data.cleanerId, data.bookingId);
    if (success) {
      emit('cleaner-assigned', data);
      uiStore.addNotification('success', 'Cleaner Assigned', 'Cleaner has been successfully assigned.');
    }
  } catch (error) {
    console.error('Error assigning cleaner:', error);
    uiStore.addNotification('error', 'Assignment Failed', 'Failed to assign cleaner.');
  } finally {
    loading.value = false;
  }
}
async function handleCleanerUnassign(bookingId: string): Promise<void> {
  loading.value = true;
  try {
    const success = await unassignCleaner(bookingId);
    if (success) {
      uiStore.addNotification('success', 'Cleaner Unassigned', 'Cleaner has been unassigned from booking.');
    }
  } catch (error) {
    console.error('Error unassigning cleaner:', error);
    uiStore.addNotification('error', 'Unassign Failed', 'Failed to unassign cleaner.');
  } finally {
    loading.value = false;
  }
}
async function handleStatusChange(data: { bookingId: string; status: BookingStatus }): Promise<void> {
  loading.value = true;
  try {
    emit('status-changed', data);
    uiStore.addNotification('success', 'Status Updated', `Booking status changed to ${data.status}.`);
  } catch (error) {
    console.error('Error updating status:', error);
    uiStore.addNotification('error', 'Status Update Failed', 'Failed to update booking status.');
  } finally {
    loading.value = false;
  }
}
function handleAddNote(note: string): void {
  console.log('Adding note:', note);
  uiStore.addNotification('info', 'Note Added', 'Note has been added to booking.');
}
function handleMarkComplete(): void {
  if (props.booking) {
    handleStatusChange({ bookingId: props.booking.id, status: 'completed' });
  }
}
function handleGenerateReport(reportType: string): void {
  console.log('Generating report:', reportType);
  uiStore.addNotification('info', 'Report Generated', `${reportType} report has been generated.`);
}
async function handleQuickSchedule(): Promise<void> {
  if (props.booking) {
    await handleStatusChange({ bookingId: props.booking.id, status: 'scheduled' });
  }
}
async function handleUrgentAssign(): Promise<void> {
  if (props.booking) {
    uiStore.addNotification('info', 'Urgent Assignment', 'Initiating urgent cleaner assignment...');
  }
}
function handleClose(): void {
  activeTab.value = 'details';
  emit('close');
}
watch(() => props.open, (newValue) => {
  if (newValue) {
    activeTab.value = 'details';
    showBookingForm.value = true;
  }
});
watch(() => props.availableActions, (newActions) => {
  if (newActions && newActions.length > 0) {
    if (newActions.includes('edit-details')) {
      activeTab.value = 'details';
    } else if (newActions.includes('assign-cleaner')) {
      activeTab.value = 'cleaner';
    } else if (newActions.includes('update-status')) {
      activeTab.value = 'status';
    }
  }
});
</script>
<style scoped>
.v-tabs {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.v-tab {
  min-width: 140px;
}
.v-card-actions {
  background-color: rgb(var(--v-theme-surface));
}
</style>
```

## File: src/pages/owner/index.vue
```vue
<template>
  <div class="home-owner-container">
    <v-row
      no-gutters
      class="fill-height"
    >
      <v-col
        cols="12"
        lg="3"
        xl="2"
        class="sidebar-column"
        :class="{ 'mobile-hidden': !sidebarOpen }"
      >
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
              class="mr-4"
              @click="toggleSidebar"
            />
            <div class="d-flex align-center">
              <v-btn
                icon="mdi-arrow-left"
                variant="text"
                class="mr-2"
                @click="handlePrevious"
              />
              <v-btn
                variant="outlined"
                class="mr-2"
                @click="handleGoToday"
              >
                Today
              </v-btn>
              <v-btn
                icon="mdi-arrow-right"
                variant="text"
                class="mr-4"
                @click="handleNext"
              />
              <div class="text-h6">
                {{ formattedDate }}
              </div>
              <v-spacer />
              <v-btn
                color="primary"
                variant="outlined"
                prepend-icon="mdi-plus"
                class="mr-2"
                @click="handleCreateProperty"
              >
                Add Property
              </v-btn>
              <v-btn
                color="primary"
                prepend-icon="mdi-calendar-plus"
                class="mr-4"
                @click="handleCreateBooking"
              >
                Add Booking
              </v-btn>
              <v-btn-toggle
                v-model="currentView"
                mandatory
                class="ml-4"
              >
                <v-btn value="dayGridMonth">
                  Month
                </v-btn>
                <v-btn value="timeGridWeek">
                  Week
                </v-btn>
                <v-btn value="timeGridDay">
                  Day
                </v-btn>
              </v-btn-toggle>
            </div>
          </div>
        </v-col>
      </v-col>
    </v-row>
    <BookingModal
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
{{ formattedDate }}
⋮----
<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useDisplay } from 'vuetify';
import OwnerSidebar from '../../components/dumb/owner/OwnerSidebar.vue';
import FullCalendar from '../FullCalendar.vue';
import BookingModal from '@/components/dumb/BookingModal.vue';
import PropertyModal from '@/components/dumb/PropertyModal.vue';
import ConfirmationDialog from '@/components/dumb/shared/ConfirmationDialog.vue';
import { usePropertyStore } from '@/stores/property';
import { useBookingStore } from '@/stores/booking';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { useBookings } from '@/composables/shared/useBookings';
import { useProperties } from '@/composables/shared/useProperties';
import { useCalendarState } from '@/composables/shared/useCalendarState';
import type { Booking, Property, BookingFormData, PropertyFormData, CalendarView } from '@/types';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import eventLogger from '@/composables/shared/useComponentEventLogger';
import OwnerCalendar from '@/pages/demos/owner-calendar.vue';
const propertyStore = usePropertyStore();
const bookingStore = useBookingStore();
const uiStore = useUIStore();
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
const currentOwnerId = computed(() => {
  return authStore.user?.id;
});
const isOwnerAuthenticated = computed(() => {
  return authStore.isAuthenticated &&
         authStore.user?.role === 'owner' &&
         currentOwnerId.value;
});
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
const ownerPropertiesMap = computed(() => {
  const map = new Map<string, Property>();
  if (!isOwnerAuthenticated.value || !currentOwnerId.value) {
    return map;
  }
  if (propertyStore.properties instanceof Map) {
    propertyStore.properties.forEach((property, id) => {
      if (property.owner_id === currentOwnerId.value) {
        map.set(id, property);
      }
    });
  } else {
    propertyStore.propertiesArray
      .filter(property => property.owner_id === currentOwnerId.value)
      .forEach(property => {
        if (property && property.id) {
          map.set(property.id, property);
        }
      });
  }
  return map;
});
const ownerBookingsMap = computed(() => {
  const map = new Map<string, Booking>();
  if (!isOwnerAuthenticated.value || !currentOwnerId.value) {
    return map;
  }
  bookingStore.bookingsArray
    .filter(booking => booking.owner_id === currentOwnerId.value)
    .forEach(booking => {
      if (booking && booking.id) {
        map.set(booking.id, booking);
      }
    });
  return map;
});
const ownerTodayTurns = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const turns = new Map<string, Booking>();
  if (!isOwnerAuthenticated.value) {
    return turns;
  }
  Array.from(ownerBookingsMap.value.values()).forEach(booking => {
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
const ownerUpcomingCleanings = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inOneWeek = new Date(today);
  inOneWeek.setDate(inOneWeek.getDate() + 7);
  const cleanings = new Map<string, Booking>();
  if (!isOwnerAuthenticated.value) {
    return cleanings;
  }
  Array.from(ownerBookingsMap.value.values()).forEach(booking => {
    const checkoutDate = new Date(booking.checkout_date);
    if (checkoutDate >= today && checkoutDate <= inOneWeek) {
      cleanings.set(booking.id, booking);
    }
  });
  return cleanings;
});
const ownerFilteredBookings = computed(() => {
  let bookings = Array.from(ownerBookingsMap.value.values());
  if (selectedPropertyFilter.value) {
    bookings = bookings.filter(booking =>
      booking.property_id === selectedPropertyFilter.value &&
      ownerPropertiesMap.value.has(booking.property_id)
    );
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
  return modal?.data as Booking | undefined;
});
const propertyModalOpen = computed(() => uiStore.isModalOpen('propertyModal'));
const propertyModalMode = computed(() => {
  const modal = uiStore.getModalState('propertyModal');
  return (modal?.mode as 'create' | 'edit') || 'create';
});
const propertyModalData = computed(() => {
  const modal = uiStore.getModalState('propertyModal');
  return modal?.data as Property | undefined;
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
      'OwnerSidebar',
    'HomeOwner',
    'navigateToBooking',
    bookingId,
    'receive'
  );
  const booking = ownerBookingsMap.value.get(bookingId);
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
  } else {
    console.warn('Booking not found in your properties');
  }
};
const handleNavigateToDate = (date: Date): void => {
      eventLogger.logEvent(
      'OwnerSidebar',
      'HomeOwner',
      'navigateToDate',
    date,
    'receive'
  );
  goToDate(date);
  eventLogger.logEvent(
    'HomeOwner',
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
      'OwnerSidebar',
      'HomeOwner',
      'filterByProperty',
    propertyId,
    'receive'
  );
  if (propertyId && !ownerPropertiesMap.value.has(propertyId)) {
    console.warn('Cannot filter by property not owned by current user');
    return;
  }
  selectedPropertyFilter.value = propertyId;
  if (propertyId) {
    togglePropertyFilter(propertyId);
  } else {
    clearPropertyFilters();
  }
  uiStore.setPropertyFilter(propertyId);
  eventLogger.logEvent(
    'HomeOwner',
    'FullCalendar',
    'filteredBookingsUpdate',
    { propertyId, count: ownerFilteredBookings.value.size },
    'emit'
  );
};
const handleCreateBooking = (data?: Partial<BookingFormData>): void => {
      eventLogger.logEvent(
      'OwnerSidebar',
      'HomeOwner',
      'createBooking',
    data,
    'receive'
  );
  const bookingData = {
    ...data,
    owner_id: currentOwnerId.value
  };
  uiStore.openModal('eventModal', 'create', bookingData);
};
const handleCreateProperty = (): void => {
      eventLogger.logEvent(
      'OwnerSidebar',
      'HomeOwner',
      'createProperty',
    null,
    'receive'
  );
  const propertyData = {
    owner_id: currentOwnerId.value
  };
  uiStore.openModal('propertyModal', 'create', propertyData);
};
const handleDateSelect = (selectInfo: DateSelectArg): void => {
  eventLogger.logEvent(
    'FullCalendar',
    'HomeOwner',
    'dateSelect',
    { start: selectInfo.startStr, end: selectInfo.endStr },
    'receive'
  );
  const bookingData: Partial<BookingFormData> = {
    checkout_date: selectInfo.startStr,
    checkin_date: selectInfo.endStr,
    owner_id: currentOwnerId.value
  };
  uiStore.openModal('eventModal', 'create', bookingData);
};
const handleEventClick = (clickInfo: EventClickArg): void => {
  eventLogger.logEvent(
    'FullCalendar',
    'HomeOwner',
    'eventClick',
    { id: clickInfo.event.id },
    'receive'
  );
  const booking = ownerBookingsMap.value.get(clickInfo.event.id);
  if (booking) {
    uiStore.openModal('eventModal', 'edit', { booking });
  } else {
    console.warn('Cannot edit booking not owned by current user');
  }
};
const handleEventDrop = async (dropInfo: EventDropArg): Promise<void> => {
  const booking = dropInfo.event.extendedProps.booking as Booking;
  if (!ownerBookingsMap.value.has(booking.id)) {
    console.warn('Cannot modify booking not owned by current user');
    dropInfo.revert();
    return;
  }
  try {
    await updateBooking(booking.id, {
      checkout_date: dropInfo.event.startStr,
      checkin_date: dropInfo.event.endStr || dropInfo.event.startStr
    });
  } catch (error) {
    console.error('Failed to update your booking:', error);
    dropInfo.revert();
  }
};
const handleEventResize = async (resizeInfo: any): Promise<void> => {
  const booking = resizeInfo.event.extendedProps.booking as Booking;
  if (!ownerBookingsMap.value.has(booking.id)) {
    console.warn('Cannot modify booking not owned by current user');
    resizeInfo.revert();
    return;
  }
  try {
    await updateBooking(booking.id, {
      checkout_date: resizeInfo.event.startStr,
      checkin_date: resizeInfo.event.endStr
    });
  } catch (error) {
    console.error('Failed to update your booking:', error);
    resizeInfo.revert();
  }
};
const handlePrevious = (): void => {
  prev();
  const calendarApi = calendarRef.value?.getApi?.();
  if (calendarApi) {
    calendarApi.prev();
  }
};
const handleNext = (): void => {
  next();
  const calendarApi = calendarRef.value?.getApi?.();
  if (calendarApi) {
    calendarApi.next();
  }
};
const handleGoToday = (): void => {
  goToToday();
  const calendarApi = calendarRef.value?.getApi?.();
  if (calendarApi) {
    calendarApi.today();
  }
};
const handleCalendarViewChange = (view: CalendarView): void => {
  const calendarView = view === 'week' ? 'timeGridWeek' :
                      view === 'day' ? 'timeGridDay' :
                      'dayGridMonth';
  setCalendarView(calendarView);
};
const handleCalendarDateChange = (date: Date): void => {
  goToDate(date);
  const calendarApi = calendarRef.value?.getApi?.();
  if (calendarApi) {
    calendarApi.gotoDate(date);
  }
};
const handleCreateBookingFromCalendar = (data: { start: string; end: string; propertyId?: string | undefined; }): void => {
  const bookingData = {
    ...data,
    owner_id: currentOwnerId.value
  };
  uiStore.openModal('eventModal', 'create', bookingData);
};
const handleUpdateBooking = (data: { id: string; start: string; end: string }): void => {
  if (!ownerBookingsMap.value.has(data.id)) {
    console.warn('Cannot update booking not owned by current user');
    return;
  }
  updateBooking(data.id, {
    checkout_date: data.start,
    checkin_date: data.end
  });
};
const handleEventModalClose = (): void => {
  uiStore.closeModal('eventModal');
};
const handleEventModalSave = async (data: BookingFormData): Promise<void> => {
  try {
    const bookingData = {
      ...data,
      owner_id: currentOwnerId.value
    };
    if (eventModalMode.value === 'create') {
      await createBooking(bookingData as BookingFormData);
    } else if (eventModalData.value) {
      if (!ownerBookingsMap.value.has(eventModalData.value.id)) {
        throw new Error('Cannot update booking not owned by current user');
      }
      await updateBooking(eventModalData.value.id, bookingData as Partial<BookingFormData>);
    }
    uiStore.closeModal('eventModal');
  } catch (error) {
    console.error('Failed to save your booking:', error);
  }
};
const handleEventModalDelete = async (bookingId: string): Promise<void> => {
  if (!ownerBookingsMap.value.has(bookingId)) {
    console.warn('Cannot delete booking not owned by current user');
    return;
  }
    uiStore.openConfirmDialog('confirmDialog', {
    title: 'Delete Booking',
    message: 'Are you sure you want to delete this booking? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    dangerous: true,
    data: { type: 'booking', id: bookingId }
  });
};
const handlePropertyModalClose = (): void => {
  uiStore.closeModal('propertyModal');
};
const handlePropertyModalSave = async (data: PropertyFormData): Promise<void> => {
  try {
    const propertyData = {
      ...data,
      owner_id: currentOwnerId.value
    };
    if (propertyModalMode.value === 'create') {
      await createProperty(propertyData as PropertyFormData);
    } else if (propertyModalData.value) {
      if (!ownerPropertiesMap.value.has(propertyModalData.value.id)) {
        throw new Error('Cannot update property not owned by current user');
      }
      await updateProperty(propertyModalData.value.id, propertyData as Partial<PropertyFormData>);
    }
    uiStore.closeModal('propertyModal');
  } catch (error) {
    console.error('Failed to save your property:', error);
  }
};
const handlePropertyModalDelete = async (propertyId: string): Promise<void> => {
  if (!ownerPropertiesMap.value.has(propertyId)) {
    console.warn('Cannot delete property not owned by current user');
    return;
  }
  uiStore.openConfirmDialog('confirmDialog', {
    title: 'Delete Property',
    message: 'Are you sure you want to delete this property? This will also delete all associated bookings. This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    dangerous: true,
    data: { type: 'property', id: propertyId }
  });
};
const handleConfirmDialogConfirm = async (): Promise<void> => {
  const data = confirmDialogData.value;
  if (data?.type === 'booking' && data?.id) {
    try {
      await deleteBooking(data.id as string);
      uiStore.closeModal('eventModal');
    } catch (error) {
      console.error('Failed to delete your booking:', error);
    }
  } else if (data?.type === 'property' && data?.id) {
    try {
      await deleteProperty(data.id as string    );
      uiStore.closeModal('propertyModal');
    } catch (error) {
      console.error('Failed to delete your property:', error);
    }
  }
  uiStore.closeConfirmDialog('confirmDialog');
};
const handleConfirmDialogCancel = (): void => {
  uiStore.closeConfirmDialog('confirmDialog');
};
const handleConfirmDialogClose = (): void => {
  uiStore.closeConfirmDialog('confirmDialog');
};
const toggleSidebar = (): void => {
  sidebarOpen.value = !sidebarOpen.value;
};
onMounted(async () => {
  if (isOwnerAuthenticated.value) {
    try {
      await Promise.all([
        fetchAllProperties(),
        fetchAllBookings()
      ]);
    } catch (error) {
      console.error('Failed to load your data:', error);
    }
  }
});
onUnmounted(() => {
});
watch(xs, (newValue) => {
  if (newValue) {
    sidebarOpen.value = false;
  }
});
watch(isOwnerAuthenticated, (newValue) => {
  if (newValue) {
    fetchAllProperties();
    fetchAllBookings();
  }
});
</script>
<style scoped>
.home-owner-container {
  height: 100vh;
  overflow: hidden;
}
.sidebar-column {
  height: 100vh;
  overflow-y: auto;
  border-right: 1px solid rgb(var(--v-theme-on-surface), 0.12);
}
.calendar-column {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.calendar-header {
  padding: 16px;
  border-bottom: 1px solid rgb(var(--v-theme-on-surface), 0.12);
  background: rgb(var(--v-theme-surface));
  flex-shrink: 0;
}
.mobile-hidden {
  display: none;
}
@media (min-width: 1024px) {
  .mobile-hidden {
    display: block;
  }
}
.home-owner-container {
  --owner-primary: rgb(var(--v-theme-primary));
  --owner-accent: rgb(var(--v-theme-secondary));
}
:deep(.fc-event.highlighted) {
  animation: owner-highlight 3s ease-in-out;
  box-shadow: 0 0 0 3px var(--owner-primary);
}
@keyframes owner-highlight {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 var(--owner-primary);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 6px rgba(var(--v-theme-primary), 0.3);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 3px var(--owner-primary);
  }
}
</style>
```

## File: src/pages/admin/index.vue
```vue
<template>
  <div class="admin-dashboard-container">
    <div class="admin-dashboard-header">
      <div class="d-flex align-center justify-space-between flex-wrap">
        <div>
          <h2 class="text-h4 font-weight-bold mb-1">
            Admin Dashboard
          </h2>
          <div class="text-subtitle-1 text-medium-emphasis">
            {{ formattedDate }}
          </div>
        </div>
        <div class="admin-metrics d-flex align-center flex-wrap ga-4">
          <v-chip
            color="primary"
            variant="outlined"
            prepend-icon="mdi-home-group"
          >
            {{ allPropertiesMap.size }} Properties
          </v-chip>
          <v-chip
            color="info"
            variant="outlined"
            prepend-icon="mdi-calendar-edit"
          >
            {{ allBookingsMap.size }} Bookings
          </v-chip>
          <v-chip
            color="warning"
            variant="outlined"
            prepend-icon="mdi-fire"
          >
            {{ systemTodayTurns.size }} Urgent Turns
          </v-chip>
          <v-chip
            color="success"
            variant="outlined"
            prepend-icon="mdi-calendar-clock"
          >
            {{ systemUpcomingCleanings.size }} Upcoming
          </v-chip>
        </div>
      </div>
    </div>
    <AdminVbar
      :loading="loading"
      @toggle-drawer="toggleDrawer"
      @logout="logout"
      @create-booking="createBooking"
      @create-property="createProperty"
    />
    <AdminSidebar
      :today-turns="systemTodayTurns"
      :upcoming-cleanings="systemUpcomingCleanings"
      :properties="allPropertiesMap"
      :loading="loading"
      @navigate-to-booking="handleNavigateToBooking"
      @navigate-to-date="handleNavigateToDate"
      @filter-by-property="handleFilterByProperty"
    />
    <div class="admin-calendar-wrapper">
      <AdminCalendar
        ref="calendarRef"
        :bookings="adminFilteredBookings"
        :loading="loading"
        :current-view="currentView"
        :current-date="currentDate"
        :properties="allPropertiesMap"
        :users="allUsersMap"
        @date-select="handleDateSelect"
        @event-click="handleEventClick"
        @event-drop="handleEventDrop"
        @event-resize="handleEventResize"
        @view-change="handleCalendarViewChange"
        @date-change="handleCalendarDateChange"
        @create-booking="handleCreateBookingFromCalendar"
        @update-booking="handleUpdateBooking"
        @assign-cleaner="handleCleanerAssign"
        @update-booking-status="handleStatusChange"
      />
    </div>
    <AdminBookingModal
      :open="eventModalOpen"
      :mode="eventModalMode"
      :booking="eventModalData"
      @close="handleEventModalClose"
      @save="handleEventModalSave"
      @delete="handleEventModalDelete"
      @assign-cleaner="handleCleanerAssign"
      @status-change="handleStatusChange"
    />
    <AdminPropertyModal
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
{{ formattedDate }}
⋮----
{{ allPropertiesMap.size }} Properties
⋮----
{{ allBookingsMap.size }} Bookings
⋮----
{{ systemTodayTurns.size }} Urgent Turns
⋮----
{{ systemUpcomingCleanings.size }} Upcoming
⋮----
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import AdminVbar from '@/components/smart/admin/AdminVbar.vue';
import AdminSidebar from '@/components/dumb/admin/AdminSidebar.vue';
import AdminCalendar from '@/components/smart/admin/AdminCalendar.vue';
import AdminBookingModal from '@/components/dumb/admin/AdminBookingModal.vue';
import ConfirmationDialog from '@/components/dumb/shared/ConfirmationDialog.vue';
import { useUserStore } from '@/stores/user';
import { usePropertyStore } from '@/stores/property';
import { useBookingStore } from '@/stores/booking';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { useBookings } from '@/composables/shared/useBookings';
import { useProperties } from '@/composables/shared/useProperties';
import { useCalendarState } from '@/composables/shared/useCalendarState';
import type { Booking, Property, BookingFormData, PropertyFormData, BookingStatus, User } from '@/types';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import eventLogger from '@/composables/shared/useComponentEventLogger';
const userStore = useUserStore();
const propertyStore = usePropertyStore();
const bookingStore = useBookingStore();
const uiStore = useUIStore();
const authStore = useAuthStore();
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
  prev
} = useCalendarState();
const calendarRef = ref<InstanceType<typeof AdminCalendar> | null>(null);
const isAdminAuthenticated = computed(() => {
  return authStore.isAuthenticated &&
         authStore.user?.role === 'admin';
});
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
const allPropertiesMap = computed(() => {
  if (!isAdminAuthenticated.value) {
    return new Map<string, Property>();
  }
  if (propertyStore.properties instanceof Map) {
    return propertyStore.properties;
  } else {
    const map = new Map<string, Property>();
    propertyStore.propertiesArray.forEach(property => {
      if (property && property.id) {
        map.set(property.id, property);
      }
    });
    return map;
  }
});
const allUsersMap = computed(() => {
  const map = new Map<string, User>();
  if (!isAdminAuthenticated.value) {
    return map;
  }
  if (userStore.user) {
    map.set(userStore.user.id, userStore.user);
  }
  return map;
});
const allBookingsMap = computed(() => {
  if (!isAdminAuthenticated.value) {
    return new Map<string, Booking>();
  }
  const map = new Map<string, Booking>();
  bookingStore.bookingsArray.forEach(booking => {
    if (booking && booking.id) {
      map.set(booking.id, booking);
    }
  });
  return map;
});
const systemTodayTurns = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const turns = new Map<string, Booking>();
  if (!isAdminAuthenticated.value) {
    return turns;
  }
  Array.from(allBookingsMap.value.values()).forEach(booking => {
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
const systemUpcomingCleanings = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inOneWeek = new Date(today);
  inOneWeek.setDate(inOneWeek.getDate() + 7);
  const cleanings = new Map<string, Booking>();
  if (!isAdminAuthenticated.value) {
    return cleanings;
  }
  Array.from(allBookingsMap.value.values()).forEach(booking => {
    const checkoutDate = new Date(booking.checkout_date);
    if (checkoutDate >= today && checkoutDate <= inOneWeek) {
      cleanings.set(booking.id, booking);
    }
  });
  return cleanings;
});
const adminFilteredBookings = computed(() => {
  let bookings = Array.from(allBookingsMap.value.values());
  bookings = filterBookings(bookings);
  const map = new Map<string, Booking>();
  bookings.forEach(booking => {
    map.set(booking.id, booking);
  });
  return map;
});
const eventModalOpen = computed(() => uiStore.isModalOpen('event'));
const eventModalMode = computed((): 'create' | 'admin-edit' | undefined => {
  const modalState = uiStore.getModalState('event');
  const mode = modalState?.mode;
  return (mode === 'create' || mode === 'admin-edit') ? mode : undefined;
});
const eventModalData = computed((): Booking | undefined => {
  const modalData = uiStore.getModalData('event') as { booking?: Booking };
  return modalData?.booking || undefined;
});
const propertyModalOpen = computed(() => uiStore.isModalOpen('property'));
const propertyModalMode = computed((): 'create' | 'edit' | undefined => {
  const modalState = uiStore.getModalState('property');
  const mode = modalState?.mode;
  return (mode === 'create' || mode === 'edit') ? mode : undefined;
});
const propertyModalData = computed((): Property | undefined => {
  const modalData = uiStore.getModalData('property') as { property?: Property };
  return modalData?.property || undefined;
});
const confirmDialogOpen = computed(() => uiStore.isConfirmDialogOpen('confirm'));
const confirmDialogTitle = computed((): string => {
  const dialogState = uiStore.getConfirmDialogState('confirm');
  return dialogState?.title || '';
});
const confirmDialogMessage = computed((): string => {
  const dialogState = uiStore.getConfirmDialogState('confirm');
  return dialogState?.message || '';
});
const confirmDialogConfirmText = computed((): string => {
  const dialogState = uiStore.getConfirmDialogState('confirm');
  return dialogState?.confirmText || 'Confirm';
});
const confirmDialogCancelText = computed((): string => {
  const dialogState = uiStore.getConfirmDialogState('confirm');
  return dialogState?.cancelText || 'Cancel';
});
const confirmDialogDangerous = computed((): boolean => {
  const dialogState = uiStore.getConfirmDialogState('confirm');
  return Boolean(dialogState?.dangerous) || false;
});
const handleAssignCleaners = (): void => {
  try {
    eventLogger.logEvent(
      'AdminDashboard',
      'AdminDashboard',
      'assignCleaners',
      null,
      'emit'
    );
    console.log('Admin: Assign Cleaners clicked');
  } catch (error) {
    console.error('Error opening cleaner assignment:', error);
  }
};
const handleGenerateReports = (): void => {
  try {
    eventLogger.logEvent(
      'AdminDashboard',
      'AdminDashboard',
      'generateReports',
      null,
      'emit'
    );
    console.log('Admin: Generate Reports clicked');
  } catch (error) {
    console.error('Error opening reports:', error);
  }
};
const handleManageSystem = (): void => {
  try {
    eventLogger.logEvent(
      'AdminDashboard',
      'AdminDashboard',
      'manageSystem',
      null,
      'emit'
    );
    console.log('Admin: Manage System clicked');
  } catch (error) {
    console.error('Error opening system management:', error);
  }
};
const handleCreateBookingFromCalendar = (data: { start: string; end: string; propertyId?: string }): void => {
  try {
    eventLogger.logEvent(
      'AdminCalendar',
      'AdminDashboard',
      'createBooking',
      data,
      'receive'
    );
    const bookingData: Partial<BookingFormData> = {
      checkout_date: data.start,
      checkin_date: data.end,
      property_id: data.propertyId,
      booking_type: 'standard',
      status: 'pending'
    };
    uiStore.openModal('event', 'create', {
      booking: bookingData
    });
  } catch (error) {
    console.error('Error creating booking from calendar:', error);
  }
};
const handleDateSelect = (selectInfo: DateSelectArg): void => {
  try {
    const data = {
      start: selectInfo.startStr,
      end: selectInfo.endStr
    };
    handleCreateBookingFromCalendar(data);
  } catch (error) {
    console.error('Error handling date select:', error);
  }
};
const handleEventClick = (clickInfo: EventClickArg): void => {
  try {
    const bookingId = clickInfo.event.id;
    const booking = allBookingsMap.value.get(bookingId);
    if (booking) {
      uiStore.openModal('event', 'admin-edit', {
        booking: booking
      });
    }
  } catch (error) {
    console.error('Error handling event click:', error);
  }
};
const handleEventDrop = (dropInfo: EventDropArg): void => {
  try {
    const bookingId = dropInfo.event.id;
    const booking = allBookingsMap.value.get(bookingId);
    if (booking) {
      const updatedBooking: Partial<BookingFormData> = {
        ...booking,
        checkout_date: dropInfo.event.startStr,
        checkin_date: dropInfo.event.endStr || dropInfo.event.startStr
      };
      updateBooking(bookingId, updatedBooking);
    }
  } catch (error) {
    console.error('Error handling event drop:', error);
    dropInfo.revert();
  }
};
const handleEventResize = (resizeInfo: { event: { id: string; startStr: string; endStr?: string; end?: Date }; revert: () => void }): void => {
  try {
    const bookingId = resizeInfo.event.id;
    const booking = allBookingsMap.value.get(bookingId);
    if (booking) {
      const updatedBooking: Partial<BookingFormData> = {
        ...booking,
        checkout_date: resizeInfo.event.startStr,
        checkin_date: resizeInfo.event.endStr || resizeInfo.event.startStr
      };
      updateBooking(bookingId, updatedBooking);
    }
  } catch (error) {
    console.error('Error handling event resize:', error);
    resizeInfo.revert();
  }
};
const handleUpdateBooking = (data: { id: string; updates: Partial<Booking> }): void => {
  try {
    updateBooking(data.id, data.updates);
  } catch (error) {
    console.error('Error updating booking:', error);
  }
};
const handleCalendarViewChange = (view: string): void => {
  try {
    setCalendarView(view as 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay');
  } catch (error) {
    console.error('Error changing calendar view:', error);
  }
};
const handleCalendarDateChange = (date: Date): void => {
  try {
    goToDate(date);
  } catch (error) {
    console.error('Error changing calendar date:', error);
  }
};
const handlePrevious = (): void => {
  try {
    prev();
  } catch (error) {
    console.error('Error going to previous:', error);
  }
};
const handleNext = (): void => {
  try {
    next();
  } catch (error) {
    console.error('Error going to next:', error);
  }
};
const handleGoToday = (): void => {
  try {
    goToToday();
  } catch (error) {
    console.error('Error going to today:', error);
  }
};
const handleEventModalClose = (): void => {
  try {
    uiStore.closeModal('event');
  } catch (error) {
    console.error('Error closing event modal:', error);
  }
};
const handleEventModalSave = async (bookingData: BookingFormData): Promise<void> => {
  try {
    if (eventModalMode.value === 'create') {
      await createBooking(bookingData);
    } else if (eventModalMode.value === 'admin-edit') {
      const modalData = uiStore.getModalData('event') as { booking?: Booking };
      const bookingId = modalData?.booking?.id;
      if (bookingId) {
        await updateBooking(bookingId, bookingData);
      }
    }
    uiStore.closeModal('event');
  } catch (error) {
    console.error('Error saving booking:', error);
  }
};
const handleEventModalDelete = (bookingId: string): void => {
  try {
    uiStore.openConfirmDialog('confirm', {
      title: 'Delete Booking',
      message: 'Are you sure you want to delete this booking? This action cannot be undone and will affect the property owner.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      dangerous: true,
      data: {
        onConfirm: () => {
          deleteBooking(bookingId);
          uiStore.closeModal('event');
          uiStore.closeConfirmDialog('confirm');
        }
      }
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
  }
};
const handlePropertyModalClose = (): void => {
  try {
    uiStore.closeModal('property');
  } catch (error) {
    console.error('Error closing property modal:', error);
  }
};
const handlePropertyModalSave = async (propertyData: PropertyFormData): Promise<void> => {
  try {
    if (propertyModalMode.value === 'create') {
      await createProperty(propertyData);
    } else if (propertyModalMode.value === 'edit') {
      const modalData = uiStore.getModalData('property') as { property?: Property };
      const propertyId = modalData?.property?.id;
      if (propertyId) {
        await updateProperty(propertyId, propertyData);
      }
    }
    uiStore.closeModal('property');
  } catch (error) {
    console.error('Error saving property:', error);
  }
};
const handlePropertyModalDelete = (propertyId: string): void => {
  try {
    const property = allPropertiesMap.value.get(propertyId);
    const relatedBookings = Array.from(allBookingsMap.value.values())
      .filter(booking => booking.property_id === propertyId);
    uiStore.openConfirmDialog('confirm', {
      title: 'Delete Property',
      message: `Are you sure you want to delete "${property?.name}"? This will affect ${relatedBookings.length} bookings and impact the property owner's business.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      dangerous: true,
      data: {
        onConfirm: () => {
          deleteProperty(propertyId);
          uiStore.closeModal('property');
          uiStore.closeConfirmDialog('confirm');
        }
      }
    });
  } catch (error) {
    console.error('Error deleting property:', error);
  }
};
const handleCleanerAssign = async (data: { bookingId: string; cleanerId: string }): Promise<void> => {
  try {
    console.log('Assigning cleaner:', data);
    const booking = allBookingsMap.value.get(data.bookingId);
    if (booking) {
      const updatedBooking = { ...booking, assigned_cleaner_id: data.cleanerId, status: 'scheduled' as const };
      allBookingsMap.value.set(data.bookingId, updatedBooking);
      uiStore.addNotification('success', 'Cleaner Assigned', 'Cleaner has been successfully assigned to the booking.');
    }
  } catch (error) {
    console.error('Error assigning cleaner:', error);
    uiStore.addNotification('error', 'Assignment Failed', 'Failed to assign cleaner to booking.');
  }
};
const handleStatusChange = async (data: { bookingId: string; status: BookingStatus }): Promise<void> => {
  try {
    const booking = allBookingsMap.value.get(data.bookingId);
    if (booking) {
      const updatedBooking = { ...booking, status: data.status };
      allBookingsMap.value.set(data.bookingId, updatedBooking);
      uiStore.addNotification('success', 'Status Updated', `Booking status changed to ${data.status}.`);
    }
  } catch (error) {
    console.error('Error updating status:', error);
    uiStore.addNotification('error', 'Status Update Failed', 'Failed to update booking status.');
  }
};
const handleConfirmDialogConfirm = (): void => {
  try {
    const confirmData = uiStore.getConfirmDialogState('confirm');
    const onConfirm = confirmData?.data?.onConfirm;
    if (onConfirm && typeof onConfirm === 'function') {
      onConfirm();
    }
  } catch (error) {
    console.error('Error handling confirm dialog confirm:', error);
  }
};
const handleConfirmDialogCancel = (): void => {
  try {
    const confirmData = uiStore.getConfirmDialogState('confirm');
    const onCancel = confirmData?.data?.onCancel;
    if (onCancel && typeof onCancel === 'function') {
      onCancel();
    }
    uiStore.closeConfirmDialog('confirm');
  } catch (error) {
    console.error('Error handling confirm dialog cancel:', error);
  }
};
const handleConfirmDialogClose = (): void => {
  try {
    uiStore.closeConfirmDialog('confirm');
  } catch (error) {
    console.error('Error closing confirm dialog:', error);
  }
};
onMounted(async () => {
  try {
    await Promise.all([
      fetchAllBookings(),
      fetchAllProperties()
    ]);
  } catch (error) {
    console.error('Error initializing AdminDashboard:', error);
  }
});
onUnmounted(() => {
});
</script>
<style scoped>
.admin-dashboard-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
}
.admin-dashboard-header {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  padding: 24px;
  flex-shrink: 0;
}
.admin-metrics {
  gap: 8px;
}
.calendar-controls {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.06);
  padding-top: 16px;
}
.admin-calendar-wrapper {
  flex: 1;
  width: 100%;
  height: 100%;
  padding: 16px;
  overflow: hidden;
}
@media (max-width: 960px) {
  .admin-dashboard-header {
    padding: 16px;
  }
  .admin-metrics {
    margin-top: 16px;
  }
  .calendar-controls .d-flex {
    flex-direction: column;
    gap: 12px;
  }
  .admin-calendar-wrapper {
    padding: 8px;
  }
}
@media (max-width: 600px) {
  .admin-dashboard-header {
    padding: 12px;
  }
  .admin-calendar-wrapper {
    padding: 4px;
  }
  .calendar-controls .d-flex > div {
    width: 100%;
    justify-content: center;
  }
}
</style>
```

## File: src/layouts/admin.vue
```vue
<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      permanent
      app
      color="surface"
      width="280"
      class="admin-nav-drawer"
    >
      <v-list-item class="px-4 py-4">
        <template #prepend>
          <v-avatar
            color="primary"
            size="40"
          >
            <v-icon color="white">
              mdi-shield-crown
            </v-icon>
          </v-avatar>
        </template>
        <v-list-item-title class="text-h6 font-weight-bold">
          Admin Layout
        </v-list-item-title>
        <v-list-item-subtitle>
          Business Management
        </v-list-item-subtitle>
      </v-list-item>
      <v-divider />
      <v-divider class="my-2" />
      <v-list density="compact">
        <v-list-subheader>Quick Actions</v-list-subheader>
        <v-list-item
          prepend-icon="mdi-plus"
          title="New Booking"
          @click="createBooking"
        />
        <v-list-item
          prepend-icon="mdi-home-plus"
          title="Add Property"
          @click="createProperty"
        />
        <v-list-item
          prepend-icon="mdi-account-plus"
          title="Add Cleaner"
          @click="addCleaner"
        />
      </v-list>
      <template #append>
        <div class="pa-4">
          <v-btn
            to="/"
            variant="outlined"
            block
            prepend-icon="mdi-home"
            class="mb-2"
          >
            Switch to Owner View
          </v-btn>
          <v-btn
            variant="text"
            block
            prepend-icon="mdi-logout"
            color="error"
            @click="logout"
          >
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-main class="admin-main">
      <router-view />
    </v-main>
  </v-app>
</template>
⋮----
<template #prepend>
          <v-avatar
            color="primary"
            size="40"
          >
            <v-icon color="white">
              mdi-shield-crown
            </v-icon>
          </v-avatar>
        </template>
⋮----
<template #append>
        <div class="pa-4">
          <v-btn
            to="/"
            variant="outlined"
            block
            prepend-icon="mdi-home"
            class="mb-2"
          >
            Switch to Owner View
          </v-btn>
          <v-btn
            variant="text"
            block
            prepend-icon="mdi-logout"
            color="error"
            @click="logout"
          >
            Logout
          </v-btn>
        </div>
      </template>
⋮----
<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useAuth } from '@/composables/shared/useAuth'
import { useRouter } from 'vue-router'
const { mdAndUp } = useDisplay()
const drawer = ref(true)
const { logout: authLogout } = useAuth()
const router = useRouter()
const logout = async () => {
  await authLogout()
  router.push('/auth/login')
}
const createBooking = () => {
  router.push('/admin/schedule')
}
const createProperty = () => {
  router.push('/admin/properties')
}
const addCleaner = () => {
  router.push('/admin/cleaners')
}
</script>
<style scoped>
.admin-app-bar {
  border-bottom: 2px solid rgb(var(--v-theme-primary)) !important;
}
.admin-badge {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-primary));
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.admin-main {
  background: rgb(var(--v-theme-background)) !important;
}
.admin-nav-drawer {
  border-right: 1px solid rgb(var(--v-theme-outline-variant)) !important;
}
.v-btn--variant-text {
  color: rgb(var(--v-theme-on-surface)) !important;
}
.v-btn--variant-text:hover {
  background: rgba(var(--v-theme-primary), 0.08) !important;
}
.v-btn--variant-text.router-link-active {
  background: rgba(var(--v-theme-primary), 0.12) !important;
  color: rgb(var(--v-theme-primary)) !important;
}
.v-list-item:hover {
  background: rgba(var(--v-theme-primary), 0.08) !important;
}
.v-list-item--active {
  background: rgba(var(--v-theme-primary), 0.12) !important;
  color: rgb(var(--v-theme-primary)) !important;
}
@media (max-width: 800px) {
  .admin-app-bar .v-toolbar__content {
    padding-left: 8px;
    padding-right: 8px;
  }
  .admin-nav-drawer {
    width: 240px !important;
  }
}
@media (max-width: 600px) {
  .admin-nav-drawer {
    width: 200px !important;
  }
  .admin-nav-drawer .v-list-item-title {
    font-size: 0.875rem;
  }
}
</style>
```
