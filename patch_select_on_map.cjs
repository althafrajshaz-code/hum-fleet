const fs = require('fs');
let content = fs.readFileSync('d:/Althaf/hum/src/pages/PassengerDashboard.jsx', 'utf8');

// For pickup
content = content.replace(
  `{!isGeoSearching && pickup.trim().length >= 3 && getFilteredLocations(pickup).length === 0 && (
                      <>
                        <div className="dropdown-item" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                          No locations found. Try a different spelling.
                        </div>
                        <div 
                          onMouseDown={(e) => { e.preventDefault(); activeFieldRef.current = 'pickup'; setIsPickingOnMap(true); }}
                          className="dropdown-item" 
                          style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 'bold', textAlign: 'center' }}
                        >
                          📍 Select on Map
                        </div>
                      </>
                    )}`,
  `{!isGeoSearching && (
                      <div 
                        onMouseDown={(e) => { e.preventDefault(); activeFieldRef.current = 'pickup'; setIsPickingOnMap(true); }}
                        className="dropdown-item" 
                        style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}
                      >
                        📍 Select on Map
                      </div>
                    )}`
);

// For dropoff
content = content.replace(
  `{!isGeoSearching && dropoff.trim().length >= 3 && getFilteredLocations(dropoff).length === 0 && (
                      <>
                        <div className="dropdown-item" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                          No locations found. Try a different spelling.
                        </div>
                        <div 
                          onMouseDown={(e) => { e.preventDefault(); activeFieldRef.current = 'dropoff'; setIsPickingOnMap(true); }}
                          className="dropdown-item" 
                          style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 'bold', textAlign: 'center' }}
                        >
                          📍 Select on Map
                        </div>
                      </>
                    )}`,
  `{!isGeoSearching && (
                      <div 
                        onMouseDown={(e) => { e.preventDefault(); activeFieldRef.current = 'dropoff'; setIsPickingOnMap(true); }}
                        className="dropdown-item" 
                        style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}
                      >
                        📍 Select on Map
                      </div>
                    )}`
);

fs.writeFileSync('d:/Althaf/hum/src/pages/PassengerDashboard.jsx', content);
console.log('Fixed Select on Map buttons');
