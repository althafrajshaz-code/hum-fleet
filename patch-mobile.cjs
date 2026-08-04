const fs = require('fs');
const path = require('path');

const MOBILE_API_BASE = `const API_BASE = 'https://server-ashen-beta.vercel.app';`;

function patchFile(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/const API_BASE = ['"]https?:\/\/[^'"]+['"];/g, MOBILE_API_BASE);
    fs.writeFileSync(filePath, content);
    console.log(`Patched ${filePath} for Vercel production`);
  }
}

// Mobile Pages
patchFile('src/pages/DriverLogin.jsx');
patchFile('src/pages/DriverDashboard.jsx');
patchFile('src/pages/DriverSignup.jsx');
patchFile('src/pages/PassengerLogin.jsx');
patchFile('src/pages/PassengerDashboard.jsx');
patchFile('src/pages/PassengerSignup.jsx');

console.log("All mobile apps have been updated to connect to the live Vercel backend.");
