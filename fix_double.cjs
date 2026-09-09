const fs = require('fs');
let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

const doubleRegex = /\{\/\* ACTION BUTTONS \*\/\}\s*<div style=\{\{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px', zIndex: 20 \}\}>[\s\S]*?<\/button>\s*<\/div>\s*\{\/\* ACTION BUTTONS \*\/\}/;

content = content.replace(doubleRegex, '{/* ACTION BUTTONS */}');

fs.writeFileSync('src/pages/DriverDashboard.jsx', content);

