const fs = require('fs');
let code = fs.readFileSync('src/pages/PassengerDashboard.jsx', 'utf8');

const start = code.indexOf('if (event.data && event.data.type === \\'MAP_LOCATION_SELECTED\\')');
if (start === -1) {
  console.log('Could not find MAP_LOCATION_SELECTED');
  process.exit(1);
}

// We want to remove setShowMapModal(false); and setMapModalTarget(null);
// Let's just find them inside the event handler and replace them.

const handlerStart = code.indexOf('{', start);
let nested = 0;
let handlerEnd = -1;
for (let i = handlerStart; i < code.length; i++) {
  if (code[i] === '{') nested++;
  if (code[i] === '}') {
    nested--;
    if (nested === 0) {
      handlerEnd = i;
      break;
    }
  }
}

if (handlerEnd !== -1) {
  const handlerCode = code.substring(start, handlerEnd + 1);
  const newHandlerCode = handlerCode
    .replace(/setShowMapModal\\(false\\);/g, '')
    .replace(/setMapModalTarget\\(null\\);/g, '');
  
  code = code.replace(handlerCode, newHandlerCode);
  fs.writeFileSync('src/pages/PassengerDashboard.jsx', code);
  console.log('Fixed map closing instantly! YAY!');
} else {
  console.log('Could not find end of handler');
}
