import sys
with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: Remove duplicate UI block
start_str = "                  ) : (currentRide.status === 'Accepted' || currentRide.status === 'Arrived') ? ("
end_str = "                  ) : (\n                    <>\n                      <h3 style={{ color: '#3b82f6' }}>Trip in Progress</h3>"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + "                  ) : currentRide.status === 'In Progress' ? (\n                    <>\n                      <h3 style={{ color: '#3b82f6' }}>Trip in Progress</h3>" + content[end_idx + len(end_str):]
    print("Fix 1 (Duplicate UI) applied!")
else:
    print("Fix 1 not found.")

# Fix 2: active-ride-card condition
old_cond = "{isOnline && currentRide && !showRating && (\n                <div id=\"active-ride-card\""
new_cond = "{isOnline && currentRide && !showRating && (currentRide.status === 'In Progress' || showEndTripSummary) && (\n                <div id=\"active-ride-card\""

if old_cond in content:
    content = content.replace(old_cond, new_cond)
    print("Fix 2 (Condition) applied!")
else:
    print("Fix 2 not found.")

# Fix 3: liveGpsDistance init
old_init = "if (liveGpsDistance === 0 && currentRide.totalKm) {\n      setLiveGpsDistance(parseFloat(currentRide.totalKm) || 0);\n    }"
new_init = "if (liveGpsDistance === 0 && currentRide.totalKm) {\n      // FIXED: liveGpsDistance must start at 0\n    }"

if old_init in content:
    content = content.replace(old_init, new_init)
    print("Fix 3 (liveGpsDistance) applied!")
else:
    print("Fix 3 not found.")

# Fix 4: Taximeter labels (Est. Distance -> Current Distance)
if "Est. Distance" in content:
    content = content.replace("Est. Distance", "Current Distance")
    content = content.replace("Est. Fare", "Current Fare")
    content = content.replace(
        "{(liveGpsDistance > 0 ? liveGpsDistance : parseFloat(currentRide.totalKm || 8.0)).toFixed(2)}",
        "{(liveGpsDistance > 0 ? liveGpsDistance : 0.00).toFixed(2)}"
    )
    content = content.replace(
        "{((liveGpsDistance > 0 ? liveGpsDistance : parseFloat(currentRide.totalKm || 8.0)) * parseFloat(driverDetails?.ratePerKm || 15.00)",
        "{((liveGpsDistance > 0 ? liveGpsDistance : 0.00) * parseFloat(driverDetails?.ratePerKm || 15.00)"
    )
    print("Fix 4 (Taximeter) applied!")
else:
    print("Fix 4 not found.")

# Fix 5: Polling block 
old_poll = "if (currentRide) {\n      const baseTotal = parseFloat(currentRide.totalKm || 8.0);"
new_poll = "if (currentRide) {\n      if (currentRide.status === 'Accepted' || currentRide.status === 'Arrived') return;\n      const baseTotal = parseFloat(currentRide.totalKm || 8.0);"

if old_poll in content:
    content = content.replace(old_poll, new_poll)
    print("Fix 5 (Polling) applied!")
else:
    print("Fix 5 not found.")

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
