const fs = require('fs');
const path = 'd:\\Althaf\\hum\\src\\pages\\DriverDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

const targetBlock = `<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#fbbf24' }}>🏆 Daily Bonus Goal</span>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#fbbf24' }}>{homeEarnings?.daily?.count || 0} / 10 Trips</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: \`\${Math.min(((homeEarnings?.daily?.count || 0) / 10) * 100, 100)}%\`, height: '100%', background: '#fbbf24', borderRadius: '4px', transition: 'width 1s ease-out' }} />
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '10px', textAlign: 'center', fontWeight: '600' }}>`;

const replaceBlock = `<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>🏆 Daily Bonus Goal</span>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)' }}>{homeEarnings?.daily?.count || 0} / 10 Trips</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: \`\${Math.min(((homeEarnings?.daily?.count || 0) / 10) * 100, 100)}%\`, height: '100%', background: '#fbbf24', borderRadius: '4px', transition: 'width 1s ease-out' }} />
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '10px', textAlign: 'center', fontWeight: '700' }}>`;

if (content.includes(targetBlock)) {
  content = content.replace(targetBlock, replaceBlock);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Fixed font colors to adapt to light/dark themes.');
} else {
  console.log('Target string not found.');
}
