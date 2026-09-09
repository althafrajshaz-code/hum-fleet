const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    console.log('SFTP connected. Uploading AdminDashboard.jsx...');
    sftp.fastPut('admin-cms/src/pages/AdminDashboard.jsx', '/root/hum-fleet/admin-cms/src/pages/AdminDashboard.jsx', (err) => {
      if (err) throw err;
      console.log('Uploaded AdminDashboard.jsx');
      console.log('Rebuilding admin frontend...');
      conn.exec('cd /root/hum-fleet/admin-cms && npm run build && pm2 restart admin-frontend', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code) => {
          console.log('Admin Build and restart completed with code ' + code);
          conn.end();
        }).on('data', (data) => console.log('OUT: ' + data))
          .stderr.on('data', (data) => console.error('ERR: ' + data));
      });
    });
  });
}).connect({
  host: '187.127.165.79',
  port: 22,
  username: 'root',
  password: 'SHAFLAlTHAF.1992'
});
