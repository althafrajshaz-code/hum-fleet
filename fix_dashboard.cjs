const fs = require('fs');
const path = 'd:\\Althaf\\hum\\src\\pages\\DriverDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Fix Image Container (add flexShrink and minHeight)
const targetImg = `<div style={{ width: '100%', height: '160px', overflow: 'hidden', borderRadius: '16px', marginBottom: '16px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
            <img src="/hum_fleet_official_logo.jpg" alt="HUM Captain" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }} />
          </div>`;

const replaceImg = `<div style={{ width: '100%', height: '200px', minHeight: '200px', flexShrink: 0, overflow: 'hidden', borderRadius: '16px', marginBottom: '16px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', padding: '10px' }}>
            <img src="/hum_fleet_official_logo.jpg" alt="HUM Captain" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>`;

if (content.includes(targetImg)) {
  content = content.replace(targetImg, replaceImg);
  console.log('Fixed image CSS.');
}

// 2. Remove "Waiting for Incoming Rides under 8.0 KM..." text
const targetText = `            {isOnline && (
              <div style={{ marginTop: '12px', background: 'rgba(24, 24, 27, 0.9)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', color: 'white', fontSize: '13px', fontWeight: '600', textAlign: 'center' }}>
                {currentRide ? \`Destination: \${currentRide.dropoff.split(',')[0]}\` : 'Waiting for Incoming Rides under 8.0 KM...'}
              </div>
            )}`;

if (content.includes(targetText)) {
  content = content.replace(targetText, '');
  console.log('Removed redundant status text.');
}

fs.writeFileSync(path, content, 'utf8');
