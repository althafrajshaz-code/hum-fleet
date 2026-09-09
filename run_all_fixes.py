import os
import re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. State
find_state = """  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('driverTheme') || 'light';
  });"""
replace_state = """  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('driverTheme') || 'light';
  });
  const [showRidePreferencesModal, setShowRidePreferencesModal] = useState(false);"""
if find_state in content:
    content = content.replace(find_state, replace_state)

# 2. Main Menu wrap
find_menu = """            {/* LISTINGS / MENU SECTION */}
            <div style={{ flex: 1, padding: "0 14px", overflowY: "auto", display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '20px' }}>"""
replace_menu = """            {/* LISTINGS / MENU SECTION */}
            {showMainMenu && (
              <div style={{ flex: 1, padding: "0 14px", overflowY: "auto", display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '20px' }}>"""

if find_menu in content:
    content = content.replace(find_menu, replace_menu)
    # Then close the wrap
    find_menu_end = """              </div>
            </div>

          </div>"""
    replace_menu_end = """              </div>
            )}
          </div>"""
    content = content.replace(find_menu_end, replace_menu_end)

# 3. Modal
find_end = """    </div>
  );
};"""
replace_end = """
      {/* ========== RIDE PREFERENCES MODAL ========== */}
      {showRidePreferencesModal && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)', position: 'fixed', inset: 0, zIndex: 1150, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '24px', borderRadius: '20px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>Ride Preferences</h3>
              <button onClick={() => setShowRidePreferencesModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Select the vehicle categories you are willing to accept rides for, and whether you want intercity trips. Note: You can only select categories equal to or cheaper than your assigned vehicle.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '8px 0' }}>
              {(() => {
                const driverRate = parseFloat(driverDetails?.ratePerKm || 0);
                let eligible = availableCategories;
                if (driverRate > 0) {
                  eligible = availableCategories.filter(cat => {
                     const catRate = parseFloat(cat.ratePerKm || 0);
                     return catRate <= driverRate;
                  });
                  if (eligible.length === 0) eligible = availableCategories;
                }
                
                return eligible.map(cat => (
                  <label key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={acceptedCategories.includes(cat.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAcceptedCategories([...acceptedCategories, cat.name]);
                        } else {
                          setAcceptedCategories(acceptedCategories.filter(c => c !== cat.name));
                        }
                      }}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                    />
                    {cat.name} (₹{parseFloat(cat.ratePerKm || 0).toFixed(2)}/KM)
                  </label>
                ));
              })()}
              
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer', color: '#f59e0b', fontWeight: 'bold' }}>
                <input 
                  type="checkbox" 
                  checked={acceptsIntercity}
                  onChange={(e) => setAcceptsIntercity(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#f59e0b' }}
                />
                Intercity Trips (>35 KM)
              </label>
            </div>
            
            <Button variant="primary" onClick={() => {
              handleSaveRidePreferences();
              setShowRidePreferencesModal(false);
            }} className="full-width" style={{ background: 'var(--primary)', color: '#000', border: 'none' }}>
              Save Ride Preferences
            </Button>
          </div>
        </div>
      )}
""" + find_end
if find_end in content:
    content = content.replace(find_end, replace_end)

# 4. HUM Fleet Partner
find_hum = "<span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>HUM Fleet Partner</span>"
content = content.replace(find_hum, "")

# 5. Action Buttons
top_btn_regex = r"<div style=\{\{ position: 'absolute', top: '14px', right: '14px', display: 'flex', gap: '8px', zIndex: 20 \}\}>[\s\S]*?<\/button>\s*<\/div>"
match = re.search(top_btn_regex, content)

if match:
    content = content.replace(match.group(0), "")
    
    action_btns = """{/* ACTION BUTTONS */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px', zIndex: 20 }}>
                  {/* HAMBURGER MENU BUTTON */}
                  <button onClick={() => setShowMainMenu(!showMainMenu)} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Menu size={20} /></button>
  
                  {/* THEME TOGGLE BUTTON */}
                  <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button>
  
                  {/* RIDE PREFERENCES BUTTON */}
                  <button onClick={() => setShowRidePreferencesModal(true)} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Settings size={20} /></button>
  
                  {/* DUES / WALLET BUTTON */}
                  <button onClick={() => setShowPayDuesModal(true)} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', color: '#f59e0b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Wallet size={20} /></button>
  
                  {/* LOGOUT BUTTON */}
                  <button onClick={() => { localStorage.removeItem('driverAuthenticated'); localStorage.removeItem('driverEmail'); localStorage.removeItem('driverName'); localStorage.removeItem('driverId'); navigate('/driver-login'); }} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '6px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LogOut size={20} /></button>
              </div>
  
              {/* 2. GO ONLINE BUTTON (POSITIONED DIRECTLY DOWN / UNDER THE PROFILE) */}"""
    content = content.replace("{/* 2. GO ONLINE BUTTON (POSITIONED DIRECTLY DOWN / UNDER THE PROFILE) */}", action_btns)

# 6. Today's Earnings
earnings_regex = r"\{\/\* TODAY'S EARNINGS COMPACT CARD \*\/\}.*?<\/div>\s*<\/div>\s*<\/div>"
replace_earnings = """{/* TODAY'S EARNINGS COMPACT CARD */}
              <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'rgba(16,185,129,0.9)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>💰 Today's Earnings</div>
                  <button onClick={() => setHideEarningsAmount(!hideEarningsAmount)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
                    {hideEarningsAmount ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <div style={{ fontSize: '28px', fontWeight: '900', color: '#10b981', textAlign: 'center' }}>
                  {hideEarningsAmount ? '***' : `₹${homeEarnings?.daily?.net ?? '0.00'}`}
                </div>
              </div>"""

match = re.search(earnings_regex, content, re.DOTALL)
if match:
    content = content.replace(match.group(0), replace_earnings)
else:
    print("Earnings regex failed!")

# Remove `display: "none",  display: "none",` from driver-header-card (artifact from previous attempt)
content = content.replace('className="driver-header-card" style={{ display: "none",  display: "none",', 'className="driver-header-card" style={{')

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done!")
