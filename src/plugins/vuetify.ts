// src/plugins/vuetify.ts
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import type { ThemeDefinition } from 'vuetify';

// Import Vuetify styles
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

// Theme configuration
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
    background: '#FAFAFA',
    surface: '#FFFFFF',
    'on-background': '#1C1B1F',
    'on-surface': '#1C1B1F',
    'surface-variant': '#F5F5F5',
    'on-surface-variant': '#49454F'
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
    surface: '#1E1E1E',
    'on-background': '#E6E1E5',
    'on-surface': '#E6E1E5',
    'surface-variant': '#2D2D2D',
    'on-surface-variant': '#CAC4D0'
  }
};

export default createVuetify({
  components,
  directives,
  
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
      light: lightTheme,
      dark: darkTheme
    },
    variations: {
      colors: ['primary', 'secondary', 'accent'],
      lighten: 4,
      darken: 4
    }
  },
  
  // Default configuration
  defaults: {
    VBtn: {
      style: 'text-transform: none;', // Remove uppercase transform
      variant: 'flat'
    },
    VCard: {
      elevation: 2
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable'
    },
    VSelect: {
      variant: 'outlined', 
      density: 'comfortable'
    },
    VTextarea: {
      variant: 'outlined'
    },
    VAutocomplete: {
      variant: 'outlined',
      density: 'comfortable'
    },
    VCombobox: {
      variant: 'outlined',
      density: 'comfortable'
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