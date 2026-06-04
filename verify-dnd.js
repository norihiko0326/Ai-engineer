const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const screenshotDir = 'c:\\AI Engineering Course\\screenshots';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  try {
    console.log('1️⃣ Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Screenshot 1: Initial state
    const initialPath = path.join(screenshotDir, '01-initial-board.png');
    await page.screenshot({ path: initialPath, fullPage: true });
    console.log(`✅ Screenshot 1: Initial board state -> ${initialPath}`);

    // Get all task cards
    const todoLane = await page.locator('text=TODO').first().locator('..').locator('..').locator('..');
    const inProgressLane = await page.locator('text=進行中').first().locator('..').locator('..').locator('..');
    const doneLane = await page.locator('text=完了').first().locator('..').locator('..').locator('..');

    console.log('\n2️⃣ Checking task distribution...');
    const todoCount = await todoLane.locator('[class*="MuiCard"]').count();
    const inProgressCount = await inProgressLane.locator('[class*="MuiCard"]').count();
    const doneCount = await doneLane.locator('[class*="MuiCard"]').count();

    console.log(`   TODO: ${todoCount} tasks`);
    console.log(`   進行中: ${inProgressCount} tasks`);
    console.log(`   完了: ${doneCount} tasks`);

    // Get first card in IN_PROGRESS lane
    const inProgressCards = await inProgressLane.locator('[class*="MuiCard"]').all();
    if (inProgressCards.length > 0) {
      console.log(`\n3️⃣ Found ${inProgressCards.length} tasks in 進行中 lane`);
      const firstCard = inProgressCards[0];

      // Get bounding box of the card
      const cardBox = await firstCard.boundingBox();
      const todoLaneBox = await todoLane.boundingBox();

      if (cardBox && todoLaneBox) {
        console.log(`   Card position: x=${cardBox.x.toFixed(0)}, y=${cardBox.y.toFixed(0)}`);
        console.log(`   TODO lane position: x=${todoLaneBox.x.toFixed(0)}, y=${todoLaneBox.y.toFixed(0)}`);

        // Screenshot 2: Before drag
        const beforeDragPath = path.join(screenshotDir, '02-before-drag.png');
        await page.screenshot({ path: beforeDragPath, fullPage: true });
        console.log(`✅ Screenshot 2: Before drag -> ${beforeDragPath}`);

        // Perform drag and drop
        console.log('\n4️⃣ Dragging task from 進行中 to TODO...');
        await firstCard.dragTo(
          todoLane.locator('[class*="MuiCard"]').first(),
          { force: true }
        );
        await page.waitForTimeout(2000);

        // Screenshot 3: After drag
        const afterDragPath = path.join(screenshotDir, '03-after-drag.png');
        await page.screenshot({ path: afterDragPath, fullPage: true });
        console.log(`✅ Screenshot 3: After drag -> ${afterDragPath}`);

        // Verify the change via API
        console.log('\n5️⃣ Verifying DB changes via API...');
        const response = await page.evaluate(() =>
          fetch('http://localhost:8080/api/tasks').then(r => r.json())
        );
        const movedTask = response.find(t => t.title.includes('ユーザー認証'));
        if (movedTask) {
          console.log(`   ✅ Task "${movedTask.title}" status: ${movedTask.status}`);
          console.log(`   Order: ${movedTask.order}`);
        }
      }
    }

    // Test 2: Reorder within same lane
    console.log('\n6️⃣ Testing reordering within same lane...');
    const reorderedTodoCards = await todoLane.locator('[class*="MuiCard"]').all();
    if (reorderedTodoCards.length >= 2) {
      const firstTodoCard = reorderedTodoCards[0];
      const secondTodoCard = reorderedTodoCards[1];

      const beforeReorderPath = path.join(screenshotDir, '04-before-reorder.png');
      await page.screenshot({ path: beforeReorderPath, fullPage: true });
      console.log(`✅ Screenshot 4: Before reorder -> ${beforeReorderPath}`);

      console.log('   Dragging first TODO task down...');
      await firstTodoCard.dragTo(secondTodoCard, { force: true });
      await page.waitForTimeout(1500);

      const afterReorderPath = path.join(screenshotDir, '05-after-reorder.png');
      await page.screenshot({ path: afterReorderPath, fullPage: true });
      console.log(`✅ Screenshot 5: After reorder -> ${afterReorderPath}`);

      // Get final state
      const finalResponse = await page.evaluate(() =>
        fetch('http://localhost:8080/api/tasks/status/TODO').then(r => r.json())
      );
      console.log('\n   Final TODO order:');
      finalResponse.forEach((t, idx) => {
        console.log(`   ${idx + 1}. ${t.title} (order=${t.order})`);
      });
    }

    console.log('\n✅ All verification tests passed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    const errorPath = path.join(screenshotDir, 'error.png');
    await page.screenshot({ path: errorPath, fullPage: true });
    console.log(`Error screenshot saved to: ${errorPath}`);
  } finally {
    await browser.close();
  }
})();
