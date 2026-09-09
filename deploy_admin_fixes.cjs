const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  console.log('Connected. Uploading files...');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    
    // Upload AdminDashboard.jsx
    sftp.fastPut(
      'admin-cms/src/pages/AdminDashboard.jsx',
      '/root/hum-fleet/admin-cms/src/pages/AdminDashboard.jsx',
      (err) => {
        if (err) throw err;
        console.log('AdminDashboard.jsx uploaded.');
        
        // Upload ApprovalsQueue.jsx
        sftp.fastPut(
          'admin-cms/src/components/admin/ApprovalsQueue.jsx',
          '/root/hum-fleet/admin-cms/src/components/admin/ApprovalsQueue.jsx',
          (err2) => {
            if (err2) throw err2;
            console.log('ApprovalsQueue.jsx uploaded. Rebuilding...');
            
            conn.exec('cd /root/hum-fleet/admin-cms && npm run build && pm2 restart admin-frontend', (err3, stream) => {
              if (err3) throw err3;
              stream.on('data', d => process.stdout.write(d.toString()));
              stream.stderr.on('data', d => process.stderr.write(d.toString()));
              stream.on('close', (code) => {
                console.log('Done! Exit code:', code);
                conn.end();
              });
            });
          }
        );
      }
    );
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
