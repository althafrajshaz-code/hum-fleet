import sys, re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("fetch(`${API_BASE}/api/drivers/profile`, {", "fetch(API_BASE + '/api/drivers/profile', {")

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
