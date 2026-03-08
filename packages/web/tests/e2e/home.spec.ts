import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('renders and has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/From Idea to Customer/);
  });

  test('has OG meta tags', async ({ page }) => {
    await page.goto('/');
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /From Idea to Customer/);
  });

  test('has twitter card meta tags', async ({ page }) => {
    await page.goto('/');
    const twitterCard = page.locator('meta[name="twitter:card"]');
    await expect(twitterCard).toHaveAttribute('content', 'summary_large_image');
  });

  test('hero section is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('feature grid renders', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: "What you'll learn" })).toBeVisible();
  });

  test('navigation links are present', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Courses' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Join Waitlist' })).toBeVisible();
  });
});
