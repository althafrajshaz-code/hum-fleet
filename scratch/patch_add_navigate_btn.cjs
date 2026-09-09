const fs = require('fs');

let driverContent = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

const oldChatButton = `                      <Button 
                        variant="outline" 
                        onClick={() => { setShowDriverTripChat(true); fetchDriverTripChatMessages(); }}
                        style={{ width: '100%', marginBottom: '10px', borderColor: '#3b82f6', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <MessageSquare size={16} /> 💬 Chat with Passenger ({currentRide.passengerName || 'Passenger'})
                      </Button>`;

const newButtons = `                      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
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
                      </div>`;

driverContent = driverContent.replace(oldChatButton, newButtons);
driverContent = driverContent.replace(oldChatButton.replace(/\n/g, '\r\n'), newButtons.replace(/\n/g, '\r\n'));

fs.writeFileSync('src/pages/DriverDashboard.jsx', driverContent, 'utf8');
console.log('Successfully added external Navigate button.');
