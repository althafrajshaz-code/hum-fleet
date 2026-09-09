const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();
conn.on('ready', () => {
  const content = fs.readFileSync('d:\\\\Althaf\\\\hum\\\\src\\\\pages\\\\PassengerDashboard.jsx', 'utf8');
  const remotePath = '/root/hum-fleet/src/pages/PassengerDashboard.jsx';
  conn.sftp((err, sftp) => {
    if (err) throw err;
    let writeStream = sftp.createWriteStream(remotePath);
    writeStream.on('close', () => {
      console.log('Uploaded PassengerDashboard.jsx');
      conn.end();
    });
    writeStream.end(content);
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
