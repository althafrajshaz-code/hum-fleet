const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    
    console.log('SFTP connected. Uploading server/index.js...');
    
    sftp.fastPut('server/index.js', '/root/hum-fleet/server/index.js', (err) => {
      if (err) throw err;
      console.log('Uploaded server/index.js. Restarting backend...');
      
      conn.exec('cd /root/hum-fleet/server && pm2 restart index.js || pm2 restart server || node index.js', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code) => {
          console.log('Backend restarted with code ' + code);
          conn.end();
        }).on('data', (data) => console.log('OUT: ' + data))
          .stderr.on('data', (data) => console.error('ERR: ' + data));
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
