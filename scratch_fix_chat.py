with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("{activeRide.driverName || 'Rajesh Kumar'}", "{activeRide.driverName || 'Driver'}")
content = content.replace("{activeRide.vehiclePlate || 'DL 3C AY 4567'}", "{activeRide.vehiclePlate || 'Unknown Plate'}")

with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
