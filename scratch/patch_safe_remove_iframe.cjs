const fs = require('fs');
let driverContent = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

const iframeRegex = /<iframe[\s\S]*?id="map-iframe"[\s\S]*?title="Interactive Map"[\s\S]*?\/>/g;

if (iframeRegex.test(driverContent)) {
   driverContent = driverContent.replace(iframeRegex, '{/* Map iframe removed for performance */}');
   fs.writeFileSync('src/pages/DriverDashboard.jsx', driverContent, 'utf8');
   console.log('Successfully removed only the map iframe.');
} else {
   console.log('Iframe not found.');
}
