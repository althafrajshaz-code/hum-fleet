const fs = require('fs');
const path = 'd:\\Althaf\\hum\\src\\pages\\DriverDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

const targetImg = `<div style={{ width: '100%', height: '200px', minHeight: '200px', flexShrink: 0, overflow: 'hidden', borderRadius: '16px', marginBottom: '16px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', padding: '10px' }}>
            <img src="/hum_fleet_official_logo.jpg" alt="HUM Captain" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>`;

const replaceImg = `<div style={{ width: '100%', height: '130px', minHeight: '130px', flexShrink: 0, overflow: 'hidden', borderRadius: '16px', marginBottom: '16px', background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', padding: '24px' }}>
            <img src="/hum_fleet_official_logo.jpg" alt="HUM Captain" style={{ width: '100%', height: '100%', objectFit: 'contain', maxWidth: '200px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }} />
          </div>`;

if (content.includes(targetImg)) {
  content = content.replace(targetImg, replaceImg);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Made logo smaller and prettier.');
} else {
  console.log('Target string not found.');
}
