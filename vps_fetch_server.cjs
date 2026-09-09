const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`cat /root/hum-fleet/server/index.js`, (err, stream) => {
    if (err) throw err;
    let dataStr = '';
    stream.on('close', () => { 
      const fs = require('fs');
      fs.writeFileSync('d:\\\\Althaf\\\\hum\\\\vps_server_index.js', dataStr);
      console.log('Saved to vps_server_index.js');
      conn.end(); 
    }).on('data', (data) => { 
      dataStr += data;
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
