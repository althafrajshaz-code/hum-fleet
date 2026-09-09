const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('https://humfleet.xyz/driver-login', { waitUntil: 'networkidle2' });
  
  // Fill in email and password
  await page.type('input[type="email"]', 'test@test.com');
  await page.type('input[type="password"]', 'password');
  
  // Click login
  await page.click('button[type="submit"]');
  
  // Wait for network or error
  await new Promise(r => setTimeout(r, 5000));
  
  console.log('Done');
  await browser.close();
})();
