import sys, re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove Docs & Photos button
text = re.sub(r'<button[^>]*onClick=\{\(\) => setSettingsSubTab\(\'documents\'\)\}[^>]*>[\s\S]*?Docs & Photos[\s\S]*?<\/button>', '', text)

# 2. Settle Dues (Add Pending amount, remove QR)
old_dues = "<label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>Enter Payment Amount (INR)</label>"
new_dues = "<div style={{ fontSize: '14px', fontWeight: '800', color: '#ef4444', marginBottom: '8px' }}>Total Pending Dues (Including GST): \u20B9{parseFloat(wallet?.toBePaid || 0).toFixed(2)}</div>\n                " + old_dues
text = text.replace(old_dues, new_dues)

text = re.sub(r'\{systemSettings\.qrCodeUrl && \([\s\S]*?Scan with GPay, PhonePe, Paytm, etc\.<\/div>\s*<\/div>\s*\)\}', '', text)

# 3. Ride Preferences
old_prefs = "const driverRate = parseFloat(driverDetails?.ratePerKm || 0);"
new_prefs = "const driverCat = availableCategories.find(c => String(c.id).toLowerCase() === String(driverDetails?.vehicleCategory || '').toLowerCase() || String(c.name).toLowerCase() === String(driverDetails?.vehicleCategory || '').toLowerCase());\n                          const driverRate = parseFloat(driverCat?.ratePerKm || 0);"
text = text.replace(old_prefs, new_prefs)

# 4. ₹750 Limit Progress Bar
dues_pattern = r'\{\/\*\s*Dues Breakdown\s*\*\/\}.*?Total Commission Dues:<\/span>\s*<strong[^>]*>.*?<\/strong>\s*<\/div>\s*<\/div>'
new_limit = """{/* Dues Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', background: 'rgba(255,255,255,0.01)' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>\uD83D\uDCCA Platform Commission Breakdown</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Platform Commission:</span>
                    <strong style={{ color: '#ef4444' }}>-\u20B9{(parseFloat(wallet?.toBePaid || 0) - parseFloat(wallet?.gstCollected || 0)).toFixed(2)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>GST Collected:</span>
                    <strong style={{ color: '#ef4444' }}>-\u20B9{parseFloat(wallet?.gstCollected || 0).toFixed(2)}</strong>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800' }}>
                    <span style={{ color: '#ef4444' }}>Total Commission Dues:</span>
                    <strong style={{ color: '#ef4444' }}>-\u20B9{parseFloat(wallet?.toBePaid || 0).toFixed(2)}</strong>
                  </div>
                </div>

                {/* Progress Bar for 750 Limit */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', background: 'rgba(255,255,255,0.01)', marginTop: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700' }}>
                    <span style={{ color: 'var(--text-main)' }}>Dues Limit</span>
                    <span style={{ color: parseFloat(wallet?.toBePaid || 0) >= 700 ? '#ef4444' : 'var(--text-main)' }}>
                      \u20B9{parseFloat(wallet?.toBePaid || 0).toFixed(2)} / \u20B9750
                    </span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (parseFloat(wallet?.toBePaid || 0) / 750) * 100)}%`, background: parseFloat(wallet?.toBePaid || 0) >= 700 ? '#ef4444' : parseFloat(wallet?.toBePaid || 0) >= 500 ? '#f59e0b' : '#10b981', transition: 'width 0.3s ease' }} />
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>*Trips will be blocked once dues reach \u20B9750.</span>
                </div>"""
text = re.sub(dues_pattern, new_limit, text, flags=re.DOTALL)

# 5. Commission Policy
policy_pattern = r'<div[^>]*>.*?<strong>Commission Policy:<\/strong>.*?<\/div>'
new_policy = """<div style={{ fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '10px', lineHeight: '1.5' }}>
                  \uD83D\uDCA1 <strong>Commission Policy:</strong> Platform fee is tiered (\u20B910 for trips up to \u20B91000, \u20B920 up to \u20B91500, \u20B925 above \u20B91500) + 5% GST on base fare. Dues must be paid through the gateway before pending balance crosses \u20B91,500.
                </div>"""
text = re.sub(policy_pattern, new_policy, text, flags=re.DOTALL)

# 6. Generic Optional Chaining Text replacements
text = text.replace('driverInfo?.name', 'driverDetails?.name')
text = text.replace('driverInfo?.phone', 'driverDetails?.phone')
text = text.replace('after 10% commission', 'after platform dues')
text = text.replace('Commission (10%)', 'Dues & Fees')
text = text.replace('(10% Platform Commission & GST Dues)', '(Platform Fees & GST)')
text = text.replace('wallet.toBePaid', 'wallet?.toBePaid')
text = text.replace('wallet.cashCollected', 'wallet?.cashCollected')
text = text.replace('wallet.gstCollected', 'wallet?.gstCollected')
text = text.replace('style={{ display: "none",  display: "none", padding: "18px 14px",', 'style={{ padding: "18px 14px",')
text = text.replace('`★ ${', '`\u2B50 ${')

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
