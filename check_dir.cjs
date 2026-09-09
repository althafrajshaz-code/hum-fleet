const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec("ls -la /var/www/humfleet/", (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; });
    stream.on('close', () => {
      console.log('Dir contents:\n', out);
      conn.end();
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
