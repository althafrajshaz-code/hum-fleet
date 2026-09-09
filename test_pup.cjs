const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
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
    await page.goto('https://humfleet.xyz', { waitUntil: 'networkidle0' });
    console.log('Page loaded.');
  } catch (err) {
    console.log('GOTO ERROR:', err.message);
  }
  
  await browser.close();
})();
