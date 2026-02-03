# Responsive Layout System Documentation

## Overview

The responsive layout system provides a comprehensive solution for creating adaptive layouts that work seamlessly across all device sizes while maintaining the role-based multi-tenant architecture.

## Architecture

### Core Components

1. **useResponsiveLayout Composable** - Centralized responsive state management
2. **Responsive CSS Utilities** - SCSS classes and utilities for layout behavior
3. **Enhanced Layouts** - Updated `default.vue` and `admin.vue` layouts
4. **Role-Based Integration** - Proper integration with `OwnerSidebar` and `AdminSidebar`

### Key Features

- **Mobile-First Design**: Optimized for mobile devices with progressive enhancement
- **Role-Based Responsiveness**: Different responsive behavior for owner vs admin interfaces
- **PWA-Friendly**: Supports PWA features and mobile app patterns
- **Touch-Optimized**: Larger touch targets and mobile-friendly interactions
- **Swipe Gestures**: Native mobile navigation patterns

## Breakpoint System

Following Vuetify's breakpoint specification:

| Breakpoint | Device Type | Width Range | Behavior |
|------------|-------------|-------------|----------|
| xs | Extra small | < 600px | Mobile-first, temporary drawer |
| sm | Small | 600px - 959px | Tablet, temporary drawer |
| md | Medium | 960px - 1279px | Small desktop, permanent drawer |
| lg | Large | 1280px - 1919px | Desktop, permanent drawer with rail option |
| xl | Extra large | ≥ 1920px | Large desktop, permanent drawer |

## useResponsiveLayout Composable

### Usage

```typescript
import { useResponsiveLayout } from '@/composables/shared/useResponsiveLayout'

const {
  // Breakpoint detection
  isMobile, isTablet, isDesktop,
  currentBreakpoint, width, height,
  
  // Drawer state
  isDrawerOpen, shouldDrawerBePermanent, 
  isDrawerRail, drawerWidth,
  
  // Layout properties
  layoutClasses, layoutStyles,
  
  // Methods
  toggleDrawer, openDrawer, closeDrawer
} = useResponsiveLayout()
```

### Key Properties

#### Breakpoint Detection
- `isMobile`: Boolean for mobile devices (< 960px)
- `isTablet`: Boolean for tablet devices (600-959px)
- `isDesktop`: Boolean for desktop devices (≥ 960px)
- `currentBreakpoint`: Current breakpoint name ('xs', 'sm', 'md', 'lg', 'xl')

#### Drawer State
- `isDrawerOpen`: Controls temporary drawer visibility
- `shouldDrawerBePermanent`: Whether drawer should be permanent (desktop)
- `shouldDrawerBeTemporary`: Whether drawer should be temporary (mobile/tablet)
- `isDrawerRail`: Whether drawer is in rail mode (desktop only)
- `drawerWidth`: Dynamic drawer width based on state

#### Layout Utilities
- `layoutClasses`: Object with CSS classes for current state
- `layoutStyles`: CSS custom properties for dynamic styling
- `appBarHeight`: Dynamic app bar height
- `contentPadding`: Responsive content padding

## Layout Implementation

### Owner Layout (default.vue)

```vue
<template>
  <v-app :class="[layoutClasses, 'responsive-layout', 'mobile-optimized']">
    <!-- Owner Sidebar with responsive behavior -->
    <OwnerSidebar
      v-if="shouldShowDrawer"
      :permanent="shouldDrawerBePermanent"
      :temporary="shouldDrawerBeTemporary"
      :rail="isDrawerRail && isDesktop"
    />
    
    <!-- Responsive App Bar -->
    <v-app-bar
      :height="appBarHeight"
      :class="{ 'mobile': isMobile, 'desktop': isDesktop }"
    >
      <!-- Mobile: Simple navigation -->
      <!-- Desktop: Full navigation with tools -->
    </v-app-bar>
    
    <!-- Mobile-specific UI components -->
    <v-bottom-sheet v-if="isMobile" v-model="mobileMenuOpen">
      <!-- Mobile menu -->
    </v-bottom-sheet>
  </v-app>
</template>
```

### Admin Layout (admin.vue)

Similar structure but with admin-specific components and business management features.

## CSS Architecture

### Responsive Classes

```scss
// Applied automatically by useResponsiveLayout
.responsive-layout {
  --drawer-width: 380px;
  --app-bar-height: 64px;
  --content-padding: 24px;
  
  &.is-mobile {
    --drawer-width: 320px;
    --app-bar-height: 56px;
    --content-padding: 16px;
  }
}
```

### Mobile Optimizations

```scss
.mobile-optimized {
  .v-btn {
    min-height: 44px; // Touch-friendly targets
    min-width: 44px;
  }
  
  .v-list-item {
    min-height: 48px; // Larger list items
  }
}
```

### Utility Classes

```scss
// Visibility utilities
.hide-mobile { display: none !important; } // On mobile
.show-mobile { display: block !important; } // On mobile only
.hide-desktop { display: none !important; } // On desktop
.show-desktop { display: block !important; } // On desktop only
```

## Role-Based Responsive Patterns

### Owner Interface
- **Focus**: Simple, personal property management
- **Mobile**: Simplified navigation, essential features only
- **Desktop**: Full feature set with sidebar integration
- **Key Features**: Property overview, turn alerts, calendar access

### Admin Interface  
- **Focus**: Comprehensive business management
- **Mobile**: System alerts, essential admin tools
- **Desktop**: Full dashboard with analytics and controls
- **Key Features**: System-wide monitoring, cleaner management, reports

## Mobile Navigation Patterns

### Navigation Drawer
- **Desktop**: Permanent sidebar with rail mode option
- **Mobile**: Temporary overlay drawer with swipe gestures

### App Bar Behavior
- **Desktop**: Full navigation with tools and user menu
- **Mobile**: Compact with hamburger menu and essential actions

### Touch Interactions
- **Swipe Gestures**: Swipe from left edge to open drawer
- **Touch Targets**: 44px minimum for comfortable interaction
- **Feedback**: Visual feedback for touch interactions

## PWA Integration

### Viewport Handling
```scss
.pwa-responsive {
  height: 100vh;
  height: 100dvh; // Dynamic viewport height for mobile
}
```

### Safe Area Support
```scss
.mobile-safe-area {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

## Implementation Guide

### 1. Basic Setup

```typescript
// In your layout component
import { useResponsiveLayout } from '@/composables/shared/useResponsiveLayout'

const {
  isMobile,
  layoutClasses,
  layoutStyles,
  toggleDrawer
} = useResponsiveLayout()
```

### 2. Template Integration

```vue
<template>
  <v-app :class="layoutClasses" :style="layoutStyles">
    <!-- Your responsive content -->
  </v-app>
</template>
```

### 3. CSS Classes

```vue
<template>
  <div class="responsive-layout mobile-optimized">
    <v-btn class="hide-mobile">Desktop Only</v-btn>
    <v-btn class="show-mobile">Mobile Only</v-btn>
  </div>
</template>
```

## Testing

### Demo Component
Use `ResponsiveLayoutDemo.vue` to test responsive behavior:
- View current breakpoint information
- Test layout state changes
- Verify responsive utilities
- Check CSS variable values

### Breakpoint Testing
1. **Chrome DevTools**: Toggle device toolbar and test different screen sizes
2. **Real Devices**: Test on actual mobile devices and tablets
3. **PWA Mode**: Test in standalone PWA mode

### Navigation Testing
1. **Drawer Behavior**: Verify permanent/temporary drawer switching
2. **Swipe Gestures**: Test mobile swipe navigation
3. **Touch Targets**: Ensure comfortable mobile interaction

## Best Practices

### Component Design
1. **Mobile-First**: Design for mobile, enhance for desktop
2. **Progressive Enhancement**: Add features based on screen size
3. **Touch-Friendly**: Use appropriate touch target sizes
4. **Performance**: Minimize layout shifts during responsive changes

### Layout Patterns
1. **Consistent Behavior**: Use the composable for consistent responsive logic
2. **Role-Specific**: Tailor responsive behavior to user roles
3. **Accessibility**: Maintain accessibility across all breakpoints
4. **Testing**: Test thoroughly on various devices and orientations

### CSS Organization
1. **Utility Classes**: Use provided utility classes for common patterns
2. **Custom Properties**: Leverage CSS variables for dynamic styling
3. **Media Queries**: Use Vuetify's breakpoint system consistently
4. **Performance**: Minimize CSS specificity and selector complexity

## Troubleshooting

### Common Issues

1. **Drawer Not Showing**: Check `shouldShowDrawer` computed property
2. **Layout Shift**: Ensure CSS custom properties are applied
3. **Mobile Menu**: Verify mobile menu state management
4. **Touch Issues**: Check touch target sizes and event handlers

### Debug Tools

1. **ResponsiveLayoutDemo**: Use demo component for debugging
2. **Vuetify DevTools**: Check display composable values
3. **Browser DevTools**: Inspect applied CSS classes and variables
4. **Console Logging**: Add logging to track state changes

## Migration Guide

### From Previous Layout System

1. **Replace Layout Logic**: Use `useResponsiveLayout` instead of custom logic
2. **Update CSS**: Apply responsive utility classes
3. **Mobile Menu**: Implement mobile menu patterns
4. **Test Thoroughly**: Verify all breakpoints work correctly

### Sidebar Integration

1. **Props**: Update sidebar component props for responsive behavior
2. **Events**: Handle drawer state updates properly
3. **Mobile Behavior**: Ensure temporary drawer works on mobile
4. **Rail Mode**: Implement rail mode for desktop efficiency

This responsive layout system provides a robust foundation for creating adaptive, role-based interfaces that work seamlessly across all devices while maintaining the multi-tenant architecture patterns. 