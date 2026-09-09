const fs = require('fs');
let c = fs.readFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', 'utf8');
c = c.replace(/import \{ AlertCircle, /g, 'import { ');
c = c.replace(/import \{ Sun, Moon, Menu, Power/, 'import { AlertCircle, Sun, Moon, Menu, Power');
fs.writeFileSync('d:/Althaf/hum/src/pages/DriverDashboard.jsx', c);

