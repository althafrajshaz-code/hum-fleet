const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    sftp.fastPut('src/pages/Dashboard.css', '/root/hum-fleet/src/pages/Dashboard.css', (err) => {
      if (err) throw err;
      console.log('Uploaded Dashboard.css');
      conn.exec('cd /root/hum-fleet && npm run build && cp -r dist/* /var/www/humfleet/ && systemctl restart nginx', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
          console.log('Build completed with code ' + code);
          conn.end();
        }).on('data', (data) => {
          console.log('OUT: ' + data);
        }).stderr.on('data', (data) => {
          console.log('ERR: ' + data);
        });
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
