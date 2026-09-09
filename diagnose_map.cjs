const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

// Find and replace using index-based approach to handle CRLF
// Add "Choose from Map" button to PICKUP dropdown
const pickupMarker = '                      \u003cNavigation2 size={16} style={{ marginRight: \'8px\' }} /\u003e\r\n                      \uD83D\uDCCD Use My Current Location\r\n                    \u003c/div\u003e\r\n\r\n                    {isGeoSearching \u0026\u0026 (';

const pickupReplacement = '                      <Navigation2 size={16} style={{ marginRight: \'8px\' }} />\r\n                      \uD83D\uDCCD Use My Current Location\r\n                    </div>\r\n\r\n                    {/* CHOOSE FROM MAP */}\r\n                    <div\r\n                      onMouseDown={() => { setMapModalTarget(\'pickup\'); setShowMapModal(true); setPickupFocused(false); }}\r\n                      className="dropdown-item"\r\n                      style={{ background: \'rgba(16, 185, 129, 0.12)\', color: \'#10b981\', fontWeight: \'bold\', borderBottom: \'1px solid rgba(255,255,255,0.05)\', display: \'flex\', alignItems: \'center\' }}\r\n                    >\r\n                      <Map size={16} style={{ marginRight: \'8px\' }} />\r\n                      \uD83D\uDDFA\uFE0F Choose from Map\r\n                    </div>\r\n\r\n                    {isGeoSearching && (';

const firstIdx = code.indexOf('\uD83D\uDCCD Use My Current Location');
console.log('First Use My Current Location at index:', firstIdx);

// Count occurrences
let count = 0;
let pos = 0;
while (true) {
    const idx = code.indexOf('\uD83D\uDCCD Use My Current Location', pos);
    if (idx === -1) break;
    count++;
    pos = idx + 1;
}
console.log('Total occurrences:', count);
