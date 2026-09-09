const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`grep -n -B 2 -A 8 "const \\\\[categories, setCategories\\\\]" /root/hum-fleet/src/pages/PassengerDashboard.jsx`, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => { conn.end(); }).on('data', (data) => { console.log('OUT: ' + data); });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
