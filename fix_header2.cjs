const fs = require('fs');
let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

const regex = /<div style=\{\{ position: 'absolute', top: '14px', right: '14px', display: 'flex', gap: '8px', zIndex: 20 \}\}>.*?(?=<\/div>\s*\{\/\* 1\. CENTERED DRIVER PROFILE SECTION \*\/})/s;

const replaceStr = \<div style={{ position: 'absolute', top: '14px', right: '14px', display: 'flex', gap: '8px', zIndex: 20 }}>
                {/* HAMBURGER MENU BUTTON */}
                <button onClick={() => setShowMainMenu(!showMainMenu)} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Menu size={20} /></button>

                {/* THEME TOGGLE BUTTON */}
                <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button>

                {/* RIDE PREFERENCES BUTTON */}
                <button onClick={() => setShowRidePreferencesModal(true)} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Settings size={20} /></button>

                {/* DUES / WALLET BUTTON */}
                <button onClick={() => setShowPayDuesModal(true)} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', color: '#f59e0b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Wallet size={20} /></button>

                {/* LOGOUT BUTTON */}
                <button onClick={() => { localStorage.removeItem('driverAuthenticated'); localStorage.removeItem('driverEmail'); localStorage.removeItem('driverName'); localStorage.removeItem('driverId'); navigate('/driver-login'); }} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '6px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LogOut size={20} /></button>\;

if (regex.test(content)) {
    content = content.replace(regex, replaceStr);
    fs.writeFileSync('src/pages/DriverDashboard.jsx', content);
    console.log('Fixed header buttons successfully.');
} else {
    console.log('Regex did not match.');
}

