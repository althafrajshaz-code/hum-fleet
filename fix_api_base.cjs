const fs = require('fs');
const glob = require('glob'); // Not available? I'll just hardcode the files.

const files = [
  'src/pages/DriverDashboard.jsx',
  'src/pages/DriverLogin.jsx',
  'src/pages/DriverSignup.jsx',
  'src/pages/PassengerDashboard.jsx',
  'src/pages/PassengerLogin.jsx',
  'src/pages/PassengerSignup.jsx',
  'src/pages/PublicTracking.jsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');
  
  // Replace the complex localhost check in DriverDashboard
  code = code.replace(
    /const API_BASE = \(typeof window[^;]+;/s, 
    "const API_BASE = import.meta.env.VITE_API_BASE || 'https://humfleet.xyz';"
  );
  
  // Replace the simpler one in other files
  code = code.replace(
    /const API_BASE = import\.meta\.env\.VITE_API_BASE \|\| \(window\.location\.origin\.includes\('localhost'\) \? 'http:\/\/localhost:5000' : window\.location\.origin\);/g,
    "const API_BASE = import.meta.env.VITE_API_BASE || 'https://humfleet.xyz';"
  );
  
  fs.writeFileSync(file, code);
  console.log('Fixed', file);
});
