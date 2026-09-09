const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  // Check the backend route for approve
  conn.exec('grep -n "approve" /root/hum-fleet/server.js | head -30', (err, stream) => {
    stream.on('data', d => process.stdout.write('ROUTE: ' + d.toString()));
    stream.on('close', () => {
      // Check if there are any drivers stuck in Pending after being approved
      conn.exec('curl -s "http://localhost:5000/api/drivers?status=Pending&limit=5" | python3 -c "import sys,json; data=json.load(sys.stdin); items=data[\'data\'] if isinstance(data,dict) else data; print([(d[\'name\'],d[\'status\'],d[\'id\']) for d in items[:5]])"', (err2, stream2) => {
        stream2.on('data', d => process.stdout.write('PENDING_DRIVERS: ' + d.toString()));
        stream2.stderr.on('data', d => process.stdout.write('ERR: ' + d.toString()));
        stream2.on('close', () => conn.end());
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
