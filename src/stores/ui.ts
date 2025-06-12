import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ModalState, Notification, NotificationType, FilterState } from '@/types';

/**
 * UI store for the Property Cleaning Scheduler
 * Manages UI state like modals, notifications, and loading states
 */
export const useUIStore = defineStore('ui', () => {
  // State
  const modals = ref<Map<string, ModalState>>(new Map());
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
  
  // Getters
  const isModalOpen = computed(() => (modalId: string): boolean => {
    return modals.value.get(modalId)?.open || false;
  });
  
  const getModalState = computed(() => (modalId: string): ModalState | undefined => {
    return modals.value.get(modalId);
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
  function openModal(modalId: string, mode: 'create' | 'edit' | 'view' | 'delete' = 'view', data?: any) {
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
  
  return {
    // State
    modals,
    sidebars,
    notifications,
    loading,
    error,
    filterState,
    currentCalendarView,
    selectedPropertyFilter,
    
    // Getters
    isModalOpen,
    getModalState,
    isSidebarOpen,
    isLoading,
    anyLoading,
    activeNotifications,
    
    // Actions
    openModal,
    closeModal,
    closeAllModals,
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
    setPropertyFilter
  };
}); 