import sys

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_dues = """                {/* Dues Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', background: 'rgba(255,255,255,0.01)' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>📊 Platform Commission Breakdown</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Base Commission (5%):</span>
                    <strong style={{ color: '#ef4444' }}>-₹{(parseFloat(wallet?.toBePaid || 0) * 0.5).toFixed(2)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Government GST (5%):</span>
                    <strong style={{ color: '#ef4444' }}>-₹{(parseFloat(wallet?.toBePaid || 0) * 0.5).toFixed(2)}</strong>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800' }}>
                    <span style={{ color: '#ef4444' }}>Total Commission Dues:</span>
                    <strong style={{ color: '#ef4444' }}>-₹{parseFloat(wallet?.toBePaid || 0).toFixed(2)}</strong>
                  </div>
                </div>"""

new_dues = """                {/* Dues Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', background: 'rgba(255,255,255,0.01)' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>📊 Platform Commission Breakdown</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Platform Commission:</span>
                    <strong style={{ color: '#ef4444' }}>-₹{(parseFloat(wallet?.toBePaid || 0) - parseFloat(wallet?.gstCollected || 0)).toFixed(2)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>GST Collected:</span>
                    <strong style={{ color: '#ef4444' }}>-₹{parseFloat(wallet?.gstCollected || 0).toFixed(2)}</strong>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800' }}>
                    <span style={{ color: '#ef4444' }}>Total Commission Dues:</span>
                    <strong style={{ color: '#ef4444' }}>-₹{parseFloat(wallet?.toBePaid || 0).toFixed(2)}</strong>
                  </div>
                </div>

                {/* Progress Bar for 750 Limit */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', background: 'rgba(255,255,255,0.01)', marginTop: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700' }}>
                    <span style={{ color: 'var(--text-main)' }}>Dues Limit</span>
                    <span style={{ color: parseFloat(wallet?.toBePaid || 0) >= 700 ? '#ef4444' : 'var(--text-main)' }}>
                      ₹{parseFloat(wallet?.toBePaid || 0).toFixed(2)} / ₹750
                    </span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (parseFloat(wallet?.toBePaid || 0) / 750) * 100)}%`, background: parseFloat(wallet?.toBePaid || 0) >= 700 ? '#ef4444' : parseFloat(wallet?.toBePaid || 0) >= 500 ? '#f59e0b' : '#10b981', transition: 'width 0.3s ease' }} />
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>*Trips will be blocked once dues reach ₹750.</span>
                </div>"""

text = text.replace(old_dues, new_dues)

old_go_online = """    registerPushNotifications();
    const email = localStorage.getItem('driverEmail');
    if (navigator.geolocation) {"""
new_go_online = """    registerPushNotifications();
    const email = localStorage.getItem('driverEmail');
    fetch(`${API_BASE}/api/drivers/location`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, isOnline: true }) }).catch(console.error);
    if (navigator.geolocation) {"""
text = text.replace(old_go_online, new_go_online)

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
