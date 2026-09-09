const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    console.log('Uploading server/index.js...');
    sftp.fastPut('server/index.js', '/root/hum-fleet/server/index.js', (err) => {
      if (err) throw err;
      console.log('Restarting hum-backend...');
      conn.exec('pm2 restart hum-backend', (err, stream) => {
        if (err) throw err;
        stream.on('close', () => conn.end())
          .on('data', data => process.stdout.write(data))
          .stderr.on('data', data => process.stderr.write(data));
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
