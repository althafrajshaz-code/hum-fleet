import re

def fix_polling():
    with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
        p_content = f.read()

    p_content = p_content.replace("const interval = setInterval(fetchTripChatMessages, 2000);", "const interval = setInterval(fetchTripChatMessages, 1000);")
    
    with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(p_content)

    with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
        d_content = f.read()

    d_content = d_content.replace("const interval = setInterval(fetchDriverTripChatMessages, 2000);", "const interval = setInterval(fetchDriverTripChatMessages, 1000);")
    
    with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(d_content)

    print("Success")

fix_polling()
