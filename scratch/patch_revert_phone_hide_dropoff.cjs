const fs = require('fs');

let driverContent = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// 1. Revert Call button back to just Chat button
const oldButtonsBlock = `                      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <Button 
                          variant="outline" 
                          onClick={() => { setShowDriverTripChat(true); fetchDriverTripChatMessages(); }}
                          style={{ flex: 1, borderColor: '#3b82f6', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          <MessageSquare size={16} /> Chat
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => window.location.href = \`tel:\${currentRide.passengerPhone || '0000000000'}\`}
                          style={{ flex: 1, borderColor: '#10b981', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          <Phone size={16} /> Call Passenger
                        </Button>
                      </div>`;

const newChatButton = `                      <Button 
                        variant="outline" 
                        onClick={() => { setShowDriverTripChat(true); fetchDriverTripChatMessages(); }}
                        style={{ width: '100%', marginBottom: '10px', borderColor: '#3b82f6', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <MessageSquare size={16} /> 💬 Chat with Passenger ({currentRide.passengerName || 'Passenger'})
                      </Button>`;

driverContent = driverContent.replace(oldButtonsBlock, newChatButton);
driverContent = driverContent.replace(oldButtonsBlock.replace(/\n/g, '\r\n'), newChatButton.replace(/\n/g, '\r\n'));

// 2. Hide dropoff location until accepted
const oldDropoff = `<div className="req-row"><Navigation size={16}/> <strong>Drop-off:</strong> {currentRide.dropoff}</div>`;
const newDropoff = `<div className="req-row"><Navigation size={16}/> <strong>Drop-off:</strong> {currentRide.status === 'Accepted' ? <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Hidden until PIN Verified</span> : currentRide.dropoff}</div>`;

driverContent = driverContent.replace(oldDropoff, newDropoff);
driverContent = driverContent.replace(oldDropoff.replace(/\n/g, '\r\n'), newDropoff.replace(/\n/g, '\r\n'));

// 3. Update the floating banner at the bottom
const oldBannerDest = `{\`Destination: \${currentRide.dropoff.split(',')[0]}\`}`;
const newBannerDest = `{currentRide.status === 'Accepted' ? '📍 Navigate to passenger pickup location' : \`Destination: \${currentRide.dropoff.split(',')[0]}\`}`;

driverContent = driverContent.replace(oldBannerDest, newBannerDest);

fs.writeFileSync('src/pages/DriverDashboard.jsx', driverContent, 'utf8');
console.log('Reverted call button and hid dropoff location until PIN verified.');
