const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

const pickupDivRegex = /\{\/\* PICKUP \*\/\}[\s\S]*?\{\/\* DROPOFF \*\/\}/;
const dropoffDivRegex = /\{\/\* DROPOFF \*\/\}[\s\S]*?\{bookingStep === 1 && pickup && dropoff && \(/;

const newPickupHTML = `{/* PICKUP */}
                  <div style={{ 
                      padding: '12px 16px', 
                      background: 'rgba(255,255,255,0.03)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px'
                  }}>
                    <MapPin size={22} color="var(--primary)" />
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pickup Location</span>
                      <input 
                        type="text" 
                        value={pickup} 
                        onChange={(e) => setPickup(e.target.value)}
                        placeholder="Enter pickup location"
                        style={{ 
                          background: 'transparent', border: 'none', color: 'var(--text-main)', 
                          fontSize: '15px', fontWeight: 'bold', outline: 'none', padding: 0, width: '100%',
                          marginTop: '4px'
                        }}
                      />
                    </div>
                    <div 
                      onClick={() => { setMapModalTarget('pickup'); setShowMapModal(true); }}
                      style={{ cursor: 'pointer', padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Choose on map"
                    >
                      <Map size={18} color="var(--primary)" />
                    </div>
                  </div>

                  {/* DROPOFF */}`;

const newDropoffHTML = `{/* DROPOFF */}
                  <div style={{ 
                      padding: '12px 16px', 
                      background: 'rgba(255,255,255,0.03)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px'
                  }}>
                    <Navigation size={22} color="var(--secondary)" />
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Drop-off Location</span>
                      <input 
                        type="text" 
                        value={dropoff} 
                        onChange={(e) => setDropoff(e.target.value)}
                        placeholder="Enter drop-off location"
                        style={{ 
                          background: 'transparent', border: 'none', color: 'var(--text-main)', 
                          fontSize: '15px', fontWeight: 'bold', outline: 'none', padding: 0, width: '100%',
                          marginTop: '4px'
                        }}
                      />
                    </div>
                    <div 
                      onClick={() => { setMapModalTarget('dropoff'); setShowMapModal(true); }}
                      style={{ cursor: 'pointer', padding: '8px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Choose on map"
                    >
                      <Map size={18} color="var(--secondary)" />
                    </div>
                  </div>

                  {bookingStep === 1 && pickup && dropoff && (`;

if (pickupDivRegex.test(code) && dropoffDivRegex.test(code)) {
  code = code.replace(pickupDivRegex, newPickupHTML);
  code = code.replace(dropoffDivRegex, newDropoffHTML);
  fs.writeFileSync('src/pages/PassengerDashboard.jsx', code);
  console.log('Successfully made locations editable and added map button');
} else {
  console.log('Error: Could not find PICKUP or DROPOFF blocks');
}
