const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

// 1. Remove the History button
code = code.replace(/<button[^>]*onClick=\{\(\) => setShowHistoryModal\(true\)\}[^>]*>[\s\S]*?<\/button>/g, '');

// 2. Remove the History modal
code = code.replace(/\{\/\* ========== RIDE HISTORY MODAL ========== \*\/\}[\s\S]*?\{\/\* ========== CHOOSE FROM MAP MODAL ========== \*\/\}/g, '{/* ========== CHOOSE FROM MAP MODAL ========== */}');

fs.writeFileSync('src/pages/PassengerDashboard.jsx', code);
console.log('Removed History button and modal!');
