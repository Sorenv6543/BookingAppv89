# FullCalendar eventResize Documentation

*Source: [https://fullcalendar.io/docs/eventResize](https://fullcalendar.io/docs/eventResize)*

---

## eventResize

**Triggered when resizing stops and the event has changed in duration.**

### Function Signature

```javascript
function(eventResizeInfo) { }
```

### eventResizeInfo Properties

`eventResizeInfo` is a plain object with the following properties:

| Property | Description |
|----------|-------------|
| `event` | An [Event Object](https://fullcalendar.io/docs/event-object) that holds information about the event (date, title, etc) **after** the resize. |
| `relatedEvents` | An array of other related [Event Objects](https://fullcalendar.io/docs/event-object) that were also resized. An event might have other [recurring event](https://fullcalendar.io/docs/recurring-events) instances or might be linked to other events with the same groupId. |
| `oldEvent` | An [Event Object](https://fullcalendar.io/docs/event-object) that holds information about the event **before** the resize. |
| `endDelta` | A [Duration Object](https://fullcalendar.io/docs/duration-object) that represents the amount of time the event's **end date** was moved by. |
| `startDelta` | A [Duration Object](https://fullcalendar.io/docs/duration-object) that represents the amount of time the event's **start date** was moved by. |
| `revert` | A function that, if called, reverts the event's start/end date to the values before the drag. This is useful if an ajax call should fail. |
| `view` | The current [View Object](https://fullcalendar.io/docs/view-object). |
| `el` | The HTML element that was being dragged. |
| `jsEvent` | The native JavaScript event with low-level information such as click coordinates. |

### Callback Execution Order

This callback is fired **before** the `eventChange` callback is fired.

### Example Usage

Here is an example demonstrating most of these properties:

```javascript
var calendar = new Calendar(calendarEl, {

  events: [
    // events here
  ],

  editable: true,

  eventResize: function(info) {
    alert(info.event.title + " end is now " + info.event.end.toISOString());

    if (!confirm("is this okay?")) {
      info.revert();
    }
  }

});
```

---

## Related Event Dragging & Resizing Features

### Flags
- **editable** - Master control for event editing
- **eventStartEditable** - Controls whether events can be dragged to change start time
- **eventResizableFromStart** - Allow resizing from the start of the event
- **eventDurationEditable** - Controls whether events can be resized
- **eventResourceEditable** - Controls resource assignment editing
- **droppable** - Allow external elements to be dropped

### Effects
- **eventDragMinDistance** - Minimum distance to initiate drag
- **dragRevertDuration** - Animation duration when reverting
- **dragScroll** - Auto-scroll during drag
- **snapDuration** - Time increment for snapping
- **allDayMaintainDuration** - Maintain duration when moving to/from all-day
- **fixedMirrorParent** - Container for drag mirror

### Control
- **eventOverlap** - Controls whether events can overlap
- **eventConstraint** - Restrict where events can be moved/resized
- **eventAllow** - Custom validation function
- **dropAccept** - Filter which external elements can be dropped

### Related Callbacks
- **eventDragStart** - Fired when dragging begins
- **eventDragStop** - Fired when dragging ends
- **eventDrop** - Fired when event is moved via drag & drop
- **drop** - Fired when external element is dropped
- **eventReceive** - Fired when event is received from another calendar
- **eventLeave** - Fired when event leaves the calendar
- **eventResizeStart** - Fired when resizing begins
- **eventResizeStop** - Fired when resizing ends
- **eventResize** - Fired when resizing completes (this callback)

### See Also
- [validRange](https://fullcalendar.io/docs/validRange) - Restrict valid date ranges
- [Touch Support](https://fullcalendar.io/docs/touch) - Mobile device interaction

---

## Vue 3 TypeScript Implementation

### TypeScript Interface

```typescript
interface EventResizeInfo {
  event: EventApi;
  relatedEvents: EventApi[];
  oldEvent: EventApi;
  endDelta: Duration;
  startDelta: Duration;
  revert: () => void;
  view: ViewApi;
  el: HTMLElement;
  jsEvent: MouseEvent | TouchEvent;
}
```

### Vue Component Example

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Calendar } from '@fullcalendar/core'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'

const calendarEl = ref<HTMLElement>()

const handleEventResize = (info: EventResizeInfo) => {
  console.log('Event resized:', {
    eventId: info.event.id,
    title: info.event.title,
    newStart: info.event.start,
    newEnd: info.event.end,
    oldStart: info.oldEvent.start,
    oldEnd: info.oldEvent.end,
    endDelta: info.endDelta,
    startDelta: info.startDelta
  })

  // Validation logic
  const isValidResize = validateEventResize(info)
  
  if (!isValidResize) {
    console.log('Invalid resize, reverting...')
    info.revert()
    return
  }

  // Save to backend
  saveEventChanges(info.event)
}

const validateEventResize = (info: EventResizeInfo): boolean => {
  // Example validation: minimum 30 minutes duration
  const duration = info.event.end!.getTime() - info.event.start!.getTime()
  const minDuration = 30 * 60 * 1000 // 30 minutes in milliseconds
  
  if (duration < minDuration) {
    alert('Events must be at least 30 minutes long')
    return false
  }

  return true
}

const saveEventChanges = async (event: EventApi) => {
  try {
    await fetch(`/api/events/${event.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        start: event.start?.toISOString(),
        end: event.end?.toISOString()
      })
    })
    console.log('Event saved successfully')
  } catch (error) {
    console.error('Failed to save event:', error)
  }
}

onMounted(() => {
  if (calendarEl.value) {
    const calendar = new Calendar(calendarEl.value, {
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
      initialView: 'timeGridWeek',
      
      // Enable resizing
      editable: true,
      eventDurationEditable: true,
      eventResizableFromStart: true,
      
      // Event resize callback
      eventResize: handleEventResize,
      
      events: [
        {
          id: '1',
          title: 'Resizable Event',
          start: '2024-01-15T10:00:00',
          end: '2024-01-15T12:00:00'
        }
      ]
    })

    calendar.render()
  }
})
</script>

<template>
  <div ref="calendarEl"></div>
</template>
```

---

*Documentation last updated: FullCalendar v6.1.17* 