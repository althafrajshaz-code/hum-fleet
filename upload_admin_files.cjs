
const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    sftp.fastPut('d:\\\\Althaf\\\\hum\\\\admin-cms\\\\src\\\\pages\\\\AdminDashboard.jsx', '/root/hum-fleet/admin-cms/src/pages/AdminDashboard.jsx', (err) => {
      if (err) throw err;
      sftp.fastPut('d:\\\\Althaf\\\\hum\\\\admin-cms\\\\src\\\\components\\\\admin\\\\Ledger.jsx', '/root/hum-fleet/admin-cms/src/components/admin/Ledger.jsx', (err) => {
        if (err) throw err;
        sftp.fastPut('d:\\\\Althaf\\\\hum\\\\admin-cms\\\\src\\\\components\\\\admin\\\\SystemSettings.jsx', '/root/hum-fleet/admin-cms/src/components/admin/SystemSettings.jsx', (err) => {
          if (err) throw err;
          sftp.fastPut('d:\\\\Althaf\\\\hum\\\\admin-cms\\\\src\\\\components\\\\admin\\\\ApprovalsQueue.jsx', '/root/hum-fleet/admin-cms/src/components/admin/ApprovalsQueue.jsx', (err) => {
            if (err) throw err;
            console.log('Upload complete.');
            conn.end();
          });
        });
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
