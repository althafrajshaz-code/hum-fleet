const fs = require('fs');
let content = fs.readFileSync('d:/Althaf/hum/server/index.js', 'utf8');

const oldPassengerIdStr = `id: (passengers.length > 0 ? Math.max(...passengers.map(x => Number(x.id) || 0)) : 0) + 1,`;
const newPassengerIdStr = `id: (passengers.length > 0 ? Math.max(4999, ...passengers.map(x => Number(x.id) || 0)) : 4999) + 1,`;

if (content.includes(oldPassengerIdStr)) {
  content = content.replace(oldPassengerIdStr, newPassengerIdStr);
  fs.writeFileSync('d:/Althaf/hum/server/index.js', content);
  console.log('Fixed passenger ID starting number.');
} else {
  console.log('Could not find passenger ID generation string.');
}
