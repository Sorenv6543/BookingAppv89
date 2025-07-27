import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useCalendarState } from './useCalendarState';
import { useBookingStore } from '@/stores/booking';
import { usePropertyStore } from '@/stores/property';
import { useAuthStore } from '@/stores/auth';
import type { Booking, Property } from '@/types';

/**
 * Enhanced Calendar Navigation Composable
 * Extends useCalendarState with advanced navigation features:
 * - Year navigation
 * - Date picker integration
 * - Keyboard shortcuts
 * - Smart navigation (go to next urgent booking, etc.)
 * - Swipe gesture support for mobile
 */
export function useEnhancedCalendarNavigation() {
  const calendarState = useCalendarState();
  const bookingStore = useBookingStore();
  const propertyStore = usePropertyStore();
  const authStore = useAuthStore();

  // Enhanced navigation state
  const isDatePickerOpen = ref(false);
  const selectedDatePickerDate = ref<Date>(new Date());
  const navigationHistory = ref<Date[]>([new Date()]);
  const historyIndex = ref(0);
  const isKeyboardNavEnabled = ref(true);

  // Smart navigation state
  const isSmartNavEnabled = ref(true);
  const quickNavigationOptions = ref([
    { key: 'today', label: 'Today', icon: 'mdi-calendar-today' },
    { key: 'nextTurn', label: 'Next Turn', icon: 'mdi-fire' },
    { key: 'nextUrgent', label: 'Next Urgent', icon: 'mdi-alert' },
    { key: 'busiest', label: 'Busiest Day', icon: 'mdi-calendar-clock' },
    { key: 'thisWeek', label: 'This Week', icon: 'mdi-calendar-week' },
    { key: 'nextWeek', label: 'Next Week', icon: 'mdi-calendar-arrow-right' }
  ]);

  /**
   * Year Navigation Functions
   */
  const goToNextYear = (): void => {
    const date = new Date(calendarState.currentDate.value);
    date.setFullYear(date.getFullYear() + 1);
    goToDateWithHistory(date);
  };

  const goToPrevYear = (): void => {
    const date = new Date(calendarState.currentDate.value);
    date.setFullYear(date.getFullYear() - 1);
    goToDateWithHistory(date);
  };

  /**
   * Enhanced Month Navigation
   */
  const goToNextMonth = (): void => {
    calendarState.next();
    addToHistory(calendarState.currentDate.value);
  };

  const goToPrevMonth = (): void => {
    calendarState.prev();
    addToHistory(calendarState.currentDate.value);
  };

  /**
   * Navigation with History Support
   */
  const goToDateWithHistory = (date: Date): void => {
    calendarState.goToDate(date);
    addToHistory(date);
  };

  const addToHistory = (date: Date): void => {
    // Remove any history after current index (when navigating from middle of history)
    navigationHistory.value = navigationHistory.value.slice(0, historyIndex.value + 1);
    
    // Add new date to history
    navigationHistory.value.push(new Date(date));
    historyIndex.value = navigationHistory.value.length - 1;

    // Limit history to 50 entries
    if (navigationHistory.value.length > 50) {
      navigationHistory.value.shift();
      historyIndex.value--;
    }
  };

  const goBackInHistory = (): boolean => {
    if (historyIndex.value > 0) {
      historyIndex.value--;
      const date = navigationHistory.value[historyIndex.value];
      calendarState.goToDate(date);
      return true;
    }
    return false;
  };

  const goForwardInHistory = (): boolean => {
    if (historyIndex.value < navigationHistory.value.length - 1) {
      historyIndex.value++;
      const date = navigationHistory.value[historyIndex.value];
      calendarState.goToDate(date);
      return true;
    }
    return false;
  };

  /**
   * Date Picker Functions
   */
  const openDatePicker = (): void => {
    selectedDatePickerDate.value = new Date(calendarState.currentDate.value);
    isDatePickerOpen.value = true;
  };

  const closeDatePicker = (): void => {
    isDatePickerOpen.value = false;
  };

  const goToSelectedDate = (): void => {
    goToDateWithHistory(selectedDatePickerDate.value);
    closeDatePicker();
  };

  /**
   * Smart Navigation Functions
   */
  const getNextTurnBooking = (): Booking | null => {
    const now = new Date();
    const turnBookings = Array.from(bookingStore.bookings.values())
      .filter(booking => 
        booking.booking_type === 'turn' && 
        new Date(booking.checkout_date) >= now &&
        booking.status !== 'completed' &&
        booking.status !== 'cancelled'
      )
      .sort((a, b) => 
        new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime()
      );

    return turnBookings.length > 0 ? turnBookings[0] : null;
  };

  const getNextUrgentBooking = (): Booking | null => {
    const now = new Date();
    const urgentBookings = Array.from(bookingStore.bookings.values())
      .filter(booking => 
        booking.priority === 'urgent' && 
        new Date(booking.checkout_date) >= now &&
        booking.status !== 'completed' &&
        booking.status !== 'cancelled'
      )
      .sort((a, b) => 
        new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime()
      );

    return urgentBookings.length > 0 ? urgentBookings[0] : null;
  };

  const getBusiestDay = (): Date | null => {
    const bookingCounts = new Map<string, number>();
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    // Count bookings per day for the next month
    Array.from(bookingStore.bookings.values())
      .filter(booking => {
        const checkoutDate = new Date(booking.checkout_date);
        return checkoutDate >= today && 
               checkoutDate <= nextMonth &&
               booking.status !== 'completed' &&
               booking.status !== 'cancelled';
      })
      .forEach(booking => {
        const dateKey = booking.checkout_date.split('T')[0]; // Get YYYY-MM-DD
        bookingCounts.set(dateKey, (bookingCounts.get(dateKey) || 0) + 1);
      });

    // Find day with most bookings
    let busiestDate: string | null = null;
    let maxCount = 0;

    for (const [date, count] of bookingCounts.entries()) {
      if (count > maxCount) {
        maxCount = count;
        busiestDate = date;
      }
    }

    return busiestDate ? new Date(busiestDate) : null;
  };

  const executeSmartNavigation = async (option: string): Promise<void> => {
    switch (option) {
      case 'today':
        calendarState.goToToday();
        addToHistory(new Date());
        break;
        
      case 'nextTurn': {
        const nextTurn = getNextTurnBooking();
        if (nextTurn) {
          const date = new Date(nextTurn.checkout_date);
          goToDateWithHistory(date);
        }
        break;
      }
      
      case 'nextUrgent': {
        const nextUrgent = getNextUrgentBooking();
        if (nextUrgent) {
          const date = new Date(nextUrgent.checkout_date);
          goToDateWithHistory(date);
        }
        break;
      }
      
      case 'busiest': {
        const busiestDay = getBusiestDay();
        if (busiestDay) {
          goToDateWithHistory(busiestDay);
        }
        break;
      }
      
      case 'thisWeek': {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Go to Sunday
        goToDateWithHistory(startOfWeek);
        if (calendarState.currentView.value !== 'timeGridWeek') {
          calendarState.setCalendarView('timeGridWeek');
        }
        break;
      }
      
      case 'nextWeek': {
        const now = new Date();
        const nextWeek = new Date(now);
        nextWeek.setDate(now.getDate() + 7);
        const startOfWeek = new Date(nextWeek);
        startOfWeek.setDate(nextWeek.getDate() - nextWeek.getDay()); // Go to Sunday
        goToDateWithHistory(startOfWeek);
        if (calendarState.currentView.value !== 'timeGridWeek') {
          calendarState.setCalendarView('timeGridWeek');
        }
        break;
      }
    }
  };

  /**
   * Keyboard Navigation
   */
  const handleKeyboardNavigation = (event: KeyboardEvent): void => {
    if (!isKeyboardNavEnabled.value) return;

    // Ignore if user is typing in an input field
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    switch (event.key) {
      case 'ArrowLeft':
        if (event.altKey) {
          event.preventDefault();
          goBackInHistory();
        } else if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          goToPrevYear();
        } else if (event.shiftKey) {
          event.preventDefault();
          goToPrevMonth();
        } else {
          event.preventDefault();
          calendarState.prev();
        }
        break;

      case 'ArrowRight':
        if (event.altKey) {
          event.preventDefault();
          goForwardInHistory();
        } else if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          goToNextYear();
        } else if (event.shiftKey) {
          event.preventDefault();
          goToNextMonth();
        } else {
          event.preventDefault();
          calendarState.next();
        }
        break;

      case 'Home':
        event.preventDefault();
        calendarState.goToToday();
        addToHistory(new Date());
        break;

      case 't':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          calendarState.goToToday();
          addToHistory(new Date());
        }
        break;

      case 'd':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          openDatePicker();
        }
        break;

      case 'm':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          calendarState.setCalendarView('dayGridMonth');
        }
        break;

      case 'w':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          calendarState.setCalendarView('timeGridWeek');
        }
        break;

      case 'Escape':
        if (isDatePickerOpen.value) {
          event.preventDefault();
          closeDatePicker();
        }
        break;

      case 'Enter':
        if (isDatePickerOpen.value) {
          event.preventDefault();
          goToSelectedDate();
        }
        break;


    }
  };

  /**
   * Touch/Swipe Navigation for Mobile
   */
  let touchStartX = 0;
  let touchStartY = 0;
  let isSwiping = false;

  const handleTouchStart = (event: TouchEvent): void => {
    if (event.touches.length === 1) {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
      isSwiping = false;
    }
  };

  const handleTouchMove = (event: TouchEvent): void => {
    if (event.touches.length === 1) {
      const deltaX = Math.abs(event.touches[0].clientX - touchStartX);
      const deltaY = Math.abs(event.touches[0].clientY - touchStartY);
      
      // Start tracking swipe if horizontal movement is greater than vertical
      if (deltaX > deltaY && deltaX > 10) {
        isSwiping = true;
      }
    }
  };

  const handleTouchEnd = (event: TouchEvent): void => {
    if (isSwiping && event.changedTouches.length === 1) {
      const deltaX = event.changedTouches[0].clientX - touchStartX;
      const threshold = 50; // Minimum distance for a swipe

      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          // Swipe right - go to previous
          calendarState.prev();
        } else {
          // Swipe left - go to next
          calendarState.next();
        }
      }
    }
    isSwiping = false;
  };

  /**
   * Calendar Integration Helpers
   */
  const attachNavigationToCalendar = (calendarRef: any): void => {
    // This will be called by calendar components to integrate navigation
    if (calendarRef?.getApi) {
      const api = calendarRef.getApi();
      
      // Override calendar's navigation methods to use our enhanced ones
      const originalNext = api.next.bind(api);
      const originalPrev = api.prev.bind(api);
      const originalToday = api.today.bind(api);
      const originalGotoDate = api.gotoDate.bind(api);

      api.next = () => {
        originalNext();
        addToHistory(api.getDate());
      };

      api.prev = () => {
        originalPrev();
        addToHistory(api.getDate());
      };

      api.today = () => {
        originalToday();
        addToHistory(new Date());
      };

      api.gotoDate = (date: any) => {
        originalGotoDate(date);
        addToHistory(new Date(date));
      };
    }
  };

  /**
   * Computed Properties
   */
  const canGoBack = computed(() => historyIndex.value > 0);
  const canGoForward = computed(() => historyIndex.value < navigationHistory.value.length - 1);
  
  const currentMonthYear = computed(() => {
    const date = calendarState.currentDate.value;
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  });

  const currentYear = computed(() => calendarState.currentDate.value.getFullYear());

  const smartNavigationCounts = computed(() => {
    const nextTurn = getNextTurnBooking();
    const nextUrgent = getNextUrgentBooking();
    const busiest = getBusiestDay();
    
    return {
      nextTurn: nextTurn ? 1 : 0,
      nextUrgent: nextUrgent ? 1 : 0,
      busiest: busiest ? 1 : 0
    };
  });

  /**
   * Lifecycle
   */
  onMounted(() => {
    // Add keyboard event listeners
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Add touch event listeners for mobile swipe navigation
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
  });

  onUnmounted(() => {
    // Remove event listeners
    document.removeEventListener('keydown', handleKeyboardNavigation);
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  });

  return {
    // Extend base calendar state
    ...calendarState,

    // Enhanced navigation state
    isDatePickerOpen,
    selectedDatePickerDate,
    navigationHistory,
    historyIndex,
    isKeyboardNavEnabled,
    isSmartNavEnabled,
    quickNavigationOptions,

    // Year navigation
    goToNextYear,
    goToPrevYear,

    // Enhanced month navigation
    goToNextMonth,
    goToPrevMonth,

    // History navigation
    goToDateWithHistory,
    goBackInHistory,
    goForwardInHistory,
    canGoBack,
    canGoForward,

    // Date picker
    openDatePicker,
    closeDatePicker,
    goToSelectedDate,

    // Smart navigation
    executeSmartNavigation,
    getNextTurnBooking,
    getNextUrgentBooking,
    getBusiestDay,
    smartNavigationCounts,

    // Keyboard navigation
    handleKeyboardNavigation,

    // Touch navigation
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,

    // Calendar integration
    attachNavigationToCalendar,

    // Computed properties
    currentMonthYear,
    currentYear
  };
}
