const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    console.log('Uploading dist.zip...');
    sftp.fastPut('dist.zip', '/root/hum-fleet/dist.zip', (err) => {
      if (err) throw err;
      console.log('Extracting and restarting...');
      conn.exec('unzip -o /root/hum-fleet/dist.zip -d /var/www/humfleet/ && systemctl restart nginx && rm /root/hum-fleet/dist.zip', (err, stream) => {
        if (err) throw err;
        stream.on('close', () => conn.end())
          .on('data', data => process.stdout.write(data))
          .stderr.on('data', data => process.stderr.write(data));
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
