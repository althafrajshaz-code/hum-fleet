const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.js');
let code = fs.readFileSync(indexPath, 'utf8');

// Inject MongoDB logic at the top
if (!code.includes('mongoose')) {
  code = code.replace(
    "const DATA_FILE = path.join(__dirname, 'data_store.json');",
    `const DATA_FILE = path.join(__dirname, 'data_store.json');

const mongoose = require('mongoose');
require('dotenv').config();

// Mongoose Schema for single-document state storage
const StateSchema = new mongoose.Schema({
  id: { type: String, default: 'global_state' },
  passengers: { type: Array, default: [] },
  drivers: { type: Array, default: [] },
  activeRides: { type: Array, default: [] },
  settings: { type: Object, default: {} },
  vehicleCategories: { type: Array, default: [] },
  adminCredentials: { type: Object, default: {} },
  driverMessages: { type: Object, default: {} },
  passengerMessages: { type: Object, default: {} },
  rideMessages: { type: Object, default: {} },
  dynamicLocations: { type: Array, default: [] },
  employees: { type: Array, default: [] },
  stats: { type: Object, default: { totalRides: 0, totalRevenue: 0, totalDrivers: 0, totalPassengers: 0 } }
}, { minimize: false });
const StateModel = mongoose.model('GlobalState', StateSchema);

let mongoConnected = false;`
  );
}

// Replace loadData and saveData
const saveLoadRegex = /\/\/ Persistence Helpers[\s\S]*?loadData\(\);/m;
const newDbLogic = `// Persistence Helpers
function saveData() {
  const data = { drivers, passengers, activeRides, settings, vehicleCategories, adminCredentials, driverMessages, passengerMessages, rideMessages, dynamicLocations, employees };
  
  if (mongoConnected) {
    StateModel.updateOne(
      { id: 'global_state' },
      { $set: data },
      { upsert: true }
    ).catch(err => console.error("Error saving to MongoDB:", err));
  }
  
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to save data_store:', err);
  }
}

async function loadData() {
  const uri = process.env.MONGODB_URI;
  let useLocal = true;

  if (uri) {
    try {
      await mongoose.connect(uri);
      mongoConnected = true;
      console.log("Connected to MongoDB Cloud Successfully!");

      let doc = await StateModel.findOne({ id: 'global_state' });
      if (!doc) {
        // Push local memory state to Mongo
        doc = new StateModel({ id: 'global_state', drivers, passengers, activeRides, settings, vehicleCategories, adminCredentials, driverMessages, passengerMessages, rideMessages, dynamicLocations, employees });
        await doc.save();
        console.log("Created initial state in MongoDB");
      } else {
        // Load into memory
        if (doc.drivers) drivers = doc.drivers;
        if (doc.passengers) passengers = doc.passengers;
        if (doc.activeRides) activeRides = doc.activeRides;
        if (doc.settings) settings = doc.settings;
        if (doc.vehicleCategories) vehicleCategories = doc.vehicleCategories;
        if (doc.adminCredentials) adminCredentials = doc.adminCredentials;
        if (doc.driverMessages) driverMessages = doc.driverMessages;
        if (doc.passengerMessages) passengerMessages = doc.passengerMessages;
        if (doc.rideMessages) rideMessages = doc.rideMessages;
        if (doc.dynamicLocations) dynamicLocations = doc.dynamicLocations;
        if (doc.employees) employees = doc.employees;
        console.log("Loaded existing state from MongoDB");
      }
      useLocal = false;
    } catch (err) {
      console.error("MongoDB Connection Error, falling back to local:", err);
    }
  }

  if (useLocal) {
    if (fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        const parsed = JSON.parse(raw);
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
        if (parsed.employees) employees = parsed.employees;
        console.log('Restored from data_store.json');
      } catch (err) {
        console.error('Failed to load data_store:', err);
      }
    }
  }
}

loadData();`;

code = code.replace(saveLoadRegex, newDbLogic);

fs.writeFileSync(indexPath, code, 'utf8');
console.log('Successfully patched index.js');
