import sys
import re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add the Destination Filter Icon opposite to the HUM Logo
logo_left_str = """            {/* Logo on Left */}
            <div style={{
              position: 'absolute',
              top: '18px',
              left: '14px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '2px solid var(--border)'
            }}>
              <img src="/hum_fleet_official_logo.jpg" alt="HUM Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>"""

icon_right_str = """            {/* Destination Filter Icon on Right */}
            <div style={{ position: 'absolute', top: '18px', right: '14px', display: 'flex', gap: '8px', zIndex: 20 }}>
              {travelRoute && (
                <button 
                  onClick={handleClearTravelRoute} 
                  style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', padding: '0 10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  CLEAR
                </button>
              )}
              <button
                onClick={() => { setMapModalTarget('destination'); setShowMapModal(true); }}
                style={{
                  width: '36px', height: '36px', borderRadius: '8px', border: '2px solid ' + (travelRoute ? '#10b981' : 'var(--border)'),
                  background: travelRoute ? 'rgba(16,185,129,0.1)' : 'transparent', color: travelRoute ? '#10b981' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
                title={travelRoute ? `Filter active: ${travelRoute.destination}` : "Destination Filter"}
              >
                <MapPin size={18} />
              </button>
            </div>"""

# Ensure cross-platform matching
logo_left_regex = re.compile(re.escape(logo_left_str).replace(r'\n', r'\r?\n'))
if not re.search(icon_right_str[:40].replace('\n', '\r?\n'), content):
    content = logo_left_regex.sub(logo_left_str + "\n\n" + icon_right_str, content)
    print("Added Icon opposite Logo")

# 2. Convert ternary to simple && and remove NORMAL DESTINATION FILTER
# We need to find the exact string of the ternary else branch.
normal_filter_regex = re.compile(r"              \) : \(\r?\n                /\* NORMAL DESTINATION FILTER \*/.*?                </div>\r?\n              \)}", re.DOTALL)

match = normal_filter_regex.search(content)
if match:
    content = content[:match.start()] + "              )}\n" + content[match.end():]
    
    # Also fix the ternary `? (` to `&& (`
    ternary_regex = re.compile(r"\{currentRide && \(currentRide\.status === 'Accepted' \|\| currentRide\.status === 'Arrived'\) \? \(")
    content = ternary_regex.sub(r"{currentRide && (currentRide.status === 'Accepted' || currentRide.status === 'Arrived') && (", content)
    print("Removed Normal Destination Filter and fixed ternary")

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
