const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    
    console.log('SFTP connected. Uploading dist.zip...');
    
    sftp.fastPut('dist.zip', '/root/hum-fleet/dist.zip', (err) => {
      if (err) throw err;
      console.log('Uploaded dist.zip. Extracting to /var/www/humfleet...');
      
      conn.exec('rm -rf /var/www/humfleet/assets && find /var/www/humfleet/ -maxdepth 1 -type f -delete && unzip -o /root/hum-fleet/dist.zip -d /var/www/humfleet/ && systemctl restart nginx && rm /root/hum-fleet/dist.zip', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code) => {
          console.log('Extraction & Nginx restart completed with code ' + code);
          conn.end();
        }).on('data', (data) => console.log('OUT: ' + data))
          .stderr.on('data', (data) => console.error('ERR: ' + data));
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
