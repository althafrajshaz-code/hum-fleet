const fs = require('fs');

let content = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

const target = `                    onBlur={() => setTimeout(() => setNewDestFocused(false), 250)}
                    required
                  />
                </div>`;

const replace = `                    onBlur={() => setTimeout(() => setNewDestFocused(false), 250)}
                    required
                    style={{ paddingRight: '80px' }}
                  />
                  <div 
                    onClick={() => { setMapModalTarget('update_dest'); setShowMapModal(true); }}
                    style={{ position: 'absolute', right: '6px', top: '50%', marginTop: '5px', transform: 'translateY(-50%)', padding: '6px 10px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--secondary)', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', zIndex: 10 }}
                  >
                    <Map size={14} /> Map
                  </div>
                </div>`;

content = content.replace(target, replace);
fs.writeFileSync('src/pages/PassengerDashboard.jsx', content);
console.log('Fixed button placement');
