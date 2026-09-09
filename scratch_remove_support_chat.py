import re

with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the floating support chat button and window
pattern = re.compile(r"\{\/\* FLOATING SUPPORT CHAT BUTTON \*\/\}[\s\S]*?\{\/\* QUICK ACTIONS / HISTORY DRAWER \*\/\}", re.MULTILINE)

replacement = r"{/* QUICK ACTIONS / HISTORY DRAWER */}"

if pattern.search(content):
    content = pattern.sub(replacement, content)
    with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success")
else:
    print("Not found")

