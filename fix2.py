import sys
with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('style={{ display: "none",  display: "none", padding: "18px 14px",', 'style={{ padding: "18px 14px",')
text = text.replace('style={{ display: "none", display: "none", padding: "18px 14px",', 'style={{ padding: "18px 14px",')

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
