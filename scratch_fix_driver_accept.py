import re

def fix_driver_accept():
    with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # The original string we want to replace
    # vehicleModel: driverDetails.activeVehicle?.model || 'Tata Nexon',
    # vehiclePlate: driverDetails.activeVehicle?.plateNo || driverDetails.activeVehicle?.plate || 'DL 3C AY 4567'
    
    old_model = "vehicleModel: driverDetails.activeVehicle?.model || 'Tata Nexon',"
    new_model = "vehicleModel: (driverDetails.manufacturer ? driverDetails.manufacturer + ' ' + driverDetails.model : driverDetails.model) || 'Unknown Vehicle',"
    
    old_plate = "vehiclePlate: driverDetails.activeVehicle?.plateNo || driverDetails.activeVehicle?.plate || 'DL 3C AY 4567'"
    new_plate = "vehiclePlate: driverDetails.plate || 'Unknown Plate'"

    if old_model in content:
        content = content.replace(old_model, new_model)
        content = content.replace(old_plate, new_plate)
        with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Fixed vehicle details in driver accept.")
    else:
        print("Could not find the target code.")

fix_driver_accept()
