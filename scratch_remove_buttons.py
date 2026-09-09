import re

def modify_buttons():
    with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # The block starts near <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
    # We will search for a regex that grabs this entire section and replaces it.

    old_block = r'''                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <Button 
                    variant="outline" 
                    style={{ flex: 1, borderColor: '#3b82f6', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} 
                    onClick={() => { setShowInTripChat(true); fetchTripChatMessages(); }}
                  >
                    <MessageSquare size={16} /> [^<]+ Chat with Driver
                  </Button>
                  <Button variant="outline" style={{ flex: 1 }} onClick={() => alert\(Calling driver at \$\{activeRide\.driverPhone\}\.\.\.\)}>
                    <Phone size={16} /> Call Driver
                  </Button>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button variant="outline" style={{ flex: 1, borderColor: '#f59e0b', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} onClick=\{handleWaitForMe\}>
                    <Clock size={16} /> \{t\('Wait For Me'\)\}
                  </Button>
                  <Button variant="primary" style={{ flex: 1 }} onClick=\{handleCancelBooking\}>
                    \{t\('Cancel Trip'\)\}
                  </Button>
                </div>'''

    new_block = '''                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button variant="outline" style={{ flex: 1, borderColor: '#3b82f6', color: '#3b82f6' }} onClick={() => alert(Calling driver at ...)}>
                    <Phone size={16} style={{ marginRight: '6px' }} /> Call Driver
                  </Button>
                  <Button variant="primary" style={{ flex: 1, background: '#ef4444', borderColor: '#ef4444' }} onClick={handleCancelBooking}>
                    {t('Cancel Trip')}
                  </Button>
                </div>'''
                
    pattern = re.compile(old_block, re.MULTILINE | re.DOTALL)
    
    if pattern.search(content):
        content = pattern.sub(new_block, content)
        with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Success")
    else:
        print("Not found")

modify_buttons()
