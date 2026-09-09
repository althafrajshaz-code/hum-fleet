import re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the original top theme button
top_btn_regex = r"<div style=\{\{\s*position:\s*'absolute',\s*top:\s*'14px',\s*right:\s*'14px',\s*display:\s*'flex',\s*gap:\s*'8px',\s*zIndex:\s*20\s*\}\}>[\s\S]*?<\/div>"
content = re.sub(top_btn_regex, "", content, count=1)

action_btns = """{/* ACTION BUTTONS */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px', zIndex: 20 }}>
                  {/* HAMBURGER MENU BUTTON */}
                  <button onClick={() => setShowMainMenu(!showMainMenu)} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Menu size={20} /></button>
  
                  {/* THEME TOGGLE BUTTON */}
                  <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ThemeIcon /></button>
  
                  {/* RIDE PREFERENCES BUTTON */}
                  <button onClick={() => setShowRidePreferencesModal(true)} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Settings size={20} /></button>
  
                  {/* DUES / WALLET BUTTON */}
                  <button onClick={() => setShowPayDuesModal(true)} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', color: '#f59e0b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Wallet size={20} /></button>
  
                  {/* LOGOUT BUTTON */}
                  <button onClick={() => { localStorage.removeItem('driverAuthenticated'); localStorage.removeItem('driverEmail'); localStorage.removeItem('driverName'); localStorage.removeItem('driverId'); navigate('/driver-login'); }} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '6px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LogOut size={20} /></button>
              </div>
  
              {/* 2. GO ONLINE BUTTON (POSITIONED DIRECTLY DOWN / UNDER THE PROFILE) */}"""
if "{/* ACTION BUTTONS */}" not in content:
    content = content.replace("{/* 2. GO ONLINE BUTTON (POSITIONED DIRECTLY DOWN / UNDER THE PROFILE) */}", action_btns.replace('<ThemeIcon />', '{theme === \'dark\' ? <Sun size={20} /> : <Moon size={20} />}'))

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
