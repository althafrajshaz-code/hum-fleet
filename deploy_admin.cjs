const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  console.log('Client ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    console.log('Uploading admin_src.zip...');
    sftp.fastPut('d:/Althaf/hum/admin_src.zip', '/root/hum-fleet/admin_src.zip', (err) => {
      if (err) throw err;
      console.log('Upload complete. Extracting and building...');
      const cmd = `
        cd /root/hum-fleet/admin-cms &&
        unzip -o /root/hum-fleet/admin_src.zip -d /root/hum-fleet/admin-cms/ &&
        npm install &&
        echo "VITE_BACKEND_URL=https://humfleet.xyz" > .env.production &&
        npm run build &&
        pm2 restart admin-frontend
      `;
      conn.exec(cmd, (err, stream) => {
        if (err) throw err;
        stream.on('data', (d) => process.stdout.write(d.toString()))
              .on('close', () => {
                console.log('Build complete');
                conn.end();
              });
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
