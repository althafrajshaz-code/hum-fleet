const fs = require('fs');

const query = `
  [out:json][timeout:25][bbox:9.8,76.1,10.2,76.5];
  (
    node["amenity"~"hospital|clinic|pharmacy|restaurant|cafe|fast_food|college|school|bank"];
    node["shop"~"supermarket|mall|convenience"];
    node["tourism"~"hotel"];
    node["public_transport"~"station"];
  );
  out center 2000;
`;

fetch('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  body: query,
  headers: {
    'User-Agent': 'Hum-Taxi-App-Seed-Script/1.0'
  }
})
.then(async r => {
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`Overpass API error: ${r.status} ${text.substring(0, 100)}`);
  }
  return r.json();
})
.then(async data => {
  const elements = data.elements.filter(e => e.tags && e.tags.name && e.lat && e.lon);
  
  // Format them
  const locations = elements.map(e => ({
    name: e.tags.name + (e.tags.amenity ? ` (${e.tags.amenity})` : ''),
    lat: e.lat,
    lng: e.lon
  }));

  console.log(`Found ${locations.length} valid locations. Adding them to live site...`);
  
  let successCount = 0;
  
  // Send in bulk to new bulk endpoint
  console.log('Sending to local backend bulk endpoint...');
  try {
    const res = await fetch('http://localhost:5000/api/locations/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locations })
    });
    
    if (res.ok) {
      const respData = await res.json();
      successCount = respData.added;
    } else {
      console.error('Bulk insert failed with status:', res.status);
    }
  } catch(err) {
    console.error('Network error to backend:', err);
  }
  
  console.log(`Successfully injected ${successCount} locations directly into the live MongoDB database!`);
})
.catch(console.error);
