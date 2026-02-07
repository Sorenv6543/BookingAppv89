# Vuetify 3 + TypeScript Essential Reference

## **Setup & Configuration**

### **Vuetify Plugin Setup**
```typescript
// src/plugins/vuetify.ts
import { createVuetify } from 'vuetify';
import type { ThemeDefinition } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#1976D2',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    background: '#FFFFFF',
    surface: '#FFFFFF'
  }
};

const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#2196F3',
    secondary: '#424242',
    accent: '#FF4081',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    background: '#121212',
    surface: '#212121'
  }
};

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: lightTheme,
      dark: darkTheme
    }
  }
});
```

### **Main App Integration**
```typescript
// main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import vuetify from './plugins/vuetify';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(vuetify);
app.mount('#app');
```

## **Component Type Patterns**

### **Form Components with Validation**
```Vue3
<template
  <v-form ref="form" v-model="formValid" @submit.prevent="handleSubmit">
    <v-text-field
      v-model="bookingForm.property_id"
      label="Property"
      :rules="propertyRules"
      required
    />
    
    <v-select
      v-model="bookingForm.booking_type"
      :items="bookingTypeItems"
      label="Booking Type"
      :rules="bookingTypeRules"
    />
    
    <v-text-field
      v-model="bookingForm.checkout_date"
      label="Checkout Date"
      type="date"
      :rules="dateRules"
    />
    
    <v-btn 
      type="submit" 
      color="primary" 
      :disabled="!formValid"
      :loading="loading"
    >
      Save Booking
    </v-btn>
  </v-form>
</template>
```
<script setup lang="ts">
import type { VForm } from 'vuetify/components';
import type { BookingFormData, Property } from '@/types';

interface Props {
  properties: Map<string, Property>;
  loading?: boolean;
}

interface Emits {
  (e: 'submit', data: BookingFormData): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

const emit = defineEmits<Emits>();

// Form ref with proper typing
const form = useTemplateRef<VForm>('form');
const formValid = ref<boolean>(false);

// Form data
const bookingForm = reactive<BookingFormData>({
  property_id: '',
  checkout_date: '',
  checkin_date: '',
  booking_type: 'standard',
  guest_count: 1,
  notes: ''
});

// Validation rules with proper typing
const propertyRules = [
  (value: string) => !!value || 'Property is required',
];

const bookingTypeRules = [
  (value: string) => ['standard', 'turn'].includes(value) || 'Invalid booking type',
];

const dateRules = [
  (value: string) => !!value || 'Date is required',
  (value: string) => {
    const date = new Date(value);
    return date > new Date() || 'Date must be in the future';
  }
];

// Select items with proper typing
const bookingTypeItems = [
  { title: 'Standard Booking', value: 'standard' },
  { title: 'Turn (Same Day)', value: 'turn' }
];

const handleSubmit = async (): Promise<void> => {
  if (form.value) {
    const { valid } = await form.value.validate();
    if (valid) {
      emit('submit', { ...bookingForm });
    }
  }
};
</script>
```

### **Data Tables with TypeScript**
```vue
<template>
  <v-data-table
    :headers="headers"
    :items="bookingsArray"
    :loading="loading"
    class="elevation-1"
    item-key="id"
  >
    <!-- Custom header slot -->
    <template #[`header.booking_type`]="{ column }">
      <v-icon icon="mdi-calendar-clock" />
      {{ column.title }}
    </template>
    
    <!-- Custom cell slots -->
    <template #[`item.booking_type`]="{ item }">
      <v-chip 
        :color="getBookingTypeColor(item.booking_type)"
        variant="tonal"
        size="small"
      >
        {{ item.booking_type === 'turn' ? 'URGENT' : 'Standard' }}
      </v-chip>
    </template>
    
    <template #[`item.status`]="{ item }">
      <v-chip 
        :color="getStatusColor(item.status)"
        variant="tonal"
        size="small"
      >
        {{ item.status }}
      </v-chip>
    </template>
    
    <template #[`item.actions`]="{ item }">
      <v-btn
        icon="mdi-pencil"
        variant="text"
        size="small"
        @click="editBooking(item)"
      />
      <v-btn
        icon="mdi-delete"
        variant="text"
        size="small"
        color="error"
        @click="deleteBooking(item.id)"
      />
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import type { VDataTable } from 'vuetify/components';
import type { Booking } from '@/types';

interface Props {
  bookings: Map<string, Booking>;
  loading?: boolean;
}

interface Emits {
  (e: 'edit', booking: Booking): void;
  (e: 'delete', id: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

const emit = defineEmits<Emits>();

// Table headers with proper typing
const headers: VDataTable['headers'] = [
  { title: 'Property', key: 'property_id', sortable: true },
  { title: 'Checkout Date', key: 'checkout_date', sortable: true },
  { title: 'Checkin Date', key: 'checkin_date', sortable: true },
  { title: 'Type', key: 'booking_type', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
];

// Convert Map to Array for data table
const bookingsArray = computed((): Booking[] => {
  return Array.from(props.bookings.values())
    .sort((a, b) => new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime());
});

// Helper functions with proper typing
const getBookingTypeColor = (type: Booking['booking_type']): string => {
  return type === 'turn' ? 'error' : 'primary';
};

const getStatusColor = (status: Booking['status']): string => {
  const colors = {
    pending: 'warning',
    scheduled: 'info', 
    in_progress: 'primary',
    completed: 'success',
    cancelled: 'error'
  };
  return colors[status] || 'grey';
};

const editBooking = (booking: Booking): void => {
  emit('edit', booking);
};

const deleteBooking = (id: string): void => {
  emit('delete', id);
};
</script>
```

### **Dialogs and Modals**
```vue
<template>
  <v-dialog 
    v-model="isOpen" 
    max-width="600px"
    persistent
    @keydown.esc="handleClose"
  >
    <v-card>
      <v-card-title class="text-h5">
        {{ mode === 'create' ? 'Add New Booking' : 'Edit Booking' }}
      </v-card-title>
      
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.checkout_date"
                label="Checkout Date"
                type="date"
                :rules="dateRules"
                required
              />
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.checkin_date"
                label="Checkin Date"
                type="date"
                :rules="dateRules"
                required
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="handleClose"
        >
          Cancel
        </v-btn>
        <v-btn
          v-if="mode === 'edit'"
          color="error"
          variant="text"
          @click="handleDelete"
        >
          Delete
        </v-btn>
        <v-btn
          color="primary"
          variant="text"
          @click="handleSave"
          :disabled="!isFormValid"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Booking, BookingFormData } from '@/types';

interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  booking?: Booking | null;
}

interface Emits {
  (e: 'close'): void;
  (e: 'save', data: BookingFormData): void;
  (e: 'delete', id: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  mode: 'create',
  booking: null
});

const emit = defineEmits<Emits>();

// Modal state
const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => {
    if (!value) emit('close');
  }
});

// Form data
const form = reactive<Partial<Booking>>({
  property_id: '',
  checkout_date: '',
  checkin_date: '',
  booking_type: 'standard',
  guest_count: 1,
  notes: ''
});

// Initialize form when booking prop changes
watch(() => props.booking, (booking) => {
  if (booking && props.mode === 'edit') {
    Object.assign(form, booking);
  } else {
    // Reset form for create mode
    Object.assign(form, {
      property_id: '',
      checkout_date: '',
      checkin_date: '',
      booking_type: 'standard',
      guest_count: 1,
      notes: ''
    });
  }
}, { immediate: true });

// Form validation
const dateRules = [
  (value: string) => !!value || 'Date is required',
  (value: string) => {
    const date = new Date(value);
    return date > new Date() || 'Date must be in the future';
  }
];

const isFormValid = computed((): boolean => {
  return !!(form.property_id && form.checkout_date && form.checkin_date);
});

// Event handlers
const handleClose = (): void => {
  emit('close');
};

const handleSave = (): void => {
  if (isFormValid.value) {
    emit('save', form as BookingFormData);
  }
};

const handleDelete = (): void => {
  if (props.booking?.id) {
    emit('delete', props.booking.id);
  }
};
</script>
```

## **Layout Components**

### **App Layout with Navigation**
```vue
<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          :prepend-icon="item.icon"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar
      app
      clipped-left
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Property Cleaning Scheduler</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="toggleTheme">
        <v-icon>{{ isDark ? 'mdi-brightness-7' : 'mdi-brightness-4' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }} Property Cleaning Scheduler</span>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify';

interface MenuItem {
  title: string;
  icon: string;
  to: string;
}

const theme = useTheme();
const drawer = ref<boolean>(true);

const menuItems: MenuItem[] = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/' },
  { title: 'Properties', icon: 'mdi-home-group', to: '/properties' },
  { title: 'Calendar', icon: 'mdi-calendar', to: '/calendar' },
  { title: 'Settings', icon: 'mdi-cog', to: '/settings' }
];

const isDark = computed((): boolean => {
  return theme.global.current.value.dark;
});

const toggleTheme = (): void => {
  theme.global.name.value = isDark.value ? 'light' : 'dark';
};
</script>
```

## **Theme & Styling Patterns**

### **Using Theme Colors**
```vue
<template>
  <!-- Using theme colors in components -->
  <v-card :color="cardColor" class="mb-4">
    <v-card-title :class="titleClass">
      {{ title }}
    </v-card-title>
  </v-card>
  
  <!-- Conditional styling based on theme -->
  <v-btn 
    :color="isDark ? 'primary' : 'secondary'"
    @click="handleClick"
  >
    Action Button
  </v-btn>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify';

const theme = useTheme();

const isDark = computed((): boolean => {
  return theme.global.current.value.dark;
});

const cardColor = computed((): string => {
  return isDark.value ? 'grey-darken-3' : 'grey-lighten-4';
});

const titleClass = computed((): string => {
  return isDark.value ? 'text-white' : 'text-black';
});
</script>
```

### **Responsive Design Patterns**
```vue
<template>
  <v-container>
    <!-- Responsive grid -->
    <v-row>
      <v-col 
        v-for="property in properties" 
        :key="property.id"
        cols="12" 
        sm="6" 
        md="4" 
        lg="3"
      >
        <property-card :property="property" />
      </v-col>
    </v-row>
    
    <!-- Responsive breakpoint display -->
    <v-sheet class="d-flex align-center justify-center" height="100">
      <span class="text-h6">
        Current breakpoint: {{ currentBreakpoint }}
      </span>
    </v-sheet>
  </v-container>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';
import type { Property } from '@/types';

interface Props {
  properties: Property[];
}

defineProps<Props>();

const { name: currentBreakpoint } = useDisplay();
</script>
```

## **Form Validation Patterns**

### **Custom Validation Rules**
```typescript
// composables/useValidation.ts
export const useValidation = () => {
  const required = (message = 'This field is required') => {
    return (value: any) => !!value || message;
  };

  const email = (message = 'Invalid email address') => {
    return (value: string) => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !value || pattern.test(value) || message;
    };
  };

  const minLength = (min: number, message?: string) => {
    return (value: string) => {
      const msg = message || `Minimum ${min} characters required`;
      return !value || value.length >= min || msg;
    };
  };

  const futureDate = (message = 'Date must be in the future') => {
    return (value: string) => {
      if (!value) return true;
      const date = new Date(value);
      return date > new Date() || message;
    };
  };

  const phoneNumber = (message = 'Invalid phone number') => {
    return (value: string) => {
      if (!value) return true;
      const pattern = /^\+?[\d\s\-\(\)]{10,}$/;
      return pattern.test(value) || message;
    };
  };

  return {
    required,
    email,
    minLength,
    futureDate,
    phoneNumber
  };
};
```

### **Using Validation in Components**
```vue
<script setup lang="ts">
import { useValidation } from '@/composables/useValidation';

const { required, email, minLength, futureDate } = useValidation();

const form = reactive({
  name: '',
  email: '',
  checkoutDate: '',
  notes: ''
});

// Validation rules
const nameRules = [
  required('Property name is required'),
  minLength(3, 'Name must be at least 3 characters')
];

const emailRules = [
  required('Email is required'),
  email('Please enter a valid email address')
];

const dateRules = [
  required('Checkout date is required'),
  futureDate('Checkout date must be in the future')
];
</script>
```

This reference covers the essential Vuetify 3 + TypeScript patterns you'll need for your property cleaning scheduler project. The patterns focus on type safety, proper component composition, and effective use of Vuetify's Material Design components.