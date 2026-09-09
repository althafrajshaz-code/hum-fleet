
const fs = require('fs');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // server/index.js replacements
  content = content.replace(/const gst = recalculatedMinFare \* 0\.05; \/\/ 5% GST/g, 'const gst = 0; // No GST anymore');
  content = content.replace(/ride\.gst = gst\.toFixed\(2\);/g, 'ride.gst = \'0.00\';');
  content = content.replace(/totalGST \+= fare \* 0\.05;/g, 'totalGST += 0;');

  // DriverDashboard.jsx replacements
  content = content.replace(/const gst = parseFloat\(ride\.gst \|\| \(fare \* 0\.05\)\);/g, 'const gst = 0;');
  content = content.replace(/<tr><td>GST \(5%\)<\/td><td>₹\$\{gst\.toFixed\(2\)\}<\/td><\/tr>/g, '');
  content = content.replace(/const tax = recalculatedMinFare \* 0\.05;/g, 'const tax = 0;');
  content = content.replace(/& GST /g, '');
  content = content.replace(/ \u0026 GST /g, ' '); // unicode ampersand
  content = content.replace(/Commission & GST/g, 'Commission');
  content = content.replace(/commission & GST/g, 'commission');
  content = content.replace(/Commission \\u0026 GST/g, 'Commission');
  content = content.replace(/\(10% Platform Commission Dues\)/g, '(Platform Commission Dues)');
  content = content.replace(/ \(Including GST\)/g, '');
  content = content.replace(/ \+ 5% GST /g, ' ');

  fs.writeFileSync(filePath, content);
}

['server/index.js', 'src/pages/DriverDashboard.jsx', 'admin-cms/src/pages/AdminDashboard.jsx', 'admin-cms/src/components/admin/Ledger.jsx'].forEach(f => {
  if (fs.existsSync(f)) {
    processFile(f);
    console.log('Processed', f);
  }
});
