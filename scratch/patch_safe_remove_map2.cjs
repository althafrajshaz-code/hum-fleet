const fs = require('fs');

let driverContent = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

const mapBlock = `<div className="dashboard-map animate-fade-in delay-100" style={{ padding: 0, overflow: 'hidden', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
            <iframe 
              id="map-iframe"
              src="/map.html" 
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Interactive Map"
            />
        </div>`;

if (driverContent.includes(mapBlock)) {
   driverContent = driverContent.replace(mapBlock, '{/* Map removed for performance */}');
   fs.writeFileSync('src/pages/DriverDashboard.jsx', driverContent, 'utf8');
   console.log('Successfully replaced mapBlock exactly.');
} else {
   // Let's try replacing with ignoring whitespaces since there might be \r\n differences
   console.log('Exact match failed, trying flexible replacement...');
   
   let startIndex = driverContent.indexOf('<div className="dashboard-map animate-fade-in delay-100"');
   if (startIndex !== -1) {
       let endStr = 'title="Interactive Map"\n            />\n        </div>';
       let endStrAlt = 'title="Interactive Map"\r\n            />\r\n        </div>';
       let endIndex = driverContent.indexOf(endStr, startIndex);
       let offset = endStr.length;
       if (endIndex === -1) {
           endIndex = driverContent.indexOf(endStrAlt, startIndex);
           offset = endStrAlt.length;
       }

       if (endIndex !== -1) {
           let toReplace = driverContent.substring(startIndex, endIndex + offset);
           driverContent = driverContent.replace(toReplace, '{/* Map removed for performance */}');
           fs.writeFileSync('src/pages/DriverDashboard.jsx', driverContent, 'utf8');
           console.log('Successfully removed map with flexible replacement.');
       } else {
           console.log('Could not find end of map block.');
       }
   } else {
       console.log('Could not find start of map block.');
   }
}
