const fs = require('fs');
let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// Remove commission assignments
content = content.replace(/const commission = parseFloat\(ride\.commission \|\| \(fare \* 0\.05\)\);/g, 'const commission = 0;');
content = content.replace(/const driverPayout = \(fare - commission\)\.toFixed\(2\);/g, 'const driverPayout = fare.toFixed(2);');

// Remove commission rows from UI
content = content.replace(/<tr><td style="color:#ef4444">HUM Commission \(5%\)<\/td><td style="color:#ef4444">-₹\$\{commission\.toFixed\(2\)\}<\/td><\/tr>/g, '');

// Remove Dues Banner entirely
content = content.replace(/\{\/\* ₹700 Commission Dues Notification Banner[\s\S]*?\*\/\}\s*\{parseFloat\(wallet\.toBePaid \|\| 0\) >= 700 && \([\s\S]*?<\/div>\s*\)\}/g, '');

// Remove Wallet Dues Button (top right)
content = content.replace(/<button onClick=\{\(\) => window\.open\('https:\/\/api\.whatsapp\.com\/send\?phone=918848347290&text=' \+ encodeURIComponent\('Hello Admin, I am driver ' \+ \(driverDetails\?\.name \|\| 'Partner'\) \+ ' \(' \+ \(driverDetails\?\.phone \|\| ''\) \+ '\)\. My pending platform commission dues have reached Rs\.' \+ parseFloat\(wallet\?\.toBePaid \|\| 0\)\.toFixed\(2\) \+ '\. I would like to clear my dues\.'\), '_blank'\)\} style=\{\{ background: 'var\(--bg-main\)', border: '1px solid var\(--border\)', borderRadius: '8px', padding: '6px', color: '#f59e0b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' \}\}\><Wallet size=\{20\} \/><\/button>/g, '');

// Remove "Your net earnings after platform commission" text
content = content.replace(/<span style=\{\{ fontSize: '11px', color: 'var\(--text-muted\)' \}\}>Your net earnings after platform commission<\/span>/g, '<span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Your net earnings</span>');

// Remove Note about commission
content = content.replace(/<div style=\{\{ background: 'rgba\(16, 185, 129, 0.1\)', padding: '12px', borderRadius: '8px', fontSize: '13px', color: 'var\(--text-main\)', lineHeight: '1.4' \}\}>\s*💡 <strong>Note:<\/strong> HUM Fleet is not currently collecting any platform commission. You keep 100% of your collected fares.\s*<\/div>/g, '');

fs.writeFileSync('src/pages/DriverDashboard.jsx', content);
console.log('Removed Commission from DriverDashboard');
