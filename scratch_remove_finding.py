import re

def remove_finding_nearest():
    with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find the block
    pattern = re.compile(r"\{isSearching && \([\s\S]*?Finding Nearest Driver Coordinates\.\.\.[\s\S]*?<\/div>\s*\)\}", re.MULTILINE)
    
    if pattern.search(content):
        content = pattern.sub('', content)
        with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Success")
    else:
        print("Not found")

remove_finding_nearest()
