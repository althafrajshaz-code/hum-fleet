with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "Chat with Driver" in line:
        start_idx = i - 6
        end_idx = i + 12
        new_lines = '''                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button variant="outline" style={{ flex: 1, borderColor: '#3b82f6', color: '#3b82f6' }} onClick={() => alert(Calling driver at ...)}>
                    <Phone size={16} style={{ marginRight: '6px' }} /> Call Driver
                  </Button>
                  <Button variant="primary" style={{ flex: 1, background: '#ef4444', borderColor: '#ef4444' }} onClick={handleCancelBooking}>
                    {t('Cancel Trip')}
                  </Button>
                </div>\n'''
        lines[start_idx:end_idx] = [new_lines]
        with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print("Success")
        break
else:
    print("Not found")
