const http = require('http');

async function test() {
  const API_BASE = 'https://hum-fleet-api.onrender.com';
  console.log("Starting polling for 60 seconds...");
  
  for (let i = 0; i < 7; i++) {
    console.log(`\n--- Poll ${i+1} ---`);
    try {
      const [catRes, setRes] = await Promise.all([
        fetch(`${API_BASE}/api/vehicle-categories?t=${Date.now()}`),
        fetch(`${API_BASE}/api/settings?t=${Date.now()}`)
      ]);
      
      const cats = await catRes.json();
      const settings = await setRes.json();
      
      const auto = cats.find(c => c.id === 'auto' || c.name.includes('Auto'));
      console.log(`Auto Rickshaw: ${auto ? `Base: ${auto.baseFare}, Rate: ${auto.ratePerKm}` : 'Not found'}`);
      console.log(`Settings: Base: ${settings.baseFare}, Rate: ${settings.ratePerKm}`);
    } catch (e) {
      console.error("Fetch failed:", e.message);
    }
    
    if (i < 6) {
      await new Promise(r => setTimeout(r, 10000));
    }
  }
  console.log("Finished 60 seconds poll.");
}

test();
