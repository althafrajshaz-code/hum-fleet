with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "<span style={{ background: '#6366f1', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>",
    "<span style={{ background: '#6366f1', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', alignSelf: 'center' }}>"
)

with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Success")
