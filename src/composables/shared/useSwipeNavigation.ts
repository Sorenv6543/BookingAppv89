import { onMounted, onUnmounted } from 'vue';
import { useCalendarState } from './useCalendarState';

/**
 * Swipe Navigation Composable
 * Provides touch/swipe gesture support for calendar navigation
 * - Swipe left: Next month
 * - Swipe right: Previous month
 * - Mobile-optimized with touch detection
 */
export function useSwipeNavigation() {
  const calendarState = useCalendarState();

  // Touch/Swipe Navigation Variables
  let touchStartX = 0;
  let touchStartY = 0;
  let isSwiping = false;

  /**
   * Touch/Swipe Navigation Functions
   */
  const handleTouchStart = (event: TouchEvent): void => {
    if (event.touches.length === 1) {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
      isSwiping = false;
    }
  };

  const handleTouchMove = (event: TouchEvent): void => {
    if (event.touches.length === 1) {
      const deltaX = Math.abs(event.touches[0].clientX - touchStartX);
      const deltaY = Math.abs(event.touches[0].clientY - touchStartY);
      
      // Start tracking swipe if horizontal movement is greater than vertical
      if (deltaX > deltaY && deltaX > 10) {
        isSwiping = true;
      }
    }
  };

  const handleTouchEnd = (event: TouchEvent): void => {
    if (isSwiping && event.changedTouches.length === 1) {
      const deltaX = event.changedTouches[0].clientX - touchStartX;
      const threshold = 50; // Minimum distance for a swipe

      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          // Swipe right - go to previous month
          calendarState.prev();
        } else {
          // Swipe left - go to next month
          calendarState.next();
        }
      }
    }
    isSwiping = false;
  };

  /**
   * Lifecycle
   */
  onMounted(() => {
    // Add touch event listeners for mobile swipe navigation
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
  });

  onUnmounted(() => {
    // Remove event listeners
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  });

  return {
    // Extend base calendar state
    ...calendarState,

    // Touch navigation functions (for manual attachment if needed)
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
} 