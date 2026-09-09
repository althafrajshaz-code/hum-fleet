const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

// 1. Add mapModalTarget state after pickup/dropoff states
code = code.replace(
  `  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);`,
  `  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false); // null | 'pickup' | 'dropoff'
  const [mapModalTarget, setMapModalTarget] = useState(null);`
);

// 2. Add "Choose from Map" button in PICKUP dropdown (after "Use My Current Location")
const pickupCurrentLocBtn = `                      <Navigation2 size={16} style={{ marginRight: '8px' }} />
                      📍 Use My Current Location
                    </div>

                    {isGeoSearching && (`;

const pickupWithMapBtn = `                      <Navigation2 size={16} style={{ marginRight: '8px' }} />
                      📍 Use My Current Location
                    </div>

                    {/* CHOOSE FROM MAP BUTTON - PICKUP */}
                    <div
                      onMouseDown={() => { setMapModalTarget('pickup'); setShowMapModal(true); setPickupFocused(false); }}
                      className="dropdown-item"
                      style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <Map size={16} style={{ marginRight: '8px' }} />
                      🗺️ Choose from Map
                    </div>

                    {isGeoSearching && (`;

code = code.replace(pickupCurrentLocBtn, pickupWithMapBtn);

// 3. Add "Choose from Map" button in DROPOFF dropdown (after "Use My Current Location")
const dropoffCurrentLocBtn = `                      <Navigation2 size={16} style={{ marginRight: '8px' }} />
                      📍 Use My Current Location
                    </div>

                    {isGeoSearching && (`;

const dropoffWithMapBtn = `                      <Navigation2 size={16} style={{ marginRight: '8px' }} />
                      📍 Use My Current Location
                    </div>

                    {/* CHOOSE FROM MAP BUTTON - DROPOFF */}
                    <div
                      onMouseDown={() => { setMapModalTarget('dropoff'); setShowMapModal(true); setDropoffFocused(false); }}
                      className="dropdown-item"
                      style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <Map size={16} style={{ marginRight: '8px' }} />
                      🗺️ Choose from Map
                    </div>

                    {isGeoSearching && (`;

// Only replace the second occurrence (dropoff) - need to find after pickup was replaced
const firstOccurrence = code.indexOf(dropoffCurrentLocBtn);
if (firstOccurrence !== -1) {
  const secondOccurrence = code.indexOf(dropoffCurrentLocBtn, firstOccurrence + 1);
  if (secondOccurrence !== -1) {
    code = code.substring(0, secondOccurrence) + dropoffWithMapBtn + code.substring(secondOccurrence + dropoffCurrentLocBtn.length);
  }
}

// 4. Add the fullscreen Map Modal just before the closing </div> of dashboard-container
// Find the map modal injection point - right before the last closing divs
const mapModal = `
      {/* ========== CHOOSE FROM MAP MODAL ========== */}
      {showMapModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 18px',
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}>
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

          {/* Instruction */}
          <div style={{
            padding: '10px 18px',
            background: 'rgba(16,185,129,0.08)',
            borderBottom: '1px solid rgba(16,185,129,0.2)',
            fontSize: '13px', fontWeight: '600', color: '#10b981', flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <Compass size={16} />
            Tap anywhere on the map to select location, then press Confirm
          </div>

          {/* Map iframe */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <iframe
              id="map-modal-iframe"
              src="/map.html"
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Choose from Map"
              onLoad={() => {
                // When map loads, send a message to reset/center it
                const iframe = document.getElementById('map-modal-iframe');
                if (iframe && iframe.contentWindow) {
                  iframe.contentWindow.postMessage({ type: 'RESET_MAP' }, '*');
                }
              }}
            />
          </div>

          {/* Confirm Button */}
          <div style={{
            padding: '14px 18px',
            background: 'var(--bg-card)',
            borderTop: '1px solid var(--border)',
            flexShrink: 0,
          }}>
            <button
              onClick={() => setShowMapModal(false)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                fontWeight: '800',
                fontSize: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              ✅ Confirm Location
            </button>
          </div>
        </div>
      )}
`;

// Inject the modal right before the last few closing tags of the component
// Find a good injection point - after the map iframe div close
const injectionPoint = `      {/* ========== PAYMENT GATEWAY MODAL ========== */}`;
code = code.replace(injectionPoint, mapModal + `      {/* ========== PAYMENT GATEWAY MODAL ========== */}`);

// 5. Also wire up the MAP_LOCATION_SELECTED event to handle modal selections
// The existing handleMapMessage already handles this, but we need to make sure it also closes the modal
// Find the existing handleMapMessage and update it
const existingMapHandler = `      if (event.data && event.data.type === 'MAP_LOCATION_SELECTED') {`;
const updatedMapHandler = `      if (event.data && event.data.type === 'MAP_LOCATION_SELECTED') {
        // If map modal is open, set the right field and close modal
        setShowMapModal(prev => {
          if (prev) {
            // Will close modal, set field was done via mapModalTarget
          }
          return false;
        });
        if (mapModalTarget === 'dropoff') {
          setDropoff(event.data.address);
          setDropoffCoords({ lat: event.data.lat, lng: event.data.lng });
          setMapModalTarget(null);
          return;
        } else {
          setMapModalTarget(null);
        }`;

code = code.replace(existingMapHandler, updatedMapHandler);

fs.writeFileSync('src/pages/PassengerDashboard.jsx', code);
console.log('✅ Choose from Map feature added successfully!');
