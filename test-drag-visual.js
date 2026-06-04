const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const screenshotDir = 'c:\\AI Engineering Course\\screenshots';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  try {
    console.log('🌐 Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(5000);

    // Screenshot 1: Initial state
    const initialPath = path.join(screenshotDir, 'kanban-initial.png');
    await page.screenshot({ path: initialPath });
    console.log(`✅ Screenshot 1: ${initialPath}`);

    // Find a task and drag it
    console.log('\n🎯 Attempting drag-and-drop...');
    const taskCards = await page.locator('[class*="MuiCard"]').all();
    console.log(`Found ${taskCards.length} task cards`);

    if (taskCards.length >= 2) {
      const firstCard = taskCards[0];
      const secondLane = await page.locator('[class*="Paper"]').nth(1);

      // Get positions
      const cardBox = await firstCard.boundingBox();
      const laneBox = await secondLane.boundingBox();

      if (cardBox && laneBox) {
        console.log(`Card at: (${cardBox.x}, ${cardBox.y})`);
        console.log(`Lane at: (${laneBox.x}, ${laneBox.y})`);

        // Screenshot before drag
        const beforePath = path.join(screenshotDir, 'kanban-before-drag.png');
        await page.screenshot({ path: beforePath });
        console.log(`✅ Screenshot 2: ${beforePath}`);

        // Perform drag
        console.log('Dragging card...');
        await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
        await page.mouse.down();
        await page.waitForTimeout(500);
        await page.mouse.move(laneBox.x + 50, laneBox.y + 150);
        await page.waitForTimeout(500);
        await page.mouse.up();
        await page.waitForTimeout(2000);

        // Screenshot after drag
        const afterPath = path.join(screenshotDir, 'kanban-after-drag.png');
        await page.screenshot({ path: afterPath });
        console.log(`✅ Screenshot 3: ${afterPath}`);

        console.log('\n✅ Test complete! Check the screenshots in:', screenshotDir);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    // Keep browser open for 30 seconds
    await page.waitForTimeout(30000);
    await browser.close();
  }
})();
