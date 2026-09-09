with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove it from inside dashboard-map
target_block = r'''          {/* PINNED VERIFICATION PIN / CUSTOMER ID */}
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
          )}'''

# Replace indentation
target_block2 = target_block.replace('          {/*', '            {/*').replace('          {r', '            {r').replace('            <div', '              <div').replace('              className', '                className').replace('              style={{', '                style={{').replace('                position:', '                  position:').replace('                top:', '                  top:').replace('                left:', '                  left:').replace('                transform:', '                  transform:').replace('                zIndex:', '                  zIndex:').replace('                background:', '                  background:').replace('                color:', '                  color:').replace('                border:', '                  border:').replace('                borderRadius:', '                  borderRadius:').replace('                padding:', '                  padding:').replace('                display:', '                  display:').replace('                flexDirection:', '                  flexDirection:').replace('                alignItems:', '                  alignItems:').replace('                justifyContent:', '                  justifyContent:').replace('                boxShadow:', '                  boxShadow:').replace('              }}', '                }}').replace('            >', '              >').replace('              <span', '                <span').replace('                Verif', '                  Verif').replace('              </span', '                </span').replace('                {passe', '                  {passe').replace('            </div', '              </div').replace('          )}', '            )}')

# print(target_block2 in content)

new_content = content.replace(target_block2, '')

# 2. Add it outside the map, right before the vehicle arriving modal
insertion_point = r'''        {/* ===== VEHICLE ARRIVING SPLASH NOTIFICATION MODAL ===== */}'''

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

new_content = new_content.replace(insertion_point, new_pin_block)

with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Success")

