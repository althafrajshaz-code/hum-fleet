const fs = require('fs');
const path = 'd:\\Althaf\\hum\\src\\pages\\DriverDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove the large Hero Image block
const heroBlockRegex = /\{\/\* DRIVER CAPTAIN HERO IMAGE \*\/\}[\s\S]*?<\/div>\s*\{\/\* DRIVER PROFILE & ONLINE STATUS CARD \*\/\}/;
if (content.match(heroBlockRegex)) {
  content = content.replace(heroBlockRegex, '{/* DRIVER PROFILE & ONLINE STATUS CARD */}');
  console.log('Removed large hero image.');
} else {
  console.log('Could not find hero image block.');
}

// 2. Insert tiny logo inside driver-header-card
const targetHeader = `<div style={{ position: 'absolute', top: '14px', right: '14px', display: 'flex', gap: '8px', zIndex: 20 }}>
              {/* THEME TOGGLE BUTTON */}`;

const replaceHeader = `{/* TINY HUM LOGO */}
            <div style={{ position: 'absolute', top: '14px', left: '14px', width: '32px', height: '32px', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-main)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}>
              <img src="/hum_fleet_official_logo.jpg" alt="Hum Fleet" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
            </div>

            <div style={{ position: 'absolute', top: '14px', right: '14px', display: 'flex', gap: '8px', zIndex: 20 }}>
              {/* THEME TOGGLE BUTTON */}`;

if (content.includes(targetHeader)) {
  content = content.replace(targetHeader, replaceHeader);
  console.log('Injected tiny logo.');
} else {
  console.log('Could not find theme toggle target.');
}

fs.writeFileSync(path, content, 'utf8');
