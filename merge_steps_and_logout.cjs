const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

// 1. Rewrite STATE 1
const state1Start = "{/* STATE 1: Booking Input & Tier Selection */}";
const state2Start = "{/* STATE 2: Searching for Driver */}";

const startIdx = code.indexOf(state1Start);
const endIdx = code.indexOf(state2Start);

if (startIdx !== -1 && endIdx !== -1) {
  const newState1 = `{/* STATE 1: Booking Input & Tier Selection */}
          {!isSearching && !rideAccepted && !activeRide && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* STEP PROGRESS INDICATOR */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '0 10px' }}>
                <div style={{ flex: 1, height: '4px', background: bookingStep >= 1 ? 'var(--primary)' : 'var(--border)', borderRadius: '2px', marginRight: '4px' }} />
                <div style={{ flex: 1, height: '4px', background: bookingStep >= 2 ? 'var(--primary)' : 'var(--border)', borderRadius: '2px' }} />
              </div>
              <div style={{ padding: '0 10px', fontSize: '14px', fontWeight: 'bold', color: 'var(--primary)' }}>
                {bookingStep === 1 && "Step 1: Set Locations"}
                {bookingStep === 2 && "Step 2: Select Vehicle"}
              </div>

              {/* STEP 1: PICKUP & DROPOFF */}
              {(bookingStep === 1 || bookingStep > 1) && (
                <div style={{ opacity: bookingStep > 1 ? 0.6 : 1, display: 'flex', flexDirection: 'column', gap: '12px' }} className="animate-fade-in">
                  
                  {/* PICKUP */}
                  <div 
                    onClick={() => { setMapModalTarget('pickup'); setShowMapModal(true); }}
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
                    <MapPin size={22} color="var(--primary)" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pickup Location</span>
                      <span style={{ fontSize: '15px', fontWeight: 'bold' }}>
                        {pickup ? pickup.split(',')[0] : 'Choose from map...'}
                      </span>
                    </div>
                  </div>

                  {/* DROPOFF */}
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
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Drop-off Location</span>
                      <span style={{ fontSize: '15px', fontWeight: 'bold' }}>
                        {dropoff ? dropoff.split(',')[0] : 'Choose from map...'}
                      </span>
                    </div>
                  </div>

                  {bookingStep === 1 && pickup && dropoff && (
                    <Button variant="primary" style={{ width: '100%', marginTop: '4px' }} onClick={() => setBookingStep(2)}>
                      Next Step <Navigation2 size={16} />
                    </Button>
                  )}
                </div>
              )}

              {/* STEP 2: CATEGORY & BOOKING */}
              {bookingStep === 2 && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {pickup && dropoff && (
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(59, 130, 246, 0.1))',
                      border: '1.5px solid rgba(16, 185, 129, 0.4)',
                      borderRadius: '14px',
                      padding: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Navigation2 size={22} />
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Calculated Route Distance</div>
                          <div style={{ fontSize: '20px', fontWeight: '900', color: '#10b981', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            {tripDistance} <span style={{ fontSize: '12px', color: 'var(--text-main)', fontWeight: '700' }}>Kilometers (KM)</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>Estimated Travel Time</div>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#38bdf8' }}>
                          ~{(Math.max(5, Math.round(tripDistance * 2.2)) / 60).toFixed(1)} Hours
                        </div>
                      </div>
                    </div>
                  )}

                  {isIntercity && (
                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <Map size={20} color="#d97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <h4 style={{ margin: '0 0 2px 0', fontSize: '13px', color: '#d97706', fontWeight: '800' }}>Intercity Long-Distance Trip ({tripDistance} KM)</h4>
                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                          Rides greater than 35 KM are processed as intercity. A **₹250.00 driver premium** has been added to the base rate.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="ride-options">
                    {categories.map((cat) => (
                      <div 
                        key={cat.id}
                        className={\`ride-option \${selectedTier === cat.name ? 'active' : ''}\`}
                        onClick={() => setSelectedTier(cat.name)}
                      >
                        <Car size={24} />
                        <div className="ride-option-info">
                          <span className="ride-name">{cat.name}</span>
                          <span className="ride-eta">{cat.eta}</span>
                        </div>
                        <span className="ride-price">₹{calculateFare(cat).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="input-group" style={{ position: 'relative' }}>
                    <div className="input-icon"><DollarSign size={18} /></div>
                    <input 
                      type="number" 
                      className="input-field with-icon" 
                      placeholder={\`Offer your fare (Suggested: ₹\${calculateFare(categories.find(c => c.name === selectedTier) || categories[0]).toFixed(0)})\`}
                      value={customFare}
                      onChange={(e) => setCustomFare(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <Button variant="outline" style={{ flex: 1 }} onClick={() => setBookingStep(1)}>
                      Back
                    </Button>
                    <Button 
                      variant="primary" 
                      style={{ flex: 2 }}
                      disabled={!pickup || !dropoff || !selectedTier}
                      onClick={handleBookRide}
                    >
                      Book {selectedTier}
                    </Button>
                  </div>
                </div>
              )}

            </div>
          )}

          `;

  code = code.substring(0, startIdx) + newState1 + code.substring(endIdx);
  console.log('Successfully updated PassengerDashboard.jsx to merge steps');
} else {
  console.log('Error: Could not find STATE markers.');
  process.exit(1);
}

// 2. Move Logout button
const logoutBlockRegex = /\{\/\* Logout Button \*\/\}[\s\S]*?<\/button>\s*<\/div>/g;
const match = code.match(logoutBlockRegex);
if (match && match[0]) {
  // Remove from the header
  code = code.replace(match[0], '');
  
  // Create a new wider/full-width logout button to place at the bottom of the sidebar
  const newLogoutButton = `
          {/* Logout Button (Moved to Bottom) */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <button 
              onClick={handleLogout}
              style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
              title="Logout"
            >
              <LogOut size={16} /> <span>Log Out</span>
            </button>
          </div>
`;

  // We want to inject this right before the end of the `dashboard-sidebar` div.
  // The sidebar ends right before `{/* Floating Map Background */}` or right before `</div>` that closes `dashboard-sidebar`
  // Let's find `{/* Floating Map Background */}` which is right after the sidebar
  const sidebarEndIdx = code.indexOf("{/* Floating Map Background */}");
  if (sidebarEndIdx !== -1) {
    // The previous </div> is the closing tag of dashboard-sidebar
    const beforeSidebarEnd = code.lastIndexOf("</div>", sidebarEndIdx);
    if (beforeSidebarEnd !== -1) {
      code = code.substring(0, beforeSidebarEnd) + newLogoutButton + "\n        " + code.substring(beforeSidebarEnd);
      console.log('Successfully moved Logout button to bottom');
    }
  }
} else {
  console.log('Error: Could not find Logout button.');
}

fs.writeFileSync('src/pages/PassengerDashboard.jsx', code);
