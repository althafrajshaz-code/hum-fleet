const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`
sed -i 's/new Map/new window.Map/g' /root/hum-fleet/src/pages/PassengerDashboard.jsx &&
cd /root/hum-fleet && npm run build && pm2 restart frontend
  `, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => { conn.end(); }).on('data', (data) => { console.log('OUT: ' + data); });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
