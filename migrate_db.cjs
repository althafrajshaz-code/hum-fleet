const fs = require('fs');
const path = require('path');

const FIREBASE_DB_URL = 'https://hum-4bb7f-default-rtdb.firebaseio.com/data.json';
const DATA_FILE = path.join(__dirname, 'server', 'data_store.json');

async function migrate() {
  console.log('Reading local data_store.json...');
  if (!fs.existsSync(DATA_FILE)) {
    console.log('No data_store.json found. Skipping migration.');
    return;
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  
  function sanitizeKeys(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(sanitizeKeys);
    const newObj = {};
    for (let k in obj) {
      let newKey = k.replace(/\./g, ','); // Firebase doesn't allow '.' in keys
      newObj[newKey] = sanitizeKeys(obj[k]);
    }
    return newObj;
  }

  const sanitizedData = sanitizeKeys(data);
  
  console.log('Uploading to Firebase Realtime Database...');
  
  const response = await fetch(FIREBASE_DB_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sanitizedData)
  });

  if (response.ok) {
    console.log('Migration to Firebase RTDB successful!');
  } else {
    console.error('Migration failed:', await response.text());
  }
}

migrate();
