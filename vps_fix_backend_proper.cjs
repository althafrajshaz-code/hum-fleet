const { Client } = require('ssh2');
const conn = new Client();

const fixScript = `
const fs = require('fs');
let code = fs.readFileSync('/root/hum-fleet/server/index.js', 'utf8');

// Undo the bad sed replacement
code = code.replace(/\\(email \\|\\| ''\\)\\.toLowerCase\\(\\)/g, 'email.toLowerCase()');
code = code.replace(/\\(licenseNumber \\|\\| ''\\)\\.toLowerCase\\(\\)/g, 'licenseNumber.toLowerCase()');
code = code.replace(/p\\.\\(email \\|\\| ''\\)\\.toLowerCase\\(\\)/g, 'p.email.toLowerCase()');
code = code.replace(/googleUser\\.\\(email \\|\\| ''\\)\\.toLowerCase\\(\\)/g, 'googleUser.email.toLowerCase()');
code = code.replace(/d\\.\\(email \\|\\| ''\\)\\.toLowerCase\\(\\)/g, 'd.email.toLowerCase()');
code = code.replace(/d\\.\\(licenseNumber \\|\\| ''\\)\\.toLowerCase\\(\\)/g, 'd.licenseNumber.toLowerCase()');

// Carefully fix only the specific places where the undefined error happens
// e.g. "email.toLowerCase()" -> "(email || '').toLowerCase()" only when email is a standalone variable
code = code.replace(/=== email\\.toLowerCase\\(\\)/g, "=== (email || '').toLowerCase()");
code = code.replace(/=== licenseNumber\\.toLowerCase\\(\\)/g, "=== (licenseNumber || '').toLowerCase()");

fs.writeFileSync('/root/hum-fleet/server/index.js', code);
`;

conn.on('ready', () => {
  conn.exec(`node -e "${fixScript.replace(/"/g, '\\"').replace(/\$/g, '\\$').replace(/\n/g, ' ')}" && pm2 restart hum-backend`, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code) => {
      console.log('Fixed backend code ' + code);
      conn.end();
    }).on('data', (data) => {
      console.log('OUT: ' + data);
    }).stderr.on('data', (data) => {
      console.error('ERR: ' + data);
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
