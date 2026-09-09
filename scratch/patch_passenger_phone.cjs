const fs = require('fs');

// --- SERVER PATCH ---
let serverContent = fs.readFileSync('server/index.js', 'utf8');

// Add passengerPhone extraction
serverContent = serverContent.replace(
  "const passengerRating = passenger ? passenger.rating : 5.0;",
  "const passengerRating = passenger ? passenger.rating : 5.0;\n  const passengerPhone = passenger ? passenger.phone : 'Not provided';"
);

// Add passengerPhone to ride object
serverContent = serverContent.replace(
  "passengerEmail: passengerEmail || 'anoop.nair@gmail.com',",
  "passengerEmail: passengerEmail || 'anoop.nair@gmail.com',\n    passengerPhone,"
);

fs.writeFileSync('server/index.js', serverContent, 'utf8');

// --- CLIENT PATCH ---
let driverContent = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// Add Phone import
driverContent = driverContent.replace(
  "TrendingUp, Gauge, Compass, Activity, Sparkles, Settings, CreditCard, User, ChevronRight, Eye, EyeOff } from 'lucide-react';",
  "TrendingUp, Gauge, Compass, Activity, Sparkles, Settings, CreditCard, User, ChevronRight, Eye, EyeOff, Phone } from 'lucide-react';"
);

// Modify the Chat button block
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
                          onClick={() => window.location.href = \`tel:\${currentRide.passengerPhone || '0000000000'}\`}
                          style={{ flex: 1, borderColor: '#10b981', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          <Phone size={16} /> Call Passenger
                        </Button>
                      </div>`;

driverContent = driverContent.replace(oldChatButton, newButtons);
driverContent = driverContent.replace(oldChatButton.replace(/\n/g, '\r\n'), newButtons.replace(/\n/g, '\r\n'));

fs.writeFileSync('src/pages/DriverDashboard.jsx', driverContent, 'utf8');

console.log('Successfully patched server and driver UI to show passenger phone and call button.');
