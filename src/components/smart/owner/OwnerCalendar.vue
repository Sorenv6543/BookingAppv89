<template>
  <div class="owner-calendar-container">
    <!-- Enhanced Owner Calendar Navigation Toolbar -->
    <EnhancedNavigationToolbar
      :current-view="enhancedNavigation.currentView.value"
      :current-date="enhancedNavigation.currentDate.value"
      :current-month-year="enhancedNavigation.currentMonthYear.value"
      :current-year="enhancedNavigation.currentYear.value"
      :can-go-back="enhancedNavigation.canGoBack.value"
      :can-go-forward="enhancedNavigation.canGoForward.value"
      :smart-navigation-counts="enhancedNavigation.smartNavigationCounts.value"
      :loading="props.loading"
      class="mb-3"
      @navigate="handleEnhancedNavigation"
      @view-change="handleEnhancedViewChange"
      @date-selected="handleEnhancedDateSelected"
      @smart-navigate="handleSmartNavigation"
    />

    <!-- Owner Calendar: Shows only owner's bookings across their properties -->
    <FullCalendar
      ref="calendarRef"
      :bookings="props.bookings"
      :properties="props.properties"
      :loading="props.loading"
      class="owner-calendar"
      @date-select="handleDateSelect"
      @event-click="handleEventClick"
      @event-drop="handleEventDrop"
      @event-resize="handleEventResize"
      @create-booking="handleCreateBooking"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';
import FullCalendar from '@/components/smart/FullCalendar.vue';
import { useEnhancedCalendarNavigation } from '@/composables/shared/useEnhancedCalendarNavigation';
import EnhancedNavigationToolbar from '@/components/dumb/shared/EnhancedNavigationToolbar.vue';
import type { Booking, Property } from '@/types';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';

console.log('🔄 [OwnerCalendar] Script setup running...');

interface Props {
  bookings: Map<string, Booking>;
  properties: Map<string, Property>;
  loading?: boolean;
  currentView?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
  currentDate?: Date;
}

interface Emits {
  (e: 'dateSelect', selectInfo: DateSelectArg): void;
  (e: 'eventClick', clickInfo: EventClickArg): void;
  (e: 'eventDrop', dropInfo: EventDropArg): void;
  (e: 'eventResize', resizeInfo: any): void;
  (e: 'createBooking', data: { start: string; end: string; propertyId?: string }): void;
  (e: 'viewChange', view: string): void;
  (e: 'dateChange', date: Date): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  currentView: 'timeGridWeek',
  currentDate: () => new Date()
});

const emit = defineEmits<Emits>();

// ===== REFS AND REACTIVE DATA =====
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);

// Enhanced Calendar Navigation (Replaces basic prop-based navigation)
const enhancedNavigation = useEnhancedCalendarNavigation();

// ===== COMPUTED PROPERTIES (SAFE - NO CIRCULAR DEPENDENCIES) =====
// Removed height computed properties - using CSS flexbox instead

// ===== EVENT HANDLERS (SAFE - SIMPLE EMIT PATTERNS) =====

const handleDateSelect = (selectInfo: DateSelectArg): void => {
  console.log('🗓️ [OwnerCalendar] Date selected:', selectInfo.startStr, 'to', selectInfo.endStr);
  emit('dateSelect', selectInfo);
};

const handleEventClick = (clickInfo: EventClickArg): void => {
  console.log('👆 [OwnerCalendar] Event clicked:', clickInfo.event.id);
  emit('eventClick', clickInfo);
};

const handleEventDrop = (dropInfo: EventDropArg): void => {
  console.log('🎯 [OwnerCalendar] Event dropped:', dropInfo.event.id);
  emit('eventDrop', dropInfo);
};

const handleEventResize = (resizeInfo: any): void => {
  console.log('🔄 [OwnerCalendar] Event resized:', resizeInfo.event.id);
  emit('eventResize', resizeInfo);
};

const handleCreateBooking = (data: { start: string; end: string; propertyId?: string }): void => {
  console.log('➕ [OwnerCalendar] Create booking:', data);
  emit('createBooking', data);
};

// Removed handleUpdateBooking - now handled through eventDrop/eventResize events

// ===== PROGRAMMATIC CALENDAR METHODS =====

const goToDate = (date: string | Date): void => {
  console.log('🗓️ [OwnerCalendar] goToDate called:', date);
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  enhancedNavigation.goToDateWithHistory(targetDate);
  
  if (calendarRef.value) {
    calendarRef.value.goToDate(targetDate);
  }
  
  // Emit date change event
  emit('dateChange', targetDate);
};

const changeView = (view: string): void => {
  console.log('👁️ [OwnerCalendar] changeView called:', view);
  enhancedNavigation.setCalendarView(view as 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay');
  
  if (calendarRef.value) {
    calendarRef.value.changeView(view);
  }
  emit('viewChange', view);
};

const refreshEvents = (): void => {
  console.log('🔄 [OwnerCalendar] refreshEvents called');
  if (calendarRef.value) {
    calendarRef.value.refreshEvents();
  }
};

const getApi = () => {
  return calendarRef.value?.getApi() || null;
};

// Enhanced Navigation Event Handlers
const handleEnhancedNavigation = (action: string): void => {
  console.log('🧭 [OwnerCalendar] Enhanced navigation:', action);
  
  switch (action) {
    case 'prev':
      enhancedNavigation.goToPrevMonth();
      break;
    case 'next':
      enhancedNavigation.goToNextMonth();
      break;
    case 'prevYear':
      enhancedNavigation.goToPrevYear();
      break;
    case 'nextYear':
      enhancedNavigation.goToNextYear();
      break;
    case 'today':
      enhancedNavigation.goToToday();
      break;
    case 'historyBack':
      enhancedNavigation.goBackInHistory();
      break;
    case 'historyForward':
      enhancedNavigation.goForwardInHistory();
      break;
  }
  
  // Update calendar API to match enhanced navigation state
  if (calendarRef.value) {
    const api = calendarRef.value.getApi();
    api?.gotoDate(enhancedNavigation.currentDate.value);
  }
  
  emit('dateChange', enhancedNavigation.currentDate.value);
};

const handleEnhancedViewChange = (view: string): void => {
  console.log('👁️ [OwnerCalendar] Enhanced view change:', view);
  enhancedNavigation.setCalendarView(view as 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay');
  
  // Update calendar API
  if (calendarRef.value) {
    const api = calendarRef.value.getApi();
    api?.changeView(view);
  }
  
  emit('viewChange', view);
};

const handleEnhancedDateSelected = (date: Date): void => {
  console.log('📅 [OwnerCalendar] Enhanced date selected:', date);
  enhancedNavigation.goToDateWithHistory(date);
  
  // Update calendar API
  if (calendarRef.value) {
    const api = calendarRef.value.getApi();
    api?.gotoDate(date);
  }
  
  emit('dateChange', date);
};

const handleSmartNavigation = async (option: string): Promise<void> => {
  console.log('🧠 [OwnerCalendar] Smart navigation:', option);
  await enhancedNavigation.executeSmartNavigation(option);
  
  // Update calendar API to match new date
  if (calendarRef.value) {
    const api = calendarRef.value.getApi();
    api?.gotoDate(enhancedNavigation.currentDate.value);
  }
  
  emit('dateChange', enhancedNavigation.currentDate.value);
};

// ===== WATCHERS (SAFE - SIMPLE, NON-CIRCULAR) =====

// Watch for view changes from parent (safe - simple prop watching)
watch(() => props.currentView, (newView) => {
  console.log('🎯 [OwnerCalendar] Current view changed from parent:', newView);
  
  nextTick(() => {
    if (newView && calendarRef.value) {
      enhancedNavigation.setCalendarView(newView);
      changeView(newView);
    }
  });
});

// Watch for date changes from parent (safe - simple prop watching)
watch(() => props.currentDate, (newDate) => {
  console.log('📅 [OwnerCalendar] Current date changed from parent:', newDate);
  
  nextTick(() => {
    if (newDate && calendarRef.value) {
      enhancedNavigation.goToDateWithHistory(newDate);
      goToDate(newDate);
    }
  });
});

// Watch enhanced navigation view changes
watch(() => enhancedNavigation.currentView.value, (newView) => {
  console.log('🎯 [OwnerCalendar] Enhanced navigation view changed:', newView);
  if (calendarRef.value) {
    const api = calendarRef.value.getApi();
    api?.changeView(newView);
  }
});

// Watch enhanced navigation date changes
watch(() => enhancedNavigation.currentDate.value, (newDate) => {
  console.log('📅 [OwnerCalendar] Enhanced navigation date changed:', newDate);
  if (calendarRef.value) {
    const api = calendarRef.value.getApi();
    api?.gotoDate(newDate);
  }
});

// ===== LIFECYCLE =====
onMounted(async () => {
  console.log('🎬 [OwnerCalendar] Component mounted');
  
  // Wait for DOM to be fully ready
  await nextTick();
  
  // Small delay to ensure calendar is ready
  setTimeout(() => {
    // Integrate enhanced navigation with calendar
    if (calendarRef.value) {
      enhancedNavigation.attachNavigationToCalendar(calendarRef.value);
      console.log('🔗 [OwnerCalendar] Enhanced navigation attached to calendar');
    }
  }, 100);
});

console.log('✅ [OwnerCalendar] Setup complete - using enhanced navigation patterns!');

// ===== EXPOSE METHODS TO PARENT =====
defineExpose({
  goToDate,
  changeView,
  refreshEvents,
  getApi
});
</script>

<style scoped>
/* ================================================================ */
/* MOBILE-FIRST CALENDAR CONTAINER */
/* ================================================================ */

.owner-calendar-container {
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.owner-calendar {
  flex: 1;
  min-height: 0;
  width: 100%;
  height: 100%;
  position: relative;
}

/* ================================================================ */
/* OWNER-SPECIFIC FULLCALENDAR STYLING */
/* ================================================================ */

/* Enhanced turn booking styling for owners */
:deep(.fc-event.booking-turn) {
  font-weight: 600;
  border-width: 3px !important;
  position: relative;
}

/* Urgent priority styling with owner branding */
:deep(.fc-event.priority-urgent) {
  animation: pulse-owner-urgent 2s infinite;
  border-color: #d32f2f !important;
}

/* High priority styling */
:deep(.fc-event.priority-high) {
  border-left: 4px solid #ff9800 !important;
}

/* Owner calendar specific adjustments */
:deep(.fc-header-toolbar) {
  margin-bottom: 0.5em;
}

:deep(.fc-daygrid-day-number) {
  font-weight: 500;
}

:deep(.fc-col-header-cell) {
  background: rgb(var(--v-theme-surface-variant));
}

/* ================================================================ */
/* ANIMATIONS FOR OWNER CALENDAR */
/* ================================================================ */

@keyframes pulse-owner-urgent {
  0% { 
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.8);
    transform: scale(1);
  }
  70% { 
    box-shadow: 0 0 0 6px rgba(244, 67, 54, 0);
    transform: scale(1.01);
  }
  100% { 
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
    transform: scale(1);
  }
}

/* ================================================================ */
/* RESPONSIVE ADJUSTMENTS FOR OWNERS */
/* ================================================================ */

/* Mobile portrait - Optimize for owner's mobile usage */
@media (max-width: 599px) {
  .owner-calendar-container {
    /* Ensure proper height calculation for mobile */
    height: 100% !important;
    font-size: 0.875rem;
    /* Prevent content from being cut off */
    overflow: hidden;
  }
  
  .owner-calendar {
    /* Force full height utilization on mobile */
    height: 100% !important;
    width: 100% !important;
  }
  
  /* Smaller event text for mobile */
  :deep(.fc-event-title) {
    font-size: 0.7rem;
    line-height: 1.1;
    /* Ensure text doesn't overflow on small screens */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  /* Compact day cells */
  :deep(.fc-daygrid-day-number) {
    font-size: 0.75rem;
    padding: 2px;
  }
  
  /* Mobile-optimized day cell heights */
  :deep(.fc-daygrid-day-frame) {
    min-height: 35px;
  }
  
  /* Improve touch targets on mobile */
  :deep(.fc-event) {
    min-height: 20px;
    padding: 1px 2px;
  }
}

/* Tablet landscape - Good balance for owners */
@media (min-width: 600px) and (max-width: 1279px) {
  .owner-calendar-container {
    font-size: 0.9rem;
    height: 100% !important;
  }
  
  .owner-calendar {
    height: 100% !important;
    width: 100% !important;
  }
  
  :deep(.fc-event-title) {
    font-size: 0.8rem;
    line-height: 1.2;
  }
  
  /* Tablet-optimized day cell heights */
  :deep(.fc-daygrid-day-frame) {
    min-height: 45px;
  }
}

/* Desktop - Full feature set for owners */
@media (min-width: 1280px) {
  .owner-calendar-container {
    font-size: 1rem;
  }
  
  /* Enhanced hover effects on desktop */
  :deep(.fc-event) {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  :deep(.fc-event:hover) {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    z-index: 10;
  }
}
</style> 