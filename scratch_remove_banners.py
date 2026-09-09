import re

def remove_banners():
    with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove Route Active / Finding Nearest
    pattern1 = re.compile(r"\{\(isSearching \|\| rideAccepted\) && \([\s\S]*?\{rideAccepted \? Route Active:[\s\S]*?<\/div>\s*\)\}", re.MULTILINE)
    content = pattern1.sub('', content)

    # 2. Remove persistent green banner pinned to top of map
    pattern2 = re.compile(r"\{\/\* VEHICLE ARRIVING [^\n]+persistent green banner[\s\S]*?<\/div>\s*\)\}", re.MULTILINE)
    content = pattern2.sub('', content)

    # 3. Remove Prominent Vehicle Arriving Live Banner (if any)
    # The user didn't mention it, but it's part of the same thing. Wait, I will only remove what they specifically mentioned.
    # The user says "Route Active: Umm Al Thuoob -> 🚗 Vehicle Arriving Althaf Mannarkkad LIVE WE ALREADY REMOVED THIS ONE"
    # That matches the persistent green banner pinned to top of map!

    with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success")

remove_banners()
