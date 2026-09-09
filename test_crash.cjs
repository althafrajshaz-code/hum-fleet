const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
  
  await page.goto('https://humfleet.xyz/driver');
  
  await page.evaluate(() => {
    localStorage.setItem('driverEmail', 'test@test.com');
  });
  
  await page.reload();
  
  await new Promise(r => setTimeout(r, 4000));
  
  await browser.close();
})();
