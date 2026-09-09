with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("alignSelf: 'flex-start', background: '#f59e0b', color: 'black'", "alignSelf: 'center', background: '#f59e0b', color: 'black'")

with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
