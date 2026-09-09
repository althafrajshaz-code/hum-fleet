import re

def reapply_changes():
    with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix polling
    content = content.replace("const interval = setInterval(fetchTripChatMessages, 2000);", "const interval = setInterval(fetchTripChatMessages, 1000);")
    
    # Remove SOS button
    pattern = re.compile(r"\{\/\* SOS BUTTON \(Visible only when ride is active/accepted\) \*\/\}[\s\S]*?<\/button>\s*\)\}", re.MULTILINE)
    content = pattern.sub('', content)
    
    with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

reapply_changes()
