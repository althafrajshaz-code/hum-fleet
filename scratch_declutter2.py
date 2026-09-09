import re

def declutter_passenger_regex():
    with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove Vehicle Image Preview
    pattern_preview = re.compile(r"\{\/\* Vehicle Image Preview \*\/\}[\s\S]*?<\/div>\s*<\/div>", re.MULTILINE)
    
    # 2. Remove Mid-trip dest button
    pattern_mid_trip = re.compile(r"\{\/\* MID-TRIP DESTINATION UPDATE BUTTON \*\/\}[\s\S]*?<\/button>", re.MULTILINE)
    
    if pattern_preview.search(content):
        content = pattern_preview.sub('', content)
        print("Removed Vehicle Preview")
        
    if pattern_mid_trip.search(content):
        content = pattern_mid_trip.sub('', content)
        print("Removed Mid-trip dest button")
        
    with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

declutter_passenger_regex()
