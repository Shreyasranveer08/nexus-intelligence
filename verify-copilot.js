const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('Starting Copilot Verification Test...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport for good screenshots
  await page.setViewport({ width: 1280, height: 800 });
  
  const logs = [];
  page.on('console', msg => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
    console.log(`BROWSER CONSOLE: [${msg.type()}] ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    logs.push(`[ERROR] ${err.message}`);
    console.log(`BROWSER ERROR: ${err.message}`);
  });

  try {
    console.log('Navigating to http://localhost:3000/copilot...');
    await page.goto('http://localhost:3000/copilot', { waitUntil: 'networkidle0' });
    
    // Screenshot 1: Initial state
    await page.screenshot({ path: 'C:/Users/Shreyas/.gemini/antigravity/brain/d968cd6a-b1a7-4d59-ac73-5471d2b14a54/copilot_initial.png' });
    console.log('Saved initial state screenshot.');

    // 1. Test Suggested Prompt
    console.log('Looking for suggested prompts...');
    // Wait for the button containing "What is my biggest competitive threat?"
    await page.waitForFunction(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.some(b => b.textContent.includes('What is my biggest competitive threat?'));
    });
    
    const suggestedPromptText = "What is my biggest competitive threat?";
    await page.evaluate((text) => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent.includes(text));
      if (btn) btn.click();
    }, suggestedPromptText);
    
    console.log('Clicked suggested prompt. Waiting for response to start streaming...');
    // Wait for a few seconds to let it process
    await new Promise(r => setTimeout(r, 5000));
    
    // Screenshot 2: After suggested prompt
    await page.screenshot({ path: 'C:/Users/Shreyas/.gemini/antigravity/brain/d968cd6a-b1a7-4d59-ac73-5471d2b14a54/copilot_suggested_prompt.png' });
    console.log('Saved suggested prompt screenshot.');
    
    // Check if there are any errors in the logs so far
    const hasError = logs.some(l => l.includes('TypeError') || l.includes('is not a function'));
    if (hasError) {
      console.error('Test Failed: Found TypeError in logs after clicking suggested prompt!');
    } else {
      console.log('Success: No TypeError occurred after clicking suggested prompt.');
    }

    // 2. Test Manual Chat Message
    console.log('Testing manual chat message...');
    // Find input and type
    await page.type('input[type="text"]', 'Generate a quick summary of this strategy.');
    
    // Wait a moment and click submit (find submit button by aria-label or just the form)
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      else {
        const btn = document.querySelector('button[type="submit"]');
        if (btn) btn.click();
      }
    });

    console.log('Sent manual message. Waiting for response...');
    await new Promise(r => setTimeout(r, 6000));
    
    // Screenshot 3: After manual message
    await page.screenshot({ path: 'C:/Users/Shreyas/.gemini/antigravity/brain/d968cd6a-b1a7-4d59-ac73-5471d2b14a54/copilot_manual_message.png' });
    console.log('Saved manual message screenshot.');

    console.log('Copilot Verification Test Completed Successfully.');
    
  } catch (error) {
    console.error('Test script encountered an error:', error);
  } finally {
    await browser.close();
  }
})();
