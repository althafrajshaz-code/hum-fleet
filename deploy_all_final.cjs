const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    
    console.log('Uploading dist.zip...');
    sftp.fastPut('dist.zip', '/root/hum-fleet/dist.zip', (err) => {
      if (err) throw err;
      console.log('Uploaded dist.zip.');
      
      console.log('Uploading server/index.js...');
      sftp.fastPut('server/index.js', '/root/hum-fleet/server/index.js', (err) => {
        if (err) throw err;
        console.log('Uploaded server/index.js.');
        
        console.log('Extracting dist.zip and restarting services...');
        conn.exec('rm -rf /var/www/humfleet/* && unzip /root/hum-fleet/dist.zip -d /var/www/humfleet/ && systemctl restart nginx && rm /root/hum-fleet/dist.zip && cd /root/hum-fleet/server && pm2 restart all', (err, stream) => {
          if (err) throw err;
          stream.on('close', (code) => {
            console.log('Deployment completed with code ' + code);
            conn.end();
          }).on('data', (data) => console.log('OUT: ' + data))
            .stderr.on('data', (data) => console.error('ERR: ' + data));
        });
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
