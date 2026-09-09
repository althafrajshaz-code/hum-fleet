const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`grep -n -A 20 "app.post('/api/drivers'" /root/hum-fleet/server/index.js`, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => { conn.end(); }).on('data', (data) => { console.log('OUT: ' + data); });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
