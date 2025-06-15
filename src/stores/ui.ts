import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ModalState, ConfirmDialogState, Notification, NotificationType, FilterState, ModalData, FilterValue } from '@/types';

/**
 * UI store for the Property Cleaning Scheduler
 * Manages UI state like modals, notifications, and loading states
 */
export const useUIStore = defineStore('ui', () => {
  // State
  const modals = ref<Map<string, ModalState>>(new Map());
  const confirmDialogs = ref<Map<string, ConfirmDialogState>>(new Map());
  const sidebars = ref<Map<string, boolean>>(new Map([
    ['main', true], // Main sidebar is open by default
    ['filters', false],
    ['details', false]
  ]));
  const notifications = ref<Notification[]>([]);
  const loading = ref<Map<string, boolean>>(new Map([
    ['properties', false],
    ['bookings', false],
    ['auth', false],
    ['calendar', false]
  ]));
  const error = ref<string | null>(null);
  const filterState = ref<FilterState>({
    bookingType: 'all',
    status: 'all',
    dateRange: undefined,
    propertyId: undefined,
    searchTerm: undefined
  });
  const currentCalendarView = ref<string>('timeGridWeek');
  const selectedPropertyFilter = ref<string | null>(null);
  // Additional arbitrary filter values map
  const filterValues = ref<Map<string, FilterValue>>(new Map());
  
  // Getters
  const isModalOpen = computed(() => (modalId: string): boolean => {
    return modals.value.get(modalId)?.open || false;
  });
  
  const getModalState = computed(() => (modalId: string): ModalState | undefined => {
    return modals.value.get(modalId);
  });
  
  const getModalData = computed(() => (modalId: string): ModalData => {
    return modals.value.get(modalId)?.data;
  });
  
  const isConfirmDialogOpen = computed(() => (dialogId: string): boolean => {
    return confirmDialogs.value.get(dialogId)?.open || false;
  });
  
  const getConfirmDialogState = computed(() => (dialogId: string): ConfirmDialogState | undefined => {
    return confirmDialogs.value.get(dialogId);
  });
  
  const isSidebarOpen = computed(() => (sidebarId: string): boolean => {
    return sidebars.value.get(sidebarId) || false;
  });
  
  const isLoading = computed(() => (operation: string): boolean => {
    return loading.value.get(operation) || false;
  });
  
  const anyLoading = computed((): boolean => {
    return Array.from(loading.value.values()).some(value => value === true);
  });
  
  const activeNotifications = computed((): Notification[] => {
    return notifications.value.slice(0, 5); // Only show 5 most recent notifications
  });
  
  // Actions
  function openModal(modalId: string, mode: 'create' | 'edit' | 'view' | 'delete' = 'view', data?: ModalData) {
    modals.value.set(modalId, {
      open: true,
      mode,
      data
    });
  }
  
  function closeModal(modalId: string) {
    const modal = modals.value.get(modalId);
    if (modal) {
      modals.value.set(modalId, {
        ...modal,
        open: false
      });
    }
  }
  
  function closeAllModals() {
    modals.value.forEach((modal, id) => {
      modals.value.set(id, {
        ...modal,
        open: false
      });
    });
  }
  
  function openConfirmDialog(
    dialogId: string, 
    options: {
          title?: string;
          message?: string;
          confirmText?: string;
          cancelText?: string;
          confirmColor?: string;
          dangerous?: boolean;
          data?: ModalData;
        } = {}  
  ) {
    confirmDialogs.value.set(dialogId, {
      open: true,
      title: options.title || '',
      message: options.message || '',
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      confirmColor: options.confirmColor,
      dangerous: options.dangerous,
      data: options.data
    });
  }
  
  function closeConfirmDialog(dialogId: string) {
    const dialog = confirmDialogs.value.get(dialogId);
    if (dialog) {
      confirmDialogs.value.set(dialogId, {
        ...dialog,
        open: false
      });
    }
  }
  
  function closeAllConfirmDialogs() {
    confirmDialogs.value.forEach((dialog, id) => {
      confirmDialogs.value.set(id, {
        ...dialog,
        open: false
      });
    });
  }
  
  function toggleSidebar(sidebarId: string) {
    const currentState = sidebars.value.get(sidebarId) || false;
    sidebars.value.set(sidebarId, !currentState);
  }
  
  function setSidebarState(sidebarId: string, isOpen: boolean) {
    sidebars.value.set(sidebarId, isOpen);
  }
  
  function setLoading(operation: string, isLoading: boolean) {
    loading.value.set(operation, isLoading);
  }
  
  function addNotification(type: NotificationType, title: string, message: string, autoClose: boolean = true) {
    const notification: Notification = {
      id: crypto.randomUUID(),
      type,
      title,
      message,
      read: false,
      timestamp: new Date().toISOString(),
      autoClose,
      duration: autoClose ? 5000 : undefined
    };
    
    notifications.value = [notification, ...notifications.value];
    
    // Keep only last 10 notifications to prevent memory bloat
    if (notifications.value.length > 10) {
      notifications.value = notifications.value.slice(0, 10);
    }
    
    if (autoClose) {
      setTimeout(() => {
        removeNotification(notification.id);
      }, notification.duration);
    }
    
    return notification.id;
  }
  
  function removeNotification(id: string) {
    notifications.value = notifications.value.filter(notification => notification.id !== id);
  }
  
  function clearNotifications() {
    notifications.value = [];
  }
  
  function setError(errorMessage: string | null) {
    error.value = errorMessage;
    
    if (errorMessage) {
      addNotification('error', 'Error', errorMessage);
    }
  }
  
  function updateFilter(filter: Partial<FilterState>) {
    filterState.value = {
      ...filterState.value,
      ...filter
    };
    
    // Keep selectedPropertyFilter in sync with filterState.propertyId
    if (filter.propertyId !== undefined) {
      selectedPropertyFilter.value = filter.propertyId;
    }
  }
  
  function resetFilters() {
    filterState.value = {
      bookingType: 'all',
      status: 'all',
      dateRange: undefined,
      propertyId: undefined,
      searchTerm: undefined
    };
    
    // Reset selectedPropertyFilter too
    selectedPropertyFilter.value = null;
    
    // Also clear the filterValues map
    filterValues.value.clear();
  }
  
  function setCalendarView(view: string) {
    currentCalendarView.value = view;
  }
  
  function setPropertyFilter(propertyId: string | null) {
    selectedPropertyFilter.value = propertyId;
    
    // Keep filterState.propertyId in sync with selectedPropertyFilter
    updateFilter({
      propertyId: propertyId || undefined
    });
  }
  
  /**
   * Set an arbitrary filter value by key
   * This allows for flexible filtering not covered by the FilterState interface
   */
  function setFilter(key: string, value: FilterValue) {
    filterValues.value.set(key, value);
    
    // Special case handling for known filter keys
    if (key === 'calendarView' && typeof value === 'string') {
      setCalendarView(value);
    }
    else if (key === 'dateRangeStart' && typeof value === 'string' && filterState.value.dateRange) {
      updateFilter({
        dateRange: {
          ...filterState.value.dateRange,
          start: value
        }
      });
    }
    else if (key === 'dateRangeEnd' && typeof value === 'string' && filterState.value.dateRange) {
      updateFilter({
        dateRange: {
          ...filterState.value.dateRange,
          end: value
        }
      });
    }
    else if (key === 'dateRangeStart' && typeof value === 'string' && !filterState.value.dateRange) {
      // Initialize dateRange if it doesn't exist
      updateFilter({
        dateRange: {
          start: value,
          end: value // Default to same as start if not set
        }
      });
    }
    else if (key === 'dateRangeEnd' && typeof value === 'string' && !filterState.value.dateRange) {
      // Initialize dateRange if it doesn't exist
      updateFilter({
        dateRange: {
          start: value, // Default to same as end if not set
          end: value
        }
      });
    }
  }
  
  /**
   * Get an arbitrary filter value by key
   * Returns undefined if the filter doesn't exist
   */
  function getFilter(key: string): FilterValue {
    return filterValues.value.get(key);
  }
  
  return {
    // State
    modals,
    confirmDialogs,
    sidebars,
    notifications,
    loading,
    error,
    filterState,
    currentCalendarView,
    selectedPropertyFilter,
    filterValues,
    
    // Getters
    isModalOpen,
    getModalState,
    getModalData,
    isConfirmDialogOpen,
    getConfirmDialogState,
    isSidebarOpen,
    isLoading,
    anyLoading,
    activeNotifications,
    
    // Actions
    openModal,
    closeModal,
    closeAllModals,
    openConfirmDialog,
    closeConfirmDialog,
    closeAllConfirmDialogs,
    toggleSidebar,
    setSidebarState,
    setLoading,
    addNotification,
    removeNotification,
    clearNotifications,
    setError,
    updateFilter,
    resetFilters,
    setCalendarView,
    setPropertyFilter,
    setFilter,
    getFilter
  };
}); 