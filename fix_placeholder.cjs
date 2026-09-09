const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');
code = code.replace(/placeholder="Enter drop-off destination"/g, 'placeholder="Choose on map"');
fs.writeFileSync('src/pages/PassengerDashboard.jsx', code);
console.log('Placeholder updated!');
