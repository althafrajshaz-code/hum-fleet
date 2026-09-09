const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

const regex = /<div style=\{\{[\s\S]*?Tap anywhere on the map to pin your location, then tap Confirm[\s\S]*?<\/div>/;
if (regex.test(code)) {
  code = code.replace(regex, '');
  fs.writeFileSync('src/pages/PassengerDashboard.jsx', code);
  console.log('Successfully removed map instructions');
} else {
  console.log('Could not find instructions');
}
