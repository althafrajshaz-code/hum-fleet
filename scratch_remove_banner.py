import re

def remove_persistent_banner():
    with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # We need to remove the block starting with {/* VEHICLE ARRIVING — persistent green banner pinned to top of map when driver accepts */}
    # up to the end of the condition block.
    # We can match {rideAccepted && activeRide && !showRating && (\s*<div style={{\s*position: 'absolute',\s*top: '16px'[\s\S]*?<\/div>\s*\)\}
    
    pattern = re.compile(r"\{\/\* VEHICLE ARRIVING[\s\S]*?LIVE\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\}", re.MULTILINE)
    
    if pattern.search(content):
        content = pattern.sub('', content)
        with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Removed persistent banner via regex.")
    else:
        print("Pattern not found. Let's try replacing a specific chunk manually or using another regex.")

remove_persistent_banner()
