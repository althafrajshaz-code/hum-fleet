const fs = require('fs');
const path = 'd:\\Althaf\\hum\\src\\pages\\DriverDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

const target = `                </div>
              )}

            </div>
          )}

          {/* ================= TAB 5: MESSAGES CENTER ================= */}`;

const replacement = `                </div>
              )}

              {/* LOGOUT BUTTON */}
              <div style={{ marginTop: '16px' }}>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to log out?')) {
                      localStorage.removeItem('driverEmail');
                      window.location.href = '/driver/login';
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    fontWeight: '800',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Power size={18} /> Secure Logout
                </button>
              </div>

            </div>
          )}

          {/* ================= TAB 5: MESSAGES CENTER ================= */}`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Added Logout button.');
} else {
  console.log('Target string not found.');
}
