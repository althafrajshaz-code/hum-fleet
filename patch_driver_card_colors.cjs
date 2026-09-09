const fs = require('fs');
let content = fs.readFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', 'utf8');

// 1. Change driver-header-card background
content = content.replace(
  `background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a5f 100%)',`,
  `background: 'var(--bg-card)',`
);
content = content.replace(
  `border: '1px solid rgba(99, 102, 241, 0.4)',`,
  `border: '1px solid var(--border)',`
);
content = content.replace(
  `boxShadow: '0 8px 32px rgba(99, 102, 241, 0.2)'`,
  `boxShadow: 'var(--shadow-md)'`
);

// 2. Hamburger button
content = content.replace(
  `background: 'rgba(255, 255, 255, 0.1)',\n                border: '1px solid rgba(255, 255, 255, 0.2)',\n                borderRadius: '8px',\n                padding: '6px',\n                color: '#fff',`,
  `background: 'var(--bg-main)',\n                border: '1px solid var(--border)',\n                borderRadius: '8px',\n                padding: '6px',\n                color: 'var(--text-main)',`
);

// 3. Profile Avatar border
content = content.replace(
  `border: '3px solid rgba(255,255,255,0.7)', background: '#1e1b4b', boxShadow: '0 0 0 4px rgba(255,255,255,0.12)'`,
  `border: '3px solid var(--primary)', background: 'var(--bg-main)', boxShadow: '0 0 0 4px var(--bg-card)'`
);

// 4. Driver Name
content = content.replace(
  `color: '#ffffff' }}>\n                  {driverDetails?.name`,
  `color: 'var(--text-main)' }}>\n                  {driverDetails?.name`
);

// 5. HUM Fleet Partner
content = content.replace(
  `color: 'rgba(255,255,255,0.55)' }}>HUM Fleet Partner`,
  `color: 'var(--text-muted)' }}>HUM Fleet Partner`
);

// 6. Net Earned / Gross / Trips labels
content = content.replaceAll(
  `color: 'rgba(255,255,255,0.4)'`,
  `color: 'var(--text-muted)'`
);

// 7. Gross borders
content = content.replace(
  `borderLeft: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)'`,
  `borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)'`
);

// 8. View Earnings History button
content = content.replace(
  `border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.55)',`,
  `border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)',`
);
content = content.replace(
  `onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}`,
  `onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}`
);
content = content.replace(
  `onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}`,
  `onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-main)'}`
);

fs.writeFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', content);
console.log('Removed blue background and adapted colors for white/glass card.');
