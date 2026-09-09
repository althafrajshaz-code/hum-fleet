const fs = require('fs');

let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

let oldContainer = `<div className="animate-fade-in delay-100 active-ride-card" style={{ margin: '16px -8px', width: 'calc(100% + 16px)', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', maxHeight: '60vh', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <style>{\`
                    .active-ride-card::-webkit-scrollbar { display: none; }
                  \`}</style>`;
