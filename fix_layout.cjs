const fs = require('fs');
let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// 1. Remove the action buttons from the top
const topButtonsRegex = /<div style=\{\{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px', zIndex: 20 \}\}>[\s\S]*?<LogOut size=\{20\} \/><\/button><\/div>/;
content = content.replace(topButtonsRegex, '');

// 2. Put the action buttons just before the '2. GO ONLINE BUTTON'
const goOnlineRegex = /\{\/\* 2\. GO ONLINE BUTTON \(POSITIONED DIRECTLY DOWN \/ UNDER THE PROFILE\) \*\/\}/;
const actionButtonsStr = '{/* ACTION BUTTONS */}\n' +
'            <div style={{ display: \'flex\', justifyContent: \'center\', gap: \'12px\', flexWrap: \'wrap\', marginBottom: \'16px\', zIndex: 20 }}>\n' +
'                {/* HAMBURGER MENU BUTTON */}\n' +
'                <button onClick={() => setShowMainMenu(!showMainMenu)} style={{ background: \'var(--bg-main)\', border: \'1px solid var(--border)\', borderRadius: \'8px\', padding: \'6px\', color: \'var(--text-main)\', cursor: \'pointer\', display: \'flex\', alignItems: \'center\', justifyContent: \'center\' }}><Menu size={20} /></button>\n' +
'                {/* THEME TOGGLE BUTTON */}\n' +
'                <button onClick={() => setTheme(theme === \'dark\' ? \'light\' : \'dark\')} style={{ background: \'var(--bg-main)\', border: \'1px solid var(--border)\', borderRadius: \'8px\', padding: \'6px\', color: \'var(--text-main)\', cursor: \'pointer\', display: \'flex\', alignItems: \'center\', justifyContent: \'center\' }}>{theme === \'dark\' ? <Sun size={20} /> : <Moon size={20} />}</button>\n' +
'                {/* RIDE PREFERENCES BUTTON */}\n' +
'                <button onClick={() => setShowRidePreferencesModal(true)} style={{ background: \'var(--bg-main)\', border: \'1px solid var(--border)\', borderRadius: \'8px\', padding: \'6px\', color: \'#10b981\', cursor: \'pointer\', display: \'flex\', alignItems: \'center\', justifyContent: \'center\' }}><Settings size={20} /></button>\n' +
'                {/* DUES / WALLET BUTTON */}\n' +
'                <button onClick={() => setShowPayDuesModal(true)} style={{ background: \'var(--bg-main)\', border: \'1px solid var(--border)\', borderRadius: \'8px\', padding: \'6px\', color: \'#f59e0b\', cursor: \'pointer\', display: \'flex\', alignItems: \'center\', justifyContent: \'center\' }}><Wallet size={20} /></button>\n' +
'                {/* LOGOUT BUTTON */}\n' +
'                <button onClick={() => { localStorage.removeItem(\'driverAuthenticated\'); localStorage.removeItem(\'driverEmail\'); localStorage.removeItem(\'driverName\'); localStorage.removeItem(\'driverId\'); navigate(\'/driver-login\'); }} style={{ background: \'rgba(239, 68, 68, 0.1)\', border: \'1px solid rgba(239, 68, 68, 0.3)\', borderRadius: \'8px\', padding: \'6px\', color: \'#ef4444\', cursor: \'pointer\', display: \'flex\', alignItems: \'center\', justifyContent: \'center\' }}><LogOut size={20} /></button>\n' +
'            </div>\n\n            {/* 2. GO ONLINE BUTTON (POSITIONED DIRECTLY DOWN / UNDER THE PROFILE) */}';
content = content.replace(goOnlineRegex, actionButtonsStr);

fs.writeFileSync('src/pages/DriverDashboard.jsx', content);

