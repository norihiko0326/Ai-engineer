const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const consoleLogs = [];
  const networkErrors = [];

  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });

  page.on('response', response => {
    if (response.status() >= 400) {
      networkErrors.push(`${response.status()} ${response.url()}`);
    }
  });

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'load', timeout: 10000 });
    await page.waitForTimeout(3000);

    console.log('📋 Console logs:');
    consoleLogs.forEach(log => console.log(log));

    console.log('\n🔗 Network errors:');
    if (networkErrors.length === 0) {
      console.log('  (none)');
    } else {
      networkErrors.forEach(err => console.log(`  ${err}`));
    }

    console.log('\n📄 Page title:', await page.title());

    const rootContent = await page.locator('#root').innerHTML();
    console.log('\n#root content length:', rootContent.length);
    console.log('First 500 chars:', rootContent.substring(0, 500));

    // Check if React error boundary is showing
    const pageContent = await page.content();
    if (pageContent.includes('error') || pageContent.includes('Error')) {
      console.log('\n⚠️  Error found in page content');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
