const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) throw err;
    sftp.fastPut('d:\\\\Althaf\\\\hum\\\\server\\\\index.js', '/root/hum-fleet/server/index.js', (err) => {
      if (err) throw err;
      console.log('Upload complete. Restarting pm2...');
      conn.exec('pm2 restart all', (err, stream) => {
        if (err) throw err;
        stream.on('close', () => { 
          console.log('Restarted successfully!');
          conn.end(); 
        }).on('data', (data) => { console.log('OUT: ' + data); });
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
