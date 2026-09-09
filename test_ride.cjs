const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const ridePayload = JSON.stringify({
    pickup: 'Test Pickup',
    dropoff: 'Test Dropoff',
    stops: [],
    fare: '10.00',
    passengerName: 'Test Pass',
    passengerEmail: 'test@passenger.com',
    pickupCoords: { lat: 25.5, lng: 55.6 },
    dropoffCoords: { lat: 25.6, lng: 55.7 },
    isPreBooked: false,
    vehicleCategory: 'Mini'
  });
  
  const cmd = `curl -s -X POST -H "Content-Type: application/json" -d '${ridePayload}' http://localhost:5000/api/rides`;
  
  conn.exec(cmd, (err, stream) => {
    let out = '';
    stream.on('data', d => { out += d; });
    stream.on('close', () => {
      console.log('Ride Creation:', out);
      conn.end();
    });
  });
}).connect({ host: '187.127.165.79', port: 22, username: 'root', password: 'SHAFLAlTHAF.1992' });
