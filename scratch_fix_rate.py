import re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r'''  const getRideRate = (ride) => {
    if (!ride) return parseFloat(driverDetails?.ratePerKm || 15.00);
    const catName = ride.category || ride.vehicleCategory;
    if (systemSettings && systemSettings.categories) {
      const cat = systemSettings.categories.find(c => c.name === catName);
      if (cat && cat.ratePerKm !== undefined) return parseFloat(cat.ratePerKm);
    }
    return parseFloat(driverDetails?.ratePerKm || 15.00);
  };

  const getRideBase = (ride) => {
    if (!ride) return 50.00;
    const catName = ride.category || ride.vehicleCategory;
    if (systemSettings && systemSettings.categories) {
      const cat = systemSettings.categories.find(c => c.name === catName);
      if (cat && cat.baseFare !== undefined) return parseFloat(cat.baseFare);
    }
    let b = 50.00;
    if (catName && 'Auto' in catName) b = 30.00;
    if (catName && 'SUV' in catName) b = 70.00;
    return b;
  };'''

replacement = r'''  const getRideRate = (ride) => {
    if (!ride) return parseFloat(driverDetails?.ratePerKm || 15.00);
    const catName = ride.category || ride.vehicleCategory;
    if (availableCategories && availableCategories.length > 0) {
      const cat = availableCategories.find(c => c.name === catName);
      if (cat && cat.ratePerKm !== undefined) return parseFloat(cat.ratePerKm);
    }
    return parseFloat(driverDetails?.ratePerKm || 15.00);
  };

  const getRideBase = (ride) => {
    if (!ride) return 50.00;
    const catName = ride.category || ride.vehicleCategory;
    if (availableCategories && availableCategories.length > 0) {
      const cat = availableCategories.find(c => c.name === catName);
      if (cat && cat.baseFare !== undefined) return parseFloat(cat.baseFare);
    }
    let b = 50.00;
    if (catName && catName.includes('Auto')) b = 30.00;
    if (catName && catName.includes('SUV')) b = 70.00;
    return b;
  };'''

if target in content:
    content = content.replace(target, replacement)
    with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success")
else:
    print("Target not found")
