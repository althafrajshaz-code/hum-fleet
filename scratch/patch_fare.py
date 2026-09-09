import sys, re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_calc = r"const baseTotal = parseFloat\(currentRide\.totalKm \|\| 8\.0\);\s*const liveDist = parseFloat\(liveGpsDistance \|\| 0\);\s*const finalDist = liveDist > 0 \? liveDist : baseTotal;\s*const rate = getRideRate\(currentRide\);\s*let catBase = getRideBase\(currentRide\);\s*let recalculatedMinFare = catBase \+ \(finalDist \* rate\);\s*if \(currentRide\.isIntercity\) recalculatedMinFare \+= 275;\s*const tipAmount = parseFloat\(currentRide\.driverTip \|\| 0\);\s*const platformFee = 0;\s*const tax = 0;\s*const tripFare = recalculatedMinFare \+ platformFee \+ tax;"

new_calc = """const baseTotal = parseFloat(currentRide.totalKm || 8.0);
                          const liveDist = parseFloat(liveGpsDistance || 0);
                          const finalDist = liveDist > 0 ? liveDist : baseTotal;
                          
                          let tripFare = parseFloat(currentRide.fare || 0);
                          
                          if (liveDist > 0 && Math.abs(liveDist - baseTotal) > 0.5) {
                            const rate = getRideRate(currentRide);
                            let catBase = getRideBase(currentRide);
                            let recalculatedMinFare = catBase + (liveDist * rate);
                            if (currentRide.isIntercity) recalculatedMinFare += 275;
                            tripFare = recalculatedMinFare;
                          }
                          
                          const tipAmount = parseFloat(currentRide.driverTip || 0);"""

if re.search(old_calc, text):
    text = re.sub(old_calc, new_calc, text)
    print("Replaced fare calculation in modal")
else:
    print("Could not find old calculation in modal")

old_invoice = r"const finalDist = liveDist > 0 \? liveDist : baseTotal;\s*const rate = getRideRate\(currentRide\);\s*let catBase = getRideBase\(currentRide\);\s*let recalculatedMinFare = catBase \+ \(finalDist \* rate\);\s*if \(currentRide\.isIntercity\) recalculatedMinFare \+= 275;\s*const platformFee = 0;\s*const tax = 0;\s*const tripFare = recalculatedMinFare \+ platformFee \+ tax;"

new_invoice = """const finalDist = liveDist > 0 ? liveDist : baseTotal;
                      
                      let tripFare = parseFloat(currentRide.fare || 0);
                      if (liveDist > 0 && Math.abs(liveDist - baseTotal) > 0.5) {
                          const rate = getRideRate(currentRide);
                          let catBase = getRideBase(currentRide);
                          let recalculatedMinFare = catBase + (liveDist * rate);
                          if (currentRide.isIntercity) recalculatedMinFare += 275;
                          tripFare = recalculatedMinFare;
                      }"""

if re.search(old_invoice, text):
    text = re.sub(old_invoice, new_invoice, text)
    print("Replaced fare calculation in invoice")
else:
    print("Could not find old calculation in invoice")

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
