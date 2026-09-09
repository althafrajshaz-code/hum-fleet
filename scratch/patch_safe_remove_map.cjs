const fs = require('fs');

let driverContent = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

const mapHTMLToReplace = `<div className="dashboard-map animate-fade-in delay-100" style={{ padding: 0, overflow: 'hidden', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
          <iframe 
            id="map-iframe"
            src="/map.html" 
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Interactive Map"
          />
        </div>`;

// If exact spacing varies, this might fail, so let's do a substring match just to be sure.
let startIndex = driverContent.indexOf('<div className="dashboard-map');
if (startIndex !== -1) {
  let endIndex = driverContent.indexOf('</div>', startIndex);
  if (endIndex !== -1) {
    let toReplace = driverContent.substring(startIndex, endIndex + 6);
    if (toReplace.includes('id="map-iframe"')) {
       driverContent = driverContent.replace(toReplace, '{/* Map removed for performance */}');
       fs.writeFileSync('src/pages/DriverDashboard.jsx', driverContent, 'utf8');
       console.log('Successfully removed map via precise substring replacement.');
    } else {
       console.log('Wait, map-iframe not found in the extracted div');
    }
  }
}
