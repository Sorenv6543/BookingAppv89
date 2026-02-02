// Import Vuetify styles - must be imported before components
// src/plugins/vuetify.ts
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

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
        dark: false,
        colors: {
          primary: '#1976D2',
          'primary-darken-1': '#1565C0',
          secondary: '#5C6BC0',
          'secondary-darken-1': '#3949AB',
          accent: '#82B1FF',
          error: '#E53935',
          info: '#2196F3',
          success: '#43A047',
          warning: '#FB8C00',
          background: '#FAFAFA',
          surface: '#FFFFFF',
          'surface-bright': '#FFFFFF',
          'surface-light': '#F5F5F5',
          'surface-variant': '#E8EAF6',
          'on-surface-variant': '#49454F',
          'on-background': '#1C1B1F',
          'on-surface': '#1C1B1F',
          // Domain-specific colors
          'turn-urgent': '#E53935',
          'turn-standard': '#FB8C00',
          'booking-standard': '#1E88E5',
        },
        variables: {
          'border-color': '#000000',
          'border-opacity': 0.12,
          'high-emphasis-opacity': 0.87,
          'medium-emphasis-opacity': 0.60,
          'disabled-opacity': 0.38,
          'idle-opacity': 0.04,
          'hover-opacity': 0.04,
          'focus-opacity': 0.12,
          'selected-opacity': 0.08,
          'activated-opacity': 0.12,
          'pressed-opacity': 0.12,
          'dragged-opacity': 0.08,
          'theme-kbd': '#212529',
          'theme-on-kbd': '#FFFFFF',
          'theme-code': '#F5F5F5',
          'theme-on-code': '#000000',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#42A5F5',
          'primary-darken-1': '#1E88E5',
          secondary: '#7986CB',
          'secondary-darken-1': '#5C6BC0',
          accent: '#FF4081',
          error: '#EF5350',
          info: '#42A5F5',
          success: '#66BB6A',
          warning: '#FFA726',
          background: '#121212',
          surface: '#1E1E1E',
          'surface-bright': '#2C2C2C',
          'surface-light': '#333333',
          'surface-variant': '#424242',
          'on-surface-variant': '#EEEEEE',
          'on-background': '#E0E0E0',
          'on-surface': '#E0E0E0',
          'turn-urgent': '#EF5350',
          'turn-standard': '#FFA726',
          'booking-standard': '#42A5F5',
        },
        variables: {
          'border-color': '#FFFFFF',
          'border-opacity': 0.12,
          'high-emphasis-opacity': 0.87,
          'medium-emphasis-opacity': 0.60,
          'disabled-opacity': 0.38,
          'idle-opacity': 0.10,
          'hover-opacity': 0.04,
          'focus-opacity': 0.12,
          'selected-opacity': 0.08,
          'activated-opacity': 0.12,
          'pressed-opacity': 0.12,
          'dragged-opacity': 0.08,
          'theme-kbd': '#212529',
          'theme-on-kbd': '#FFFFFF',
          'theme-code': '#2C2C2C',
          'theme-on-code': '#CCCCCC',
        },
      },
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