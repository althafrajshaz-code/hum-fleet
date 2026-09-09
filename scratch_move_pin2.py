import re

with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Strip the first one
pattern = re.compile(r"\{\/\* PINNED VERIFICATION PIN \/ CUSTOMER ID \*\/\}[\s\S]*?\{passengerId\}[\s\S]*?<\/span>[\s\S]*?<\/div>\s*\)\}", re.MULTILINE)

content = pattern.sub('', content, count=1)

with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Success")
