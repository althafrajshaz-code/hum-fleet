const fs = require('fs');
let content = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

const oldStopsStart = `{stops.map((stop, index) => (
                <div className="input-group" style={{ position: 'relative', marginTop: '10px' }} key={index}>
                  <div className="input-icon"><MapPin size={18} color="#f59e0b" /></div>
                  <input 
                    type="text" 
                    className="input-field with-icon" 
                    placeholder={\`Enter stop \${index + 1} location\`}
                    value={stop.address}
                    onChange={(e) => {
                      const newStops = [...stops];
                      newStops[index].address = e.target.value;
                      setStops(newStops);
                      searchNominatim(e.target.value);
                    }}
                    onFocus={() => {
                      const newStops = [...stops];
                      newStops[index].isFocused = true;
                      setStops(newStops);
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        const newStops = [...stops];
                        if (newStops[index]) newStops[index].isFocused = false;
                        setStops(newStops);
                      }, 250);
                    }}
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      const newStops = stops.filter((_, i) => i !== index);
                      setStops(newStops);
                    }}
                    style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    X
                  </button>
                  {stop.isFocused && (
                    <div className="autocomplete-dropdown glass-card">
                      {isGeoSearching && (
                        <div className="dropdown-item" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                          Searching...
                        </div>
                      )}
                      {getFilteredLocations(stop.address).map((loc, idx) => (
                        <div 
                          onMouseDown={() => {
                            const newStops = [...stops];
                            newStops[index].address = loc.name;
                            newStops[index].coords = { lat: loc.lat, lng: loc.lng };
                            setStops(newStops);
                          }}
                          key={idx} 
                          className="dropdown-item" 
                        >
                          {loc.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}`;

const newStopsBlock = `{stops.map((stop, index) => (
                <div className="input-group" style={{ position: 'relative', marginTop: '10px' }} key={index}>
                  <div className="input-icon"><MapPin size={18} color="#f59e0b" /></div>
                  <input 
                    type="text" 
                    className="input-field with-icon" 
                    placeholder={\`Enter stop \${index + 1} location\`}
                    value={stop.address}
                    onChange={(e) => {
                      const val = e.target.value;
                      setStops(prev => {
                        const newStops = [...prev];
                        newStops[index] = { ...newStops[index], address: val, coords: null };
                        return newStops;
                      });
                      searchNominatim(val);
                    }}
                    onFocus={() => {
                      setStops(prev => {
                        const newStops = [...prev];
                        newStops[index] = { ...newStops[index], isFocused: true };
                        return newStops;
                      });
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        setStops(prev => {
                          const newStops = [...prev];
                          if (newStops[index]) {
                            newStops[index] = { ...newStops[index], isFocused: false };
                          }
                          return newStops;
                        });
                      }, 250);
                    }}
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      setStops(prev => prev.filter((_, i) => i !== index));
                    }}
                    style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    X
                  </button>
                  {stop.isFocused && (
                    <div className="autocomplete-dropdown glass-card">
                      {isGeoSearching && (
                        <div className="dropdown-item" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                          Searching...
                        </div>
                      )}
                      {getFilteredLocations(stop.address).map((loc, idx) => (
                        <div 
                          onMouseDown={() => {
                            setStops(prev => {
                              const newStops = [...prev];
                              newStops[index] = { ...newStops[index], address: loc.name, coords: { lat: loc.lat, lng: loc.lng } };
                              return newStops;
                            });
                          }}
                          key={idx} 
                          className="dropdown-item" 
                        >
                          {loc.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}`;

content = content.replace(oldStopsStart, newStopsBlock);
fs.writeFileSync('src/pages/PassengerDashboard.jsx', content);
console.log('Fixed stale closure bug for stops in PassengerDashboard.jsx');
