const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  await page.goto('https://humfleet.xyz/driver', {waitUntil: 'networkidle0'});
  console.log('Driver loaded. Body:', (await page.content()).substring(0, 150));
  await browser.close();
})();
