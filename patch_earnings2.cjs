const fs = require('fs');
let content = fs.readFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', 'utf8');

const targetStr = `<div className="stats-grid">
                  <div className="stat-card">
                    <span className="stat-label">Today's Earnings</span>
                    <span className="stat-value text-gradient">₹{homeEarnings?.daily?.net ?? '0.00'}</span>
                  </div>`;

const replaceStr = `<div className="stats-grid">
                  <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="stat-label">Today's Earnings</span>
                      <button onClick={() => setHideEarningsAmount(!hideEarningsAmount)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        {hideEarningsAmount ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    <span className="stat-value text-gradient">{hideEarningsAmount ? '₹****' : \`₹\${homeEarnings?.daily?.net ?? '0.00'}\`}</span>
                  </div>`;

if (content.includes("Today's Earnings")) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', content);
  console.log('Fixed earnings toggle in new layout.');
}
