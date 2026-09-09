const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('sed -n "562,564p" /root/hum-fleet/server/index.js', (err, stream) => {
    stream.on('data', (d) => console.log(d.toString())).on('close', () => conn.end());
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
