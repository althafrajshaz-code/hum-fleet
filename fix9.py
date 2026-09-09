import sys, re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8', errors='replace') as f:
    text = f.read()

# Fix double backticks
text = text.replace('``, {', '`, {')
text = text.replace('``)', '`)')

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
