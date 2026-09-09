const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

// 1. Remove "Tap anywhere on the map..."
const start = code.indexOf("<div style={{ position: 'absolute', top: '10px', left: '10px', right: '50px'");
const end = code.indexOf('Tap anywhere on the map') + 100;
if (start !== -1 && end > 100) {
  const exact = code.substring(start, code.indexOf('</div>', end) + 6);
  code = code.replace(exact, '');
  console.log('Removed text');
} else {
  console.log('Could not find text bounds', start, end);
}

// 2. Add Autocomplete
const inputRegex = /<input[\s\S]*?onChange=\{\(e\) => setPickup\(e\.target\.value\)\}[\s\S]*?\/>/g;
const match = inputRegex.exec(code);
if (match) {
  const exactInput = match[0];
  if (!code.includes('const [pickupFocused, setPickupFocused]')) {
    code = code.replace(
      "const [pickup, setPickup] = useState('');",
      "const [pickup, setPickup] = useState('');\n  const [pickupFocused, setPickupFocused] = useState(false);"
    );
  }
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
  code = code.replace(exactInput, newInput);
  console.log('Restored autocomplete');
} else {
  console.log('Could not find input');
}

fs.writeFileSync('src/pages/PassengerDashboard.jsx', code);
