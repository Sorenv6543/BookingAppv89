<template>
  <div class="calendar-container">
    <FullCalendar
      ref="calendarRef"
      :options="calendarOptions"
      class="custom-calendar"
    />
    
    <!-- Owner Day View Bottom Sheet -->
    <!-- <OwnerDayViewBottomSheet
      v-model:visible="dayViewVisible"
      :date="selectedDate"
      :bookings="selectedDayBookings"
      :properties="properties"
      @view-booking="handleViewBooking"
      @edit-booking="handleEditBooking"
      @complete-booking="handleCompleteBooking"
      @add-booking="handleAddBookingFromDayView"
    /> -->
  </div>
</template>

<script setup lang="ts">
// FullCalendar imports
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { 
  CalendarOptions, 
  DateSelectArg, 
  EventClickArg, 
  EventDropArg 
} from '@fullcalendar/core';
import type { DateClickArg, EventResizeDoneArg } from '@fullcalendar/interaction';

// Vue imports
import { computed, ref, shallowRef, watch, onMounted, onUnmounted, onBeforeUnmount } from 'vue';
import { useTheme } from 'vuetify';

// App imports
import type { Booking, Property } from '@/types';
import { getMobileCalendarOptions, handleViewportResize } from '@/utils/mobileViewport';
// import OwnerDayViewBottomSheet from '@/components/dumb/owner/OwnerDayViewBottomSheet.vue';
import { useAuthStore } from '@/stores/auth';
import eventLogger from '@/composables/shared/useComponentEventLogger';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Props {
  bookings: Map<string, Booking>;
  properties: Map<string, Property>;
  loading?: boolean;
}

interface Emits {
  (e: 'dateSelect', selectInfo: DateSelectArg): void;
  (e: 'eventClick', clickInfo: EventClickArg): void;
  (e: 'eventDrop', dropInfo: EventDropArg): void;
  (e: 'eventResize', resizeInfo: EventResizeDoneArg): void;
  (e: 'createBooking', data: { start: string; end: string; propertyId?: string }): void;
  (e: 'updateBooking', data: { id: string; start: string; end: string }): void;
}

// ============================================================================
// PROPS & EMITS
// ============================================================================

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

const emit = defineEmits<Emits>();

// ============================================================================
// COMPOSABLES & REFS
// ============================================================================

const theme = useTheme();
const authStore = useAuthStore();
const calendarRef = shallowRef<InstanceType<typeof FullCalendar> | null>(null);

// Day view bottom sheet state
const dayViewVisible = ref(false);
const selectedDate = ref<Date | null>(null);
const selectedDayBookings = ref<Booking[]>([]);

// Mobile viewport management
const mobileOptions = ref(getMobileCalendarOptions());
let cleanupViewportListener: (() => void) | null = null;

// ============================================================================
// PROPERTY COLORS
// ============================================================================

const PROPERTY_COLORS = [
  { bg: '#1976D2', border: '#1256a1', text: '#ffffff' },
  { bg: '#e6325a', border: '#c41e3a', text: '#ffffff' },
  { bg: '#00c853', border: '#009624', text: '#ffffff' },
  { bg: '#7c4dff', border: '#5a1ecc', text: '#ffffff' },
  { bg: '#00bcd4', border: '#0097a7', text: '#ffffff' },
  { bg: '#ff9100', border: '#c66d00', text: '#ffffff' },
  { bg: '#e8507f', border: '#c43a65', text: '#ffffff' },
  { bg: '#ffd600', border: '#c6a700', text: '#333333' },
  { bg: '#00e676', border: '#00b248', text: '#ffffff' },
  { bg: '#d500f9', border: '#a000c4', text: '#ffffff' },
];

const propertyColorMap = new Map<string, number>();

const getPropertyColorIndex = (propertyId: string): number => {
  if (propertyColorMap.has(propertyId)) {
    return propertyColorMap.get(propertyId)!;
  }
  const index = propertyColorMap.size % PROPERTY_COLORS.length;
  propertyColorMap.set(propertyId, index);
  return index;
};

watch(() => props.properties, (newProps) => {
  propertyColorMap.clear();
  let i = 0;
  for (const id of newProps.keys()) {
    propertyColorMap.set(id, i % PROPERTY_COLORS.length);
    i++;
  }
}, { immediate: true });

const getEventColor = (booking: Booking): string => {
  const idx = getPropertyColorIndex(booking.property_id);
  return PROPERTY_COLORS[idx].bg;
};

const getEventBorderColor = (): string => '#9e9e9e';

const getEventTextColor = (booking: Booking): string => {
  if (booking.status === 'completed') return '#E0E0E0';
  const idx = getPropertyColorIndex(booking.property_id);
  return PROPERTY_COLORS[idx].text;
};

// ============================================================================
// CALENDAR EVENTS
// ============================================================================

const addOneDay = (dateString: string): string => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
};

const convertBookingToEvent = (booking: Booking, property: Property | undefined) => {
  const isTurn = booking.booking_type === 'turn';
  const isUrgent = booking.priority === 'urgent';

  const eventColor = getEventColor(booking);
  const borderColor = getEventBorderColor();
  const textColor = getEventTextColor(booking);

  return {
    id: booking.id,
    title: `${property?.name || 'Unknown Property'} - ${isTurn ? 'TURN' : 'Standard'}`,
    start: booking.checkin_date,
    end: addOneDay(booking.checkout_date),
    backgroundColor: eventColor,
    borderColor: borderColor,
    textColor: textColor,
    editable: true,
    startEditable: true,
    durationEditable: true,
    overlap: true,
    extendedProps: {
      booking,
      property,
      bookingType: booking.booking_type,
      status: booking.status,
      priority: booking.priority,
      guestCount: booking.guest_count,
      notes: booking.notes,
      eventColor,
      borderColor,
      textColor
    },
    classNames: [
      `booking-${booking.booking_type}`,
      `status-${booking.status}`,
      `priority-${booking.priority}`,
      `type-${booking.booking_type}-${booking.priority}`,
      isTurn ? 'turn-booking-event' : 'standard-booking-event',
      isUrgent && isTurn ? 'turn-urgent-event' : '',
      isUrgent ? 'urgent-event' : ''
    ].filter(Boolean)
  };
};

const calendarEvents = computed(() => {
  return Array.from(props.bookings.values()).map(booking => {
    const property = props.properties.get(booking.property_id);
    return convertBookingToEvent(booking, property);
  });
});

// ============================================================================
// CALENDAR OPTIONS
// ============================================================================

const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: { left: '', center: '', right: '' },
  
  // Event settings
  events: calendarEvents.value,
  eventDisplay: mobileOptions.value.eventDisplay,
  eventOverlap: true,
  eventResizableFromStart: true,
  eventStartEditable: true,
  eventDurationEditable: true,
  
  // Interaction settings
  selectable: true,
  selectMirror: true,
  editable: true,
  droppable: true,
  eventDrop: handleEventDrop,
  eventResize: handleEventResize,
  
  // Date/time settings
  locale: 'en',
  timeZone: 'local',
  slotMinTime: '06:00:00',
  slotMaxTime: '22:00:00',
  slotDuration: '01:00:00',
  snapDuration: '00:30:00',
  
  // Layout settings
  height: mobileOptions.value.height,
  aspectRatio: undefined,
  expandRows: true,
  themeSystem: 'standard',
  
  // Event handlers
  select: handleDateSelect,
  eventClick: handleEventClick,
  dateClick: handleDateClick,
  loading: handleLoading,
  datesSet: handleCalendarMount,
  viewDidMount: handleViewMount,
  eventContent: renderEventContent,
  
  // Business hours
  businessHours: {
    daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
    startTime: '08:00',
    endTime: '18:00'
  },
  
  // View settings
  weekends: true,
  dayMaxEvents: mobileOptions.value.dayMaxEvents,
  moreLinkClick: 'popover',
  allDaySlot: false,
  nowIndicator: true,
  scrollTime: '08:00:00'
}));

// ============================================================================
// EVENT HANDLERS
// ============================================================================

const handleDateSelect = (selectInfo: DateSelectArg): void => {
  eventLogger.logEvent('FullCalendar', 'Home', 'dateSelect', 
    { start: selectInfo.startStr, end: selectInfo.endStr }, 'emit');
  
  emit('dateSelect', selectInfo);

  const bookingsArray = Array.from(props.bookings.values());
  const adjacentBooking = bookingsArray.find(b => b.checkout_date === selectInfo.startStr);

  emit('createBooking', {
    start: selectInfo.startStr,
    end: selectInfo.endStr,
    propertyId: adjacentBooking?.property_id
  });
  
  selectInfo.view.calendar.unselect();
};

const handleEventClick = (clickInfo: EventClickArg): void => {
  eventLogger.logEvent('FullCalendar', 'Home', 'eventClick', 
    { id: clickInfo.event.id }, 'emit');
  emit('eventClick', clickInfo);
};

const handleEventDrop = (dropInfo: EventDropArg): void => {
  const booking = dropInfo.event.extendedProps.booking as Booking;
  
  eventLogger.logEvent('FullCalendar', 'Home', 'eventDrop', { 
    id: booking.id, 
    start: dropInfo.event.startStr, 
    end: dropInfo.event.endStr || dropInfo.event.startStr 
  }, 'emit');
  
  emit('eventDrop', dropInfo);
  emit('updateBooking', {
    id: booking.id,
    start: dropInfo.event.startStr,
    end: dropInfo.event.endStr || dropInfo.event.startStr
  });
};

const handleEventResize = (resizeInfo: EventResizeDoneArg): void => {
  const booking = resizeInfo.event.extendedProps.booking as Booking;
  
  eventLogger.logEvent('FullCalendar', 'Home', 'eventResize', { 
    id: booking.id, 
    start: resizeInfo.event.startStr, 
    end: resizeInfo.event.endStr || resizeInfo.event.startStr 
  }, 'emit');
  
  emit('eventResize', resizeInfo);
  emit('updateBooking', {
    id: booking.id,
    start: resizeInfo.event.startStr,
    end: resizeInfo.event.endStr || resizeInfo.event.startStr
  });
};

const handleDateClick = (arg: DateClickArg): void => {
  selectedDate.value = arg.date;
  
  const clickedDate = arg.dateStr;
  const currentUserId = authStore.user?.id;
  const dayBookings = Array.from(props.bookings.values()).filter(booking => {
    const checkinDate = booking.checkin_date;
    const checkoutDate = booking.checkout_date;
    const dateMatches = clickedDate >= checkinDate && clickedDate < checkoutDate;
    const ownerMatches = !currentUserId || booking.owner_id === currentUserId;
    return dateMatches && ownerMatches;
  });
  
  selectedDayBookings.value = dayBookings;
  dayViewVisible.value = true;
};

const handleLoading = (isLoading: boolean): void => {
  eventLogger.logEvent('FullCalendar', 'Home', 'loadingState', { isLoading }, 'emit');
};

const handleCalendarMount = (): void => {
  attachMoreLinkListeners();
};

const handleViewMount = (): void => {
  setTimeout(() => attachMoreLinkListeners(), 100);
};

// ============================================================================
// EVENT RENDERING
// ============================================================================

const renderEventContent = (eventInfo: { 
  event: { 
    extendedProps: { 
      booking: Booking; 
      property: Property; 
      eventColor?: string; 
      borderColor?: string; 
      textColor?: string 
    }; 
    backgroundColor?: string; 
    borderColor?: string; 
    textColor?: string 
  } 
}) => {
  const booking = eventInfo.event.extendedProps.booking as Booking;
  const property = eventInfo.event.extendedProps.property as Property;
  const eventColor = eventInfo.event.extendedProps.eventColor || eventInfo.event.backgroundColor;
  const borderColor = eventInfo.event.extendedProps.borderColor || eventInfo.event.borderColor;
  const textColor = eventInfo.event.extendedProps.textColor || eventInfo.event.textColor;
  
  const getPriorityIcon = (priority: string, type: string) => {
    if (type === 'turn') {
      const icons: Record<string, string> = { urgent: '🚨', high: '🔥', normal: '🏠', low: '🧹' };
      return icons[priority] || '🏠';
    }
    const icons: Record<string, string> = { urgent: '⚡', high: '⭐', normal: '🏠', low: '✨' };
    return icons[priority] || '🏠';
  };
  
  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = { 
      completed: '✅', pending: '⏳', confirmed: '📋', in_progress: '🔄' 
    };
    return badges[status] || '📋';
  };
  
  const priorityIcon = getPriorityIcon(booking.priority || 'normal', booking.booking_type);
  const statusBadge = getStatusBadge(booking.status || 'pending');
  
  return {
    html: `
      <div class="fc-event-content-wrapper booking-${booking.booking_type} priority-${booking.priority}" 
           style="background-color: ${eventColor}; border-color: ${borderColor}; color: ${textColor};">
        <div class="fc-event-title">
          ${priorityIcon} ${property?.name || 'Property'}
        </div>
        <div class="fc-event-subtitle">
          ${statusBadge} ${booking.status.toUpperCase()}
          ${booking.guest_count ? ` • ${booking.guest_count}👥` : ''}
        </div>
      </div>
    `
  };
};

// ============================================================================
// DAY VIEW HANDLERS
// ============================================================================

const handleViewBooking = (booking: Booking): void => {
  dayViewVisible.value = false;
  
  const calendarApi = calendarRef.value?.getApi();
  if (calendarApi) {
    const event = calendarApi.getEventById(booking.id);
    if (event) {
      const clickInfo = {
        event: event,
        jsEvent: new MouseEvent('click'),
        view: calendarApi.view,
        el: document.createElement('div')
      };
      handleEventClick(clickInfo as EventClickArg);
    }
  }
};

const handleEditBooking = (booking: Booking): void => {
  dayViewVisible.value = false;
  emit('eventClick', {
    event: {
      id: booking.id,
      extendedProps: { booking, isEdit: true }
    }
  } as unknown as EventClickArg);
};

const handleCompleteBooking = (booking: Booking): void => {
  emit('updateBooking', {
    id: booking.id,
    start: booking.checkin_date,
    end: booking.checkout_date
  });
};

const handleAddBookingFromDayView = (date: Date): void => {
  dayViewVisible.value = false;
  
  const startStr = date.toISOString().split('T')[0];
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 1);
  const endStr = endDate.toISOString().split('T')[0];
  
  emit('createBooking', { start: startStr, end: endStr });
};

// ============================================================================
// MORE LINK HANDLERS
// ============================================================================

const attachMoreLinkListeners = (): void => {
  if (!calendarRef.value) return;
  
  try {
    const calendarApi = calendarRef.value.getApi();
    if (!calendarApi) return;
    
    const calendarEl = calendarRef.value.$el || calendarApi.el;
    if (!calendarEl) return;
  
    const moreLinks = calendarEl.querySelectorAll('.fc-more-link');
    
    moreLinks.forEach((link: Element) => {
      link.removeEventListener('click', handleManualMoreLinkClick);
      link.removeEventListener('mousedown', handleManualMoreLinkClick);
      link.removeEventListener('touchstart', handleManualMoreLinkClick);
      
      link.addEventListener('click', handleManualMoreLinkClick, true);
      link.addEventListener('mousedown', handleManualMoreLinkClick, true);
      link.addEventListener('touchstart', handleManualMoreLinkClick, { passive: false, capture: true });
    });
  } catch (error) {
    console.warn('Error attaching more link listeners:', error);
  }
};

const handleManualMoreLinkClick = (event: Event): void => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  
  const linkElement = event.currentTarget as HTMLElement;
  
  // Hide existing popovers
  document.querySelectorAll('.fc-popover, .fc-more-popover').forEach(popover => {
    (popover as HTMLElement).style.display = 'none';
    popover.remove();
  });
  
  const dayCell = linkElement.closest('.fc-daygrid-day') as HTMLElement;
  if (!dayCell) return;
  
  let dateAttr = dayCell.getAttribute('data-date') || dayCell.getAttribute('aria-label');
  
  if (!dateAttr) {
    const dayNumber = dayCell.querySelector('.fc-daygrid-day-number');
    if (dayNumber) {
      const dayText = dayNumber.textContent?.trim();
      if (dayText) {
        const calendarApi = calendarRef.value?.getApi();
        if (calendarApi) {
          const currentView = calendarApi.view;
          const currentDate = currentView.currentStart;
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(dayText));
          dateAttr = date.toISOString().split('T')[0];
        }
      }
    }
  }
  
  if (!dateAttr) return;
  
  const [year, month, day] = dateAttr.split('-').map(Number);
  const clickedDate = new Date(year, month - 1, day);
  const currentUserId = authStore.user?.id;
  
  const clickedIso = clickedDate.toISOString().split('T')[0];
  const dayBookings: Booking[] = [];
  
  Array.from(props.bookings.values()).forEach(booking => {
    const checkin = booking.checkin_date;
    const checkout = booking.checkout_date;
    const dateMatches = clickedIso >= checkin && clickedIso < checkout;
    const ownerMatches = !currentUserId || booking.owner_id === currentUserId;
    
    if (dateMatches && ownerMatches) {
      dayBookings.push(booking);
    }
  });
  
  selectedDate.value = clickedDate;
  selectedDayBookings.value = dayBookings;
  dayViewVisible.value = true;
};

// ============================================================================
// CALENDAR API METHODS
// ============================================================================

const goToDate = (date: string | Date): void => {
  if (!calendarRef.value) return;
  
  try {
    const calendarApi = calendarRef.value.getApi();
    if (calendarApi?.gotoDate) {
      calendarApi.gotoDate(date);
    }
  } catch (error) {
    console.warn('Error going to date:', error);
  }
};

const changeView = (viewName: string): void => {
  if (!calendarRef.value) return;
  
  try {
    const calendarApi = calendarRef.value.getApi();
    if (calendarApi?.changeView) {
      calendarApi.changeView(viewName);
    }
  } catch (error) {
    console.warn('Error changing view:', error);
  }
};

const refreshEvents = (): void => {
  if (!calendarRef.value) return;
  
  try {
    const calendarApi = calendarRef.value.getApi();
    if (calendarApi?.refetchEvents) {
      calendarApi.refetchEvents();
    }
  } catch (error) {
    console.warn('Error refreshing events:', error);
  }
};

// ============================================================================
// WATCHERS
// ============================================================================

watch(() => theme.global.current.value.dark, () => {
  refreshEvents();
});

watch(() => props.bookings, (newBookings) => {
  eventLogger.logEvent('Home', 'FullCalendar', 'bookingsUpdate', 
    { count: newBookings.size }, 'receive');
  setTimeout(() => attachMoreLinkListeners(), 200);
}, { immediate: true });

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  cleanupViewportListener = handleViewportResize(() => {
    mobileOptions.value = getMobileCalendarOptions();
  });
});

onBeforeUnmount(() => {
  if (calendarRef.value) {
    try {
      const calendarApi = calendarRef.value.getApi();
      if (calendarApi?.destroy) {
        calendarApi.destroy();
      }
    } catch (error) {
      console.warn('Calendar cleanup error:', error);
    } finally {
      calendarRef.value = null;
    }
  }
  
  if (cleanupViewportListener) {
    cleanupViewportListener();
    cleanupViewportListener = null;
  }
});

onUnmounted(() => {
  if (calendarRef.value) {
    calendarRef.value = null;
  }
  if (cleanupViewportListener) {
    cleanupViewportListener();
    cleanupViewportListener = null;
  }
});

// ============================================================================
// EXPOSE
// ============================================================================

defineExpose({
  goToDate,
  changeView,
  refreshEvents,
  getApi: () => {
    if (!calendarRef.value) return null;
    try {
      return calendarRef.value.getApi() || null;
    } catch {
      return null;
    }
  }
});
</script>

<style scoped>
/* ============================================================================
   LAYOUT
   ============================================================================ */
.calendar-container {
  height: 100%;
  width: 100%;
  margin: 0 !important;
  padding: 0 !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.custom-calendar {
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  flex: 1;
  min-height: 0;
  --fc-border-color: rgb(var(--v-theme-on-surface), 0.12);
  --fc-button-bg-color: rgb(var(--v-theme-primary));
  --fc-button-border-color: rgb(var(--v-theme-primary));
  --fc-button-hover-bg-color: rgb(var(--v-theme-primary));
  --fc-button-active-bg-color: rgb(var(--v-theme-primary));
  --fc-today-bg-color: rgb(var(--v-theme-primary), 0.1);
}

/* ============================================================================
   BOOKING TYPE STYLES
   ============================================================================ */
.fc-event.booking-turn {
  font-weight: bold;
  border-width: 3px !important;
  animation: pulse 2s infinite;
  position: relative;
}

.fc-event.booking-turn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(45deg, #ff0000, #ff6600, #ff0000);
  border-radius: 2px 2px 0 0;
}

.fc-event.booking-standard {
  border-width: 2px !important;
  position: relative;
}

.fc-event.booking-standard::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(45deg, currentColor, transparent, currentColor);
  border-radius: 2px 2px 0 0;
}

/* ============================================================================
   EVENT STYLES
   ============================================================================ */
:deep(.fc-event) {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06) !important;
  transition: all 0.2s ease !important;
  border-radius: 4px !important;
  margin-bottom: 3px !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
}

:deep(.fc-daygrid-event.fc-event) {
  background-color: inherit !important;
  border-color: inherit !important;
  color: #ffffff !important;
}

:deep(.fc-event:hover) {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-1px) !important;
  cursor: grab !important;
}

:deep(.fc-event:active) {
  cursor: grabbing !important;
}

/* ============================================================================
   DRAG & DROP
   ============================================================================ */
:deep(.fc-event-dragging) {
  opacity: 0.75 !important;
  transform: rotate(2deg) !important;
  z-index: 999 !important;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3) !important;
}

:deep(.fc-event-mirror) {
  opacity: 0.8 !important;
  transform: rotate(-2deg) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
}

:deep(.fc-event-resizer) {
  background-color: rgba(255, 255, 255, 0.8) !important;
  border: 1px solid rgba(0, 0, 0, 0.2) !important;
  border-radius: 2px !important;
}

:deep(.fc-event-resizer:hover) {
  background-color: rgba(255, 255, 255, 1) !important;
  border-color: rgba(var(--v-theme-primary), 0.5) !important;
}

/* ============================================================================
   DAY CELLS
   ============================================================================ */
:deep(.fc-daygrid-day.fc-day-today) {
  background-color: rgba(var(--v-theme-primary), 0.05) !important;
}

:deep(.fc-daygrid-day) {
  transition: box-shadow 0.2s ease, transform 0.2s ease !important;
  padding: 0 !important;
  margin: 0 !important;
}

:deep(.fc-daygrid-day:hover) {
  background-color: rgba(var(--v-theme-primary), 0.06) !important;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08) !important;
  transform: translateY(-2px) !important;
  z-index: 2 !important;
  position: relative !important;
}

:deep(.fc-daygrid-day-frame) {
  padding: 1px !important;
  margin: 0 !important;
}

/* ============================================================================
   ANIMATIONS
   ============================================================================ */
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(var(--v-theme-error), 0); }
  100% { box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0); }
}

/* ============================================================================
   STATUS STYLES
   ============================================================================ */
.fc-event.status-pending {
  opacity: 0.8;
}

.fc-event.status-completed {
  opacity: 0.6;
  text-decoration: line-through;
}

/* ============================================================================
   EVENT CONTENT
   ============================================================================ */
.fc-event-content-wrapper {
  padding: 2px;
}

.fc-event-subtitle {
  font-size: 0.75em;
  opacity: 0.9;
  margin-top: 1px;
}

/* ============================================================================
   HIDE POPOVERS (Use custom day view instead)
   ============================================================================ */
:deep(.fc-popover),
:deep(.fc-more-popover),
:deep(.fc-popover-header),
:deep(.fc-popover-body),
:deep(.fc-popover-close) {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

/* ============================================================================
   RESET FULLCALENDAR SPACING
   ============================================================================ */
:deep(.fc-header-toolbar),
:deep(.fc-col-header),
:deep(.fc-col-header-cell),
:deep(.fc-view),
:deep(.fc-daygrid-header),
:deep(.fc-scrollgrid),
:deep(.fc-scrollgrid-section-header) {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
}

:deep(.fc .fc-col-header-cell-cushion) {
  padding: 2px 4px !important;
  margin: 0 !important;
}

:deep(.fc-view-harness),
:deep(.fc-daygrid-body),
:deep(.fc-scrollgrid-section-body) {
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.fc) {
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.fc table) {
  border-spacing: 0 !important;
  border-collapse: collapse !important;
}

:deep(.fc td),
:deep(.fc th) {
  padding: 0 !important;
  margin: 0 !important;
  border: 1px solid #e0e0e0 !important;
}

/* ============================================================================
   MOBILE RESPONSIVE
   ============================================================================ */
@media (max-width: 959px) {
  .calendar-container {
    position: relative;
    height: calc(100vh - 56px - 60px - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 20px) !important;
    min-height: 400px;
    max-height: calc(100vh - 100px);
  }
  
  .custom-calendar {
    position: relative;
    height: 100% !important;
    width: 100% !important;
  }
  
  :deep(.fc),
  :deep(.fc-view-harness) {
    height: 100% !important;
    width: 100% !important;
  }
  
  :deep(.fc-scroller) {
    height: 100% !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch;
  }
  
  :deep(.fc-daygrid-body) {
    min-height: 300px;
  }
  
  :deep(.fc-daygrid-day-frame) {
    min-height: 40px;
  }
  
  :deep(.fc-event) {
    margin: 1px 0;
    font-size: 0.75rem;
  }
}

/* ============================================================================
   DESKTOP
   ============================================================================ */
@media (min-width: 960px) {
  :deep(.fc-event) {
    font-size: 0.75rem !important;
    min-height: 22px !important;
    padding: 2px 4px !important;
    margin: 1px 0 !important;
  }
  
  :deep(.fc-event-title) {
    font-size: 0.75rem !important;
    line-height: 1.1 !important;
  }
  
  :deep(.fc-event-subtitle) {
    font-size: 0.65rem !important;
    line-height: 1 !important;
  }
  
  :deep(.fc-daygrid-day-frame) {
    min-height: 120px !important;
  }
}
</style>