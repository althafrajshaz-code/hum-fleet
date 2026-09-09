const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

// 1. Remove background map iframe
const mapIframeStr = `<iframe \r
            id="map-iframe"\r
            src="/map.html" \r
            style={{ width: '100%', height: '100%', border: 'none' }}\r
            title="Interactive Map"\r
          />`;
const mapIframeStr2 = `<iframe 
            id="map-iframe"
            src="/map.html" 
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Interactive Map"
          />`;
// Instead of exact string, use regex to remove map-iframe
code = code.replace(/<iframe\s*id="map-iframe"[\s\S]*?\/>/g, '');

// 2. Remove "Locate me" button which is absolute positioned at bottom
code = code.replace(/<div style={{ position: 'absolute', bottom: '30px', right: '20px'[\s\S]*?<\/div>/g, '');

// 3. Fix scroll by removing max-height/overflow from sidebar inline styles or classes if needed, 
// but wait, is the sidebar positioned absolutely? Let's just remove className="dashboard-map" and absolute positioning.
code = code.replace(/className="dashboard-sidebar"/g, 'className="dashboard-sidebar passenger-scroll-fix" style={{ position: "relative", width: "100%", maxWidth: "100%", top: "0", left: "0", maxHeight: "none", overflowY: "visible" }}');
// And make dashboard-page scrollable
code = code.replace(/className="dashboard-page"/g, 'className="dashboard-page" style={{ overflowY: "auto", minHeight: "100vh" }}');

fs.writeFileSync('src/pages/PassengerDashboard.jsx', code);
console.log('Removed background map, locate me button, and fixed scrolling.');
