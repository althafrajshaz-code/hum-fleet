const fs = require('fs');
let code = fs.readFileSync('build_dual_apks.cjs', 'utf8');

// Replace env injection with explicitly writing a .env file!
code = code.replace(
  /execSync\(`npm run build`, \{\s+env: \{ \.\.\.process\.env.*?\},/gs,
  "fs.writeFileSync('.env', `VITE_APP_MODE=${type}\\nVITE_API_BASE=https://humfleet.xyz\\n`);\n    execSync(`npm run build`, {"
);

fs.writeFileSync('build_dual_apks.cjs', code);
console.log('Patched build script successfully.');
