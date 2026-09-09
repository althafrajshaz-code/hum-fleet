const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    console.log('Uploading DriverDashboard.jsx...');
    sftp.fastPut('src/pages/DriverDashboard.jsx', '/root/hum-fleet/src/pages/DriverDashboard.jsx', (err) => {
      if (err) throw err;
      console.log('Uploading Dashboard.css...');
      sftp.fastPut('src/pages/Dashboard.css', '/root/hum-fleet/src/pages/Dashboard.css', (err) => {
        if (err) throw err;
        console.log('Rebuilding...');
        conn.exec('cd /root/hum-fleet && npm run build && rm -rf /var/www/humfleet/* && cp -r dist/* /var/www/humfleet/ && systemctl restart nginx', (err, stream) => {
          if (err) throw err;
          stream.on('close', (code) => { console.log('Build code ' + code); conn.end(); })
            .on('data', d => console.log('OUT: ' + d))
            .stderr.on('data', d => console.log('ERR: ' + d));
        });
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
