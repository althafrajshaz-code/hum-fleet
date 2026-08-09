const http = require('http');

async function test() {
  const API_BASE = 'https://hum-fleet-api.onrender.com';
  console.log("Resetting all categories to 0...");
  
  const categories = ['auto', 'mini', 'hatchback', 'sedan', 'suv', 'ev', 'premium'];
  
  for (const cat of categories) {
    const res = await fetch(`${API_BASE}/api/vehicle-categories/${cat}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ baseFare: 0, ratePerKm: 0 })
    });
    console.log(`Reset ${cat} - Status: ${res.status}`);
  }
  console.log("All categories reset to 0!");
}

test();
