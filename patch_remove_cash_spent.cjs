const fs = require('fs');
let content = fs.readFileSync('d:/Althaf/hum/src/pages/PassengerDashboard.jsx', 'utf8');

const oldHtml = `<div className="stats-grid" style={{ marginTop: '8px', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', width: '100%' }}>
              <div className="stat-card" style={{ padding: '10px' }}>
                <span className="stat-label" style={{ fontSize: '10px' }}>Total Cash Spent</span>
                <span className="stat-value" style={{ fontSize: '15px' }}>₹{parseFloat(wallet.totalSpent || 0).toFixed(2)}</span>
              </div>
              <div className="stat-card" style={{ padding: '10px' }}>
                <span className="stat-label" style={{ fontSize: '10px' }}>Wallet Balance</span>
                <span className="stat-value" style={{ fontSize: '15px', color: '#10b981' }}>₹{parseFloat(wallet.balance || 0).toFixed(2)}</span>
              </div>
              <div className="stat-card" style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button variant="outline" style={{ width: '100%', fontSize: '12px' }} onClick={() => setShowWalletModal(true)}>
                  + Top-Up
                </Button>
              </div>
            </div>`;

const newHtml = `<div className="stats-grid" style={{ marginTop: '8px', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%' }}>
              <div className="stat-card" style={{ padding: '10px' }}>
                <span className="stat-label" style={{ fontSize: '10px' }}>Wallet Balance</span>
                <span className="stat-value" style={{ fontSize: '15px', color: '#10b981' }}>₹{parseFloat(wallet.balance || 0).toFixed(2)}</span>
              </div>
              <div className="stat-card" style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button variant="outline" style={{ width: '100%', fontSize: '12px' }} onClick={() => setShowWalletModal(true)}>
                  + Top-Up
                </Button>
              </div>
            </div>`;

content = content.replace(oldHtml, newHtml);

fs.writeFileSync('d:/Althaf/hum/src/pages/PassengerDashboard.jsx', content);
console.log('Removed Total Cash Spent.');
