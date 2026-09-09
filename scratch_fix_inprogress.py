import re

with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix initial fetch
pattern1 = re.compile(r"if \(data\.status === 'Accepted' \|\| data\.status === 'Arrived'\) \{")
content = pattern1.sub("if (data.status === 'Accepted' || data.status === 'Arrived' || data.status === 'In Progress') {", content)

with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Success")
