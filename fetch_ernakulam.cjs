const fs = require('fs');
const https = require('https');

const query = `
  [out:json][timeout:25];
  (
    node["amenity"~"hospital|clinic|pharmacy|restaurant|cafe|fast_food|college|school|bank"](9.7, 76.1, 10.2, 76.6);
    node["shop"~"supermarket|mall"](9.7, 76.1, 10.2, 76.6);
    node["public_transport"~"station"](9.7, 76.1, 10.2, 76.6);
  );
  out center 2000;
`;

const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

https.get(url, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', async () => {
    try {
      const data = JSON.parse(body);
      const elements = data.elements.filter(e => e.tags && e.tags.name && e.lat && e.lon);
      
      const locations = elements.map(e => ({
        name: e.tags.name + (e.tags.amenity ? ` (${e.tags.amenity})` : ''),
        lat: e.lat,
        lng: e.lon
      }));

      console.log(`Found ${locations.length} valid locations. Pushing to live database...`);
      
      let successCount = 0;
      for (let i = 0; i < locations.length; i += 50) {
        const batch = locations.slice(i, i + 50);
        await Promise.all(batch.map(async (loc) => {
          try {
            const r = await fetch('https://hum-fleet-api.onrender.com/api/locations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(loc)
            });
            if (r.ok) successCount++;
          } catch(err) {}
        }));
        console.log(`Pushed ${Math.min(i + 50, locations.length)} / ${locations.length}...`);
      }
      
      console.log(`Successfully injected ${successCount} locations directly into the live MongoDB database!`);
    } catch (e) {
      console.error(e);
      console.log(body);
    }
  });
}).on('error', console.error);
