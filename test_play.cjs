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
    await page.goto('https://humfleet.xyz', { waitUntil: 'networkidle' });
    console.log('Page loaded.');
  } catch (err) {
    console.log('GOTO ERROR:', err.message);
  }
  
  await browser.close();
})();
