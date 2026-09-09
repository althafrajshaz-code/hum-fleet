const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  // Find which file has the approve route
  conn.exec('grep -rn "approve" /root/hum-fleet/routes/ | head -30', (err, stream) => {
    stream.on('data', d => process.stdout.write('ROUTES: ' + d.toString()));
    stream.stderr.on('data', d => process.stdout.write('ERR: ' + d.toString()));
    stream.on('close', () => {
      // Also find where the routes folder is
      conn.exec('ls /root/hum-fleet/', (err2, stream2) => {
        stream2.on('data', d => process.stdout.write('FILES: ' + d.toString()));
        stream2.on('close', () => conn.end());
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
