# FullCalendar Vue Integration, TypeScript Patterns & Examples

*Comprehensive guide for integrating FullCalendar with Vue 3, TypeScript, and advanced event handling*

---

## Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Basic Vue Integration](#basic-vue-integration)
3. [TypeScript Configuration](#typescript-configuration)
4. [Event Management](#event-management)
5. [Drag & Drop with Resizing](#drag--drop-with-resizing)
6. [Advanced Vue Patterns](#advanced-vue-patterns)
7. [Plugin Integration](#plugin-integration)
8. [Best Practices](#best-practices)

---

## Installation & Setup

### Core Dependencies

```bash
# Core FullCalendar packages
npm install @fullcalendar/core @fullcalendar/daygrid

# Vue integration (when available)
npm install @fullcalendar/vue3

# Additional plugins as needed
npm install @fullcalendar/interaction @fullcalendar/timegrid @fullcalendar/list
```

### Interactive Features

```bash
# For drag & drop and resizing functionality
npm install @fullcalendar/interaction

# Time-based views
npm install @fullcalendar/timegrid

# List views
npm install @fullcalendar/list
```

---

## Basic Vue Integration

### Simple Vue 3 Component Setup

```vue
<template>
  <div>
    <div ref="calendarEl"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

const calendarEl = ref<HTMLElement>()

onMounted(() => {
  if (calendarEl.value) {
    const calendar = new Calendar(calendarEl.value, {
      plugins: [
        dayGridPlugin,
        interactionPlugin
      ],
      initialView: 'dayGridMonth',
      editable: true,
      selectable: true,
      events: [
        { title: 'Meeting', start: new Date() }
      ]
    })
    
    calendar.render()
  }
})
</script>
```

### Reactive Vue Integration

```vue
<template>
  <div>
    <div ref="calendarEl"></div>
    <button @click="addEvent">Add Event</button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

// Reactive state
const calendarEl = ref<HTMLElement>()
const calendar = ref<Calendar>()
const events = reactive([
  { id: '1', title: 'Initial Event', start: new Date() }
])

// Initialize calendar
onMounted(() => {
  if (calendarEl.value) {
    calendar.value = new Calendar(calendarEl.value, {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      editable: true,
      selectable: true,
      events: events,
      // Event callbacks
      dateClick: handleDateClick,
      eventClick: handleEventClick,
      eventDrop: handleEventDrop
    })
    
    calendar.value.render()
  }
})

// Watch for events changes
watch(events, (newEvents) => {
  if (calendar.value) {
    calendar.value.removeAllEvents()
    calendar.value.addEventSource(newEvents)
  }
}, { deep: true })

// Event handlers
const handleDateClick = (info: any) => {
  console.log('Date clicked:', info.dateStr)
}

const handleEventClick = (info: any) => {
  console.log('Event clicked:', info.event.title)
}

const handleEventDrop = (info: any) => {
  console.log('Event moved:', info.event.title)
}

const addEvent = () => {
  events.push({
    id: Date.now().toString(),
    title: `New Event ${events.length + 1}`,
    start: new Date()
  })
}
</script>
```

---

## TypeScript Configuration

### TypeScript Event Interface

```typescript
// types/calendar.ts
export interface CalendarEvent {
  id: string
  title: string
  start: Date | string
  end?: Date | string
  allDay?: boolean
  extendedProps?: Record<string, any>
}

export interface CalendarEventExtended extends CalendarEvent {
  backgroundColor?: string
  borderColor?: string
  textColor?: string
  url?: string
}
```

### TypeScript Calendar Options

```typescript
// composables/useCalendar.ts
import { Calendar, CalendarOptions } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { CalendarEvent } from '@/types/calendar'

export const useCalendar = () => {
  const createCalendarOptions = (
    events: CalendarEvent[],
    callbacks?: {
      dateClick?: (info: any) => void
      eventClick?: (info: any) => void
      eventDrop?: (info: any) => void
      eventResize?: (info: any) => void
    }
  ): CalendarOptions => {
    return {
      plugins: [
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin
      ],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      weekends: true,
      events: events,
      ...callbacks
    }
  }

  return {
    createCalendarOptions
  }
}
```

---

## Event Management

### JSON Event Structure

```json
{
  "events": [
    {
      "id": "830",
      "start": 1262279460000,
      "end": 1262281260000,
      "title": "Standard Meeting",
      "body": "Meeting description",
      "allDay": false,
      "extendedProps": {
        "department": "Engineering",
        "location": "Conference Room A"
      }
    },
    {
      "id": "831", 
      "start": "2024-01-15T09:00:00",
      "end": "2024-01-15T17:00:00",
      "title": "All Day Event",
      "allDay": true,
      "backgroundColor": "#ff9f89"
    }
  ]
}
```

---

## Drag & Drop with Resizing

### Interactive Calendar Setup

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const calendarEl = ref<HTMLElement>()

onMounted(() => {
  const calendar = new Calendar(calendarEl.value!, {
    plugins: [
      dayGridPlugin,
      timeGridPlugin,
      interactionPlugin  // Required for interactions
    ],
    initialView: 'timeGridWeek',
    
    // Enable interactions
    editable: true,        // Enables event dragging
    selectable: true,      // Enables date selection
    selectMirror: true,    // Shows preview while selecting
    
    // Drag & Drop settings
    eventStartEditable: true,   // Allow dragging start time
    eventDurationEditable: true, // Allow resizing duration
    
    events: [
      {
        id: '1',
        title: 'Draggable Meeting',
        start: '2024-01-15T10:00:00',
        end: '2024-01-15T12:00:00'
      }
    ],

    // Event callbacks
    eventDrop: (info) => {
      console.log('Event dropped:', {
        id: info.event.id,
        title: info.event.title,
        newStart: info.event.start,
        newEnd: info.event.end,
        delta: info.delta
      })
      
      // Revert if needed
      // info.revert()
    },

    eventResize: (info) => {
      console.log('Event resized:', {
        id: info.event.id,
        title: info.event.title,
        newStart: info.event.start,
        newEnd: info.event.end,
        prevDuration: info.prevEvent.end! - info.prevEvent.start!,
        newDuration: info.event.end! - info.event.start!
      })
    },

    select: (info) => {
      console.log('Date range selected:', {
        start: info.start,
        end: info.end,
        allDay: info.allDay
      })
      
      // Auto-create event
      const title = prompt('Event title:')
      if (title) {
        calendar.addEvent({
          title,
          start: info.start,
          end: info.end,
          allDay: info.allDay
        })
      }
      
      calendar.unselect()
    }
  })

  calendar.render()
})
</script>
```

---

## Plugin Integration Examples

### Time Grid with Multiple Views

```javascript
import { Calendar } from '@fullcalendar/core'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'

const calendar = new Calendar(calendarEl, {
  plugins: [timeGridPlugin, dayGridPlugin, listPlugin],
  initialView: 'timeGridWeek',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
  },
  events: [
    { title: 'Time-based Event', start: new Date() }
  ]
})
```



### Recurring Events with RRule

```javascript
import { Calendar } from '@fullcalendar/core'
import rrulePlugin from '@fullcalendar/rrule'
import dayGridPlugin from '@fullcalendar/daygrid'

const calendar = new Calendar(calendarEl, {
  plugins: [rrulePlugin, dayGridPlugin],
  initialView: 'dayGridMonth',
  events: [
    {
      title: 'Weekly Meeting',
      rrule: {
        freq: 'weekly',
        byweekday: ['mo', 'fr'],
        dtstart: '2024-01-01T10:00:00'
      },
      duration: '02:00'
    }
  ]
})
```

---

## Best Practices for Vue Integration

### 1. TypeScript Integration

```typescript
// Always define proper types
interface BookingEvent extends CalendarEvent {
  bookingType: 'turn' | 'standard'
  propertyId: string
  cleanerId?: string
  priority: 'low' | 'medium' | 'high'
}

// Use type-safe event handlers
const handleEventClick = (info: EventClickArg) => {
  const event = info.event as BookingEvent
  console.log(`Booking type: ${event.extendedProps.bookingType}`)
}
```

### 2. Performance Optimization

```typescript
// Lazy load events
const lazyLoadEvents = (fetchInfo: any, successCallback: any) => {
  // Only load events for visible date range
  loadEventsInRange(fetchInfo.start, fetchInfo.end)
    .then(successCallback)
    .catch(() => successCallback([]))
}

// Use event source functions for large datasets
const calendar = new Calendar(calendarEl, {
  events: lazyLoadEvents,
  eventDisplay: 'block', // Better performance for many events
  dayMaxEvents: 3, // Limit events per day
})
```

### 3. Vue Reactivity

```vue
<script setup lang="ts">
// Watch for props changes
watch(() => props.events, (newEvents) => {
  if (calendar.value) {
    calendar.value.removeAllEvents()
    calendar.value.addEventSource(newEvents)
  }
}, { deep: true })

// Cleanup on unmount
onUnmounted(() => {
  calendar.value?.destroy()
})
</script>
```

### 4. Error Handling

```typescript
const initializeCalendar = () => {
  try {
    calendar.value = new Calendar(calendarEl.value!, {
      // ... options
      eventSourceFailure: (error) => {
        console.error('Failed to load events:', error)
        // Show user-friendly error message
      }
    })
    
    calendar.value.render()
  } catch (error) {
    console.error('Failed to initialize calendar:', error)
    // Fallback UI
  }
}
```

---

## Configuration Examples from Documentation

### Header Toolbar Configuration

```typescript
{
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek,dayGridDay'
  }
}
```

### View Configuration Options

```typescript
{
  visibleRange: {
    start: date,
    end: date
  },
  validRange: {
    start: date,
    end: date
  },
  dateIncrement: duration,
  dateAlignment: string
}
```

### Event Source Configuration

```typescript
{
  url: string,
  eventDataTransform: function,
  loading: function
}
```

This comprehensive guide provides all the essential patterns for integrating FullCalendar with Vue 3 and TypeScript, including advanced features like drag & drop, event management, and performance optimization.