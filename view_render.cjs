const fs = require('fs');
const lines = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8').split('\n');
const idx = lines.findIndex(l => l.includes('return (') && !l.includes('=>'));
if (idx !== -1) {
    console.log(lines.slice(idx, idx + 100).join('\n'));
} else {
    console.log("Not found.");
}
