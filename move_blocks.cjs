const fs = require('fs');
const path = 'd:\\Althaf\\hum\\src\\pages\\DriverDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// The start of the blocks we want to move
const blocksStart = `{/* Rating Panel Screen (Shows after driver completes ride) */}`;

// Let's find where they end. The active ride block ends right before the LOGOUT BUTTON.
const blocksEnd = `{/* LOGOUT BUTTON */}`;

if (content.includes(blocksStart) && content.includes(blocksEnd)) {
  const startIndex = content.indexOf(blocksStart);
  const endIndex = content.indexOf(blocksEnd);
  
  // Extract the blocks
  let blocksText = content.substring(startIndex, endIndex);
  
  // Remove them from their current position
  content = content.replace(blocksText, '');
  
  // Find where to insert them: Right after <div className="dashboard-container container" ...>
  const insertTarget = `<div className="dashboard-container container" style={{ position: 'relative', height: '100dvh', maxHeight: '100dvh' }}>`;
  
  if (content.includes(insertTarget)) {
    content = content.replace(insertTarget, insertTarget + '\\n\\n' + blocksText + '\\n\\n');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully moved the ride blocks outside the sidebar!');
  } else {
    console.log('Could not find insert target.');
  }
} else {
  console.log('Could not find start or end markers for the blocks.');
}
