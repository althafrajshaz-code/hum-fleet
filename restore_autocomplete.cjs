const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

// The block we want to add the dropdown to
const pickupBlockRegex = /<input[\s\S]*?onChange=\{\(e\) => setPickup\(e\.target\.value\)\}[\s\S]*?\/>/g;
let match = pickupBlockRegex.exec(code);

if (match) {
  // Let's replace this input with the input + focus logic + dropdown
  const oldInput = match[0];
  
  // We need state for pickupFocused
  if (!code.includes('const [pickupFocused, setPickupFocused]')) {
    code = code.replace(
      "const [pickup, setPickup] = useState('');",
      "const [pickup, setPickup] = useState('');\n  const [pickupFocused, setPickupFocused] = useState(false);"
    );
  }
  
  const newInputWithDropdown = `<input 
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
                          <div className="autocomplete-dropdown glass-card" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000, marginTop: '8px' }}>
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

  // Wrap the parent of the input in a relative div if it isn't already, so the absolute dropdown positions correctly
  // Let's just wrap the inner input and dropdown in a relative div
  const newInputWrapped = `
                      <div style={{ position: 'relative', flex: 1, width: '100%' }}>
                        ${newInputWithDropdown}
                      </div>`;
  
  // Actually, replacing the old input with the wrapped version might break flex layout if not careful.
  // Wait, the parent of the input is: `<div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>`
  // We can make that parent relative!
  code = code.replace(oldInput, newInputWithDropdown);
  
  // Let's add position: relative to that parent div
  const parentDivRegex = /<div style=\{\{ display: 'flex', flexDirection: 'column', flex: 1 \}\}>([\s\S]*?)<input/g;
  code = code.replace(parentDivRegex, "<div style={{ display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }}>$1<input");

  fs.writeFileSync('src/pages/PassengerDashboard.jsx', code);
  console.log('Successfully restored autocomplete dropdown for Pickup');
} else {
  console.log('Error: Could not find pickup input');
}
