const { Client } = require('ssh2');

const conn = new Client();

const nginxConfigMain = `
server {
    listen 80;
    server_name humfleet.xyz www.humfleet.xyz;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
`;

const nginxConfigAdmin = `
server {
    listen 80;
    server_name admin.humfleet.xyz;

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

const nginxConfigApi = `
server {
    listen 80;
    server_name api.humfleet.xyz;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
`;

const command = `
  apt-get update && apt-get install nginx -y &&
  echo "${nginxConfigMain.replace(/"/g, '\\"').replace(/\$/g, '\\$')}" > /etc/nginx/sites-available/humfleet &&
  echo "${nginxConfigAdmin.replace(/"/g, '\\"').replace(/\$/g, '\\$')}" > /etc/nginx/sites-available/admin &&
  echo "${nginxConfigApi.replace(/"/g, '\\"').replace(/\$/g, '\\$')}" > /etc/nginx/sites-available/api &&
  ln -sf /etc/nginx/sites-available/humfleet /etc/nginx/sites-enabled/ &&
  ln -sf /etc/nginx/sites-available/admin /etc/nginx/sites-enabled/ &&
  ln -sf /etc/nginx/sites-available/api /etc/nginx/sites-enabled/ &&
  rm -f /etc/nginx/sites-enabled/default &&
  systemctl restart nginx
`;

conn.on('ready', () => {
  console.log('Connected. Installing Nginx and configuring routes...');
  conn.exec(command, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Nginx setup completed with code ' + code);
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
