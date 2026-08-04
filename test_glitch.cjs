const https = require('https');

const options = {
  hostname: 'api.glitch.com',
  port: 443,
  path: '/v1/projects',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', data));
});

req.on('error', error => console.error(error));
req.write(JSON.stringify({ domain: 'hum-fleet-backend-' + Date.now() }));
req.end();
