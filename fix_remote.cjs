const { Client } = require('ssh2');

const conn = new Client();

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec('cd /root/hum-fleet && npm install && npm run build && cd server && pm2 restart all', (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Build and restart completed with code ' + code);
      conn.end();
    }).on('data', (data) => {
      console.log('OUT: ' + data);
    }).stderr.on('data', (data) => {
      console.error('ERR: ' + data);
    });
  });
}).connect({
  host: '187.127.165.79',
  port: 22,
  username: 'root',
  password: 'SHAFLAlTHAF.1992'
});
