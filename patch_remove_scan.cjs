const fs = require('fs');
let content = fs.readFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', 'utf8');

const targetStr = `            {isOnline && (
              <div style={{ marginTop: '10px' }}>
                <Button 
                  variant="outline" 
                  style={{ width: '100%', borderColor: '#f59e0b', color: '#f59e0b', fontSize: '13px' }}
                  onClick={async () => {
                    try {
                      const currentEmail = localStorage.getItem('driverEmail');
                      const res = await fetch(\`\${API_BASE}/api/rides/nearby?email=\${encodeURIComponent(currentEmail)}\`);
                      const rides = await res.json();
                      if (rides.length > 0) {
                        alert(\`Found \${rides.length} passengers searching for a ride nearby!\\nClosest passenger is \${rides[0].distance} KM away.\\n(Incoming ride popup will trigger automatically for the nearest passenger)\`);
                      } else {
                        alert("No passengers are currently searching for a ride nearby.");
                      }
                    } catch (e) {
                      alert("Error scanning for nearby passengers.");
                    }
                  }}
                >
                  <Sparkles size={16} style={{ marginRight: '6px' }} /> Scan Nearest Passengers
                </Button>
              </div>
            )}`;

content = content.replace(targetStr, "");

fs.writeFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', content);
console.log('Removed Scan Nearest Passengers button');
