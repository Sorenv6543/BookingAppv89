<template>
  <div class="owner-calendar-container">
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
  (e: 'eventResize', resizeInfo: EventDropArg): void;
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

const handleEventResize = (resizeInfo: EventDropArg): void => {
  console.log('🔄 [OwnerCalendar] Event resized:', resizeInfo.event.id);
  emit('eventResize', resizeInfo);
};

const handleCreateBooking = (data: { start: string; end: string; propertyId?: string }): void => {
  console.log('➕ [OwnerCalendar] Create booking:', data);
  emit('createBooking', data);
};

// ===== PROGRAMMATIC CALENDAR METHODS =====

const goToDate = (date: string | Date): void => {
  console.log('🗓️ [OwnerCalendar] goToDate called:', date);
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  
  if (calendarRef.value) {
    calendarRef.value.goToDate(targetDate);
  }
  
  // Emit date change event
  emit('dateChange', targetDate);
};

const changeView = (view: string): void => {
  console.log('👁️ [OwnerCalendar] changeView called:', view);
  
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

// ===== WATCHERS (SAFE - SIMPLE, NON-CIRCULAR) =====

// Watch for view changes from parent (safe - simple prop watching)
watch(() => props.currentView, (newView) => {
  console.log('🎯 [OwnerCalendar] Current view changed from parent:', newView);
  
  nextTick(() => {
    if (newView && calendarRef.value) {
      changeView(newView);
    }
  });
});

// Watch for date changes from parent (safe - simple prop watching)
watch(() => props.currentDate, (newDate) => {
  console.log('📅 [OwnerCalendar] Current date changed from parent:', newDate);
  
  nextTick(() => {
    if (newDate && calendarRef.value) {
      goToDate(newDate);
    }
  });
});

// ===== LIFECYCLE =====

onMounted(async () => {
  console.log('🎬 [OwnerCalendar] Component mounted');
  
  // Wait for DOM to be fully ready
  await nextTick();
  
  console.log('🔗 [OwnerCalendar] Component ready');
});

console.log('✅ [OwnerCalendar] Setup complete!');

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
  /* animation: pulse-owner-urgent 2s infinite; */
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
  background: rgb(var(--v-theme-primary));
}

/* ================================================================ */
/* ANIMATIONS FOR OWNER CALENDAR */
/* ================================================================ */

/* @keyframes pulse-owner-urgent {
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
} */

/* ================================================================ */
/* MOBILE OPTIMIZATIONS */
/* ================================================================ */

@media (max-width: 768px) {
  .owner-calendar-container {
    height: calc(100vh - 120px); /* Account for mobile navigation */
  }
  
  :deep(.fc-header-toolbar) {
    flex-direction: column;
    gap: 0.0em;
  }
  
  :deep(.fc-toolbar-chunk) {
    display: flex;
    justify-content: center;
  }
  
  :deep(.fc-button) {
    font-size: 0.875rem;
    padding: 0.5em 0.75em;
  }
}

/* ================================================================ */
/* TOUCH GESTURE OPTIMIZATIONS */
/* ================================================================ */

/* Ensure calendar area is touch-friendly */
.owner-calendar {
  touch-action: pan-x pan-y;
  -webkit-overflow-scrolling: touch;
}

/* Prevent text selection during swipes */
.owner-calendar-container {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Smooth transitions for swipe gestures */
:deep(.fc-view-harness) {
  transition: transform 0.2s ease-out;
}

/* ================================================================ */
/* ACCESSIBILITY */
/* ================================================================ */

/* High contrast mode support */
@media (prefers-contrast: high) {
  :deep(.fc-event) {
    border-width: 2px !important;
  }
  
  :deep(.fc-button) {
    border-width: 2px !important;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  :deep(.fc-view-harness) {
    transition: none;
  }
  
  :deep(.fc-event.priority-urgent) {
    animation: none;
  }
}
</style> 