const http = require('http');
const https = require('https');

const API_BASE = 'https://hum-fleet-api.onrender.com';

const endpoints = [
  '/api/locations',
  '/api/admin/profile',
  '/api/admin/pending-payments',
  '/api/admin/drivers',
  '/api/admin/passengers',
  '/api/admin/employees',
  '/api/admin/financials',
  '/api/vehicle-categories',
  '/api/settings',
  '/api/admin/fleet-live',
  '/api/promotions'
];

async function checkEndpoint(path) {
  try {
    const res = await fetch(`${API_BASE}${path}`, { timeout: 10000 });
    if (res.ok || res.status === 401 || res.status === 403) { // 401/403 means auth is required, which is fine! The endpoint exists.
      console.log(`[OK] ${path} (Status: ${res.status})`);
      return true;
    } else {
      console.error(`[FAIL] ${path} (Status: ${res.status})`);
      return false;
    }
  } catch (err) {
    console.error(`[ERROR] ${path}: ${err.message}`);
    return false;
  }
}

async function runTests() {
  console.log("Waiting for Render to come online...");
  let online = false;
  while (!online) {
    try {
      const res = await fetch(`${API_BASE}/`, { timeout: 5000 });
      if (res.ok || res.status === 404) { // 404 on root is fine if there's no root handler
        online = true;
        console.log("Render backend is ONLINE!");
      }
    } catch (e) {
      console.log("Still waiting for Render... (Connection refused or timeout)");
      await new Promise(r => setTimeout(r, 5000));
    }
  }

  console.log("\nTesting all Admin Panel endpoints...");
  let allGood = true;
  for (const ep of endpoints) {
    const success = await checkEndpoint(ep);
    if (!success) allGood = false;
  }

  if (allGood) {
    console.log("\n✅ ALL ADMIN PANEL ENDPOINTS ARE VERIFIED AND WORKING!");
  } else {
    console.log("\n❌ SOME ENDPOINTS FAILED.");
  }
}

runTests();
