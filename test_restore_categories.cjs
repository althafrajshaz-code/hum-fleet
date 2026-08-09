const http = require('http');

async function test() {
  const API_BASE = 'https://hum-fleet-api.onrender.com';
  console.log("Restoring mini and premium...");
  
  const mini = { name: '🚙 Mini', maxPassengers: 4, baseFare: 0, ratePerKm: 0, icon: '🚙' };
  const premium = { name: '💎 Premium / Luxury', maxPassengers: 4, baseFare: 0, ratePerKm: 0, icon: '💎' };
  
  const res1 = await fetch(`${API_BASE}/api/vehicle-categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mini)
  });
  console.log('Restored mini:', await res1.text());

  const res2 = await fetch(`${API_BASE}/api/vehicle-categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(premium)
  });
  console.log('Restored premium:', await res2.text());
}

test();
