const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

// We need to add `const [bookingStep, setBookingStep] = useState(1);` near the top of the component state.
if (!code.includes('const [bookingStep, setBookingStep]')) {
  code = code.replace(
    "const [pickup, setPickup] = useState('');",
    "const [bookingStep, setBookingStep] = useState(1);\n  const [pickup, setPickup] = useState('');"
  );
}

// Now replace the STATE 1 content
const state1Start = "{/* STATE 1: Booking Input & Tier Selection */}";
const state1End = "{/* STATE 2: Finding Driver */}";

const startIdx = code.indexOf(state1Start);
const endIdx = code.indexOf(state1End);

if (startIdx !== -1 && endIdx !== -1) {
  // We'll extract the core elements from original code and assemble them into a step-by-step layout.
  // Actually, we can just completely replace everything between startIdx and endIdx with our new logic.

  let originalChunk = code.substring(startIdx, endIdx);

  // But we need the original pickup, dropoff, route calc, tiers, custom fare inputs, and book button intact but reordered/conditionally rendered.
  // Instead of complex AST or regex, let's inject a rewritten STATE 1.
  
  const newState1 = `{/* STATE 1: Booking Input & Tier Selection */}
          {!isSearching && !rideAccepted && !activeRide && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* STEP PROGRESS INDICATOR */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '0 10px' }}>
                <div style={{ flex: 1, height: '4px', background: bookingStep >= 1 ? 'var(--primary)' : 'var(--border)', borderRadius: '2px', marginRight: '4px' }} />
                <div style={{ flex: 1, height: '4px', background: bookingStep >= 2 ? 'var(--primary)' : 'var(--border)', borderRadius: '2px', marginRight: '4px' }} />
                <div style={{ flex: 1, height: '4px', background: bookingStep >= 3 ? 'var(--primary)' : 'var(--border)', borderRadius: '2px' }} />
              </div>
              <div style={{ padding: '0 10px', fontSize: '14px', fontWeight: 'bold', color: 'var(--primary)' }}>
                {bookingStep === 1 && "Step 1: Where are you?"}
                {bookingStep === 2 && "Step 2: Where to?"}
                {bookingStep === 3 && "Step 3: Select Vehicle"}
              </div>

              {/* STEP 1: PICKUP */}
              {(bookingStep === 1 || bookingStep > 1) && (
                <div style={{ opacity: bookingStep > 1 ? 0.6 : 1 }}>
                  <div className="input-group" style={{ position: 'relative' }}>
                    <div className="input-icon"><MapPin size={18} /></div>
                    <input 
                      type="text" 
                      className="input-field with-icon" 
                      placeholder="Enter pickup location" 
                      value={pickup}
                      onChange={(e) => { setPickup(e.target.value); searchNominatim(e.target.value); }}
                      onFocus={() => { setPickupFocused(true); setBookingStep(1); }}
                      onBlur={() => setTimeout(() => setPickupFocused(false), 250)}
                    />
                    {pickupFocused && bookingStep === 1 && (
                      <div className="autocomplete-dropdown glass-card">
                        <div 
                          onMouseDown={() => handleUseCurrentLocation('pickup')}
                          className="dropdown-item" 
                          style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                        >
                          <Navigation2 size={16} style={{ marginRight: '8px' }} />
                          📍 Use My Current Location
                        </div>
                        <div
                          onMouseDown={() => { setMapModalTarget('pickup'); setShowMapModal(true); setPickupFocused(false); }}
                          className="dropdown-item"
                          style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center' }}
                        >
                          <Map size={16} style={{ marginRight: '8px' }} />
                          🗺️ Choose from Map
                        </div>
                        {isGeoSearching && (
                          <div className="dropdown-item" style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '14px', height: '14px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                            Searching all Kerala locations...
                          </div>
                        )}
                        {getFilteredLocations(pickup).map((loc, idx) => (
                          <div 
                            onMouseDown={() => {
                              setPickup(loc.name);
                              setPickupCoords({ lat: loc.lat, lng: loc.lng });
                            }}
                            key={idx} 
                            className="dropdown-item" 
                          >
                            {loc.isGeoResult ? <span style={{ marginRight: '8px', fontSize: '14px' }}>🌐</span> : <MapPin size={14} style={{ marginRight: '8px', color: 'var(--primary)' }} />}
                            {loc.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {bookingStep === 1 && pickup && (
                    <Button variant="primary" style={{ width: '100%', marginTop: '10px' }} onClick={() => setBookingStep(2)}>
                      Next Step <Navigation2 size={16} />
                    </Button>
                  )}
                </div>
              )}

              {/* STEP 2: DROPOFF */}
              {(bookingStep === 2 || bookingStep > 2) && (
                <div style={{ opacity: bookingStep > 2 ? 0.6 : 1 }} className="animate-fade-in">
                  <div className="input-group" style={{ position: 'relative' }}>
                    <div className="input-icon"><Navigation size={18} /></div>
                    <input 
                      type="text" 
                      className="input-field with-icon" 
                      placeholder="Choose on map" 
                      value={dropoff}
                      onChange={(e) => { setDropoff(e.target.value); searchNominatim(e.target.value); }}
                      onFocus={() => { setDropoffFocused(true); setBookingStep(2); }}
                      onBlur={() => setTimeout(() => setDropoffFocused(false), 250)}
                    />
                    {dropoffFocused && bookingStep === 2 && (
                      <div className="autocomplete-dropdown glass-card">
                        <div 
                          onMouseDown={() => handleUseCurrentLocation('dropoff')}
                          className="dropdown-item" 
                          style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                        >
                          <Navigation2 size={16} style={{ marginRight: '8px' }} />
                          📍 Use My Current Location
                        </div>
                        <div
                          onMouseDown={() => { setMapModalTarget('dropoff'); setShowMapModal(true); setDropoffFocused(false); }}
                          className="dropdown-item"
                          style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center' }}
                        >
                          <Map size={16} style={{ marginRight: '8px' }} />
                          🗺️ Choose from Map
                        </div>
                        {isGeoSearching && (
                          <div className="dropdown-item" style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '14px', height: '14px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                            Searching all Kerala locations...
                          </div>
                        )}
                        {getFilteredLocations(dropoff).map((loc, idx) => (
                          <div 
                            onMouseDown={() => {
                              setDropoff(loc.name);
                              setDropoffCoords({ lat: loc.lat, lng: loc.lng });
                            }}
                            key={idx} 
                            className="dropdown-item" 
                          >
                            {loc.isGeoResult ? <span style={{ marginRight: '8px', fontSize: '14px' }}>🌐</span> : <Navigation size={14} style={{ marginRight: '8px', color: 'var(--secondary)' }} />}
                            {loc.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {bookingStep === 2 && dropoff && (
                    <Button variant="primary" style={{ width: '100%', marginTop: '10px' }} onClick={() => setBookingStep(3)}>
                      Next Step <Navigation2 size={16} />
                    </Button>
                  )}
                </div>
              )}

              {/* STEP 3: CATEGORY & BOOKING */}
              {bookingStep === 3 && (
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
                    <Button variant="outline" style={{ flex: 1 }} onClick={() => setBookingStep(2)}>
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
  fs.writeFileSync('src/pages/PassengerDashboard.jsx', code);
  console.log('Successfully updated PassengerDashboard.jsx with step-by-step UI');
} else {
  console.log('Error: Could not find STATE 1 markers.');
}
