const fs = require('fs');
const path = 'd:\\Althaf\\hum\\src\\pages\\DriverDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

const target = `                <Power size={18} /> {isOnline ? 'Go Offline' : 'Go Online'}
              </Button>
            </div>`;

const replacement = `                <Power size={18} /> {isOnline ? 'Go Offline' : 'Go Online'}
              </Button>
            </div>

            {/* LOGOUT BUTTON ON HOME */}
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

if (content.includes(target) && !content.includes('LOGOUT BUTTON ON HOME')) {
  content = content.replace(target, replacement);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Added Logout button to home tab.');
} else {
  console.log('Target string not found or already injected.');
}
