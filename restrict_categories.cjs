const fs = require('fs');
const path = 'd:\\Althaf\\hum\\src\\pages\\DriverDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

const target = `{['Auto', 'Mini', 'Sedan', 'SUV / XL (6 Seater)', 'Premium', 'Bike'].map(cat => (`;

const replacement = `{[
                      { name: 'Bike', rank: 1 },
                      { name: 'Auto', rank: 2 },
                      { name: 'Mini', rank: 3 },
                      { name: 'Sedan', rank: 4 },
                      { name: 'Premium', rank: 5 },
                      { name: 'SUV / XL (6 Seater)', rank: 6 }
                    ].filter(c => {
                      const myRank = { 'Bike': 1, 'Auto': 2, 'Mini': 3, 'Sedan': 4, 'Premium': 5, 'SUV / XL (6 Seater)': 6 }[driverDetails?.vehicleCategory] || 6;
                      return c.rank <= myRank;
                    }).map(c => c.name).map(cat => (`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Successfully applied hierarchy logic.');
} else {
  console.log('Target string not found.');
}
