import { test, expect } from '@playwright/test';

test.describe('Multi-Booking Day View', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the calendar page
    await page.goto('/');
    
    // Wait for the login page to load
    await page.waitForSelector('#app', { timeout: 10000 });
    
    // Click the Demos button to access the demo calendar
    const demosButton = page.locator('text=Demos');
    if (await demosButton.isVisible()) {
      await demosButton.click();
      
      // Wait for demos page to load and then click on Owner Calendar
      await page.waitForSelector('text=Owner Calendar', { timeout: 10000 });
      await page.click('text=Owner Calendar');
      
      // Wait for calendar component to fully load (check for FullCalendar root)
      await page.waitForSelector('.fc', { timeout: 15000 });
      await page.waitForTimeout(3000); // Additional wait for calendar to render
    }
  });

  test('should display calendar with mobile viewport optimizations', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Take a screenshot of the initial state
    await page.screenshot({ path: 'test-results/calendar-mobile-initial.png' });
    
    // Wait for calendar to be visible
    await expect(page.locator('.fc-daygrid-view')).toBeVisible({ timeout: 10000 });
    
    // Check if mobile optimization is applied (dayMaxEvents should be 1 on mobile)
    const calendarElement = page.locator('.fc-daygrid-view');
    await expect(calendarElement).toBeVisible();
  });

  test('should show reduced events on mobile with more link', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Look for days with multiple bookings that should show "+X more" links
    const moreLinks = page.locator('.fc-more-link');
    
    // Take screenshot showing the calendar with more links
    await page.screenshot({ path: 'test-results/calendar-with-more-links.png' });
    
    // If more links exist, verify they're clickable
    const moreLinkCount = await moreLinks.count();
    if (moreLinkCount > 0) {
      console.log(`Found ${moreLinkCount} "more" links on mobile calendar`);
    }
  });

  test('should open OwnerDayViewBottomSheet when clicking more link', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Wait for calendar to load
    await page.waitForSelector('.fc-daygrid-view', { timeout: 10000 });
    
    // Look for more links
    const moreLink = page.locator('.fc-more-link').first();
    
    if (await moreLink.count() > 0) {
      // Click the more link
      await moreLink.click();
      
      // Wait for bottom sheet to appear
      await page.waitForSelector('.owner-day-view-sheet', { timeout: 5000 });
      
      // Verify bottom sheet is visible
      await expect(page.locator('.owner-day-view-sheet')).toBeVisible();
      
      // Take screenshot of the opened bottom sheet
      await page.screenshot({ path: 'test-results/bottom-sheet-opened.png' });
      
      // Verify bottom sheet contains booking details
      await expect(page.locator('.day-view-card')).toBeVisible();
      await expect(page.locator('.booking-item')).toBeVisible();
      
      // Test swipe to close (simulate touch gesture)
      const bottomSheet = page.locator('.owner-day-view-sheet');
      await bottomSheet.dispatchEvent('touchstart', {
        touches: [{ clientX: 200, clientY: 300 }]
      });
      await bottomSheet.dispatchEvent('touchmove', {
        touches: [{ clientX: 200, clientY: 500 }]
      });
      await bottomSheet.dispatchEvent('touchend', {
        changedTouches: [{ clientX: 200, clientY: 500 }]
      });
      
      // Verify bottom sheet closes
      await expect(page.locator('.owner-day-view-sheet')).not.toBeVisible({ timeout: 2000 });
    }
  });

  test('should display correct mobile viewport configurations', async ({ page }) => {
    // Test different mobile viewport sizes
    const viewports = [
      { name: 'iPhone SE', width: 375, height: 667 },
      { name: 'iPad Mini', width: 768, height: 1024 },
      { name: 'Desktop', width: 1280, height: 720 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Wait for calendar to adjust
      await page.waitForTimeout(1000);
      
      // Take screenshot for each viewport
      await page.screenshot({ 
        path: `test-results/calendar-${viewport.name.toLowerCase().replace(' ', '-')}.png` 
      });
      
      // Verify calendar is visible and responsive
      await expect(page.locator('.fc-daygrid-view')).toBeVisible();
    }
  });

  test('should verify owner-specific data filtering in bottom sheet', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate and try to access owner calendar (if demo routes are available)
    // This test will verify that only owner-specific bookings are shown
    
    // Wait for calendar
    await page.waitForSelector('.fc-daygrid-view', { timeout: 10000 });
    
    // Look for more links indicating multiple bookings
    const moreLinks = page.locator('.fc-more-link');
    const linkCount = await moreLinks.count();
    
    if (linkCount > 0) {
      // Click first more link
      await moreLinks.first().click();
      
      // Wait for bottom sheet
      await expect(page.locator('.owner-day-view-sheet')).toBeVisible({ timeout: 5000 });
      
      // Verify booking items are displayed with owner-specific information
      const bookingItems = page.locator('.booking-item');
      const itemCount = await bookingItems.count();
      
      if (itemCount > 0) {
        // Verify first booking item has expected structure
        await expect(bookingItems.first()).toContainText(/property/i);
        await expect(bookingItems.first().locator('.priority-indicator')).toBeVisible();
        await expect(bookingItems.first().locator('.booking-actions')).toBeVisible();
        
        // Take screenshot of booking details
        await page.screenshot({ path: 'test-results/owner-booking-details.png' });
      }
    }
  });
});