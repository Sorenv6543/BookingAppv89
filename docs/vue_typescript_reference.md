# Vue 3 + TypeScript Essential Reference

## **Core Component Patterns**

### **Script Setup with TypeScript**
```vue
<script setup lang="ts">
// Type-based props definition
interface Props {
  property: Property;
  bookings: Map<string, Booking>;
  mode?: 'create' | 'edit';
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create'
});

// Type-based emits
interface Emits {
  (e: 'save', booking: BookingFormData): void;
  (e: 'delete', id: string): void;
  (e: 'close'): void;
}

const emit = defineEmits<Emits>();

// Reactive refs with types
const form = reactive<Partial<Booking>>({
  property_id: '',
  checkout_date: '',
  checkin_date: '',
  booking_type: 'standard'
});

// Template refs
const modal = useTemplateRef<HTMLDivElement>('modal');

// Computed with explicit typing
const validBookings = computed((): Booking[] => {
  return Array.from(props.bookings.values())
    .filter(booking => booking.status === 'completed');
});
</script>
```

### **Composable Patterns**
```typescript
// useBookings.ts
interface UseBookingsReturn {
  bookings: ComputedRef<Map<string, Booking>>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  createBooking: (booking: BookingFormData) => Promise<Booking>;
  updateBooking: (id: string, updates: Partial<Booking>) => Promise<Booking>;
  deleteBooking: (id: string) => Promise<void>;
}

export const useBookings = (): UseBookingsReturn => {
  const userStore = useUserStore();
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const createBooking = async (bookingData: BookingFormData): Promise<Booking> => {
    loading.value = true;
    try {
      const newBooking: Booking = {
        ...bookingData,
        id: crypto.randomUUID(),
        owner_id: userStore.user?.id || '',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      userStore.addEvent(newBooking);
      return newBooking;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    bookings: computed(() => userStore.events),
    loading,
    error,
    createBooking,
    updateBooking,
    deleteBooking
  };
};
```

## **Pinia Store Patterns**

### **Setup Stores with TypeScript**
```typescript
// stores/user.ts
interface UserState {
  user: User | null;
  houses: Map<string, Property>;
  events: Map<string, Booking>;
  settings: UserSettings;
}

export const useUserStore = defineStore('user', () => {
  const state = reactive<UserState>({
    user: null,
    houses: new Map<string, Property>(),
    events: new Map<string, Booking>(),
    settings: {
      notifications: true,
      timezone: 'America/New_York',
      theme: 'light',
      language: 'en'
    }
  });

  // Getters with explicit return types
  const getPropertyById = computed(() => (id: string): Property | undefined => {
    return state.houses.get(id);
  });

  const propertiesArray = computed((): Property[] => {
    return Array.from(state.houses.values());
  });

  // Actions with proper typing
  const addProperty = (property: Property): void => {
    state.houses.set(property.id, property);
  };

  const updateProperty = (id: string, updates: Partial<Property>): void => {
    const existing = state.houses.get(id);
    if (existing) {
      state.houses.set(id, { 
        ...existing, 
        ...updates, 
        updated_at: new Date().toISOString() 
      });
    }
  };

  return {
    // State
    user: computed(() => state.user),
    houses: computed(() => state.houses),
    events: computed(() => state.events),
    
    // Getters
    getPropertyById,
    propertiesArray,
    
    // Actions
    addProperty,
    updateProperty
  };
});
```

### **Option Stores Alternative**
```typescript
interface UserState {
  user: User | null;
  houses: Map<string, Property>;
  events: Map<string, Booking>;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    houses: new Map<string, Property>(),
    events: new Map<string, Booking>()
  }),

  getters: {
    propertiesArray(): Property[] {
      return Array.from(this.houses.values());
    },
    
    getPropertyById(): (id: string) => Property | undefined {
      return (id: string) => this.houses.get(id);
    }
  },

  actions: {
    addProperty(property: Property): void {
      this.houses.set(property.id, property);
    },

    updateProperty(id: string, updates: Partial<Property>): void {
      const existing = this.houses.get(id);
      if (existing) {
        this.houses.set(id, { ...existing, ...updates });
      }
    }
  }
});
```

## **Map Collection Patterns**

### **Working with Map in Templates**
```vue
<template>
  <!-- Convert Map to Array for v-for -->
  <div v-for="[id, property] in housesEntries" :key="id">
    {{ property.name }}
  </div>
  
  <!-- Or use computed property -->
  <div v-for="property in propertiesArray" :key="property.id">
    {{ property.name }}
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();

// Convert Map to entries for iteration
const housesEntries = computed(() => Array.from(userStore.houses.entries()));

// Convert Map to values array
const propertiesArray = computed(() => Array.from(userStore.houses.values()));
</script>
```

### **Map Operations**
```typescript
// Adding to Map
const addProperty = (property: Property): void => {
  houses.set(property.id, property);
};

// Getting from Map with fallback
const getProperty = (id: string): Property | undefined => {
  return houses.get(id);
};

// Updating Map entry
const updateProperty = (id: string, updates: Partial<Property>): void => {
  const existing = houses.get(id);
  if (existing) {
    houses.set(id, { ...existing, ...updates });
  }
};

// Filtering Map values
const activeProperties = computed((): Property[] => {
  return Array.from(houses.values()).filter(prop => prop.active);
});

// Removing from Map
const removeProperty = (id: string): void => {
  houses.delete(id);
};
```

## **Vue Router 4 + TypeScript**

### **Route Typing**
```typescript
// router/index.ts
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/index.vue')
  },
  {
    path: '/properties/:id',
    name: 'PropertyDetail',
    component: () => import('@/pages/properties/[id].vue'),
    props: true
  }
];
```

### **Using Router in Components**
```vue
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import type { LocationQueryValue } from 'vue-router';

const router = useRouter();
const route = useRoute();

// Type-safe route params
const propertyId = computed((): string => {
  return route.params.id as string;
});

// Type-safe query params
const mode = computed((): string => {
  return (route.query.mode as string) || 'view';
});

// Programmatic navigation
const navigateToProperty = (id: string): void => {
  router.push({ 
    name: 'PropertyDetail', 
    params: { id },
    query: { mode: 'edit' }
  });
};
</script>
```

## **Event Handling Patterns**

### **Type-Safe Event Handlers**
```vue
<script setup lang="ts">
// Form submission
const handleSubmit = (event: Event): void => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  // Handle form data
};

// Input events
const handleInput = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  form.value.name = target.value;
};

// Custom component events
const handleBookingSave = (booking: BookingFormData): void => {
  // Handle the booking save
};

// Calendar events
const handleDateSelect = (selectInfo: DateSelectArg): void => {
  const { start, end } = selectInfo;
  // Handle date selection
};
</script>

<template>
  <form @submit="handleSubmit">
    <input @input="handleInput" />
  </form>
  
  <BookingModal @save="handleBookingSave" />
  
  <FullCalendar @dateSelect="handleDateSelect" />
</template>
```

## **Common TypeScript Utilities**

### **Type Guards**
```typescript
// Type guard functions
export const isBooking = (obj: any): obj is Booking => {
  return obj && typeof obj.id === 'string' && typeof obj.checkout_date === 'string';
};

export const isProperty = (obj: any): obj is Property => {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string';
};

// Usage in components
const handleSelection = (item: unknown): void => {
  if (isBooking(item)) {
    // TypeScript knows item is Booking
    console.log(item.checkout_date);
  } else if (isProperty(item)) {
    // TypeScript knows item is Property
    console.log(item.name);
  }
};
```

### **Utility Types**
```typescript
// Create form types from main interfaces
export type BookingFormData = Omit<Booking, 'id' | 'created_at' | 'updated_at'>;
export type PropertyFormData = Omit<Property, 'id' | 'created_at' | 'updated_at'>;

// Partial updates
export type BookingUpdate = Partial<Pick<Booking, 'status' | 'notes' | 'guest_count'>>;

// API response types
export type ApiResponse<T> = {
  data: T;
  error?: string;
  message?: string;
};

// Map type helpers
export type PropertyMap = Map<string, Property>;
export type BookingMap = Map<string, Booking>;
```