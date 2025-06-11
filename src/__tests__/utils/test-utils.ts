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