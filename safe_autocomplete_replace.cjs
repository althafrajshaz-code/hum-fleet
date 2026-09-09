const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

if (!code.includes('const [pickupFocused, setPickupFocused]')) {
  code = code.replace(
    "const [pickup, setPickup] = useState('');",
    "const [pickup, setPickup] = useState('');\n  const [pickupFocused, setPickupFocused] = useState(false);"
  );
}

const exactInput = `<input 
                          type="text" 
                          value={pickup} 
                          onChange={(e) => setPickup(e.target.value)}
                          placeholder="Enter pickup location"
                          style={{ 
                            background: 'transparent', border: 'none', color: 'var(--text-main)', 
                            fontSize: '15px', fontWeight: 'bold', outline: 'none', padding: 0, width: '100%',
                            marginTop: '4px'
                          }}
                        />`;

const newInput = `<input 
                          type="text" 
                          value={pickup} 
                          onChange={(e) => {
                            setPickup(e.target.value);
                            searchNominatim(e.target.value);
                          }}
                          onFocus={() => setPickupFocused(true)}
                          onBlur={() => setTimeout(() => setPickupFocused(false), 250)}
                          placeholder="Enter pickup location"
                          style={{ 
                            background: 'transparent', border: 'none', color: 'var(--text-main)', 
                            fontSize: '15px', fontWeight: 'bold', outline: 'none', padding: 0, width: '100%',
                            marginTop: '4px'
                          }}
                        />
                        {pickupFocused && pickup && (
                          <div className="autocomplete-dropdown glass-card" style={{ position: 'absolute', zIndex: 1000, marginTop: '8px', left: '16px', right: '16px' }}>
                            {isGeoSearching && (
                              <div className="dropdown-item" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                                Searching...
                              </div>
                            )}
                            {getFilteredLocations(pickup).map((loc, idx) => (
                              <div 
                                key={idx}
                                onMouseDown={() => {
                                  setPickup(loc.name);
                                  setPickupCoords({ lat: loc.lat, lng: loc.lng });
                                }}
                                className="dropdown-item"
                              >
                                {loc.name}
                              </div>
                            ))}
                            {!isGeoSearching && pickup.length >= 3 && getFilteredLocations(pickup).length === 0 && (
                              <div className="dropdown-item" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                                No locations found.
                              </div>
                            )}
                          </div>
                        )}`;

if (code.includes(exactInput)) {
  code = code.replace(exactInput, newInput);
  console.log('Restored autocomplete');
} else {
  console.log('Could not find input exactly');
}

fs.writeFileSync('src/pages/PassengerDashboard.jsx', code);
