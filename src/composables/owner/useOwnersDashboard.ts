import { ref, computed, reactive, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

// Owner-specific composables
import { useOwnerBookings } from './useOwnerBookings';
import { useOwnerProperties } from './useOwnerProperties';
import { useOwnerCalendarState } from './useOwnerCalendarState';
import { useOwnerErrorHandler } from './useOwnerErrorHandler';

// Shared composables and stores
import { useAuth } from '@/composables/shared/useAuth';
import { useUIStore } from '@/stores/ui';

// Types
import type { 
  Booking, 
  Property, 
  BookingFormData, 
  PropertyFormData,
  CalendarView 
} from '@/types';
import type { 
  DateSelectArg, 
  EventClickArg, 
  EventDropArg 
} from '@fullcalendar/core';

/**
 * Owner Dashboard Composable
 * 
 * Orchestrates all owner-specific business logic and provides a clean interface
 * for HomeOwner.vue to become a thin orchestrator component.
 * 
 * Key Features:
 * - Consolidates all owner data access (properties, bookings, calendar)
 * - Provides all owner actions (CRUD operations, navigation, event handling)
 * - Manages owner-specific UI state (modals, loading, calendar view)
 * - Handles owner-specific error handling and validation
 * - Enables HomeOwner.vue to be ~200 lines of pure orchestration
 */
export function useOwnerDashboard() {
  // ============================================================================
  // COMPOSABLES & STORES
  // ============================================================================
  
  const router = useRouter();
  const uiStore = useUIStore();
  const { user, isAuthenticated } = useAuth();
  
  // Owner-specific composables (orchestrated)
  const ownerBookings = useOwnerBookings();
  const ownerProperties = useOwnerProperties();
  const ownerCalendar = useOwnerCalendarState();
  const ownerErrorHandler = useOwnerErrorHandler();
  
  // ============================================================================
  // REACTIVE STATE
  // ============================================================================
  
  // Dashboard-specific loading states
  const dashboardLoading = ref(false);
  const sidebarOpen = ref(false);
  
  // Form and modal states
  const bookingFormOpen = ref(false);
  const propertyModalOpen = ref(false);
  const confirmDialogOpen = ref(false);
  
  // Current editing states
  const editingBooking = ref<Booking | null>(null);
  const editingProperty = ref<Property | null>(null);
  
  // Confirmation dialog state
  const confirmDialogState = reactive({
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    dangerous: false,
    onConfirm: () => {}
  });

  // ============================================================================
  // OWNER DATA (Orchestrated from composables)
  // ============================================================================
  
  /**
   * Consolidated owner data object
   * All data is pre-filtered to current owner's scope
   */
  const ownerData = reactive({
    // Properties
    properties: computed(() => ownerProperties.myProperties.value),
    propertiesMap: computed(() => {
      const map = new Map<string, Property>();
      ownerProperties.myProperties.value.forEach(property => {
        map.set(property.id, property);
      });
      return map;
    }),
    activeProperties: computed(() => 
      ownerProperties.myProperties.value.filter(p => p.active)
    ),
    
    // Bookings
    bookings: computed(() => ownerBookings.myBookings.value),
    bookingsMap: computed(() => {
      const map = new Map<string, Booking>();
      ownerBookings.myBookings.value.forEach(booking => {
        map.set(booking.id, booking);
      });
      return map;
    }),
    
    // Today's urgent data
    todayTurns: computed(() => ownerBookings.myTodayTurns.value),
    upcomingCleanings: computed(() => ownerBookings.myUpcomingCleanings.value),
    
    // Calendar data
    calendarEvents: computed(() => ownerCalendar.myCalendarEvents.value),
    filteredBookings: computed(() => ownerCalendar.myFilteredBookings.value),
    turnAlerts: computed(() => ownerCalendar.myTurnAlerts.value),
    
    // Loading states
    isLoading: computed(() => 
      dashboardLoading.value || 
      ownerBookings.loading.value || 
      ownerProperties.loading.value ||
      ownerCalendar.ownerLoading.value
    ),
    
    // Statistics
    stats: computed(() => ({
      totalProperties: ownerProperties.myProperties.value.length,
      activeProperties: ownerData.activeProperties.length,
      totalBookings: ownerBookings.myBookings.value.length,
      todayTurns: ownerBookings.myTodayTurns.value.length,
      upcomingCleanings: ownerBookings.myUpcomingCleanings.value.length
    }))
  });

  // ============================================================================
  // OWNER ACTIONS (Orchestrated business operations)
  // ============================================================================
  
  const ownerActions = {
    
    // ========================================
    // Navigation Actions
    // ========================================
    
    /**
     * Navigate to a specific booking
     */
    navigateToBooking: (bookingId: string) => {
      const booking = ownerData.bookingsMap.get(bookingId);
      if (booking) {
        // Navigate to calendar and highlight booking
        ownerCalendar.goToDate(new Date(booking.checkout_date));
        
        // Highlight the booking
        setTimeout(() => {
          const eventEl = document.querySelector(`[data-booking-id="${bookingId}"]`);
          if (eventEl) {
            eventEl.classList.add('highlighted');
            eventEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      }
    },
    
    /**
     * Navigate to a specific date on calendar
     */
    navigateToDate: (date: Date) => {
      ownerCalendar.goToDate(date);
    },
    
    // ========================================
    // Booking Actions
    // ========================================
    
    /**
     * Open booking creation form
     */
    createBooking: (initialData?: Partial<BookingFormData>) => {
      editingBooking.value = null;
      if (initialData) {
        // Pre-populate form with initial data
        uiStore.setFormData('booking', initialData);
      }
      bookingFormOpen.value = true;
    },
    
    /**
     * Open booking edit form
     */
    editBooking: (booking: Booking) => {
      // Validate ownership
      if (!ownerBookings.validateOwnership(booking.id)) {
        ownerErrorHandler.handleError(
          new Error('You can only edit your own bookings'),
          'booking-edit'
        );
        return;
      }
      
      editingBooking.value = booking;
      uiStore.setFormData('booking', booking);
      bookingFormOpen.value = true;
    },
    
    /**
     * Submit booking form (create or update)
     */
    submitBooking: async (formData: BookingFormData) => {
      try {
        dashboardLoading.value = true;
        
        if (editingBooking.value) {
          // Update existing booking
          await ownerBookings.updateMyBooking(editingBooking.value.id, formData);
          ownerErrorHandler.showSuccess('Booking updated successfully');
        } else {
          // Create new booking
          await ownerBookings.createMyBooking(formData);
          ownerErrorHandler.showSuccess('Booking created successfully');
        }
        
        bookingFormOpen.value = false;
        editingBooking.value = null;
        
      } catch (error) {
        ownerErrorHandler.handleError(error as Error, 'booking-submit');
      } finally {
        dashboardLoading.value = false;
      }
    },
    
    /**
     * Delete booking with confirmation
     */
    deleteBooking: (booking: Booking) => {
      // Validate ownership
      if (!ownerBookings.validateOwnership(booking.id)) {
        ownerErrorHandler.handleError(
          new Error('You can only delete your own bookings'),
          'booking-delete'
        );
        return;
      }
      
      confirmDialogState.title = 'Delete Booking';
      confirmDialogState.message = `Are you sure you want to delete this booking?`;
      confirmDialogState.dangerous = true;
      confirmDialogState.onConfirm = async () => {
        try {
          await ownerBookings.deleteMyBooking(booking.id);
          ownerErrorHandler.showSuccess('Booking deleted successfully');
        } catch (error) {
          ownerErrorHandler.handleError(error as Error, 'booking-delete');
        }
      };
      
      confirmDialogOpen.value = true;
    },
    
    // ========================================
    // Property Actions
    // ========================================
    
    /**
     * Open property creation form
     */
    createProperty: () => {
      editingProperty.value = null;
      propertyModalOpen.value = true;
    },
    
    /**
     * Open property edit form
     */
    editProperty: (property: Property) => {
      // Validate ownership
      if (!ownerProperties.validateOwnership(property.id)) {
        ownerErrorHandler.handleError(
          new Error('You can only edit your own properties'),
          'property-edit'
        );
        return;
      }
      
      editingProperty.value = property;
      propertyModalOpen.value = true;
    },
    
    /**
     * Submit property form (create or update)
     */
    submitProperty: async (formData: PropertyFormData) => {
      try {
        dashboardLoading.value = true;
        
        if (editingProperty.value) {
          // Update existing property
          await ownerProperties.updateMyProperty(editingProperty.value.id, formData);
          ownerErrorHandler.showSuccess('Property updated successfully');
        } else {
          // Create new property
          await ownerProperties.createMyProperty(formData);
          ownerErrorHandler.showSuccess('Property created successfully');
        }
        
        propertyModalOpen.value = false;
        editingProperty.value = null;
        
      } catch (error) {
        ownerErrorHandler.handleError(error as Error, 'property-submit');
      } finally {
        dashboardLoading.value = false;
      }
    },
    
    // ========================================
    // Calendar Actions
    // ========================================
    
    /**
     * Handle calendar date selection
     */
    handleDateSelect: (selectInfo: DateSelectArg) => {
      ownerCalendar.handleOwnerDateSelect(selectInfo);
    },
    
    /**
     * Handle calendar event click
     */
    handleEventClick: (clickInfo: EventClickArg) => {
      ownerCalendar.handleOwnerEventClick(clickInfo);
    },
    
    /**
     * Handle calendar event drop/resize
     */
    handleEventDrop: (dropInfo: EventDropArg) => {
      // Owner can only modify their own events
      const bookingId = dropInfo.event.extendedProps?.bookingId;
      if (bookingId && ownerBookings.validateOwnership(bookingId)) {
        // Handle the drop/resize
        ownerCalendar.handleOwnerEventDrop(dropInfo);
      } else {
        dropInfo.revert();
        ownerErrorHandler.handleError(
          new Error('You can only modify your own bookings'),
          'calendar-event-drop'
        );
      }
    },
    
    // ========================================
    // Filter Actions
    // ========================================
    
    /**
     * Filter calendar by property
     */
    filterByProperty: (propertyId: string | null) => {
      if (propertyId) {
        ownerCalendar.filterByOwnerProperty(propertyId);
      } else {
        ownerCalendar.clearOwnerPropertyFilters();
      }
    },
    
    /**
     * Clear all filters
     */
    clearFilters: () => {
      ownerCalendar.clearOwnerPropertyFilters();
    },
    
    // ========================================
    // UI Actions
    // ========================================
    
    /**
     * Toggle sidebar visibility
     */
    toggleSidebar: () => {
      sidebarOpen.value = !sidebarOpen.value;
    },
    
    /**
     * Close all modals and forms
     */
    closeModals: () => {
      bookingFormOpen.value = false;
      propertyModalOpen.value = false;
      confirmDialogOpen.value = false;
      editingBooking.value = null;
      editingProperty.value = null;
    },
    
    /**
     * Handle confirmation dialog confirm
     */
    handleConfirmDialogConfirm: () => {
      confirmDialogState.onConfirm();
      confirmDialogOpen.value = false;
    },
    
    /**
     * Handle confirmation dialog cancel
     */
    handleConfirmDialogCancel: () => {
      confirmDialogOpen.value = false;
    }
  };

  // ============================================================================
  // CALENDAR STATE (From ownerCalendar composable)
  // ============================================================================
  
  const calendarState = reactive({
    currentView: computed({
      get: () => ownerCalendar.currentView.value,
      set: (value: CalendarView) => ownerCalendar.setCalendarView(value)
    }),
    
    currentDate: computed({
      get: () => ownerCalendar.currentDate.value,
      set: (value: Date) => ownerCalendar.goToDate(value)
    }),
    
    formattedDate: computed(() => 
      ownerCalendar.currentDate.value.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      })
    ),
    
    selectedPropertyIds: computed(() => ownerCalendar.selectedPropertyIds?.value || []),
    
    // Calendar navigation actions
    goToToday: () => ownerCalendar.goToToday(),
    next: () => ownerCalendar.next(),
    prev: () => ownerCalendar.prev(),
  });

  // ============================================================================
  // UI STATE (Modal and form states)
  // ============================================================================
  
  const uiState = reactive({
    // Sidebar state
    sidebarOpen: computed({
      get: () => sidebarOpen.value,
      set: (value: boolean) => sidebarOpen.value = value
    }),
    
    // Modal states
    modals: computed(() => ({
      bookingForm: bookingFormOpen.value,
      propertyModal: propertyModalOpen.value,
      confirmDialog: confirmDialogOpen.value
    })),
    
    // Editing states
    editing: computed(() => ({
      booking: editingBooking.value,
      property: editingProperty.value
    })),
    
    // Confirmation dialog
    confirmDialog: computed(() => ({
      ...confirmDialogState,
      open: confirmDialogOpen.value
    })),
    
    // Error and success states
    notifications: computed(() => ({
      error: ownerErrorHandler.error.value,
      success: ownerErrorHandler.success.value
    }))
  });

  // ============================================================================
  // LIFECYCLE MANAGEMENT
  // ============================================================================
  
  /**
   * Initialize dashboard data
   */
  const initializeDashboard = async () => {
    if (!isAuthenticated.value) return;
    
    try {
      dashboardLoading.value = true;
      
      // Load all owner data in parallel
      await Promise.all([
        ownerProperties.fetchMyProperties(),
        ownerBookings.fetchMyBookings()
      ]);
      
    } catch (error) {
      ownerErrorHandler.handleError(
        error as Error, 
        'dashboard-initialization'
      );
    } finally {
      dashboardLoading.value = false;
    }
  };
  
  // ============================================================================
  // WATCHERS
  // ============================================================================
  
  // Watch authentication state
  watch(isAuthenticated, (newValue) => {
    if (newValue) {
      initializeDashboard();
    }
  });
  
  // Auto-close sidebar on mobile when view changes
  watch(() => calendarState.currentView, () => {
    // Close sidebar on mobile when calendar view changes
    // This will be handled by the component based on breakpoints
  });

  // ============================================================================
  // LIFECYCLE HOOKS
  // ============================================================================
  
  onMounted(() => {
    if (isAuthenticated.value) {
      initializeDashboard();
    }
  });
  
  onUnmounted(() => {
    // Cleanup any subscriptions or intervals if needed
    ownerActions.closeModals();
  });

  // ============================================================================
  // RETURN DASHBOARD INTERFACE
  // ============================================================================
  
  return {
    // Consolidated owner data (reactive, computed)
    ownerData,
    
    // All owner actions (functions)
    ownerActions,
    
    // Calendar state (reactive)
    calendarState,
    
    // UI state (reactive)
    uiState,
    
    // Utility functions
    initializeDashboard,
    
    // For backward compatibility with any direct access needs
    composables: {
      bookings: ownerBookings,
      properties: ownerProperties,
      calendar: ownerCalendar,
      errorHandler: ownerErrorHandler
    }
  };
}