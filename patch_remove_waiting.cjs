const fs = require('fs');
let content = fs.readFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', 'utf8');

const targetStr = `          {(isOnline) && (
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
              {currentRide ? \`Destination: \${currentRide.dropoff.split(',')[0]}\` : 'Waiting for Nearby Incoming Rides...'}
            </div>
          )}`;

const replaceStr = `          {(isOnline && currentRide) && (
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

content = content.replace(targetStr, replaceStr);

fs.writeFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', content);
console.log('Removed waiting for nearby rides banner');
