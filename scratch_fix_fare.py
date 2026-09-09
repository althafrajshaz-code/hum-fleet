import sys

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: End Trip Summary Calculation
old_summary_calc = """                        {(() => {
                          const baseTotal = parseFloat(currentRide.totalKm || 8.0);
                          const liveDist = parseFloat(liveGpsDistance || 0);
                          const finalDist = liveDist > 0 ? liveDist : baseTotal;
                          
                          const rate = parseFloat(driverDetails?.ratePerKm || 15.00);
                          
                          let recalculatedMinFare = finalDist * rate;
                          if (currentRide.isIntercity) recalculatedMinFare += 250;
                          
                          const tipAmount = parseFloat(currentRide.driverTip || 0);
                          
                          // Tax is ONLY on the recalculated base fare
                          const tax = recalculatedMinFare * 0.05;
                          
                          // Total to collect is Base + Tip + Tax
                          const total = recalculatedMinFare + tipAmount + tax;"""

new_summary_calc = """                        {(() => {
                          const baseTotal = parseFloat(currentRide.totalKm || 8.0);
                          const liveDist = parseFloat(liveGpsDistance || 0);
                          const finalDist = liveDist > 0 ? liveDist : baseTotal;
                          
                          const rate = parseFloat(driverDetails?.ratePerKm || 15.00);
                          
                          let recalculatedMinFare = parseFloat(currentRide.fare || (finalDist * rate + (currentRide.isIntercity ? 250 : 0)));
                          if (liveDist > baseTotal) {
                            recalculatedMinFare += (liveDist - baseTotal) * rate;
                          }
                          
                          const tipAmount = parseFloat(currentRide.driverTip || 0);
                          const platformFee = parseFloat(currentRide.platformFee || (recalculatedMinFare >= 1500 ? 20 : recalculatedMinFare > 500 ? 15 : 10));
                          
                          // Tax is ONLY on the recalculated base fare
                          const tax = recalculatedMinFare * 0.05;
                          
                          // Total to collect is Base + Tax + Platform Fee + Tip
                          const total = recalculatedMinFare + tax + platformFee + tipAmount;"""

if old_summary_calc in content:
    content = content.replace(old_summary_calc, new_summary_calc)
    print("Fix 1 (End Trip Calc) applied!")
else:
    print("Fix 1 NOT applied!")

# Fix 1b: Add platform fee to End Trip Summary UI
old_summary_ui = """                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span>GST Tax (5%):</span>
                                  <span>+INR {tax.toFixed(2)}</span>
                                </div>"""
new_summary_ui = """                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span>GST Tax (5%):</span>
                                  <span>+INR {tax.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span>Platform Fee:</span>
                                  <span>+INR {platformFee.toFixed(2)}</span>
                                </div>"""
if old_summary_ui in content:
    content = content.replace(old_summary_ui, new_summary_ui)
    print("Fix 1b (End Trip UI) applied!")
else:
    print("Fix 1b NOT applied!")

# Fix 2: Trip in Progress breakdown
old_trip_ui = """                             <div>✅ Base Price: INR {parseFloat(currentRide.fare).toFixed(2)}</div>
                             {parseFloat(currentRide.driverTip) > 0 && <div>✅ Driver Tip: +INR {parseFloat(currentRide.driverTip).toFixed(2)}</div>}
                             <div>✅ GST Tax (5%): +INR {(parseFloat(currentRide.fare) * 0.05).toFixed(2)}</div>
                             <div style={{ borderTop: '1px solid rgba(59, 130, 246, 0.3)', marginTop: '4px', paddingTop: '4px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                               ✅ Collect Cash: INR {(parseFloat(currentRide.fare) * 1.05 + parseFloat(currentRide.driverTip || 0)).toFixed(2)}
                             </div>"""

new_trip_ui = """                             <div>✅ Base Price: INR {parseFloat(currentRide.fare).toFixed(2)}</div>
                             {parseFloat(currentRide.driverTip) > 0 && <div>✅ Driver Tip: +INR {parseFloat(currentRide.driverTip).toFixed(2)}</div>}
                             <div>✅ GST Tax (5%): +INR {(parseFloat(currentRide.fare) * 0.05).toFixed(2)}</div>
                             <div>✅ Platform Fee: +INR {parseFloat(currentRide.platformFee || (parseFloat(currentRide.fare) >= 1500 ? 20 : parseFloat(currentRide.fare) > 500 ? 15 : 10)).toFixed(2)}</div>
                             <div style={{ borderTop: '1px solid rgba(59, 130, 246, 0.3)', marginTop: '4px', paddingTop: '4px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                               ✅ Collect Cash: INR {(parseFloat(currentRide.fare) * 1.05 + parseFloat(currentRide.driverTip || 0) + parseFloat(currentRide.platformFee || (parseFloat(currentRide.fare) >= 1500 ? 20 : parseFloat(currentRide.fare) > 500 ? 15 : 10))).toFixed(2)}
                             </div>"""

if old_trip_ui in content:
    content = content.replace(old_trip_ui, new_trip_ui)
    print("Fix 2 (Trip UI) applied!")
else:
    print("Fix 2 NOT applied!")

# Fix 3: Trip in Progress Total Fare text
old_total_fare = """<div className="req-price est-price" style={{ color: '#3b82f6', marginTop: '8px', textAlign: 'center' }}>Total Fare: INR {(parseFloat(currentRide.fare) + parseFloat(currentRide.driverTip || 0)).toFixed(2)}</div>"""
new_total_fare = """<div className="req-price est-price" style={{ color: '#3b82f6', marginTop: '8px', textAlign: 'center' }}>Total Fare: INR {(parseFloat(currentRide.fare) * 1.05 + parseFloat(currentRide.driverTip || 0) + parseFloat(currentRide.platformFee || (parseFloat(currentRide.fare) >= 1500 ? 20 : parseFloat(currentRide.fare) > 500 ? 15 : 10))).toFixed(2)}</div>"""

if old_total_fare in content:
    content = content.replace(old_total_fare, new_total_fare)
    print("Fix 3 (Total Fare) applied!")
else:
    print("Fix 3 NOT applied!")


with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
