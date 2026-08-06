const https = require('https');

const query = `
  [out:json][timeout:25];
  (
    node["amenity"~"hospital|clinic|pharmacy|restaurant|cafe|college|school|bank"](9.7, 76.1, 10.2, 76.6);
    node["shop"~"supermarket|mall"](9.7, 76.1, 10.2, 76.6);
  );
  out center 500;
`;

const url = "https://overpass-api.de/api/interpreter";

const options = {
  method: 'POST',
  headers: {
    'User-Agent': 'HumFleet-Data-Ingestion/1.0',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

const req = https.request(url, options, (res) => {
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

      console.log(`[SYS] Overpass API scan complete. Found ${locations.length} locations in Ernakulam bounding box.`);
      console.log(`[SYS] Beginning secure drip-feed to live MongoDB database...`);
      
      let successCount = 0;
      for (let i = 0; i < locations.length; i++) {
        const loc = locations[i];
        try {
          const r = await fetch('https://hum-fleet-api.onrender.com/api/locations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loc)
          });
          if (r.ok) {
            successCount++;
            if (successCount % 10 === 0) {
              console.log(`[PROGRESS] Synchronized ${successCount} / ${locations.length} locations... (Last: ${loc.name})`);
            }
          }
        } catch(err) {}
      }
      
      console.log(`[SUCCESS] Drip-feed complete. Total verified locations injected: ${successCount}`);
    } catch (e) {
      console.error("[ERROR] Failed to parse JSON. API might be rate-limiting us.", e.message);
    }
  });
});

req.on('error', (e) => {
  console.error('[ERROR]', e);
});

req.write(`data=${encodeURIComponent(query)}`);
req.end();
