const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  conn.exec('ls -la /root/hum-fleet/ && cat /root/hum-fleet/.env*', (err, stream) => {
    if (err) throw err;
    stream.on('data', (d) => console.log('OUT: ' + d))
          .stderr.on('data', (d) => console.error('ERR: ' + d))
          .on('close', () => conn.end());
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
