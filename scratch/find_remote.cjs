const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  conn.exec('ls -la /root/hum-fleet/src/pages/ && find /root/hum-fleet -name "*DriverDashboard*" -mtime -3', (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      conn.end();
    }).on('data', (data) => {
      console.log(data.toString());
    }).stderr.on('data', (data) => {
      console.error(data.toString());
    });
  });
}).connect({
  host: '187.127.165.79',
  port: 22,
  username: 'root',
  password: 'SHAFLAlTHAF.1992'
});
