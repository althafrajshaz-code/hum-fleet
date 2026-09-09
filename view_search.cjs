const fs = require('fs');
const lines = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8').split('\n');
const idx = lines.findIndex(l => l.includes('Where to?'));
if (idx !== -1) {
    console.log(lines.slice(Math.max(0, idx - 40), idx + 80).join('\n'));
} else {
    console.log("Not found.");
}
