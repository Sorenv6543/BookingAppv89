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
import { ref, computed, watch, nextTick } from 'vue';
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
  if (calendarRef.value) {
    calendarRef.value.goToDate(date);
    
    // Emit date change event
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    emit('dateChange', dateObj);
  }
};

const changeView = (view: string): void => {
  console.log('👁️ [OwnerCalendar] changeView called:', view);
  if (calendarRef.value) {
    calendarRef.value.changeView(view);
    emit('viewChange', view);
  }
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
console.log('✅ [OwnerCalendar] Setup complete - using safe reactive patterns!');

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
    /* Height managed by parent container */
    font-size: 0.875rem;
  }
  
  /* Smaller event text for mobile */
  :deep(.fc-event-title) {
    font-size: 0.75rem;
    line-height: 1.2;
  }
  
  /* Compact day cells */
  :deep(.fc-daygrid-day-number) {
    font-size: 0.8rem;
  }
}

/* Tablet landscape - Good balance for owners */
@media (min-width: 600px) and (max-width: 1279px) {
  .owner-calendar-container {
    font-size: 0.9rem;
  }
  
  :deep(.fc-event-title) {
    font-size: 0.85rem;
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