const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);

    // Initial screenshot
    await page.screenshot({ path: 'c:\\AI Engineering Course\\step1-initial.png' });
    console.log('✅ Screenshot 1: Initial state captured');

    // Wait for tasks to load
    await page.waitForSelector('[class*="Card"]', { timeout: 5000 });

    // Get initial task positions
    const tasks = await page.locator('[class*="Card"]').all();
    console.log(`✅ Found ${tasks.length} tasks on the board`);

    // Drag a task from IN_PROGRESS to TODO
    const taskCards = await page.$$('[class*="MuiCard"]');
    if (taskCards.length >= 2) {
      const sourceElement = taskCards[0];
      const targetLane = await page.$('[class*="Paper"]');

      if (sourceElement && targetLane) {
        // Take screenshot before drag
        await page.screenshot({ path: 'c:\\AI Engineering Course\\step2-before-drag.png' });
        console.log('✅ Screenshot 2: Before drag-and-drop');

        // Perform drag and drop
        const boundingBox = await sourceElement.boundingBox();
        const targetBox = await targetLane.boundingBox();

        if (boundingBox && targetBox) {
          await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
          await page.mouse.down();
          await page.waitForTimeout(300);
          await page.mouse.move(targetBox.x + 50, targetBox.y + 100);
          await page.waitForTimeout(300);
          await page.mouse.up();
          await page.waitForTimeout(1000);

          // Take screenshot after drag
          await page.screenshot({ path: 'c:\\AI Engineering Course\\step3-after-drag.png' });
          console.log('✅ Screenshot 3: After drag-and-drop');
        }
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
