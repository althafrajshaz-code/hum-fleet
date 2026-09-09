const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    console.log('SFTP connected. Uploading APKs...');
    
    let uploaded = 0;
    const files = [
      { local: 'D:/Althaf/HUM_APKs/HUM_Captain.apk', remote: '/var/www/humfleet/apks/HUM_Captain_v2.apk' }
    ];
    
    files.forEach(f => {
      sftp.fastPut(f.local, f.remote, (err) => {
        if (err) throw err;
        console.log('Uploaded ' + f.local + ' -> ' + f.remote);
        uploaded++;
        if(uploaded === files.length) {
          console.log('Done uploading missing alias.');
          conn.end();
        }
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
