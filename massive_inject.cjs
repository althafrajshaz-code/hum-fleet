const fs = require('fs');

async function run() {
  console.log("Loading all_pois.json...");
  const raw = fs.readFileSync('all_pois.json', 'utf-8');
  const data = JSON.parse(raw);
  
  const elements = data.elements.filter(e => e.tags && e.tags.name && e.lat && e.lon);
  
  // Format them
  const locations = elements.map(e => ({
    name: e.tags.name + (e.tags.amenity ? ` (${e.tags.amenity})` : (e.tags.shop ? ` (${e.tags.shop})` : '')),
    lat: e.lat,
    lng: e.lon
  }));

  // Remove duplicates by name to avoid spam
  const uniqueLocations = [];
  const seen = new Set();
  for (const loc of locations) {
    if (!seen.has(loc.name.toLowerCase())) {
      seen.add(loc.name.toLowerCase());
      uniqueLocations.push(loc);
    }
  }

  const finalBatch = uniqueLocations.slice(0, 2000);
  console.log(`Found ${finalBatch.length} unique, valid Ernakulam locations! Starting massive injection...`);
  
  let successCount = 0;
  
  // Chunking to avoid overwhelming the server
  const chunkSize = 50;
  for (let i = 0; i < finalBatch.length; i += chunkSize) {
    const chunk = finalBatch.slice(i, i + chunkSize);
    const promises = chunk.map(async (loc) => {
      try {
        const res = await fetch('https://hum-fleet-api.onrender.com/api/locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loc)
        });
        if (res.ok) {
          successCount++;
        }
      } catch (e) {
        // ignore
      }
    });
    
    await Promise.all(promises);
    console.log(`[PROGRESS] Synchronized ${Math.min(i + chunkSize, finalBatch.length)} / ${finalBatch.length} locations...`);
  }
  
  console.log(`[SUCCESS] Massive injection complete! Total successfully added: ${successCount}`);
}

run().catch(console.error);
