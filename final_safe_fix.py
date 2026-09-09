import sys

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if '<strong>Commission Policy:</strong>' in line:
        new_lines.append("                  <span style={{marginRight: '4px'}}>💡</span> <strong>Commission Policy:</strong> Platform fee is tiered (₹10 for trips up to ₹1000, ₹20 up to ₹1500, ₹25 above ₹1500) + 5% GST on base fare. Dues must be paid through the gateway before pending balance crosses ₹1,500.\n")
    elif 'Platform Commission Breakdown' in line:
        new_lines.append("                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>📊 Platform Commission Breakdown</span>\n")
    elif 'Base Commission (5%):' in line:
        new_lines.append("                    <span style={{ color: 'var(--text-muted)' }}>Platform Commission:</span>\n")
    elif 'Government GST (5%):' in line:
        new_lines.append("                    <span style={{ color: 'var(--text-muted)' }}>GST Collected:</span>\n")
    elif '*(parseFloat(wallet?.toBePaid || 0) * 0.5)' in line or '*(parseFloat(wallet.toBePaid || 0) * 0.5)' in line:
        if 'Platform Commission' in new_lines[-2]:
            new_lines.append("                    <strong style={{ color: '#ef4444' }}>-₹{(parseFloat(wallet?.toBePaid || 0) - parseFloat(wallet?.gstCollected || 0)).toFixed(2)}</strong>\n")
        else:
            new_lines.append("                    <strong style={{ color: '#ef4444' }}>-₹{parseFloat(wallet?.gstCollected || 0).toFixed(2)}</strong>\n")
    elif '{parseFloat(wallet?.toBePaid || 0) > 0 && (' in line or '{parseFloat(wallet.toBePaid || 0) > 0 && (' in line:
        # Insert the progress bar RIGHT BEFORE this line
        pb = """                {/* Progress Bar for 750 Limit */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', background: 'rgba(255,255,255,0.01)', marginTop: '4px', marginBottom: '8px' }}>
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
                </div>\n"""
        new_lines.append(pb)
        new_lines.append(line.replace('wallet.toBePaid', 'wallet?.toBePaid'))
    else:
        # Generic replacements
        mod_line = line
        mod_line = mod_line.replace('driverInfo?.name', 'driverDetails?.name')
        mod_line = mod_line.replace('driverInfo?.phone', 'driverDetails?.phone')
        mod_line = mod_line.replace('after 10% commission', 'after platform dues')
        mod_line = mod_line.replace('Commission (10%)', 'Dues & Fees')
        mod_line = mod_line.replace('(10% Platform Commission & GST Dues)', '(Platform Fees & GST)')
        mod_line = mod_line.replace('style={{ display: "none",  display: "none", padding: "18px 14px",', 'style={{ padding: "18px 14px",')
        mod_line = mod_line.replace('style={{ display: "none", display: "none", padding: "18px 14px",', 'style={{ padding: "18px 14px",')
        mod_line = mod_line.replace('wallet.toBePaid', 'wallet?.toBePaid')
        mod_line = mod_line.replace('wallet.cashCollected', 'wallet?.cashCollected')
        mod_line = mod_line.replace('wallet.gstCollected', 'wallet?.gstCollected')
        
        # Safe optimistic goOnline fetch insertion
        if 'if (navigator.geolocation) {' in mod_line and 'registerPushNotifications' not in mod_line:
            pass # We'll do it safely another way or just let it be. Let's just do it securely:
        new_lines.append(mod_line)

text = "".join(new_lines)
# Optimistic update replacement securely
text = text.replace(
    "registerPushNotifications();\n    const email = localStorage.getItem('driverEmail');\n    if (navigator.geolocation) {",
    "registerPushNotifications();\n    const email = localStorage.getItem('driverEmail');\n    fetch(`${API_BASE}/api/drivers/location`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, isOnline: true }) }).catch(console.error);\n    if (navigator.geolocation) {"
)

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
