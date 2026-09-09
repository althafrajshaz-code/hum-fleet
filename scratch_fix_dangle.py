import sys

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                {travelRoute ? (
                  <div style={{ textAlign: 'center', position: 'relative' }}>
                    <button onClick={handleClearTravelRoute} style={{ position: 'absolute', right: -5, top: -5, background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', fontWeight: '800', cursor: 'pointer', padding: '4px 8px' }}>CLEAR</button>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Currently matching rides along route to:</div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <MapPin size={12} color="#f59e0b" /> {travelRoute.destination}
                    </div>
                  </div>
                ) : (
                  <div style={{ position: 'relative' }}>
                    <div
                      onClick={() => { setMapModalTarget('destination'); setShowMapModal(true); }}
                      style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' }}
                    >
                      <div style={{ padding: '6px 12px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--secondary)', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={16} /> Choose from Map
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}"""

if target in content:
    content = content.replace(target, "")
    with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed dangling!")
else:
    print("Not found.")
