const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec('mkdir -p /root/hum-fleet/public/apks', (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('mkdir completed with code ' + code);
      conn.end();
    });
  });
}).connect({
  host: '187.127.165.79',
  port: 22,
  username: 'root',
  password: 'SHAFLAlTHAF.1992'
});
