const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  // Check 1: does VehicleCategoriesAdmin exist?
  conn.exec('ls -la /root/hum-fleet/admin-cms/src/components/admin/VehicleCategoriesAdmin.jsx', (err, stream) => {
    stream.on('data', d => process.stdout.write('COMPONENT: ' + d.toString()));
    stream.on('close', () => {
      // Check 2: grep bundle for the tab's unique text
      conn.exec('grep -o "Vehicle Categories Manager" /root/hum-fleet/admin-cms/dist/assets/index-BpybLk0-.js', (err2, stream2) => {
        stream2.on('data', d => process.stdout.write('IN_BUNDLE: ' + d.toString()));
        stream2.stderr.on('data', d => process.stdout.write('ERR: ' + d.toString()));
        stream2.on('close', () => conn.end());
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
