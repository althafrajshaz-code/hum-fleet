const fs = require('fs');
let content = fs.readFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', 'utf8');

const oldSearching = `{/* RADAR ANIMATION COMPONENT */}
                <div style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(16,185,129,0.3)' }}>
                  {/* Radar Sweep */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', width: '50%', height: '50%', background: 'conic-gradient(from 0deg, transparent 70%, rgba(16,185,129,0.8) 100%)', transformOrigin: '0% 0%', animation: 'radar-sweep 2s linear infinite' }}></div>
                  
                  {/* Sonar Ripples */}
                  <div style={{ position: 'absolute', width: '100%', height: '100%', border: '2px solid rgba(16,185,129,0.6)', borderRadius: '50%', animation: 'sonar-ripple 2s ease-out infinite' }}></div>
                  <div style={{ position: 'absolute', width: '100%', height: '100%', border: '2px solid rgba(16,185,129,0.4)', borderRadius: '50%', animation: 'sonar-ripple 2s ease-out infinite 1s' }}></div>

                  {/* Center Dot */}
                  <div style={{ position: 'absolute', width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></div>
                </div>`;

content = content.replace(oldSearching, "");

fs.writeFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', content);
console.log('Removed radar animation circle');
