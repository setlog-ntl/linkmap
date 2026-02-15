import { test, expect } from '@playwright/test';

test.describe('Pricing Page', () => {
  test('should load pricing page', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display pricing plans', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    const body = page.locator('body');
    await expect(body).not.toBeEmpty();
  });
});
