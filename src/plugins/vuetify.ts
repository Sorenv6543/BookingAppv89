// src/plugins/vuetify.ts
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

// Import Vuetify styles - must be imported before components
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

// Theme configuration
// // const _lightTheme: ThemeDefinition = {
//   dark: false,
//   colors: {
//     primary: '#1976d2', 
//     secondary: '#e0e7f81e;',
//     accent: '#045ecc', 
//     error: '#80b3ec', 
//     info: '#6b7280',
//     success: '#093d8b',
//     warning: '#FF9800',
//     background: '#ffffff', 
//     surface: '#ffffff',  
//     'on-background': '#1C1B1F',
//     'on-surface': '#1C1B1F',
//     'surface-variant': '#69acfa', 
//     'on-surface-variant': '#49454F',
//     'turn-urgent': '#F44336',
//     'turn-standard': '#FF9800', 
//     'booking-standard': '#2196F3', 
//   }
// };


export default createVuetify({
  // Don't include components/directives here - vite-plugin-vuetify handles auto-import
  
  // Icon configuration
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  
  // Theme configuration
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#e0e7f81e',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
        },
      },
      dark: {
        colors: {
          primary: '#2196F3',
          secondary: '#424242',
          accent: '#FF4081',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
        },
      }         
    },
    variations: {
      colors: ['primary', 'secondary', 'accent', 'error', 'info', 'success', 'warning'],
      lighten: 5,
      darken: 5
    }
  },
  
  // Default configuration for components
  defaults: {
    VBtn: {
      style: 'text-transform: none;', // Remove uppercase transform
      variant: 'flat',
      rounded: true,
      elevation: 1
    },
    VCard: {
      elevation: 2,
      rounded: 'lg',
      class: 'pa-2'
    },
    VChip: {
      rounded: 'pill',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'lg',
      hideDetails: 'auto'
    },
    VSelect: {
      variant: 'outlined', 
      density: 'comfortable',
      rounded: 'lg',
      hideDetails: 'auto'
    },
    VTextarea: {
      variant: 'outlined',
      rounded: 'lg',
      hideDetails: 'auto'
    },
    VAutocomplete: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'lg',
      hideDetails: 'auto'
    },
    VCombobox: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'lg',
      hideDetails: 'auto'
    },
    VList: {
      bgColor: 'transparent',
      rounded: 'lg'
    },
    VListItem: {
      rounded: 'lg',
      minHeight: '40px'
    },
    VNavigationDrawer: {
      rounded: 'lg',
      elevation: 3
    },
    VDialog: {
      maxWidth: '700px',
      rounded: 'lg'
    },
    VAlert: {
      rounded: 'lg',
      variant: 'tonal'
    },
    VBadge: {
      rounded: 'pill'
    },
    VExpansionPanel: {
      rounded: 'lg',
      elevation: 0
    }
  },
  
  // Display configuration for responsive design
  display: {
    mobileBreakpoint: 'sm',
    thresholds: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  }
});