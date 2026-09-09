const fs = require('fs');
const path = 'd:\\Althaf\\hum\\src\\pages\\DriverDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Center Destination Filter
const targetDest = `<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: travelRoute ? '0' : '10px' }}>`;
const replaceDest = `<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', position: 'relative', marginBottom: travelRoute ? '0' : '10px' }}>`;

if (content.includes(targetDest)) {
  content = content.replace(targetDest, replaceDest);
  console.log('Centered Destination Filter.');
}

const targetClearBtn = `<button onClick={handleClearTravelRoute} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', fontWeight: '800', cursor: 'pointer', padding: '4px 8px' }}>CLEAR</button>`;
const replaceClearBtn = `<button onClick={handleClearTravelRoute} style={{ position: 'absolute', right: 0, background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', fontWeight: '800', cursor: 'pointer', padding: '4px 8px' }}>CLEAR</button>`;

if (content.includes(targetClearBtn)) {
  content = content.replace(targetClearBtn, replaceClearBtn);
  console.log('Fixed Clear button position.');
}

// 2. Center Partner Dashboard Menu
const targetPartnerMenu = `<span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)', marginBottom: '4px', paddingLeft: '4px' }}>`;
const replacePartnerMenu = `<span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)', marginBottom: '8px', textAlign: 'center', display: 'block', width: '100%' }}>`;

if (content.includes(targetPartnerMenu)) {
  content = content.replace(targetPartnerMenu, replacePartnerMenu);
  console.log('Centered Partner Dashboard Menu.');
}

// 3. Center Face Verified
const targetFace = `<div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 14px',
                borderRadius: '12px',`;
const replaceFace = `<div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '10px 14px',
                borderRadius: '12px',`;

if (content.includes(targetFace)) {
  content = content.replace(targetFace, replaceFace);
  console.log('Centered Face Verified badge.');
}

// 4. Center My Scheduled Trips
const targetTrips = `<h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '800', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>`;
const replaceTrips = `<h4 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: '800', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>`;

if (content.includes(targetTrips)) {
  content = content.replace(targetTrips, replaceTrips);
  console.log('Centered My Scheduled Trips.');
}

fs.writeFileSync(path, content, 'utf8');
