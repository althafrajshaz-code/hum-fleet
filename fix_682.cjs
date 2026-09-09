const fs = require('fs');
const code = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');
const lines = code.split('\n');
lines[681] = "                    {[['Email', driverDetails?.email || 'N/A'], ['Rating', 'Star ' + (driverDetails?.rating || '5.0')], ['Status', driverDetails?.status || 'Approved']].map(([label, val]) => (";
fs.writeFileSync('src/pages/DriverDashboard.jsx', lines.join('\n'));
