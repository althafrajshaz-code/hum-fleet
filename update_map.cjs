const fs = require('fs');
const path = 'd:\\Althaf\\hum\\src\\pages\\DriverDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove the entire dashboard-map block
const mapBlockRegex = /<div className="dashboard-map[^>]*>[\s\S]*?(?:<img[^>]*>|<iframe[^>]*>)[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/;

// Let's just use string replacement since regex over multiple lines might be risky
let startIdx = content.indexOf('<div className="dashboard-map');
if (startIdx !== -1) {
  // Find the end of dashboard-map block.
  // It is the last block inside `dashboard-container`.
  // The layout is:
  // <div className="dashboard-map ...
  //   ... (including the isOnline destination block)
  // </div>
  // </div> // ends dashboard-container
  
  let endIdx = content.indexOf('{/* Hidden Canvas for Selfie Capture */}');
  if (endIdx !== -1) {
    let beforeMap = content.substring(0, startIdx);
    let afterMap = content.substring(endIdx);
    
    // We need to keep the closing </div> for dashboard-container that is right before `{/* Hidden Canvas`
    content = beforeMap + '\n      </div>\n\n      ' + afterMap;
    console.log('Removed dashboard-map block.');
  }
}

// 2. Insert the hero image at the top of dashboard-sidebar
const targetSidebar = `<div className="dashboard-sidebar glass-card" style={{ zIndex: 10 }}>`;
const heroImage = `<div className="dashboard-sidebar glass-card" style={{ zIndex: 10 }}>
          {/* DRIVER CAPTAIN HERO IMAGE */}
          <div style={{ width: '100%', height: '160px', overflow: 'hidden', borderRadius: '16px', marginBottom: '16px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
            <img src="/hum_fleet_official_logo.jpg" alt="HUM Captain" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }} />
          </div>`;

if (content.includes(targetSidebar)) {
  content = content.replace(targetSidebar, heroImage);
  console.log('Injected hero image.');
}

// 3. Re-add the Destination badge since we deleted it with dashboard-map
// We can add it right below the "Searching for rides..." or Go Online button.
const searchingBlock = `              <div style={{ marginTop: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)' }}>
                <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2.5px solid #10b981', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', display: 'inline-block' }} />
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#10b981', letterSpacing: '0.5px' }}>SEARCHING FOR RIDES...</span>
              </div>
            )}`;

const searchAndDestBlock = `              <div style={{ marginTop: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)' }}>
                <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2.5px solid #10b981', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', display: 'inline-block' }} />
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#10b981', letterSpacing: '0.5px' }}>SEARCHING FOR RIDES...</span>
              </div>
            )}
            
            {isOnline && (
              <div style={{ marginTop: '12px', background: 'rgba(24, 24, 27, 0.9)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', color: 'white', fontSize: '13px', fontWeight: '600', textAlign: 'center' }}>
                {currentRide ? \`Destination: \${currentRide.dropoff.split(',')[0]}\` : 'Waiting for Incoming Rides under 8.0 KM...'}
              </div>
            )}`;

if (content.includes(searchingBlock) && !content.includes('Waiting for Incoming Rides under 8.0 KM...')) {
  content = content.replace(searchingBlock, searchAndDestBlock);
  console.log('Restored destination badge.');
}

fs.writeFileSync(path, content, 'utf8');
