import sys, re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r'\{systemSettings\.qrCodeUrl && \(\s*<div style=\{\{ textAlign: \'center\', marginTop: \'10px\' \}\}>\s*<img src=\{systemSettings\.qrCodeUrl\}[^\}]+\}\s*/>\s*<div[^>]+>Scan with GPay, PhonePe, Paytm, etc\.</div>\s*</div>\s*\)\}', '', text, flags=re.DOTALL)

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
