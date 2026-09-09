const fs = require('fs');
let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

content = content.replace(/ {8}<\/div>\s*<div className="dashboard-map/, '        </div>\n          </>)}\n        <div className="dashboard-map');

fs.writeFileSync('src/pages/DriverDashboard.jsx', content, 'utf8');
console.log('Fixed syntax error with regex!');
