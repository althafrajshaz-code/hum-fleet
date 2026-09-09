const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 }); // Mobile size
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  // Set localStorage to simulate logged-in driver
  await page.goto('http://localhost:5173/');
  await page.evaluate(() => {
    localStorage.setItem('driverEmail', 'test@driver.com');
  });
  
  await page.goto('http://localhost:5173/driver');
  await new Promise(r => setTimeout(r, 5000));
  await page.screenshot({path: 'driver_screenshot.png'});
  await browser.close();
})();
