const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`
node -e "
const fs = require('fs');
let lines = fs.readFileSync('/root/hum-fleet/src/pages/PassengerDashboard.jsx', 'utf8').split('\\n');

// 0-indexed, so line 313 is index 312
// Extract lines 313 to 320 (indices 312 to 319)
const categoryLines = lines.splice(312, 8);

// Now selectedTier is at line 261 (index 260)
// We need to find 'const [selectedTier' because line numbers might have shifted!
const targetIndex = lines.findIndex(l => l.includes('const [selectedTier'));

if (targetIndex !== -1) {
  lines.splice(targetIndex, 0, ...categoryLines, '');
  fs.writeFileSync('/root/hum-fleet/src/pages/PassengerDashboard.jsx', lines.join('\\n'));
  console.log('Successfully reordered categories!');
} else {
  console.log('Target line not found!');
}
" && cd /root/hum-fleet && npm run build && pm2 restart frontend
  `, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => { conn.end(); }).on('data', (data) => { console.log('OUT: ' + data); });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
