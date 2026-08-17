const fs = require('fs');

// READ THIS: You can put as many locations as you want in the locations.json file!
// Make sure you run this script using: node bulk_upload_locations.js

async function uploadLocations() {
  try {
    const data = fs.readFileSync('locations.json', 'utf8');
    const locations = JSON.parse(data);
    
    console.log(`Found ${locations.length} locations to upload...`);

    // Replace with your Hostinger server IP if running from your local PC, 
    // or use http://localhost:5000 if running directly on the Hostinger server.
    const SERVER_URL = 'http://187.127.165.79:5000';
    
    const response = await fetch(`${SERVER_URL}/api/locations/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ locations })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ Success! Added ${result.added} new locations.`);
    } else {
      console.error('❌ Error from server:', result.error);
    }
    
  } catch (err) {
    console.error('❌ Failed to upload locations. Did you create locations.json properly?', err.message);
  }
}

uploadLocations();
