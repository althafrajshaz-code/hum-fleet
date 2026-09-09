const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.error('BROWSER ERROR:', error.message));
  
  console.log('Navigating to dashboard...');
  await page.goto('http://localhost:5173/passenger', { waitUntil: 'networkidle' });
  
  console.log('Wait a moment...');
  await page.waitForTimeout(3000);
  
  await browser.close();
})();
