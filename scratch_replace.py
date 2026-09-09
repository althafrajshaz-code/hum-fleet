with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
for i, line in enumerate(lines):
    if "onClick={() => { setShowInTripChat(true); fetchTripChatMessages(); }}" in line:
        start_idx = i
        break

if start_idx != -1:
    # Go backwards to find the <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
    while start_idx > 0 and "<div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>" not in lines[start_idx]:
        start_idx -= 1
        
    end_idx = start_idx
    # Go forwards to find </Button>\n                </div> of the cancel trip
    cancel_count = 0
    while end_idx < len(lines):
        if "Cancel Trip" in lines[end_idx]:
            cancel_count = 1
        if cancel_count == 1 and "</div>" in lines[end_idx]:
            end_idx += 1
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
