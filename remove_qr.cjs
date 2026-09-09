const fs = require('fs');
let text = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

text = text.replace(/\{systemSettings\.qrCodeUrl && \([\s\S]*?Scan with GPay, PhonePe, Paytm, etc\.<\/div>\s*<\/div>\s*\)\}/g, '');

fs.writeFileSync('src/pages/DriverDashboard.jsx', text);
