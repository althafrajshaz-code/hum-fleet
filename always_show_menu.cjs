const fs = require('fs');
const path = 'd:\\Althaf\\hum\\src\\pages\\DriverDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// Remove the opening `{showMainMenu && (<>`
let target1 = `{showMainMenu && (<>`;
if (content.includes(target1)) {
  content = content.replace(target1, '');
}

// Remove the closing `</>)}` right above the logout button
let target2 = `</>)}
        
        {/* LOGOUT BUTTON AT BOTTOM OF SIDEBAR */}`;
if (content.includes(target2)) {
  content = content.replace(target2, `        {/* LOGOUT BUTTON AT BOTTOM OF SIDEBAR */}`);
}

// Also let's hide the hamburger button since we don't need it anymore
let hamburgerBtn = `{/* HAMBURGER MENU BUTTON */}
              <button 
                onClick={() => setShowMainMenu(!showMainMenu)}
                style={{
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '6px',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showMainMenu ? <X size={20} /> : <Menu size={20} />}
              </button>`;

if (content.includes(hamburgerBtn)) {
  content = content.replace(hamburgerBtn, '');
}

fs.writeFileSync(path, content, 'utf8');
console.log('Removed showMainMenu wrapper to make menu always visible.');
