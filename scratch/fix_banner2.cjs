const fs = require('fs');
let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// 1. Fix the missing `</>)}` before the map
content = content.replace(/(\s+)<\/div>(\s+)<div className="dashboard-map/, '$1</>)}$1</div>$2<div className="dashboard-map');

// 2. Fix the Waiting Banner regex properly
// Find the exact block starting with `{(isOnline) && (` and ending with `Waiting for Incoming Rides under 8.0 KM...`
const oldBanner = `          {(isOnline) && (
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              background: 'rgba(24, 24, 27, 0.9)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '12px 24px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(8px)',
              pointerEvents: 'none',
              textAlign: 'center',
              whiteSpace: 'nowrap'
            }}>
              {currentRide ? \`Destination: \${currentRide.dropoff.split(',')[0]}\` : 'Waiting for Incoming Rides under 8.0 KM...'}
            </div>
          )}`;

const newBanner = `          {(isOnline && currentRide) && (
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              background: 'rgba(24, 24, 27, 0.9)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '12px 24px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(8px)',
              pointerEvents: 'none',
              textAlign: 'center',
              whiteSpace: 'nowrap'
            }}>
              {\`Destination: \${currentRide.dropoff.split(',')[0]}\`}
            </div>
          )}`;

content = content.replace(oldBanner, newBanner);
content = content.replace(oldBanner.replace(/\n/g, '\r\n'), newBanner.replace(/\n/g, '\r\n'));

fs.writeFileSync('src/pages/DriverDashboard.jsx', content, 'utf8');
console.log('Fixed syntax and removed banner!');
