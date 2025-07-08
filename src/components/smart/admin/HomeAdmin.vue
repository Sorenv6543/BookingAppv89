<!-- 
👑 ADMIN INTERFACE
 src/components/smart/admin/HomeAdmin.vue - 

✅ UNFILTERED VIEW - Admin sees all data
✅ Access to all properties across all owners
✅ System-wide metrics and controls
✅ Can manage any owner's data 
-->
<template>
  <div class="home-admin-container">
    <!-- Owner Sidebar - Fixed to left edge -->
    <div 
      class="sidebar-column"
      :class="{ 
        'sidebar-hidden': !sidebarOpen && $vuetify.display.mdAndDown,
        'sidebar-visible': sidebarOpen || $vuetify.display.lgAndUp 
      }"
    >
      <!-- <AdminSidebar
        :today-turns="systemTodayTurns"
        :upcoming-cleanings="systemUpcomingCleanings"
        :properties="allPropertiesMap"
        :loading="loading"
        @navigate-to-booking="handleNavigateToBooking"
        @navigate-to-date="handleNavigateToDate"
        @filter-by-property="handleFilterByProperty"
        @create-booking="handleCreateBooking"
        @create-property="handleCreateProperty"
      />
    </div> -->
        <!-- Mobile Menu Toggle -->
        <v-app-bar
          v-if="$vuetify.display.mdAndDown"
          flat
          color="transparent"
          height="48"
          class="px-0"
        >
          <v-app-bar-nav-icon
            @click="sidebarOpen = !sidebarOpen"
          />
          <v-app-bar-title class="text-h6">
            Business Management
          </v-app-bar-title>
        </v-app-bar>

        <!-- Proper Navigation Drawer Implementation -->
        <AdminSidebar
          v-model="sidebarOpen"
          :rail="railMode"
          :today-turns="systemTodayTurns"
         
          :properties="allPropertiesMap"
          :loading="loading"
          @navigate-to-booking="handleNavigateToBooking"
          @navigate-to-date="handleNavigateToDate"
          @filter-by-property="handleFilterByProperty"
          @create-booking="handleCreateBooking"
          @create-property="handleCreateProperty"
        />
    </div>
  </div>
  <div class="calendar-column calendar-responsive"
  :class="{
    'full-viewport-calendar': true,
    'mobile-layout': mobile,
    'tablet-layout': md,
    'desktop-layout': lg,
    'sidebar-closed': !sidebarOpen
  }">
    <!-- Owner Calendar Header - Fixed to top of calendar area -->
      <div class="calendar-header">     
       <div class="pa-0">
        <div class="d-flex align-center">
          <!-- Mobile menu button -->
          <v-btn
            v-if="$vuetify.display.mdAndDown"
            icon="mdi-menu"
            variant="text"
            class="mr-4"
            @click="sidebarOpen = !sidebarOpen"
          />  
             
          <!-- Calendar Navigation -->
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
          <div class="text-h6 mr-4 calendar-header-date">
            {{ formattedDate }}
          </div>
             
          <v-spacer />

        <!-- TODO: Replace with AdminCalendar.vue when TASK-039H is complete -->
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
        />
        </div>
    </div>
  </div>
    <!-- Admin-focused Modals -->
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

    <!-- TODO: Add admin-specific modals -->
    <!-- CleanerAssignmentModal -->
    <!-- ReportsModal -->
    <!-- SystemManagementModal -->
  </div>

  <!-- Mobile Floating Action Button for Sidebar Toggle - Outside main container -->
  <v-fab
    v-if="$vuetify.display.mdAndDown"
    icon="mdi-plus"
    size="large"
    color="primary"
    class="mobile-sidebar-fab"
    :class="{ 'fab-shifted': sidebarOpen }"
    @click="sidebarOpen = !sidebarOpen"
  />
</template>

<script setup lang="ts">
import { useRealtimeSync } from '@/composables/supabase/useRealtimeSync';
useRealtimeSync()

// Real-time sync will auto-initialize when user is authenticated
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useDisplay } from 'vuetify';

// Admin components (using generic components for now)

import AdminSidebar from '@/components/smart/admin/AdminSidebar.vue';
import AdminCalendar from '@/components/smart/admin/AdminCalendar.vue';
import BookingForm from '@/components/dumb/BookingForm.vue';
import PropertyModal from '@/components/dumb/PropertyModal.vue';
import ConfirmationDialog from '@/components/dumb/shared/ConfirmationDialog.vue';

// State management
import { useUserStore } from '@/stores/user';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';

// Business logic composables
import { useAdminBookings } from '@/composables/admin/useAdminBookings';
import { useAdminProperties } from '@/composables/admin/useAdminProperties';
import { useCalendarState } from '@/composables/shared/useCalendarState';

// Types
import type { Booking, Property, BookingFormData, PropertyFormData, User } from '@/types';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';

// Import event logger for component communication


// ============================================================================
// STORE CONNECTIONS & STATE
// ============================================================================
const userStore = useUserStore();
const uiStore = useUIStore();
const authStore = useAuthStore();
const { xs,  md, lg, mobile } = useDisplay();

// Create computed properties for missing display breakpoints
// const tablet = computed(() => sm.value || md.value);
// const desktop = computed(() => lg.value || xl.value || (!mobile.value && !tablet.value));

// Import event logger for component communication
import eventLogger from '@/composables/shared/useComponentEventLogger';

// COMPOSABLES - ADMIN BUSINESS LOGIC
// ============================================================================
const { 
  allBookings,
  allProperties,
  systemTodayTurns,
  // systemUpcomingCleanings,
  // systemMetrics,
  loading: adminLoading,
  fetchAllBookings,
  fetchAllProperties,
  createBooking,
  updateBooking,
  deleteBooking
} = useAdminBookings();

const { 
  createProperty,
  updateProperty,
  deleteProperty
} = useAdminProperties();

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
const calendarRef = ref<InstanceType<typeof AdminCalendar> | null>(null);
const sidebarOpen = ref(!xs.value);
const selectedPropertyFilter = ref<string | null>(null);

// Navigation drawer responsive behavior
const railMode = computed(() => {
  // Use rail mode on desktop when there's limited space
  return !xs.value && !sidebarOpen.value;
});

// ============================================================================
// ADMIN-SPECIFIC DATA ACCESS
// ============================================================================

// Check if user is authenticated and is an admin
const isAdminAuthenticated = computed(() => {
  return authStore.isAuthenticated && 
         authStore.user?.role === 'admin';
});

// ============================================================================
// COMPUTED STATE - ADMIN ALL-DATA ACCESS (NO FILTERING)
// ============================================================================

const loading = computed(() => 
  adminLoading.value || 
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

// ALL properties (no owner filtering for admin)
const allPropertiesMap = computed(() => {
  if (!isAdminAuthenticated.value) {
    return new Map<string, Property>();
  }

  // Admin sees ALL properties across ALL owners
  if (allProperties.value instanceof Map) {
    return allProperties.value;
  } else {
    const map = new Map<string, Property>();
    allProperties.value.forEach((property: Property) => {
      if (property && property.id) {
        map.set(property.id, property);
      }
    });
    return map;
  }
});

// ALL users (no filtering for admin)
const allUsersMap = computed(() => {
  const map = new Map<string, User>();
  
  if (!isAdminAuthenticated.value) {
    return map;
  }

  // For now, just include the current user
  // TODO: Implement user management store for all users when needed
  if (userStore.user) {
    map.set(userStore.user.id, userStore.user);
  }
  
  return map;
});

// Admin's filtered bookings (all data with filters applied)
const adminFilteredBookings = computed(() => {
  let bookings = Array.from(allBookings.value);
  
  // Apply property filter if selected (can be any property)
  if (selectedPropertyFilter.value) {
    bookings = bookings.filter(booking => 
      booking.property_id === selectedPropertyFilter.value
    );
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

// System-wide metrics for admin header
// const systemMetricsText = computed(() => {
//   const totalProperties = allPropertiesMap.value.size;
//   const totalBookings = allBookings.value.length;
//   const urgentTurns = systemTodayTurns.value.length;
//   const upcomingCount = allBookings.value.filter(booking => {
//     const checkoutDate = new Date(booking.checkout_date);
//     const today = new Date();
//     const inOneWeek = new Date(today);
//     inOneWeek.setDate(inOneWeek.getDate() + 7);
//     return checkoutDate >= today && checkoutDate <= inOneWeek;
//   }).length;
  
//   return `${totalProperties} properties • ${totalBookings} bookings • ${urgentTurns} urgent turns • ${upcomingCount} upcoming`;
// });

// ============================================================================
// DATA LOADING ON MOUNT  
// ============================================================================

// Fetch data when component mounts
onMounted(async () => {
  console.log('🚀 [HomeAdmin] Component mounted, starting data fetch...');
  
  if (!isAdminAuthenticated.value) {
    console.log('⚠️ [HomeAdmin] User not authenticated as admin, skipping data fetch');
    return;
  }

  try {
    // Fetch both properties and bookings in parallel for better performance
    await Promise.all([
      fetchAllBookings(),
      fetchAllProperties()
    ]);
    
    console.log('✅ [HomeAdmin] Admin data fetch completed successfully');
    console.log('🔍 [HomeAdmin] Data state after loading:', {
      propertiesInStore: allProperties.value.length,
      bookingsInStore: allBookings.value.length,
      allProperties: allPropertiesMap.value.size,
      allBookings: allBookings.value.length,
      systemTurns: systemTodayTurns.value.length,
     
    });
  } catch (error) {
    console.error('❌ [HomeAdmin] Error fetching admin data on mount:', error);
    // Error is already handled by the stores and displayed in UI
  }
});

// Watch for authentication changes
watch(isAdminAuthenticated, async (newValue, oldValue) => {
  console.log('🔄 [HomeAdmin] isAdminAuthenticated changed:', { 
    from: oldValue, 
    to: newValue,
    user: authStore.user
  });
  if (newValue && !oldValue) {
    // User became authenticated as admin - load data
    console.log('✅ [HomeAdmin] User became authenticated as admin, loading data...');
    try {
      await Promise.all([
        fetchAllBookings(),
        fetchAllProperties()
      ]);
      console.log('✅ [HomeAdmin] Admin data loaded after auth change');
    } catch (error) {
      console.error('❌ [HomeAdmin] Failed to load admin data after auth change:', error);
    }
  } else if (!newValue && oldValue) {
    // User became unauthenticated - could clear data if needed
    console.log('⚠️ [HomeAdmin] User lost admin authentication');
  }
});

// ============================================================================
// UI STATE - MODAL MANAGEMENT
// ============================================================================

// Event Modal State
const eventModalOpen = computed(() => uiStore.isModalOpen('event'));
const eventModalMode = computed((): 'create' | 'edit' | undefined => {
  const modalState = uiStore.getModalState('event');
  const mode = modalState?.mode;
  return (mode === 'create' || mode === 'edit') ? mode : undefined;
});
const eventModalData = computed((): Booking | undefined => {
  const modalData = uiStore.getModalData('event') as { booking?: Booking };
  return modalData?.booking || undefined;
});

// Property Modal State
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

// Confirmation Dialog State
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

// ============================================================================
// EVENT HANDLERS - NAVIGATION
// ============================================================================

const handleNavigateToBooking = (bookingId: string): void => {
  try {
    // Log receiving event from AdminSidebar (or generic Sidebar)
    eventLogger.logEvent(
      'Sidebar',
      'HomeAdmin',
      'navigateToBooking',
      bookingId,
      'receive'
    );

    // Open booking modal for editing
    const booking = allBookings.value.find(b => b.id === bookingId);
    if (booking) {
      uiStore.openModal('event', 'edit', {
        booking: booking
      });
    } else {
      console.warn(`Booking with ID ${bookingId} not found`);
    }
  } catch (error) {
    console.error('Error navigating to booking:', error);
    // TODO: Show admin-specific error notification
  }
};

const handleNavigateToDate = (date: Date): void => {
  try {
    eventLogger.logEvent(
      'Sidebar',
      'HomeAdmin',
      'navigateToDate',
      date,
      'receive'
    );

    goToDate(date);
  } catch (error) {
    console.error('Error navigating to date:', error);
    // TODO: Show admin-specific error notification
  }
};

const handleFilterByProperty = (propertyId: string | null): void => {
  try {
    eventLogger.logEvent(
      'Sidebar',
      'HomeAdmin',
      'filterByProperty',
      propertyId,
      'receive'
    );

    selectedPropertyFilter.value = propertyId;
    
    // Admin can filter by any property (not just their own)
    if (propertyId) {
      togglePropertyFilter(propertyId);
    } else {
      clearPropertyFilters();
    }
  } catch (error) {
    console.error('Error filtering by property:', error);
    // TODO: Show admin-specific error notification
  }
};

// ============================================================================
// EVENT HANDLERS - ADMIN-SPECIFIC ACTIONS
// ============================================================================

// const handleAssignCleaners = (): void => {
//   try {
//     eventLogger.logEvent(
//       'HomeAdmin',
//       'HomeAdmin',
//       'assignCleaners',
//       null,
//       'emit'
//     );

//     // TODO: Open cleaner assignment modal when TASK-039Q is complete
//     console.log('Admin: Assign Cleaners clicked');
//     // uiStore.openModal('cleanerAssignment', { bookings: unassignedBookings });
//   } catch (error) {
//     console.error('Error opening cleaner assignment:', error);
//   }
// };

// const handleGenerateReports = (): void => {
//   try {
//     eventLogger.logEvent(
//       'HomeAdmin',
//       'HomeAdmin',
//       'generateReports',
//       null,
//       'emit'
//     );

//     // TODO: Open reports modal or navigate to reports page
//     console.log('Admin: Generate Reports clicked');
//     // uiStore.openModal('reports', { dateRange: currentWeek });
//   } catch (error) {
//     console.error('Error opening reports:', error);
//   }
// };

// const handleManageSystem = (): void => {
//   try {
//     eventLogger.logEvent(
//       'HomeAdmin',
//       'HomeAdmin',
//       'manageSystem',
//       null,
//       'emit'
//     );

//     // TODO: Open system management modal or navigate to admin settings
//     console.log('Admin: Manage System clicked');
//     // uiStore.openModal('systemManagement', {});
//   } catch (error) {
//     console.error('Error opening system management:', error);
//   }
// };

// ============================================================================
// EVENT HANDLERS - CRUD OPERATIONS
// ============================================================================

const handleCreateBooking = (): void => {
  try {
    eventLogger.logEvent(
      'Sidebar',
      'HomeAdmin',
      'createBooking',
      null,
      'receive'
    );

    // Admin can create bookings for any property
    uiStore.openModal('event', 'create', {
      booking: null
    });
  } catch (error) {
    console.error('Error creating booking:', error);
  }
};

const handleCreateProperty = (): void => {
  try {
    eventLogger.logEvent(
      'Sidebar',
      'HomeAdmin',
      'createProperty',
      null,
      'receive'
    );

    // Admin can create properties for any owner
    uiStore.openModal('property', 'create', {
      property: null
    });
  } catch (error) {
    console.error('Error creating property:', error);
  }
};

const handleCreateBookingFromCalendar = (data: { start: string; end: string; propertyId?: string }): void => {
  try {
    eventLogger.logEvent(
      'FullCalendar',
      'HomeAdmin',
      'createBooking',
      data,
      'receive'
    );

    // Convert FullCalendar data format to BookingFormData format
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

// ============================================================================
// EVENT HANDLERS - CALENDAR INTERACTIONS
// ============================================================================

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
    eventLogger.logEvent(
      'AdminCalendar',
      'HomeAdmin',
      'eventClick',
      clickInfo.event.id,
      'receive'
    );

    const bookingId = clickInfo.event.id;
    const booking = allBookings.value.find(b => b.id === bookingId);
    
    if (booking) {
      uiStore.openModal('event', 'edit', {
        booking: booking
      });
    } else {
      console.warn(`Booking with ID ${bookingId} not found`);
    }
  } catch (error) {
    console.error('Error handling event click:', error);
  }
};

const handleEventDrop = (dropInfo: EventDropArg): void => {
  try {
    eventLogger.logEvent(
      'AdminCalendar',
      'HomeAdmin',
      'eventDrop',
      dropInfo.event.id,
      'receive'
    );

    const bookingId = dropInfo.event.id;
    const booking = allBookings.value.find(b => b.id === bookingId);
    
    if (booking) {
      // Update booking with new dates
      updateBooking(booking.id, {
        checkout_date: dropInfo.event.startStr,
        checkin_date: dropInfo.event.endStr || dropInfo.event.startStr
      });
    } else {
      console.warn(`Booking with ID ${bookingId} not found`);
    }
  } catch (error) {
    console.error('Error handling event drop:', error);
  }
};

const handleEventResize = (resizeInfo: any): void => {
  try {
    eventLogger.logEvent(
      'AdminCalendar',
      'HomeAdmin',
      'eventResize',
      resizeInfo.event.id,
      'receive'
    );

    const bookingId = resizeInfo.event.id;
    const booking = allBookings.value.find(b => b.id === bookingId);
    
    if (booking) {
      // Update booking with new end date
      updateBooking(booking.id, {
        checkin_date: resizeInfo.event.endStr || resizeInfo.event.end?.toISOString()
      });
    } else {
      console.warn(`Booking with ID ${bookingId} not found`);
    }
  } catch (error) {
    console.error('Error handling event resize:', error);
  }
};

const handleUpdateBooking = (data: { id: string; updates: Partial<Booking> }): void => {
  try {
    // Use the updates directly from the event
    updateBooking(data.id, data.updates);
  } catch (error) {
    console.error('Error updating booking:', error);
  }
};

// ============================================================================
// EVENT HANDLERS - CALENDAR CONTROLS
// ============================================================================

const handleCalendarViewChange = (view: string): void => {
  try {
    // Convert string view to FullCalendar-specific view names
    let fullCalendarView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
    switch (view) {
      case 'month':
      case 'dayGridMonth':
        fullCalendarView = 'dayGridMonth';
        break;
      case 'week':
      case 'timeGridWeek':
        fullCalendarView = 'timeGridWeek';
        break;
      case 'day':
      case 'timeGridDay':
        fullCalendarView = 'timeGridDay';
        break;
      default:
        fullCalendarView = 'timeGridWeek';
    }
    setCalendarView(fullCalendarView);
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

// ============================================================================
// EVENT HANDLERS - MODAL MANAGEMENT
// ============================================================================

const handleEventModalClose = (): void => {
  try {
    uiStore.closeModal('event');
  } catch (error) {
    console.error('Error closing event modal:', error);
  }
};

const handleEventModalSave = async (bookingData: BookingFormData): Promise<void> => {
  try {
    const mode = eventModalMode.value;
    const isEditing = mode === 'edit';
    
    if (isEditing) {
      const booking = eventModalData.value;
      if (booking) {
        await updateBooking(booking.id, bookingData);
      }
    } else {
      await createBooking(bookingData);
    }
    
    // Close modal after successful save
    uiStore.closeModal('event');
  } catch (error) {
    console.error('Error saving booking:', error);
    // Error handling is done by the composable
  }
};

const handleEventModalDelete = async (bookingId: string): Promise<void> => {
  try {
    const booking = allBookings.value.find(b => b.id === bookingId);
    if (!booking) {
      console.warn(`Booking with ID ${bookingId} not found`);
      return;
    }
    
    // Admin can delete any booking - show confirmation with business impact
    const property = allPropertiesMap.value.get(booking.property_id);
    const propertyName = property?.name || 'Unknown Property';
    
    uiStore.openConfirmDialog('confirm', {
      title: 'Delete Booking',
      message: `Are you sure you want to delete this booking for ${propertyName}? This action cannot be undone and may affect business operations.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      dangerous: true,
      data: {
        onConfirm: async () => {
          await deleteBooking(bookingId);
          uiStore.closeModal('event');
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
      // Get the property ID from modal data since PropertyFormData doesn't include id
      const modalData = uiStore.getModalData('property') as { property?: Property };
      const propertyId = modalData?.property?.id;
      if (propertyId) {
        await updateProperty(propertyId, propertyData);
      }
    }
    
    uiStore.closeModal('property');
  } catch (error) {
    console.error('Error saving property:', error);
    // TODO: Show admin-specific error notification
  }
};

const handlePropertyModalDelete = (propertyId: string): void => {
  try {
    // Show confirmation dialog for admin with business impact warning
    const property = allPropertiesMap.value.get(propertyId);
    const relatedBookings = allBookings.value.filter(booking => booking.property_id === propertyId);
    
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

// ============================================================================
// EVENT HANDLERS - CONFIRMATION DIALOG
// ============================================================================

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

// ============================================================================
// UI HELPERS
// ============================================================================

// ============================================================================
// LIFECYCLE HOOKS
// ============================================================================

onMounted(async () => {
  try {
    // Admin needs to fetch ALL data
    await Promise.all([
      fetchAllBookings(),
      fetchAllProperties()
    ]);
    
    // Set up responsive sidebar
    watch(xs, (newVal) => {
      sidebarOpen.value = !newVal;
    }, { immediate: true });
    
  } catch (error) {
    console.error('Error initializing HomeAdmin:', error);
    // TODO: Show admin-specific error notification
  }
});

onUnmounted(() => {
  // Cleanup if needed
});
</script>

<style scoped>
.home-admin-container {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.sidebar-column {
  position: relative;
  background-color: rgb(var(--v-theme-surface));
  padding-right: 0 !important;
  height: 100vh;
}

.sidebar-container {
  height: 100%;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.6, 1);
}

.sidebar-desktop {
  height: calc(100vh - 64px);
  overflow-y: auto;
}

.sidebar-mobile-hidden {
  transform: translateX(-100%);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  background: rgb(var(--v-theme-surface));
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.calendar-column {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-left: 0 !important;
}

/* Full viewport calendar layout */
.calendar-column.full-viewport-calendar {
  width: 100vw !important;
  margin: 0 !important;
  padding: 0 !important;
}

.calendar-column.full-viewport-calendar.mobile-layout {
  position: fixed !important;
  top: 56px; /* Mobile app bar height */
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  z-index: 1;
  height: calc(100vh - 56px) !important;
}

.calendar-column.full-viewport-calendar.tablet-layout {
  position: fixed !important;
  top: 64px; /* Tablet app bar height */
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  z-index: 1;
  height: calc(100vh - 64px) !important;
}

.calendar-column.full-viewport-calendar.desktop-layout.sidebar-closed {
  position: fixed !important;
  top: 64px; /* Desktop app bar height */
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  z-index: 1;
  width: 100vw !important;
  height: calc(100vh - 64px) !important;
}

/* When sidebar is open on desktop, use normal flex behavior */
.calendar-column.full-viewport-calendar.desktop-layout:not(.sidebar-closed) {
  position: relative;
  flex: 1;
  height: 100%;
  margin-left: 0;
}

.calendar-header {
  padding: 0 !important;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background-color: rgb(var(--v-theme-surface));
  flex-shrink: 0;
  height: 80px;
}

/* Full viewport calendar content */
.full-viewport-calendar .calendar-header {
  width: 100vw !important;
  margin: 0 !important;
  padding: 0 !important;
  border-radius: 0 !important;
}

.full-viewport-calendar .admin-calendar-container {
  width: 100vw !important;
  margin: 0 !important;
  padding: 0 !important;
  border-radius: 0 !important;
}

.full-viewport-calendar.mobile-layout .admin-calendar-container {
  height: calc(100vh - 56px - 10vh) !important; /* Full height minus app bar minus header */
  position: absolute !important;
  top: 10vh !important; /* Below the header */
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
}

.full-viewport-calendar.tablet-layout .admin-calendar-container {
  height: calc(100vh - 64px - 15vh) !important; /* Full height minus app bar minus header */
  position: absolute !important;
  top: 15vh !important; /* Below the header */
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
}

.full-viewport-calendar.desktop-layout .admin-calendar-container {
  height: calc(100vh - 64px - 10vh) !important; /* Full height minus app bar minus header */
  position: absolute !important;
  top: 10vh !important; /* Below the header */
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
}

/* Admin-specific styling */
.home-admin-container .calendar-header {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  color: rgb(var(--v-theme-on-primary));
}

.home-admin-container .calendar-header .v-btn {
  color: rgb(var(--v-theme-on-primary));
}

.home-admin-container .calendar-header .text-h6 {
  color: rgb(var(--v-theme-on-primary));
  font-weight: 600;
}

/* System metrics styling */
.home-admin-container .text-caption {
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

/* Responsive design optimized for Vuetify grid system */
@media (max-width: 959px) { /* md and down */
  .home-admin-container {
    position: relative;
  }
  
  .calendar-column {
    transition: transform 0.3s ease;
  }
  
  .calendar-column.drawer-open {
    transform: translateX(0);
  }
  
  .sidebar-column {
    z-index: 1000;
  }
}

@media (min-width: 960px) { /* lg and up */
  .sidebar-container {
    transform: none !important;
    position: static !important;
    z-index: auto !important;
    box-shadow: none !important;
  }
}

@media (max-width: 600px) {
  .calendar-header {
    padding: 8px;
  }
  
  .calendar-header .d-flex {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .calendar-header .v-btn-toggle {
    margin-left: 0 !important;
    margin-top: 8px;
  }
}

/* Admin color scheme */
.home-admin-container {
  --admin-primary: rgb(var(--v-theme-primary));
  --admin-secondary: rgb(var(--v-theme-secondary));
  --admin-warning: rgb(var(--v-theme-warning));
  --admin-info: rgb(var(--v-theme-info));
}

/* =================================================================== */
/* MOBILE FLOATING ACTION BUTTON */
/* =================================================================== */

.mobile-sidebar-fab {
  position: fixed !important;
  bottom: 40px !important;
  right: 16px !important;
  top: auto !important;
  left: auto !important;
  transform: none !important;
  z-index: 1006 !important;
  transition: transform 0.3s ease, opacity 0.3s ease;
  /* Ensure it's always in viewport corner */
  margin: 0 !important;
  /* Override any Vuetify positioning */
  inset: auto 16px 40px auto !important;
}

.mobile-sidebar-fab.fab-shifted {
  transform: translateX(-10px) !important;
  opacity: 0.9;
}

/* Responsive positioning for different mobile sizes */
@media (max-width: 480px) {
  .mobile-sidebar-fab {
    bottom: 36px !important;
    right: 14px !important;
    inset: auto 14px 36px auto !important;
  }
}

@media (max-width: 360px) {
  .mobile-sidebar-fab {
    bottom: 32px !important;
    right: 12px !important;
    inset: auto 12px 32px auto !important;
  }
}
</style> 