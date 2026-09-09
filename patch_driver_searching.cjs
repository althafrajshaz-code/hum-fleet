const fs = require('fs');
let content = fs.readFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', 'utf8');

const targetStr = `            {isOnline && (
              <div style={{ marginTop: '10px' }}>
                <Button 
                  variant="outline" `;

const replaceStr = `            {isOnline && !currentRide && !isPaused && (
              <div style={{ marginTop: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)' }}>
                <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2.5px solid #10b981', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', display: 'inline-block' }} />
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#10b981', letterSpacing: '0.5px' }}>SEARCHING FOR RIDES...</span>
              </div>
            )}

            {isOnline && (
              <div style={{ marginTop: '10px' }}>
                <Button 
                  variant="outline" `;

content = content.replace(targetStr, replaceStr);

fs.writeFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', content);
console.log('Added searching for rides indicator');
