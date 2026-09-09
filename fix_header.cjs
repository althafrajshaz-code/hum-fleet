const fs = require('fs');
let code = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// 1. Fix the header hiding (remove display: 'flex' and replace display: "none" properly)
code = code.replace(
  /<div className="driver-header-card" style=\{\{ display: "none", \n\s*position: 'relative',\n\s*display: 'flex',/g,
  '<div className="driver-header-card" style={{ display: "none", position: "relative",'
);

// If the previous replace didn't work (maybe whitespace issues), let's just do:
code = code.replace(/<div className="driver-header-card" style=\{\{[\s\S]*?padding: '18px 14px',/, '<div className="driver-header-card" style={{ display: "none", padding: "18px 14px",');

// 2. Remove the hamburger menu button completely
code = code.replace(/\{\/\* HAMBURGER MENU BUTTON \*\/\}\s*<button[\s\S]*?onClick=\{\(\) => setShowMainMenu\(!showMainMenu\)\}[\s\S]*?<\/button>/g, '');

fs.writeFileSync('src/pages/DriverDashboard.jsx', code);
console.log('Fixed header hiding and removed hamburger menu.');
