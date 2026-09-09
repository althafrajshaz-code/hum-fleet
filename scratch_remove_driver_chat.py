with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
for i, line in enumerate(lines):
    if "setShowDriverTripChat(true)" in line:
        start_idx = i - 2
        end_idx = i + 10
        new_lines = '''                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                          <Button variant="outline" style={{ flex: 1 }} onClick={() => alert(Calling passenger at ...)}>
                            <Phone size={16} /> Call Passenger
                          </Button>
                        </div>\n'''
        lines[start_idx:end_idx] = [new_lines]
        with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print("Success")
        break
else:
    print("Not found")
