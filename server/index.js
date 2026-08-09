require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Schema — single document persistence pattern
const AppStateSchema = new mongoose.Schema({
  _id: { type: String, default: 'humFleetState' },
  drivers: { type: mongoose.Schema.Types.Mixed, default: [] },
  passengers: { type: mongoose.Schema.Types.Mixed, default: [] },
  activeRides: { type: mongoose.Schema.Types.Mixed, default: [] },
  settings: { type: mongoose.Schema.Types.Mixed, default: {} },
  vehicleCategories: { type: mongoose.Schema.Types.Mixed, default: [] },
  promotions: { type: mongoose.Schema.Types.Mixed, default: [] },
  adminCredentials: { type: mongoose.Schema.Types.Mixed, default: {} },
  driverMessages: { type: mongoose.Schema.Types.Mixed, default: {} },
  passengerMessages: { type: mongoose.Schema.Types.Mixed, default: {} },
  rideMessages: { type: mongoose.Schema.Types.Mixed, default: {} },
  dynamicLocations: { type: mongoose.Schema.Types.Mixed, default: [] },
  employees: { type: mongoose.Schema.Types.Mixed, default: [] }
}, { timestamps: true, minimize: false });

const AppState = mongoose.model('AppState', AppStateSchema);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Root status page
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>HUM Fleet API Server</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0b0f17; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background: #151c2c; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 48px 40px; max-width: 480px; width: 90%; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
    .badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(16,185,129,0.12); color: #10b981; border: 1px solid rgba(16,185,129,0.3); border-radius: 999px; padding: 6px 16px; font-size: 13px; font-weight: 600; margin-bottom: 24px; }
    .dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse 1.5s infinite; }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
    h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
    p { color: #64748b; font-size: 15px; margin-bottom: 32px; }
    .info { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; text-align: left; }
    .info-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 14px; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #64748b; }
    .info-value { color: #f8fafc; font-weight: 500; }
    .green { color: #10b981; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge"><span class="dot"></span> Server Online</div>
    <h1>HUM Fleet API</h1>
    <p>Backend operations server for HUM Fleet ride management platform.</p>
    <div class="info">
      <div class="info-row"><span class="info-label">Status</span><span class="info-value green">● Running</span></div>
      <div class="info-row"><span class="info-label">Environment</span><span class="info-value">Production</span></div>
      <div class="info-row"><span class="info-label">API Base</span><span class="info-value">/api/*</span></div>
      <div class="info-row"><span class="info-label">Uptime</span><span class="info-value">${Math.floor(process.uptime())}s</span></div>
    </div>
  </div>
</body>
</html>`);
});

let adminCredentials = {
  username: 'admin',
  password: 'admin123'
};

// Mock passengers (users) array with wallets and ratings
let passengers = [
  {
    id: 1,
    name: 'Anoop Nair',
    email: 'anoop.nair@gmail.com',
    phone: '+91 99999 88888',
    password: 'pass123',
    wallet: { totalSpent: 0, taxPaid: 0 },
    rating: 5.0,
    ratings: []
  }
];

// Mock drivers preset with default Kerala coordinates (Kochi, Trivandrum, Calicut)
let drivers = [
  {
    id: 1,
    name: 'Althaf A',
    email: 'rajesh.k@gmail.com',
    phone: '+91 98765 43210',
    manufacturer: 'Tata',
    model: 'Nexon',
    year: '2023',
    plate: 'KL 07 CD 4567',
    status: 'Approved',
    isBlocked: false,
    ratePerKm: '15.00',
    ratePerHour: '120.00',
    lat: 9.9777, // Marine Drive, Ernakulam, Kochi
    lng: 76.2758,
    photos: { front: 'front_nexon.jpg', rear: 'rear_nexon.jpg', left: 'left_nexon.jpg', right: 'right_nexon.jpg', inside: 'inside_nexon.jpg' },
    docs: { rc: 'rc_rajesh.pdf', pollution: 'puc_rajesh.pdf', insurance: 'insurance_rajesh.pdf', fitness: 'fitness_rajesh.pdf', license: 'license_rajesh.pdf' },
    wallet: { cashCollected: 0, toBePaid: 0, gstCollected: 0 },
    rating: 5.0,
    ratings: []
  },
  {
    id: 2,
    name: 'Amit Patel',
    email: 'amit.patel@yahoo.com',
    phone: '+91 91234 56789',
    manufacturer: 'Hyundai',
    model: 'Creta',
    year: '2022',
    plate: 'KL 01 BP 9876',
    status: 'Approved',
    isBlocked: false,
    ratePerKm: '15.00',
    ratePerHour: '120.00',
    lat: 8.5581, // Technopark, Trivandrum
    lng: 76.8816,
    photos: { front: 'front_creta.jpg', rear: 'rear_creta.jpg', left: 'left_creta.jpg', right: 'right_creta.jpg', inside: 'inside_creta.jpg' },
    docs: { rc: 'rc_amit.pdf', pollution: 'puc_amit.pdf', insurance: 'insurance_amit.pdf', fitness: 'insurance_amit.pdf', license: 'license_amit.pdf' },
    wallet: { cashCollected: 0, toBePaid: 0, gstCollected: 0 },
    rating: 5.0,
    ratings: []
  },
  {
    id: 3,
    name: 'Priya Sharma',
    email: 'sharma.priya@outlook.com',
    phone: '+91 98111 22233',
    manufacturer: 'Maruti Suzuki',
    model: 'Swift',
    year: '2024',
    plate: 'KL 11 BZ 1122',
    status: 'Approved',
    isBlocked: false,
    ratePerKm: '15.00',
    ratePerHour: '120.00',
    lat: 11.2588, // Kozhikode Beach, Calicut
    lng: 75.7804,
    photos: { front: 'front_swift.jpg', rear: 'rear_swift.jpg', left: 'left_swift.jpg', right: 'right_swift.jpg', inside: 'inside_swift.jpg' },
    docs: { rc: 'rc_priya.pdf', pollution: 'puc_priya.pdf', insurance: 'insurance_priya.pdf', fitness: 'fitness_priya.pdf', license: 'license_priya.pdf' },
    wallet: { cashCollected: 0, toBePaid: 0, gstCollected: 0 },
    rating: 5.0,
    ratings: []
  }
];

let settings = {
  baseFare: '50.00',
  ratePerKm: '15.00',       // Platform Min Rate/KM for drivers
  minRatePerHour: '100.00', // Platform Min Rate/Hour for drivers
  surgeMultiplier: '1.0',
  systemStatus: 'online',
  gatewayType: 'upi', // 'upi' or 'bank'
  upiId: 'humfleet@okaxis',
  bankName: 'HDFC Bank',
  accountNo: '50100481293845',
  ifscCode: 'HDFC0000123',
  accountHolder: 'HUM FLEET PLATFORMS PVT LTD',
  qrCodeUrl: '' // Base64 QR code image
};

// Default Vehicle Categories List with Separate Base Fares and Rates/KM
let vehicleCategories = [
  { id: 'auto', name: '🛺 Auto Rickshaw', maxPassengers: 3, baseFare: 30.00, ratePerKm: 12.00, icon: '🛺' },
  { id: 'mini', name: '🚙 Mini', maxPassengers: 4, baseFare: 40.00, ratePerKm: 14.00, icon: '🚙' },
  { id: 'hatchback', name: '🚗 Hatchback', maxPassengers: 4, baseFare: 50.00, ratePerKm: 15.00, icon: '🚗' },
  { id: 'sedan', name: '🚘 Sedan (AC)', maxPassengers: 4, baseFare: 70.00, ratePerKm: 18.00, icon: '🚘' },
  { id: 'suv', name: '🚐 SUV / XL (6 Seater)', maxPassengers: 6, baseFare: 120.00, ratePerKm: 25.00, icon: '🚐' },
  { id: 'ev', name: '⚡ EV Green Cab (Eco)', maxPassengers: 4, baseFare: 60.00, ratePerKm: 16.00, icon: '⚡' },
  { id: 'premium', name: '💎 Premium / Luxury', maxPassengers: 4, baseFare: 150.00, ratePerKm: 30.00, icon: '💎' }
];

// Global ride matching system database, driver direct messaging store & in-trip ride chat store
let activeRides = [];
let driverMessages = {};
let passengerMessages = {};
let rideMessages = {};
let dynamicLocations = []; // Store for newly searched/added locations by passengers
let promotions = [];
let employees = [];

// Helper to safely save to DB without hanging if disconnected
async function saveToMongoDB() {
  if (mongoose.connection.readyState !== 1) {
    console.warn("MongoDB not connected. Skipping DB save (data is in memory).");
    return;
  }
  try {
    await AppState.updateOne(
      { _id: 'humFleetState' },
      {
        $set: {
          drivers,
          passengers,
          activeRides,
          settings,
          vehicleCategories,
          adminCredentials,
          driverMessages,
          passengerMessages,
          rideMessages,
          dynamicLocations,
          promotions,
          employees
        }
      },
      { upsert: true }
    );
  } catch (err) {
    console.error("Failed to save to MongoDB:", err);
  }
}

// Persistence Helpers — MongoDB backed with debounce
let _saveTimer = null;
function saveData() {
  if (_saveTimer) clearTimeout(_saveTimer);
  _saveTimer = setTimeout(async () => {
    await saveToMongoDB();
  }, 300);
}

async function loadData() {
  try {
    const doc = await AppState.findById('humFleetState').lean();
    if (doc) {
      let needsSave = false;

      if (doc.drivers) {
        drivers = doc.drivers;
      } else {
        needsSave = true;
      }

      if (doc.passengers) {
        passengers = doc.passengers;
        // Retroactively assign Customer ID (verificationCode) to existing passengers
        passengers.forEach(p => {
          if (!p.verificationCode) {
            p.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            needsSave = true;
          }
        });
      } else {
        needsSave = true;
      }

      if (doc.activeRides) {
        activeRides = doc.activeRides;
      } else {
        needsSave = true;
      }

      if (doc.settings) {
        settings = { ...settings, ...doc.settings };
      } else {
        needsSave = true;
      }

      if (doc.vehicleCategories) {
        vehicleCategories = doc.vehicleCategories;
      } else {
        needsSave = true;
      }

      if (doc.adminCredentials && doc.adminCredentials.username) {
        adminCredentials = doc.adminCredentials;
      } else {
        needsSave = true;
      }

      if (doc.driverMessages) {
        driverMessages = doc.driverMessages;
      } else {
        needsSave = true;
      }

      if (doc.passengerMessages) {
        passengerMessages = doc.passengerMessages;
      } else {
        needsSave = true;
      }

      if (doc.rideMessages) {
        rideMessages = doc.rideMessages;
      } else {
        needsSave = true;
      }

      if (doc.dynamicLocations) {
        dynamicLocations = doc.dynamicLocations;
      } else {
        needsSave = true;
      }

      if (doc.employees) {
        employees = doc.employees;
      } else {
        needsSave = true;
      }

      if (doc.promotions) {
        promotions = doc.promotions;
      } else {
        needsSave = true;
      }

      console.log('Successfully restored HUM Fleet database state from MongoDB');
      if (needsSave) {
        saveData();
        console.log('Synchronized missing keys back to MongoDB');
      }
    } else {
      saveData();
      console.log('Created fresh MongoDB state with default initial data.');
    }
  } catch (err) {
    console.error('Failed to load data from MongoDB:', err);
  }
}

// Start server first so Render health checks pass
app.listen(PORT, () => {
  console.log(`HUM Fleet API Server running on port ${PORT}`);
});

let dbConnectionError = null;

// Connect to MongoDB in background
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await loadData();
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err);
    dbConnectionError = err.toString();
    console.error('PLEASE ENSURE MONGODB ATLAS NETWORK ACCESS IS SET TO ALLOW ALL IP ADDRESSES (0.0.0.0/0)');
    loadData(); // Fallback to memory if offline
  });

// Haversine formula to compute distance in KM
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in KM
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// Admin auth
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === adminCredentials.username && password === adminCredentials.password) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials' });
  }
});

// Admin update credentials
app.post('/api/admin/update-credentials', (req, res) => {
  const { username, currentPassword, newPassword } = req.body;
  if (currentPassword !== adminCredentials.password) {
    return res.status(400).json({ error: 'Incorrect current password' });
  }
  adminCredentials.username = username;
  adminCredentials.password = newPassword;
  res.json({ success: true });
});

// Get passenger list (for Admin CMS)
app.get('/api/passengers', (req, res) => {
  res.json(passengers);
});

// Passenger signup
app.post('/api/passengers/signup', (req, res) => {
  const { name, email, phone, password } = req.body;
  const cleanPhone = (p) => p ? p.replace(/[^0-9]/g, '') : '';
  const cleanRegPhone = cleanPhone(phone);
  
  const exists = passengers.find(p => 
    (p.email && p.email.toLowerCase() === email.toLowerCase()) || 
    (cleanPhone(p.phone) === cleanRegPhone)
  );
  if (exists) {
    return res.status(400).json({ error: 'A passenger account with this email or phone number is already registered. Please log in.' });
  }
  const newPassenger = {
    id: passengers.length + 1,
    name,
    email,
    phone,
    password,
    wallet: { totalSpent: 0, taxPaid: 0 },
    rating: 5.0,
    ratings: [],
    verificationCode: Math.floor(100000 + Math.random() * 900000).toString()
  };
  passengers.push(newPassenger);
  saveData();
  res.status(201).json(newPassenger);
});

// Passenger Google OAuth sign-in / sign-up
app.post('/api/passengers/google-auth', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'No token provided.' });

    let googleUser;

    if (token === 'mock_token') {
      // Mock user for testing without a real Google client id
      googleUser = { name: 'Test User', email: 'testuser@gmail.com', picture: '' };
    } else {
      // Verify token with Google and fetch profile
      const https = require('https');
      const profileData = await new Promise((resolve, reject) => {
        https.get(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`,
          (r) => {
            let body = '';
            r.on('data', (chunk) => { body += chunk; });
            r.on('end', () => {
              try { resolve(JSON.parse(body)); }
              catch (e) { reject(new Error('Invalid Google response')); }
            });
          }
        ).on('error', reject);
      });

      if (profileData.error || profileData.error_description) {
        return res.status(401).json({ error: 'Invalid or expired Google token.' });
      }
      googleUser = { name: profileData.name, email: profileData.email, picture: profileData.picture };
    }

    if (!googleUser.email) {
      return res.status(400).json({ error: 'Could not retrieve email from Google account.' });
    }

    // Find existing passenger or create one
    let passenger = passengers.find(p => p.email && p.email.toLowerCase() === googleUser.email.toLowerCase());

    if (!passenger) {
      passenger = {
        id: passengers.length + 1,
        name: googleUser.name || googleUser.email.split('@')[0],
        email: googleUser.email,
        phone: '',
        password: null, // Google-auth accounts have no password
        googleAuth: true,
        wallet: { totalSpent: 0, taxPaid: 0 },
        rating: 5.0,
        ratings: [],
        verificationCode: Math.floor(100000 + Math.random() * 900000).toString()
      };
      passengers.push(passenger);
      saveData();
    } else {
      if (!passenger.verificationCode) {
        passenger.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        saveData();
      }
    }

    res.json({
      success: true,
      name: passenger.name,
      email: passenger.email,
      phone: passenger.phone,
      verificationCode: passenger.verificationCode
    });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ error: 'Google authentication failed. Please try again.' });
  }
});

// Passenger login (supports email or phone number)
app.post('/api/passengers/login', (req, res) => {
  const { loginId, password } = req.body;
  const user = passengers.find(p => 
    (p.email === loginId || p.phone === loginId) && p.password === password
  );
  if (user) {
    if (!user.verificationCode) {
      user.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      saveData();
    }
    res.json({ success: true, name: user.name, email: user.email, phone: user.phone, verificationCode: user.verificationCode });
  } else {
    res.status(401).json({ error: 'Invalid email/phone number or password.' });
  }
});

// Driver login (supports email or phone number)
app.post('/api/drivers/login', (req, res) => {
  const { loginId, password } = req.body;
  console.log(`Driver login attempt: loginId="${loginId}", password="${password}"`);
  
  const user = drivers.find(d => 
    (d.email && d.email.toLowerCase() === loginId.toLowerCase() || d.phone === loginId) && 
    (d.password === password || (!d.password && password === 'driver123'))
  );
  if (user) {
    console.log(`Driver login successful for: ${user.email}`);
    res.json({ success: true, name: user.name, email: user.email, phone: user.phone });
  } else {
    console.log(`Driver login failed for loginId="${loginId}"`);
    res.status(401).json({ error: 'Invalid email/phone number or password.' });
  }
});

// Get vehicle categories
const vehicleCatalog = require('./vehicleCatalog.json');

app.get('/api/vehicles/catalog', (req, res) => {
  res.json(vehicleCatalog);
});

app.get('/api/vehicle-categories', (req, res) => {
  res.json(vehicleCategories);
});

app.get('/api/debug/categories', (req, res) => {
  res.json(vehicleCategories);
});

app.get('/api/debug/db', (req, res) => {
  res.json({ 
    readyState: mongoose.connection.readyState,
    error: dbConnectionError,
    uriLength: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
    uriStart: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 10) : 'none'
  });
});

// Add new vehicle category
app.post('/api/vehicle-categories', async (req, res) => {
  const { name, maxPassengers, baseFare, ratePerKm, icon } = req.body;
  
  if (!name || !maxPassengers || baseFare === undefined || ratePerKm === undefined) {
    return res.status(400).json({ error: 'All fields (name, maxPassengers, baseFare, ratePerKm) are required.' });
  }

  const exists = vehicleCategories.find(c => c.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: 'A category with this name already exists.' });
  }

  const newCategory = {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    maxPassengers: parseInt(maxPassengers),
    baseFare: parseFloat(baseFare),
    ratePerKm: parseFloat(ratePerKm),
    icon: icon || '🚗'
  };
  vehicleCategories.push(newCategory);
  
  await saveToMongoDB();
  
  res.status(201).json(newCategory);
});

// Edit existing vehicle category
app.put('/api/vehicle-categories/:id', async (req, res) => {
  const id = req.params.id;
  const { name, maxPassengers, baseFare, ratePerKm } = req.body;
  const category = vehicleCategories.find(c => String(c.id) === id || String(c._id) === id);
  if (category) {
    if (name) category.name = name;
    if (maxPassengers !== undefined) category.maxPassengers = parseInt(maxPassengers);
    if (baseFare !== undefined) category.baseFare = parseFloat(baseFare);
    if (ratePerKm !== undefined) category.ratePerKm = parseFloat(ratePerKm);
    
    // Immediately persist to DB in serverless env
    await saveToMongoDB();
    
    res.json(category);
  } else {
    res.status(404).json({ error: 'Category not found', requestedId: id, availableIds: vehicleCategories.map(c => ({ id: c.id, _id: c._id })) });
  }
});

// Delete vehicle category
app.delete('/api/vehicle-categories/:id', async (req, res) => {
  const id = req.params.id;
  vehicleCategories = vehicleCategories.filter(c => String(c.id) !== id && String(c._id) !== id);
  
  await saveToMongoDB();
  
  res.json({ message: 'Category deleted successfully' });
});

// Get passenger status by email
app.get('/api/passengers/status', (req, res) => {
  const { email } = req.query;
  const passenger = passengers.find(p => p.email === email);
  if (passenger) {
    res.json({
      id: passenger.id || passenger._id,
      name: passenger.name,
      email: passenger.email,
      phone: passenger.phone,
      rating: passenger.rating || 5.0,
      profilePic: passenger.profilePic || null
    });
  } else {
    res.status(404).json({ error: 'Passenger not found' });
  }
});

// Get driver status by email
app.get('/api/drivers/status', (req, res) => {
  const { email } = req.query;
  const driver = drivers.find(d => d.email === email);
  if (driver) {
    res.json({ 
      status: driver.status, 
      isBlocked: driver.isBlocked || false,
      isDailyVerified: true,
      lastVerifiedAt: driver.lastVerifiedAt || null,
      isOnline: driver.isOnline || false,
      currentRide: driver.currentRide || null,
      name: driver.name,
      email: driver.email,
      manufacturer: driver.manufacturer, 
      model: driver.model,
      plate: driver.plate,
      phone: driver.phone,
      lat: driver.lat,
      lng: driver.lng,
      ratePerKm: driver.ratePerKm || '15.00',
      ratePerHour: driver.ratePerHour || '120.00',
      rating: driver.rating || 5.0,
      photos: driver.photos || {},
      docs: driver.docs || {},
      profilePic: driver.profilePic || null,
      bankHolder: driver.bankHolder || null,
      bankName: driver.bankName || null,
      accountNo: driver.accountNo || null,
      ifscCode: driver.ifscCode || null,
      upiId: driver.upiId || null
    });
  } else {
    res.status(404).json({ error: 'Driver not found' });
  }
});

// Process Daily Face Verification
app.post('/api/drivers/verify-daily', (req, res) => {
  const { email, photo } = req.body;
  const driver = drivers.find(d => d.email === (email || 'rajesh.k@gmail.com'));
  if (driver) {
    driver.lastVerifiedAt = new Date().toISOString();
    driver.dailyFacePhoto = photo || null;
    saveData();
    res.json({ success: true, verifiedAt: driver.lastVerifiedAt });
  } else {
    res.status(404).json({ error: 'Driver not found' });
  }
});

// Update Driver Profile Picture
app.post('/api/drivers/profile-pic', (req, res) => {
  const { email, profilePic } = req.body;
  const driver = drivers.find(d => d.email === (email || 'rajesh.k@gmail.com'));
  if (driver) {
    driver.profilePic = profilePic;
    saveData();
    res.json({ success: true, profilePic: driver.profilePic });
  } else {
    res.status(404).json({ error: 'Driver not found' });
  }
});

// Get driver vehicles list
app.get('/api/drivers/vehicles', (req, res) => {
  const { email } = req.query;
  const driver = drivers.find(d => d.email === email);
  if (!driver) return res.status(404).json({ error: 'Driver not found' });
  
  if (!driver.vehicles || driver.vehicles.length === 0) {
    driver.vehicles = [
      {
        id: 1,
        manufacturer: driver.manufacturer || 'Tata',
        model: driver.model || 'Nexon',
        year: driver.year || '2023',
        plate: driver.plate || 'DL 3C AY 4567',
        photos: driver.photos || {},
        docs: driver.docs || {},
        isActive: true,
        status: driver.status === 'Approved' ? 'Approved' : 'Pending'
      }
    ];
    saveData();
  }
  
  res.json(driver.vehicles);
});

// Add new vehicle to driver's account
app.post('/api/drivers/vehicles', (req, res) => {
  const { email, manufacturer, model, year, plate, photos } = req.body;
  const driver = drivers.find(d => d.email === email);
  if (!driver) return res.status(404).json({ error: 'Driver not found' });

  if (!driver.vehicles) driver.vehicles = [];
  
  const exists = driver.vehicles.find(v => v.plate.toLowerCase() === plate.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: 'Vehicle with this plate number is already registered under your account.' });
  }

  const newVehicle = {
    id: driver.vehicles.length > 0 ? Math.max(...driver.vehicles.map(v => v.id)) + 1 : 1,
    manufacturer,
    model,
    year,
    plate,
    photos: photos || {},
    docs: req.body.docs || {},
    isActive: false,
    status: 'Pending'
  };

  driver.vehicles.push(newVehicle);
  saveData();
  res.status(201).json(driver.vehicles);
});

// Set active vehicle
app.post('/api/drivers/vehicles/activate', (req, res) => {
  const { email, vehicleId } = req.body;
  const driver = drivers.find(d => d.email === email);
  if (!driver) return res.status(404).json({ error: 'Driver not found' });
  if (!driver.vehicles) return res.status(400).json({ error: 'No vehicles registered.' });

  const vehicle = driver.vehicles.find(v => v.id === parseInt(vehicleId));
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

  if (vehicle.status !== 'Approved') {
    return res.status(400).json({ error: 'Only vehicles approved by Admin can be activated.' });
  }

  driver.vehicles.forEach(v => {
    v.isActive = (v.id === vehicle.id);
  });

  driver.manufacturer = vehicle.manufacturer;
  driver.model = vehicle.model;
  driver.year = vehicle.year;
  driver.plate = vehicle.plate;
  driver.photos = vehicle.photos || {};
  driver.docs = vehicle.docs || {};

  saveData();
  res.json({ success: true, vehicles: driver.vehicles });
});

// Admin reviews (approves/rejects) a vehicle
app.post('/api/drivers/vehicles/review', (req, res) => {
  const { email, vehicleId, status } = req.body;
  const driver = drivers.find(d => d.email === email);
  if (!driver) return res.status(404).json({ error: 'Driver not found' });
  if (!driver.vehicles) return res.status(400).json({ error: 'No vehicles registered for this driver.' });

  const vehicle = driver.vehicles.find(v => v.id === parseInt(vehicleId));
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

  vehicle.status = status;

  const activeVehicle = driver.vehicles.find(v => v.isActive);
  if (status === 'Approved' && (!activeVehicle || activeVehicle.status !== 'Approved')) {
    driver.vehicles.forEach(v => {
      v.isActive = (v.id === vehicle.id);
    });
    driver.manufacturer = vehicle.manufacturer;
    driver.model = vehicle.model;
    driver.year = vehicle.year;
    driver.plate = vehicle.plate;
    driver.photos = vehicle.photos || {};
    driver.docs = vehicle.docs || {};
  }

  saveData();
  res.json({ success: true, vehicles: driver.vehicles });
});

// Delete a vehicle
app.delete('/api/drivers/vehicles', (req, res) => {
  const { email, vehicleId } = req.body;
  const driver = drivers.find(d => d.email === email);
  if (!driver) return res.status(404).json({ error: 'Driver not found' });
  if (!driver.vehicles) return res.status(400).json({ error: 'No vehicles registered.' });

  const id = parseInt(vehicleId);
  const vehicleIndex = driver.vehicles.findIndex(v => v.id === id);
  if (vehicleIndex === -1) return res.status(404).json({ error: 'Vehicle not found' });

  const deletedVehicle = driver.vehicles[vehicleIndex];
  driver.vehicles.splice(vehicleIndex, 1);

  if (deletedVehicle.isActive && driver.vehicles.length > 0) {
    const newActive = driver.vehicles[0];
    newActive.isActive = true;
    driver.manufacturer = newActive.manufacturer;
    driver.model = newActive.model;
    driver.year = newActive.year;
    driver.plate = newActive.plate;
    driver.photos = newActive.photos || {};
    driver.docs = newActive.docs || {};
  } else if (driver.vehicles.length === 0) {
    driver.manufacturer = '';
    driver.model = '';
    driver.year = '';
    driver.plate = '';
    driver.photos = {};
    driver.docs = {};
  }

  saveData();
  res.json({ success: true, vehicles: driver.vehicles });
});

// Update Passenger Profile Picture
app.post('/api/passengers/profile-pic', (req, res) => {
  const { email, profilePic } = req.body;
  const passenger = passengers.find(p => p.email === email || p.email === 'anoop.nair@gmail.com');
  if (passenger) {
    passenger.profilePic = profilePic;
    saveData();
    res.json({ success: true, profilePic: passenger.profilePic });
  } else {
    res.status(404).json({ error: 'Passenger not found' });
  }
});

// Update Driver Car Photos & Compliance Documents
app.post('/api/drivers/photos', (req, res) => {
  const { email, photos, docs } = req.body;
  const driver = drivers.find(d => d.email === (email || 'rajesh.k@gmail.com'));
  if (driver) {
    if (photos) driver.photos = { ...driver.photos, ...photos };
    if (docs) driver.docs = { ...driver.docs, ...docs };
    saveData();
    res.json({ success: true, photos: driver.photos, docs: driver.docs });
  } else {
    res.status(404).json({ error: 'Driver not found' });
  }
});

// Update driver bank account details
app.post('/api/drivers/bank', (req, res) => {
  const { email, bankHolder, bankName, accountNo, ifscCode, upiId } = req.body;
  const driver = drivers.find(d => d.email === (email || 'rajesh.k@gmail.com'));
  if (!driver) return res.status(404).json({ error: 'Driver not found' });
  if (bankHolder) driver.bankHolder = bankHolder;
  if (bankName) driver.bankName = bankName;
  if (accountNo) driver.accountNo = accountNo;
  if (ifscCode) driver.ifscCode = ifscCode;
  if (upiId !== undefined) driver.upiId = upiId;
  saveData();
  res.json({ success: true, message: 'Bank details updated successfully.' });
});

// Update driver profile name, profile picture (base64), and/or password
app.post('/api/drivers/profile', (req, res) => {
  const { email, name, profilePic, password } = req.body;
  const driver = drivers.find(d => d.email === email);
  if (!driver) return res.status(404).json({ error: 'Driver not found' });
  if (name && name.trim()) driver.name = name.trim();
  if (profilePic) driver.profilePic = profilePic;
  if (password && password.trim()) driver.password = password.trim();
  saveData();
  res.json({ success: true, driver });
});

// Update driver custom coordinates & online / rest break status
app.post('/api/drivers/location', (req, res) => {
  const { email, lat, lng, isOnline, isPaused } = req.body;
  const driver = drivers.find(d => d.email === (email || 'rajesh.k@gmail.com'));
  if (driver) {
    // 15-HOUR SHIFT LIMIT & 6-HOUR MANDATORY REST CHECK
    const currentShiftMins = driver.shiftMinutes || 0;
    const MANDATORY_REST_MS = 6 * 60 * 60 * 1000; // 6 Hours in milliseconds

    if (currentShiftMins >= 900) {
      if (!driver.restBreakStartedAt) {
        driver.restBreakStartedAt = Date.now();
        saveData();
      }

      const elapsedRestMs = Date.now() - driver.restBreakStartedAt;
      
      // Auto-reset shift if 6 full hours of rest have completed!
      if (elapsedRestMs >= MANDATORY_REST_MS) {
        driver.shiftMinutes = 0;
        delete driver.restBreakStartedAt;
        saveData();
      } else if (isOnline) {
        driver.isOnline = false;
        driver.isPaused = true;
        saveData();
        const remainingMins = Math.ceil((MANDATORY_REST_MS - elapsedRestMs) / 60000);
        const hrs = Math.floor(remainingMins / 60);
        const mins = remainingMins % 60;
        return res.status(403).json({ 
          error: `🛑 Mandatory 6-Hour Rest Period Active: You have completed 15 hours of driving. You must rest for 6 full hours before restarting rides. Remaining: ${hrs}h ${mins}m.` 
        });
      }
    }

    if (lat !== undefined) driver.lat = parseFloat(lat);
    if (lng !== undefined) driver.lng = parseFloat(lng);
    if (isOnline !== undefined) driver.isOnline = Boolean(isOnline);
    if (isPaused !== undefined) driver.isPaused = Boolean(isPaused);
    driver.lastActiveAt = new Date().toISOString();
    
    // Broadcast real-time location and status update to admin
    if (typeof broadcastDriverUpdate === 'function') {
      broadcastDriverUpdate(driver.id, driver.lat, driver.lng, driver.isOnline, driver.currentRide);
    }
    
    // NOTE: saveData() was removed here to save IO and data costs. Locations are held in memory.
    res.json({ 
      success: true, 
      lat: driver.lat, 
      lng: driver.lng, 
      isOnline: driver.isOnline, 
      isPaused: driver.isPaused,
      shiftMinutes: driver.shiftMinutes || 0,
      restBreakStartedAt: driver.restBreakStartedAt || null
    });
  } else {
    res.status(404).json({ error: 'Driver not found' });
  }
});

// Reset driver shift time after 6-hour mandatory rest break
app.post('/api/drivers/shift/reset', (req, res) => {
  const { email, force } = req.body;
  const driver = drivers.find(d => d.email === (email || 'rajesh.k@gmail.com'));
  if (driver) {
    const MANDATORY_REST_MS = 6 * 60 * 60 * 1000; // 6 Hours
    const elapsedRestMs = driver.restBreakStartedAt ? (Date.now() - driver.restBreakStartedAt) : MANDATORY_REST_MS;
    
    if (elapsedRestMs < MANDATORY_REST_MS && !force) {
      const remainingMins = Math.ceil((MANDATORY_REST_MS - elapsedRestMs) / 60000);
      const hrs = Math.floor(remainingMins / 60);
      const mins = remainingMins % 60;
      return res.status(400).json({
        error: `⏳ Mandatory 6-Hour Rest Break in progress (${hrs}h ${mins}m remaining). Rides can be restarted after 6 hours.`
      });
    }

    driver.shiftMinutes = 0;
    delete driver.restBreakStartedAt;
    saveData();
    res.json({ success: true, message: '6-Hour Rest Break Completed! Shift timer reset to 0.', shiftMinutes: 0 });
  } else {
    res.status(404).json({ error: 'Driver not found' });
  }
});

// Admin Live Fleet Monitor API
app.get('/api/admin/fleet-live', (req, res) => {
  const fleetDrivers = drivers.map(d => {
    const activeRide = activeRides.find(r => r.driverEmail === d.email && (r.status === 'Accepted' || r.status === 'In Progress'));
    return {
      ...d,
      isOnline: Boolean(d.isOnline),
      isPaused: Boolean(d.isPaused),
      currentRide: activeRide ? { id: activeRide.id, pickup: activeRide.pickup, dropoff: activeRide.dropoff, fare: activeRide.fare, passengerName: activeRide.passengerName } : null
    };
  });

  const fleetPassengers = passengers.map(p => {
    const activeRide = activeRides.find(r => r.passengerEmail === p.email && (r.status === 'Searching' || r.status === 'Accepted'));
    return {
      ...p,
      activeRide: activeRide ? { id: activeRide.id, status: activeRide.status, pickup: activeRide.pickup, dropoff: activeRide.dropoff, fare: activeRide.fare } : null
    };
  });

  res.json({
    drivers: fleetDrivers,
    passengers: fleetPassengers,
    activeRides,
    onlineDriversCount: fleetDrivers.filter(d => d.isOnline).length,
    ridingDriversCount: fleetDrivers.filter(d => d.currentRide).length,
    offlineDriversCount: fleetDrivers.filter(d => !d.isOnline).length
  });
});

// Update driver custom rates (with backend validation against platform limits!)
app.post('/api/drivers/rates', (req, res) => {
  const { email, ratePerKm: rK, ratePerHour: rH } = req.body;
  const driver = drivers.find(d => d.email === email);
  if (driver) {
    // Validate custom rates against platform limits
    if (parseFloat(rK) < parseFloat(settings.ratePerKm)) {
      return res.status(400).json({ error: `Rate per KM cannot be less than system limit of ₹${settings.ratePerKm}` });
    }
    if (parseFloat(rH) < parseFloat(settings.minRatePerHour)) {
      return res.status(400).json({ error: `Rate per Hour cannot be less than system limit of ₹${settings.minRatePerHour}` });
    }
    driver.ratePerKm = rK;
    driver.ratePerHour = rH;
    res.json(driver);
  } else {
    res.status(404).json({ error: 'Driver not found' });
  }
});

// Get all drivers
app.get('/api/drivers', (req, res) => {
  let { page, limit, search, status } = req.query;
  
  let result = [...drivers];
  
  if (status) {
    result = result.filter(d => d.status === status);
  }
  
  if (search) {
    const s = search.toLowerCase().replace(/\s+/g, '');
    result = result.filter(d => 
      (d.name && d.name.toLowerCase().includes(search.toLowerCase())) ||
      (d.email && d.email.toLowerCase().includes(search.toLowerCase())) ||
      (d.phone && d.phone.includes(search)) ||
      (d.plate && d.plate.toLowerCase().replace(/\s+/g, '').includes(s))
    );
  }
  
  if (page && limit) {
    page = parseInt(page);
    limit = parseInt(limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedResult = result.slice(startIndex, endIndex);
    res.json({
      data: paginatedResult,
      total: result.length,
      page,
      totalPages: Math.ceil(result.length / limit)
    });
  } else {
    res.json(result);
  }
});

// Add new driver application (with backend validation check)
app.post('/api/drivers', (req, res) => {
  const { email, phone, licenseNumber, ratePerKm, ratePerHour } = req.body;

  // Uniqueness validation check
  const cleanPhone = (p) => p ? p.replace(/[^0-9]/g, '') : '';
  const cleanRegPhone = cleanPhone(phone);

  const existingDriver = drivers.find(d => 
    (d.email && d.email.toLowerCase() === email.toLowerCase()) || 
    (cleanPhone(d.phone) === cleanRegPhone) ||
    (d.licenseNumber && licenseNumber && d.licenseNumber.toLowerCase() === licenseNumber.toLowerCase())
  );

  if (existingDriver) {
    if (existingDriver.isBlocked) {
      return res.status(400).json({ error: 'This partner account is blocked. Please contact support.' });
    }
    if (existingDriver.status === 'Approved') {
      return res.status(400).json({ error: 'This partner (Email/Phone/Licence) is already registered and verified. Please log in.' });
    }
    if (existingDriver.status === 'Pending') {
      return res.status(400).json({ error: 'An application with these details is already pending verification.' });
    }
    if (existingDriver.status === 'Rejected') {
      return res.status(400).json({ error: 'A previous application with these details was rejected. Please contact support.' });
    }
    return res.status(400).json({ error: 'A driver with this email, phone, or license is already registered.' });
  }

  // Auto-correct custom rates to platform minimums if they are too low
  const finalRatePerKm = (parseFloat(ratePerKm) < parseFloat(settings.ratePerKm) || !ratePerKm) ? settings.ratePerKm : ratePerKm;
  const finalRatePerHour = (parseFloat(ratePerHour) < parseFloat(settings.minRatePerHour) || !ratePerHour) ? settings.minRatePerHour : ratePerHour;
  
  // Apply corrected rates to body before saving
  req.body.ratePerKm = finalRatePerKm;
  req.body.ratePerHour = finalRatePerHour;

  const newDriver = {
    id: drivers.length + 1,
    status: 'Pending',
    isBlocked: false,
    wallet: { cashCollected: 0, toBePaid: 0 },
    rating: 5.0,
    ratings: [],
    profilePic: req.body.facePhoto || req.body.profilePic || null,
    registrationFacePhoto: req.body.facePhoto || null,
    lastVerifiedAt: req.body.facePhoto ? new Date().toISOString() : null,
    ...req.body
  };
  drivers.push(newDriver);
  saveData();
  res.status(201).json(newDriver);
});

// Approve driver
app.post('/api/drivers/:id/approve', (req, res) => {
  const targetId = req.params.id;
  const driver = drivers.find(d => String(d.id) === String(targetId) || d.email === targetId);
  if (driver) {
    driver.status = 'Approved';
    saveData();
    res.json(driver);
  } else {
    res.status(404).json({ error: 'Driver not found' });
  }
});

// Reject driver
app.post('/api/drivers/:id/reject', (req, res) => {
  const targetId = req.params.id;
  const driver = drivers.find(d => String(d.id) === String(targetId) || d.email === targetId);
  if (driver) {
    driver.status = 'Rejected';
    saveData();
    res.json(driver);
  } else {
    res.status(404).json({ error: 'Driver not found' });
  }
});

// Block driver from receiving trips
app.post('/api/drivers/:id/block', (req, res) => {
  const targetId = req.params.id;
  const driver = drivers.find(d => String(d.id) === String(targetId) || d.email === targetId);
  if (driver) {
    driver.isBlocked = true;
    saveData();
    res.json({ success: true, driver });
  } else {
    res.status(404).json({ error: 'Driver not found' });
  }
});

// Update driver vehicle category (Admin only)
app.put('/api/admin/drivers/:id/category', (req, res) => {
  const targetId = req.params.id;
  const { vehicleCategory } = req.body;
  const driver = drivers.find(d => String(d.id) === String(targetId) || d.email === targetId);
  if (driver) {
    driver.vehicleCategory = vehicleCategory;
    saveData();
    res.json({ success: true, driver });
  } else {
    res.status(404).json({ error: 'Driver not found' });
  }
});

// Unblock driver — restore trip access
app.post('/api/drivers/:id/unblock', (req, res) => {
  const targetId = req.params.id;
  const driver = drivers.find(d => String(d.id) === String(targetId) || d.email === targetId);
  if (driver) {
    driver.isBlocked = false;
    saveData();
    res.json({ success: true, driver });
  } else {
    res.status(404).json({ error: 'Driver not found' });
  }
});

// Get settings
app.get('/api/settings', (req, res) => {
  res.json(settings);
});

// Save settings
app.post('/api/settings', (req, res) => {
  settings = { ...settings, ...req.body };
  saveData();
  res.json(settings);
});

// --- RIDE MATCHING ENDPOINTS ---

// Passenger requests a ride
app.post('/api/rides', (req, res) => {
  const { pickup, dropoff, fare, passengerName, passengerEmail, pickupCoords, dropoffCoords, paymentType, isPreBooked, preBookDate, preBookTime, withPet } = req.body;
  
  // Calculate total ride distance in kilometers
  const totalKm = pickupCoords && dropoffCoords
    ? parseFloat(getDistance(pickupCoords.lat, pickupCoords.lng, dropoffCoords.lat, dropoffCoords.lng).toFixed(1))
    : 8.0;

  const isIntercity = totalKm > 35.0;

  const passenger = passengers.find(p => p.email === passengerEmail);
  const passengerRating = passenger ? passenger.rating : 5.0;

  const newRide = {
    id: activeRides.length + 1,
    pickup,
    dropoff,
    fare,
    passengerName: passengerName || 'Customer',
    passengerEmail: passengerEmail || 'anoop.nair@gmail.com',
    passengerRating,
    status: 'Searching',
    paymentType: paymentType || 'cash', // 'cash' or 'prepaid'
    pickupCoords,
    dropoffCoords,
    totalKm,
    isIntercity,
    driverName: null,
    driverPhone: null,
    driverEmail: null,
    vehicleModel: null,
    vehiclePlate: null,
    driverRating: 5.0,
    isPreBooked: isPreBooked || false,
    preBookDate: preBookDate || null,
    preBookTime: preBookTime || null,
    withPet: withPet || false,
    isActivated: false,
    createdAt: new Date().toISOString()
  };
  activeRides.push(newRide);
  saveData();
  res.status(201).json(newRide);
});

// Helper: check if a point is within a corridor along the route from A to B
// Uses perpendicular distance from point to line segment
function isPointNearRoute(pointLat, pointLng, startLat, startLng, endLat, endLng, corridorKm) {
  // Calculate distance from point to both endpoints
  const dStart = getDistance(pointLat, pointLng, startLat, startLng);
  const dEnd = getDistance(pointLat, pointLng, endLat, endLng);
  const routeLen = getDistance(startLat, startLng, endLat, endLng);
  
  // If route is very short, just check distance to start
  if (routeLen < 1.0) return dStart <= corridorKm;
  
  // Project the point onto the line segment using parametric t
  const dx = endLat - startLat;
  const dy = endLng - startLng;
  let t = ((pointLat - startLat) * dx + (pointLng - startLng) * dy) / (dx * dx + dy * dy);
  t = Math.max(0, Math.min(1, t));
  
  // Closest point on route line
  const closestLat = startLat + t * dx;
  const closestLng = startLng + t * dy;
  const perpDist = getDistance(pointLat, pointLng, closestLat, closestLng);
  
  return perpDist <= corridorKm;
}

// Driver sets travel route destination for en-route ride matching
app.post('/api/drivers/travel-route', (req, res) => {
  const { email, destination, destinationCoords } = req.body;
  const driver = drivers.find(d => d.email === email);
  if (!driver) return res.status(404).json({ error: 'Driver not found' });
  
  if (destination && destinationCoords) {
    driver.travelRoute = {
      destination,
      destinationCoords,
      setAt: new Date().toISOString()
    };
  } else {
    // Clear route
    driver.travelRoute = null;
  }
  saveData();
  res.json({ success: true, travelRoute: driver.travelRoute });
});

// Get driver's current travel route
app.get('/api/drivers/travel-route', (req, res) => {
  const { email } = req.query;
  const driver = drivers.find(d => d.email === email);
  if (!driver) return res.status(404).json({ error: 'Driver not found' });
  res.json(driver.travelRoute || null);
});

// Driver checks for searching ride requests — matches without distance limit, prioritizing closest passenger
app.get('/api/rides/active', (req, res) => {
  const { email } = req.query;
  const driver = drivers.find(d => d.email === email);
  
  // Get all active searching rides, enforcing pet-friendly constraints
  let searchingRides = activeRides.filter(r => {
    if (r.status !== 'Searching' || (r.isPreBooked && !r.isActivated)) return false;
    if (r.withPet && (!driver || !driver.allowsPets)) return false;
    return true;
  });
  
  if (searchingRides.length === 0) {
    return res.json(null);
  }

  // If driver is BLOCKED or ON REST BREAK (isPaused) — return null, no incoming ride popups
  if (driver && (driver.isBlocked || driver.isPaused)) {
    return res.json(null);
  }

  // If no driver email is passed or driver profile not found, just return the first one
  if (!driver || !driver.lat) {
    return res.json(searchingRides[0]);
  }

  const driverLat = parseFloat(driver.lat);
  const driverLng = parseFloat(driver.lng);

  // Map distances and sort by closest
  const ridesWithDistance = searchingRides.map(ride => {
    let distance = 0;
    if (ride.pickupCoords) {
      distance = getDistance(driverLat, driverLng, parseFloat(ride.pickupCoords.lat), parseFloat(ride.pickupCoords.lng));
    }
    return { ...ride, distance, distanceStr: distance.toFixed(2), matchType: 'nearby' };
  }).sort((a, b) => a.distance - b.distance);

  // Return the closest ride
  const closestRide = ridesWithDistance[0];
  
  // Return it with the calculated distance
  return res.json({ ...closestRide, distance: closestRide.distanceStr });
});

// Passenger checks for nearby online drivers
app.get('/api/drivers/nearby', (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: 'Missing coordinates' });

  const passengerLat = parseFloat(lat);
  const passengerLng = parseFloat(lng);

  // Find all online, unblocked drivers who are not paused
  const onlineDrivers = drivers.filter(d => d.status === 'Online' && !d.isBlocked && !d.isPaused && d.lat && d.lng);

  const driversWithDistance = onlineDrivers.map(d => {
    const distance = getDistance(passengerLat, passengerLng, parseFloat(d.lat), parseFloat(d.lng));
    return {
      name: d.name,
      vehicleType: d.vehicleType,
      vehicleNumber: d.plateNumber,
      distance: distance.toFixed(2),
      rawDistance: distance
    };
  }).sort((a, b) => a.rawDistance - b.rawDistance);

  res.json(driversWithDistance);
});

// Driver checks for all nearby passengers
app.get('/api/rides/nearby', (req, res) => {
  const { email } = req.query;
  const driver = drivers.find(d => d.email === email);
  if (!driver || !driver.lat) return res.status(400).json({ error: 'Driver coordinates missing' });

  const driverLat = parseFloat(driver.lat);
  const driverLng = parseFloat(driver.lng);

  // Get all active searching rides
  let searchingRides = activeRides.filter(r => r.status === 'Searching' && (!r.isPreBooked || r.isActivated));

  const ridesWithDistance = searchingRides.map(ride => {
    let distance = 0;
    if (ride.pickupCoords) {
      distance = getDistance(driverLat, driverLng, parseFloat(ride.pickupCoords.lat), parseFloat(ride.pickupCoords.lng));
    }
    return { ...ride, distance: distance.toFixed(2), rawDistance: distance };
  }).sort((a, b) => a.rawDistance - b.rawDistance);

  res.json(ridesWithDistance);
});

// Get searching pre-booked rides under 20 KM from the driver
app.get('/api/rides/prebooked', (req, res) => {
  const { email } = req.query;
  const driver = drivers.find(d => d.email === email);
  if (!driver) {
    return res.json([]);
  }

  // Find all pre-booked rides that are searching
  const searchingPreBooked = activeRides.filter(r => r.status === 'Searching' && r.isPreBooked);
  
  // Filter those within 20 KM of the driver
  const eligibleRides = searchingPreBooked.filter(ride => {
    if (ride.pickupCoords) {
      const distance = getDistance(
        parseFloat(driver.lat),
        parseFloat(driver.lng),
        parseFloat(ride.pickupCoords.lat),
        parseFloat(ride.pickupCoords.lng)
      );
      return distance <= 20.0;
    }
    return true; // Fallback
  });

  const result = eligibleRides.map(ride => {
    let distance = 0;
    if (ride.pickupCoords) {
      distance = getDistance(
        parseFloat(driver.lat),
        parseFloat(driver.lng),
        parseFloat(ride.pickupCoords.lat),
        parseFloat(ride.pickupCoords.lng)
      );
    }
    return {
      ...ride,
      distance: distance.toFixed(2)
    };
  });

  res.json(result);
});

// Get scheduled/pre-booked rides accepted by a driver (not activated yet)
app.get('/api/rides/driver/scheduled', (req, res) => {
  const { email } = req.query;
  const scheduled = activeRides.filter(r => r.driverEmail === email && r.isPreBooked && r.status === 'Accepted' && !r.isActivated);
  res.json(scheduled);
});

// Get a driver's active (immediate or activated pre-booked) ride
app.get('/api/rides/driver/active', (req, res) => {
  const { email } = req.query;
  const rides = activeRides.filter(r => 
    r.driverEmail === email && 
    ['Accepted', 'Arrived', 'In Progress'].includes(r.status) && 
    (!r.isPreBooked || r.isActivated)
  );
  
  // Prioritize In Progress or Arrived as current. Otherwise, the first Accepted.
  const current = rides.find(r => r.status === 'In Progress') || 
                  rides.find(r => r.status === 'Arrived') || 
                  rides.find(r => r.status === 'Accepted');
                  
  const queued = rides.filter(r => r !== current);
  
  res.json({ current: current || null, queued: queued });
});

// Get a passenger's active (immediate or activated pre-booked) ride
app.get('/api/rides/passenger/active', (req, res) => {
  const { email } = req.query;
  const active = activeRides.find(r => 
    r.passengerEmail === email && 
    (r.status === 'Searching' || r.status === 'Accepted' || r.status === 'Arrived') && 
    (!r.isPreBooked || r.isActivated)
  );
  res.json(active || null);
});

// Get all passenger rides (for scheduled rides tracking)
app.get('/api/rides/passenger', (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  const passengerRides = activeRides.filter(r => r.passengerEmail === email);
  res.json(passengerRides);
});

// Activate a pre-booked ride
app.post('/api/rides/:id/start', (req, res) => {
  const id = parseInt(req.params.id);
  const ride = activeRides.find(r => r.id === id);
  if (ride) {
    ride.isActivated = true;
    saveData();
    res.json(ride);
  } else {
    res.status(404).json({ error: 'Ride not found' });
  }
});

// Verify passenger PIN to start active ride
app.post('/api/rides/:id/verify-pin', (req, res) => {
  const id = parseInt(req.params.id);
  const { pin } = req.body;
  
  const ride = activeRides.find(r => r.id === id);
  if (!ride) {
    return res.status(404).json({ error: 'Ride not found' });
  }
  
  const passenger = passengers.find(p => p.email === ride.passengerEmail);
  if (!passenger) {
    return res.status(404).json({ error: 'Passenger not found' });
  }
  
  if (passenger.verificationCode !== pin) {
    return res.status(400).json({ error: 'Invalid PIN. Please ask the passenger for their 6-digit ID.' });
  }
  
  ride.status = 'In Progress';
  ride.startedAt = new Date().toISOString();
  saveData();
  
  res.json(ride);
});

// Passenger cancels a ride completely
app.post('/api/rides/:id/passenger-cancel', (req, res) => {
  const id = parseInt(req.params.id);
  const ride = activeRides.find(r => r.id === id);
  if (ride) {
    ride.status = 'Cancelled';
    saveData();
    res.json(ride);
  } else {
    res.status(404).json({ error: 'Ride request not found' });
  }
});

// Driver accepts a ride request
app.post('/api/rides/:id/accept', (req, res) => {
  const id = parseInt(req.params.id);
  const { driverName, driverPhone, driverEmail, vehicleModel, vehiclePlate } = req.body;
  const ride = activeRides.find(r => r.id === id);
  if (ride) {
    if (ride.status !== 'Searching') {
      return res.status(400).json({ error: 'This ride has already been accepted by another driver.' });
    }

    const driver = drivers.find(d => d.email === driverEmail);
    const dRating = driver ? driver.rating : 5.0;

    // ₹1500 BALANCE LOCK: Driver cannot accept CASH trips if pending balance > ₹1500
    const CASH_LOCK_THRESHOLD = 1500;
    const driverPendingBalance = driver ? (driver.wallet?.toBePaid || 0) : 0;
    const isCashTrip = ride.paymentType === 'cash' || !ride.paymentType;

    if (isCashTrip && driverPendingBalance > CASH_LOCK_THRESHOLD) {
      return res.status(403).json({
        error: 'BALANCE_LOCK',
        message: `Your pending balance of ₹${driverPendingBalance.toFixed(2)} exceeds ₹${CASH_LOCK_THRESHOLD}. You can only accept prepaid trips until you settle your dues with HUM Fleet.`,
        pendingBalance: driverPendingBalance
      });
    }

    ride.status = 'Accepted';
    ride.driverName = driverName;
    ride.driverPhone = driverPhone;
    ride.driverEmail = driverEmail;
    ride.vehicleModel = vehicleModel;
    ride.vehiclePlate = vehiclePlate;
    ride.driverRating = dRating;
    if (driver && driver.photos) {
      ride.vehiclePhotos = driver.photos;
    }
    saveData();
    res.json(ride);
  } else {
    res.status(404).json({ error: 'Ride request not found' });
  }
});

// Driver arrives at pickup location
app.post('/api/rides/:id/arrive', (req, res) => {
  const id = parseInt(req.params.id);
  const ride = activeRides.find(r => r.id === id);
  if (ride) {
    ride.status = 'Arrived';
    saveData();
    res.json(ride);
  } else {
    res.status(404).json({ error: 'Ride request not found' });
  }
});

// Passenger updates destination mid-trip
app.post('/api/rides/:id/update-destination', (req, res) => {
  const id = parseInt(req.params.id);
  const { newDropoff, newDropoffCoords } = req.body;
  
  const ride = activeRides.find(r => r.id === id);
  if (!ride) {
    return res.status(404).json({ error: 'Active ride not found' });
  }

  const oldDropoff = ride.dropoff;
  ride.dropoff = newDropoff;
  if (newDropoffCoords) {
    ride.dropoffCoords = newDropoffCoords;
  }

  if (ride.pickupCoords && ride.dropoffCoords) {
    const updatedKm = parseFloat(getDistance(ride.pickupCoords.lat, ride.pickupCoords.lng, ride.dropoffCoords.lat, ride.dropoffCoords.lng).toFixed(1));
    ride.totalKm = updatedKm;
    ride.isIntercity = updatedKm > 35.0;

    const driver = drivers.find(d => d.email === ride.driverEmail);
    const catObj = vehicleCategories.find(c => c.name === ride.category) || {};
    
    let catRatePerKm = parseFloat(catObj.ratePerKm !== undefined ? catObj.ratePerKm : settings.ratePerKm);
    if (parseFloat(settings.ratePerKm) > catRatePerKm) catRatePerKm = parseFloat(settings.ratePerKm);
    const driverRate = driver ? parseFloat(driver.ratePerKm || 15) : 15;
    const finalRatePerKm = Math.max(catRatePerKm, driverRate);
    
    let catBase = parseFloat(catObj.baseFare !== undefined ? catObj.baseFare : settings.baseFare);
    if (parseFloat(settings.baseFare) > catBase) catBase = parseFloat(settings.baseFare);
    
    const surge = parseFloat(settings.surgeMultiplier || 1);
    
    let updatedFareVal = (catBase + finalRatePerKm * updatedKm) * surge;
    if (ride.isIntercity) {
      updatedFareVal += 250;
    }
    ride.fare = updatedFareVal.toFixed(2);
  }

  ride.destinationUpdated = true;
  ride.destinationUpdatedAt = new Date().toISOString();
  saveData();
  res.json({ success: true, ride });
});

// Driver updates live GPS distance during active ride
app.post('/api/rides/:id/update-distance', (req, res) => {
  const id = parseInt(req.params.id);
  const { liveGpsDistance } = req.body;
  const ride = activeRides.find(r => r.id === id);
  if (!ride) return res.status(404).json({ error: 'Ride not found' });
  
  const currentTotal = parseFloat(ride.totalKm || 0);
  const currentActual = parseFloat(liveGpsDistance || 0);
  
  if (currentActual > currentTotal) {
    ride.actualTotalKm = currentActual;
    const extraKm = currentActual - currentTotal;
    
    if (!ride.extraKmNotifiedCount) ride.extraKmNotifiedCount = 0;
    
    // Notify passenger every 2 extra KMs
    if (Math.floor(extraKm / 2) > ride.extraKmNotifiedCount) {
      ride.extraKmNotifiedCount = Math.floor(extraKm / 2);
      ride.pendingPassengerNotification = true;
    }
    saveData();
  }
  res.json(ride);
});

// Passenger dismisses route deviation notification
app.post('/api/rides/:id/dismiss-notification', (req, res) => {
  const id = parseInt(req.params.id);
  const ride = activeRides.find(r => r.id === id);
  if (ride) {
    ride.pendingPassengerNotification = false;
    saveData();
    res.json(ride);
  } else {
    res.status(404).json({ error: 'Ride not found' });
  }
});

// Driver cancels an accepted ride, putting it back to Searching
app.post('/api/rides/:id/cancel', (req, res) => {
  const id = parseInt(req.params.id);
  const ride = activeRides.find(r => r.id === id);
  if (ride) {
    ride.status = 'Searching';
    ride.driverName = null;
    ride.driverPhone = null;
    ride.driverEmail = null;
    ride.vehicleModel = null;
    ride.vehiclePlate = null;
    res.json(ride);
  } else {
    res.status(404).json({ error: 'Ride request not found' });
  }
});

// Driver completes a ride (calculates wallet ledger details)
app.post('/api/rides/:id/complete', (req, res) => {
  const id = parseInt(req.params.id);
  const ride = activeRides.find(r => r.id === id);
  if (ride) {
    ride.status = 'Completed';
    ride.completedAt = new Date().toISOString();

    // Dynamically calculate fare based on actual traveled distance and ratePerKm
    const driver = drivers.find(d => d.email === ride.driverEmail);
    const rate = driver ? parseFloat(driver.ratePerKm || 15.00) : 15.00;
    
    const baseTotal = parseFloat(ride.totalKm || 8.0);
    
    // Calculate what the original minimum fare SHOULD have been
    let originalMinFare = baseTotal * rate;
    if (ride.isIntercity) originalMinFare += 250;
    
    // Check if the passenger offered more than the minimum
    const originalOfferedFare = parseFloat(ride.fare || originalMinFare);
    const voluntaryExtraOffer = Math.max(0, originalOfferedFare - originalMinFare);
    
    const actualTotal = parseFloat(ride.actualTotalKm || 0);
    const distance = actualTotal > 0 ? actualTotal : baseTotal;
    
    // Recalculate based on final distance
    let recalculatedMinFare = distance * rate;
    if (ride.isIntercity) recalculatedMinFare += 250;
    
    // Final fare preserves any voluntary extra tip they offered
    const finalFare = recalculatedMinFare + voluntaryExtraOffer;
    
    const gst = finalFare * 0.05; // 5% GST
    const commission = finalFare * 0.05; // 5% Commission
    const totalCollected = finalFare + gst; // Passenger pays distance fare + 5% GST

    // Update ride data
    ride.finalDistance = distance.toFixed(2);
    ride.fare = finalFare.toFixed(2);
    ride.gst = gst.toFixed(2);
    ride.commission = commission.toFixed(2);
    ride.totalCollected = totalCollected.toFixed(2);

    const { collectCash } = req.body;
    if (collectCash) {
      ride.paymentType = 'cash';
    }

    // Update driver's wallet
    // (driver already found above)
    if (driver) {
      if (!driver.wallet) driver.wallet = { cashCollected: 0, toBePaid: 0, gstCollected: 0 };
      if (driver.wallet.gstCollected === undefined) driver.wallet.gstCollected = 0;
      if (!driver.wallet.pendingSince || driver.wallet.toBePaid <= 0) {
        driver.wallet.pendingSince = new Date().toISOString();
      }
      driver.wallet.cashCollected += totalCollected;
      driver.wallet.toBePaid += (gst + commission);
      driver.wallet.gstCollected += gst;
      ride.driverBalance = -driver.wallet.toBePaid;
    }

    // Update passenger's wallet
    const passenger = passengers.find(p => p.email === ride.passengerEmail);
    if (passenger) {
      if (!passenger.wallet) passenger.wallet = { totalSpent: 0, taxPaid: 0 };
      passenger.wallet.totalSpent += totalCollected;
      passenger.wallet.taxPaid += gst;
    }

    saveData();
    res.json(ride);
  } else {
    res.status(404).json({ error: 'Ride request not found' });
  }
});

// Rate driver
app.post('/api/rides/:id/rate-driver', (req, res) => {
  const id = parseInt(req.params.id);
  const { rating, comment } = req.body;
  const ride = activeRides.find(r => r.id === id);
  if (ride) {
    const driver = drivers.find(d => d.email === ride.driverEmail);
    if (driver) {
      if (!driver.ratings) driver.ratings = [];
      driver.ratings.push({ rating: parseInt(rating), comment });
      const total = driver.ratings.reduce((sum, r) => sum + r.rating, 0);
      driver.rating = parseFloat((total / driver.ratings.length).toFixed(1));
    }
    saveData();
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Ride not found' });
  }
});

// Rate passenger
app.post('/api/rides/:id/rate-passenger', (req, res) => {
  const id = parseInt(req.params.id);
  const { rating, comment } = req.body;
  const ride = activeRides.find(r => r.id === id);
  if (ride) {
    const passenger = passengers.find(p => p.email === ride.passengerEmail);
    if (passenger) {
      if (!passenger.ratings) passenger.ratings = [];
      passenger.ratings.push({ rating: parseInt(rating), comment });
      const total = passenger.ratings.reduce((sum, r) => sum + r.rating, 0);
      passenger.rating = parseFloat((total / passenger.ratings.length).toFixed(1));
    }
    saveData();
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Ride not found' });
  }
});

// Get passenger wallet values
app.get('/api/passengers/wallet', (req, res) => {
  const { email } = req.query;
  const passenger = passengers.find(p => p.email === email);
  if (passenger) {
    res.json(passenger.wallet || { totalSpent: 0, taxPaid: 0 });
  } else {
    res.json({ totalSpent: 0, taxPaid: 0 });
  }
});

// Get driver wallet values
app.get('/api/drivers/wallet', (req, res) => {
  const { email } = req.query;
  const driver = drivers.find(d => d.email === email);
  if (driver) {
    if (driver.wallet && driver.wallet.gstCollected === undefined) {
      driver.wallet.gstCollected = 0;
    }
    res.json(driver.wallet || { cashCollected: 0, toBePaid: 0, gstCollected: 0 });
  } else {
    res.json({ cashCollected: 0, toBePaid: 0, gstCollected: 0 });
  }
});

// Get financial analytics (for Admin panel controls)
app.get('/api/admin/financials', (req, res) => {
  let totalCommission = 0;
  let totalGST = 0;
  let toBeCollected = 0;

  activeRides.filter(r => r.status === 'Completed').forEach(r => {
    const fare = parseFloat(r.fare);
    totalCommission += fare * 0.05;
    totalGST += fare * 0.05;
    toBeCollected += fare * 0.10;
  });

  res.json({
    totalCommission: totalCommission.toFixed(2),
    totalGST: totalGST.toFixed(2),
    toBeCollected: toBeCollected.toFixed(2)
  });
});

// Get status of a specific ride request
app.get('/api/rides/:id/status', (req, res) => {
  const id = parseInt(req.params.id);
  const ride = activeRides.find(r => r.id === id);
  if (ride) {
    res.json(ride);
  } else {
    res.status(404).json({ error: 'Ride request not found' });
  }
});

// Get completed rides for download reporting
app.get('/api/admin/rides', (req, res) => {
  res.json(activeRides.filter(r => r.status === 'Completed'));
});

// Driver earnings report: daily, weekly, monthly
app.get('/api/drivers/earnings', (req, res) => {
  const { email } = req.query;
  const targetEmail = email || 'rajesh.k@gmail.com';
  const completed = activeRides.filter(r => r.status === 'Completed' && r.driverEmail === targetEmail);

  const now = new Date();
  const todayStr = now.toDateString();
  const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(now); monthAgo.setMonth(monthAgo.getMonth() - 1);

  const daily = completed.filter(r => new Date(r.completedAt || r.createdAt || now).toDateString() === todayStr);
  const weekly = completed.filter(r => new Date(r.completedAt || r.createdAt || now) >= weekAgo);
  const monthly = completed.filter(r => new Date(r.completedAt || r.createdAt || now) >= monthAgo);

  const summarise = (rides) => ({
    count: rides.length,
    gross: rides.reduce((s, r) => s + parseFloat(r.fare || 0), 0).toFixed(2),
    commission: (rides.reduce((s, r) => s + parseFloat(r.fare || 0), 0) * 0.10).toFixed(2),
    net: (rides.reduce((s, r) => s + parseFloat(r.fare || 0), 0) * 0.90).toFixed(2),
    rides: rides.map(r => ({
      id: r.id,
      pickup: r.pickup,
      dropoff: r.dropoff,
      fare: r.fare,
      passengerName: r.passengerName,
      completedAt: r.completedAt || r.createdAt || null,
      driverBalance: r.driverBalance
    }))
  });

  res.json({ daily: summarise(daily), weekly: summarise(weekly), monthly: summarise(monthly) });
});

// Admin: Get separated pending payments with daily rollover tracking
app.get('/api/admin/pending-payments', (req, res) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const pendingPayments = drivers
    .filter(d => d.wallet && parseFloat(d.wallet.toBePaid || 0) > 0)
    .map(d => {
      const toBePaid = parseFloat(d.wallet.toBePaid || 0);
      const cashCollected = parseFloat(d.wallet.cashCollected || 0);
      const pendingSinceDate = d.wallet.pendingSince ? new Date(d.wallet.pendingSince) : new Date();
      const pendingStartDay = new Date(pendingSinceDate.getFullYear(), pendingSinceDate.getMonth(), pendingSinceDate.getDate());
      
      const diffMs = todayStart.getTime() - pendingStartDay.getTime();
      const daysPending = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

      let agingStatus = 'same-day';
      let statusLabel = 'Pending Today (Same Day)';
      if (daysPending === 1) {
        agingStatus = 'rolled-over';
        statusLabel = 'Rolled Over (1 Day Overdue)';
      } else if (daysPending >= 2) {
        agingStatus = daysPending >= 3 ? 'critical-overdue' : 'rolled-over';
        statusLabel = `Rolled Over (${daysPending} Days Overdue)`;
      }

      return {
        id: d.id,
        name: d.name,
        email: d.email,
        phone: d.phone,
        plate: d.plate || 'N/A',
        manufacturer: d.manufacturer || '',
        model: d.model || '',
        cashCollected: cashCollected.toFixed(2),
        toBePaid: toBePaid.toFixed(2),
        pendingSince: pendingSinceDate.toISOString(),
        pendingDateFormatted: pendingSinceDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        daysPending,
        agingStatus,
        statusLabel
      };
    });

  const totalOutstanding = pendingPayments.reduce((sum, p) => sum + parseFloat(p.toBePaid), 0);
  const totalSameDay = pendingPayments.filter(p => p.daysPending === 0).reduce((sum, p) => sum + parseFloat(p.toBePaid), 0);
  const totalRolledOver = pendingPayments.filter(p => p.daysPending > 0).reduce((sum, p) => sum + parseFloat(p.toBePaid), 0);

  res.json({
    pendingPayments,
    summary: {
      totalOutstanding: totalOutstanding.toFixed(2),
      totalSameDay: totalSameDay.toFixed(2),
      totalRolledOver: totalRolledOver.toFixed(2),
      pendingPartnersCount: pendingPayments.length
    }
  });
});

// Admin: Clear/settle a driver's pending balance (Mark as Paid)
app.post('/api/admin/drivers/:id/clear-balance', (req, res) => {
  const id = parseInt(req.params.id);
  const driver = drivers.find(d => d.id === id);
  if (driver) {
    const clearedAmount = driver.wallet?.toBePaid || 0;
    if (driver.wallet) {
      driver.wallet.toBePaid = 0;
      driver.wallet.pendingSince = null;
    }
    saveData();
    res.json({ success: true, clearedAmount, driver });
  } else {
    res.status(404).json({ error: 'Driver not found' });
  }
});

// Admin: Collect cash payment from driver (can be custom amount)
app.post('/api/admin/drivers/:id/collect-cash', (req, res) => {
  const id = parseInt(req.params.id);
  const { amount } = req.body;
  const driver = drivers.find(d => d.id === id);
  if (driver) {
    const collectAmount = parseFloat(amount || 0);
    if (driver.wallet) {
      driver.wallet.toBePaid = Math.max(0, parseFloat(driver.wallet.toBePaid || 0) - collectAmount);
      if (driver.wallet.toBePaid <= 0) {
        driver.wallet.pendingSince = null;
      }
    }
    saveData();
    res.json({ success: true, clearedAmount: collectAmount, driver });
  } else {
    res.status(404).json({ error: 'Driver not found' });
  }
});

// Driver: Pay commission dues via payment gateway
app.post('/api/drivers/pay-dues', (req, res) => {
  const { email, amount } = req.body;
  const targetEmail = email || 'rajesh.k@gmail.com';
  const driver = drivers.find(d => d.email === targetEmail);
  if (driver) {
    const payAmt = parseFloat(amount || 0);
    if (driver.wallet) {
      driver.wallet.toBePaid = Math.max(0, parseFloat(driver.wallet.toBePaid || 0) - payAmt);
      if (driver.wallet.toBePaid <= 0) {
        driver.wallet.pendingSince = null;
      }
      if (driver.wallet.gstCollected === undefined) {
        driver.wallet.gstCollected = 0;
      }
    }
    saveData();
    res.json({ success: true, wallet: driver.wallet });
  } else {
    res.status(404).json({ error: 'Driver not found' });
  }
});

// --- DIRECT MESSAGING ENDPOINTS (Admin to Driver) ---

// Send direct message (Admin or Driver)
app.post('/api/admin/messages/send', (req, res) => {
  const { driverEmail, sender, text } = req.body;
  if (!driverEmail || !text) {
    return res.status(400).json({ error: 'driverEmail and text are required.' });
  }
  if (!driverMessages[driverEmail]) {
    driverMessages[driverEmail] = [];
  }
  const msgObj = {
    id: Date.now(),
    sender: sender || 'Admin',
    text,
    timestamp: new Date().toISOString()
  };
  driverMessages[driverEmail].push(msgObj);
  saveData();
  res.status(201).json(msgObj);
});

// Get message history for admin or driver
app.get('/api/admin/messages', (req, res) => {
  const { driverEmail } = req.query;
  if (!driverEmail) {
    return res.json([]);
  }
  res.json(driverMessages[driverEmail] || []);
});

// Driver fetches direct messages from Admin
app.get('/api/drivers/messages', (req, res) => {
  const { email } = req.query;
  const targetEmail = email || 'rajesh.k@gmail.com';
  res.json(driverMessages[targetEmail] || []);
});

// Driver marks messages viewed/read - deletes them until next message arrives
app.post('/api/drivers/messages/clear', (req, res) => {
  const { email } = req.body;
  const targetEmail = email || 'rajesh.k@gmail.com';
  driverMessages[targetEmail] = [];
  saveData();
  res.json({ success: true, message: 'Messages cleared after view.' });
});

// --- STRICT IN-TRIP PASSENGER & DRIVER CHAT ENDPOINTS ---
// Passengers and drivers can chat ONLY during an active ride (Accepted / In Progress) and CANNOT share contact numbers!

function containsPhoneNumber(text) {
  if (!text) return false;
  // Strip common phone formatting characters: spaces, dashes, dots, pluses, parentheses
  const digitsOnly = text.replace(/[\s\-\.\+\(\)]/g, '');
  // 10+ digits sequence
  if (/\d{10,}/.test(digitsOnly)) {
    return true;
  }
  // Standard phone pattern
  const phonePattern = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  if (phonePattern.test(text)) {
    return true;
  }
  // Spelled out number words (e.g., "nine eight seven six...")
  const numberWordsPattern = /(?:zero|one|two|three|four|five|six|seven|eight|nine){5,}/i;
  const wordCleaned = text.toLowerCase().replace(/[^a-z]/g, '');
  if (numberWordsPattern.test(wordCleaned)) {
    return true;
  }
  return false;
}

app.post('/api/rides/messages/send', (req, res) => {
  const { rideId, senderEmail, senderName, text } = req.body;
  if (!rideId || !senderEmail || !text) {
    return res.status(400).json({ error: 'rideId, senderEmail, and text are required.' });
  }

  // STRICT RULE 1: Phone / Contact number sharing blocker
  if (containsPhoneNumber(text)) {
    return res.status(400).json({ 
      error: '🚫 Security Alert: Sharing phone numbers or personal contact details is strictly prohibited in chat for safety reasons.' 
    });
  }

  const ride = activeRides.find(r => String(r.id) === String(rideId));
  
  // STRICT RULE 2: Chat ONLY active during ride duration (Accepted by passenger & driver, or In Progress)
  if (!ride || (ride.status !== 'Accepted' && ride.status !== 'In Progress')) {
    return res.status(403).json({ 
      error: 'Chat disabled. Messaging is strictly allowed only while the passenger and driver are on an active trip.' 
    });
  }

  const isPassenger = ride.passengerEmail === senderEmail;
  const isDriver = ride.driverEmail === senderEmail;

  if (!isPassenger && !isDriver) {
    return res.status(403).json({ error: 'Access denied. You can only chat with your matched partner on an active trip.' });
  }

  if (!rideMessages[rideId]) {
    rideMessages[rideId] = [];
  }

  const msgObj = {
    id: Date.now(),
    rideId: String(rideId),
    senderEmail,
    senderName: senderName || (isPassenger ? ride.passengerName : ride.driverName),
    role: isPassenger ? 'passenger' : 'driver',
    text: text.trim(),
    timestamp: new Date().toISOString()
  };

  rideMessages[rideId].push(msgObj);
  saveData();
  res.status(201).json(msgObj);
});

app.get('/api/rides/messages', (req, res) => {
  const { rideId, userEmail } = req.query;
  if (!rideId) {
    return res.json([]);
  }

  const ride = activeRides.find(r => String(r.id) === String(rideId));
  if (!ride) {
    return res.json([]);
  }

  // Strict check: only matched passenger or driver can fetch chat logs
  if (userEmail && ride.passengerEmail !== userEmail && ride.driverEmail !== userEmail) {
    return res.status(403).json({ error: 'Unauthorized to view this ride chat.' });
  }

  res.json(rideMessages[rideId] || []);
});

// --- PASSENGER SUPPORT CHAT ENDPOINTS ---

// Admin sends message to passenger support chat
app.post('/api/admin/passengers/messages/send', (req, res) => {
  const { passengerEmail, sender, text } = req.body;
  if (!passengerEmail || !text) {
    return res.status(400).json({ error: 'passengerEmail and text are required.' });
  }
  if (!passengerMessages) {
    passengerMessages = {};
  }
  if (!passengerMessages[passengerEmail]) {
    passengerMessages[passengerEmail] = [];
  }
  const msgObj = {
    id: Date.now(),
    sender: sender || 'Customer Care',
    text,
    timestamp: new Date().toISOString()
  };
  passengerMessages[passengerEmail].push(msgObj);
  saveData();
  res.status(201).json(msgObj);
});

// Admin fetches passenger support messages
app.get('/api/admin/passengers/messages', (req, res) => {
  const { passengerEmail } = req.query;
  if (!passengerEmail) {
    return res.json([]);
  }
  if (!passengerMessages) {
    passengerMessages = {};
  }
  res.json(passengerMessages[passengerEmail] || []);
});

// Passenger fetches support messages from Customer Care
app.get('/api/passengers/messages', (req, res) => {
  const { email } = req.query;
  if (!email) return res.json([]);
  if (!passengerMessages) {
    passengerMessages = {};
  }
  res.json(passengerMessages[email] || []);
});

// Passenger sends support message to Customer Care
app.post('/api/passengers/messages/send', (req, res) => {
  const { email, sender, text } = req.body;
  if (!email || !text) {
    return res.status(400).json({ error: 'email and text are required.' });
  }
  if (!passengerMessages) {
    passengerMessages = {};
  }
  if (!passengerMessages[email]) {
    passengerMessages[email] = [];
  }
  const msgObj = {
    id: Date.now(),
    sender: sender || 'Customer',
    text,
    timestamp: new Date().toISOString()
  };
  passengerMessages[email].push(msgObj);
  saveData();
  res.status(201).json(msgObj);
});

// --- ADMIN RIDES HISTORY LEDGER ENDPOINT ---
app.get('/api/admin/rides', (req, res) => {
  res.json(activeRides);
});

// --- DYNAMIC LOCATIONS (MAPPING) ---
app.get('/api/locations', (req, res) => {
  res.json(dynamicLocations);
});

// Proxy OpenStreetMap Nominatim API to avoid browser CORS/User-Agent blocking
app.get('/api/geocode', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json([]);
  
  try {
    // Upgraded limit to 50 (maximum allowed usually) to maximize results for hospitals, hotels, etc.
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', India')}&format=json&addressdetails=1&limit=50&countrycodes=in`;
    // We MUST send a custom User-Agent to satisfy OpenStreetMap Nominatim's strict usage policy
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Hum-Taxi-App-Backend/1.0 (Contact: admin@hum.local)',
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      res.json(data);
    } else {
      res.status(response.status).json({ error: 'Geocoding failed' });
    }
  } catch (error) {
    console.error('Geocoding Proxy Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/locations', (req, res) => {
  const { name, lat, lng } = req.body;
  if (!name || lat === undefined || lng === undefined) {
    return res.status(400).json({ error: 'name, lat, and lng are required' });
  }

  // Check if location already exists by name or close coordinates
  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);
  const nameExists = dynamicLocations.some(loc => loc.name.toLowerCase() === name.toLowerCase());
  const coordsExist = dynamicLocations.some(loc => {
    return Math.abs(loc.lat - parsedLat) < 0.005 && Math.abs(loc.lng - parsedLng) < 0.005;
  });

  if (!nameExists && !coordsExist) {
    const newLoc = { name, lat: parsedLat, lng: parsedLng };
    dynamicLocations.push(newLoc);
    saveData();
    res.status(201).json(newLoc);
  } else {
    res.json({ message: 'Location already exists' });
  }
});

// Admin Add Driver
app.post('/api/admin/drivers', (req, res) => {
  const { name, email, phone, licenseNumber, vehicleType, plateNumber } = req.body;
  const newDriver = {
    id: drivers.length > 0 ? Math.max(...drivers.map(d => d.id)) + 1 : 1,
    name: name || 'New Driver',
    email: email || '',
    phone: phone || '',
    licenseNumber: licenseNumber || '',
    vehicleType: vehicleType || 'Sedan',
    plateNumber: plateNumber || '',
    status: 'Approved',
    wallet: { cashCollected: 0, toBePaid: 0 },
    vehicles: [{ make: vehicleType, model: vehicleType, year: new Date().getFullYear(), plateNumber, isActive: true }],
    rating: 5,
    ratings: [],
    createdAt: new Date().toISOString()
  };
  drivers.push(newDriver);
  saveData();
  res.status(201).json(newDriver);
});

// Admin Delete Driver
app.delete('/api/admin/drivers/:id', (req, res) => {
  const id = req.params.id;
  const initialLength = drivers.length;
  drivers = drivers.filter(d => String(d.id) !== id && String(d._id) !== id);
  if (drivers.length < initialLength) {
    saveData();
    res.json({ message: 'Driver deleted successfully.' });
  } else {
    res.status(404).json({ error: 'Driver not found.' });
  }
});

// Admin Add Passenger
app.post('/api/admin/passengers', (req, res) => {
  const { name, email, phone } = req.body;
  const newPassenger = {
    id: passengers.length > 0 ? Math.max(...passengers.map(p => p.id)) + 1 : 1,
    name: name || 'New Passenger',
    email: email || '',
    phone: phone || '',
    password: 'password123',
    wallet: { totalSpent: 0, taxPaid: 0 },
    rating: 5,
    ratings: [],
    verificationCode: Math.floor(100000 + Math.random() * 900000).toString(),
    createdAt: new Date().toISOString()
  };
  passengers.push(newPassenger);
  saveData();
  res.status(201).json(newPassenger);
});

// ========== EMPLOYEES API ==========
app.get('/api/admin/employees', (req, res) => {
  res.json(employees);
});

app.post('/api/admin/employees', (req, res) => {
  const { name, username, password, role, position, managerId, salary, incentive, salaryDate } = req.body;
  
  if (employees.find(e => e.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const newEmp = {
    id: Date.now(),
    name,
    username,
    password, 
    role,
    position,
    managerId,
    salary,
    incentive,
    salaryDate,
    status: 'approved',
    isBlocked: false,
    createdAt: new Date().toISOString(),
    attendance: [],
    documents: null,
    bankDetails: null,
    warnings: []
  };

  employees.push(newEmp);
  saveData();
  res.json(newEmp);
});

app.post('/api/admin/employees/:id/approve', (req, res) => {
  const id = parseInt(req.params.id);
  const emp = employees.find(e => e.id === id);
  if (emp) {
    emp.status = 'approved';
    saveData();
    res.json(emp);
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
});

app.post('/api/admin/employees/:id/block', (req, res) => {
  const id = parseInt(req.params.id);
  const emp = employees.find(e => e.id === id);
  if (emp) {
    emp.isBlocked = true;
    saveData();
    res.json(emp);
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
});

app.post('/api/admin/employees/:id/unblock', (req, res) => {
  const id = parseInt(req.params.id);
  const emp = employees.find(e => e.id === id);
  if (emp) {
    emp.isBlocked = false;
    saveData();
    res.json(emp);
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
});

app.post('/api/admin/employees/:id/warn', (req, res) => {
  const id = parseInt(req.params.id);
  const { message } = req.body;
  const emp = employees.find(e => e.id === id);
  if (emp) {
    if (!emp.warnings) emp.warnings = [];
    emp.warnings.push({ date: new Date().toISOString(), message });
    saveData();
    res.json(emp);
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
});

app.delete('/api/admin/employees/:id', (req, res) => {
  const id = req.params.id;
  const initialLength = employees.length;
  employees = employees.filter(e => String(e.id) !== id && String(e._id) !== id);
  saveData();
  res.json({ message: 'Employee deleted' });
});

// Admin Delete Passenger
app.delete('/api/admin/passengers/:id', (req, res) => {
  const id = req.params.id;
  const initialLength = passengers.length;
  passengers = passengers.filter(p => String(p.id) !== id && String(p._id) !== id);
  if (passengers.length < initialLength) {
    saveData();
    res.json({ message: 'Passenger deleted successfully.' });
  } else {
    res.status(404).json({ error: 'Passenger not found.' });
  }
});

// --- Promotions API ---
app.get('/api/promotions', (req, res) => {
  res.json(promotions);
});

app.post('/api/promotions', async (req, res) => {
  const { code, discountType, discountValue, maxUsage, validUntil } = req.body;
  
  if (!code || !discountValue) {
    return res.status(400).json({ error: 'Code and discount value are required' });
  }

  const newPromo = {
    id: Date.now(),
    code: code.toUpperCase(),
    discountType: discountType || 'percentage',
    discountValue: parseFloat(discountValue),
    maxUsage: maxUsage ? parseInt(maxUsage) : null,
    usedCount: 0,
    validUntil: validUntil || null,
    status: 'Active',
    createdAt: new Date().toISOString()
  };
  
  promotions.push(newPromo);
  
  await saveToMongoDB();
  
  res.status(201).json(newPromo);
});

app.put('/api/promotions/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  const promo = promotions.find(p => p.id === id || String(p._id) === String(id));
  if (promo) {
    if (status) promo.status = status;
    
    await saveToMongoDB();
    
    res.json(promo);
  } else {
    res.status(404).json({ error: 'Promotion not found' });
  }
});

app.delete('/api/promotions/:id', async (req, res) => {
  const idStr = req.params.id;
  promotions = promotions.filter(p => String(p.id) !== idStr && String(p._id) !== idStr);
  
  await saveToMongoDB();
  
  res.json({ message: 'Promotion deleted' });
});

app.get('/api/admin/clear-all', (req, res) => {

  drivers = [];
  passengers = [];
  saveData();
  res.json({ message: 'All drivers and passengers have been cleared successfully.' });
});

