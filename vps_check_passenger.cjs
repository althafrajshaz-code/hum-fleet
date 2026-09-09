const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('head -n 20 /root/hum-fleet/src/pages/PassengerSignup.jsx', (err, stream) => {
    if (err) throw err;
    stream.on('close', () => { conn.end(); }).on('data', (data) => { console.log('OUT: ' + data); });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
