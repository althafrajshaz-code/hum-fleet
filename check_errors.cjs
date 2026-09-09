const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
    
    console.log('Navigating to local server...');
    await page.goto('http://localhost:5173/passenger/login', { waitUntil: 'networkidle0' });
    
    console.log('Typing credentials...');
    // Assuming login works easily or just by clicking
    // Or we can just mock the auth state if we inject localStorage
    await page.evaluate(() => {
        localStorage.setItem('hum_passenger_token', 'mock_token');
        localStorage.setItem('hum_passenger_id', '1');
        localStorage.setItem('hum_passenger_phone', '+919999999999');
    });
    
    console.log('Navigating to dashboard...');
    await page.goto('http://localhost:5173/passenger', { waitUntil: 'networkidle0' });
    
    await new Promise(r => setTimeout(r, 2000));
    await browser.close();
})();
