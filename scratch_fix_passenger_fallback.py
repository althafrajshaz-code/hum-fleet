import re

def fix_passenger_fallback():
    with open('src/pages/PassengerDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # We will replace the fallbacks in PassengerDashboard.jsx so we know if it's falsy
    old_vehicle = "<div><strong>Vehicle:</strong> {activeRide.vehicleModel || 'Tata Nexon'}</div>"
    new_vehicle = "<div><strong>Vehicle:</strong> {activeRide.vehicleModel || 'Not provided by driver'}</div>"
    
    old_plate = "<div><strong>Plate No:</strong> <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{activeRide.vehiclePlate || 'DL 3C AY 4567'}</span></div>"
    new_plate = "<div><strong>Plate No:</strong> <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{activeRide.vehiclePlate || 'Not provided by driver'}</span></div>"
    
    old_phone = "<div><strong>Phone:</strong> {activeRide.driverPhone || '+91 98765 43210'}</div>"
    new_phone = "<div><strong>Phone:</strong> {activeRide.driverPhone || 'Not provided'}</div>"

    content = content.replace(old_vehicle, new_vehicle)
    content = content.replace(old_plate, new_plate)
    content = content.replace(old_phone, new_phone)
    
    with open('src/pages/PassengerDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

fix_passenger_fallback()
