with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("{activeRide.driverName || 'Rajesh Kumar'}", "{activeRide.driverName || 'Not provided'}")
content = content.replace("{activeRide.vehicleModel || 'Tata Nexon'}", "{activeRide.vehicleModel || 'Unknown Vehicle'}")
content = content.replace("{activeRide.vehiclePlate || 'DL 3C AY 4567'}", "{activeRide.vehiclePlate || 'Not provided'}")
content = content.replace("{activeRide.driverPhone || '+91 98765 43210'}", "{activeRide.driverPhone || 'Not provided'}")
content = content.replace("{activeRide.driverName || 'R'}", "{activeRide.driverName || 'HUM'}")

with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Success")
