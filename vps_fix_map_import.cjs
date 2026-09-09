const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`
sed -i 's/ Wallet, Map, Share2/ Wallet, Map as MapIcon, Share2/' /root/hum-fleet/src/pages/PassengerDashboard.jsx &&
sed -i 's/<Map /<MapIcon /' /root/hum-fleet/src/pages/PassengerDashboard.jsx &&
sed -i 's/new window.Map/new Map/' /root/hum-fleet/src/pages/PassengerDashboard.jsx &&
cd /root/hum-fleet && npm run build && pm2 restart frontend
  `, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => { conn.end(); }).on('data', (data) => { console.log('OUT: ' + data); });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
