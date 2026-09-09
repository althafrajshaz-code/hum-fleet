import re

with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to replace the two flex divs with one flex div containing Call and Cancel.

target = r'''                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>\s*<Button\s*variant="outline"\s*style={{ flex: 1, borderColor: '#3b82f6', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}\s*onClick=\{\(\) => \{ setShowInTripChat\(true\); fetchTripChatMessages\(\); \}\}\s*>\s*<MessageSquare size=\{16\} />[^<]+Chat with Driver\s*</Button>\s*<Button variant="outline" style=\{\{ flex: 1 \}\} onClick=\{\(\) => alert\(Calling driver at \$\{activeRide.driverPhone\}\.\.\.\)\}>\s*<Phone size=\{16\} /> Call Driver\s*</Button>\s*</div>\s*<div style=\{\{ display: 'flex', gap: '10px' \}\}>\s*<Button variant="outline" style=\{\{ flex: 1, borderColor: '#f59e0b', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' \}\} onClick=\{handleWaitForMe\}>\s*<Clock size=\{16\} /> \{t\('Wait For Me'\)\}\s*</Button>\s*<Button variant="primary" style=\{\{ flex: 1 \}\} onClick=\{handleCancelBooking\}>\s*\{t\('Cancel Trip'\)\}\s*</Button>\s*</div>'''

new_block = '''                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button variant="outline" style={{ flex: 1, borderColor: '#3b82f6', color: '#3b82f6' }} onClick={() => alert(Calling driver at ...)}>
                    <Phone size={16} style={{ marginRight: '6px' }} /> Call Driver
                  </Button>
                  <Button variant="primary" style={{ flex: 1, background: '#ef4444', borderColor: '#ef4444' }} onClick={handleCancelBooking}>
                    {t('Cancel Trip')}
                  </Button>
                </div>'''

pattern = re.compile(target, re.MULTILINE | re.DOTALL)
if pattern.search(content):
    content = pattern.sub(new_block, content)
    with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success")
else:
    print("Not found")

