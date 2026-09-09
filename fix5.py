import sys, re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

policy_pattern = re.compile(r'<div[^>]*>.*?<strong>Commission Policy:</strong>.*?</div>', re.DOTALL)
new_policy = """<div style={{ fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '10px', lineHeight: '1.5' }}>
                  💡 <strong>Commission Policy:</strong> Platform fee is tiered (₹10 for trips up to ₹1000, ₹20 up to ₹1500, ₹25 above ₹1500) + 5% GST on base fare. Dues must be paid through the gateway before pending balance crosses ₹1,500.
                </div>"""

text = policy_pattern.sub(new_policy, text)

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
