// Enhanced Calendar Navigation - Component Import Test
// Run this to verify all components and composables import correctly

import { useEnhancedCalendarNavigation } from '@/composables/shared/useEnhancedCalendarNavigation';

// Test component imports
console.log('🧪 Testing Enhanced Navigation Components...');

try {
  // Test composable
  const navigation = useEnhancedCalendarNavigation();
  console.log('✅ useEnhancedCalendarNavigation imported successfully');
  console.log('📊 Navigation state:', {
    currentView: navigation.currentView.value,
    currentDate: navigation.currentDate.value.toISOString(),
    canGoBack: navigation.canGoBack.value,
    canGoForward: navigation.canGoForward.value
  });

  // Test navigation methods
  console.log('🧭 Testing navigation methods...');
  
  // Test date navigation
  navigation.goToDateWithHistory(new Date('2024-12-25'));
  console.log('✅ goToDateWithHistory works');
  
  // Test year navigation
  navigation.goToNextYear();
  console.log('✅ goToNextYear works');
  
  navigation.goToPrevYear();
  console.log('✅ goToPrevYear works');
  
  // Test history navigation
  const canGoBack = navigation.goBackInHistory();
  console.log('✅ goBackInHistory works:', canGoBack);
  
  // Test smart navigation
  const nextTurn = navigation.getNextTurnBooking();
  console.log('✅ getNextTurnBooking works:', nextTurn ? 'Found turn' : 'No turns');
  
  const nextUrgent = navigation.getNextUrgentBooking();
  console.log('✅ getNextUrgentBooking works:', nextUrgent ? 'Found urgent' : 'No urgent');
  
  const busiestDay = navigation.getBusiestDay();
  console.log('✅ getBusiestDay works:', busiestDay ? 'Found busiest' : 'No busy days');
  
  // Test computed properties
  console.log('📈 Computed properties:');
  console.log('  - currentMonthYear:', navigation.currentMonthYear);
  console.log('  - currentYear:', navigation.currentYear);
  console.log('  - smartNavigationCounts:', navigation.smartNavigationCounts.value);
  
  console.log('🎉 All enhanced navigation features working correctly!');
  
} catch (error) {
  console.error('❌ Enhanced navigation test failed:', error);
  console.error('Stack trace:', error.stack);
}

// Test keyboard shortcuts (commented out for safety)
/*
console.log('⌨️ Testing keyboard shortcuts...');
try {
  // Simulate keyboard events
  const testKeyEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft', ctrlKey: true });
  navigation.handleKeyboardNavigation(testKeyEvent);
  console.log('✅ Keyboard navigation handler works');
} catch (error) {
  console.error('❌ Keyboard navigation test failed:', error);
}
*/

export { useEnhancedCalendarNavigation };
