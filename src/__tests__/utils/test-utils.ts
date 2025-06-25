// import { mount, VueWrapper } from '@vue/test-utils'
// import { createPinia, setActivePinia } from 'pinia'
// import { createVuetify } from 'vuetify'
// import * as components from 'vuetify/components'
// import * as directives from 'vuetify/directives'

// // Helper to create a fresh Pinia for each test
// export function setupPinia() {
//   const pinia = createPinia()
//   setActivePinia(pinia)
//   return pinia
// }

// // Setup Vuetify for component testing
// export function setupVuetify() {
//   return createVuetify({
//     components,
//     directives
//   })
// }

// // Mount a component with Pinia and Vuetify
// interface MountOptions {
//   props?: Record<string, any>
//   global?: Record<string, any>
// }

// export function mountWithContext(component: any, options: MountOptions = {}): VueWrapper<any> {
//   const pinia = setupPinia()
//   const vuetify = setupVuetify()
  
//   return mount(component, {
//     props: options.props || {},
//     global: {
//       plugins: [pinia, vuetify],
//       ...options.global
//     }
//   })
// }

// // Type check helper (for testing type guards)
// export function assertType<T>(value: any): asserts value is T {
//   // This function doesn't actually do anything at runtime
//   // It's just a type assertion helper for TypeScript
// }

// Role-based test helpers for owner/admin context
// Usage:
//   setOwnerUser(authStore, 'owner1')
//   setAdminUser(authStore, 'admin1')
//   addOwnerBookings(bookingStore, 'owner1', 3)
//   addAdminBookings(bookingStore, 5)

import type { User, Booking } from '@/types';

export function setOwnerUser(authStore: { user: User | null }, id = 'owner1') {
  authStore.user = {
    id,
    email: `${id}@example.com`,
    name: 'Property Owner',
    role: 'owner',
    settings: {
      notifications: true,
      timezone: 'America/New_York',
      theme: 'light',
      language: 'en',
    },
  };
}

export function setAdminUser(authStore: { user: User | null }, id = 'admin1') {
  authStore.user = {
    id,
    email: `${id}@example.com`,
    name: 'Business Admin',
    role: 'admin',
    settings: {
      notifications: true,
      timezone: 'America/New_York',
      theme: 'light',
      language: 'en',
    },
  };
}

export function addOwnerBookings(bookingStore: { addBooking: (b: Booking) => void }, ownerId: string, count: number) {
  for (let i = 1; i <= count; i++) {
    bookingStore.addBooking({
      id: `booking${i}`,
      property_id: `prop${i}`,
      owner_id: ownerId,
      checkout_date: '2023-06-01T11:00:00Z',
      checkin_date: '2023-06-03T15:00:00Z',
      booking_type: 'standard',
      status: 'pending',
    });
  }
}

export function addAdminBookings(bookingStore: { addBooking: (b: Booking) => void }, count: number) {
  for (let i = 1; i <= count; i++) {
    bookingStore.addBooking({
      id: `adminBooking${i}`,
      property_id: `adminProp${i}`,
      owner_id: `owner${i}`,
      checkout_date: '2023-06-01T11:00:00Z',
      checkin_date: '2023-06-03T15:00:00Z',
      booking_type: i % 2 === 0 ? 'turn' : 'standard',
      status: i % 2 === 0 ? 'scheduled' : 'pending',
    });
  }
} 