import sys

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("`Star ${driverDetails?.rating || '5.0'}`", "'Star ' + (driverDetails?.rating || '5.0')")

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
