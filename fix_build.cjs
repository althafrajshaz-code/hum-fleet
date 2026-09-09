const fs = require('fs');
let code = fs.readFileSync('build_dual_apks.cjs', 'utf8');
code = code.replace(
  'env: { ...process.env, VITE_APP_MODE: type },',
  'env: { ...process.env, VITE_APP_MODE: type, VITE_API_BASE: "https://humfleet.xyz" },'
);
fs.writeFileSync('build_dual_apks.cjs', code);
console.log('Fixed build_dual_apks.cjs');
