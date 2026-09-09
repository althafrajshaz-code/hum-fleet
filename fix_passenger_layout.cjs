const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

// The dashboard-map is currently:
// <div className="dashboard-map animate-fade-in delay-100" style={{ padding: 0, overflow: 'hidden', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
// It's placed after <div className="dashboard-sidebar glass-card" style={{ zIndex: 10 }}>

code = code.replace(
  /<div className="dashboard-map animate-fade-in delay-100".*?<\/div>/s,
  ''
);

// We should put it back where it was before, maybe next to the sidebar?
// But wait, the user said "THE CHOOSE FROM MAP AND ITS SEARCH BUTTON".
// We couldn't find "Choose from map" anywhere in the code.
