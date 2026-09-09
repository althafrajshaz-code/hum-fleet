const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  // They said "while login the driver app become white". So let's visit dashboard? No, login page first.
  await page.goto('https://humfleet.xyz/driver-dashboard', { waitUntil: 'networkidle2' });
  console.log('Done visiting /driver-dashboard directly');
  
  await browser.close();
})();
