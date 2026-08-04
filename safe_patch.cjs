const fs = require('fs');

function mockIO(file) {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');
  // Replace import with a dummy io function
  code = code.replace(/import \{ io \} from 'socket\.io-client';/g, 'const io = () => ({ on: () => {}, emit: () => {}, disconnect: () => {} });');
  fs.writeFileSync(file, code);
}

function injectPollingPassenger() {
  const file = 'src/pages/PassengerDashboard.jsx';
  let code = fs.readFileSync(file, 'utf8');
  
  const pollingBlock = `      // Polling
      const pollInterval = setInterval(async () => {
        try {
          const res = await fetch(\`\${API_BASE}/api/rides/\${activeRide.id}/location\`);
          const data = await res.json();
          if (data && data.lat) {
            setDriverLocation({ lat: data.lat, lng: data.lng, bearing: data.bearing || 0 });
            const mapIframe = document.getElementById('map-iframe');
            if (mapIframe && mapIframe.contentWindow) {
              mapIframe.contentWindow.postMessage({ type: 'UPDATE_CAR_LOCATION', lat: parseFloat(data.lat), lng: parseFloat(data.lng) }, '*');
            }
          }
        } catch (e) {}
      }, 3000);
      
      socket = io(API_BASE);`;
      
  code = code.replace(/socket = io\(API_BASE\);/g, pollingBlock);
  code = code.replace(/if \(socket\) socket\.disconnect\(\);/g, 'if (socket) socket.disconnect(); clearInterval(pollInterval);');
  
  fs.writeFileSync(file, code);
}

mockIO('src/pages/DriverDashboard.jsx');
mockIO('src/pages/PassengerDashboard.jsx');
injectPollingPassenger();
console.log('Safe patch applied!');
