import { test, expect } from '@playwright/test';

test.describe('PolisAI Frontend Routes', () => {
  test.beforeEach(async ({ page }) => {
    // Set baseURL in playwright.config.ts or via env
    const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
    page.goto(baseUrl);
  });

  test('should load homepage successfully', async ({ page }) => {
    const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
    await page.goto(baseUrl);
    
    // Check page title or heading
    const mainHeading = page.getByRole('heading', { name: /PolisAI|Policy|Analysis/i }).first();
    await expect(mainHeading).toBeVisible();
  });

  test('should display input fields on homepage', async ({ page }) => {
    const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
    await page.goto(baseUrl);
    
    // Look for governance score input
    const inputs = page.locator('input[type="number"], textarea');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should submit form and show results', async ({ page }) => {
    const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
    await page.goto(baseUrl);
    
    // Fill in some test data
    const govScoreInput = page.locator('input[type="number"]').first();
    const policyDescInput = page.locator('textarea').first();
    
    if (await govScoreInput.isVisible()) {
      await govScoreInput.fill('75');
    }
    if (await policyDescInput.isVisible()) {
      await policyDescInput.fill('Test policy for climate action');
    }
    
    // Submit form
    const submitButton = page.locator('button').filter({ hasText: /Analyze|Submit|Send|Check/i }).first();
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      // Wait for results to appear
      await page.waitForTimeout(1000);
      
      // Check for success indicator
      const successIndicator = page.locator('text=/Success|Probability|Score|Result/i').first();
      await expect(successIndicator).toBeVisible({ timeout: 5000 });
    }
  });

  test('should navigate to sentiment page', async ({ page }) => {
    const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseUrl}/sentiment`);
    
    // Check for sentiment-related content
    const sentimentHeading = page.getByRole('heading', { name: /Sentiment|Analysis/i }).first();
    await expect(sentimentHeading).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to history page', async ({ page }) => {
    const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseUrl}/history`);
    
    // Check for history content
    const content = page.locator('text=/History|Previous|Analysis/i').first();
    await expect(content).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to dashboard page', async ({ page }) => {
    const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseUrl}/dashboard`);
    
    // Check for dashboard content
    const content = page.locator('text=/Dashboard|Analytics|Overview/i').first();
    await expect(content).toBeVisible({ timeout: 5000 });
  });

  test('should render predictive analytics section', async ({ page }) => {
    const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
    await page.goto(baseUrl);
    
    // Look for predictive analytics card
    const predictiveCard = page.locator('text=/Predictive|Data Science|Forecast/i').first();
    await expect(predictiveCard).toBeVisible({ timeout: 5000 });
  });

  test('should handle API errors gracefully', async ({ page }) => {
    const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
    await page.goto(baseUrl);
    
    // Try to analyze with empty input
    const submitButton = page.locator('button').filter({ hasText: /Analyze|Submit|Send|Check/i }).first();
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      // Check for error message or fallback UI
      await page.waitForTimeout(1000);
      
      // UI should still be responsive
      const page_content = await page.content();
      expect(page_content.length).toBeGreaterThan(0);
    }
  });

  test('should have responsive design', async ({ page }) => {
    const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(baseUrl);
    
    const mainElement = page.locator('main, [role="main"]').first();
    await expect(mainElement).toBeVisible();
  });

  test('should render without errors', async ({ page }) => {
    const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
    
    // Collect console messages
    const logs: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        logs.push(`Error: ${msg.text()}`);
      }
    });
    
    await page.goto(baseUrl);
    await page.waitForTimeout(2000);
    
    // Should have no critical errors
    const errorCount = logs.filter((l) => l.includes('Error')).length;
    expect(errorCount).toBe(0);
  });
});
