const fs = require('fs');

let code = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// 1. Remove map
code = code.replace(/\{\/\* Map Background \*\/\}\s*<iframe[\s\S]*?src="\/map\.html"[^>]*\/>/, '');

// 2. Hide driver-header-card but keep its contents if needed?
// The user said "REMOVE THE MAP AND HEADER". Let's hide the driver-header-card by setting display: 'none'.
// But wait, the hamburger menu is INSIDE the driver-header-card!
// We can just add a floating hamburger menu at the top left if we hide the header.

const floatingMenu = `
      {/* FLOATING HAMBURGER MENU */}
      <button 
        onClick={() => setShowMainMenu(!showMainMenu)}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          background: 'var(--bg-main)',
          border: '1px solid var(--border)',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          color: 'var(--text-main)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          boxShadow: 'var(--shadow-md)'
        }}
      >
        {showMainMenu ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="dashboard-container container">
`;

code = code.replace(/<div className="dashboard-container container">/, floatingMenu);

// Now, we hide the driver-header-card
code = code.replace(/<div className="driver-header-card" style={{/, '<div className="driver-header-card" style={{ display: "none", ');

fs.writeFileSync('src/pages/DriverDashboard.jsx', code);
console.log('Removed map and hid header, added floating menu.');
