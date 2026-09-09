import re

with open('server/index.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = r'''    const summarise = (rides) => ({
      count: rides.length,
      gross: rides.reduce((s, r) => s + parseFloat(r.fare || 0), 0).toFixed(2),
      commission: (rides.reduce((s, r) => s + parseFloat(r.fare || 0), 0) * 0.10).toFixed(2),
      net: (rides.reduce((s, r) => s + parseFloat(r.fare || 0), 0) * 0.90).toFixed(2),
      rides: rides.map(r => ({'''

replacement = r'''    const summarise = (rides) => ({
      count: rides.length,
      gross: rides.reduce((s, r) => s + parseFloat(r.fare || 0), 0).toFixed(2),
      commission: rides.reduce((s, r) => s + parseFloat(r.commission || (parseFloat(r.fare || 0) > 1500 ? 25 : (parseFloat(r.fare || 0) > 1000 ? 20 : 10))), 0).toFixed(2),
      net: (rides.reduce((s, r) => s + parseFloat(r.fare || 0), 0) - rides.reduce((s, r) => s + parseFloat(r.commission || (parseFloat(r.fare || 0) > 1500 ? 25 : (parseFloat(r.fare || 0) > 1000 ? 20 : 10))), 0)).toFixed(2),
      rides: rides.map(r => ({'''

if target in content:
    content = content.replace(target, replacement)
    print("Backend earnings logic updated.")
else:
    print("Target not found in backend.")

with open('server/index.js', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("Your net earnings after 10% commission", "Your net earnings after platform commission")
content = content.replace("Commission (10%)", "Platform Commission")

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Frontend labels updated.")

