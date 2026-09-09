const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(`
sed -i '313,320d' /root/hum-fleet/src/pages/PassengerDashboard.jsx &&
sed -i '261i \\  const [categories, setCategories] = useState([\\n    { id: \\'auto\\', name: \\'🛺 Auto Rickshaw\\', maxPassengers: 3, baseFare: 30, ratePerKm: 12, icon: \\'🛺\\' },\\n    { id: \\'hatchback\\', name: \\'Mini / Hatchback\\', maxPassengers: 4, baseFare: 50, ratePerKm: 15, icon: \\'🚗\\' },\\n    { id: \\'sedan\\', name: \\'Sedan (AC)\\', maxPassengers: 4, baseFare: 70, ratePerKm: 18, icon: \\'🚘\\' },\\n    { id: \\'suv\\', name: \\'SUV / XL (6 Seater)\\', maxPassengers: 6, baseFare: 120, ratePerKm: 25, icon: \\'🚐\\' },\\n    { id: \\'ev\\', name: \\'⚡ EV Green Cab (Eco)\\', maxPassengers: 4, baseFare: 60, ratePerKm: 16, icon: \\'⚡\\' }\\n  ]);' /root/hum-fleet/src/pages/PassengerDashboard.jsx &&
cd /root/hum-fleet && npm run build && pm2 restart frontend
  `, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => { conn.end(); }).on('data', (data) => { console.log('OUT: ' + data); });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
