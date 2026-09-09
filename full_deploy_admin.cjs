const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();

conn.on('ready', () => {
  console.log('Connected. Uploading AdminDashboard.jsx...');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    sftp.fastPut(
      'admin-cms/src/pages/AdminDashboard.jsx',
      '/root/hum-fleet/admin-cms/src/pages/AdminDashboard.jsx',
      (err) => {
        if (err) throw err;
        console.log('Upload done. Rebuilding...');
        conn.exec('cd /root/hum-fleet/admin-cms && npm run build && pm2 restart admin-frontend', (err, stream) => {
          if (err) throw err;
          stream.on('data', d => process.stdout.write(d.toString()));
          stream.stderr.on('data', d => process.stderr.write(d.toString()));
          stream.on('close', (code) => {
            console.log('Build exited with code', code);
            conn.end();
          });
        });
      }
    );
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
