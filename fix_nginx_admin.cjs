const { Client } = require('ssh2');
const conn = new Client();

const newNginxConfig = `
server {
    listen 80;
    server_name admin.humfleet.xyz;

    # Route all API calls to the backend on port 5000
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    # Route Socket.IO to backend
    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Route all other requests to the admin frontend
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
`;

conn.on('ready', () => {
  console.log('Connected. Updating Nginx admin config...');
  
  // Write new config
  conn.exec(`cat > /etc/nginx/sites-available/admin << 'NGINXEOF'
${newNginxConfig}
NGINXEOF`, (err, stream) => {
    if (err) throw err;
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => {
      // Test nginx config
      conn.exec('nginx -t && nginx -s reload', (err2, stream2) => {
        if (err2) throw err2;
        stream2.on('data', d => process.stdout.write(d.toString()));
        stream2.stderr.on('data', d => process.stdout.write('STDERR: ' + d.toString()));
        stream2.on('close', (code) => {
          console.log('Nginx reload exit code:', code);
          conn.end();
        });
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
