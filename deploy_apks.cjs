const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    
    console.log('Uploading clean APKs...');
    sftp.fastPut('exported_apks/HUM_Passenger_v2.apk', '/var/www/humfleet/apks/HUM_Passenger_v2.apk', (err) => {
      if (err) console.error(err);
      else console.log('Uploaded Passenger APK.');
      
      sftp.fastPut('exported_apks/HUM_Captain_v2.apk', '/var/www/humfleet/apks/HUM_Captain_v2.apk', (err) => {
        if (err) console.error(err);
        else console.log('Uploaded Driver APK.');
        conn.end();
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
