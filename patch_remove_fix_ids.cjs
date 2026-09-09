const fs = require('fs');
let content = fs.readFileSync('d:/Althaf/hum/server/index.js', 'utf8');

const endpoint = `app.get('/api/fix-ids', (req, res) => {
  let currentId = 5000;
  passengers.forEach(p => {
    p.id = currentId++;
  });
  saveData();
  res.json({ success: true, count: passengers.length });
});\n\n`;

content = content.replace(endpoint, '');

fs.writeFileSync('d:/Althaf/hum/server/index.js', content);
console.log('Removed /api/fix-ids');
