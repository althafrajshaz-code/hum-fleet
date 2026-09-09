const fs = require('fs');
let content = fs.readFileSync('d:/Althaf/hum/src/pages/PassengerDashboard.jsx', 'utf8');

content = content.replace(
  "import { MapPin, Navigation, Car, AlertCircle, Phone, CheckCircle, DollarSign, Wallet, Map, Share2, Camera, User, MessageSquare, Send, X, Navigation2, LogOut, Compass } from 'lucide-react';",
  "import { MapPin, Navigation, Car, AlertCircle, Phone, CheckCircle, DollarSign, Wallet, Map, Share2, Camera, User, MessageSquare, Send, X, Navigation2, LogOut, Compass, Clock } from 'lucide-react';"
);

fs.writeFileSync('d:/Althaf/hum/src/pages/PassengerDashboard.jsx', content);
console.log('Fixed Clock import.');
