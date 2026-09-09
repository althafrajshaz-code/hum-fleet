const fs = require('fs');

let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

let oldBlock = `                      <div className="request-details">
                        <div className="req-row"><MapPin size={16}/> <strong>Pickup:</strong> {currentRide.pickup}</div>
                        <div className="req-row"><Navigation size={16}/> <strong>Drop-off:</strong> {['Accepted', 'Arrived'].includes(currentRide.status) ? <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Hidden until PIN Verified</span> : currentRide.dropoff}</div>
                        
                        <div style={{ borderTop: '1px solid rgba(59, 130, 246, 0.2)', marginTop: '8px', paddingTop: '8px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div><strong>Estimated Distance:</strong> {currentRide.totalKm || 8.0} KM</div>
                          </div>
  
                          <div style={{ borderTop: '1px dashed var(--border)', marginTop: '8px', paddingTop: '8px', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '15px' }}>
                            <span>TRIP FARE:</span>
                            <span>INR {(parseFloat(currentRide.fare) + parseFloat(currentRide.driverTip || 0)).toFixed(2)}</span>
                          </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <Button variant="outline" style={{ flex: 1 }} onClick={() => alert(\`Calling passenger at \${currentRide.passengerPhone || '+91 XXXX'}...\`)}>
                          <Phone size={16} /> Call
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            const dest = ['Accepted', 'Arrived'].includes(currentRide.status) ? currentRide.pickupCoords : currentRide.dropoffCoords;
                            const label = ['Accepted', 'Arrived'].includes(currentRide.status) ? currentRide.pickup : currentRide.dropoff;
                            if (dest && dest.lat) {
                              window.open(\`https://www.google.com/maps/dir/?api=1&destination=\${dest.lat},\${dest.lng}&travelmode=driving\`, '_blank');
                            } else if (label) {
                              window.open(\`https://www.google.com/maps/dir/?api=1&destination=\${encodeURIComponent(label)}&travelmode=driving\`, '_blank');
                            } else {
                              alert('Location coordinates not available for navigation.');
                            }
                          }}
                          style={{ flex: 1, borderColor: '#8b5cf6', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          <Navigation size={16} /> {['Accepted', 'Arrived'].includes(currentRide.status) ? 'To Pickup' : 'To Dropoff'}
                        </Button>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <Button variant="outline" className="full-width" onClick={handleCancelRide} style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                          Cancel Ride
                        </Button>
                        <Button variant="primary" className="full-width" onClick={() => setShowEndTripSummary(true)} style={{ background: '#3b82f6', color: 'white', padding: '18px', fontSize: '18px', fontWeight: '900', borderRadius: '12px', boxShadow: '0 4px 15px rgba(59,130,246,0.3)' }}>
                          COMPLETE RIDE
                        </Button>
                      </div>`;

let newBlock = `                      <div className="request-details">
                        <div className="req-row"><Navigation size={16}/> <strong>Drop-off:</strong> {['Accepted', 'Arrived'].includes(currentRide.status) ? <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Hidden until PIN Verified</span> : currentRide.dropoff}</div>
                        
                        <div style={{ borderTop: '1px solid rgba(59, 130, 246, 0.2)', marginTop: '8px', paddingTop: '8px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div><strong>Estimated Distance:</strong> {currentRide.totalKm || 8.0} KM</div>
                          </div>
  
                          <div style={{ borderTop: '1px dashed var(--border)', marginTop: '8px', paddingTop: '8px', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '15px' }}>
                            <span>TRIP FARE:</span>
                            <span>INR {(parseFloat(currentRide.fare) + parseFloat(currentRide.driverTip || 0)).toFixed(2)}</span>
                          </div>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            const dest = ['Accepted', 'Arrived'].includes(currentRide.status) ? currentRide.pickupCoords : currentRide.dropoffCoords;
                            const label = ['Accepted', 'Arrived'].includes(currentRide.status) ? currentRide.pickup : currentRide.dropoff;
                            if (dest && dest.lat) {
                              window.open(\`https://www.google.com/maps/dir/?api=1&destination=\${dest.lat},\${dest.lng}&travelmode=driving\`, '_blank');
                            } else if (label) {
                              window.open(\`https://www.google.com/maps/dir/?api=1&destination=\${encodeURIComponent(label)}&travelmode=driving\`, '_blank');
                            } else {
                              alert('Location coordinates not available for navigation.');
                            }
                          }}
                          style={{ width: '100%', background: '#8b5cf6', color: 'white', padding: '18px', fontSize: '18px', fontWeight: '900', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(139,92,246,0.3)', border: 'none' }}
                        >
                          <Navigation size={22} /> NAVIGATE TO DROP-OFF
                        </Button>
                        
                        <Button variant="primary" className="full-width" onClick={() => setShowEndTripSummary(true)} style={{ background: '#3b82f6', color: 'white', padding: '18px', fontSize: '18px', fontWeight: '900', borderRadius: '12px', boxShadow: '0 4px 15px rgba(59,130,246,0.3)' }}>
                          COMPLETE RIDE
                        </Button>
                      </div>`;

if (content.includes(oldBlock)) {
    content = content.replace(oldBlock, newBlock);
} else {
    let old_win = oldBlock.replace(/\n/g, '\r\n');
    let new_win = newBlock.replace(/\n/g, '\r\n');
    if (content.includes(old_win)) {
        content = content.replace(old_win, new_win);
    } else {
        console.log("Could not find the block to replace.");
    }
}

fs.writeFileSync('src/pages/DriverDashboard.jsx', content);
