with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
for i, line in enumerate(lines):
    if "Chat with Driver" in line:
        start_idx = i
        break

if start_idx != -1:
    while start_idx > 0 and "<div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>" not in lines[start_idx]:
        start_idx -= 1
        
    end_idx = start_idx
    while end_idx < len(lines):
        if "Cancel Trip" in lines[end_idx] and "</Button>" in lines[end_idx+1]:
            end_idx += 3 # skip </Button> and </div>
            break
        end_idx += 1
        
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
    print("Replaced lines", start_idx, "to", end_idx)
else:
    print("Not found")
