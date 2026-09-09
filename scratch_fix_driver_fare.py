import re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Inject helper functions
helpers = r'''  const getRideRate = (ride) => {
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
  };
'''

content = content.replace("const [currentRide, setCurrentRide] = useState(null);", "const [currentRide, setCurrentRide] = useState(null);\n\n" + helpers)

# 2. Replace the duplicated calculation logic (3 instances)
target_calc = r'''const rate = parseFloat(driverDetails?.ratePerKm || 15.00);
                let catBase = 50.00; // Default base fare
                if (currentRide.vehicleCategory && currentRide.vehicleCategory.includes('Auto')) catBase = 30.00;
                if (currentRide.vehicleCategory && currentRide.vehicleCategory.includes('SUV')) catBase = 70.00;'''

# Because of indentation differences, use a regex
pattern_calc = re.compile(r"const rate = parseFloat\(driverDetails\?\.ratePerKm \|\| 15\.00\);\s*let catBase = 50\.00; \/\/ Default base fare\s*if \(currentRide\.vehicleCategory && currentRide\.vehicleCategory\.includes\('Auto'\)\) catBase = 30\.00;\s*if \(currentRide\.vehicleCategory && currentRide\.vehicleCategory\.includes\('SUV'\)\) catBase = 70\.00;")
content = pattern_calc.sub("const rate = getRideRate(currentRide);\n                          let catBase = getRideBase(currentRide);", content)

# 3. Replace the UI block for Est Fare and Rate
target_ui = r'''                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>
                              Rate: ₹{parseFloat(driverDetails?.ratePerKm || 15.00).toFixed(2)}/KM
                            </span>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'center', paddingTop: '4px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Est. Distance</span>
                              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                {(liveGpsDistance > 0 ? liveGpsDistance : parseFloat(currentRide.totalKm || 8.0)).toFixed(2)} <span style={{ fontSize: '12px', color: '#10b981' }}>KM</span>
                              </div>
                            </div>
                            <div style={{ width: '1px', background: 'rgba(59, 130, 246, 0.2)', margin: '0 8px' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Est. Fare</span>
                              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                ₹{((liveGpsDistance > 0 ? liveGpsDistance : parseFloat(currentRide.totalKm || 8.0)) * parseFloat(driverDetails?.ratePerKm || 15.00) + (currentRide.isIntercity ? 250 : 0)).toFixed(2)}
                              </div>
                            </div>
                          </div>'''

# Again, regex because of indentation/whitespace
pattern_ui = re.compile(r"Rate: â‚¹\{parseFloat\(driverDetails\?\.ratePerKm \|\| 15\.00\)\.toFixed\(2\)\}\/KM[\s\S]*?â‚¹\{\(\(liveGpsDistance > 0 \? liveGpsDistance : parseFloat\(currentRide\.totalKm \|\| 8\.0\)\) \* parseFloat\(driverDetails\?\.ratePerKm \|\| 15\.00\) \+ \(currentRide\.isIntercity \? 250 : 0\)\)\.toFixed\(2\)\}")

replacement_ui = r'''Rate: ₹{getRideRate(currentRide).toFixed(2)}/KM
                            </span>
                          </div>
  
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'center', paddingTop: '4px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Est. Distance</span>
                              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                {(liveGpsDistance > 0 ? liveGpsDistance : parseFloat(currentRide.totalKm || 8.0)).toFixed(2)} <span style={{ fontSize: '12px', color: '#10b981' }}>KM</span>
                              </div>
                            </div>
                            <div style={{ width: '1px', background: 'rgba(59, 130, 246, 0.2)', margin: '0 8px' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Est. Fare</span>
                              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                ₹{(getRideBase(currentRide) + ((liveGpsDistance > 0 ? liveGpsDistance : parseFloat(currentRide.totalKm || 8.0)) * getRideRate(currentRide)) + (currentRide.isIntercity ? 250 : 0)).toFixed(2)}'''

content = pattern_ui.sub(replacement_ui, content)

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Success")

