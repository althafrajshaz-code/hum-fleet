const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const regPayload = JSON.stringify({
    name: 'Inam', email: 'inam@gmail.com', phone: '+919999999999', password: 'assd123.com',
    licenseNumber: 'DL-12345', vehicleCategory: 'Mini'
  });
  
  const cmd = `curl -s -X POST -H "Content-Type: application/json" -d '${regPayload}' http://localhost:5000/api/drivers`;
  
  conn.exec(cmd, (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; });
    stream.on('close', () => {
      console.log('Reg Result:', out);
      
      const appCmd = `curl -s -X POST http://localhost:5000/api/drivers/inam@gmail.com/approve`;
      conn.exec(appCmd, (err2, stream2) => {
        stream2.on('data', d => console.log('Approve Result:', d.toString()));
        stream2.on('close', () => conn.end());
      });
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
