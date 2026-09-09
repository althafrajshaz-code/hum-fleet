const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

const startStr = "{/* Passenger Header & Profile Picture */}";
const endStr = "{/* Passenger Wallet Overview Widget */}";

const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `{/* Passenger Header & Profile Picture */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '18px', marginBottom: '14px' }}>
            
            {/* Passenger Avatar */}
            <div style={{ position: 'relative', width: '70px', height: '70px', flexShrink: 0, marginBottom: '12px' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)', background: '#121624' }}>
                {passengerProfilePic ? (
                  <img src={passengerProfilePic} alt="Passenger Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold', fontSize: '24px' }}>
                    <User size={28} />
                  </div>
                )}
              </div>
              <label 
                title="Change Profile Picture"
                style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: 'var(--primary)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', border: '2px solid var(--bg-card)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
              >
                <Camera size={12} />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleUploadPassengerProfilePic(e.target.files[0])} 
                  style={{ display: 'none' }} 
                />
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '20px', textAlign: 'center' }}>{localStorage.getItem('passengerName') || 'Passenger'}</h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', color: '#f59e0b', fontWeight: 'bold', marginTop: '6px' }}>
                <span>★ {passengerRating.toFixed(1)} Rating</span>
              </div>
              {passengerId && (
                <div style={{ marginTop: '10px', fontSize: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#3b82f6', padding: '4px 12px', borderRadius: '6px', display: 'inline-block', fontWeight: 'bold', textAlign: 'center' }}>
                  Customer ID: {passengerId}
                </div>
              )}
            </div>

            {/* Logout Button */}
            <div style={{ position: 'absolute', top: '0px', right: '0px' }}>
              <button 
                onClick={handleLogout}
                style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', flexShrink: 0 }}
                title="Logout"
              >
                <LogOut size={14} /> <span className="hide-on-mobile">Logout</span>
              </button>
            </div>
          </div>

          `;
  
  code = code.substring(0, startIdx) + replacement + code.substring(endIdx);
  fs.writeFileSync('src/pages/PassengerDashboard.jsx', code);
  console.log("Replaced passenger header successfully.");
} else {
  console.log("Could not find start or end index!");
}
