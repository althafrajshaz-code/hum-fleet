const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('driverEmail', 'testdriver@gmail.com');
    localStorage.setItem('driverName', 'Test Driver');
  });

  console.log('Navigating to http://localhost:5173/driver');
  await page.goto('http://localhost:5173/driver', { waitUntil: 'networkidle0' });
  console.log('Page loaded.');
  
  const html = await page.content();
  if (html.includes('id="root"></div>')) {
      console.log('App might have crashed (empty root).');
  } else {
      console.log('App rendered successfully.');
  }
  
  await browser.close();
})();
