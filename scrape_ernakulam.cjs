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
  body: query
})
.then(r => r.json())
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
  for (const loc of locations) {
    try {
      const res = await fetch('https://hum-fleet-api.onrender.com/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loc)
      });
      if (res.ok) successCount++;
    } catch(err) {}
  }
  
  console.log(`Successfully injected ${successCount} locations directly into the live MongoDB database!`);
})
.catch(console.error);
