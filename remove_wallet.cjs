const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

const startStr = "{/* Passenger Wallet Overview Widget */}";
const endStr = "{/* Scheduled / Pre-booked Rides Section */}";

const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  const chunkToRemove = code.substring(startIdx, endIdx);
  code = code.replace(chunkToRemove, '');
  fs.writeFileSync('src/pages/PassengerDashboard.jsx', code);
  console.log("Passenger Wallet widget removed.");
} else {
  console.log("Could not find start or end marker");
}
