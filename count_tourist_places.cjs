const fs = require('fs');

async function run() {
  const query = `
    [out:json][timeout:180];
    area["name"="Kerala"]->.searchArea;
    (
      node["tourism"~"attraction|museum|viewpoint|theme_park|zoo|aquarium|gallery|picnic_site"](area.searchArea);
      node["historic"~"monument|ruins|castle|fort"](area.searchArea);
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
    const elements = data.elements.filter(e => e.tags && e.tags.name && e.lat && e.lon);
    console.log(`There are approximately ${elements.length} named tourist attractions in Kerala on OpenStreetMap.`);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
run();
