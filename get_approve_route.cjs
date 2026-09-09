const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  // Get the approve route code  
  conn.exec('sed -n "1480,1530p" /root/hum-fleet/server/index.js', (err, stream) => {
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
