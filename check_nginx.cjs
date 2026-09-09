const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  // Check the nginx admin config
  conn.exec('cat /etc/nginx/sites-available/admin', (err, stream) => {
    stream.on('data', d => process.stdout.write('NGINX_ADMIN: ' + d.toString()));
    stream.on('close', () => {
      // Test if admin.humfleet.xyz/api/ resolves correctly
      conn.exec('curl -s -o /dev/null -w "%{http_code}" http://admin.humfleet.xyz/api/vehicle-categories', (err2, stream2) => {
        stream2.on('data', d => process.stdout.write('\nAPI_VIA_DOMAIN_HTTP_CODE: ' + d.toString()));
        stream2.on('close', () => conn.end());
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
