const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    
    // 1. Upload dist.zip
    console.log('Uploading dist.zip...');
    sftp.fastPut('dist.zip', '/root/hum-fleet/dist.zip', (err) => {
      if (err) throw err;
      console.log('Uploaded dist.zip.');
      
      // 2. Upload Passenger APK
      console.log('Uploading Passenger APK...');
      sftp.fastPut('exported_apks/HUM_Passenger_v2.apk', '/var/www/humfleet/apks/HUM_Passenger_v2.apk', (err) => {
        if (err) throw err;
        console.log('Uploaded Passenger APK.');
        
        // 3. Upload Captain APK
        console.log('Uploading Captain APK...');
        sftp.fastPut('exported_apks/HUM_Captain_v2.apk', '/var/www/humfleet/apks/HUM_Captain_v2.apk', (err) => {
          if (err) throw err;
          console.log('Uploaded Captain APK.');
          
          // 4. Extract dist and restart
          console.log('Extracting and restarting...');
          conn.exec('unzip -o /root/hum-fleet/dist.zip -d /var/www/humfleet/ && systemctl restart nginx && rm /root/hum-fleet/dist.zip && cd /root/hum-fleet/server && pm2 restart all', (err, stream) => {
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
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
