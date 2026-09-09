import sys

with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_str = """              <div style={{ display: 'flex', gap: '10px' }}>
                <Button variant="outline" style={{ flex: 1, borderColor: '#f59e0b', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} onClick={handleWaitForMe}>
                  <Clock size={16} /> {t('Wait For Me')}
                </Button>
                <Button variant="primary" style={{ flex: 1 }} onClick={handleCancelBooking}>
                  {t('Cancel Trip')}
                </Button>
              </div>"""

new_str = """              {activeRide.status !== 'In Progress' && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button variant="outline" style={{ flex: 1, borderColor: '#f59e0b', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} onClick={handleWaitForMe}>
                    <Clock size={16} /> {t('Wait For Me')}
                  </Button>
                  <Button variant="primary" style={{ flex: 1 }} onClick={handleCancelBooking}>
                    {t('Cancel Trip')}
                  </Button>
                </div>
              )}"""

if old_str in content:
    content = content.replace(old_str, new_str)
    with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success")
else:
    print("Not found")
