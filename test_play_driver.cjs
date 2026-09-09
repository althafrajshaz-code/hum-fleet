const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  try {
    await page.goto('https://humfleet.xyz/driver', { waitUntil: 'networkidle' });
    console.log('Navigated to /driver');
    await page.waitForTimeout(2000);
  } catch (err) {
    console.log('GOTO ERROR:', err.message);
  }
  
  await browser.close();
})();
