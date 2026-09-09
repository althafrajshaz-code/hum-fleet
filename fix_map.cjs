const fs = require('fs');

function restoreMap(filename) {
  let code = fs.readFileSync(filename, 'utf8');
  const target = `<div className="dashboard-map animate-fade-in delay-100" style={{ padding: 0, overflow: 'hidden', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>`;
  
  if (!code.includes('<iframe') && code.includes(target)) {
    code = code.replace(target, target + '\n          <iframe id="map-iframe" src="/map.html" style={{ width: \'100%\', height: \'100%\', border: \'none\' }} title="Interactive Map" />');
    fs.writeFileSync(filename, code);
    console.log('Restored map in ' + filename);
  } else {
    console.log('Could not find target or iframe already exists in ' + filename);
  }
}

restoreMap('src/pages/PassengerDashboard.jsx');
restoreMap('src/pages/DriverDashboard.jsx');
