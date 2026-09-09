const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`
mkdir -p /var/www/humfleet
cp -r /root/hum-fleet/dist/* /var/www/humfleet/
chown -R www-data:www-data /var/www/humfleet

cat << 'EOF' > /etc/nginx/sites-available/humfleet
server {
    listen 80;
    server_name humfleet.xyz www.humfleet.xyz;
    
    root /var/www/humfleet;
    index index.html;

    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

nginx -t && systemctl reload nginx
pm2 delete frontend
  `, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => { conn.end(); }).on('data', (data) => { console.log('OUT: ' + data); });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
