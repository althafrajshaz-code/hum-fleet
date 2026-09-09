const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

// The Ride History starts around:
// <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '15px', padding: '20px', border: '1px solid var(--border)' }}>
//   <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
//     <Clock size={20} color="var(--primary)" />
//     <h3 style={{ fontSize: '18px', margin: '0 0 15px 0' }}>Ride History</h3>

const historyRegex = /<div style={{ background: 'rgba\(255,255,255,0\.03\)', borderRadius: '15px', padding: '20px', border: '1px solid var\(--border\)' }}>\s*<div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>\s*<Clock size=\{20\} color="var\(--primary\)" \/>\s*<h3 style={{ fontSize: '18px', margin: '0 0 15px 0' }}>Ride History<\/h3>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;

// Wait, doing this via regex might be tricky if there are nested divs. 
// Let's find the exact string indices.
const h3Index = code.indexOf('Ride History</h3>');
if (h3Index !== -1) {
  // Find the opening div of this section
  let startIdx = code.lastIndexOf("<div style={{ background: 'rgba(255,255,255,0.03)'", h3Index);
  
  // Find the end of this block
  // We know it ends with:
  //         </div>
  //       )}
  //     </div>
  //   );
  // };
  // Let's just find the text "No past rides found.</p>" and its closing divs.
  
  // A simpler way: we'll replace everything from startIdx until the end of the history block
  const endMarker = "No past rides found.</p>\r\n              </div>\r\n            ) : (\r\n              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>\r\n                {rideHistoryData.map(ride => (\r\n                  <div key={ride.id} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', background: 'rgba(255,255,255,0.02)' }}>\r\n                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>\r\n                      <span style={{ fontWeight: 'bold' }}>{ride.date}</span>\r\n                      <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>₹{ride.fare}</span>\r\n                    </div>\r\n                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>\r\n                      <MapPin size={14} />\r\n                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ride.dropoff}</span>\r\n                    </div>\r\n                  </div>\r\n                ))}\r\n              </div>\r\n            )}\r\n          </div>";
  
  const endIdx = code.indexOf(endMarker);
  
  if (startIdx !== -1 && endIdx !== -1) {
    const chunkToRemove = code.substring(startIdx, endIdx + endMarker.length);
    code = code.replace(chunkToRemove, '');
    fs.writeFileSync('src/pages/PassengerDashboard.jsx', code);
    console.log("Removed Ride History section");
  } else {
    console.log("Could not find end marker");
  }
} else {
  console.log("Could not find Ride History");
}
