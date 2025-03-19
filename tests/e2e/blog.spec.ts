import { test, expect } from '@playwright/test';

test('Blog page has expected h1', async ({ page }) => {
  await page.goto('/blog');
  const blogPosts = await page.locator('div.blog-post');
  const count = await blogPosts.count();
  expect(count).toBeGreaterThan(3);
});