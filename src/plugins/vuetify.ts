// src/plugins/vuetify.ts
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as labsComponents from 'vuetify/labs/components';

// Import Vuetify styles (vite-plugin-vuetify handles component styles via autoImport)
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

// Terminal Swiss Design System theme


export default createVuetify({
  components: {
    ...labsComponents,
  },
  
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
          primary: '#000000',
          secondary: '#777777',
          accent: '#E53935',
          error: '#E53935',
          info: '#777777',
          success: '#000000',
          warning: '#E53935',
          background: '#FFFFFF',
          surface: '#FFFFFF',
          'on-background': '#000000',
          'on-surface': '#000000',
          'surface-variant': '#E4E4E4',
          'on-surface-variant': '#777777',
        },
      },
      dark: {
        colors: {
          primary: '#FFFFFF',
          secondary: '#999999',
          accent: '#E53935',
          error: '#E53935',
          info: '#999999',
          success: '#DDDDDD',
          warning: '#E53935',
          background: '#000000',
          surface: '#111111',
          'on-background': '#FFFFFF',
          'on-surface': '#FFFFFF',
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
      style: 'text-transform: none;',
      variant: 'flat',
      rounded: 0,
      elevation: 0
    },
    VCard: {
      elevation: 0,
      rounded: 0,
      class: 'pa-2'
    },
    VChip: {
      rounded: 0,
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 0,
      hideDetails: 'auto'
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 0,
      hideDetails: 'auto'
    },
    VTextarea: {
      variant: 'outlined',
      rounded: 0,
      hideDetails: 'auto'
    },
    VAutocomplete: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 0,
      hideDetails: 'auto'
    },
    VCombobox: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 0,
      hideDetails: 'auto'
    },
    VList: {
      bgColor: 'transparent',
      rounded: 0
    },
    VListItem: {
      rounded: 0,
      minHeight: '40px'
    },
    VNavigationDrawer: {
      rounded: 0,
      elevation: 0
    },
    VDialog: {
      maxWidth: '700px',
      rounded: 0
    },
    VAlert: {
      rounded: 0,
      variant: 'tonal'
    },
    VBadge: {
      rounded: 0
    },
    VExpansionPanel: {
      rounded: 0,
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