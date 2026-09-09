const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    } else {
      console.log('CONSOLE:', msg.text());
    }
  });
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
  
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('Body snippet:', bodyText.substring(0, 100));
  
  console.log('Done');
  await browser.close();
})();
