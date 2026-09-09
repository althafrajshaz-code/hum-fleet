const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('grep -rn "/approve" /root/hum-fleet/server/ | head -30', (err, stream) => {
    stream.on('data', d => process.stdout.write('SERVER: ' + d.toString()));
    stream.stderr.on('data', d => process.stdout.write('ERR: ' + d.toString()));
    stream.on('close', () => {
      conn.exec('ls /root/hum-fleet/server/', (err2, stream2) => {
        stream2.on('data', d => process.stdout.write('SERVER_FILES: ' + d.toString()));
        stream2.on('close', () => conn.end());
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
