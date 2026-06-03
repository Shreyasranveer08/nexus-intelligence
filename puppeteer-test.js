const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message, err.stack));

  console.log('Navigating to /copilot...');
  await page.goto('http://localhost:3000/copilot', { waitUntil: 'networkidle0' });

  console.log('Waiting for suggested prompt buttons...');
  await page.waitForSelector('button');
  
  const buttons = await page.$$('button');
  console.log(`Found ${buttons.length} buttons.`);
  
  // Click the first button that has text starting with "
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('"What is my biggest')) {
      console.log('Clicking suggested prompt button...');
      await btn.click();
      break;
    }
  }

  // Also try clicking the main Send button to see if it crashes
  try {
    console.log('Typing in input...');
    await page.type('input[placeholder="Ask me anything..."]', 'Test message');
    console.log('Clicking submit button...');
    const submitBtn = await page.$('form button[type="submit"]');
    if (submitBtn) await submitBtn.click();
  } catch (e) {}

  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
  console.log('Done.');
})();
