const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    console.log('Uploading Captain APK...');
    sftp.fastPut('public/apks/HUM_Captain.apk', '/var/www/humfleet/apks/HUM_Captain_v2.apk', (err) => {
      if (err) throw err;
      console.log('Uploaded Captain APK to /var/www/humfleet/apks/HUM_Captain_v2.apk');
      conn.end();
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
