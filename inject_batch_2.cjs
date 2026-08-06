const https = require('https');

const locations = [
  { name: 'Wonderla Amusement Park', lat: 10.0475, lng: 76.3986 },
  { name: 'Kacheripady Junction', lat: 9.9856, lng: 76.2842 },
  { name: 'Ernakulam Shiva Temple', lat: 9.9622, lng: 76.2843 },
  { name: 'Kerala High Court', lat: 9.9833, lng: 76.2758 },
  { name: 'Subhash Bose Park', lat: 9.9733, lng: 76.2801 },
  { name: 'PVR Cinemas, Lulu', lat: 10.0274, lng: 76.3080 },
  { name: 'Kakkanad Civil Station', lat: 10.0163, lng: 76.3456 },
  { name: 'Thrippunithura Railway Station', lat: 9.9535, lng: 76.3452 },
  { name: 'Chottanikkara Temple', lat: 9.9328, lng: 76.3912 },
  { name: 'Bolgatty Palace', lat: 9.9818, lng: 76.2673 },
  { name: 'Vallarpadam Terminal', lat: 9.9928, lng: 76.2575 },
  { name: 'Cochin University (CUSAT)', lat: 10.0416, lng: 76.3232 },
  { name: 'KIMS Hospital, Kochi', lat: 10.0105, lng: 76.3075 },
  { name: 'Centre Square Mall', lat: 9.9782, lng: 76.2831 },
  { name: 'Medical Trust Hospital', lat: 9.9647, lng: 76.2913 },
  { name: 'KSRTC Bus Stand, Ernakulam', lat: 9.9760, lng: 76.2845 },
  { name: 'Renai Medicity', lat: 10.0076, lng: 76.3090 },
  { name: 'Sunrise Hospital, Kakkanad', lat: 10.0155, lng: 76.3370 },
  { name: 'Reliance Smart, Edappally', lat: 10.0270, lng: 76.3085 },
  { name: 'Lisie Hospital', lat: 9.9877, lng: 76.2882 },
  { name: 'Cochin Shipyard', lat: 9.9567, lng: 76.2974 },
  { name: 'Ernakulam Town Railway Station', lat: 9.9880, lng: 76.2891 },
  { name: 'Rajagiri Hospital', lat: 10.0760, lng: 76.3533 },
  { name: 'Forum Mall, Maradu', lat: 9.9357, lng: 76.3195 },
  { name: 'VPS Lakeshore Hospital', lat: 9.9332, lng: 76.3160 },
  { name: 'Vyttila Metro Station', lat: 9.9678, lng: 76.3218 },
  { name: 'Apollo Adlux Hospital', lat: 10.2241, lng: 76.3887 },
  { name: 'InfoPark Phase 2', lat: 10.0035, lng: 76.3683 },
  { name: 'Gourmet House Restaurant', lat: 9.9700, lng: 76.2850 },
  { name: 'Decathlon Vyttila', lat: 9.9600, lng: 76.3220 },
  { name: 'Hill Palace Museum', lat: 9.9515, lng: 76.3570 },
  { name: 'Mangalavanam Bird Sanctuary', lat: 9.9885, lng: 76.2760 },
  { name: 'St. Teresa\'s College', lat: 9.9780, lng: 76.2795 },
  { name: 'Sacred Heart College', lat: 9.9372, lng: 76.2995 },
  { name: 'Maharajas College', lat: 9.9711, lng: 76.2838 },
  { name: 'Kaloor Kadavanthra Road', lat: 9.9890, lng: 76.2990 },
  { name: 'Panampilly Nagar', lat: 9.9620, lng: 76.2950 },
  { name: 'Oberon Mall', lat: 10.0130, lng: 76.3090 },
  { name: 'Gold Souk Grande', lat: 9.9730, lng: 76.3150 },
  { name: 'Jawaharlal Nehru Stadium', lat: 9.9984, lng: 76.2996 }
];

async function run() {
  let success = 0;
  for (const loc of locations) {
    try {
      const res = await fetch('https://hum-fleet-api.onrender.com/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loc)
      });
      if (res.ok) {
        success++;
        console.log(`[PROGRESS] Added: ${loc.name} -> LAT: ${loc.lat}, LNG: ${loc.lng}`);
      }
    } catch(err) {
      console.error(err);
    }
  }
  console.log(`Total successfully added: ${success}`);
}

run();
