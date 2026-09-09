const fs = require('fs');

// --- DRIVER DASHBOARD ---
let contentDriver = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// Fix tax = 0 to tax = recalculatedMinFare * 0.05
contentDriver = contentDriver.replace(/const tax = 0;/g, 'const tax = recalculatedMinFare * 0.05;');

// Fix New Ride Request modal total
let oldIncomingFare = `{(parseFloat(incomingRide.fare) * 1.05 + parseFloat(incomingRide.driverTip || 0)).toFixed(2)}`;
let newIncomingFare = `{(parseFloat(incomingRide.fare) * 1.05 + parseFloat(incomingRide.driverTip || 0) + getPlatformFee(incomingRide.fare)).toFixed(2)}`;
if (contentDriver.includes(oldIncomingFare)) {
    contentDriver = contentDriver.replace(oldIncomingFare, newIncomingFare);
    console.log("Fixed Driver incoming ride fare");
}

fs.writeFileSync('src/pages/DriverDashboard.jsx', contentDriver);

// --- PASSENGER DASHBOARD ---
let contentPassenger = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

// Fix Active Ride Summary total
let oldActiveFare = `{parseFloat(activeRide.totalCollected || (parseFloat(activeRide.fare || 0) * 1.05)).toFixed(2)}`;
let newActiveFare = `{parseFloat(activeRide.totalCollected || (parseFloat(activeRide.fare || 0) * 1.05 + parseFloat(activeRide.driverTip || 0) + getPlatformFee(activeRide.fare || 0))).toFixed(2)}`;
if (contentPassenger.includes(oldActiveFare)) {
    contentPassenger = contentPassenger.replace(oldActiveFare, newActiveFare);
    console.log("Fixed Passenger active ride fare");
}

fs.writeFileSync('src/pages/PassengerDashboard.jsx', contentPassenger);
