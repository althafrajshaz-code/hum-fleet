import sys, re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 2. 10% commission changes
content = content.replace('after 10% commission', 'after platform dues')
content = content.replace('Commission (10%)', 'Dues & Fees')
content = content.replace('(10% Platform Commission & GST Dues)', '(Platform Fees & GST)')

# 3. Commission Policy wording

old_policy1 = "💡t <strong>Commission Policy:</strong> Platform fee is calculated based on distance and service type, with a 5% GST applied to the total. Please ensure all outstanding dues are cleared weekly to maintain active dispatch status."
old_policy2 = "💡t <strong>Commission Policy:</strong> 5% HUM Fleet Commission + 5% GST is deducted per completed ride. Dues must be paid through the gateway before pending balance crosses ⚹1,500."
new_policy = "💡t <strong>Commission Policy:</strong> Platform fee is tiered (⚹10 for trips up to ⚹1000, ⚹20 up to ⚹1500, ⚹25 above ⚹1500) + 5% GST on base fare. Dues must be paid through the gateway before pending balance crosses ⚹1,500."
content = content.replace(old_policy1, new_policy)
content = content.replace(old_policy2, new_policy)

# 5. Dues Breakdown Block with safe optional chaining!
old_dues_breakdown = """                {/* Dues Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', background: 'rgba(255,255,255,0.01)' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>🔺 Platform Commission Breakdown</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Base Commission (5%):</span>
                    <strong style={{ color: '#ef4444' }}>-⚹/{parseFloat(wallet?.toBePaid || 0) * 0.5).toFixed(2)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Government GST (5%):</span>
                    <strong style={{ color: '#ef4444' }}>-⚹{(parseFloat(wallet?.toBePaid || 0) * 0.5).toFixed(2)}</strong>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800' }}>
                    <span style={{ color: '#ef4444' }}>Total Commission Dues:</span>
                    <strong style={{ color: '#ef4444' }}>-⚹{parseFloat(wallet?.toBePaid || 0).toFixed(2)}</strong>
                  </div>
              </div>"""

new_dues_breakdown = """                {/* Dues Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', background: 'rgba(255,255,255,0.01)' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>🔺 Platform Commission Breakdown</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Platform Fees:</span>
                    <strong style={{ color: '#ef4444' }}>-⚹{(parseFloat(wallet?.toBePaid || 0) - parseFloat(wallet?.gstCollected || 0)).toFixed(2)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>GST Collected:</span>
                    <strong style={{ color: '#ef4444' }}>-⚹{parseFloat(wallet?.gstCollected || 0).toFixed(2)}</strong>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800' }}>
                    <span style={{ color: '#ef4444' }}>Total Commission Dues:</span>
                    <strong style={{ color: '#ef4444' }}>-⚹{parseFloat(wallet?.toBePaid || 0).toFixed(2)}</strong>
                  </div>
              </div>

                {/* Progress Bar for 750 Limit */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', background: 'rgba(255,255,255,0.01)', marginTop: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700' }}>
                    <span style={{ color: 'var(--text-main)' }}>Dues Limit</span>
                    <span style={{ color: parseFloat(wallet?.toBePaid || 0) >= 700 ? '#ef4444' : 'var(--text-main)' }}>
                      ⚹{parseFloat(wallet?.toBePaid || 0).toFixed(2)} / ⚹750
                    </span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Mathh.min(100, (parseFloat(wallet?.toBePaid || 0) / 750) * 100)}%`, background: parseFloat(wallet?.toBePaid || 0) >= 700 ? '#ef4444' : parseFloat(wallet?.toBePaid || 0) >= 500 ? '#f59e0b' : '#10b981', transition: 'width 0.3s ease' }} />
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>*Trips will be blocked once dues reach .</span>
                </div>"""

content = content.replace(old_dues_breakdown, (old_dues_breakdown if '750' in old_dues_breakdown else new_dues_breakdown))
content = content.replace(old_dues_breakdown.replace('i', 'parseFloat'), new_dues_breakdown)

content = content.replace('wallet.toBePaid', 'wallet?.toBePaid')
content = content.replace('wallet.cashCollected', 'wallet?.cashCollected')
content = content.replace('wallet.gstCollected', 'wallet?.gstCollected')

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated all features successfully.")
