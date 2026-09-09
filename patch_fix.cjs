const fs = require('fs');
let c = fs.readFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', 'utf8');
c = c.replace(/const \[hideEarningsAmount, setHideEarningsAmount\] = useState\(false\);\s*const \[hideEarningsAmount, setHideEarningsAmount\] = useState\(false\);/, 'const [hideEarningsAmount, setHideEarningsAmount] = useState(false);');
c = c.replace(/const \[showEarningsDetails, setShowEarningsDetails\] = useState\(false\);\s*const \[showEarningsDetails, setShowEarningsDetails\] = useState\(false\);/, 'const [showEarningsDetails, setShowEarningsDetails] = useState(false);');
fs.writeFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', c);
