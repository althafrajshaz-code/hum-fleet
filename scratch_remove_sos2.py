import re

def remove_sos():
    with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = re.compile(r"\{\/\* SOS BUTTON \(Visible only when ride is active/accepted\) \*\/\}[\s\S]*?<\/button>\s*\)\}", re.MULTILINE)
    
    if pattern.search(content):
        content = pattern.sub('', content)
        with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Success")
    else:
        print("Not found")

remove_sos()
