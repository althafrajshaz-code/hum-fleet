const fs = require('fs');
const path = 'd:\\Althaf\\hum\\src\\pages\\DriverDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

const target = `      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          await fetch(\`\${API_BASE}/api/drivers/location\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, lat: position.coords.latitude, lng: position.coords.longitude, isOnline: true })
          });
        } catch (err) {
          console.error('Error updating location:', err);
        }
      });`;

const replacement = `      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          await fetch(\`\${API_BASE}/api/drivers/location\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, lat: position.coords.latitude, lng: position.coords.longitude, isOnline: true })
          });
        } catch (err) {
          console.error('Error updating location:', err);
        }
      }, async (error) => {
        console.warn('Geolocation blocked or failed. Going online anyway.', error);
        try {
          await fetch(\`\${API_BASE}/api/drivers/location\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, isOnline: true })
          });
        } catch (err) {}
      }, { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 });`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Fixed goOnline geolocation callback.');
} else {
  console.log('Target string not found.');
}
