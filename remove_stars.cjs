const fs = require('fs');
let text = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');
text = text.replace(/★/g, '');
text = text.replace(/⭐/g, '');
fs.writeFileSync('src/pages/DriverDashboard.jsx', text, 'utf8');
