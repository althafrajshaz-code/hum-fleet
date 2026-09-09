const fs = require('fs');
let content = fs.readFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', 'utf8');

// 1. Add states
const stateStr = `const [showMainMenu, setShowMainMenu] = useState(false);`;
const newStateStr = `const [showMainMenu, setShowMainMenu] = useState(false);
  const [hideEarningsAmount, setHideEarningsAmount] = useState(false);
  const [showEarningsDetails, setShowEarningsDetails] = useState(false);`;
content = content.replace(stateStr, newStateStr);

// 2. Replace Earnings card
const oldCard = `{/* TODAY'S EARNINGS CARD — ABOVE GO ONLINE */}
            <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '12px 14px' }}>
              <div style={{ fontSize: '10px', fontWeight: '800', color: 'rgba(16,185,129,0.7)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>📅 Today's Earnings</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#10b981' }}>₹{homeEarnings?.daily?.net ?? '0.00'}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>Net Earned</div>
                </div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#f59e0b' }}>₹{homeEarnings?.daily?.gross ?? '0.00'}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>Gross</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#3b82f6' }}>{homeEarnings?.daily?.count ?? 0}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>Trips</div>
                </div>
              </div>
            </div>

            {/* VIEW EARNINGS HISTORY BUTTON */}
            <button
              onClick={() => setShowEarningsHistory(true)}
              style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-main)'}
            >
              <TrendingUp size={13} /> View Earnings History
            </button>`;

const newCard = `{/* TODAY'S EARNINGS COMPACT CARD */}
            <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: 'rgba(16,185,129,0.9)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>📅 Today's Earnings</div>
                  <button onClick={() => setHideEarningsAmount(!hideEarningsAmount)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
                    {hideEarningsAmount ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#10b981' }}>
                  {hideEarningsAmount ? '₹****' : \`₹\${homeEarnings?.daily?.net ?? '0.00'}\`}
                </div>
              </div>

              {/* Toggle details button */}
              <button 
                onClick={() => setShowEarningsDetails(!showEarningsDetails)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '11px', marginTop: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center', fontWeight: 'bold' }}
              >
                {showEarningsDetails ? 'Hide Details ▲' : 'View More Details ▼'}
              </button>

              {showEarningsDetails && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(16,185,129,0.1)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', marginBottom: '12px' }}>
                    <div style={{ textAlign: 'center', borderRight: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#f59e0b' }}>
                        {hideEarningsAmount ? '₹****' : \`₹\${homeEarnings?.daily?.gross ?? '0.00'}\`}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>Gross</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#3b82f6' }}>
                        {hideEarningsAmount ? '****' : (homeEarnings?.daily?.count ?? 0)}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>Trips</div>
                    </div>
                  </div>
                  
                  {/* VIEW EARNINGS HISTORY BUTTON */}
                  <button
                    onClick={() => setShowEarningsHistory(true)}
                    style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-main)'}
                  >
                    <TrendingUp size={13} /> View Earnings History
                  </button>
                </div>
              )}
            </div>`;

content = content.replace(oldCard, newCard);

fs.writeFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', content);
console.log('Fixed earnings toggle feature.');
