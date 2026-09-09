const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();
conn.on('ready', () => {
  const content = fs.readFileSync('d:\\\\Althaf\\\\hum\\\\public\\\\map.html', 'utf8');
  // Need to escape backticks and variables if not careful, but this is node, so we use string concat or just write safely
  const remotePath = '/root/hum-fleet/public/map.html';
  conn.sftp((err, sftp) => {
    if (err) throw err;
    let writeStream = sftp.createWriteStream(remotePath);
    writeStream.on('close', () => {
      console.log('Uploaded map.html');
      conn.end();
    });
    writeStream.end(content);
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
