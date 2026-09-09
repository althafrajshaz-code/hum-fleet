const fs = require('fs');

let driverContent = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// The iframe block looks like this:
// <div className="dashboard-map animate-fade-in delay-100" style={{ padding: 0, overflow: 'hidden', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
//   <iframe 
//     id="map-iframe"
//     src="/map.html" 
//     style={{ width: '100%', height: '100%', border: 'none' }}
//     title="Interactive Map"
//   />
// </div>

const mapDivRegex = /<div className="dashboard-map[^>]*>[\s\S]*?<iframe[\s\S]*?id="map-iframe"[\s\S]*?\/>\s*<\/div>/g;

driverContent = driverContent.replace(mapDivRegex, '');

fs.writeFileSync('src/pages/DriverDashboard.jsx', driverContent, 'utf8');
console.log('Map iframe completely removed to reduce lag!');
