const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

const oldLogoutBlockRegex = /<div style=\{\{ position: 'absolute', top: '15px', right: '15px' \}\}>[\s\S]*?<\/div>/;

if (oldLogoutBlockRegex.test(code)) {
  code = code.replace(oldLogoutBlockRegex, '');
  
  const newLogoutButton = `
          {/* Logout Button (Moved to Bottom) */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <button 
              onClick={() => {
                localStorage.removeItem('passengerAuthenticated');
                localStorage.removeItem('passengerPhone');
                localStorage.removeItem('passengerName');
                localStorage.removeItem('passengerId');
                window.location.href = '/passenger/login';
              }}
              style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
              title="Logout"
            >
              <LogOut size={16} /> <span>Log Out</span>
            </button>
          </div>
`;

  const sidebarEndIdx = code.indexOf("{/* Floating Map Background */}");
  if (sidebarEndIdx !== -1) {
    const beforeSidebarEnd = code.lastIndexOf("</div>", sidebarEndIdx);
    if (beforeSidebarEnd !== -1) {
      code = code.substring(0, beforeSidebarEnd) + newLogoutButton + "\n        " + code.substring(beforeSidebarEnd);
      fs.writeFileSync('src/pages/PassengerDashboard.jsx', code);
      console.log('Successfully moved Logout button to bottom');
    } else {
      console.log('Error: Could not find closing div for sidebar');
    }
  } else {
    console.log('Error: Could not find Floating Map Background');
  }
} else {
  console.log('Error: Could not find original Logout button block');
}
