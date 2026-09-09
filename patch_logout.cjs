const fs = require('fs');
let content = fs.readFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', 'utf8');

const targetStr = `            </div>
          </>)}
        </div>
      </div>

      {/* MODALS */}`;

const replaceStr = `            </div>

              {/* LOGOUT BUTTON */}
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
                style={{ width: '100%', padding: '12px', marginTop: '16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <Power size={18} />
                LOGOUT SECURELY
              </button>
          </>)}
        </div>
      </div>

      {/* MODALS */}`;

if (content.includes('</>)}')) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', content);
  console.log('Added Logout button to driver menu.');
}
