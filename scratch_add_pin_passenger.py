with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r'''        <div className="dashboard-map animate-fade-in delay-100" style={{ padding: 0, overflow: 'hidden', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>'''

replacement = r'''        <div className="dashboard-map animate-fade-in delay-100" style={{ padding: 0, overflow: 'hidden', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
          
          {/* PINNED VERIFICATION PIN / CUSTOMER ID */}
          {rideAccepted && activeRide && passengerId && !showRating && (
            <div
              className="pulse-nav-button"
              style={{
                position: 'absolute',
                top: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 400,
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.4)',
                borderRadius: '30px',
                padding: '10px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
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
'''

if target in content:
    content = content.replace(target, replacement)
    with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success")
else:
    print("Not found")

