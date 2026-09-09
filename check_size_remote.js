const fs = require('fs');
const state = JSON.parse(fs.readFileSync('./server/humFleetState.json', 'utf8'));
for (const key of Object.keys(state)) {
  const str = JSON.stringify(state[key] || {});
  console.log(`${key}: ${(str.length / 1024 / 1024).toFixed(2)} MB`);
}
