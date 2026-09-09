const fs = require('fs');
const path = 'd:\\Althaf\\hum\\src\\pages\\DriverDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

const logoutBlock = `            {/* LOGOUT BUTTON ON HOME */}
            <div style={{ marginTop: '10px' }}>
              <button
                style={{
                  width: '100%',
                  border: currentRide ? '1px solid #3f3f46' : '1px solid rgba(239, 68, 68, 0.3)',
                  background: currentRide ? 'transparent' : 'rgba(239, 68, 68, 0.08)',
                  color: currentRide ? '#71717a' : '#ef4444',
                  fontSize: '13px',
                  fontWeight: '800',
                  padding: '12px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: currentRide ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
                disabled={!!currentRide}
                onClick={() => {
                  if (currentRide) {
                     alert('You cannot log out while on an active trip or heading to a pickup!');
                     return;
                  }
                  if (window.confirm('Are you sure you want to log out?')) {
                    localStorage.removeItem('driverEmail');
                    window.location.href = '/driver/login';
                  }
                }}
              >
                <Power size={16} /> Secure Logout
              </button>
            </div>`;

// 1. Remove the block from its current location
if (content.includes(logoutBlock)) {
  content = content.replace(logoutBlock, '');

  // 2. Insert it right after the showMainMenu block closes (</>)})
  // Let's find `</>)}` and the closing `</div>` of dashboard-sidebar.
  const targetEnd = `        </>)}
        </div>`;
  
  if (content.includes(targetEnd)) {
    const replacementEnd = `        </>)}
        
        {/* LOGOUT BUTTON AT BOTTOM OF SIDEBAR */}
${logoutBlock}
        </div>`;
    content = content.replace(targetEnd, replacementEnd);
    fs.writeFileSync(path, content, 'utf8');
    console.log('Moved Logout button below the Menu.');
  } else {
    console.log('Could not find the targetEnd marker.');
  }

} else {
  console.log('Could not find the logoutBlock to remove.');
}
