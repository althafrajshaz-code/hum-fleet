const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec("systemctl status nginx --no-pager | head -n 10", (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; });
    stream.on('close', () => {
      console.log('Nginx Status:\n', out);
      conn.exec("pm2 status", (err2, stream2) => {
        let out2 = '';
        stream2.on('data', d => { out2 += d; });
        stream2.on('close', () => {
          console.log('\nPM2 Status:\n', out2);
          conn.end();
        });
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
