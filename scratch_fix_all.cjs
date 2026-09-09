const fs = require('fs');
let code = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// Fix 1: isProcessing definition
if (!code.includes('const [isProcessing')) {
    code = code.replace("const [loading, setLoading] = useState(true);", "const [loading, setLoading] = useState(true);\n  const [isProcessing, setIsProcessing] = useState(false);");
}

// Fix 2: liveGpsDistance initialization
code = code.replace(
`    // Set initial distance baseline from ride estimation
    if (liveGpsDistance === 0 && currentRide.totalKm) {
      setLiveGpsDistance(parseFloat(currentRide.totalKm) || 0);
    }`,
`    // Set initial distance baseline from ride estimation
    if (liveGpsDistance === 0 && currentRide.totalKm) {
      // FIXED: liveGpsDistance must start at 0 so it correctly tracks traveled distance
    }`
);

// Fix 3: Polling logic
code = code.replace(
`    // Check 7 KM threshold if we are on a trip
    if (currentRide) {
      const baseTotal = parseFloat(currentRide.totalKm || 8.0);`,
`    // Check 7 KM threshold if we are on a trip
    if (currentRide) {
      // Do not poll if the driver hasn't even picked up the passenger
      if (currentRide.status === 'Accepted' || currentRide.status === 'Arrived') return;

      const baseTotal = parseFloat(currentRide.totalKm || 8.0);`
);

// Fix 4: Taximeter labels
code = code.replace(
`                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Est. Distance</span>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                              {(liveGpsDistance > 0 ? liveGpsDistance : parseFloat(currentRide.totalKm || 8.0)).toFixed(2)}`,
`                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Current Distance</span>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                              {(liveGpsDistance > 0 ? liveGpsDistance : 0.00).toFixed(2)}`
);

code = code.replace(
`                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Est. Fare</span>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                              ₹{((liveGpsDistance > 0 ? liveGpsDistance : parseFloat(currentRide.totalKm || 8.0)) * parseFloat(driverDetails?.ratePerKm || 15.00) + (currentRide.isIntercity ? 250 : 0)).toFixed(2)}`,
`                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Current Fare</span>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                              ₹{((liveGpsDistance > 0 ? liveGpsDistance : 0.00) * parseFloat(driverDetails?.ratePerKm || 15.00) + (currentRide.isIntercity ? 250 : 0)).toFixed(2)}`
);

// Fix 5: isProcessing in I Have Arrived button
code = code.replace(
`                          <button 
                            disabled={isProcessing}
                            onClick={async () => {
                              try {
                                const res = await fetch(\`\${API_BASE}/api/rides/\${currentRide.id}/arrive\`, { method: 'POST' });
                                if (res.ok) {
                                  const data = await res.json();
                                  setCurrentRide(data);
                                }
                              } catch (e) {
                                console.error('Failed to notify arrival:', e);
                              }
                              setTimeout(() => {
                                const pinInput = document.getElementById('pin-input-section');
                                pinInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                pinInput?.focus();
                              }, 150);
                            }}`,
`                          <button 
                            disabled={isProcessing}
                            onClick={async () => {
                              setIsProcessing(true);
                              try {
                                const res = await fetch(\`\${API_BASE}/api/rides/\${currentRide.id}/arrive\`, { method: 'POST' });
                                if (res.ok) {
                                  const data = await res.json();
                                  setCurrentRide(data);
                                }
                              } catch (e) {
                                console.error('Failed to notify arrival:', e);
                              } finally {
                                setIsProcessing(false);
                              }
                              setTimeout(() => {
                                const pinInput = document.getElementById('pin-input-section');
                                pinInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                pinInput?.focus();
                              }, 150);
                            }}`
);


// Fix 6: Duplicate UI and active-ride-card conditions
// Find the active-ride-card start:
code = code.replace(
`              {/* Active ride in progress block */}
              {isOnline && currentRide && !showRating && (
                <div id="active-ride-card" className="incoming-request animate-fade-in delay-100" style={{ background: 'rgba(59, 130, 246, 0.08)', borderColor: '#3b82f6' }}>
                  {showEndTripSummary ? (`,
`              {/* Active ride in progress block */}
              {isOnline && currentRide && !showRating && (currentRide.status === 'In Progress' || showEndTripSummary) && (
                <div id="active-ride-card" className="incoming-request animate-fade-in delay-100" style={{ background: 'rgba(59, 130, 246, 0.08)', borderColor: '#3b82f6' }}>
                  {showEndTripSummary ? (`
);

// Remove the duplicate TopControls block (from ") : (currentRide.status === 'Accepted'" up to ") : (")
// We will use string manipulation to remove this block.
const startStr = "                  ) : (currentRide.status === 'Accepted' || currentRide.status === 'Arrived') ? (";
const endStr = "                  ) : (\n                    <>\n                      <h3 style={{ color: '#3b82f6' }}>Trip in Progress</h3>";

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    code = code.substring(0, startIndex) + "                  ) : currentRide.status === 'In Progress' ? (\n                    <>\n                      <h3 style={{ color: '#3b82f6' }}>Trip in Progress</h3>" + code.substring(endIndex + endStr.length);
}

fs.writeFileSync('src/pages/DriverDashboard.jsx', code);
console.log('Fixed DriverDashboard.jsx');
