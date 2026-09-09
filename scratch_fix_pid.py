import re

def fix_passenger_id():
    with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()
        
    old_code = "{activeRide.passengerId || '---'}"
    new_code = "{passengerId || activeRide.passengerId || '---'}"
    
    if old_code in content:
        content = content.replace(old_code, new_code)
        with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Fixed passenger ID display")
    else:
        print("Could not find the target code")

fix_passenger_id()
