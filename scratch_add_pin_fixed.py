with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

insertion_point = r"{/* ===== VEHICLE ARRIVING SPLASH NOTIFICATION MODAL ===== */}"
new_pin_block = r'''        {/* PINNED VERIFICATION PIN / CUSTOMER ID (Moved out of map z-index context) */}
        {rideAccepted && activeRide && passengerId && !showRating && (
          <div
            className="pulse-nav-button"
            style={{
              position: 'fixed',
              top: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999,
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.4)',
              borderRadius: '30px',
              padding: '10px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.6)'
            }}
          >
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', opacity: 0.9 }}>
              Verification PIN
            </span>
            <span style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '2px', fontFamily: 'monospace' }}>
              {passengerId}
            </span>
          </div>
        )}

        {/* ===== VEHICLE ARRIVING SPLASH NOTIFICATION MODAL ===== */}'''

if insertion_point in content:
    content = content.replace(insertion_point, new_pin_block)
    with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success added PIN")
else:
    print("Insertion point not found")
