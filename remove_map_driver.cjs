const fs = require('fs');
let code = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

const mapStart = code.indexOf('<div className="dashboard-map');
const mapEndStr = '</iframe>\n          {(isOnline) && (';
const mapEnd = code.indexOf(mapEndStr) + '</iframe>\n'.length;

code = code.substring(0, mapStart) + code.substring(mapEnd);

fs.writeFileSync('src/pages/DriverDashboard.jsx', code);
console.log('Map iframe removed');
