const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`
node -e "
const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if(file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('/root/hum-fleet/src');
let count = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // The API_BASE regex
  const regex = /const API_BASE = \\(typeof window !== 'undefined' && window\\.location\\.hostname\\.includes\\('loca\\.lt'\\)\\)[\\s\\S]*?\\|\\| 'https:\\/\\/server-ashen-beta\\.vercel\\.app'\\);/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, \"const API_BASE = 'https://humfleet.xyz';\");
    fs.writeFileSync(file, content);
    count++;
  }
});
console.log('Replaced in ' + count + ' files.');
" && cd /root/hum-fleet && npm run build && cp -r dist/* /var/www/humfleet/ && chown -R www-data:www-data /var/www/humfleet
  `, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => { conn.end(); }).on('data', (data) => { console.log('OUT: ' + data); });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
