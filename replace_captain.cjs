const fs = require('fs');
let c = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

const replacements = [
  { search: /'Driver Partner'/g, replace: "'Captain'" },
  { search: /'Partner Driver'/g, replace: "'Captain'" },
  { search: /alt="Driver Profile"/g, replace: 'alt="Captain Profile"' },
  { search: /Driver Profile Picture updated successfully!/g, replace: 'Captain Profile Picture updated successfully!' },
  { search: /Driver Dist:/g, replace: 'Captain Dist:' },
  { search: /Driver Financial Ledger & Wallet/g, replace: 'Captain Financial Ledger & Wallet' },
  { search: /Update Driver Profile/g, replace: 'Update Captain Profile' },
  { search: /Driver Documents/g, replace: 'Captain Documents' }
];

replacements.forEach(r => {
  c = c.replace(r.search, r.replace);
});

fs.writeFileSync('src/pages/DriverDashboard.jsx', c);
console.log('Replaced successfully');
