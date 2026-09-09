const fs = require('fs');
const path = 'd:\\Althaf\\hum\\src\\pages\\DriverDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `<div className="dashboard-page">`;
const replaceStr = `<div className="dashboard-page" style={{ paddingTop: 0 }}>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Removed top padding from dashboard-page.');
} else {
  console.log('Target string not found.');
}
