const fs = require('fs');
let content = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

// Rename "Wallet & Dues" to "Earnings"
content = content.replace(/<span>Wallet & Dues<\/span>/g, '<span>Earnings</span>');

// Rename "Driver Financial Ledger & Wallet"
content = content.replace(/Driver Financial Ledger & Wallet/g, 'My Earnings');

// Remove Dues Breakdown section
content = content.replace(/\{\/\* Dues Breakdown \*\/\}([\s\S]*?)Total Commission Dues.*?<\/div>\s*<\/div>/g, '');

// Remove the penalty/dues limits blocks
content = content.replace(/\{parseFloat\(wallet\.toBePaid \|\| 0\) > 1500 && \([\s\S]*?<\/div>\s*\)\}/g, '');

fs.writeFileSync('src/pages/DriverDashboard.jsx', content);
console.log('Cleaned up Wallet UI');
