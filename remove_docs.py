import sys, re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r'<button[^>]*onClick=\{\(\) => setSettingsSubTab\(\'documents\'\)\}[^>]*>.*?Docs & Photos\s*</button>', '', text, flags=re.DOTALL)

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
