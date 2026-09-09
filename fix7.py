import sys, re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8', errors='replace') as f:
    text = f.read()

# Fix the rating line by completely rewriting it to be clean ASCII
text = re.sub(r'\{\[\[\'Email\', driverDetails\?\.email[^\n]*\n', "{[['Email', driverDetails?.email || '-'], ['Rating', 'Star ' + (driverDetails?.rating || '5.0')], ['Status', driverDetails?.status || 'Approved']].map(([label, val]) => (\\n", text)

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
