<template>
  <div class="owner-calendar-container">
    <!-- Custom Month Navigation Toolbar -->
    <div class="calendar-toolbar">
      <button
        class="nav-btn"
        @click="handlePrev"
      >
        <v-icon size="20">
          mdi-chevron-left
        </v-icon>
      </button>
      <div class="month-label">
        <span class="month-text">{{ currentMonthLabel }}</span>
      </div>
      <button
        class="nav-btn"
        @click="handleNext"
      >
        <v-icon size="20">
          mdi-chevron-right
        </v-icon>
      </button>
    </div>

    <!-- Owner Calendar -->
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
      @update-booking="handleUpdateBooking"
      @delete-booking="handleDeleteBooking"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, computed } from 'vue';
import FullCalendar from '@/components/smart/FullCalendar.vue';
import type { Booking, Property } from '@/types';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';

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
  (e: 'updateBooking', data: { id: string; start: string; end: string }): void;
  (e: 'deleteBooking', bookingId: string): void;
  (e: 'viewChange', view: string): void;
  (e: 'dateChange', date: Date): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  currentView: 'dayGridMonth',
  currentDate: () => new Date()
});

const emit = defineEmits<Emits>();

// ===== REFS AND REACTIVE DATA =====
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);
const displayDate = ref(new Date());

// ===== COMPUTED =====
const currentMonthLabel = computed(() => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[displayDate.value.getMonth()]} ${displayDate.value.getFullYear()}`;
});

// ===== TOOLBAR NAVIGATION =====
const handlePrev = (): void => {
  const api = calendarRef.value?.getApi();
  if (api) {
    api.prev();
    displayDate.value = api.getDate();
  }
};

const handleNext = (): void => {
  const api = calendarRef.value?.getApi();
  if (api) {
    api.next();
    displayDate.value = api.getDate();
  }
};

// ===== EVENT HANDLERS =====

const handleDateSelect = (selectInfo: DateSelectArg): void => {
  emit('dateSelect', selectInfo);
};

const handleEventClick = (clickInfo: EventClickArg): void => {
  emit('eventClick', clickInfo);
};

const handleEventDrop = (dropInfo: EventDropArg): void => {
  emit('eventDrop', dropInfo);
};

const handleEventResize = (resizeInfo: EventDropArg): void => {
  emit('eventResize', resizeInfo);
};

const handleCreateBooking = (data: { start: string; end: string; propertyId?: string }): void => {
  emit('createBooking', data);
};

const handleUpdateBooking = (data: { id: string; start: string; end: string }): void => {
  emit('updateBooking', data);
};

const handleDeleteBooking = (bookingId: string): void => {
  emit('deleteBooking', bookingId);
};

// ===== PROGRAMMATIC CALENDAR METHODS =====

const goToDate = (date: string | Date): void => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  if (calendarRef.value) {
    calendarRef.value.goToDate(targetDate);
  }
  displayDate.value = targetDate;
  emit('dateChange', targetDate);
};

const changeView = (view: string): void => {
  if (calendarRef.value) {
    calendarRef.value.changeView(view);
  }
  emit('viewChange', view);
};

const refreshEvents = (): void => {
  if (calendarRef.value) {
    calendarRef.value.refreshEvents();
  }
};

const getApi = () => {
  return calendarRef.value?.getApi() || null;
};

// ===== WATCHERS =====

watch(() => props.currentView, (newView) => {
  nextTick(() => {
    if (newView && calendarRef.value) {
      changeView(newView);
    }
  });
});

watch(() => props.currentDate, (newDate) => {
  nextTick(() => {
    if (newDate && calendarRef.value) {
      goToDate(newDate);
    }
  });
});

// ===== LIFECYCLE =====

onMounted(async () => {
  await nextTick();
  const api = calendarRef.value?.getApi();
  if (api) {
    displayDate.value = api.getDate();
  }
});

// ===== EXPOSE METHODS TO PARENT =====
defineExpose({
  goToDate,
  changeView,
  refreshEvents,
  getApi
});
</script>

<style scoped>
/* Terminal Swiss Calendar Container */
.owner-calendar-container {
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #FFFFFF;
  font-family: 'Inter', sans-serif;
}

/* Custom Calendar Toolbar - Terminal Swiss */
.calendar-toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 12px 16px;
  background: #FFFFFF;
  border-bottom: 1px solid #E4E4E4;
}

.nav-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000000;
  color: #FFFFFF;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}

.nav-btn:hover {
  background: #333333;
}

.month-label {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 24px;
  background: #000000;
  min-width: 180px;
}

.month-text {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  font-size: 14px;
  color: #FFFFFF;
  letter-spacing: 0;
}

/* Calendar body */
.owner-calendar {
  flex: 1;
  min-height: 0;
  width: 100%;
  height: 100%;
  position: relative;
}

/* Day column headers - Terminal Swiss */
:deep(.fc-col-header-cell) {
  background: #000000 !important;
  border: none !important;
}

:deep(.fc-col-header-cell-cushion) {
  color: #FFFFFF !important;
  font-family: 'Inter', sans-serif !important;
  font-weight: 500 !important;
  font-size: 12px !important;
  text-transform: uppercase !important;
  letter-spacing: 1px !important;
  padding: 8px 4px !important;
  text-decoration: none !important;
}

/* Day numbers */
:deep(.fc-daygrid-day-number) {
  font-family: 'JetBrains Mono', monospace !important;
  font-weight: 400 !important;
  font-size: 13px !important;
  color: #000000 !important;
  text-decoration: none !important;
  padding: 4px 8px !important;
}

/* Today highlight */
:deep(.fc-daygrid-day.fc-day-today) {
  background-color: rgba(229, 57, 53, 0.06) !important;
}

:deep(.fc-daygrid-day.fc-day-today .fc-daygrid-day-number) {
  color: #E53935 !important;
  font-weight: 600 !important;
}

/* Grid borders */
:deep(.fc td),
:deep(.fc th) {
  border-color: #E4E4E4 !important;
}

:deep(.fc-scrollgrid) {
  border-color: #E4E4E4 !important;
}

/* Turn booking styling */
:deep(.fc-event.booking-turn) {
  font-weight: 600;
  border-left: 3px solid #E53935 !important;
}

/* Priority styling */
:deep(.fc-event.priority-urgent) {
  border-left: 3px solid #E53935 !important;
}

:deep(.fc-event.priority-high) {
  border-left: 3px solid #000000 !important;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .owner-calendar-container {
    height: calc(100vh - 48px);
  }

  .calendar-toolbar {
    padding: 8px 12px;
  }

  .month-label {
    min-width: 150px;
    padding: 6px 16px;
  }

  .month-text {
    font-size: 13px;
  }
}

/* Touch gesture optimizations */
.owner-calendar {
  touch-action: pan-x pan-y;
  -webkit-overflow-scrolling: touch;
}

.owner-calendar-container {
  user-select: none;
  -webkit-user-select: none;
}

/* Accessibility */
@media (prefers-contrast: high) {
  :deep(.fc-event) {
    border-width: 2px !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  :deep(.fc-view-harness) {
    transition: none;
  }
}
</style>
