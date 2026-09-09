const fs = require('fs');
let content = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

// Remove "Call Driver" button
content = content.replace(
  /<Button variant="outline" style={{ flex: 1, borderColor: '#3b82f6', color: '#3b82f6' }} onClick={\(\) => alert\(`Calling driver at \$\{activeRide.driverPhone\}\.\.\.`\)}>\s*<Phone size=\{16\} style={{ marginRight: '6px' }} \/> Call Driver\s*<\/Button>/g,
  ''
);

// Remove "Wait For Me" usages (if any)
content = content.replace(/const handleWaitForMe = async \(\) => \{[\s\S]*?\};\n/g, '');

// Remove translation string
content = content.replace(/'Wait For Me': \{ en: 'Wait For Me', ml: 'എനിക്കായി കാത്തിരിക്കൂ', hi: 'मेरा इंतजार करें' \},/g, '');

// Remove Chat Modal
content = content.replace(/\{\/\* IN-TRIP LIVE CHAT MODAL \(PASSENGER & DRIVER EXCLUSIVE\) \*\/\}\s*\{showInTripChat && activeRide && \([\s\S]*?<\/div>\s*\)\}/g, '');

fs.writeFileSync('src/pages/PassengerDashboard.jsx', content);
console.log('Removed features from PassengerDashboard');
