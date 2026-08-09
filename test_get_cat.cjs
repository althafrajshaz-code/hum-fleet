const http = require('http');

async function test() {
  const API_BASE = 'https://hum-fleet-api.onrender.com';
  let res = await fetch(`${API_BASE}/api/vehicle-categories`);
  let data = await res.json();
  console.log(JSON.stringify(data[0], null, 2));
}

test();
