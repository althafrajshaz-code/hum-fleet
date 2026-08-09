const http = require('http');

async function test() {
  const API_BASE = 'https://hum-fleet-api.onrender.com';

  console.log("Fetching categories initially...");
  let res = await fetch(`${API_BASE}/api/vehicle-categories`);
  let data = await res.json();
  let auto = data.find(c => c.id === 'auto');
  console.log("Initial Auto:", auto.baseFare, auto.ratePerKm);

  console.log("\nUpdating Auto to 60 and 18...");
  res = await fetch(`${API_BASE}/api/vehicle-categories/auto`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ baseFare: 60, ratePerKm: 18 })
  });
  console.log("PUT status:", res.status);
  
  console.log("\nFetching immediately after PUT...");
  res = await fetch(`${API_BASE}/api/vehicle-categories`);
  data = await res.json();
  auto = data.find(c => c.id === 'auto');
  console.log("Immediate Auto:", auto.baseFare, auto.ratePerKm);

  console.log("\nWaiting 10 seconds...");
  await new Promise(r => setTimeout(r, 10000));

  console.log("Fetching 10s later...");
  res = await fetch(`${API_BASE}/api/vehicle-categories`);
  data = await res.json();
  auto = data.find(c => c.id === 'auto');
  console.log("Later Auto:", auto.baseFare, auto.ratePerKm);
}

test();
