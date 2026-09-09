const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`sed -n '11p' /root/hum-fleet/dist/assets/index-BII_C0oB.js | cut -c 207000-207300`, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => { conn.end(); }).on('data', (data) => { console.log('OUT: ' + data); });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
