import sys

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("`1px solid ${isDailyVerified ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`", "'1px solid ' + (isDailyVerified ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)')")
text = text.replace("`1px solid ${msg.sender.includes('Admin') ? 'rgba(59, 130, 246, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`", "'1px solid ' + (msg.sender.includes('Admin') ? 'rgba(59, 130, 246, 0.25)' : 'rgba(16, 185, 129, 0.25)')")

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
