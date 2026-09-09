
const fs = require('fs');

let pd = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');
pd = pd.replace(/alert\('Thank you for rating your partner driver!'\);\s*/g, '');
fs.writeFileSync('src/pages/PassengerDashboard.jsx', pd);

let dd = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');
dd = dd.replace(/alert\('Passenger feedback registered successfully!'\);\s*/g, '');
fs.writeFileSync('src/pages/DriverDashboard.jsx', dd);
