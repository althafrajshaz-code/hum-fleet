const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();
conn.on('ready', () => {
  console.log('Uploading dist.zip...');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    sftp.fastPut('d:\\\\Althaf\\\\hum\\\\dist.zip', '/root/hum-fleet/dist.zip', (err) => {
      if (err) throw err;
      console.log('Upload complete. Unzipping...');
      conn.exec('rm -rf /var/www/humfleet/* && unzip -o /root/hum-fleet/dist.zip -d /var/www/humfleet/', (err, stream) => {
        if (err) throw err;
        stream.on('close', () => { 
          console.log('Deployed successfully!');
          conn.end(); 
        }).on('data', (data) => { console.log('OUT: ' + data); });
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
