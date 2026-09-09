const Client = require('ssh2').Client;
const conn = new Client();

const patch = `
app.get('/api/admin/force-clear-rides', (req, res) => {
  activeRides.forEach(r => {
    if (['Accepted', 'In Progress', 'Arrived', 'Searching'].includes(r.status)) {
      r.status = 'Cancelled';
    }
  });
  saveData();
  res.json({ success: true, message: 'All active rides cancelled.' });
});
`;

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec(`
    cd /root/hum-fleet/server && 
    sed -i "\\$a\\${patch.replace(/\n/g, '\\n')}" index.js && 
    pm2 restart all
  `, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Command finished with code ' + code);
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
