const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

const MARKER = '📍 Use My Current Location';
const MAP_BTN = `
                    {/* CHOOSE FROM MAP */}
                    <div
                      onMouseDown={() => { setMapModalTarget(targetField); setShowMapModal(true); }}
                      className="dropdown-item"
                      style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center' }}
                    >
                      <Map size={16} style={{ marginRight: '8px' }} />
                      🗺️ Choose from Map
                    </div>`;

// Find all "Use My Current Location" occurrences and the "handleUseCurrentLocation" call before each
// to detect if it's pickup or dropoff
let positions = [];
let pos = 0;
while (true) {
    const idx = code.indexOf(MARKER, pos);
    if (idx === -1) break;
    positions.push(idx);
    pos = idx + 1;
}
console.log('Found', positions.length, 'occurrences');

// We need to insert "Choose from Map" button after each occurrence's closing </div>
// Find the closing div after each occurrence
// The pattern is: "📍 Use My Current Location\r\n                    </div>"
// After that we want to inject

// Build the "Choose from Map" buttons for pickup and dropoff
const pickupMapBtn = `
                    {/* CHOOSE FROM MAP - PICKUP */}
                    <div
                      onMouseDown={() => { setMapModalTarget('pickup'); setShowMapModal(true); setPickupFocused(false); }}
                      className="dropdown-item"
                      style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center' }}
                    >
                      <Map size={16} style={{ marginRight: '8px' }} />
                      🗺️ Choose from Map
                    </div>
`;

const dropoffMapBtn = `
                    {/* CHOOSE FROM MAP - DROPOFF */}
                    <div
                      onMouseDown={() => { setMapModalTarget('dropoff'); setShowMapModal(true); setDropoffFocused(false); }}
                      className="dropdown-item"
                      style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center' }}
                    >
                      <Map size={16} style={{ marginRight: '8px' }} />
                      🗺️ Choose from Map
                    </div>
`;

// Find the closing div for each occurrence
// Pattern after "📍 Use My Current Location" is "\r\n                    </div>\r\n"
const CLOSE_DIV = '\r\n                    </div>\r\n';

// Replace first occurrence (pickup)
const firstClose = code.indexOf(CLOSE_DIV, positions[0]);
code = code.substring(0, firstClose + CLOSE_DIV.length) + pickupMapBtn + code.substring(firstClose + CLOSE_DIV.length);

// Now find second occurrence (the positions may have shifted)
// Recalculate
let newPositions = [];
let pos2 = 0;
while (true) {
    const idx = code.indexOf(MARKER, pos2);
    if (idx === -1) break;
    newPositions.push(idx);
    pos2 = idx + 1;
}
console.log('After first insert, found', newPositions.length, 'occurrences');

if (newPositions.length >= 2) {
    const secondClose = code.indexOf(CLOSE_DIV, newPositions[1]);
    code = code.substring(0, secondClose + CLOSE_DIV.length) + dropoffMapBtn + code.substring(secondClose + CLOSE_DIV.length);
}

// Now add the MAP MODAL before the Payment Gateway Modal
const PAYMENT_MODAL_MARKER = `      {/* ========== PAYMENT GATEWAY MODAL ========== */}`;
const MAP_MODAL = `      {/* ========== CHOOSE FROM MAP MODAL ========== */}
      {showMapModal && (
        <div
          onClick={() => setShowMapModal(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(0,0,0,0.88)',
            display: 'flex', flexDirection: 'column',
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px',
              background: 'var(--bg-card)',
              borderBottom: '1px solid var(--border)',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Map size={20} color="var(--primary)" />
              <span style={{ fontWeight: '800', fontSize: '16px' }}>
                {mapModalTarget === 'pickup' ? '📍 Choose Pickup Location' : '🏁 Choose Drop-off Location'}
              </span>
            </div>
            <button
              onClick={() => setShowMapModal(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Instruction bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: '10px 18px',
              background: 'rgba(16,185,129,0.08)',
              borderBottom: '1px solid rgba(16,185,129,0.2)',
              fontSize: '13px', fontWeight: '600', color: '#10b981', flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            <Compass size={16} />
            Tap anywhere on the map to pin your location, then tap Confirm
          </div>

          {/* Map iframe fills remaining space */}
          <div style={{ flex: 1, overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <iframe
              id="map-modal-iframe"
              src="/map.html"
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Choose from Map"
            />
          </div>

          {/* Confirm button */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: '14px 18px',
              background: 'var(--bg-card)',
              borderTop: '1px solid var(--border)',
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => setShowMapModal(false)}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff', fontWeight: '800', fontSize: '15px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              ✅ Confirm Location
            </button>
          </div>
        </div>
      )}

`;

const paymentIdx = code.indexOf(PAYMENT_MODAL_MARKER);
if (paymentIdx !== -1) {
    code = code.substring(0, paymentIdx) + MAP_MODAL + code.substring(paymentIdx);
    console.log('Map modal injected!');
} else {
    console.log('ERROR: Payment modal marker not found!');
}

// Also update the handleMapMessage to set the right field when map modal is open
// Find and update existing MAP_LOCATION_SELECTED handler
const OLD_HANDLER = `      if (event.data && event.data.type === 'MAP_LOCATION_SELECTED') {`;
const NEW_HANDLER = `      if (event.data && event.data.type === 'MAP_LOCATION_SELECTED') {
        // Handle map modal selection
        setShowMapModal(false);
        if (mapModalTarget === 'dropoff') {
          setDropoff(event.data.address);
          setDropoffCoords({ lat: event.data.lat, lng: event.data.lng });
          setMapModalTarget(null);
          return;
        } else if (mapModalTarget === 'pickup') {
          setPickup(event.data.address);
          setPickupCoords({ lat: event.data.lat, lng: event.data.lng });
          setMapModalTarget(null);
          return;
        }`;

if (code.includes(OLD_HANDLER)) {
    code = code.replace(OLD_HANDLER, NEW_HANDLER);
    console.log('Handler updated!');
} else {
    console.log('WARNING: MAP_LOCATION_SELECTED handler not found!');
}

fs.writeFileSync('src/pages/PassengerDashboard.jsx', code);
console.log('✅ DONE! All changes applied successfully.');
