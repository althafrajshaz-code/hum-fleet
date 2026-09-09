const fs = require('fs');
const code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');
const start = code.indexOf('{/* STATE 1: Booking Input & Tier Selection */}');
const end = code.indexOf('{/* STATE 2: Finding Driver */}');
console.log(code.substring(start, end));
