import sys

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Remove QR Code
text = text.replace("{systemSettings.qrCodeUrl && (\n                      <div style={{ textAlign: 'center', marginTop: '10px' }}>\n                        <img src={systemSettings.qrCodeUrl} alt=\"UPI QR Code\" style={{ maxWidth: '160px', borderRadius: '10px', border: '3px solid #fff' }} />\n                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>Scan with GPay, PhonePe, Paytm, etc.</div>\n                      </div>\n                    )}", "")

# Add Total Pending Dues explicit string
old_amount = "              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>\n                <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>Enter Payment Amount (INR)</label>"
new_amount = "              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>\n                <div style={{ fontSize: '14px', fontWeight: '800', color: '#ef4444', marginBottom: '8px' }}>Total Pending Dues (Including GST): ₹{parseFloat(wallet?.toBePaid || 0).toFixed(2)}</div>\n                <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>Enter Payment Amount (INR)</label>"
text = text.replace(old_amount, new_amount)

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
