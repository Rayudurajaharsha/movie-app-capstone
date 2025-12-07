// @ts-check
const { test, expect } = require('@playwright/test');

// FIX: Updated to port 5174 to match your running server
const LOCAL_URL = 'http://127.0.0.1:5174';

test('has title and login button', async ({ page }) => {
    // 1. Go to the app
    await page.goto(LOCAL_URL);

    // 2. Check if the browser tab title is correct (Vite default or changed)
    // Note: You might want to update index.html title later, but for now we check the h1

    // 3. Verify the Main Heading exists
    const heading = page.getByRole('heading', { name: '🎬 Movie App' });
    await expect(heading).toBeVisible();

    // 4. Verify the Login button is visible
    const loginBtn = page.getByRole('button', { name: 'Login' });
    await expect(loginBtn).toBeVisible();

    // 5. Verify the movie grid loaded (checks for at least one image)
    // We wait a moment for the API to fetch
    await page.waitForSelector('.movie-card');
    const movies = await page.locator('.movie-card');
    const count = await movies.count();

    // We expect at least 1 movie to be present
    expect(count).toBeGreaterThan(0);
});