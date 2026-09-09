import sys

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# Replace the actual star string
text = text.replace("`★ ${driverDetails?.rating || '5.0'}`", "`${String.fromCharCode(9733)} ${driverDetails?.rating || '5.0'}`")

# Also just in case there's any other strange character
text = text.replace("★", "")
text = text.replace("—", "-")

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
