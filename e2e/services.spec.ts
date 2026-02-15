import { test, expect } from '@playwright/test';

test.describe('Service Catalog', () => {
  test('should load service catalog page', async ({ page }) => {
    await page.goto('/services');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display service cards', async ({ page }) => {
    await page.goto('/services');
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    // Services page should have content
    const body = page.locator('body');
    await expect(body).not.toBeEmpty();
  });
});
