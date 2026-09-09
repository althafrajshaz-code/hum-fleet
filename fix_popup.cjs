const fs = require('fs');
const path = 'd:\\Althaf\\hum\\src\\pages\\DriverDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

const target = `                  position: 'fixed',
                  top: '24px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 10000,`;

const replacement = `                  position: 'fixed',
                  top: '24px',
                  left: 0,
                  right: 0,
                  margin: '0 auto',
                  zIndex: 10000,`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Fixed popup styling.');
} else {
  console.log('Target string not found.');
}
