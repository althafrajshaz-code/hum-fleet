const fs = require('fs');

const query = `
  [out:json][timeout:25];
  area["name"="Ernakulam"]->.searchArea;
  (
    node["amenity"~"hospital|clinic|pharmacy|marketplace|restaurant|cafe|fast_food|college|school|university|bus_station|taxi|bank|atm"](area.searchArea);
    node["shop"~"supermarket|mall|department_store|convenience"](area.searchArea);
    node["tourism"~"hotel|museum|attraction"](area.searchArea);
    node["public_transport"~"station|stop_area"](area.searchArea);
  );
  out center 2000;
`;

fetch('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  body: query
})
.then(r => r.json())
.then(data => {
  const elements = data.elements.filter(e => e.tags && e.tags.name && e.lat && e.lon);
  
  // Format them for the backend POST /api/locations endpoint
  const locations = elements.map(e => ({
    name: e.tags.name + (e.tags.amenity ? ` (${e.tags.amenity})` : ''),
    lat: e.lat,
    lng: e.lon
  }));

  console.log(`Found ${locations.length} valid locations.`);
  
  // Save to file
  fs.writeFileSync('ernakulam_locations.json', JSON.stringify(locations, null, 2));
  console.log('Saved to ernakulam_locations.json');
})
.catch(console.error);
