const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('https://humfleet.xyz/driver/login', { waitUntil: 'networkidle2' });
  
  const loginIdInput = await page.$('input#loginId');
  if (loginIdInput) {
    console.log('Input found. Logging in...');
    await page.type('input#loginId', 'rajesh.k@gmail.com');
    await page.type('input#password', 'password123'); // assuming standard password
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 8000));
    
    // Check if we are on dashboard
    const url = page.url();
    console.log('Current URL:', url);
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('Body snippet:', bodyText.substring(0, 100));
  } else {
    console.log('No input found');
  }
  
  console.log('Done');
  await browser.close();
})();
