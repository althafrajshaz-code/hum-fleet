const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

// Add mapSearchQuery state
if (!code.includes('const [mapSearchQuery, setMapSearchQuery]')) {
  code = code.replace(
    "const [bookingStep, setBookingStep] = useState(1);",
    "const [bookingStep, setBookingStep] = useState(1);\n  const [mapSearchQuery, setMapSearchQuery] = useState('');\n  const [mapSearchFocused, setMapSearchFocused] = useState(false);"
  );
}

// Find showMapModal block
const modalStart = "showMapModal && (";
const startIdx = code.indexOf(modalStart);
if (startIdx !== -1) {
  // Find the Header section of the modal
  const headerEndIdx = code.indexOf("{/* Instruction bar */}", startIdx);
  
  const searchBarHTML = `
          {/* Map Search Bar */}
          <div style={{ padding: '10px 18px', background: 'var(--bg-card)' }}>
            <div className="input-group" style={{ margin: 0, position: 'relative' }}>
              <div className="input-icon"><Search size={18} /></div>
              <input 
                type="text"
                className="input-field with-icon"
                placeholder="Search location..."
                value={mapSearchQuery}
                onChange={(e) => {
                  setMapSearchQuery(e.target.value);
                  searchNominatim(e.target.value);
                }}
                onFocus={() => setMapSearchFocused(true)}
                onBlur={() => setTimeout(() => setMapSearchFocused(false), 250)}
              />
              {mapSearchFocused && mapSearchQuery && (
                <div className="autocomplete-dropdown glass-card" style={{ top: '100%', zIndex: 3000 }}>
                  {isGeoSearching && (
                    <div className="dropdown-item" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                      Searching...
                    </div>
                  )}
                  {getFilteredLocations(mapSearchQuery).map((loc, idx) => (
                    <div 
                      key={idx}
                      onMouseDown={() => {
                        if (mapModalTarget === 'pickup') {
                          setPickup(loc.name);
                          setPickupCoords({ lat: loc.lat, lng: loc.lng });
                        } else {
                          setDropoff(loc.name);
                          setDropoffCoords({ lat: loc.lat, lng: loc.lng });
                        }
                        setMapSearchQuery('');
                        setShowMapModal(false);
                      }}
                      className="dropdown-item"
                    >
                      {loc.name}
                    </div>
                  ))}
                  {!isGeoSearching && mapSearchQuery.length >= 3 && getFilteredLocations(mapSearchQuery).length === 0 && (
                    <div className="dropdown-item" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                      No locations found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          `;

  code = code.substring(0, headerEndIdx) + searchBarHTML + code.substring(headerEndIdx);
  fs.writeFileSync('src/pages/PassengerDashboard.jsx', code);
  console.log('Successfully injected search bar into map modal');
} else {
  console.log('Error: Could not find showMapModal');
}
