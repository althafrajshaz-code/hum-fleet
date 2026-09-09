import sys

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8', errors='replace') as f:
    text = f.read()

# Replace fetch(`${API_BASE}/...`) with fetch(API_BASE + '/...')
text = text.replace("fetch(`${API_BASE}", "fetch(API_BASE + `")

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
