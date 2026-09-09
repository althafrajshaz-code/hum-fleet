import sys, re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8', errors='replace') as f:
    text = f.read()

# Fix fetch(${API_BASE} to fetch(`${API_BASE}
text = re.sub(r'fetch\(\$\{API_BASE\}', r'fetch(`${API_BASE}', text)

# What about the closing backtick? 
# fetch(`${API_BASE}/api/drivers/profile, {
# It should be profile`, {
text = re.sub(r'fetch\(`\$\{API_BASE\}([^,]+),\s*\{', r'fetch(`${API_BASE}\1`, {', text)
text = re.sub(r'fetch\(`\$\{API_BASE\}([^,]+)\)', r'fetch(`${API_BASE}\1`)', text)

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
