const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const consoleLogs = [];

  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    console.log(`[${msg.type()}] ${msg.text()}`);
  });

  try {
    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173');

    // Wait much longer for scripts to execute
    console.log('Waiting for scripts to load (10 seconds)...');
    await page.waitForTimeout(10000);

    console.log('\n📊 After 10 seconds:');
    const rootContent = await page.locator('#root').innerHTML();
    console.log('Root content length:', rootContent.length);

    if (rootContent.length > 0) {
      console.log('✅ React is rendering!');
      console.log('First 300 chars:', rootContent.substring(0, 300));
    } else {
      console.log('❌ Root is still empty');
    }

    // Check script errors
    const scripts = await page.locator('script').count();
    console.log('Number of scripts:', scripts);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
