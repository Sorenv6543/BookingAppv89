import { ref, reactive, computed } from 'vue';

export interface ComponentEvent {
  id: string;
  timestamp: number;
  sourceComponent: string;
  targetComponent: string;
  eventName: string;
  payload: unknown;
  direction: 'emit' | 'receive';
}

export interface EventFilter {
  sourceComponent?: string;
  targetComponent?: string;
  eventName?: string;
  direction?: 'emit' | 'receive';
}

/**
 * Composable for logging component events to trace component communication
 * Used for testing and debugging component communication flow
 */
export function useComponentEventLogger() {
  // State
  const events = reactive<Map<string, ComponentEvent>>(new Map());
  const enabled = ref(localStorage.getItem('debug_event_logger') === 'true');
  const autoScroll = ref(true);
  const filter = ref<EventFilter>({});

  // Getters
  const eventList = computed(() => {
    const eventArray = Array.from(events.values());
    
    // Apply filters if any
    return eventArray
      .filter(event => {
        if (filter.value.sourceComponent && event.sourceComponent !== filter.value.sourceComponent) {
          return false;
        }
        if (filter.value.targetComponent && event.targetComponent !== filter.value.targetComponent) {
          return false;
        }
        if (filter.value.eventName && event.eventName !== filter.value.eventName) {
          return false;
        }
        if (filter.value.direction && event.direction !== filter.value.direction) {
          return false;
        }
        return true;
      })
      .sort((a, b) => a.timestamp - b.timestamp);
  });

  // Methods
  const logEvent = (
    sourceComponent: string,
    targetComponent: string,
    eventName: string,
    payload: unknown,
    direction: 'emit' | 'receive'
  ) => {
    if (!enabled.value) return;

    const timestamp = Date.now();
    const id = `${sourceComponent}-${targetComponent}-${eventName}-${timestamp}`;
    
    events.set(id, {
      id,
      timestamp,
      sourceComponent,
      targetComponent,
      eventName,
      payload,
      direction
    });

    // For debugging during development - only log if explicitly enabled
    if (localStorage.getItem('debug_event_logger') === 'true') {
      console.debug(`[Event Logger] ${sourceComponent} ${direction === 'emit' ? '→' : '←'} ${targetComponent}: ${eventName}`, payload);
    }
  };

  const clearEvents = () => {
    events.clear();
  };

  const setEnabled = (value: boolean) => {
    enabled.value = value;
    localStorage.setItem('debug_event_logger', value.toString());
  };

  const toggleEnabled = () => {
    setEnabled(!enabled.value);
  };

  const setFilter = (newFilter: EventFilter) => {
    filter.value = newFilter;
  };

  const clearFilter = () => {
    filter.value = {};
  };

  return {
    events,
    eventList,
    enabled,
    autoScroll,
    filter,
    logEvent,
    clearEvents,
    setEnabled,
    toggleEnabled,
    setFilter,
    clearFilter
  };
}

// Create a singleton instance for global use
const eventLogger = useComponentEventLogger();

export default eventLogger; 