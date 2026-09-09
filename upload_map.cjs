const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    console.log('Uploading map.html...');
    sftp.fastPut('public/map.html', '/var/www/humfleet/map.html', (err) => {
      if (err) { console.error('Failed to upload directly to /var/www/humfleet', err); }
      else { console.log('Successfully uploaded to /var/www/humfleet/map.html'); }
      
      sftp.fastPut('public/map.html', '/root/hum-fleet/public/map.html', (err) => {
        console.log('Uploaded to /root/hum-fleet/public/map.html');
        conn.end();
      });
    });
  });
}).connect({
  host: '187.127.165.79',
  port: 22,
  username: 'root',
  password: 'SHAFLAlTHAF.1992'
});
