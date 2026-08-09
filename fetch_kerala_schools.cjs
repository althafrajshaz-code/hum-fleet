const fs = require('fs');

async function run() {
  console.log("Fetching Schools, Colleges, and Universities for Kerala...");

  // Overpass API Query for Kerala Area
  const query = `
    [out:json][timeout:300];
    area["name"="Kerala"]->.searchArea;
    (
      node["amenity"="school"](area.searchArea);
      node["amenity"="college"](area.searchArea);
      node["amenity"="university"](area.searchArea);
    );
    out center;
  `;

  try {
    const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'HumFleetDataInjector/1.1'
      }
    });

    if (!response.ok) {
      throw new Error(`Overpass API Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Filter out entries without a name
    const elements = data.elements.filter(e => e.tags && e.tags.name && e.lat && e.lon);
    
    console.log(`Received ${elements.length} named educational institutions from Overpass.`);

    // Format them for our database
    const locations = elements.map(e => {
      let type = '';
      if (e.tags.amenity === 'school') type = 'School';
      else if (e.tags.amenity === 'college') type = 'College';
      else if (e.tags.amenity === 'university') type = 'University';

      return {
        name: e.tags.name + (type ? ` (${type})` : ''),
        lat: e.lat,
        lng: e.lon
      };
    });

    // Remove duplicates by name
    const uniqueLocations = [];
    const seen = new Set();
    for (const loc of locations) {
      if (!seen.has(loc.name.toLowerCase())) {
        seen.add(loc.name.toLowerCase());
        uniqueLocations.push(loc);
      }
    }

    console.log(`Found ${uniqueLocations.length} unique, valid locations! Starting massive injection...`);
    
    let successCount = 0;
    
    // Chunking to avoid overwhelming the live server
    const chunkSize = 50;
    for (let i = 0; i < uniqueLocations.length; i += chunkSize) {
      const chunk = uniqueLocations.slice(i, i + chunkSize);
      
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
          // Ignore network errors on individual requests to keep loop alive
        }
      });
      
      // Wait for the chunk to finish
      await Promise.all(promises);
      
      console.log(`[PROGRESS] Synchronized ${Math.min(i + chunkSize, uniqueLocations.length)} / ${uniqueLocations.length} school locations...`);
      
      // Add a tiny delay between chunks to be extra nice to the database
      await new Promise(r => setTimeout(r, 500));
    }
    
    console.log(`[SUCCESS] Massive injection complete! Total successfully added to database: ${successCount}`);

  } catch (err) {
    console.error("Fatal Error:", err.message);
  }
}

run();
