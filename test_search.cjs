const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.on('console', msg => console.log('LOG:', msg.text()));
  
  await page.goto('https://humfleet.xyz');
  await page.evaluate(() => {
    localStorage.setItem('passengerAuthenticated', 'true');
    localStorage.setItem('passengerEmail', 'test@test.com');
  });
  await page.goto('https://humfleet.xyz/passenger', { waitUntil: 'networkidle2' });
  
  // type in map search
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Choose from Map'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(1000);
  
  await page.type('.input-field.with-icon', 'adyar');
  await page.waitForTimeout(2000);
  
  const items = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.dropdown-item')).map(el => el.innerText);
  });
  console.log('Dropdown items:', items);
  
  await browser.close();
})();
