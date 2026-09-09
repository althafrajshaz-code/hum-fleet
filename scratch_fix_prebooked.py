import re

def fix_prebooked():
    with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # The line with DL 3C
    old_line = "vehiclePlate: driverDetails.activeVehicle?.plateNo || 'DL 3C AY 4567'"
    new_line = "vehiclePlate: driverDetails.plate || 'Unknown Plate'"

    if old_line in content:
        content = content.replace(old_line, new_line)
        with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Fixed prebooked")
    else:
        print("Not found")

fix_prebooked()
