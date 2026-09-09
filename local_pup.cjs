const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  try {
    await page.goto('http://localhost:5173/passenger', { waitUntil: 'networkidle2', timeout: 10000 });
  } catch (e) {
    console.log('GOTO ERR:', e.toString());
  }
  await browser.close();
  process.exit(0);
})();
