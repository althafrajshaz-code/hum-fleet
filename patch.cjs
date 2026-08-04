const fs = require('fs');
const path = require('path');

const NEW_API_BASE = `const API_BASE = (typeof window !== 'undefined' && window.location.hostname.includes('loca.lt'))
  ? 'https://hum-fleet-backend.loca.lt'
  : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:'))
    ? 'http://localhost:5000'
    : 'https://hum-fleet-backend.onrender.com';`;

const regexAPI = /const API_BASE = [\s\S]*?(?=(?:\r?\n){2,}|const |let |var |function |export )/m;

function patchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Just simple string replacement if regex is too complex
  const start = content.indexOf('const API_BASE = ');
  if (start !== -1) {
    const end = content.indexOf(';', start);
    if (end !== -1) {
      const original = content.substring(start, end + 1);
      content = content.replace(original, NEW_API_BASE);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Patched API_BASE in', filePath);
    }
  }
}

const files = [
  'd:/Althaf/hum/admin-cms/src/pages/AdminDashboard.jsx',
  'd:/Althaf/hum/admin-cms/src/pages/AdminLogin.jsx',
  'd:/Althaf/hum/admin-cms/src/pages/StaffDashboard.jsx',
  'd:/Althaf/hum/admin-cms/src/pages/StaffLogin.jsx',
  'd:/Althaf/hum/admin-cms/src/pages/StaffRegister.jsx',
  'd:/Althaf/hum/src/pages/AdminDashboard.jsx',
  'd:/Althaf/hum/src/pages/DriverDashboard.jsx',
  'd:/Althaf/hum/src/pages/PassengerDashboard.jsx',
];

files.forEach(patchFile);

// Now patch main.jsx for fetch interceptor
const fetchInterceptor = `\n
// LOCALTUNNEL BYPASS INTERCEPTOR
const originalFetch = window.fetch;
window.fetch = async function () {
  let [resource, config] = arguments;
  if (!config) config = {};
  if (!config.headers) config.headers = {};
  config.headers['Bypass-Tunnel-Reminder'] = 'true';
  return originalFetch(resource, config);
};\n`;

const mainFiles = [
  'd:/Althaf/hum/admin-cms/src/main.jsx',
  'd:/Althaf/hum/src/main.jsx'
];

mainFiles.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (!content.includes('Bypass-Tunnel-Reminder')) {
    content = fetchInterceptor + content;
    fs.writeFileSync(f, content, 'utf8');
    console.log('Patched fetch interceptor in', f);
  }
});

console.log('Done.');
