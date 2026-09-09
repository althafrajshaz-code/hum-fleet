import sys

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    "const driverRate = parseFloat(driverDetails?.ratePerKm || 0);",
    "const driverCat = availableCategories.find(c => String(c.id).toLowerCase() === String(driverDetails?.vehicleCategory || '').toLowerCase() || String(c.name).toLowerCase() === String(driverDetails?.vehicleCategory || '').toLowerCase());\n                          const driverRate = parseFloat(driverCat?.ratePerKm || 0);"
)

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
