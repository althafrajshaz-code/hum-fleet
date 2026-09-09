const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec("curl -s 'http://localhost:5000/api/rides/active?email=inam@gmail.com'", (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; });
    stream.on('close', () => {
      console.log('Active Ride:', out);
      conn.end();
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
