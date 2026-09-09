import re

with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r'''                  <Button variant="primary" style={{ flex: 1, background: '#ef4444', borderColor: '#ef4444' }} onClick={handleCancelBooking}>
                    {t('Cancel Trip')}
                  </Button>'''

replacement = r'''                  {activeRide.status !== 'In Progress' && (
                    <Button variant="primary" style={{ flex: 1, background: '#ef4444', borderColor: '#ef4444' }} onClick={handleCancelBooking}>
                      {t('Cancel Trip')}
                    </Button>
                  )}'''

if target in content:
    content = content.replace(target, replacement)
    with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success")
else:
    print("Target not found")
