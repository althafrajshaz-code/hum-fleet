const fs = require('fs');
let c = fs.readFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', 'utf8');
c = c.replace(
  '          )}\n\n        </div>\n        \n        <div className="dashboard-map glass-card animate-fade-in delay-100"',
  '          )}\n        </>)}\n        </div>\n        \n        <div className="dashboard-map glass-card animate-fade-in delay-100"'
);
fs.writeFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', c);
