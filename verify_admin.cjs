const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  // Check 1: is categories tab in source?
  conn.exec('grep -n "categories" /root/hum-fleet/admin-cms/src/pages/AdminDashboard.jsx | head -30', (err, stream) => {
    stream.on('data', d => process.stdout.write('SOURCE: ' + d.toString()));
    stream.on('close', () => {
      // Check 2: is it in the built JS?
      conn.exec('strings /root/hum-fleet/admin-cms/dist/assets/index-BpybLk0-.js | grep -i "vehicle" | head -20', (err2, stream2) => {
        stream2.on('data', d => process.stdout.write('BUNDLE: ' + d.toString()));
        stream2.on('close', () => conn.end());
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
