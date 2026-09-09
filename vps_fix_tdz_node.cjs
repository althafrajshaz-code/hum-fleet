const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`
node -e "
const fs = require('fs');
let code = fs.readFileSync('/root/hum-fleet/src/pages/PassengerDashboard.jsx', 'utf8');

// Find the categories block
const catRegex = /  const \\\\[categories, setCategories\\\\] = useState\\\(\\\\[\\\\s\\\\S]*?\\n  \\\\]\\\);/;
const catMatch = code.match(catRegex);
if (catMatch) {
  // Remove the block from its current location
  code = code.replace(catRegex, '');
  
  // Insert it before selectedTier
  const insertTarget = /  const \\\\[selectedTier, setSelectedTier\\\\] = useState\\(''\\);/;
  code = code.replace(insertTarget, catMatch[0] + '\\n\\n  const [selectedTier, setSelectedTier] = useState(\\'\\');');
  
  fs.writeFileSync('/root/hum-fleet/src/pages/PassengerDashboard.jsx', code);
  console.log('Successfully reordered categories!');
} else {
  console.log('Categories block not found!');
}
" && cd /root/hum-fleet && npm run build && pm2 restart frontend
  `, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => { conn.end(); }).on('data', (data) => { console.log('OUT: ' + data); });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
