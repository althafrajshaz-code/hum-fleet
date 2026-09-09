const fs = require('fs');
let content = fs.readFileSync('d:/Althaf/hum/deploy_updates.cjs', 'utf8');

const oldFiles = `const files = [
      { local: 'src/pages/PassengerDashboard.jsx', remote: '/root/hum-fleet/src/pages/PassengerDashboard.jsx' },
      { local: 'src/pages/DriverDashboard.jsx', remote: '/root/hum-fleet/src/pages/DriverDashboard.jsx' },
      { local: 'public/map.html', remote: '/root/hum-fleet/public/map.html' },
      { local: 'server/index.js', remote: '/root/hum-fleet/server/index.js' }
    ];`;

const newFiles = `const files = [
      { local: 'src/pages/PassengerDashboard.jsx', remote: '/root/hum-fleet/src/pages/PassengerDashboard.jsx' },
      { local: 'src/pages/DriverDashboard.jsx', remote: '/root/hum-fleet/src/pages/DriverDashboard.jsx' },
      { local: 'src/pages/Dashboard.css', remote: '/root/hum-fleet/src/pages/Dashboard.css' },
      { local: 'public/map.html', remote: '/root/hum-fleet/public/map.html' },
      { local: 'server/index.js', remote: '/root/hum-fleet/server/index.js' }
    ];`;

content = content.replace(oldFiles, newFiles);

fs.writeFileSync('d:/Althaf/hum/deploy_updates.cjs', content);
console.log('Added Dashboard.css to deploy script.');
