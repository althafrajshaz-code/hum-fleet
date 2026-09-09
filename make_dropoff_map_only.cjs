const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

const dropoffDivRegex = /\{\/\* DROPOFF \*\/\}[\s\S]*?\{bookingStep === 1 && pickup && dropoff && \(/;

const newDropoffHTML = `{/* DROPOFF */}
                  <div 
                    onClick={() => { setMapModalTarget('dropoff'); setShowMapModal(true); }}
                    style={{ 
                      padding: '16px', 
                      background: 'rgba(255,255,255,0.03)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <Navigation size={22} color="var(--secondary)" />
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Drop-off Location</span>
                      <span style={{ fontSize: '15px', fontWeight: 'bold', color: dropoff ? 'var(--text-main)' : 'var(--text-muted)', marginTop: '4px' }}>
                        {dropoff ? dropoff.split(',')[0] : 'Tap to choose from map...'}
                      </span>
                    </div>
                    <div style={{ padding: '6px 10px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--secondary)', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Map size={14} /> Map
                    </div>
                  </div>

                  {bookingStep === 1 && pickup && dropoff && (`;

if (dropoffDivRegex.test(code)) {
  code = code.replace(dropoffDivRegex, newDropoffHTML);
  fs.writeFileSync('src/pages/PassengerDashboard.jsx', code);
  console.log('Successfully reverted dropoff to map-only');
} else {
  console.log('Error: Could not find DROPOFF block');
}
