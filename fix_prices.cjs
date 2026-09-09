const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

// Fix 1: Don't override vehicle category ratePerKm with backend ratePerKm if it's lower. 
// Remove the overriding line.
code = code.replace(/if \(parseFloat\(settings\.ratePerKm\) > catPerKm\) catPerKm = parseFloat\(settings\.ratePerKm\);/g, '// Overriding logic removed as requested by user to keep vehicle category prices');

// Fix 2: Remove the "₹XX/KM" text from the vehicle selection list.
code = code.replace(/<span className="ride-eta">Max: \{cat\.maxPassengers\} Pass · ₹\{cat\.ratePerKm \|\| 15\}\/KM<\/span>/g, '<span className="ride-eta">Max: {cat.maxPassengers} Pass</span>');

// Save the fixes
fs.writeFileSync('src/pages/PassengerDashboard.jsx', code);
console.log('Vehicle prices fixed and rate per km hidden!');
