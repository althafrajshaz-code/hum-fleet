import re

def remove_vehicle_preview():
    with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = re.compile(r"\{\/\* Vehicle Image Preview \*\/\}[\s\S]*?<\/div>\s*<\/div>", re.MULTILINE)
    
    if pattern.search(content):
        content = pattern.sub('', content)
        with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Success")
    else:
        print("Not found")

remove_vehicle_preview()
