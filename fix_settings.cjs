const fs = require('fs');
let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

const regex = /\{\/\* --- RIDE PREFERENCES --- \*\/\}.*?Save Ride Preferences.*?<\/Button>\s*<\/div>/s;
content = content.replace(regex, '');

fs.writeFileSync('src/pages/DriverDashboard.jsx', content);

