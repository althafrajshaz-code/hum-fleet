const { Client } = require('ssh2');

const conn = new Client();

console.log("Connecting to VPS...");

conn.on('ready', () => {
  console.log('Client :: ready');
  
  // First, let's run npm install
  console.log("Running npm install in /root/hum-fleet/server...");
  conn.exec('cd /root/hum-fleet/server && npm install', (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('npm install finished with code ' + code);
      
      // Then, run pm2 restart all
      console.log("Running pm2 restart all...");
      conn.exec('pm2 restart all', (err2, stream2) => {
        if (err2) throw err2;
        stream2.on('close', (code2, signal2) => {
          console.log('pm2 restart finished with code ' + code2);
          conn.end();
        }).on('data', (data) => {
          console.log('PM2 OUTPUT: ' + data);
        }).stderr.on('data', (data) => {
          console.error('PM2 ERROR: ' + data);
        });
      });
      
    }).on('data', (data) => {
      console.log('NPM OUTPUT: ' + data);
    }).stderr.on('data', (data) => {
      console.error('NPM ERROR: ' + data);
    });
  });
}).on('error', (err) => {
  console.error('SSH Connection Error: ' + err.message);
}).connect({
  host: '187.127.165.79',
  port: 22,
  username: 'root',
  password: 'SHAFLAlTHAF.1992' // Copied directly from the user's message
});
