const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    console.log('SFTP connected. Uploading DriverSignup.jsx...');
    sftp.fastPut('src/pages/DriverSignup.jsx', '/root/hum-fleet/src/pages/DriverSignup.jsx', (err) => {
      if (err) throw err;
      console.log('Uploaded DriverSignup.jsx');
      console.log('Rebuilding frontend...');
      conn.exec('cd /root/hum-fleet && npm run build && cp -r dist/* /var/www/humfleet/', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code) => {
          console.log('Build completed with code ' + code);
          conn.end();
        }).on('data', (data) => console.log('OUT: ' + data))
          .stderr.on('data', (data) => console.error('ERR: ' + data));
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
