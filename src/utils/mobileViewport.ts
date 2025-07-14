/**
 * Mobile Viewport Utilities
 * Handles dynamic viewport height calculations for mobile devices
 */

export interface ViewportDimensions {
  height: number;
  width: number;
  availableHeight: number;
  safeAreaTop: number;
  safeAreaBottom: number;
}

/**
 * Get current viewport dimensions with safe area calculations
 */
export function getViewportDimensions(): ViewportDimensions {
  const height = window.innerHeight;
  const width = window.innerWidth;
  
  // Get safe area insets from CSS environment variables
  const safeAreaTop = parseInt(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--safe-area-inset-top') || '0'
  );
  
  const safeAreaBottom = parseInt(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--safe-area-inset-bottom') || '0'
  );
  
  const availableHeight = height - safeAreaTop - safeAreaBottom;
  
  return {
    height,
    width,
    availableHeight,
    safeAreaTop,
    safeAreaBottom
  };
}

/**
 * Calculate calendar height for mobile viewport
 */
export function calculateCalendarHeight(): string {
  const { availableHeight, width } = getViewportDimensions();
  const appBarHeight = 56;
  const headerHeight = 60;
  const paddingBuffer = 20;
  
  // Mobile-specific calculation
  if (width <= 959) {
    const calculatedHeight = availableHeight - appBarHeight - headerHeight - paddingBuffer;
    const minHeight = 400; // Minimum height for usability
    const maxHeight = availableHeight - 100; // Maximum to prevent overflow
    
    const finalHeight = Math.max(minHeight, Math.min(calculatedHeight, maxHeight));
    return `${finalHeight}px`;
  }
  
  // Desktop fallback
  return '100%';
}

/**
 * Handle viewport resize events for mobile
 */
export function handleViewportResize(callback: () => void): () => void {
  let resizeTimeout: number;
  
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      callback();
    }, 100); // Debounce resize events
  };
  
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleResize);
    clearTimeout(resizeTimeout);
  };
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  return window.innerWidth <= 959;
}

/**
 * Get optimized calendar options for mobile
 */
export function getMobileCalendarOptions() {
  const { width } = getViewportDimensions();
  
  if (width <= 599) {
    // Mobile phone - reduced dayMaxEvents to trigger bottom sheet sooner
    return {
      height: calculateCalendarHeight(),
      dayMaxEvents: 1,
      eventDisplay: 'block',
      headerToolbar: false,
      initialView: 'dayGridMonth',
      aspectRatio: undefined,
      expandRows: true,
      eventMinHeight: 20,
      dayHeaderFormat: { weekday: 'narrow' }
    };
  } else if (width <= 959) {
    // Tablet - reduced dayMaxEvents to trigger bottom sheet sooner
    return {
      height: calculateCalendarHeight(),
      dayMaxEvents: 2,
      eventDisplay: 'block',
      headerToolbar: false,
      initialView: 'dayGridMonth',
      aspectRatio: undefined,
      expandRows: true,
      eventMinHeight: 24,
      dayHeaderFormat: { weekday: 'short' }
    };
  }
  
  // Desktop fallback - keep more events visible on desktop
  return {
    height: '100%',
    dayMaxEvents: 3,
    eventDisplay: 'block',
    headerToolbar: false,
    initialView: 'dayGridMonth',
    aspectRatio: undefined,
    expandRows: true,
    eventMinHeight: 28,
    dayHeaderFormat: { weekday: 'short' }
  };
}