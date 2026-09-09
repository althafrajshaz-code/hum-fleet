const Client = require('ssh2').Client;
const conn = new Client();

const nodeScript = `
const fs = require('fs');
const file = '/root/hum-fleet/server/data.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
data.activeRides = [];
fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log('Successfully cleared activeRides');
`;

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec(`node -e "${nodeScript.replace(/\n/g, ' ')}" && pm2 restart all`, (err, stream) => {
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
