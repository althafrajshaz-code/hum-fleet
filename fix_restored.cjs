const fs = require('fs');
let code = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// 1. Fix fetchStatus isOnline bug
code = code.replace(
  'if (data.acceptsIntercity !== undefined) setAcceptsIntercity(data.acceptsIntercity);',
  'if (data.acceptsIntercity !== undefined) setAcceptsIntercity(data.acceptsIntercity);\n        if (data.isOnline !== undefined) setIsOnline(data.isOnline);\n        if (data.isPaused !== undefined) setIsPaused(data.isPaused);'
);

// 2. Remove Map Background
code = code.replace(/\{\/\* Map Background \*\/\}\s*<iframe[\s\S]*?src="\/map\.html"[\s\S]*?\/>/, '');

// 3. Hide header card
code = code.replace(/<div className="driver-header-card" style={{/, '<div className="driver-header-card" style={{ display: "none", ');

fs.writeFileSync('src/pages/DriverDashboard.jsx', code);
console.log('Restored fully, applied fixes and removed map/header');
