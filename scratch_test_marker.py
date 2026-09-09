with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = "onClick={() => { setShowInTripChat(true); fetchTripChatMessages(); }}"
if start_marker in content:
    print("Start marker found")
else:
    print("Start marker missing")
