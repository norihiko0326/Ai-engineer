const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const screenshotDir = 'c:\\AI Engineering Course\\screenshots';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  try {
    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Check for errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Take initial screenshot
    const initialPath = path.join(screenshotDir, '01-initial.png');
    await page.screenshot({ path: initialPath });
    console.log(`✅ Initial screenshot: ${initialPath}`);

    // Wait for any element to ensure page is loaded
    await page.waitForSelector('body', { timeout: 5000 });

    // Get all text content to see what's rendered
    const bodyText = await page.locator('body').textContent();
    console.log('\nPage content preview:');
    console.log(bodyText.substring(0, 500));

    // Look for task-related elements
    const allDivs = await page.locator('div').count();
    console.log(`\nTotal div elements: ${allDivs}`);

    // Try to find h6 elements (Material-UI headers)
    const headers = await page.locator('h6').all();
    console.log(`Found ${headers.length} h6 headers`);

    for (let i = 0; i < Math.min(headers.length, 5); i++) {
      const text = await headers[i].textContent();
      console.log(`  - ${text}`);
    }

    // Take a screenshot of whatever is loaded
    const fullPath = path.join(screenshotDir, '02-full-page.png');
    await page.screenshot({ path: fullPath, fullPage: true });
    console.log(`✅ Full page screenshot: ${fullPath}`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
