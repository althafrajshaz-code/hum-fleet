import re

def update_driver_summary():
    with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    old_ui = '''                          const baseTotal = parseFloat(currentRide.totalKm || 8.0);
                          const liveDist = parseFloat(liveGpsDistance || 0);
                          const finalDist = liveDist > 0 ? liveDist : baseTotal;
                          
                          const rate = parseFloat(driverDetails?.ratePerKm || 15.00);
                          
                          let recalculatedMinFare = finalDist * rate;
                          if (currentRide.isIntercity) recalculatedMinFare += 250;'''
                          
    new_ui = '''                          const baseTotal = parseFloat(currentRide.totalKm || 8.0);
                          const liveDist = parseFloat(liveGpsDistance || 0);
                          const finalDist = liveDist > 0 ? liveDist : baseTotal;
                          
                          const rate = parseFloat(driverDetails?.ratePerKm || 15.00);
                          
                          let catBase = 50.00; // Default base fare
                          if (currentRide.vehicleCategory && currentRide.vehicleCategory.includes('Auto')) catBase = 30.00;
                          if (currentRide.vehicleCategory && currentRide.vehicleCategory.includes('SUV')) catBase = 70.00;
                          
                          let recalculatedMinFare = catBase + (finalDist * rate);
                          if (currentRide.isIntercity) recalculatedMinFare += 250;'''

    content = content.replace(old_ui, new_ui)
    
    with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
        
update_driver_summary()
