const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('http://localhost:5173/driver/login', { waitUntil: 'networkidle2' });
  
  const loginIdInput = await page.$('input#loginId');
  if (loginIdInput) {
    console.log('Input found. Logging in...');
    await page.type('input#loginId', '98765 43210'); // try phone number
    await page.type('input#password', 'password123'); 
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 8000));
    
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
