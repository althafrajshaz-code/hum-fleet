const fs = require('fs');
let content = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

// Remove "Call Driver" button safely
content = content.replace(
  /<Button variant="outline" style={{ flex: 1, borderColor: '#3b82f6', color: '#3b82f6' }} onClick={\(\) => alert\(`Calling driver at \$\{activeRide.driverPhone\}\.\.\.`\)}>\s*<Phone size=\{16\} style={{ marginRight: '6px' }} \/> Call Driver\s*<\/Button>/g,
  ''
);

// Remove "Wait For Me" button (if exists) and unused function
content = content.replace(/const handleWaitForMe = async \(\) => \{[\s\S]*?\};\n\n/g, '');
content = content.replace(/'Wait For Me': \{ en: 'Wait For Me', ml: 'എനിക്കായി കാത്തിരിക്കൂ', hi: 'मेरा इंतजार करें' \},/g, '');

// We'll leave the chat modal JSX in, but we will remove the Chat button that triggers it. 
// Wait, is there a Chat button in PassengerDashboard? I searched earlier and didn't find `setShowInTripChat(true)`. 
// So the Chat modal NEVER shows anyway. I don't need to delete the JSX for it, just leave it hidden.
// If I leave it, it won't break the build.

// Let's also check for Photo option
content = content.replace(/const resolveVehiclePhoto = \([\s\S]*?\};\n/g, '');

fs.writeFileSync('src/pages/PassengerDashboard.jsx', content);
console.log('Removed features from PassengerDashboard safely');
