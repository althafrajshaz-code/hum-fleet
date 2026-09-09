const fs = require('fs');
const path = 'd:\\Althaf\\hum\\src\\pages\\DriverDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Watermark Background
const targetContainer = `<div className="dashboard-container container">`;
const replaceContainer = `<div className="dashboard-container container" style={{ position: 'relative' }}>
        {/* SUBTLE WATERMARK BACKGROUND */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/hum_fleet_official_logo.jpg)',
          backgroundPosition: 'center',
          backgroundSize: '30vmin',
          backgroundRepeat: 'no-repeat',
          opacity: 0.02,
          pointerEvents: 'none',
          zIndex: 0
        }} />`;

if (content.includes(targetContainer)) {
  content = content.replace(targetContainer, replaceContainer);
  console.log('Added watermark background.');
}

// 2. Goal Tracker
const targetLogoutBlock = `            {/* LOGOUT BUTTON ON HOME */}
            <div style={{ marginTop: '10px' }}>`;

const trackerBlock = `            {/* DAILY INCENTIVE TRACKER */}
            <div style={{ marginTop: 'auto', marginBottom: '16px', padding: '16px', background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(217, 119, 6, 0.05))', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: '16px', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#fbbf24' }}>🏆 Daily Bonus Goal</span>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#fbbf24' }}>{homeEarnings?.daily?.count || 0} / 10 Trips</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: \`\${Math.min(((homeEarnings?.daily?.count || 0) / 10) * 100, 100)}%\`, height: '100%', background: '#fbbf24', borderRadius: '4px', transition: 'width 1s ease-out' }} />
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '10px', textAlign: 'center', fontWeight: '600' }}>
                    {(homeEarnings?.daily?.count || 0) >= 10 ? '🎉 Goal achieved! Bonus unlocked.' : \`Complete \${10 - (homeEarnings?.daily?.count || 0)} more trips to unlock a ₹500 bonus!\`}
                </div>
            </div>

            {/* LOGOUT BUTTON ON HOME */}
            <div style={{ marginTop: '10px' }}>`;

if (content.includes(targetLogoutBlock)) {
  content = content.replace(targetLogoutBlock, trackerBlock);
  console.log('Added Goal Tracker.');
}

fs.writeFileSync(path, content, 'utf8');
