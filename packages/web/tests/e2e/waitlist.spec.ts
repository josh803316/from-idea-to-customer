import { test, expect } from '@playwright/test';

test.describe('Waitlist form', () => {
  test('waitlist page renders', async ({ page }) => {
    await page.goto('/waitlist');
    await expect(page.getByRole('heading', { name: 'Join the waitlist' })).toBeVisible();
  });

  test('email input is present', async ({ page }) => {
    await page.goto('/waitlist');
    await expect(page.getByLabel('Email address')).toBeVisible();
  });

  test('submit button is present', async ({ page }) => {
    await page.goto('/waitlist');
    await expect(page.getByRole('button', { name: 'Join waitlist' })).toBeVisible();
  });

  test('home page has waitlist form in the footer section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
  });

  // NOTE: Full form submission test requires the API to be running.
  // In CI, this test is skipped unless the API is available.
  test('form shows loading state when submitted', async ({ page }) => {
    // Intercept the API call to prevent actual network request
    await page.route('**/email/subscribe', async (route) => {
      // Delay and then return success
      await new Promise((r) => setTimeout(r, 100));
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto('/waitlist');
    await page.getByLabel('Email address').fill('test@playwright.dev');
    await page.getByRole('button', { name: 'Join waitlist' }).click();

    // Should show loading state briefly
    await expect(page.getByRole('button', { name: /Joining/ })).toBeVisible();

    // Then show success
    await expect(page.getByText("You're on the list!")).toBeVisible({ timeout: 5000 });
  });
});
