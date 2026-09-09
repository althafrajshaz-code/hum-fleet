const fs = require('fs');

// --- DRIVER DASHBOARD ---
let contentDriver = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

contentDriver = contentDriver.replace(/const tax = recalculatedMinFare \* 0.05;/g, 'const tax = 0;');
contentDriver = contentDriver.replace(/const platformFee = getPlatformFee\(recalculatedMinFare\);/g, 'const platformFee = 0;');
contentDriver = contentDriver.replace(/\{\(parseFloat\(incomingRide\.fare\) \* 1\.05 \+ parseFloat\(incomingRide\.driverTip \|\| 0\) \+ getPlatformFee\(incomingRide\.fare\)\)\.toFixed\(2\)\}/g, '{(parseFloat(incomingRide.fare) + parseFloat(incomingRide.driverTip || 0)).toFixed(2)}');
contentDriver = contentDriver.replace(/\{\(parseFloat\(currentRide\.fare\) \* 1\.05 \+ parseFloat\(currentRide\.driverTip \|\| 0\)\)\.toFixed\(2\)\}/g, '{(parseFloat(currentRide.fare) + parseFloat(currentRide.driverTip || 0)).toFixed(2)}');
contentDriver = contentDriver.replace(/\{\(parseFloat\(incomingRide\.fare\) \* 1\.05 \+ parseFloat\(incomingRide\.driverTip \|\| 0\)\)\.toFixed\(2\)\}/g, '{(parseFloat(incomingRide.fare) + parseFloat(incomingRide.driverTip || 0)).toFixed(2)}'); // fallback

fs.writeFileSync('src/pages/DriverDashboard.jsx', contentDriver);

// --- PASSENGER DASHBOARD ---
let contentPassenger = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

// Line 1969
contentPassenger = contentPassenger.replace(/\{\(parseFloat\(calculateCategoryFare\(categories\.find\(c => c\.name === selectedTier\) \|\| categories\[0\]\)\) \* 1\.05 \+ \(parseFloat\(customFare\) \|\| 0\) \+ getPlatformFee\(calculateCategoryFare\(categories\.find\(c => c\.name === selectedTier\) \|\| categories\[0\]\)\)\)\.toFixed\(2\)\}/g, '{(parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])) + (parseFloat(customFare) || 0)).toFixed(2)}');

// Line 2090
contentPassenger = contentPassenger.replace(/\{parseFloat\(activeRide\.totalCollected \|\| \(parseFloat\(activeRide\.fare \|\| 0\) \* 1\.05 \+ parseFloat\(activeRide\.driverTip \|\| 0\) \+ getPlatformFee\(activeRide\.fare \|\| 0\)\)\)\.toFixed\(2\)\}/g, '{parseFloat(activeRide.totalCollected || (parseFloat(activeRide.fare || 0) + parseFloat(activeRide.driverTip || 0))).toFixed(2)}');

fs.writeFileSync('src/pages/PassengerDashboard.jsx', contentPassenger);
