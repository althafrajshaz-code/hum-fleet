const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    console.log('SFTP connected. Uploading Driver APK...');
    sftp.fastPut('android/app/build/outputs/apk/debug/app-debug.apk', '/var/www/humfleet/apks/HUM_Captain.apk', (err) => {
      if (err) throw err;
      console.log('Uploaded Driver APK');
      conn.end();
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
