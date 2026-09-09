const fs = require('fs');
let content = fs.readFileSync('d:/Althaf/hum/src/pages/PassengerDashboard.jsx', 'utf8');

content = content.replace(
  `<span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>• HUM Customer Profile</span>`,
  ``
);

fs.writeFileSync('d:/Althaf/hum/src/pages/PassengerDashboard.jsx', content);
console.log('Removed HUM Customer Profile text.');
