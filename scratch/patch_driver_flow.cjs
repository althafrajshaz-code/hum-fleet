const fs = require('fs');

let driverContent = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// 1. Add state variable
if (!driverContent.includes('const [driverTripStage, setDriverTripStage]')) {
  driverContent = driverContent.replace(
    "const [settingsSubTab, setSettingsSubTab] = useState('profile');",
    "const [settingsSubTab, setSettingsSubTab] = useState('profile');\n  const [driverTripStage, setDriverTripStage] = useState('navigate_pickup');"
  );
}

// 2. Add effect to reset state
if (!driverContent.includes('setDriverTripStage(\'navigate_pickup\')')) {
  const effectCode = `  useEffect(() => {
    if (currentRide) {
      if (currentRide.status === 'Accepted') {
         if (!['navigate_pickup', 'arrived', 'enter_pin'].includes(driverTripStage)) {
            setDriverTripStage('navigate_pickup');
         }
      } else {
         setDriverTripStage('navigate_pickup');
      }
    }
  }, [currentRide?.status]);\n\n`;
  driverContent = driverContent.replace(
    "useEffect(() => {",
    effectCode + "  useEffect(() => {"
  );
}

// 3. Replace the PIN section and buttons section
// I will use regex to replace everything inside currentRide panel
const panelRegex = /\{\s*\/\*\s*Driver Trip Window\s*\*\/\s*\}([\s\S]*?)<div\s+className="request-details">([\s\S]*?)<\/div>\s*<div\s+style=\{\{\s*display:\s*'flex',\s*gap:\s*'10px',\s*marginBottom:\s*'10px'\s*\}\}>([\s\S]*?)<\/div>\s*<div\s+style=\{\{\s*display:\s*'flex',\s*gap:\s*'12px'\s*\}\}>([\s\S]*?)<\/div>\s*<\/>\s*\)\}\s*<\/div>\s*\)\}/m;

// Wait, the panel currently has:
// {currentRide.status === 'Accepted' ? (
//    <div className="pin-verification-section" ...>
// ) : (
//    <>
//      <h3 ...>Trip in Progress</h3>
//      ...
//      <div className="request-details">...</div>
//      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>...</div>
//      <div style={{ display: 'flex', gap: '12px' }}>...</div>
//    </>
// )}

const searchBlock = `                  ) : currentRide.status === 'Accepted' ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <h3 style={{ color: '#3b82f6', marginBottom: '16px' }}>Verify Passenger to Start Trip</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                        Ask the passenger ({currentRide.passengerName || 'Passenger'}) for their 6-digit Ride PIN to verify their identity and start the trip.
                      </p>
                      <input 
                        type="text" 
                        value={ridePin} 
                        onChange={(e) => setRidePin(e.target.value.replace(/\\D/g, '').slice(0, 6))}
                        placeholder="Enter 6-digit PIN" 
                        style={{ fontSize: '20px', letterSpacing: '4px', textAlign: 'center', width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #3b82f6', background: 'transparent', color: 'var(--text-main)', marginBottom: '16px' }}
                      />
                      <Button variant="primary" className="full-width" onClick={handleVerifyPin} style={{ background: '#3b82f6', color: 'white' }} disabled={ridePin.length !== 6}>
                        Verify & Start Trip
                      </Button>
                    </div>
                  ) : (`;

const replaceBlock = `                  ) : (`;

// Remove the old PIN verification block
driverContent = driverContent.replace(searchBlock, replaceBlock);
// In case of \r\n differences
driverContent = driverContent.replace(searchBlock.replace(/\n/g, '\r\n'), replaceBlock);

// Now, replace the action buttons
const oldButtons = `                      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <Button 
                          variant="outline" 
                          onClick={() => { setShowDriverTripChat(true); fetchDriverTripChatMessages(); }}
                          style={{ flex: 1, borderColor: '#3b82f6', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          <MessageSquare size={16} /> Chat
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            const dest = currentRide.status === 'Accepted' ? currentRide.pickupCoords : currentRide.dropoffCoords;
                            if (dest && dest.lat) {
                              window.open(\`https://www.google.com/maps/dir/?api=1&destination=\${dest.lat},\${dest.lng}\`, '_system');
                            } else {
                              alert('Location coordinates not available for navigation.');
                            }
                          }}
                          style={{ flex: 1, borderColor: '#8b5cf6', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          <Navigation size={16} /> Navigate
                        </Button>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <Button variant="outline" className="full-width" onClick={handleCancelRide} style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                          Cancel Ride
                        </Button>
                        <Button variant="primary" className="full-width" onClick={() => setShowEndTripSummary(true)} style={{ background: '#3b82f6', color: 'white' }}>
                          Complete Ride
                        </Button>
                      </div>`;

const newButtons = `                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                        {currentRide.status === 'Accepted' && driverTripStage === 'navigate_pickup' && (
                          <Button variant="primary" className="full-width" style={{ background: '#3b82f6', color: 'white', padding: '14px', fontSize: '14px', fontWeight: 'bold' }} onClick={() => {
                            const dest = currentRide.pickupCoords;
                            if (dest && dest.lat) {
                              window.open(\`https://www.google.com/maps/dir/?api=1&destination=\${dest.lat},\${dest.lng}\`, '_system');
                            }
                            setDriverTripStage('arrived');
                          }}>
                            <Navigation size={18} style={{ marginRight: '6px' }} /> NAVIGATE TO PASSENGER PICKUP LOCATION
                          </Button>
                        )}

                        {currentRide.status === 'Accepted' && driverTripStage === 'arrived' && (
                          <Button variant="primary" className="full-width" style={{ background: '#10b981', color: 'white', padding: '14px', fontSize: '14px', fontWeight: 'bold' }} onClick={() => {
                            setDriverTripStage('enter_pin');
                          }}>
                            <MapPin size={18} style={{ marginRight: '6px' }} /> ARRIVED AT PICKUP LOCATION
                          </Button>
                        )}

                        {currentRide.status === 'Accepted' && driverTripStage === 'enter_pin' && (
                          <div style={{ border: '2px dashed #3b82f6', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                            <h4 style={{ color: '#3b82f6', margin: '0 0 12px 0' }}>ENTER PIN NUMBER</h4>
                            <input 
                              type="text" 
                              value={ridePin} 
                              onChange={(e) => setRidePin(e.target.value.replace(/\\D/g, '').slice(0, 6))}
                              placeholder="6-digit PIN" 
                              style={{ fontSize: '24px', letterSpacing: '8px', textAlign: 'center', width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #3b82f6', background: 'rgba(0,0,0,0.2)', color: 'white', marginBottom: '16px' }}
                            />
                            <Button variant="primary" className="full-width" onClick={handleVerifyPin} style={{ background: '#3b82f6', color: 'white' }} disabled={ridePin.length !== 6}>
                              Verify & Start Trip
                            </Button>
                          </div>
                        )}

                        {currentRide.status === 'In Progress' && (
                          <Button variant="primary" className="full-width" onClick={() => setShowEndTripSummary(true)} style={{ background: '#ef4444', color: 'white', padding: '14px', fontSize: '14px', fontWeight: 'bold' }}>
                            <CheckCircle size={18} style={{ marginRight: '6px' }} /> END TRIP
                          </Button>
                        )}

                        <div style={{ display: 'flex', gap: '10px' }}>
                          <Button variant="outline" onClick={() => { setShowDriverTripChat(true); fetchDriverTripChatMessages(); }} style={{ flex: 1, borderColor: '#3b82f6', color: '#3b82f6' }}>
                            <MessageSquare size={16} style={{ marginRight: '6px' }} /> Chat
                          </Button>
                          {currentRide.status === 'In Progress' && (
                            <Button variant="outline" onClick={() => {
                                const dest = currentRide.dropoffCoords;
                                if (dest && dest.lat) {
                                  window.open(\`https://www.google.com/maps/dir/?api=1&destination=\${dest.lat},\${dest.lng}\`, '_system');
                                }
                            }} style={{ flex: 1, borderColor: '#8b5cf6', color: '#8b5cf6' }}>
                              <Navigation size={16} style={{ marginRight: '6px' }} /> Navigate
                            </Button>
                          )}
                          <Button variant="outline" onClick={handleCancelRide} style={{ flex: 1, borderColor: '#ef4444', color: '#ef4444' }}>
                            Cancel
                          </Button>
                        </div>
                      </div>`;

driverContent = driverContent.replace(oldButtons, newButtons);
driverContent = driverContent.replace(oldButtons.replace(/\n/g, '\r\n'), newButtons.replace(/\n/g, '\r\n'));

// Remove Trip in Progress header logic if we want to show it dynamically, but currently it says:
// <h3 style={{ color: '#3b82f6' }}>Trip in Progress</h3>
// We should change it to show based on status
driverContent = driverContent.replace(
  `<h3 style={{ color: '#3b82f6' }}>Trip in Progress</h3>`,
  `<h3 style={{ color: '#3b82f6', marginBottom: '12px' }}>{currentRide.status === 'Accepted' ? 'Passenger Pickup' : 'Trip in Progress'}</h3>`
);


fs.writeFileSync('src/pages/DriverDashboard.jsx', driverContent, 'utf8');
console.log('Driver button flow updated successfully');
