const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  const consoleLogs = [];

  page.on('console', msg => {
    const log = `[${msg.type()}] ${msg.text()}`;
    consoleLogs.push(log);
    if (msg.text().includes('Drag') || msg.text().includes('error') || msg.type() === 'error') {
      console.log(log);
    }
  });

  try {
    console.log('Opening http://localhost:5173...');
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(3000);

    console.log('\n🎯 Attempting drag operation...');

    // Get first task card
    const taskCards = await page.locator('[class*="MuiCard"]').all();
    console.log(`Found ${taskCards.length} cards`);

    if (taskCards.length > 0) {
      const firstCard = taskCards[0];
      const cardText = await firstCard.textContent();
      console.log(`First card: "${cardText.substring(0, 30)}..."`);

      // Try to drag
      const box = await firstCard.boundingBox();
      console.log(`Card position: (${box.x}, ${box.y})`);

      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(300);
      console.log('Mouse moved to card');

      await page.mouse.down();
      console.log('Mouse down');
      await page.waitForTimeout(500);

      await page.mouse.move(box.x + 500, box.y);
      console.log('Mouse moved (dragging)');
      await page.waitForTimeout(500);

      await page.mouse.up();
      console.log('Mouse up');
      await page.waitForTimeout(2000);

      console.log('\n📋 Console logs during drag:');
      consoleLogs.forEach(log => {
        if (log.includes('Drag') || log.includes('error')) {
          console.log('  ' + log);
        }
      });

      if (consoleLogs.filter(l => l.includes('Drag')).length === 0) {
        console.log('\n⚠️ No "Drag ended" log found - drag may not have been recognized');
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
