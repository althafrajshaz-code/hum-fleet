import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Car, AlertCircle, Phone, CheckCircle, DollarSign, Wallet, Map, Share2, Camera, User, MessageSquare, Send, X, Navigation2, LogOut, Compass } from 'lucide-react';
import Button from '../components/Button';
import './Dashboard.css';

const API_BASE = (typeof window !== 'undefined' && window.location.hostname.includes('loca.lt'))
  ? 'https://hum-fleet-backend.loca.lt'
  : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.protocol !== 'capacitor:')
    ? 'http://localhost:5000'
    : (import.meta.env.VITE_BACKEND_URL || 'https://hum-fleet-api.onrender.com');


const KERALA_LOCATIONS = [
  // --- 1. ERNAKULAM & KOCHI ---
  { name: "Cochin International Airport (COK), Nedumbassery", lat: 10.1520, lng: 76.4019 },
  { name: "Marine Drive & MG Road, Ernakulam", lat: 9.9777, lng: 76.2758 },
  { name: "Lulu Mall & Edappally Junction", lat: 10.0270, lng: 76.3080 },
  { name: "Infopark Phase 1 & SmartCity, Kakkanad", lat: 10.0088, lng: 76.3606 },
  { name: "Fort Kochi Beach & Mattancherry", lat: 9.9658, lng: 76.2421 },
  { name: "Vytila Mobility Hub & Junction", lat: 9.9664, lng: 76.3181 },
  { name: "Ernakulam South Railway Station (ERS)", lat: 9.9687, lng: 76.2890 },
  { name: "Ernakulam North Railway Station (ERN)", lat: 9.9912, lng: 76.2882 },
  { name: "Kaloor JLN Stadium & Bus Stand", lat: 9.9984, lng: 76.3005 },
  { name: "Aluva Railway Station & KSRTC Stand", lat: 10.1082, lng: 76.3570 },
  { name: "Aster Medcity, Cheranallur", lat: 10.0463, lng: 76.2721 },
  { name: "Angamaly KSRTC & TELK Junction", lat: 10.1960, lng: 76.3860 },
  { name: "Perumbavoor KSRTC & Private Stand", lat: 10.1147, lng: 76.4828 },
  { name: "Muvattupuzha KSRTC & Velloorkunnam", lat: 9.9822, lng: 76.5772 },
  { name: "Kothamangalam High Range Junction", lat: 10.0594, lng: 76.6214 },
  { name: "Tripunithura Hill Palace & Junction", lat: 9.9529, lng: 76.3615 },
  { name: "North Paravur Municipal Junction", lat: 10.1458, lng: 76.2267 },

  // --- 2. THIRUVANANTHAPURAM ---
  { name: "Technopark Phase 1, 2 & 3, Kazhakkoottam", lat: 8.5581, lng: 76.8816 },
  { name: "Thampanoor Central Station & KSRTC", lat: 8.4862, lng: 76.9523 },
  { name: "East Fort (Kizhakke Kotta) & Padmanabhaswamy Temple", lat: 8.4830, lng: 76.9436 },
  { name: "Trivandrum International Airport (TRV)", lat: 8.4821, lng: 76.9200 },
  { name: "Kovalam Beach & Samudra", lat: 8.4020, lng: 76.9784 },
  { name: "Varkala Cliff & Papanasam Beach", lat: 8.7356, lng: 76.7032 },
  { name: "Vizhinjam International Seaport & Harbor", lat: 8.3804, lng: 76.9904 },
  { name: "Nedumangad Town & KSRTC Stand", lat: 8.6015, lng: 77.0018 },
  { name: "Neyyattinkara Railway Station & Town", lat: 8.3970, lng: 77.0850 },
  { name: "Attingal KSRTC & Palace Junction", lat: 8.6945, lng: 76.8142 },
  { name: "KIMS Hospital & Anayara", lat: 8.5204, lng: 76.9183 },
  { name: "Medical College Hospital (MCH), Trivandrum", lat: 8.5230, lng: 76.9280 },
  { name: "Lulu Mall, Trivandrum", lat: 8.5085, lng: 76.9080 },
  { name: "Palayam & University College", lat: 8.4975, lng: 76.9505 },

  // --- 3. KOZHIKODE ---
  { name: "Kozhikode Beach & SM Street", lat: 11.2588, lng: 75.7804 },
  { name: "Calicut International Airport (CCJ), Karipur", lat: 11.1364, lng: 75.9553 },
  { name: "Kozhikode Main Railway Station (CLT)", lat: 11.2476, lng: 75.7816 },
  { name: "Mavoor Road KSRTC & Medical College", lat: 11.2570, lng: 75.7925 },
  { name: "Cyberpark Kozhikode & UL Cyberpark", lat: 11.2725, lng: 75.8360 },
  { name: "Vadakara Old Bus Stand & Railway Station", lat: 11.6090, lng: 75.5915 },
  { name: "Koyilandy Municipal Stand & Railway", lat: 11.4390, lng: 75.6965 },
  { name: "Feroke Railway Station & Bridge", lat: 11.1643, lng: 75.8043 },
  { name: "Thamarassery Ghat Pass Gate", lat: 11.4170, lng: 75.9370 },
  { name: "Aster MIMS Hospital, Kozhikode", lat: 11.2384, lng: 75.7997 },
  { name: "Meitra Hospital, Kozhikode", lat: 11.3120, lng: 75.7850 },
  { name: "Mukkam Town & KMCT Campus", lat: 11.3195, lng: 75.9920 },

  // --- 4. THRISSUR ---
  { name: "Thrissur Swaraj Round & Vadakkunnathan", lat: 10.5276, lng: 76.2144 },
  { name: "Sakthan Thampuran Bus Stand", lat: 10.5140, lng: 76.2165 },
  { name: "Thrissur Railway Station (TCR) & KSRTC", lat: 10.5186, lng: 76.2147 },
  { name: "Guruvayur Temple & Railway Station", lat: 10.5946, lng: 76.0384 },
  { name: "Chalakudy KSRTC & Railway Station", lat: 10.3070, lng: 76.3315 },
  { name: "Kodungallur Temple & Craft Hospital", lat: 10.2220, lng: 76.1980 },
  { name: "Kunnamkulam Bus Stand & Town", lat: 10.6510, lng: 76.0715 },
  { name: "Irinjalakuda KSRTC & Temple", lat: 10.3420, lng: 76.2110 },
  { name: "Amala Institute of Medical Sciences", lat: 10.5650, lng: 76.1680 },
  { name: "Jubilee Mission Medical College", lat: 10.5220, lng: 76.2310 },
  { name: "Athirappilly Waterfalls", lat: 10.2850, lng: 76.5698 },

  // --- 5. ALAPPUZHA ---
  { name: "Alleppey Punnamada Houseboat Jetty", lat: 9.5006, lng: 76.3456 },
  { name: "Alappuzha Beach & Lighthouse", lat: 9.4912, lng: 76.3195 },
  { name: "Cherthala KSRTC & X'ian College", lat: 9.6860, lng: 76.3320 },
  { name: "Kayamkulam Junction Railway & KSRTC", lat: 9.1728, lng: 76.4990 },
  { name: "Marari Beach, Mararikulam", lat: 9.6010, lng: 76.2995 },
  { name: "Ambalapuzha Temple", lat: 9.3820, lng: 76.3580 },
  { name: "Haripad Subrahmanya Temple", lat: 9.2780, lng: 76.4520 },
  { name: "Mavelikkara Town & Railway Station", lat: 9.2610, lng: 76.5510 },
  { name: "Kuttanad (Ramankary / Champakulam)", lat: 9.4320, lng: 76.4150 },
  { name: "Edathua Church & Town", lat: 9.3660, lng: 76.4460 },

  // --- 6. KOTTAYAM ---
  { name: "Kottayam KSRTC & Seematti Junction", lat: 9.5916, lng: 76.5322 },
  { name: "Kottayam Railway Station (KTYM)", lat: 9.5960, lng: 76.5380 },
  { name: "Changanassery Town & Railway Station", lat: 9.4470, lng: 76.5360 },
  { name: "Pala KSRTC & Lalam Bridge", lat: 9.7120, lng: 76.6840 },
  { name: "Kanjirappally Town & Jubilee Junction", lat: 9.5580, lng: 76.7860 },
  { name: "Ettumanoor Mahadeva Temple", lat: 9.6705, lng: 76.5620 },
  { name: "Kumarakom Bird Sanctuary", lat: 9.6175, lng: 76.4300 },
  { name: "Vaikom Mahadeva Temple & Boat Jetty", lat: 9.7490, lng: 76.3940 },
  { name: "Erattupetta Town & Poonjar Road", lat: 9.6830, lng: 76.7830 },
  { name: "Caritas Hospital & Matha Hospital, Thellakom", lat: 9.6260, lng: 76.5410 },
  { name: "Kottayam Medical College, Gandhinagar", lat: 9.6200, lng: 76.5300 },

  // --- 7. IDUKKI ---
  { name: "Munnar Town Center & KSRTC", lat: 10.0889, lng: 77.0595 },
  { name: "Thodupuzha KSRTC & Mangattukavala", lat: 9.8960, lng: 76.7160 },
  { name: "Kattappana Town & Bus Stand", lat: 9.7780, lng: 77.1180 },
  { name: "Thekkady Kumily Town (Periyar Tiger Gate)", lat: 9.6023, lng: 77.1648 },
  { name: "Adimali Town", lat: 10.0210, lng: 76.9530 },
  { name: "Nedumkandam Town", lat: 9.8450, lng: 77.1650 },
  { name: "Cheruthoni Town (Idukki Dam)", lat: 9.8433, lng: 76.9744 },
  { name: "Vagamon Meadows & Pine Forest", lat: 9.6780, lng: 76.9060 },
  { name: "Peermade Town", lat: 9.5710, lng: 76.9930 },

  // --- 8. WAYANAD ---
  { name: "Kalpetta Old Bus Stand & New Stand", lat: 11.6103, lng: 76.0827 },
  { name: "Sultan Bathery KSRTC & Highway Junction", lat: 11.6625, lng: 76.2570 },
  { name: "Mananthavady KSRTC & Valliyoorkavu", lat: 11.8020, lng: 76.0030 },
  { name: "Vythiri Town & Lakkidi View Point", lat: 11.5520, lng: 76.0410 },
  { name: "Meppadi Town & Chembra Peak", lat: 11.5470, lng: 76.1260 },
  { name: "Panamaram Town", lat: 11.7240, lng: 76.0780 },
  { name: "Banasura Sagar Dam", lat: 11.6700, lng: 75.9550 },
  { name: "Muthanga Wildlife Sanctuary Gate", lat: 11.6750, lng: 76.3750 },
  { name: "Wayanad Institute of Medical Sciences (WIMS), Meppadi", lat: 11.5430, lng: 76.1150 },

  // --- 9. PALAKKAD ---
  { name: "Palakkad Stadium Bus Stand & Fort Junction", lat: 10.7760, lng: 76.6575 },
  { name: "Palakkad Junction Railway Station (Olavakkode)", lat: 10.7967, lng: 76.6496 },
  { name: "Shoranur Junction Railway Station", lat: 10.7610, lng: 76.2750 },
  { name: "Ottapalam Town & Railway Station", lat: 10.7710, lng: 76.3810 },
  { name: "Chittur Town & KSRTC Stand", lat: 10.6970, lng: 76.7440 },
  { name: "Mannarkkad Town & Silent Valley Road", lat: 10.9880, lng: 76.4580 },
  { name: "Alathur Swathi Junction", lat: 10.6480, lng: 76.5440 },
  { name: "Pattambi Railway Station & Mele Pattambi", lat: 10.8060, lng: 76.1820 },
  { name: "Nelliampathi Hills & Checkpost", lat: 10.5360, lng: 76.6870 },
  { name: "Walayar Checkpost", lat: 10.8400, lng: 76.8530 },

  // --- 10. KANNUR ---
  { name: "Kannur Old Bus Stand & Caltex Junction", lat: 11.8740, lng: 75.3710 },
  { name: "Kannur International Airport (CNN), Mattannur", lat: 11.9184, lng: 75.5473 },
  { name: "Thalassery Old Bus Stand & Railway", lat: 11.7490, lng: 75.4890 },
  { name: "Payyanur KSRTC Stand & Railway Station", lat: 12.1020, lng: 75.2040 },
  { name: "Taliparamba Highway Junction", lat: 12.0420, lng: 75.3580 },
  { name: "Iritty Town & Bus Stand", lat: 11.9810, lng: 75.6670 },
  { name: "Kuthuparamba Town & Bus Stand", lat: 11.8310, lng: 75.5670 },
  { name: "Muzhappilangad Drive-in Beach", lat: 11.7940, lng: 75.4520 },
  { name: "Pariyaram Medical College", lat: 12.0830, lng: 75.2950 },
  { name: "Kannur Railway Station (CAN)", lat: 11.8710, lng: 75.3620 },

  // --- 11. KOLLAM ---
  { name: "Kollam KSRTC Bus Station & Chinnakada", lat: 8.8932, lng: 76.5841 },
  { name: "Karunagappally Bus Stand & Railway", lat: 9.0540, lng: 76.5360 },
  { name: "Punalur KSRTC & Suspension Bridge", lat: 9.0180, lng: 76.9240 },
  { name: "Kottarakkara KSRTC & Ganapathy Temple", lat: 9.0010, lng: 76.7720 },
  { name: "Paravur Town & Pozhikkara", lat: 8.8120, lng: 76.6640 },
  { name: "Pathanapuram Town & Bus Stand", lat: 9.0840, lng: 76.8570 },
  { name: "Chadayamangalam Jatayu Earth's Center", lat: 8.8770, lng: 76.8677 },
  { name: "Ashtamudi Lake & Houseboats", lat: 8.9230, lng: 76.5680 },
  { name: "Thenmala Ecotourism Center", lat: 8.9610, lng: 77.0620 },
  { name: "Chathannoor Town & Junction", lat: 8.8570, lng: 76.7190 },

  // --- 12. MALAPPURAM ---
  { name: "Malappuram KSRTC Bus Stand & Civil Station", lat: 11.0734, lng: 76.0740 },
  { name: "Manjeri Bus Stand & IG Road", lat: 11.1215, lng: 76.1217 },
  { name: "Perinthalmanna Bus Stand & Jubilee Junction", lat: 10.9780, lng: 76.2260 },
  { name: "Moulana Hospital, Perinthalmanna", lat: 10.9764, lng: 76.2255 },
  { name: "Pattikkad, Perinthalmanna", lat: 11.0211, lng: 76.2325 },
  { name: "Tirur Railway Station & Bus Stand", lat: 10.9152, lng: 75.9238 },
  { name: "Ponnani Bus Stand & Harbor", lat: 10.7710, lng: 75.9240 },
  { name: "Kottakkal Arya Vaidya Sala & Changuvetty", lat: 11.0010, lng: 75.9960 },
  { name: "Kondotty Town & Airport Junction", lat: 11.1480, lng: 75.9620 },
  { name: "Nilambur Town & Teak Museum", lat: 11.2770, lng: 76.2260 },
  { name: "Edappal Town & Junction", lat: 10.7710, lng: 75.9990 },
  { name: "Kottakkal Aster MIMS Hospital", lat: 10.9980, lng: 75.9940 },
  { name: "MES Medical College, Perinthalmanna", lat: 10.9630, lng: 76.1950 },

  // --- 13. PATHANAMTHITTA ---
  { name: "Pathanamthitta KSRTC & Aban Junction", lat: 9.2648, lng: 76.7870 },
  { name: "Thiruvalla KSRTC & Railway Station", lat: 9.3848, lng: 76.5746 },
  { name: "Adoor KSRTC & Revenue Tower", lat: 9.1580, lng: 76.7340 },
  { name: "Ranni Town & Ittiyappara Bus Stand", lat: 9.3810, lng: 76.8120 },
  { name: "Pandalam Palace & KSRTC", lat: 9.2310, lng: 76.6840 },
  { name: "Kozhencherry Town & Bridge", lat: 9.3410, lng: 76.7110 },
  { name: "Konni Elephant Reserve & Bus Stand", lat: 9.2450, lng: 76.8520 },
  { name: "Sabarimala Pamba Base Camp", lat: 9.4060, lng: 77.0720 },
  { name: "Muthoor & Believers Church Medical College, Thiruvalla", lat: 9.3780, lng: 76.5910 },
  { name: "Mallappally Town & Bus Stand", lat: 9.4440, lng: 76.6570 },

  // --- 14. KASARAGOD ---
  { name: "Kasaragod New Bus Stand & Railway Station", lat: 12.4996, lng: 74.9868 },
  { name: "Kanhangad KSRTC Stand & North Kottacherry", lat: 12.3160, lng: 75.0930 },
  { name: "Nileshwaram Town & Railway Station", lat: 12.2530, lng: 75.1270 },
  { name: "Uppala Town & National Highway Checkpost", lat: 12.6860, lng: 74.8960 },
  { name: "Cheruvathur Town & Bus Stand", lat: 12.2140, lng: 75.1670 },
  { name: "Bekal Fort & Beach", lat: 12.3920, lng: 75.0350 },
  { name: "Manjeshwar Town & Border", lat: 12.7160, lng: 74.8850 },
  { name: "Kumbla Town & Bus Stand", lat: 12.5830, lng: 74.9450 },
  { name: "Central University of Kerala, Periye", lat: 12.3860, lng: 75.0870 }
];

// Frontend Haversine distance calculator
const getFrontendDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in KM
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const resolveVehiclePhoto = (photoPath, type = 'front') => {
  if (!photoPath) {
    if (type === 'front') return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600';
    if (type === 'rear') return 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600';
    if (type === 'left') return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600';
    if (type === 'right') return 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600';
    return 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600';
  }
  if (photoPath.startsWith('data:') || photoPath.startsWith('http')) {
    return photoPath;
  }
  const pathLower = photoPath.toLowerCase();
  if (pathLower.includes('nexon')) {
    return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600';
  }
  if (pathLower.includes('creta')) {
    return 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600';
  }
  if (pathLower.includes('swift') || pathLower.includes('priya')) {
    return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600';
  }
  return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600';
};

const PassengerDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('passengerEmail');
    if (!email) {
      navigate('/passenger/login');
    }
  }, [navigate]);

  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);

  const [dynamicLocations, setDynamicLocations] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/locations`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setDynamicLocations(data || []))
      .catch(err => console.error('Failed to fetch dynamic locations:', err));
  }, []);

  const [pickupFocused, setPickupFocused] = useState(false);
  const [dropoffFocused, setDropoffFocused] = useState(false);
  const [selectedTier, setSelectedTier] = useState('HUM Go');
  
  // Custom offered fare states
  const [customFare, setCustomFare] = useState('');
  const [fareWarning, setFareWarning] = useState('');

  // Wallet & Profile State
  const [wallet, setWallet] = useState({ totalSpent: 0, taxPaid: 0 });
  const [passengerProfilePic, setPassengerProfilePic] = useState(localStorage.getItem('passengerProfilePic') || null);
  const [passengerRating, setPassengerRating] = useState(5.0);

  // In-Trip Chat States (Strictly enabled for matched driver & passenger on active ride)
  const [showInTripChat, setShowInTripChat] = useState(false);
  const [tripChatMessages, setTripChatMessages] = useState([]);
  const [tripChatText, setTripChatText] = useState('');
  const [tripChatError, setTripChatError] = useState(null);

  // Support Chat States
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [supportMessages, setSupportMessages] = useState([]);
  const [supportText, setSupportText] = useState('');

  const handleUploadPassengerProfilePic = async (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result;
      setPassengerProfilePic(base64Data);
      localStorage.setItem('passengerProfilePic', base64Data);
      const email = localStorage.getItem('passengerEmail');
      if (!email) return;
      try {
        await fetch(`${API_BASE}/api/passengers/profile-pic`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, profilePic: base64Data })
        });
        alert('Passenger profile picture updated successfully!');
      } catch (err) {
        console.error('Failed to update passenger profile pic:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  // Dynamic Vehicle Categories State
  const [categories, setCategories] = useState([
    { id: 'auto', name: '🛺 Auto Rickshaw', maxPassengers: 3, baseFare: 30, ratePerKm: 12, icon: '🛺' },
    { id: 'hatchback', name: 'Mini / Hatchback', maxPassengers: 4, baseFare: 50, ratePerKm: 15, icon: '🚗' },
    { id: 'sedan', name: 'Sedan (AC)', maxPassengers: 4, baseFare: 70, ratePerKm: 18, icon: '🚘' },
    { id: 'suv', name: 'SUV / XL (6 Seater)', maxPassengers: 6, baseFare: 120, ratePerKm: 25, icon: '🚐' },
    { id: 'ev', name: '⚡ EV Green Cab (Eco)', maxPassengers: 4, baseFare: 60, ratePerKm: 16, icon: '⚡' }
  ]);

  const [settings, setSettings] = useState({
    baseFare: '50.00',
    ratePerKm: '15.00',
    surgeMultiplier: '1.0'
  });

  // Ride Booking Workflow State
  const [activeRide, setActiveRide] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [rideAccepted, setRideAccepted] = useState(false);
  const [withPet, setWithPet] = useState(false);

  // Pre-booking states
  const [isPreBookToggle, setIsPreBookToggle] = useState(false);
  const [preBookDate, setPreBookDate] = useState('');
  const [preBookTime, setPreBookTime] = useState('');
  const [preBookedRides, setPreBookedRides] = useState([]);

  // Bidirectional rating states
  const [showRating, setShowRating] = useState(false);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  // Change / Update Destination Mid-Trip States
  const [showUpdateDestModal, setShowUpdateDestModal] = useState(false);
  const [newDestInput, setNewDestInput] = useState('');
  const [newDestCoords, setNewDestCoords] = useState(null);
  const [newDestFocused, setNewDestFocused] = useState(false);
  const [isSubmittingDestUpdate, setIsSubmittingDestUpdate] = useState(false);

  // Vehicle Arriving splash notification state
  const [showVehicleArrivingModal, setShowVehicleArrivingModal] = useState(false);
  const vehicleArrivingTimerRef = useRef(null);
  const prevRideAcceptedRef = useRef(false);

  const fetchPassengerStatus = async () => {
    const email = localStorage.getItem('passengerEmail');
    if (!email) return;
    try {
      const response = await fetch(`${API_BASE}/api/passengers/status?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setPassengerRating(data.rating || 5.0);
        if (data.profilePic) {
          setPassengerProfilePic(data.profilePic);
          localStorage.setItem('passengerProfilePic', data.profilePic);
        }
      }
    } catch (err) {
      console.error("Failed to fetch passenger status:", err);
    }
  };

  const fetchWallet = async () => {
    const email = localStorage.getItem('passengerEmail');
    if (!email) return;
    try {
      const response = await fetch(`${API_BASE}/api/passengers/wallet?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setWallet(data);
      }
    } catch (err) {
      console.error("Failed to fetch passenger wallet:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/vehicle-categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        if (data.length > 0) {
          setSelectedTier(data[0].name);
        }
      }
    } catch (err) {
      console.error("Failed to fetch vehicle categories:", err);
    }
  };

  const fetchPassengerActiveRide = async () => {
    const email = localStorage.getItem('passengerEmail');
    if (!email) return;
    try {
      const response = await fetch(`${API_BASE}/api/rides/passenger/active?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setActiveRide(data);
          if (data.status === 'Accepted' || data.status === 'Arrived') {
            setIsSearching(false);
            setRideAccepted(true);
          } else if (data.status === 'Searching') {
            setIsSearching(true);
            setRideAccepted(false);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch passenger active ride:", err);
    }
  };

  const fetchPreBookedRides = async () => {
    const email = localStorage.getItem('passengerEmail');
    if (!email) return;
    try {
      const response = await fetch(`${API_BASE}/api/rides/passenger?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        const scheduled = data.filter(r => r.isPreBooked && (r.status === 'Searching' || r.status === 'Accepted'));
        setPreBookedRides(scheduled);
      }
    } catch (err) {
      console.error("Failed to fetch scheduled rides:", err);
    }
  };

  const handleCancelPrebookedRide = async (rideId) => {
    if (!window.confirm("Are you sure you want to cancel this scheduled ride?")) return;
    try {
      const response = await fetch(`${API_BASE}/api/rides/${rideId}/passenger-cancel`, {
        method: 'POST'
      });
      if (response.ok) {
        alert("Scheduled ride cancelled successfully.");
        fetchPreBookedRides();
      } else {
        alert("Failed to cancel scheduled ride.");
      }
    } catch (err) {
      console.error("Error cancelling scheduled ride:", err);
    }
  };

  const handleUpdateDestination = async (e) => {
    e.preventDefault();
    if (!activeRide || !newDestInput.trim()) return;
    setIsSubmittingDestUpdate(true);
    try {
      const response = await fetch(`${API_BASE}/api/rides/${activeRide.id}/update-destination`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newDropoff: newDestInput.trim(),
          newDropoffCoords: newDestCoords
        })
      });
      if (response.ok) {
        const data = await response.json();
        setActiveRide(data.ride);
        setDropoff(newDestInput.trim());
        if (newDestCoords) setDropoffCoords(newDestCoords);
        setShowUpdateDestModal(false);
        setNewDestInput('');
        setNewDestCoords(null);
        alert(`🏁 Destination updated to "${newDestInput.trim()}". Ride route & fare recalculated successfully!`);
      } else {
        alert('Failed to update destination.');
      }
    } catch (err) {
      console.error('Error updating destination:', err);
      alert('Failed to connect to operations server.');
    } finally {
      setIsSubmittingDestUpdate(false);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/settings`);
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (err) {
        console.error("Error fetching system pricing settings:", err);
      }
    };
    fetchSettings();
    fetchCategories();
    fetchWallet();
    fetchPassengerStatus();
    fetchPassengerActiveRide();
    fetchPreBookedRides();
  }, []);

  // Poll vehicle categories & settings every 3 seconds to get live admin pricing updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCategories();
      fetchPassengerActiveRide();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Poll scheduled rides in background
  useEffect(() => {
    const interval = setInterval(fetchPreBookedRides, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch wallet and status when active ride changes (e.g. completes)
  useEffect(() => {
    fetchWallet();
    fetchPassengerStatus();
    fetchPreBookedRides();
  }, [activeRide]);

  // In-Trip Chat Message Polling (Active strictly for matched passenger and driver)
  const fetchTripChatMessages = async () => {
    if (!activeRide) return;
    const userEmail = localStorage.getItem('passengerEmail');
    if (!userEmail) return;
    try {
      const res = await fetch(`${API_BASE}/api/rides/messages?rideId=${activeRide.id}&userEmail=${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setTripChatMessages(data);
      }
    } catch (err) {
      console.error("Error fetching in-trip chat:", err);
    }
  };

  const sendTripChatMessage = async (e) => {
    e.preventDefault();
    setTripChatError(null);
    if (!tripChatText || !tripChatText.trim()) return;
    const userEmail = localStorage.getItem('passengerEmail');
    const userName = localStorage.getItem('passengerName') || 'Customer';
    try {
      const res = await fetch(`${API_BASE}/api/rides/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rideId: activeRide.id,
          senderEmail: userEmail,
          senderName: userName,
          text: tripChatText.trim()
        })
      });
      if (res.ok) {
        setTripChatText('');
        setTripChatError(null);
        fetchTripChatMessages();
      } else {
        const data = await res.json();
        setTripChatError(data.error || 'Failed to send message.');
      }
    } catch (err) {
      console.error("Error sending in-trip chat message:", err);
    }
  };

  useEffect(() => {
    if (!showInTripChat || !activeRide) return;
    fetchTripChatMessages();
    const interval = setInterval(fetchTripChatMessages, 2000);
    return () => clearInterval(interval);
  }, [showInTripChat, activeRide]);

  const fetchSupportMessages = async () => {
    const email = localStorage.getItem('passengerEmail');
    if (!email) return;
    try {
      const response = await fetch(`${API_BASE}/api/passengers/messages?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        setSupportMessages(await response.json());
      }
    } catch (err) {
      console.error("Error fetching support messages:", err);
    }
  };

  const handleSendSupportMessage = async (e) => {
    if (e) e.preventDefault();
    if (!supportText.trim()) return;
    const email = localStorage.getItem('passengerEmail');
    const name = localStorage.getItem('passengerName') || 'Customer';
    try {
      const response = await fetch(`${API_BASE}/api/passengers/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, sender: name, text: supportText.trim() })
      });
      if (response.ok) {
        setSupportText('');
        fetchSupportMessages();
      }
    } catch (err) {
      console.error("Error sending support message:", err);
    }
  };

  useEffect(() => {
    if (!showSupportChat) return;
    fetchSupportMessages();
    const interval = setInterval(fetchSupportMessages, 3000);
    return () => clearInterval(interval);
  }, [showSupportChat]);

  // Listen for Leaflet Map location messages
  useEffect(() => {
    const handleMapMessage = (event) => {
      if (event.data && event.data.type === 'MAP_LOCATION_SELECTED') {
        setPickup(event.data.address);
        setPickupCoords({ lat: event.data.lat, lng: event.data.lng });
      }
    };
    window.addEventListener('message', handleMapMessage);
    return () => window.removeEventListener('message', handleMapMessage);
  }, []);

  // Distance calculation: actual Haversine distance, defaults to 8 KM if no dropoff chosen yet
  const tripDistance = pickupCoords && dropoffCoords
    ? parseFloat(getFrontendDistance(pickupCoords.lat, pickupCoords.lng, dropoffCoords.lat, dropoffCoords.lng).toFixed(1))
    : 8;

  const isIntercity = tripDistance > 35.0;

  const surge = parseFloat(settings.surgeMultiplier) || 1.0;

  const calculateCategoryFare = (cat) => {
    if (!cat) return '0.00';
    let catBase = parseFloat(cat.baseFare !== undefined ? cat.baseFare : settings.baseFare);
    if (parseFloat(settings.baseFare) > catBase) catBase = parseFloat(settings.baseFare);
    
    // Intercity pricing: add ₹250 extra to the driver base fare if distance is > 35 KM
    if (isIntercity) {
      catBase += 250.00;
    }

    let catPerKm = parseFloat(cat.ratePerKm !== undefined ? cat.ratePerKm : settings.ratePerKm);
    if (parseFloat(settings.ratePerKm) > catPerKm) catPerKm = parseFloat(settings.ratePerKm);

    const rawFare = (catBase + catPerKm * tripDistance) * surge;
    return rawFare.toFixed(2);
  };

  const currentCategory = categories.find(c => c.name === selectedTier);
  const minFare = currentCategory 
    ? calculateCategoryFare(currentCategory) 
    : '0.00';

  // Sync custom fare input when selected tier changes
  useEffect(() => {
    setCustomFare(minFare);
    setFareWarning('');
  }, [selectedTier, settings, categories, minFare]);

  // Validate custom fare inputs
  const handleCustomFareChange = (val) => {
    setCustomFare(val);
    if (parseFloat(val) < parseFloat(minFare)) {
      setFareWarning(`Offer cannot be lower than the minimum fare of ₹${minFare}`);
    } else {
      setFareWarning('');
    }
  };

  // Draw route polyline if both coordinates are active
  useEffect(() => {
    const mapIframe = document.getElementById('map-iframe');
    if (mapIframe && mapIframe.contentWindow && pickupCoords && dropoffCoords) {
      mapIframe.contentWindow.postMessage({
        type: 'DRAW_ROUTE',
        startLat: pickupCoords.lat,
        startLng: pickupCoords.lng,
        endLat: dropoffCoords.lat,
        endLng: dropoffCoords.lng,
        startName: pickup,
        endName: dropoff
      }, '*');
    }
  }, [pickupCoords, dropoffCoords, pickup, dropoff]);

  // Animate car when ride accepted
  useEffect(() => {
    if (rideAccepted && pickupCoords && dropoffCoords) {
      const mapIframe = document.getElementById('map-iframe');
      if (mapIframe && mapIframe.contentWindow) {
        mapIframe.contentWindow.postMessage({
          type: 'ANIMATE_CAR',
          pickup: pickupCoords,
          dropoff: dropoffCoords
        }, '*');
      }
    }
  }, [rideAccepted, pickupCoords, dropoffCoords]);

  // Show "Vehicle Arriving" splash modal when ride transitions to accepted
  useEffect(() => {
    if (rideAccepted && !prevRideAcceptedRef.current) {
      // Just became accepted — fire the splash notification
      setShowVehicleArrivingModal(true);
      if (vehicleArrivingTimerRef.current) clearTimeout(vehicleArrivingTimerRef.current);
      vehicleArrivingTimerRef.current = setTimeout(() => {
        setShowVehicleArrivingModal(false);
      }, 6000);
    }
    prevRideAcceptedRef.current = rideAccepted;
    return () => {
      if (vehicleArrivingTimerRef.current) clearTimeout(vehicleArrivingTimerRef.current);
    };
  }, [rideAccepted]);

  // Poll status of the ride request once created
  useEffect(() => {
    if (!activeRide) return;

    const pollStatus = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/rides/${activeRide.id}/status`);
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'Accepted' || data.status === 'Arrived') {
            setActiveRide(data);
            setIsSearching(false);
            setRideAccepted(true);
          } else if (data.status === 'Searching') {
            // Driver cancelled acceptance, reset passenger side back to searching mode!
            if (rideAccepted) {
              alert('The driver cancelled the acceptance. Searching for another driver...');
            }
            setActiveRide(data);
            setIsSearching(true);
            setRideAccepted(false);
          } else if (data.status === 'Completed') {
            setActiveRide(data);
            setShowRating(true);
            setIsSearching(false);
            setRideAccepted(false);
            fetchWallet();
          }
        }
      } catch (err) {
        console.error("Error polling ride status:", err);
      }
    };

    const interval = setInterval(pollStatus, 2000);
    return () => clearInterval(interval);
  }, [activeRide, rideAccepted]);

  // --- Hybrid Location Search: Local list + OpenStreetMap Nominatim Geocoding ---
  const [nominatimResults, setNominatimResults] = useState([]);
  const [isGeoSearching, setIsGeoSearching] = useState(false);
  const nominatimTimerRef = useRef(null);

  // Debounced Nominatim geocoding search for locations not in local list
  const searchNominatim = (query) => {
    if (nominatimTimerRef.current) clearTimeout(nominatimTimerRef.current);
    if (!query || query.trim().length < 3) {
      setNominatimResults([]);
      return;
    }
    nominatimTimerRef.current = setTimeout(async () => {
      setIsGeoSearching(true);
      try {
        const url = `${API_BASE}/api/geocode?q=${encodeURIComponent(query)}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const mapped = data.map(item => ({
              name: item.display_name.replace(/, India$/i, ''),
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              isGeoResult: true
            }));
            setNominatimResults(mapped);
          }
        }
      } catch (err) {
        console.error('Nominatim proxy geocoding error:', err);
      } finally {
        setIsGeoSearching(false);
      }
    }, 400);
  };

  const handleUseCurrentLocation = (setType) => {
    if (navigator.geolocation) {
      if (setType === 'pickup') setPickup('Locating...');
      else setDropoff('Locating...');
      
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          if (res.ok) {
            const data = await res.json();
            const placeName = data.display_name.replace(/, India$/i, '');
            if (setType === 'pickup') {
              setPickup(placeName);
              setPickupCoords({ lat: latitude, lng: longitude });
              setPickupFocused(false);
            } else {
              setDropoff(placeName);
              setDropoffCoords({ lat: latitude, lng: longitude });
              setDropoffFocused(false);
            }
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error);
          if (setType === 'pickup') setPickup('');
          else setDropoff('');
          alert('Could not determine address. Please type it manually.');
        }
      }, (err) => {
        if (setType === 'pickup') setPickup('');
        else setDropoff('');
        alert('Location access denied. Please type your location manually.');
      });
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const getFilteredLocations = (input) => {
    try {
      const validDynamic = Array.isArray(dynamicLocations) ? dynamicLocations : [];
      const allLocations = [...KERALA_LOCATIONS, ...validDynamic].filter(loc => loc && typeof loc.name === 'string');
      
      const uniqueLocations = Array.from(new Map(allLocations.map(item => [item.name, item])).values());
      
      if (!input) return uniqueLocations;
      const lower = String(input).toLowerCase();
      
      const filtered = uniqueLocations.filter(loc =>
        loc.name.toLowerCase().includes(lower)
      );
      
      if (filtered.length >= 3) {
        return [...filtered, ...(Array.isArray(nominatimResults) ? nominatimResults : []).filter(nr => !filtered.some(f => Math.abs((f.lat || 0) - (nr.lat || 0)) < 0.005 && Math.abs((f.lng || 0) - (nr.lng || 0)) < 0.005))];
      }
      return [...filtered, ...(Array.isArray(nominatimResults) ? nominatimResults : [])];
    } catch (err) {
      console.error("Error filtering locations:", err);
      const fallbackLower = String(input || '').toLowerCase();
      return KERALA_LOCATIONS.filter(loc => loc.name && loc.name.toLowerCase().includes(fallbackLower));
    }
  };

  const handleBookRide = async () => {
    if (!pickup || !dropoff) {
      alert('Please select both pickup and drop-off locations!');
      return;
    }

    if (parseFloat(customFare) < parseFloat(minFare)) {
      alert(`Your offered fare cannot be less than the minimum vehicle fare of ₹${minFare}!`);
      return;
    }

    if (isPreBookToggle) {
      if (!preBookDate || !preBookTime) {
        alert('Please select both date and time for pre-booking!');
        return;
      }
      const selectedDateTime = new Date(`${preBookDate}T${preBookTime}`);
      if (selectedDateTime <= new Date()) {
        alert('Please select a future date and time for pre-booking!');
        return;
      }
    }

    try {
      if (!isPreBookToggle) {
        setIsSearching(true);
      }

      // Save custom locations to backend mapping
      if (pickupCoords && pickup && pickup !== 'Current Location' && !pickup.match(/^[0-9.-]+,\s*[0-9.-]+$/)) {
        fetch(`${API_BASE}/api/locations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: pickup, lat: pickupCoords.lat, lng: pickupCoords.lng })
        }).catch(() => {});
      }
      if (dropoffCoords && dropoff && dropoff !== 'Current Location' && !dropoff.match(/^[0-9.-]+,\s*[0-9.-]+$/)) {
        fetch(`${API_BASE}/api/locations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: dropoff, lat: dropoffCoords.lat, lng: dropoffCoords.lng })
        }).catch(() => {});
      }

      const response = await fetch(`${API_BASE}/api/rides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pickup,
          dropoff,
          fare: parseFloat(customFare).toFixed(2),
          passengerName: localStorage.getItem('passengerName') || 'Passenger',
          passengerEmail: localStorage.getItem('passengerEmail'),
          pickupCoords,
          dropoffCoords,
          isPreBooked: isPreBookToggle,
          preBookDate: isPreBookToggle ? preBookDate : null,
          preBookTime: isPreBookToggle ? preBookTime : null,
          withPet
        })
      });

      if (response.ok) {
        const ride = await response.json();
        if (isPreBookToggle) {
          alert(`Your ride has been pre-booked successfully for ${preBookDate} at ${preBookTime}! Drivers within 20 KM have been notified.`);
          // Reset booking offer panel inputs
          setPickup('');
          setDropoff('');
          setPickupCoords(null);
          setDropoffCoords(null);
          setIsPreBookToggle(false);
          setPreBookDate('');
          setPreBookTime('');
          fetchPreBookedRides();
        } else {
          setActiveRide(ride);
        }
      } else {
        alert('Booking service failed.');
        setIsSearching(false);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to operations booking endpoint.');
      setIsSearching(false);
    }
  };

  const handleCancelBooking = async () => {
    if (activeRide && activeRide.id) {
      try {
        await fetch(`${API_BASE}/api/rides/${activeRide.id}/passenger-cancel`, {
          method: 'POST'
        });
      } catch (err) {
        console.error("Error cancelling ride on backend:", err);
      }
    }

    setIsSearching(false);
    setRideAccepted(false);
    setActiveRide(null);
    setPickup('');
    setDropoff('');
    setPickupCoords(null);
    setDropoffCoords(null);

    const mapIframe = document.getElementById('map-iframe');
    if (mapIframe && mapIframe.contentWindow) {
      mapIframe.contentWindow.postMessage({ type: 'RESET_MAP' }, '*');
    }
  };

  const handleDismissNotification = async () => {
    if (!activeRide) return;
    try {
      await fetch(`${API_BASE}/api/rides/${activeRide.id}/dismiss-notification`, {
        method: 'POST'
      });
      // Update local state to immediately hide it
      setActiveRide(prev => prev ? { ...prev, pendingPassengerNotification: false } : prev);
    } catch (err) {
      console.error("Failed to dismiss notification", err);
    }
  };

  const handleSubmitRating = async () => {
    if (!activeRide) return;
    try {
      await fetch(`${API_BASE}/api/rides/${activeRide.id}/rate-driver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating: ratingValue,
          comment: ratingComment
        })
      });
    } catch (err) {
      console.error("Failed to submit driver rating:", err);
    }

    alert('Thank you for rating your partner driver!');
    setActiveRide(null);
    setIsSearching(false);
    setRideAccepted(false);
    setPickup('');
    setDropoff('');
    setPickupCoords(null);
    setDropoffCoords(null);
    setShowRating(false);
    setRatingValue(5);
    setRatingComment('');

    const mapIframe = document.getElementById('map-iframe');
    if (mapIframe && mapIframe.contentWindow) {
      mapIframe.contentWindow.postMessage({ type: 'RESET_MAP' }, '*');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('passengerAuthenticated');
    localStorage.removeItem('passengerEmail');
    localStorage.removeItem('passengerName');
    localStorage.removeItem('passengerProfilePic');
    localStorage.removeItem('passengerVerificationCode');
    navigate('/passenger/login');
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container container">
        <div className="dashboard-sidebar glass-card" style={{ zIndex: 10 }}>
          
          {/* Passenger Header & Profile Picture */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '14px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Passenger Avatar */}
              <div style={{ position: 'relative', width: '48px', height: '48px', flexShrink: 0 }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)', background: '#121624' }}>
                  {passengerProfilePic ? (
                    <img src={passengerProfilePic} alt="Passenger Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold', fontSize: '18px' }}>
                      <User size={22} />
                    </div>
                  )}
                </div>
                <label 
                  title="Change Profile Picture"
                  style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: 'var(--primary)', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', border: '2px solid var(--bg-card)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                >
                  <Camera size={10} />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleUploadPassengerProfilePic(e.target.files[0])} 
                    style={{ display: 'none' }} 
                  />
                </label>
              </div>

              <div>
                <h2 style={{ margin: 0, fontSize: '18px' }}>{localStorage.getItem('passengerName') || 'Passenger'}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#f59e0b', fontWeight: 'bold', marginTop: '2px' }}>
                  <span>★ {passengerRating.toFixed(1)} Rating</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>• HUM Customer Profile</span>
                </div>
                {localStorage.getItem('passengerVerificationCode') && (
                  <div style={{ marginTop: '4px', fontSize: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#3b82f6', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', fontWeight: 'bold' }}>
                    Customer ID: {localStorage.getItem('passengerVerificationCode')}
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={handleLogout}
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', flexShrink: 0 }}
              title="Logout"
            >
              <LogOut size={16} /> <span className="hide-on-mobile">Logout</span>
            </button>
          </div>

          {/* Passenger Wallet Overview Widget */}
          <div className="driver-status" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '14px', marginBottom: '14px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', margin: 0 }}>
              <Wallet size={18} color="var(--primary)" /> Passenger Wallet
            </h2>
            <div className="stats-grid" style={{ marginTop: '8px', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%' }}>
              <div className="stat-card" style={{ padding: '10px' }}>
                <span className="stat-label" style={{ fontSize: '10px' }}>Total Cash Spent</span>
                <span className="stat-value" style={{ fontSize: '15px' }}>₹{parseFloat(wallet.totalSpent || 0).toFixed(2)}</span>
              </div>
              <div className="stat-card" style={{ padding: '10px' }}>
                <span className="stat-label" style={{ fontSize: '10px' }}>GST Tax Paid (5%)</span>
                <span className="stat-value" style={{ fontSize: '15px', color: '#f59e0b' }}>₹{parseFloat(wallet.taxPaid || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Scheduled / Pre-booked Rides Section */}
          {preBookedRides.length > 0 && (
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '14px', marginBottom: '14px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', margin: '0 0 10px 0', color: 'var(--primary)' }}>
                📅 Scheduled Rides ({preBookedRides.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                {preBookedRides.map(ride => (
                  <div key={ride.id} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '10px', background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <span>{ride.preBookDate} • {ride.preBookTime}</span>
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: ride.status === 'Accepted' ? '#10b981' : '#fbbf24',
                        background: ride.status === 'Accepted' ? 'rgba(16,185,129,0.1)' : 'rgba(251,191,36,0.1)',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontSize: '9px'
                      }}>
                        {ride.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      📍 From: {ride.pickup.split(',')[0]}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginTop: '2px' }}>
                      🏁 To: {ride.dropoff.split(',')[0]}
                    </div>
                    <div style={{ fontSize: '11px', marginTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Fare: <strong>₹{ride.fare}</strong></span>
                      {ride.status === 'Accepted' ? (
                        <span style={{ fontSize: '10px', color: '#10b981', fontWeight: '800' }}>
                          Driver: {ride.driverName}
                        </span>
                      ) : (
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Waiting for driver (&lt;20km)</span>
                      )}
                    </div>
                    {/* Cancel button */}
                    <button 
                      onClick={() => handleCancelPrebookedRide(ride.id)}
                      style={{ position: 'absolute', top: '6px', right: '8px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '11px' }}
                      title="Cancel Pre-booked Ride"
                    >
                      ✕ Cancel
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STATE 4: Rating Panel Screen (Shows after ride completion) */}
          {showRating && activeRide && (
            <div className="accepted-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', color: '#f59e0b' }}>
                <CheckCircle size={28} />
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Ride Concluded!</h2>
              </div>

              {/* Payment Summary */}
              <div style={{ padding: '16px', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '14px', background: 'rgba(59, 130, 246, 0.04)', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', margin: 0, color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  Trip Fare Receipt
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Distance Travelled:</span>
                  <span style={{ fontWeight: 'bold' }}>{activeRide.totalKm || 8.0} KM</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Rate per KM:</span>
                  <span>₹15.00</span>
                </div>
                <div style={{ borderTop: '1px dashed var(--border)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Kilometers Fare:</span>
                  <span>₹{parseFloat(activeRide.fare || 0).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#f59e0b' }}>
                  <span style={{ color: 'var(--text-muted)' }}>GST Tax (5%):</span>
                  <span>+₹{parseFloat(activeRide.gst || 0).toFixed(2)}</span>
                </div>
                <div style={{ borderTop: '1px solid rgba(59, 130, 246, 0.3)', margin: '4px 0', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px', color: 'var(--text-main)' }}>
                  <span>Total Paid ({activeRide.paymentType === 'cash' ? '💵 Cash' : '💳 Prepaid'}):</span>
                  <span>₹{parseFloat(activeRide.totalCollected || 0).toFixed(2)}</span>
                </div>
              </div>
              
              <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.03)', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', margin: 0 }}>Rate your driver's behaviour</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                  How was your trip with **{activeRide.driverName || 'Rajesh Kumar'}**?
                </p>

                {/* Star Rating Selectors */}
                <div style={{ display: 'flex', gap: '10px', margin: '8px 0' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingValue(star)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', transition: 'transform 0.1s' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <span style={{ fontSize: '32px', color: star <= ratingValue ? '#f59e0b' : 'var(--border)' }}>★</span>
                    </button>
                  ))}
                </div>

                <div className="input-group" style={{ width: '100%', margin: 0 }}>
                  <textarea
                    className="input-field"
                    placeholder="Describe their behaviour or add comments (optional)..."
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                    rows="3"
                    style={{ width: '100%', resize: 'none', padding: '10px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <Button variant="primary" className="full-width" onClick={handleSubmitRating}>
                Submit Star Feedback
              </Button>
            </div>
          )}

          {/* STATE 1: Booking Input & Tier Selection */}
          {!isSearching && !rideAccepted && !showRating && (
            <>
              <h2>Book a Ride</h2>

              {/* Pickup Field */}
              <div className="input-group" style={{ position: 'relative' }}>
                <div className="input-icon"><MapPin size={18} /></div>
                <input 
                  type="text" 
                  className="input-field with-icon" 
                  placeholder="Enter pickup location" 
                  value={pickup}
                  onChange={(e) => { setPickup(e.target.value); searchNominatim(e.target.value); }}
                  onFocus={() => setPickupFocused(true)}
                  onBlur={() => setTimeout(() => setPickupFocused(false), 250)}
                />
                {pickupFocused && (
                  <div className="autocomplete-dropdown glass-card">
                    {/* USE CURRENT LOCATION BUTTON */}
                    <div 
                      onMouseDown={() => handleUseCurrentLocation('pickup')}
                      className="dropdown-item" 
                      style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <Navigation2 size={16} style={{ marginRight: '8px' }} />
                      📍 Use My Current Location
                    </div>

                    {isGeoSearching && (
                      <div className="dropdown-item" style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '14px', height: '14px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                        Searching all Kerala locations...
                      </div>
                    )}
                    {getFilteredLocations(pickup).map((loc, idx) => (
                      <div 
                        onMouseDown={() => {
                          setPickup(loc.name);
                          setPickupCoords({ lat: loc.lat, lng: loc.lng });
                        }}
                        key={idx} 
                        className="dropdown-item" 
                      >
                        {loc.isGeoResult ? (
                          <span style={{ marginRight: '8px', fontSize: '14px' }}>🌐</span>
                        ) : (
                          <MapPin size={14} style={{ marginRight: '8px', color: 'var(--primary)' }} />
                        )}
                        {loc.name}
                      </div>
                    ))}
                    {!isGeoSearching && pickup.trim().length >= 3 && getFilteredLocations(pickup).length === 0 && (
                      <div className="dropdown-item" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                        No locations found. Try a different spelling.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Dropoff Field */}
              <div className="input-group" style={{ position: 'relative' }}>
                <div className="input-icon"><Navigation size={18} /></div>
                <input 
                  type="text" 
                  className="input-field with-icon" 
                  placeholder="Enter drop-off destination" 
                  value={dropoff}
                  onChange={(e) => { setDropoff(e.target.value); searchNominatim(e.target.value); }}
                  onFocus={() => setDropoffFocused(true)}
                  onBlur={() => setTimeout(() => setDropoffFocused(false), 250)}
                />
                {dropoffFocused && (
                  <div className="autocomplete-dropdown glass-card">
                    {/* USE CURRENT LOCATION BUTTON */}
                    <div 
                      onMouseDown={() => handleUseCurrentLocation('dropoff')}
                      className="dropdown-item" 
                      style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <Navigation2 size={16} style={{ marginRight: '8px' }} />
                      📍 Use My Current Location
                    </div>

                    {isGeoSearching && (
                      <div className="dropdown-item" style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '14px', height: '14px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                        Searching all Kerala locations...
                      </div>
                    )}
                    {getFilteredLocations(dropoff).map((loc, idx) => (
                      <div 
                        onMouseDown={() => {
                          setDropoff(loc.name);
                          setDropoffCoords({ lat: loc.lat, lng: loc.lng });
                        }}
                        key={idx} 
                        className="dropdown-item" 
                      >
                        {loc.isGeoResult ? (
                          <span style={{ marginRight: '8px', fontSize: '14px' }}>🌐</span>
                        ) : (
                          <Navigation size={14} style={{ marginRight: '8px', color: 'var(--secondary)' }} />
                        )}
                        {loc.name}
                      </div>
                    ))}
                    {!isGeoSearching && dropoff.trim().length >= 3 && getFilteredLocations(dropoff).length === 0 && (
                      <div className="dropdown-item" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                        No locations found. Try a different spelling.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Calculated Route Distance & Estimated Duration Card */}
              {pickup && dropoff && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(59, 130, 246, 0.1))',
                  border: '1.5px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '14px',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                }} className="animate-fade-in">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Navigation2 size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Calculated Route Distance
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '900', color: '#10b981', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        {tripDistance} <span style={{ fontSize: '12px', color: 'var(--text-main)', fontWeight: '700' }}>Kilometers (KM)</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>Estimated Travel Time</div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#38bdf8' }}>
                      ~{(Math.max(5, Math.round(tripDistance * 2.2)) / 60).toFixed(1)} Hours
                    </div>
                  </div>
                </div>
              )}

              {/* Intercity Ride Badge Notice */}
              {isIntercity && (
                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  marginBottom: '14px'
                }} className="animate-fade-in">
                  <Map size={20} color="#d97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ margin: '0 0 2px 0', fontSize: '13px', color: '#d97706', fontWeight: '800' }}>Intercity Long-Distance Trip ({tripDistance} KM)</h4>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      Rides greater than 35 KM are processed as intercity. A **₹250.00 driver premium** has been added to the base rate.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Dynamic Tier Options */}
              <div className="ride-options">
                {categories.map((cat) => (
                  <div 
                    key={cat.id}
                    className={`ride-option ${selectedTier === cat.name ? 'active' : ''}`}
                    onClick={() => setSelectedTier(cat.name)}
                  >
                    <Car size={24} />
                    <div className="ride-details">
                      <span className="ride-type">{cat.name}</span>
                      <span className="ride-eta">Max: {cat.maxPassengers} Pass · ₹{cat.ratePerKm || 15}/KM</span>
                    </div>
                    <span className="ride-price">₹{calculateCategoryFare(cat)}</span>
                  </div>
                ))}
              </div>

              {/* Custom Bidding Offer Fare Input */}
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>Your Offered Price (INR)</label>
                <div className="input-group">
                  <div className="input-icon" style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>INR</div>
                  <input 
                    type="number" 
                    className="input-field with-icon" 
                    placeholder="Enter your price" 
                    value={customFare}
                    onChange={(e) => handleCustomFareChange(e.target.value)}
                    style={{ fontSize: '15px', fontWeight: '700', color: 'var(--primary)' }}
                  />
                </div>

                {/* GST Itemized Breakdown Receipt */}
                <div style={{ marginTop: '6px', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.01)', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Your Offered Price:</span>
                    <strong>INR {parseFloat(customFare || 0).toFixed(2)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f59e0b' }}>
                    <span>GST Tax Surcharge (5%):</span>
                    <strong>+INR {(parseFloat(customFare || 0) * 0.05).toFixed(2)}</strong>
                  </div>
                  <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '4px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>Total Cash Payable:</span>
                    <strong style={{ color: 'var(--primary)' }}>INR {(parseFloat(customFare || 0) * 1.05).toFixed(2)}</strong>
                  </div>
                </div>

                {fareWarning ? (
                  <span style={{ fontSize: '11px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <AlertCircle size={12} /> {fareWarning}
                  </span>
                ) : (
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Minimum suggested vehicle price: <strong>INR {minFare}</strong>
                  </span>
                )}
              </div>

              {/* Pre-booking toggle and date/time selector */}
              <div style={{
                marginTop: '12px',
                padding: '12px',
                border: '1px dashed var(--primary)',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    id="prebook-toggle" 
                    checked={isPreBookToggle} 
                    onChange={(e) => setIsPreBookToggle(e.target.checked)} 
                    style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                  />
                  <label htmlFor="prebook-toggle" style={{ fontSize: '13px', fontWeight: '700', cursor: 'pointer', color: 'var(--text-main)' }}>
                    📅 Pre-book for another date
                  </label>
                </div>
                
                {isPreBookToggle && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                    
                    {/* Modern Calendar Date Selector */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          📅 Select Departure Date
                        </span>
                        {preBookDate && (
                          <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700' }}>
                            Selected: {new Date(preBookDate).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>

                      {/* Quick Date Cards Carousel / Grid */}
                      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                        {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
                          const d = new Date();
                          d.setDate(d.getDate() + dayOffset);
                          const isoDate = d.toISOString().split('T')[0];
                          const dayName = dayOffset === 0 ? 'Today' : dayOffset === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short' });
                          const dateNum = d.getDate();
                          const monthName = d.toLocaleDateString('en-IN', { month: 'short' });
                          const isSelected = preBookDate === isoDate;

                          return (
                            <button
                              key={isoDate}
                              type="button"
                              onClick={() => setPreBookDate(isoDate)}
                              style={{
                                flex: '0 0 auto',
                                width: '68px',
                                padding: '8px 4px',
                                borderRadius: '12px',
                                border: isSelected ? '2px solid #10b981' : '1px solid var(--border)',
                                background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                                color: isSelected ? '#10b981' : 'var(--text-main)',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '2px',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <span style={{ fontSize: '10px', fontWeight: '700', opacity: 0.8 }}>{dayName}</span>
                              <span style={{ fontSize: '16px', fontWeight: '900' }}>{dateNum}</span>
                              <span style={{ fontSize: '9px', opacity: 0.7 }}>{monthName}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Fallback Custom Date Picker Input */}
                      <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Or pick custom date:</span>
                        <input 
                          type="date" 
                          value={preBookDate} 
                          onChange={(e) => setPreBookDate(e.target.value)} 
                          min={new Date().toISOString().split('T')[0]}
                          style={{ padding: '4px 8px', border: '1px solid var(--border)', borderRadius: '6px', background: '#121624', color: 'white', fontSize: '11px' }}
                        />
                      </div>
                    </div>

                    {/* Modern Time Slot Picker Selector */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          ⏰ Select Departure Time
                        </span>
                        {preBookTime && (
                          <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '700' }}>
                            Time: {preBookTime}
                          </span>
                        )}
                      </div>

                      {/* Quick Time Slots Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', maxHeight: '120px', overflowY: 'auto', paddingRight: '2px' }}>
                        {[
                          '06:00', '07:00', '08:00', '08:30',
                          '09:00', '09:30', '10:00', '10:30',
                          '11:00', '12:00', '13:00', '14:00',
                          '15:00', '16:00', '17:00', '17:30',
                          '18:00', '18:30', '19:00', '19:30',
                          '20:00', '21:00', '22:00', '23:00'
                        ].map((slot) => {
                          const isSelected = preBookTime === slot;
                          // format 12 hour string
                          const [h, m] = slot.split(':');
                          const hourNum = parseInt(h);
                          const ampm = hourNum >= 12 ? 'PM' : 'AM';
                          const displayHour = hourNum % 12 || 12;
                          const label = `${displayHour}:${m} ${ampm}`;

                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setPreBookTime(slot)}
                              style={{
                                padding: '6px 2px',
                                borderRadius: '8px',
                                border: isSelected ? '1.5px solid #38bdf8' : '1px solid var(--border)',
                                background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                                color: isSelected ? '#38bdf8' : 'var(--text-main)',
                                fontSize: '10.5px',
                                fontWeight: isSelected ? '800' : '600',
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Precise Time Picker Input */}
                      <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Or enter exact time:</span>
                        <input 
                          type="time" 
                          value={preBookTime} 
                          onChange={(e) => setPreBookTime(e.target.value)} 
                          style={{ padding: '4px 8px', border: '1px solid var(--border)', borderRadius: '6px', background: '#121624', color: 'white', fontSize: '11px' }}
                        />
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {pickupCoords && (
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Button 
                    variant="outline" 
                    className="full-width" 
                    style={{ borderColor: '#38bdf8', color: '#38bdf8' }}
                    onClick={async () => {
                      try {
                        const res = await fetch(`${API_BASE}/api/drivers/nearby?lat=${pickupCoords.lat}&lng=${pickupCoords.lng}`);
                        const drivers = await res.json();
                        if (drivers.length > 0) {
                          alert(`Found ${drivers.length} online drivers nearby!\nClosest is ${drivers[0].distance} KM away (${drivers[0].vehicleType}).`);
                        } else {
                          alert("No online drivers found nearby at the moment.");
                        }
                      } catch (e) {
                        alert("Error scanning for drivers.");
                      }
                    }}
                  >
                    <Compass size={16} style={{ marginRight: '6px' }} /> Scan for Nearest Drivers
                  </Button>
                </div>
              )}

              <div style={{ marginTop: '14px', background: 'var(--bg-card)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  checked={withPet} 
                  onChange={(e) => setWithPet(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                />
                <label style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', color: 'var(--text-main)', margin: 0 }} onClick={() => setWithPet(!withPet)}>
                  🐾 I am traveling with a pet
                </label>
              </div>

              <Button variant="primary" className="full-width" onClick={handleBookRide} style={{ marginTop: '14px' }}>
                Confirm Booking offer
              </Button>
            </>
          )}

          {/* STATE 2: Searching for Driver */}
          {isSearching && !rideAccepted && !showRating && (
            <div className="searching-panel text-center animate-fade-in" style={{ padding: '30px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div className="request-pulse" style={{ margin: '0 auto' }}></div>
              <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Searching for Nearby Drivers...</h2>
              {isIntercity && (
                <span style={{ background: '#f59e0b', color: 'black', fontWeight: 'bold', fontSize: '11px', padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase' }}>
                  Intercity Trip Active
                </span>
              )}
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                Connecting with drivers near <strong>{pickup.split(',')[0]}</strong>. Please hold on.
              </p>
              <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', width: '100%', background: 'rgba(0,0,0,0.01)', textAlign: 'left' }}>
                <div style={{ fontSize: '13px', marginBottom: '6px' }}><strong>Your Offered Price:</strong> INR {parseFloat(customFare).toFixed(2)}</div>
                <div style={{ fontSize: '13px', marginBottom: '6px', color: '#f59e0b' }}><strong>GST Surcharge (5%):</strong> INR {(parseFloat(customFare) * 0.05).toFixed(2)}</div>
                <div style={{ fontSize: '13px', marginBottom: '6px', fontWeight: '700' }}><strong>Total Cash Due:</strong> INR {(parseFloat(customFare) * 1.05).toFixed(2)}</div>
                <div style={{ fontSize: '13px' }}><strong>To:</strong> {dropoff.split(',')[0]}</div>
              </div>
              <Button variant="outline" className="full-width" onClick={handleCancelBooking} style={{ color: '#ef4444', borderColor: '#ef4444' }}>
                Cancel Booking Request
              </Button>
            </div>
          )}

          {/* STATE 3: Ride Accepted & Vehicle Arriving Details */}
          {rideAccepted && activeRide && !showRating && (
            <div className="accepted-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {activeRide.pendingPassengerNotification && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: 'bold' }}>
                    <AlertCircle size={20} /> Route Deviation Notice
                  </div>
                  <p style={{ fontSize: '13px', margin: 0, color: 'var(--text-main)' }}>
                    We are moving further than the calculated route. You have travelled extra kilometers. Additional charges will be applied to the final bill.
                  </p>
                  <Button variant="outline" size="sm" onClick={handleDismissNotification} style={{ borderColor: '#ef4444', color: '#ef4444', alignSelf: 'flex-start', margin: 0 }}>
                    Acknowledge
                  </Button>
                </div>
              )}

              {/* Prominent Vehicle Arriving Live Banner */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18), rgba(59, 130, 246, 0.14))',
                border: '1.5px solid rgba(16, 185, 129, 0.5)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.12)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ 
                      width: '38px', 
                      height: '38px', 
                      borderRadius: '12px', 
                      background: '#10b981', 
                      color: '#ffffff', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '0 0 12px rgba(16, 185, 129, 0.5)'
                    }}>
                      <Car size={22} />
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#10b981', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                        🚗 VEHICLE ARRIVING
                      </h2>
                      <span style={{ fontSize: '12px', color: 'var(--text-main)', fontWeight: '600' }}>
                        {activeRide.status === 'Arrived' ? 'Driver has arrived at pickup point!' : 'Driver accepted trip & vehicle is en route'}
                      </span>
                    </div>
                  </div>
                  <span style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    borderRadius: '20px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                    EN ROUTE
                  </span>
                </div>

                {activeRide.status === 'Arrived' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#10b981', color: '#ffffff', borderRadius: '10px', padding: '10px 14px', fontWeight: '800', fontSize: '13px' }}>
                    🔔 Your driver has arrived at {pickup.split(',')[0]}! Please board your vehicle.
                  </div>
                ) : (
                  <div style={{ background: 'rgba(0, 0, 0, 0.2)', borderRadius: '10px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{ fontSize: '12.5px', color: 'var(--text-main)' }}>
                      Pickup: <strong>{pickup.split(',')[0]}</strong>
                    </span>
                    <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '800', background: 'rgba(56, 189, 248, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>
                      ⏱️ ETA: ~2-3 mins
                    </span>
                  </div>
                )}
              </div>

              {activeRide.isIntercity && (
                <span style={{ alignSelf: 'flex-start', background: '#f59e0b', color: 'black', fontWeight: 'bold', fontSize: '11px', padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase' }}>
                  Intercity Trip Approved
                </span>
              )}
              
              {/* Driver and Vehicle Detail Card */}
              <div style={{ border: '1px solid var(--border)', borderRadius: '14px', padding: '16px', background: 'rgba(16, 185, 129, 0.03)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                {/* Vehicle Image Preview */}
                <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.1)' }}>
                  <img 
                    src={resolveVehiclePhoto(activeRide.vehiclePhotos?.front || activeRide.vehiclePhotos?.rear || null, 'front')} 
                    alt="Vehicle view" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '10px', padding: '3px 10px', borderRadius: '20px', fontWeight: 'bold' }}>
                    🚗 Vehicle Photo
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800' }}>{activeRide.driverName || 'Rajesh Kumar'} <span style={{ fontSize: '13px', color: '#f59e0b' }}>★ {activeRide.driverRating || '5.0'}</span></h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>HUM Partner</p>
                  </div>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700' }}>
                    {(activeRide.driverName || 'R').charAt(0)}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <div><strong>Vehicle:</strong> {activeRide.vehicleModel || 'Tata Nexon'}</div>
                  <div><strong>Plate No:</strong> <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{activeRide.vehiclePlate || 'DL 3C AY 4567'}</span></div>
                  <div><strong>Phone:</strong> {activeRide.driverPhone || '+91 98765 43210'}</div>
                  
                  <div style={{ borderTop: '1px dashed var(--border)', marginTop: '6px', paddingTop: '6px', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Fare Price:</span>
                      <span>INR {parseFloat(activeRide.fare || 0).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f59e0b' }}>
                      <span>GST (5%):</span>
                      <span>+INR {parseFloat(activeRide.gst || (parseFloat(activeRide.fare || 0) * 0.05)).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', borderTop: '1px solid var(--border)', paddingTop: '4px' }}>
                      <span>Pay Driver (Cash):</span>
                      <span>INR {parseFloat(activeRide.totalCollected || (parseFloat(activeRide.fare || 0) * 1.05)).toFixed(2)}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* MID-TRIP DESTINATION UPDATE BUTTON */}
              <button
                type="button"
                onClick={() => { setShowUpdateDestModal(true); setNewDestInput(activeRide.dropoff || dropoff); }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1.5px solid #f59e0b',
                  background: 'rgba(245, 158, 11, 0.12)',
                  color: '#f59e0b',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
                }}
              >
                <Navigation size={18} /> 📍 Change / Update Destination
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Button 
                  variant="outline" 
                  style={{ flex: 1, borderColor: '#3b82f6', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} 
                  onClick={() => { setShowInTripChat(true); fetchTripChatMessages(); }}
                >
                  <MessageSquare size={16} /> 💬 Chat with Driver
                </Button>
                <Button variant="outline" style={{ flex: 1 }} onClick={() => alert(`Calling driver at ${activeRide.driverPhone}...`)}>
                  <Phone size={16} /> Call Driver
                </Button>
              </div>

              <Button variant="primary" style={{ width: '100%' }} onClick={handleCancelBooking}>
                End Trip Simulation
              </Button>
              
              <Button 
                variant="primary" 
                style={{ background: '#25D366', color: 'white', borderColor: '#25D366', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} 
                onClick={() => {
                  const text = `Hey! I'm traveling with HUM. Here is my live trip update:\n\n📍 From: ${activeRide.pickup.split(',')[0]}\n🏁 To: ${activeRide.dropoff.split(',')[0]}\n🚗 Vehicle: ${activeRide.vehicleModel || 'Tata Nexon'} (${activeRide.vehiclePlate || 'DL 3C AY 4567'})\n👨 Partner Driver: ${activeRide.driverName || 'Rajesh Kumar'}\n💵 Cash Fare: INR ${(parseFloat(activeRide.fare) * 1.05).toFixed(2)}\n\nFollow my journey live!`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                }}
              >
                <Share2 size={16} /> Share Status on WhatsApp
              </Button>
            </div>
          )}

        </div>
        
        <div className="dashboard-map glass-card animate-fade-in delay-100" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
          <iframe 
            id="map-iframe"
            src="/map.html" 
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: '18px' }}
            title="Interactive Map"
          />

          {/* VEHICLE ARRIVING — persistent green banner pinned to top of map when driver accepts */}
          {rideAccepted && activeRide && !showRating && (
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 500,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.97), rgba(5,150,105,0.97))',
                border: '1.5px solid rgba(255,255,255,0.18)',
                borderRadius: '18px',
                padding: '11px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 8px 32px rgba(16,185,129,0.5), 0 2px 8px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(12px)',
                animation: 'vehicle-arriving-bar 0.5s cubic-bezier(0.34,1.56,0.64,1)',
                whiteSpace: 'nowrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'car-bounce 1s ease-in-out infinite alternate' }}>
                  <Car size={22} color="#ffffff" />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '900', color: '#ffffff', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    🚗 Vehicle Arriving
                  </div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.85)', fontWeight: '600', marginTop: '1px' }}>
                    {activeRide.driverName || 'Driver'} • {activeRide.vehicleModel || 'Vehicle'} • {activeRide.vehiclePlate || '—'}
                  </div>
                </div>
                <div style={{
                  marginLeft: '4px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '20px',
                  padding: '3px 10px',
                  fontSize: '10px',
                  fontWeight: '800',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'pulse 1.2s infinite' }} />
                  LIVE
                </div>
              </div>
            </div>
          )}
          {(isSearching || rideAccepted) && (
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              background: 'rgba(24, 24, 27, 0.9)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '12px 24px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(8px)',
              pointerEvents: 'none',
              textAlign: 'center',
              whiteSpace: 'nowrap'
            }}>
              {rideAccepted ? `Route Active: ${pickup.split(',')[0]} ➔ ${dropoff.split(',')[0]}` : 'Finding Nearest Driver Coordinates...'}
            </div>
          )}
        </div>
      </div>
      {/* ===== VEHICLE ARRIVING SPLASH NOTIFICATION MODAL ===== */}
      {showVehicleArrivingModal && activeRide && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.72)',
            backdropFilter: 'blur(8px)',
            animation: 'fade-in 0.3s ease-out'
          }}
          onClick={() => setShowVehicleArrivingModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(145deg, #0d1f1a, #0a1628)',
              border: '1.5px solid rgba(16,185,129,0.5)',
              borderRadius: '28px',
              padding: '40px 36px',
              maxWidth: '420px',
              width: '90%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              boxShadow: '0 0 80px rgba(16,185,129,0.25), 0 24px 64px rgba(0,0,0,0.6)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              animation: 'vehicle-arriving-modal 0.5s cubic-bezier(0.34,1.56,0.64,1)'
            }}
          >
            {/* Glow Background Effect */}
            <div style={{
              position: 'absolute',
              top: '-60px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(16,185,129,0.35) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            {/* Animated Car Icon */}
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.1))',
              border: '2px solid rgba(16,185,129,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              animation: 'car-pulse-ring 1.5s ease-in-out infinite',
              boxShadow: '0 0 30px rgba(16,185,129,0.3)'
            }}>
              <Car size={42} color="#10b981" />
            </div>

            {/* Title */}
            <div>
              <h2 style={{
                margin: 0,
                fontSize: '28px',
                fontWeight: '900',
                color: '#10b981',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                textShadow: '0 0 20px rgba(16,185,129,0.5)'
              }}>
                🚗 Vehicle Arriving!
              </h2>
              <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>
                Your driver has accepted the ride and is heading to your pickup point.
              </p>
            </div>

            {/* Driver Info Card */}
            <div style={{
              width: '100%',
              background: 'rgba(16,185,129,0.07)',
              border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: '16px',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Driver</span>
                <span style={{ color: '#ffffff', fontWeight: '700' }}>{activeRide.driverName || 'Partner Driver'} <span style={{ color: '#f59e0b' }}>★ {activeRide.driverRating || '5.0'}</span></span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Vehicle</span>
                <span style={{ color: '#ffffff', fontWeight: '700' }}>{activeRide.vehicleModel || 'Vehicle'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Plate No.</span>
                <span style={{ color: '#10b981', fontWeight: '800', fontFamily: 'monospace', fontSize: '14px' }}>{activeRide.vehiclePlate || '—'}</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(16,185,129,0.2)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>ETA to Pickup</span>
                <span style={{ color: '#38bdf8', fontWeight: '800' }}>⏱️ ~2–3 mins</span>
              </div>
            </div>

            {/* Auto-dismiss info + manual close */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>Tap anywhere to dismiss</div>
              <button
                onClick={() => setShowVehicleArrivingModal(false)}
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(16,185,129,0.4)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  letterSpacing: '0.3px'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(16,185,129,0.6)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(16,185,129,0.4)'; }}
              >
                ✓ Got It — View Ride Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IN-TRIP LIVE CHAT MODAL (PASSENGER & DRIVER EXCLUSIVE) */}
      {showInTripChat && activeRide && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '520px', height: '560px', display: 'flex', flexDirection: 'column', padding: '20px', borderRadius: '20px', background: 'var(--bg-card)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Live Trip Chat</h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Chatting with Driver: <strong>{activeRide.driverName || 'Rajesh Kumar'}</strong> ({activeRide.vehiclePlate || 'DL 3C AY 4567'})</span>
                </div>
              </div>
              <button onClick={() => setShowInTripChat(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={22} />
              </button>
            </div>

            {/* Security Notice Pill */}
            <div style={{ margin: '10px 0', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🔒 <strong>In-Trip Active Only:</strong> Phone & contact numbers cannot be shared for safety & privacy.
            </div>

            {/* Error Warning Banner */}
            {tripChatError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '10px', padding: '8px 12px', color: '#ef4444', fontSize: '12px', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={16} /> {tripChatError}
              </div>
            )}

            {/* Chat Thread */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tripChatMessages.length === 0 ? (
                <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  <MessageSquare size={36} style={{ opacity: 0.4, marginBottom: '8px' }} />
                  <p style={{ margin: 0 }}>No messages exchanged yet.</p>
                  <p style={{ margin: 0, fontSize: '11px' }}>Send a message to your driver regarding pickup location or arrival status.</p>
                </div>
              ) : (
                tripChatMessages.map((msg) => {
                  const isMe = msg.role === 'passenger';
                  return (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '82%',
                        background: isMe ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255, 255, 255, 0.08)',
                        color: isMe ? '#ffffff' : 'var(--text-main)',
                        padding: '10px 14px',
                        borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                        fontSize: '13px',
                        border: isMe ? 'none' : '1px solid var(--border)'
                      }}>
                        <div style={{ fontSize: '10px', opacity: 0.8, marginBottom: '2px', fontWeight: '700' }}>
                          {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div>{msg.text}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={sendTripChatMessage} style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Type message to driver..."
                value={tripChatText}
                onChange={(e) => setTripChatText(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', fontSize: '13px' }}
              />
              <Button variant="primary" type="submit" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px' }}>
                <Send size={16} /> Send
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING SUPPORT CHAT BUTTON */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 900 }}>
        <button
          onClick={() => setShowSupportChat(prev => !prev)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), #d97706)',
            color: '#000000',
            border: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s',
            outline: 'none'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title="Contact Support / Forget Something?"
        >
          {showSupportChat ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>

      {/* SUPPORT CHAT WINDOW */}
      {showSupportChat && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '24px',
          width: '360px',
          height: '460px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '20px',
          background: 'var(--bg-card, #121829)',
          border: '1px solid var(--border)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          animation: 'fade-in 0.2s ease-out'
        }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', background: 'linear-gradient(135deg, #1f293d, #111827)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#ffffff' }}>📞 Customer Care Support</h3>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Help & Forgot Item Claims</span>
            </div>
            <button onClick={() => setShowSupportChat(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          {/* Quick Support Claim Suggestion */}
          <div style={{ padding: '8px 12px', background: 'rgba(245, 158, 11, 0.05)', borderBottom: '1px solid var(--border)', fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            💡 <strong>Forget something in a ride?</strong> Type details like vehicle plate number, model, driver name, and what you lost to help Customer Care track it down.
          </div>

          {/* Messages list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(0,0,0,0.1)' }}>
            {supportMessages.length === 0 ? (
              <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', padding: '20px' }}>
                <MessageSquare size={32} style={{ opacity: 0.3, marginBottom: '6px' }} />
                <p style={{ margin: 0 }}>Start a chat with Customer Care.</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '10px' }}>We will help retrieve any lost or forgotten items.</p>
              </div>
            ) : (
              supportMessages.map((msg) => {
                const isCare = msg.sender.includes('Care');
                return (
                  <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isCare ? 'flex-start' : 'flex-end' }}>
                    <div style={{
                      maxWidth: '85%',
                      background: isCare ? 'rgba(255,255,255,0.06)' : 'var(--primary)',
                      color: isCare ? 'var(--text-main)' : '#000000',
                      padding: '8px 12px',
                      borderRadius: isCare ? '14px 14px 14px 2px' : '14px 14px 2px 14px',
                      fontSize: '12.5px',
                      border: isCare ? '1px solid var(--border)' : 'none'
                    }}>
                      <div style={{ fontSize: '9px', opacity: 0.7, marginBottom: '2px', fontWeight: '700' }}>
                        {msg.sender} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div>{msg.text}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input field */}
          <form onSubmit={handleSendSupportMessage} style={{ display: 'flex', gap: '8px', padding: '10px 14px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Type message to Customer Care..."
              value={supportText}
              onChange={(e) => setSupportText(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', fontSize: '12px' }}
            />
            <Button variant="primary" type="submit" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', fontSize: '12px' }}>
              <Send size={14} /> Send
            </Button>
          </form>
        </div>
      )}

      {/* MID-TRIP CHANGE / UPDATE DESTINATION MODAL DIALOG */}
      {showUpdateDestModal && activeRide && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }} className="animate-fade-in">
          <div style={{
            background: 'var(--bg-card, #121624)',
            border: '1.5px solid #f59e0b',
            borderRadius: '20px',
            maxWidth: '460px',
            width: '100%',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 12px 32px rgba(245, 158, 11, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Navigation size={22} color="#f59e0b" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#f59e0b' }}>Change Trip Destination</h3>
              </div>
              <button 
                onClick={() => setShowUpdateDestModal(false)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Enter or select a new drop-off location in Kerala. The route kilometers and fare will be automatically updated for your driver.
            </p>

            <form onSubmit={handleUpdateDestination} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ position: 'relative' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  New Drop-off Location
                </label>
                <div className="input-group">
                  <div className="input-icon"><Navigation size={18} color="#f59e0b" /></div>
                  <input
                    type="text"
                    className="input-field with-icon"
                    placeholder="Search or enter new Kerala local area / landmark..."
                    value={newDestInput}
                    onChange={(e) => { setNewDestInput(e.target.value); setNewDestCoords(null); searchNominatim(e.target.value); }}
                    onFocus={() => setNewDestFocused(true)}
                    onBlur={() => setTimeout(() => setNewDestFocused(false), 250)}
                    required
                  />
                </div>

                {/* Kerala Location Suggestions Dropdown with Geocoding */}
                {newDestFocused && (
                  <div className="location-dropdown" style={{ zIndex: 1100, maxHeight: '180px', overflowY: 'auto' }}>
                    {isGeoSearching && (
                      <div className="dropdown-item" style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '14px', height: '14px', border: '2px solid #f59e0b', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                        Searching locations...
                      </div>
                    )}
                    {getFilteredLocations(newDestInput).map((loc, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => {
                          setNewDestInput(loc.name);
                          setNewDestCoords({ lat: loc.lat, lng: loc.lng });
                          setNewDestFocused(false);
                        }} 
                        className="dropdown-item" 
                      >
                        {loc.isGeoResult ? (
                          <span style={{ marginRight: '8px', fontSize: '14px' }}>🌐</span>
                        ) : (
                          <Navigation size={14} style={{ marginRight: '8px', color: '#f59e0b' }} />
                        )}
                        {loc.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '11px', color: 'var(--text-muted)' }}>
                📍 Current Destination: <strong>{activeRide.dropoff}</strong>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                <Button 
                  variant="outline" 
                  type="button" 
                  style={{ flex: 1 }} 
                  onClick={() => setShowUpdateDestModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  type="submit" 
                  style={{ flex: 1, background: '#f59e0b', color: '#000', fontWeight: '800', borderColor: '#f59e0b' }}
                  disabled={isSubmittingDestUpdate}
                >
                  {isSubmittingDestUpdate ? 'Updating Route...' : 'Confirm New Location'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerDashboard;
