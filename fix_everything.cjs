const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

// 1. Restore autocomplete
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
  console.log('Successfully restored autocomplete');
} else {
  console.log('Error: Could not find exact input');
}

// 2. Remove "Tap anywhere on the map..."
const exactMapTextDiv = `<div style={{ 
            position: 'absolute', top: '10px', left: '10px', right: '50px', 
            background: 'var(--card-bg)', border: '1px solid var(--border)', 
            borderRadius: '10px', padding: '10px', fontSize: '13px', 
            fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <Compass size={16} />
            Tap anywhere on the map to pin your location, then tap Confirm
          </div>`;

if (code.includes(exactMapTextDiv)) {
  code = code.replace(exactMapTextDiv, '');
  console.log('Successfully removed map text');
} else {
  console.log('Error: Could not find exact map text div');
}

fs.writeFileSync('src/pages/PassengerDashboard.jsx', code);
