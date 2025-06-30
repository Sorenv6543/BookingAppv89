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
    primary: '#2196F3', // Blue - For main actions and navigation
    secondary: '#7d7ff1', // Blue Grey - For secondary actions and info
    accent: '#045ecc', // Green - For highlighting completed states
    error: '#80b3ec', // Red - For urgent turn bookings and errors
    info: '#03A9F4', // Light Blue - For informational elements
    success: '#4CAF50', // Green - For success indicators
    warning: '#FF9800', // Orange - For high-priority bookings
    background: '#fde1e1', // Soft Blue - App background
    surface: '#ffffff', // Very Light #e6bfbf - Cards and surfaces
    'on-background': '#1C1B1F',
    'on-surface': '#1C1B1F',
    'surface-variant': '#69acfa', // Subtle card contrast
    'on-surface-variant': '#49454F',
    'turn-urgent': '#F44336', // Red for urgent turn bookings
    'turn-standard': '#FF9800', // Orange for standard turn bookings
    'booking-standard': '#2196F3', // Blue for standard bookings
  }
};

const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#42A5F5', // Lighter Blue - More visible in dark mode
    secondary: '#78909C', // Lighter Blue Grey
    accent: '#66BB6A', // Lighter Green
    error: '#2eacb1', // Lighter Red for better visibility
    info: '#29B6F6', // Lighter Light Blue
    success: '#66BB6A', // Lighter Green
    warning: '#ffc164', // Lighter Orange
    background: '#121212', // Dark Grey - App background
    surface: '#1E1E1E', // Slightly lighter dark grey - Cards and surfaces
    'on-background': '#E6E1E5',
    'on-surface': '#E6E1E5',
    'surface-variant': '#2D2D2D',
    'on-surface-variant': '#CAC4D0',
    'turn-urgent': '#bcffae', // Lighter Red for urgent turn bookings
    'turn-standard': '#FFA726', // Lighter Orange for standard turn bookings
    'booking-standard': '#42A5F5', // Lighter Blue for standard bookings
  }
};
// Green Theme (Nature)
const greenTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#4CAF50', // Green
    secondary: '#8BC34A', // Light Green
    accent: '#00BCD4', // Cyan
    error: '#d8c5c4', // #979191
    info: '#2196F3', // Blue
    success: '#4CAF50', // Green
    warning: '#2697f3', // #1e8ae2
    background: '#ffffff', // Light Grey Blue
    surface: '#899ae6', // #82a0f1
    'on-background': '#1C1B1F',
    'on-surface': '#1C1B1F',
    'surface-variant': '#90d4fc',
    'on-surface-variant': '#49454F',
    'turn-urgent': '#1572ec', // Red
    'turn-standard': '#FF9800', // Orange
    'booking-standard': '#4CAF50', // Green
  }
};

// Dark Green Theme
const darkGreenTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#66BB6A', // Lighter Green
    secondary: '#9CCC65', // Lighter Light Green
    accent: '#26C6DA', // Lighter Cyan
    error: '#41e4ae', // Lighter Red
    info: '#29B6F6', // Lighter Blue
    success: '#66BB6A', // Lighter Green
    warning: '#b37e2f', // Lighter Orange
    background: '#121212', // Dark Grey
    surface: '#1E1E1E', // Slightly lighter dark grey
    'on-background': '#E6E1E5',
    'on-surface': '#E6E1E5',
    'surface-variant': '#2D2D2D',
    'on-surface-variant': '#CAC4D0',
    'turn-urgent': '#EF5350', // Lighter Red
    'turn-standard': '#FFA726', // Lighter Orange
    'booking-standard': '#66BB6A', // Lighter Green
  }
};

// Purple Theme (Royal)
const purpleTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#9C27B0', // Purple
    secondary: '#673AB7', // Deep Purple
    accent: '#3F51B5', // Indigo
    error: '#F44336', // Red
    info: '#2196F3', // Blue
    success: '#4CAF50', // Green
    warning: '#FF9800', // Orange
    background: '#4d8ef0', // Light #812323 Blue
    surface: '#f16767', // #e93f3f
    'on-background': '#1C1B1F',
    'on-surface': '#1C1B1F',
    'surface-variant': '#ff2b2b',
    'on-surface-variant': '#49454F',
    'turn-urgent': '#F44336', // Red
    'turn-standard': '#FF9800', // Orange
    'booking-standard': '#9C27B0', // Purple
  }
};

// Dark Purple Theme
const darkPurpleTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#AB47BC', // Lighter Purple
    secondary: '#7E57C2', // Lighter Deep Purple
    accent: '#5C6BC0', // Lighter Indigo
    error: '#7a50ef', // Lighter Red
    info: '#29B6F6', // Lighter Blue
    success: '#66BB6A', // Lighter Green
    warning: '#d19e51', // Lighter Orange
    background: '#121212', // Dark Grey
    surface: '#1E1E1E', // Slightly lighter dark grey
    'on-background': '#E6E1E5',
    'on-surface': '#E6E1E5',
    'surface-variant': '#2D2D2D',
    'on-surface-variant': '#CAC4D0',
    'turn-urgent': '#EF5350', // Lighter Red
    'turn-standard': '#FFA726', // Lighter Orange
    'booking-standard': '#AB47BC', // Lighter Purple
  }
};

// Orange Theme (Warm)
const orangeTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#FF5722', // Deep Orange
    secondary: '#FF9800', // Orange
    accent: '#FFC107', // Amber
    error: '#F44336', // Red
    info: '#2196F3', // Blue
    success: '#4CAF50', // Green
    warning: '#FF9800', // Orange
    background: '#F5F7FA', // Light Grey Blue
    surface: '#FFFFFF', // White
    'on-background': '#1C1B1F',
    'on-surface': '#1C1B1F',
    'surface-variant': '#EEEEEE',
    'on-surface-variant': '#49454F',
    'turn-urgent': '#F44336', // Red
    'turn-standard': '#FF9800', // Orange
    'booking-standard': '#FF5722', // Deep Orange
  }
};

// Dark Orange Theme
const darkOrangeTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#FF7043', // Lighter Deep Orange
    secondary: '#FFA726', // Lighter Orange
    accent: '#FFD54F', // Lighter Amber
    error: '#EF5350', // Lighter Red
    info: '#29B6F6', // Lighter Blue
    success: '#66BB6A', // Lighter Green
    warning: '#FFA726', // Lighter Orange
    background: '#121212', // Dark Grey
    surface: '#1E1E1E', // Slightly lighter dark grey
    'on-background': '#E6E1E5',
    'on-surface': '#E6E1E5',
    'surface-variant': '#2D2D2D',
    'on-surface-variant': '#CAC4D0',
    'turn-urgent': '#EF5350', // Lighter Red
    'turn-standard': '#FFA726', // Lighter Orange
    'booking-standard': '#FF7043', // Lighter Deep Orange
  }
};

// Teal Theme (Ocean)
const tealTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#e61352', // Teal
    secondary: '#f6f6f6', // Cyan
    accent: '#4CAF50', // Green
    error: '#F44336', // Red
    info: '#2196F3', // Blue
    success: '#4CAF50', // Green
    warning: '#FF9800', // Orange
    background: '#F5F7FA', // Light Grey Blue
    surface: '#FFFFFF', // White
    'on-background': '#1C1B1F',
    'on-surface': '#1C1B1F',
    'surface-variant': '#EEEEEE',
    'on-surface-variant': '#49454F',
    'turn-urgent': '#F44336', // Red
    'turn-standard': '#FF9800', // Orange
    'booking-standard': '#009688', // Teal
  }
};

// Dark Teal Theme
const darkTealTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#26A69A', // Lighter Teal
    secondary: '#26C6DA', // Lighter Cyan
    accent: '#66BB6A', // Lighter Green
    error: '#EF5350', // Lighter Red
    info: '#29B6F6', // Lighter Blue
    success: '#66BB6A', // Lighter Green
    warning: '#FFA726', // Lighter Orange
    background: '#121212', // Dark Grey
    surface: '#1E1E1E', // Slightly lighter dark grey
    'on-background': '#E6E1E5',
    'on-surface': '#E6E1E5',
    'surface-variant': '#2D2D2D',
    'on-surface-variant': '#CAC4D0',
    'turn-urgent': '#EF5350', // Lighter Red
    'turn-standard': '#FFA726', // Lighter Orange
    'booking-standard': '#26A69A', // Lighter Teal
  }
};

// Red Theme (Bold)
const redTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#F44336', // Red
    secondary: '#E91E63', // Pink
    accent: '#9C27B0', // Purple
    error: '#D32F2F', // Darker Red
    info: '#2196F3', // Blue
    success: '#4CAF50', // Green
    warning: '#FF9800', // Orange
    background: '#F5F7FA', // Light Grey Blue
    surface: '#FFFFFF', // White
    'on-background': '#1C1B1F',
    'on-surface': '#1C1B1F',
    'surface-variant': '#EEEEEE',
    'on-surface-variant': '#49454F',
    'turn-urgent': '#D32F2F', // Darker Red
    'turn-standard': '#FF9800', // Orange
    'booking-standard': '#F44336', // Red
  }
};

// Dark Red Theme
const darkRedTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#EF5350', // Lighter Red
    secondary: '#EC407A', // Lighter Pink
    accent: '#AB47BC', // Lighter Purple
    error: '#E53935', // Darker Red
    info: '#29B6F6', // Lighter Blue
    success: '#66BB6A', // Lighter Green
    warning: '#FFA726', // Lighter Orange
    background: '#121212', // Dark Grey
    surface: '#1E1E1E', // Slightly lighter dark grey
    'on-background': '#E6E1E5',
    'on-surface': '#E6E1E5',
    'surface-variant': '#2D2D2D',
    'on-surface-variant': '#CAC4D0',
    'turn-urgent': '#E53935', // Darker Red
    'turn-standard': '#FFA726', // Lighter Orange
    'booking-standard': '#EF5350', // Lighter Red
  }
};

// Brown Theme (Earthy)
const brownTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#795548', // Brown
    secondary: '#9E9E9E', // Grey
    accent: '#FFC107', // Amber
    error: '#F44336', // Red
    info: '#2196F3', // Blue
    success: '#4CAF50', // Green
    warning: '#FF9800', // Orange
    background: '#F5F7FA', // Light Grey Blue
    surface: '#FFFFFF', // White
    'on-background': '#1C1B1F',
    'on-surface': '#1C1B1F',
    'surface-variant': '#EEEEEE',
    'on-surface-variant': '#49454F',
    'turn-urgent': '#F44336', // Red
    'turn-standard': '#FF9800', // Orange
    'booking-standard': '#795548', // Brown
  }
};

// Dark Brown Theme
const darkBrownTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#8D6E63', // Lighter Brown
    secondary: '#BDBDBD', // Lighter Grey
    accent: '#FFD54F', // Lighter Amber
    error: '#EF5350', // Lighter Red
    info: '#29B6F6', // Lighter Blue
    success: '#66BB6A', // Lighter Green
    warning: '#FFA726', // Lighter Orange
    background: '#121212', // Dark Grey
    surface: '#1E1E1E', // Slightly lighter dark grey
    'on-background': '#E6E1E5',
    'on-surface': '#E6E1E5',
    'surface-variant': '#2D2D2D',
    'on-surface-variant': '#CAC4D0',
    'turn-urgent': '#EF5350', // Lighter Red
    'turn-standard': '#FFA726', // Lighter Orange
    'booking-standard': '#8D6E63', // Lighter Brown
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
      dark: darkTheme,
      green: greenTheme,
      darkGreen: darkGreenTheme,
      purple: purpleTheme,
      darkPurple: darkPurpleTheme,
      orange: orangeTheme,
      darkOrange: darkOrangeTheme,
      teal: tealTheme,
      darkTeal: darkTealTheme,
      red: redTheme,
      darkRed: darkRedTheme,
      brown: brownTheme,
      darkBrown: darkBrownTheme
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