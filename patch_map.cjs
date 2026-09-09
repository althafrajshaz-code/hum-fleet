const fs = require('fs');

let content = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

// 1. Add mapModalTarget 'update_dest' handling
const targetStr1 = `        } else if (mapModalTarget && mapModalTarget.startsWith('waypoint_')) {`;
const replaceStr1 = `        } else if (mapModalTarget === 'update_dest') {
          setNewDestInput(event.data.address);
          setNewDestCoords({ lat: event.data.lat, lng: event.data.lng });
        } else if (mapModalTarget && mapModalTarget.startsWith('waypoint_')) {`;

content = content.replace(targetStr1, replaceStr1);

// 2. Add the map clickable div in the Update Destination form
const targetStr2 = `<div className="input-icon"><Navigation size={18} color="#f59e0b" /></div>
                  <input
                    type="text"
                    className="input-field with-icon"`;

const replaceStr2 = `<div className="input-icon"><Navigation size={18} color="#f59e0b" /></div>
                  <input
                    type="text"
                    className="input-field with-icon"
                    style={{ paddingRight: '70px' }}`;

content = content.replace(targetStr2, replaceStr2);

const targetStr3 = `                    required
                  />
                </div>`;

const replaceStr3 = `                    required
                  />
                  <div 
                    onClick={() => { setMapModalTarget('update_dest'); setShowMapModal(true); }}
                    style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', padding: '6px 10px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--secondary)', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', zIndex: 10 }}
                  >
                    <Map size={14} /> Map
                  </div>
                </div>`;

content = content.replace(targetStr3, replaceStr3);

fs.writeFileSync('src/pages/PassengerDashboard.jsx', content);
console.log('Added Map option to update destination');
