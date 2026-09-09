const { Client } = require('ssh2');
const conn = new Client();

const installCmd = `
apt-get update &&
apt-get install -y gnupg curl &&
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg --yes -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor &&
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" > /etc/apt/sources.list.d/mongodb-org-7.0.list &&
apt-get update &&
apt-get install -y mongodb-org &&
systemctl start mongod &&
systemctl enable mongod &&
echo "MONGODB_URI=mongodb://localhost:27017/humfleet" > /root/hum-fleet/server/.env &&
pm2 restart hum-backend --update-env
`;

conn.on('ready', () => {
  console.log('Connected. Installing MongoDB...');
  conn.exec(installCmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code) => {
      console.log('MongoDB Installation completed with code ' + code);
      conn.end();
    }).on('data', (data) => {
      console.log('OUT: ' + data);
    }).stderr.on('data', (data) => {
      console.error('ERR: ' + data);
    });
  });
}).on('error', (err) => {
  console.error('SSH Error: ' + err);
}).connect({
  host: '187.127.165.79',
  port: 22,
  username: 'root',
  password: 'SHAFLAlTHAF.1992'
});
