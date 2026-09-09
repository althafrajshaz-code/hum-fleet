import re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

regex = r'\{\/\* Offline status screen \*\/\}\s*\{!isOnline && \(\s*<div.*?<\/div>\s*\)\}'
text = re.sub(regex, '', text, flags=re.DOTALL)

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
