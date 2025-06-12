<template>
  <div 
    v-show="enabled" 
    class="debug-panel" 
    :class="{ 'debug-panel--expanded': expanded }"
  >
    <div class="debug-panel__header">
      <div class="d-flex align-center">
        <v-icon icon="mdi-bug" class="mr-2" />
        <span class="text-subtitle-1 font-weight-bold">Component Communication Logger</span>
      </div>
      <div class="d-flex align-center">
        <v-tooltip text="Clear Log">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-trash-can-outline"
              variant="text"
              density="compact"
              @click="clearEvents"
            />
          </template>
        </v-tooltip>
        <v-tooltip :text="autoScroll ? 'Auto-scroll On' : 'Auto-scroll Off'">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              :icon="autoScroll ? 'mdi-autorenew' : 'mdi-autorenew-off'"
              variant="text"
              density="compact"
              @click="toggleAutoScroll"
            />
          </template>
        </v-tooltip>
        <v-tooltip :text="expanded ? 'Collapse' : 'Expand'">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              :icon="expanded ? 'mdi-arrow-collapse-down' : 'mdi-arrow-expand-up'"
              variant="text"
              density="compact"
              @click="expanded = !expanded"
            />
          </template>
        </v-tooltip>
        <v-tooltip text="Close">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-close"
              variant="text"
              density="compact"
              @click="setEnabled(false)"
            />
          </template>
        </v-tooltip>
      </div>
    </div>
    
    <div class="debug-panel__filters">
      <v-chip-group>
        <v-chip
          v-for="component in availableComponents"
          :key="component"
          filter
          :model-value="filter.sourceComponent === component || filter.targetComponent === component"
          @click="toggleComponentFilter(component)"
        >
          {{ component }}
        </v-chip>
      </v-chip-group>
      
      <v-chip-group>
        <v-chip
          filter
          :model-value="filter.direction === 'emit'"
          @click="toggleDirectionFilter('emit')"
        >
          Emit
        </v-chip>
        <v-chip
          filter
          :model-value="filter.direction === 'receive'"
          @click="toggleDirectionFilter('receive')"
        >
          Receive
        </v-chip>
      </v-chip-group>
      
      <v-btn
        v-if="hasFilter"
        variant="text"
        size="small"
        @click="clearFilter"
      >
        Clear Filters
      </v-btn>
    </div>
    
    <div ref="eventsContainer" class="debug-panel__events">
      <div 
        v-for="event in eventList" 
        :key="event.id" 
        class="debug-event"
        :class="{
          'debug-event--emit': event.direction === 'emit',
          'debug-event--receive': event.direction === 'receive'
        }"
      >
        <div class="debug-event__header">
          <div class="debug-event__timestamp">
            {{ formatTime(event.timestamp) }}
          </div>
          <div class="debug-event__components">
            {{ event.sourceComponent }}
            <v-icon
              :icon="event.direction === 'emit' ? 'mdi-arrow-right' : 'mdi-arrow-left'"
              size="small"
              class="mx-1"
            />
            {{ event.targetComponent }}
          </div>
          <div class="debug-event__name">
            {{ event.eventName }}
          </div>
        </div>
        <div class="debug-event__payload">
          <pre>{{ formatPayload(event.payload) }}</pre>
        </div>
      </div>
      
      <div v-if="eventList.length === 0" class="debug-panel__empty">
        No events logged yet. Interact with the components to see events.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import eventLogger, { type EventFilter } from '@/composables/useComponentEventLogger';

// Props (none required as this uses the global eventLogger instance)

// State from eventLogger
const enabled = computed(() => eventLogger.enabled.value);
const eventList = computed(() => eventLogger.eventList.value);
const autoScroll = computed(() => eventLogger.autoScroll.value);
const filter = computed(() => eventLogger.filter.value);

// Local state
const expanded = ref(true);
const eventsContainer = ref<HTMLElement | null>(null);

// Methods from eventLogger
const { 
  clearEvents, 
  setEnabled, 
  toggleEnabled, 
  setFilter, 
  clearFilter 
} = eventLogger;

// Local computed
const hasFilter = computed(() => {
  return !!(
    filter.value.sourceComponent || 
    filter.value.targetComponent || 
    filter.value.eventName || 
    filter.value.direction
  );
});

const availableComponents = computed(() => {
  const components = new Set<string>();
  
  eventList.value.forEach(event => {
    components.add(event.sourceComponent);
    components.add(event.targetComponent);
  });
  
  return Array.from(components);
});

// Local methods
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
  });
};

const formatPayload = (payload: any): string => {
  try {
    return JSON.stringify(payload, null, 2);
  } catch (error) {
    return String(payload);
  }
};

const toggleAutoScroll = () => {
  eventLogger.autoScroll.value = !eventLogger.autoScroll.value;
};

const toggleComponentFilter = (component: string) => {
  // If both source and target are already this component, clear the filter
  if (
    filter.value.sourceComponent === component && 
    filter.value.targetComponent === component
  ) {
    setFilter({
      ...filter.value,
      sourceComponent: undefined,
      targetComponent: undefined
    });
    return;
  }
  
  // If source is this component, set target to this component too
  if (filter.value.sourceComponent === component) {
    setFilter({
      ...filter.value,
      targetComponent: component
    });
    return;
  }
  
  // If target is this component, set source to this component too
  if (filter.value.targetComponent === component) {
    setFilter({
      ...filter.value,
      sourceComponent: component
    });
    return;
  }
  
  // Otherwise, set source to this component
  setFilter({
    ...filter.value,
    sourceComponent: component,
    targetComponent: undefined
  });
};

const toggleDirectionFilter = (direction: 'emit' | 'receive') => {
  if (filter.value.direction === direction) {
    setFilter({
      ...filter.value,
      direction: undefined
    });
  } else {
    setFilter({
      ...filter.value,
      direction
    });
  }
};

// Keyboard shortcut for toggling the debug panel
const handleKeyDown = (event: KeyboardEvent) => {
  // Ctrl+Shift+D
  if (event.ctrlKey && event.shiftKey && event.key === 'D') {
    toggleEnabled();
  }
};

// Auto-scrolling
watch(eventList, () => {
  if (autoScroll.value && eventsContainer.value) {
    setTimeout(() => {
      if (eventsContainer.value) {
        eventsContainer.value.scrollTop = eventsContainer.value.scrollHeight;
      }
    }, 0);
  }
}, { deep: true });

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.debug-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(var(--v-theme-surface-variant), 0.95);
  border-top: 1px solid rgba(var(--v-theme-on-surface-variant), 0.12);
  z-index: 1000;
  height: 200px;
  transition: height 0.3s ease;
  display: flex;
  flex-direction: column;
}

.debug-panel--expanded {
  height: 400px;
}

.debug-panel__header {
  padding: 8px 16px;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface-variant), 0.12);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.debug-panel__filters {
  padding: 8px 16px;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface-variant), 0.12);
  display: flex;
  gap: 8px;
  align-items: center;
  overflow-x: auto;
}

.debug-panel__events {
  flex: 1;
  overflow-y: auto;
  padding: 8px 16px;
}

.debug-panel__empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: rgba(var(--v-theme-on-surface-variant), 0.6);
}

.debug-event {
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 4px;
  background-color: rgba(var(--v-theme-surface), 0.8);
  border-left: 4px solid transparent;
}

.debug-event--emit {
  border-left-color: rgb(var(--v-theme-primary));
}

.debug-event--receive {
  border-left-color: rgb(var(--v-theme-secondary));
}

.debug-event__header {
  display: flex;
  gap: 16px;
  margin-bottom: 4px;
}

.debug-event__timestamp {
  font-family: monospace;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.debug-event__components {
  font-weight: bold;
}

.debug-event__name {
  font-style: italic;
}

.debug-event__payload {
  font-family: monospace;
  font-size: 12px;
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
  padding: 4px;
  border-radius: 2px;
  overflow-x: auto;
}
</style> 