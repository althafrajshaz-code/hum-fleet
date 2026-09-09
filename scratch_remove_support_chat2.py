import re

with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r"\{\/\* FLOATING SUPPORT CHAT BUTTON \*\/\}[\s\S]*?\{\/\* MID-TRIP CHANGE \/ UPDATE DESTINATION MODAL DIALOG \*\/\}", re.MULTILINE)

replacement = r"{/* MID-TRIP CHANGE / UPDATE DESTINATION MODAL DIALOG */}"

if pattern.search(content):
    content = pattern.sub(replacement, content)
    with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success")
else:
    print("Not found")

