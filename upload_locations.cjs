const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    
    console.log('SFTP connected. Uploading locations.json...');
    
    sftp.fastPut('server/locations.json', '/root/hum-fleet/server/locations.json', (err) => {
      if (err) {
        console.error('Failed to upload locations.json', err);
        return;
      }
      console.log('Uploaded locations.json');
      
      console.log('Restarting backend...');
      conn.exec('cd /root/hum-fleet/server && pm2 restart all', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
          console.log('Restart completed with code ' + code);
          conn.end();
        }).on('data', (data) => {
          console.log('OUT: ' + data);
        }).stderr.on('data', (data) => {
          console.error('ERR: ' + data);
        });
      });
    });
  });
}).connect({
  host: '187.127.165.79',
  port: 22,
  username: 'root',
  password: 'SHAFLAlTHAF.1992'
});
