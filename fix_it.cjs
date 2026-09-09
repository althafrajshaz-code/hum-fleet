const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

const target = `<div className="dashboard-map animate-fade-in delay-100" style={{ padding: 0, overflow: 'hidden', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
          <iframe id="map-iframe" src="/map.html" style={{ width: '100%', height: '100%', border: 'none' }} title="Interactive Map" />`;

code = code.replace(target, '');

// Also remove the closing div for dashboard-map. But wait, there was a lot of stuff inside it!
// Ah, the Vehicle Arriving banner was inside it!
// Let's just restore from the commit `225a7e6`!
