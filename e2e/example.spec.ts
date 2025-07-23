import { test, expect } from '@playwright/test';

test('basic application test', async ({ page }) => {
  await page.goto('/');
  
  // Wait for the Vue app to mount
  await page.waitForSelector('#app', { timeout: 10000 });
  
  // Take a screenshot
  await page.screenshot({ path: 'test-results/basic-app-test.png' });
  
  // Check if the page has a title
  await expect(page).toHaveTitle(/Property Cleaning Scheduler/);
  
  // Basic DOM check - look for Vue app mounting point
  await expect(page.locator('#app')).toBeVisible();
});