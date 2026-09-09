import re

def remove_route_active():
    with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # We will use regex to find the block
    pattern = re.compile(r"\{\(isSearching \|\| rideAccepted\) && \([\s\S]*?\{rideAccepted \? Route Active:.*?<\/div>\s*\)\}", re.MULTILINE)
    
    new_block = '''{isSearching && (
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              background: 'rgba(24, 24, 27, 0.9)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '12px 24px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(8px)',
              pointerEvents: 'none',
              textAlign: 'center',
              whiteSpace: 'nowrap'
            }}>
              Finding Nearest Driver Coordinates...
            </div>
          )}'''
    
    if pattern.search(content):
        content = pattern.sub(new_block, content)
        with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Success")
    else:
        print("Not found")

remove_route_active()
