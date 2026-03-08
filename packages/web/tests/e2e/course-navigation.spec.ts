import { test, expect } from '@playwright/test';

test.describe('Course navigation', () => {
  test('courses listing page renders', async ({ page }) => {
    await page.goto('/courses');
    await expect(page.getByRole('heading', { name: 'Courses' })).toBeVisible();
  });

  test('course card links to course overview', async ({ page }) => {
    await page.goto('/courses');
    // Click the first course link
    const firstCourse = page.getByRole('link', { name: /From Idea to Customer/ }).first();
    await expect(firstCourse).toBeVisible();
    await firstCourse.click();
    await expect(page).toHaveURL(/\/courses\//);
  });

  test('course overview page shows modules and lessons', async ({ page }) => {
    await page.goto('/courses/idea-to-customer');
    await expect(page.getByRole('heading', { name: 'From Idea to Customer' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Thinking Like a PM' })).toBeVisible();
  });

  test('lesson page renders with correct title', async ({ page }) => {
    await page.goto(
      '/courses/idea-to-customer/module-01-thinking-like-a-pm/lesson-01',
    );
    await expect(page.getByRole('heading', { level: 1, name: 'Understanding User Problems' })).toBeVisible();
  });

  test('lesson page has breadcrumb navigation', async ({ page }) => {
    await page.goto(
      '/courses/idea-to-customer/module-01-thinking-like-a-pm/lesson-01',
    );
    const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByRole('link', { name: 'Courses' })).toBeVisible();
  });

  test('lesson page shows learning objectives', async ({ page }) => {
    await page.goto(
      '/courses/idea-to-customer/module-01-thinking-like-a-pm/lesson-01',
    );
    await expect(page.getByText("What you'll learn")).toBeVisible();
  });

  test('navigating back from lesson returns to course overview', async ({ page }) => {
    await page.goto(
      '/courses/idea-to-customer/module-01-thinking-like-a-pm/lesson-01',
    );
    await page.getByRole('link', { name: 'From Idea to Customer' }).click();
    await expect(page).toHaveURL('/courses/idea-to-customer');
  });
});
