const fs = require('fs');
let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

content = content.replace(/(\s+)<\/div>(\s+)<div className="dashboard-map/, '$1</>)}$1</div>$2<div className="dashboard-map');

fs.writeFileSync('src/pages/DriverDashboard.jsx', content, 'utf8');
console.log('Fixed syntax error inside sidebar PROPERLY!');
