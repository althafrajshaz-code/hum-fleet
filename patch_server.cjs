const fs = require('fs');

let code = fs.readFileSync('server/index.js', 'utf8');

const v2 = `const FIREBASE_DB_URL = 'https://hum-4bb7f-default-rtdb.firebaseio.com/data.json';
let dataDirty = false;

function sanitizeKeys(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeKeys);
  const newObj = {};
  for (let k in obj) {
    let newKey = k.replace(/\\./g, ',');
    newObj[newKey] = sanitizeKeys(obj[k]);
  }
  return newObj;
}

function desanitizeKeys(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(desanitizeKeys);
  const newObj = {};
  for (let k in obj) {
    let newKey = k.replace(/,/g, '.');
    newObj[newKey] = desanitizeKeys(obj[k]);
  }
  return newObj;
}

function saveData() {
  dataDirty = true;
}

let isDataLoaded = false;
async function loadDataAsync() {
  if (isDataLoaded && process.env.NODE_ENV !== 'production') return; // Cache locally
  try {
    const res = await fetch(FIREBASE_DB_URL);
    const parsed = desanitizeKeys(await res.json());
    if (parsed) {
      if (parsed.drivers) drivers = parsed.drivers;
      if (parsed.passengers) passengers = parsed.passengers;
      if (parsed.activeRides) activeRides = parsed.activeRides;
      if (parsed.settings) settings = { ...settings, ...parsed.settings };
      if (parsed.vehicleCategories) vehicleCategories = parsed.vehicleCategories;
      if (parsed.adminCredentials) adminCredentials = parsed.adminCredentials;
      if (parsed.driverMessages) driverMessages = parsed.driverMessages;
      if (parsed.passengerMessages) passengerMessages = parsed.passengerMessages;
      if (parsed.rideMessages) rideMessages = parsed.rideMessages;
      if (parsed.dynamicLocations) dynamicLocations = parsed.dynamicLocations;
      if (parsed.dynamicVehicleCatalog && Object.keys(parsed.dynamicVehicleCatalog).length > 0) {
        dynamicVehicleCatalog = parsed.dynamicVehicleCatalog;
      }
    }
    isDataLoaded = true;
    console.log('Successfully loaded HUM Fleet database from Firebase');
  } catch (err) {
    console.error('Failed to load data from Firebase:', err);
  }
}

async function saveDataAsync() {
  try {
    const data = { drivers, passengers, activeRides, settings, vehicleCategories, adminCredentials, driverMessages, passengerMessages, rideMessages, dynamicLocations, dynamicVehicleCatalog };
    await fetch(FIREBASE_DB_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitizeKeys(data))
    });
  } catch (err) {
    console.error('Failed to save data to Firebase:', err);
  }
}

// Vercel Serverless Middleware
app.use(async (req, res, next) => {
  await loadDataAsync();
  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);
  
  const handleResponse = async (body, originalFn) => {
    if (dataDirty) {
      await saveDataAsync();
      dataDirty = false;
    }
    return originalFn(body);
  };
  
  res.json = (body) => { handleResponse(body, originalJson); return res; };
  res.send = (body) => { handleResponse(body, originalSend); return res; };
  next();
});

// Polling endpoint for driver location (Replacing Socket.io)
app.get('/api/rides/:id/location', (req, res) => {
  const ride = activeRides.find(r => String(r.id) === String(req.params.id));
  if (!ride) return res.status(404).json({ error: 'Ride not found' });
  const driver = drivers.find(d => d.email === ride.driverEmail);
  if (!driver) return res.status(404).json({ error: 'Driver not found' });
  res.json({ lat: driver.lat, lng: driver.lng, bearing: driver.bearing || 0 });
});
`;

// Replace saveData and loadData block
code = code.replace(/function saveData\(\) \{[\s\S]*?loadData\(\);/m, v2);

// Remove socket.io initialization
code = code.replace(/const http = require\('http'\);\nconst \{ Server \} = require\('socket\.io'\);/g, '');
code = code.replace(/const server = http\.createServer\(app\);\nconst io = new Server\([\s\S]*?\}\);/g, '');
code = code.replace(/io\.on\('connection', \([\s\S]*?\}\);/g, '');

// Fix socket.io calls
code = code.replace(/if\s*\(io(\s*&&\s*ride)?\)\s*\{[\s\S]*?\}/g, '// Socket.io removed for Vercel');

// Replace listening code with Vercel export
const listenCode = `if (require.main === module) {
  app.listen(PORT, () => {
    console.log(\`HUM Fleet API Server running on port \${PORT}\`);
  });
}
module.exports = app;`;
code = code.replace(/app\.listen\(PORT, \(\) => \{[\s\S]*?\}\);/g, listenCode);

fs.writeFileSync('server/index.js', code);
console.log('Successfully patched server/index.js');
