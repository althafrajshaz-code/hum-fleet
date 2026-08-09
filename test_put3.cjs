const http = require('http');

async function test() {
  const API_BASE = 'https://hum-fleet-api.onrender.com';
  console.log("Starting test...");
  
  const start = Date.now();
  const res = await fetch(`${API_BASE}/api/vehicle-categories/auto`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ baseFare: 60, ratePerKm: 18 })
  });
  const end = Date.now();
  
  console.log(`PUT completed in ${end - start}ms with status: ${res.status}`);
  const text = await res.text();
  console.log("Response body:", text);
}

test();
