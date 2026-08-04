const fs = require('fs');

function patchDriver() {
  const file = 'src/pages/DriverDashboard.jsx';
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/import \{ io \} from 'socket\.io-client';/g, '// import { io } from "socket.io-client";');
  code = code.replace(/const socketRef = useRef\(null\);/g, '// const socketRef = useRef(null);');
  code = code.replace(/socketRef\.current = io\(API_BASE\);/g, '// socketRef.current = null;');
  code = code.replace(/if \(socketRef\.current\) socketRef\.current\.disconnect\(\);/g, '// disconnect');
  code = code.replace(/if \(currentRide && socketRef\.current\) \{[\s\S]*?\}/g, '// Socket removed');
  fs.writeFileSync(file, code);
  console.log('Patched DriverDashboard');
}

function patchPassenger() {
  const file = 'src/pages/PassengerDashboard.jsx';
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/import \{ io \} from 'socket\.io-client';/g, '// import { io } from "socket.io-client";');
  
  const pollingCode = `      // HTTP Polling instead of Socket.io
      const pollInterval = setInterval(async () => {
        try {
          const res = await fetch(\`\${API_BASE}/api/rides/\${activeRide.id}/location\`);
          const data = await res.json();
          if (data && data.lat) {
            setDriverLocation({ lat: data.lat, lng: data.lng, bearing: data.bearing || 0 });
          }
        } catch (e) {}
      }, 3000);
      return () => clearInterval(pollInterval);`;

  code = code.replace(/socket = io\(API_BASE\);[\s\S]*?socket\.on\('location_update', \(data\) => \{[\s\S]*?\}\);/m, pollingCode);
  code = code.replace(/let socket;/g, '// let socket;');
  code = code.replace(/if \(socket\) socket\.disconnect\(\);/g, '// disconnect');
  fs.writeFileSync(file, code);
  console.log('Patched PassengerDashboard');
}

function patchPublic() {
  const file = 'src/pages/PublicTracking.jsx';
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/import \{ io \} from 'socket\.io-client';/g, '// import { io } from "socket.io-client";');
  
  const pollingCode = `      // HTTP Polling
      const pollInterval = setInterval(async () => {
        try {
          const res = await fetch(\`\${API_BASE}/api/rides/\${rideData.id}/location\`);
          const data = await res.json();
          if (data && data.lat) {
            setDriverLocation({ lat: data.lat, lng: data.lng, bearing: data.bearing || 0 });
          }
        } catch (e) {}
      }, 3000);
      return () => clearInterval(pollInterval);`;

  code = code.replace(/socketRef\.current = io\(API_BASE\);[\s\S]*?socketRef\.current\.on\('location_update', \(data\) => \{[\s\S]*?\}\);/m, pollingCode);
  code = code.replace(/const socketRef = useRef\(null\);/g, '// const socketRef = useRef(null);');
  code = code.replace(/if \(socketRef\.current\) socketRef\.current\.disconnect\(\);/g, '// disconnect');
  fs.writeFileSync(file, code);
  console.log('Patched PublicTracking');
}

patchDriver();
patchPassenger();
patchPublic();
