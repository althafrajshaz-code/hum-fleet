const fs = require('fs');
let content = fs.readFileSync('d:/Althaf/hum/src/pages/PassengerDashboard.jsx', 'utf8');

const oldStr = `onClick={() => setSelectedTier(cat.name)}`;
const newStr = `onClick={() => { setSelectedTier(cat.name); setCustomFare(calculateCategoryFare(cat)); }}`;

content = content.replace(oldStr, newStr);

fs.writeFileSync('d:/Althaf/hum/src/pages/PassengerDashboard.jsx', content);
console.log('Fixed auto-populating customFare on vehicle select.');
