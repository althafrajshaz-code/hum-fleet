import re
import os

helper_code = r'''const getPlatformFee = (fare) => {
  const f = parseFloat(fare || 0);
  if (f >= 1500) return 25;
  if (f >= 1000) return 20;
  if (f >= 500) return 15;
  if (f >= 200) return 10;
  return 5;
};'''

helper_backend = r'''const getPlatformFee = (fare) => {
  const f = parseFloat(fare || 0);
  if (f >= 1500) return 25;
  if (f >= 1000) return 20;
  if (f >= 500) return 15;
  if (f >= 200) return 10;
  return 5;
};'''

# 1. DriverDashboard
with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    dd = f.read()

if 'const getPlatformFee' not in dd:
    dd = dd.replace("const getRideBase = (ride) => {", helper_code + "\n\n  const getRideBase = (ride) => {")

# Replace ternary logic
dd = re.sub(r'recalculatedMinFare >= 1500 \? 20 : \(recalculatedMinFare > 500 \? 15 : 10\)', r'getPlatformFee(recalculatedMinFare)', dd)
dd = re.sub(r'parseFloat\(incomingRide\.fare\) >= 1500 \? 20 : parseFloat\(incomingRide\.fare\) > 500 \? 15 : 10', r'getPlatformFee(incomingRide.fare)', dd)

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(dd)

# 2. Server
with open('server/index.js', 'r', encoding='utf-8') as f:
    server = f.read()

if 'const getPlatformFee' not in server:
    server = server.replace("let vehicleCategories = [", helper_backend + "\n\nlet vehicleCategories = [")

# Replace in summarise
server = re.sub(r'parseFloat\(r\.commission \|\| \(parseFloat\(r\.fare \|\| 0\) > 1500 \? 25 : \(parseFloat\(r\.fare \|\| 0\) > 1000 \? 20 : 10\)\)\)', r'parseFloat(r.commission || getPlatformFee(r.fare))', server)

# Replace in ride complete block
block_target = r'''      // Calculate Platform Fee (Commission) based on tiers
      let commission = 10;
      if (finalFare > 1500) {
        commission = 25;
      } else if (finalFare > 1000) {
        commission = 20;
      }'''

block_replace = r'''      // Calculate Platform Fee (Commission) based on tiers
      let commission = getPlatformFee(finalFare);'''

server = server.replace(block_target, block_replace)

with open('server/index.js', 'w', encoding='utf-8') as f:
    f.write(server)

print("Replaced logic in driver and backend.")
