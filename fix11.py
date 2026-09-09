import sys

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8', errors='replace') as f:
    text = f.read()

# Replace all `1px solid ${ ... }`
text = text.replace("`1px solid ${isDailyVerified ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`", "'1px solid ' + (isDailyVerified ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)')")

# Let's also check for other template literals causing problems in styles!
# Like `1px solid ${color}25`
text = text.replace("`1px solid ${color}25`", "'1px solid ' + color + '25'")
text = text.replace("`${color}08`", "color + '08'")

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
