const fs = require('fs');
const code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');
const start = code.indexOf('<div className="dashboard-page"');
console.log(code.substring(start, start + 2000));
