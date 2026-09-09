const fs = require('fs');
const path = 'd:\\Althaf\\hum\\src\\pages\\DriverDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

const targetMap = `        <div className="dashboard-map glass-card animate-fade-in delay-100" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
          <iframe 
            id="driver-map-iframe"
            src="/map.html" 
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: '18px' }}
            title="Interactive Map"
          />`;

const replacementMap = `        <div className="dashboard-map glass-card animate-fade-in delay-100" style={{ padding: 0, overflow: 'hidden', position: 'relative', background: '#0b0f17' }}>
          <img 
            src="/hum_fleet_official_logo.jpg" 
            alt="HUM Fleet Captain"
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '20px', filter: 'drop-shadow(0 0 30px rgba(16, 185, 129, 0.2))' }} 
          />`;

if (content.includes(targetMap)) {
  content = content.replace(targetMap, replacementMap);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Replaced map iframe with driver captain image.');
} else {
  console.log('Target string not found.');
}
