import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should redirect unauthenticated users from dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    // Should redirect to login
    await page.waitForURL(/login|\/$/);
    expect(page.url()).toMatch(/login|\/$/);
  });

  test('should show signup page', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should show password reset page', async ({ page }) => {
    await page.goto('/reset-password');
    await expect(page.locator('body')).toBeVisible();
  });
});
