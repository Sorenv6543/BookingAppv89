# Performance & Optimization Reference

## **Vue 3 Performance Patterns**

### **Reactive Performance with Map Collections**
```typescript
// Efficient Map operations in stores
// stores/user.ts - Optimized Map handling
export const useUserStore = defineStore('user', () => {
  const houses = reactive(new Map<string, Property>());
  const events = reactive(new Map<string, Booking>());

  // ✅ Efficient: Use Map methods directly
  const addProperty = (property: Property): void => {
    houses.set(property.id, property);
  };

  // ✅ Efficient: Batch operations
  const addMultipleProperties = (properties: Property[]): void => {
    properties.forEach(property => {
      houses.set(property.id, property);
    });
  };

  // ✅ Efficient: Computed with proper dependencies
  const activeProperties = computed((): Property[] => {
    return Array.from(houses.values()).filter(prop => prop.active);
  });

  // ❌ Avoid: Converting Map to Array unnecessarily
  const inefficientFilter = computed(() => {
    return [...houses.values()].filter(prop => prop.active); // Creates new array each time
  });

  // ✅ Efficient: Direct Map lookup
  const getPropertyById = computed(() => (id: string): Property | undefined => {
    return houses.get(id); // O(1) lookup
  });

  // ❌ Avoid: Array.find on converted Map
  const inefficientLookup = (id: string): Property | undefined => {
    return Array.from(houses.values()).find(prop => prop.id === id); // O(n) lookup
  };

  return {
    houses,
    events,
    addProperty,
    addMultipleProperties,
    activeProperties,
    getPropertyById
  };
});
```

### **Component Performance Optimization**
```vue
<!-- FullCalendar.vue - Optimized for large datasets -->
<template>
  <div class="calendar-container">
    <FullCalendar
      ref="calendarRef"
      :options="calendarOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, shallowRef, readonly } from 'vue';
import { useMemoize } from '@vueuse/core';

interface Props {
  bookings: Map<string, Booking>;
  properties: Map<string, Property>;
}

const props = defineProps<Props>();

// ✅ Use shallowRef for large objects that don't need deep reactivity
const calendarRef = shallowRef<InstanceType<typeof FullCalendar>>();

// ✅ Memoize expensive computations
const memoizedEventConversion = useMemoize((bookingsMap: Map<string, Booking>) => {
  return Array.from(bookingsMap.values()).map(booking => {
    const property = props.properties.get(booking.property_id);
    return convertBookingToEvent(booking, property);
  });
});

// ✅ Optimized computed with proper caching
const calendarEvents = computed(() => {
  // Only recalculate if bookings Map reference changes
  return memoizedEventConversion(props.bookings);
});

// ✅ Use readonly for data that shouldn't be mutated
const calendarOptions = computed(() => readonly({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  events: calendarEvents.value,
  eventDidMount: handleEventMount,
  // ... other options
}));

// ✅ Efficient event mounting with minimal DOM manipulation
const handleEventMount = (info: any): void => {
  const booking = info.event.extendedProps.booking;
  
  // Only add classes/styling that's necessary
  if (booking.booking_type === 'turn') {
    info.el.classList.add('turn-booking');
  }
  
  // Use data attributes instead of heavy DOM manipulation
  info.el.dataset.bookingId = booking.id;
  info.el.dataset.status = booking.status;
};
</script>
```

### **Efficient List Rendering**
```vue
<!-- PropertyList.vue - Optimized list performance -->
<template>
  <div class="property-list">
    <!-- ✅ Use key for efficient diffing -->
    <PropertyCard
      v-for="property in paginatedProperties"
      :key="property.id"
      :property="property"
      @edit="handleEdit"
      @delete="handleDelete"
    />
    
    <!-- ✅ Virtual scrolling for large lists -->
    <VirtualList
      v-if="properties.size > 100"
      :items="propertiesArray"
      :item-height="120"
      height="600px"
    >
      <template #default="{ item }">
        <PropertyCard :property="item" />
      </template>
    </VirtualList>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import VirtualList from '@/components/dumb/VirtualList.vue';

interface Props {
  properties: Map<string, Property>;
  loading?: boolean;
}

const props = defineProps<Props>();

// ✅ Pagination for better performance
const page = ref(1);
const itemsPerPage = 20;

const propertiesArray = computed((): Property[] => {
  return Array.from(props.properties.values());
});

const paginatedProperties = computed((): Property[] => {
  const start = (page.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return propertiesArray.value.slice(start, end);
});

// ✅ Debounced search to avoid excessive filtering
const searchTerm = ref('');
const debouncedSearch = useDebounceFn(() => {
  // Perform search
}, 300);

watch(searchTerm, debouncedSearch);
</script>
```

## **Pinia Store Optimization**

### **Efficient Store Actions**
```typescript
// stores/user.ts - Optimized store actions
export const useUserStore = defineStore('user', () => {
  const state = reactive({
    houses: new Map<string, Property>(),
    events: new Map<string, Booking>(),
    loading: false
  });

  // ✅ Batch updates to reduce reactivity overhead
  const setInitialData = (properties: Property[], bookings: Booking[]): void => {
    // Clear existing data
    state.houses.clear();
    state.events.clear();
    
    // Batch set new data
    properties.forEach(property => {
      state.houses.set(property.id, property);
    });
    
    bookings.forEach(booking => {
      state.events.set(booking.id, booking);
    });
  };

  // ✅ Optimistic updates for better UX
  const optimisticUpdateBooking = async (
    id: string, 
    updates: Partial<Booking>
  ): Promise<void> => {
    const originalBooking = state.events.get(id);
    if (!originalBooking) return;

    // Apply optimistic update immediately
    const optimisticBooking = { ...originalBooking, ...updates };
    state.events.set(id, optimisticBooking);

    try {
      // Perform actual API call
      const updatedBooking = await updateBookingAPI(id, updates);
      state.events.set(id, updatedBooking);
    } catch (error) {
      // Revert on error
      state.events.set(id, originalBooking);
      throw error;
    }
  };

  // ✅ Selective updates to minimize reactivity triggers
  const updateBookingStatus = (id: string, status: BookingStatus): void => {
    const booking = state.events.get(id);
    if (booking && booking.status !== status) {
      // Create new object to trigger reactivity
      state.events.set(id, {
        ...booking,
        status,
        updated_at: new Date().toISOString()
      });
    }
  };

  return {
    ...toRefs(state),
    setInitialData,
    optimisticUpdateBooking,
    updateBookingStatus
  };
});
```

### **Store Subscription Optimization**
```typescript
// composables/useStoreSubscriptions.ts
export const useStoreSubscriptions = () => {
  const userStore = useUserStore();
  const router = useRouter();

  // ✅ Selective subscriptions to avoid unnecessary updates
  const subscribeToBookingChanges = (callback: (booking: Booking) => void): (() => void) => {
    return userStore.$subscribe(
      (mutation, state) => {
        // Only trigger for booking changes
        if (mutation.storeId === 'user' && 'events' in mutation.payload) {
          const bookingId = Object.keys(mutation.payload.events)[0];
          const booking = state.events.get(bookingId);
          if (booking) {
            callback(booking);
          }
        }
      },
      { detached: true } // Don't auto-unsubscribe on component unmount
    );
  };

  // ✅ Debounced subscriptions for high-frequency updates
  const subscribeToBulkChanges = (callback: () => void): (() => void) => {
    const debouncedCallback = useDebounceFn(callback, 100);
    
    return userStore.$subscribe(() => {
      debouncedCallback();
    });
  };

  return {
    subscribeToBookingChanges,
    subscribeToBulkChanges
  };
};
```

## **Supabase Performance Optimization**

### **Efficient Database Queries**
```typescript
// composables/useOptimizedQueries.ts
export const useOptimizedQueries = () => {
  const supabase = useSupabaseClient();

  // ✅ Use select to limit data transfer
  const fetchBookingsOptimized = async (userId: string): Promise<Booking[]> => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        property_id,
        checkout_date,
        checkin_date,
        booking_type,
        status,
        properties:property_id (
          name,
          address
        )
      `)
      .eq('owner_id', userId)
      .order('checkout_date', { ascending: true })
      .limit(100); // Reasonable limit

    if (error) throw error;
    return data || [];
  };

  // ✅ Batch inserts for multiple items
  const createMultipleBookings = async (bookings: BookingInsert[]): Promise<Booking[]> => {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookings)
      .select();

    if (error) throw error;
    return data || [];
  };

  // ✅ Use RPC for complex queries
  const getBookingAnalytics = async (userId: string) => {
    const { data, error } = await supabase
      .rpc('get_booking_analytics', {
        user_id: userId,
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date().toISOString()
      });

    if (error) throw error;
    return data;
  };

  // ✅ Implement query caching
  const cachedQueries = new Map<string, { data: any; timestamp: number }>();
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  const getCachedQuery = async <T>(
    key: string,
    queryFn: () => Promise<T>
  ): Promise<T> => {
    const cached = cachedQueries.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      return cached.data;
    }

    const data = await queryFn();
    cachedQueries.set(key, { data, timestamp: now });
    return data;
  };

  return {
    fetchBookingsOptimized,
    createMultipleBookings,
    getBookingAnalytics,
    getCachedQuery
  };
};
```

### **Real-time Subscription Optimization**
```typescript
// composables/useOptimizedRealtime.ts
export const useOptimizedRealtime = () => {
  const supabase = useSupabaseClient();
  const userStore = useUserStore();

  // ✅ Targeted subscriptions with filters
  const subscribeToUserBookings = (userId: string) => {
    return supabase
      .channel(`bookings:owner_id=eq.${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `owner_id=eq.${userId}`
        },
        (payload) => {
          handleBookingChange(payload);
        }
      )
      .subscribe();
  };

  // ✅ Batched real-time updates
  const pendingUpdates = new Set<string>();
  const flushUpdates = useDebounceFn(() => {
    const updates = Array.from(pendingUpdates);
    pendingUpdates.clear();
    
    // Process all updates at once
    updates.forEach(updateId => {
      // Apply batched updates
    });
  }, 100);

  const handleBookingChange = (payload: any): void => {
    pendingUpdates.add(payload.new?.id || payload.old?.id);
    flushUpdates();
  };

  return {
    subscribeToUserBookings
  };
};
```

## **Calendar Performance Optimization**

### **FullCalendar Optimization**
```typescript
// composables/useOptimizedCalendar.ts
export const useOptimizedCalendar = () => {
  // ✅ Event source optimization
  const createOptimizedEventSource = (bookings: Map<string, Booking>) => {
    return {
      events: (fetchInfo: any, successCallback: any) => {
        // Only fetch events in visible date range
        const visibleEvents = Array.from(bookings.values()).filter(booking => {
          const checkoutDate = new Date(booking.checkout_date);
          return checkoutDate >= fetchInfo.start && checkoutDate <= fetchInfo.end;
        });

        const calendarEvents = visibleEvents.map(booking => 
          convertBookingToEvent(booking)
        );

        successCallback(calendarEvents);
      }
    };
  };

  // ✅ Optimized event rendering
  const eventRenderCallback = (info: any) => {
    // Use DocumentFragment for efficient DOM manipulation
    const fragment = document.createDocumentFragment();
    
    // Minimal DOM creation
    const eventElement = document.createElement('div');
    eventElement.className = 'custom-event';
    eventElement.textContent = info.event.title;
    
    // Add to fragment
    fragment.appendChild(eventElement);
    
    return { domNodes: [fragment] };
  };

  // ✅ Event mutation handling
  const handleEventDrop = useDebounceFn(async (info: any) => {
    try {
      await updateBooking(info.event.id, {
        checkout_date: info.event.start.toISOString(),
        checkin_date: info.event.end?.toISOString() || info.event.start.toISOString()
      });
    } catch (error) {
      info.revert(); // Revert change on error
    }
  }, 300);

  return {
    createOptimizedEventSource,
    eventRenderCallback,
    handleEventDrop
  };
};
```

## **Bundle Size Optimization**

### **Code Splitting Strategy**
```typescript
// router/index.ts - Lazy loading routes
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/index.vue') // Lazy loaded
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/pages/admin/dashboard.vue'),
    // ✅ Route-level code splitting
    children: [
      {
        path: 'analytics',
        component: () => import('@/pages/admin/analytics.vue') // Separate chunk
      }
    ]
  }
];

// ✅ Component-level code splitting
const LazyCalendar = defineAsyncComponent({
  loader: () => import('@/components/smart/FullCalendar.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000
});
```

### **Tree Shaking Optimization**
```typescript
// ✅ Import only what you need from libraries
import { ref, computed, watch } from 'vue'; // Not import * as Vue
import { createVuetify } from 'vuetify';
import { VBtn, VCard, VTextField } from 'vuetify/components'; // Specific imports

// ✅ Configure Vuetify for tree shaking
export default createVuetify({
  components: {
    VBtn,
    VCard,
    VTextField
    // Only register components you use
  }
});

// ✅ Lodash with tree shaking
import debounce from 'lodash/debounce'; // Not import _ from 'lodash'
import throttle from 'lodash/throttle';
```

## **Memory Management**

### **Cleanup Patterns**
```typescript
// composables/useLifecycleCleanup.ts
export const useLifecycleCleanup = () => {
  const cleanupFunctions = new Set<() => void>();

  const addCleanup = (fn: () => void): void => {
    cleanupFunctions.add(fn);
  };

  const removeCleanup = (fn: () => void): void => {
    cleanupFunctions.delete(fn);
  };

  // ✅ Automatic cleanup on unmount
  onUnmounted(() => {
    cleanupFunctions.forEach(fn => {
      try {
        fn();
      } catch (error) {
        console.error('Cleanup function failed:', error);
      }
    });
    cleanupFunctions.clear();
  });

  return {
    addCleanup,
    removeCleanup
  };
};

// Usage in components
export const useRealTimeSubscription = () => {
  const { addCleanup } = useLifecycleCleanup();

  const subscription = supabase
    .channel('bookings')
    .on('postgres_changes', {}, handler)
    .subscribe();

  // ✅ Register cleanup
  addCleanup(() => {
    supabase.removeChannel(subscription);
  });
};
```

### **Efficient Event Listeners**
```vue
<script setup lang="ts">
// ✅ Passive event listeners for better scroll performance
const handleScroll = (event: Event): void => {
  // Handle scroll
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// ✅ Use AbortController for cleanup
const controller = new AbortController();

onMounted(() => {
  window.addEventListener('resize', handleResize, { 
    signal: controller.signal 
  });
});

onUnmounted(() => {
  controller.abort(); // Removes all listeners automatically
});
</script>
```

## **Performance Monitoring**

### **Performance Metrics**
```typescript
// utils/performance.ts
export const measurePerformance = (name: string, fn: () => void | Promise<void>) => {
  return async () => {
    const start = performance.now();
    
    try {
      await fn();
    } finally {
      const end = performance.now();
      console.log(`${name} took ${end - start} milliseconds`);
      
      // Report to analytics if needed
      if (end - start > 1000) { // Log slow operations
        console.warn(`Slow operation detected: ${name}`);
      }
    }
  };
};

// Usage
const optimizedFetchBookings = measurePerformance(
  'fetchBookings',
  fetchBookings
);
```

### **Bundle Analysis**
```json
// package.json - Bundle analysis scripts
{
  "scripts": {
    "analyze": "npm run build && npx vite-bundle-analyzer dist",
    "size-limit": "size-limit",
    "lighthouse": "lighthouse http://localhost:3000 --output json --output-path ./lighthouse-report.json"
  },
  "size-limit": [
    {
      "path": "dist/assets/*.js",
      "limit": "500 KB"
    }
  ]
}
```

This performance reference provides comprehensive optimization strategies specifically tailored for your Vue 3 + TypeScript + Map collections architecture, ensuring your property cleaning scheduler remains fast and responsive even with large datasets.