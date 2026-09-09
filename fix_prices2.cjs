const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

// Find the Rate per KM block in the Active Ride Breakdown
const idx = code.indexOf('Rate per KM:');
if (idx !== -1) {
  // Find the start of the div wrapping it
  const startDiv = code.lastIndexOf('<div style={{ display: \'flex\', justifyContent: \'space-between\', marginBottom: \'8px\' }}>', idx);
  // Find the end of that div
  const endDiv = code.indexOf('</div>', idx) + 6;
  
  if (startDiv !== -1 && endDiv !== -1 && endDiv > startDiv) {
    const chunkToRemove = code.substring(startDiv, endDiv);
    code = code.replace(chunkToRemove, '');
    fs.writeFileSync('src/pages/PassengerDashboard.jsx', code);
    console.log('Removed Rate per KM from active ride screen.');
  }
}
