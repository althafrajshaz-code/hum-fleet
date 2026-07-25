const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 5000;

const DATA_FILE = path.join(__dirname, 'data_store.json');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

// Mock drivers preset with default Indian coordinates in Delhi NCR, wallets, and ratings
let drivers = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    email: 'rajesh.k@gmail.com',
    phone: '+91 98765 43210',
    manufacturer: 'Tata',
    model: 'Nexon',
    year: '2023',
    plate: 'DL 3C AY 4567',
    status: 'Pending',
    isBlocked: false,
    ratePerKm: '15.00',
    ratePerHour: '120.00',
    lat: 28.4950, // Gurugram
    lng: 77.0896,
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
    plate: 'MH 12 QP 9876',
    status: 'Pending',
    isBlocked: false,
    ratePerKm: '15.00',
    ratePerHour: '120.00',
    lat: 28.6129, // India Gate
    lng: 77.2295,
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
    plate: 'HR 26 BZ 1122',
    status: 'Pending',
    isBlocked: false,
    ratePerKm: '15.00',
    ratePerHour: '120.00',
    lat: 28.6273, // Noida
    lng: 77.3725,
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
  { id: 1, name: 'HUM Go', maxPassengers: 4, baseFare: 50.00, ratePerKm: 15.00 },
  { id: 2, name: 'HUM Premium', maxPassengers: 6, baseFare: 100.00, ratePerKm: 25.00 }
];

// Global ride matching system database, driver direct messaging store & in-trip ride chat store
let activeRides = [];
let driverMessages = {};
let rideMessages = {};

// Persistence Helpers
function saveData() {
  try {
    const data = { drivers, passengers, activeRides, settings, vehicleCategories, adminCredentials, driverMessages, rideMessages };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to save data_store:', err);
  }
}

function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed.drivers) drivers = parsed.drivers;
      if (parsed.passengers) passengers = parsed.passengers;
      if (parsed.activeRides) activeRides = parsed.activeRides;
      if (parsed.settings) settings = parsed.settings;
      if (parsed.vehicleCategories) vehicleCategories = parsed.vehicleCategories;
      if (parsed.adminCredentials) adminCredentials = parsed.adminCredentials;
      if (parsed.driverMessages) driverMessages = parsed.driverMessages;
      if (parsed.rideMessages) rideMessages = parsed.rideMessages;
      console.log('Successfully restored HUM Fleet database state from data_store.json');
    } catch (err) {
      console.error('Failed to load data_store:', err);
    }
  }
}

loadData();

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
  const exists = passengers.find(p => p.email === email || p.phone === phone);
  if (exists) {
    return res.status(400).json({ error: 'User with this email or phone already registered.' });
  }
  const newPassenger = {
    id: passengers.length + 1,
    name,
    email,
    phone,
    password,
    wallet: { totalSpent: 0, taxPaid: 0 },
    rating: 5.0,
    ratings: []
  };
  passengers.push(newPassenger);
  saveData();
  res.status(201).json(newPassenger);
});

// Passenger login (supports email or phone number)
app.post('/api/passengers/login', (req, res) => {
  const { loginId, password } = req.body;
  const user = passengers.find(p => 
    (p.email === loginId || p.phone === loginId) && p.password === password
  );
  if (user) {
    res.json({ success: true, name: user.name, email: user.email, phone: user.phone });
  } else {
    res.status(401).json({ error: 'Invalid email/phone number or password.' });
  }
});

// Get vehicle categories
app.get('/api/vehicle-categories', (req, res) => {
  res.json(vehicleCategories);
});

// Add new vehicle category
app.post('/api/vehicle-categories', (req, res) => {
  const { name, maxPassengers, baseFare, ratePerKm } = req.body;
  
  if (!name || !maxPassengers || baseFare === undefined || ratePerKm === undefined) {
    return res.status(400).json({ error: 'All fields (name, maxPassengers, baseFare, ratePerKm) are required.' });
  }

  const exists = vehicleCategories.find(c => c.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: 'A category with this name already exists.' });
  }

  const newCategory = {
    id: vehicleCategories.length + 1,
    name,
    maxPassengers: parseInt(maxPassengers),
    baseFare: parseFloat(baseFare),
    ratePerKm: parseFloat(ratePerKm)
  };
  vehicleCategories.push(newCategory);
  saveData();
  res.status(201).json(newCategory);
});

// Edit existing vehicle category
app.put('/api/vehicle-categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, maxPassengers, baseFare, ratePerKm } = req.body;
  const category = vehicleCategories.find(c => c.id === id);
  if (category) {
    if (name) category.name = name;
    if (maxPassengers !== undefined) category.maxPassengers = parseInt(maxPassengers);
    if (baseFare !== undefined) category.baseFare = parseFloat(baseFare);
    if (ratePerKm !== undefined) category.ratePerKm = parseFloat(ratePerKm);
    saveData();
    res.json(category);
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

// Delete vehicle category
app.delete('/api/vehicle-categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  vehicleCategories = vehicleCategories.filter(c => c.id !== id);
  saveData();
  res.json({ success: true });
});

// Get driver status by email
app.get('/api/drivers/status', (req, res) => {
  const { email } = req.query;
  const driver = drivers.find(d => d.email === email);
  if (driver) {
    const todayStr = new Date().toDateString();
    const isDailyVerified = driver.lastVerifiedAt ? (new Date(driver.lastVerifiedAt).toDateString() === todayStr) : false;
    res.json({ 
      status: driver.status, 
      isBlocked: driver.isBlocked || false,
      isDailyVerified,
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
    // Return Pending by default for unregistered or fallback driver sessions to keep portal secure!
    res.json({ status: 'Pending', isBlocked: false, isDailyVerified: false, lastVerifiedAt: null, isOnline: false, currentRide: null, name: 'New Applicant', manufacturer: 'Tata', model: 'Nexon', plate: 'DL 3C AY 4567', phone: '+91 99999 88888', lat: 28.6304, lng: 77.2177, ratePerKm: '15.00', ratePerHour: '120.00', rating: 5.0, photos: {}, docs: {}, profilePic: null });
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

// Update driver profile name and/or profile picture (base64)
app.post('/api/drivers/profile', (req, res) => {
  const { email, name, profilePic } = req.body;
  const driver = drivers.find(d => d.email === (email || 'rajesh.k@gmail.com'));
  if (!driver) return res.status(404).json({ error: 'Driver not found' });
  if (name && name.trim()) driver.name = name.trim();
  if (profilePic) driver.profilePic = profilePic;
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
    saveData();
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
  res.json(drivers);
});

// Add new driver application (with backend validation check)
app.post('/api/drivers', (req, res) => {
  const { ratePerKm, ratePerHour } = req.body;
  // Validate custom rates against platform limits
  if (parseFloat(ratePerKm) < parseFloat(settings.ratePerKm)) {
    return res.status(400).json({ error: `Rate per KM cannot be less than system limit of ₹${settings.ratePerKm}` });
  }
  if (parseFloat(ratePerHour) < parseFloat(settings.minRatePerHour)) {
    return res.status(400).json({ error: `Rate per Hour cannot be less than system limit of ₹${settings.minRatePerHour}` });
  }

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
  const { pickup, dropoff, fare, passengerName, passengerEmail, pickupCoords, dropoffCoords, paymentType } = req.body;
  
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
    createdAt: new Date().toISOString()
  };
  activeRides.push(newRide);
  saveData();
  res.status(201).json(newRide);
});

// Driver checks for searching ride requests (under 8 KM)
app.get('/api/rides/active', (req, res) => {
  const { email } = req.query;
  const driver = drivers.find(d => d.email === email);
  const searching = activeRides.find(r => r.status === 'Searching');
  
  if (!searching) {
    return res.json(null);
  }

  // If driver is BLOCKED or ON REST BREAK (isPaused) — return null, no incoming ride popups
  if (driver && (driver.isBlocked || driver.isPaused)) {
    return res.json(null);
  }

  // If no driver email is passed or driver profile not found, default return (for easy dashboard previews)
  if (!driver) {
    return res.json(searching);
  }

  // Calculate distance between driver and passenger pickup coordinates
  if (searching.pickupCoords) {
    const distance = getDistance(
      parseFloat(driver.lat),
      parseFloat(driver.lng),
      parseFloat(searching.pickupCoords.lat),
      parseFloat(searching.pickupCoords.lng)
    );

    // Only notify drivers under 8 KM!
    if (distance <= 8.0) {
      res.json({ ...searching, distance: distance.toFixed(2) });
    } else {
      res.json(null); // Too far away!
    }
  } else {
    res.json(searching); // Fallback if no coordinates stored
  }
});

// Driver accepts a ride request
app.post('/api/rides/:id/accept', (req, res) => {
  const id = parseInt(req.params.id);
  const { driverName, driverPhone, driverEmail, vehicleModel, vehiclePlate } = req.body;
  const ride = activeRides.find(r => r.id === id);
  if (ride) {
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
    res.json(ride);
  } else {
    res.status(404).json({ error: 'Ride request not found' });
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

    const fareVal = parseFloat(ride.fare);
    const gst = fareVal * 0.05; // 5% GST
    const commission = fareVal * 0.05; // 5% Commission
    const totalCollected = fareVal + gst; // Passenger pays bid + 5% GST

    // Log calculation details on the ride log
    ride.gst = gst.toFixed(2);
    ride.commission = commission.toFixed(2);
    ride.totalCollected = totalCollected.toFixed(2);

    // Update driver's wallet
    const driver = drivers.find(d => d.email === ride.driverEmail);
    if (driver) {
      if (!driver.wallet) driver.wallet = { cashCollected: 0, toBePaid: 0, gstCollected: 0 };
      if (driver.wallet.gstCollected === undefined) driver.wallet.gstCollected = 0;
      driver.wallet.cashCollected += totalCollected;
      driver.wallet.toBePaid += (gst + commission);
      driver.wallet.gstCollected += gst;
    }

    // Update passenger's wallet
    const passenger = passengers.find(p => p.email === ride.passengerEmail);
    if (passenger) {
      if (!passenger.wallet) passenger.wallet = { totalSpent: 0, taxPaid: 0 };
      passenger.wallet.totalSpent += totalCollected;
      passenger.wallet.taxPaid += gst;
    }

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
      completedAt: r.completedAt || r.createdAt || null
    }))
  });

  res.json({ daily: summarise(daily), weekly: summarise(weekly), monthly: summarise(monthly) });
});

// Admin: Clear/settle a driver's pending balance (Mark as Paid)
app.post('/api/admin/drivers/:id/clear-balance', (req, res) => {
  const id = parseInt(req.params.id);
  const driver = drivers.find(d => d.id === id);
  if (driver) {
    const clearedAmount = driver.wallet?.toBePaid || 0;
    if (driver.wallet) {
      driver.wallet.toBePaid = 0;
    }
    saveData();
    res.json({ success: true, clearedAmount, driver });
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

app.listen(PORT, () => {
  console.log(`HUM Fleet API Server running on port ${PORT}`);
});
