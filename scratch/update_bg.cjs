const fs = require('fs');
let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');
content = content.replace('zIndex: 999999, background: "var(--bg-card, #0a0d14)",', 'zIndex: 999999, background: "rgba(10, 13, 20, 0.65)", backdropFilter: "blur(12px)",');
fs.writeFileSync('src/pages/DriverDashboard.jsx', content, 'utf8');
console.log('Modified background');
