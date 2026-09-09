import sys, re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Clean up characters that Vite hates
text = text.replace('★', '⭐')
text = text.replace('—', '-')

# 2. Fix the driverInfo -> driverDetails
text = text.replace('driverInfo?.name', 'driverDetails?.name')
text = text.replace('driverInfo?.phone', 'driverDetails?.phone')

# 3. 10% commission text changes
text = text.replace('after 10% commission', 'after platform dues')
text = text.replace('Commission (10%)', 'Dues & Fees')
text = text.replace('(10% Platform Commission & GST Dues)', '(Platform Fees & GST)')

# 4. Display None fix
text = text.replace('style={{ display: "none",  display: "none", padding: "18px 14px",', 'style={{ padding: "18px 14px",')
text = text.replace('style={{ display: "none", display: "none", padding: "18px 14px",', 'style={{ padding: "18px 14px",')

# 5. Dues Breakdown and 750 Limit
dues_pattern = re.compile(r'\{\/\*\s*Dues Breakdown\s*\*\/\}.*?Total Commission Dues:</span>\s*<strong[^>]*>.*?</strong>\s*</div>\s*</div>', re.DOTALL)
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
text = dues_pattern.sub(new_dues, text)

# 6. Commission Policy
policy_pattern = re.compile(r'<div[^>]*>.*?<strong>Commission Policy:</strong>.*?</div>', re.DOTALL)
new_policy = """<div style={{ fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '10px', lineHeight: '1.5' }}>
                  💡 <strong>Commission Policy:</strong> Platform fee is tiered (₹10 for trips up to ₹1000, ₹20 up to ₹1500, ₹25 above ₹1500) + 5% GST on base fare. Dues must be paid through the gateway before pending balance crosses ₹1,500.
                </div>"""
text = policy_pattern.sub(new_policy, text)

# 7. Optimistic goOnline update
go_online_pattern = re.compile(r'registerPushNotifications\(\);\s*const email = localStorage\.getItem\(\'driverEmail\'\);\s*if \(navigator\.geolocation\) \{')
new_go_online = """registerPushNotifications();
    const email = localStorage.getItem('driverEmail');
    fetch(`${API_BASE}/api/drivers/location`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, isOnline: true }) }).catch(console.error);
    if (navigator.geolocation) {"""
text = go_online_pattern.sub(new_go_online, text)

# 8. Optional Chaining for wallet crashes
text = text.replace('wallet.toBePaid', 'wallet?.toBePaid')
text = text.replace('wallet.cashCollected', 'wallet?.cashCollected')
text = text.replace('wallet.gstCollected', 'wallet?.gstCollected')

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
