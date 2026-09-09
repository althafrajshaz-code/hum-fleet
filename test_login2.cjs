const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('https://humfleet.xyz/driver/login', { waitUntil: 'networkidle2' });
  
  // They say "now while login the driver app become white".
  // This could mean they click login and it goes white (DriverDashboard crashes on mount).
  // Or it could mean /driver/login itself is white.
  // Wait for 5 seconds to see if there are errors on the login page.
  await new Promise(r => setTimeout(r, 5000));
  
  // Check if we can see the email input
  const emailInput = await page.$('input[type="email"]');
  if (!emailInput) {
    console.log('No email input found. Page might be white.');
  } else {
    console.log('Email input found. Logging in...');
    await page.type('input[type="email"]', 'test@test.com');
    await page.type('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 5000));
  }
  
  console.log('Done');
  await browser.close();
})();
