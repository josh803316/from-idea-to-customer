import { test, expect } from '@playwright/test';

const LESSON_URL = '/courses/idea-to-customer/module-01-thinking-like-a-pm/lesson-01';
const COOKIE_NAME = 'fitc_progress';

test.describe('Progress tracking', () => {
  test.beforeEach(async ({ context }) => {
    // Clear progress cookie before each test
    await context.clearCookies();
  });

  test('mark complete button is visible on lesson page', async ({ page }) => {
    await page.goto(LESSON_URL);
    const button = page.getByRole('button', { name: 'Mark as complete' });
    await expect(button).toBeVisible();
  });

  test('clicking mark complete updates button state', async ({ page }) => {
    await page.goto(LESSON_URL);
    const button = page.getByRole('button', { name: 'Mark as complete' });
    await button.click();

    // Button should be replaced with completion indicator
    await expect(page.getByText('Lesson complete')).toBeVisible({ timeout: 5000 });
  });

  test('progress cookie is set after marking complete', async ({ page, context }) => {
    await page.goto(LESSON_URL);
    await page.getByRole('button', { name: 'Mark as complete' }).click();
    await page.getByText('Lesson complete').waitFor({ timeout: 5000 });

    const cookies = await context.cookies();
    const progressCookie = cookies.find((c) => c.name === COOKIE_NAME);
    expect(progressCookie).toBeDefined();
    expect(progressCookie?.value).toBeTruthy();
  });

  test('completion persists after page reload', async ({ page }) => {
    await page.goto(LESSON_URL);
    await page.getByRole('button', { name: 'Mark as complete' }).click();
    await page.getByText('Lesson complete').waitFor({ timeout: 5000 });

    // Reload and check state is preserved from cookie
    await page.reload();
    await expect(page.getByText('Lesson complete')).toBeVisible();
  });
});
