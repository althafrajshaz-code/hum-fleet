const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  // Check approval queue backend API
  conn.exec('curl -s "http://localhost:5000/api/drivers?status=Pending" | head -c 500', (err, stream) => {
    stream.on('data', d => process.stdout.write('PENDING_API: ' + d.toString()));
    stream.on('close', () => {
      // Check approved drivers - are they still returned in pending?
      conn.exec('curl -s "http://localhost:5000/api/drivers?status=Approved" | head -c 500', (err2, stream2) => {
        stream2.on('data', d => process.stdout.write('APPROVED_API: ' + d.toString()));
        stream2.on('close', () => conn.end());
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
