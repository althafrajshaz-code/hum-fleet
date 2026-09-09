
const fs = require('fs');
let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// Replace the specific blocks with an empty string
// We'll use a regex that matches from {/* Progress Bar for 750 Limit to </div> for that block.

content = content.replace(/\{\/\* Progress Bar for 750 Limit(.*?)\*\/\}\s*<div style={{ display: 'flex', flexDirection: 'column'[\s\S]*?\*Trips will be blocked once dues reach ₹750\.<\/span>\s*<\/div>/g, '');

fs.writeFileSync('src/pages/DriverDashboard.jsx', content);
