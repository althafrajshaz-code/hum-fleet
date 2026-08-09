const http = require('http');

async function test() {
  const API_BASE = 'https://hum-fleet-api.onrender.com';
  const res = await fetch(`${API_BASE}/api/vehicle-categories`);
  const text = await res.json();
  console.log(JSON.stringify(text, null, 2));
}

test();
