const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

// Find the line containing the HUM Customer Profile span and replace it with an empty string
code = code.replace(/<span style={{ color: 'var\(--text-muted\)', fontWeight: 'normal' }}>• HUM Customer Profile<\/span>/g, '');

fs.writeFileSync('src/pages/PassengerDashboard.jsx', code);
console.log('Removed HUM Customer Profile text!');
