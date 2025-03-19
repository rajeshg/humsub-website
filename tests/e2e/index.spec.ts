import { test, expect } from '@playwright/test';

test('Index page has expected h1', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('section#hero')).toContainText('HUM SUB'); // Replace 'Welcome' with the actual heading text
});