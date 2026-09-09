const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('https://humfleet.xyz/driver/login', { waitUntil: 'networkidle2' });
  
  await page.evaluate(() => {
    localStorage.setItem('driverEmail', 'rajesh.k@gmail.com');
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('driverId', '1');
  });
  
  // Now navigate to dashboard
  await page.goto('https://humfleet.xyz/driver', { waitUntil: 'networkidle2' });
  
  await new Promise(r => setTimeout(r, 5000));
  
  console.log('Done');
  await browser.close();
})();
