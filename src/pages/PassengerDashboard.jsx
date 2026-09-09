import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Navigation, Car, AlertCircle, AlertTriangle, Phone, CheckCircle, IndianRupee, Wallet, Map, Share2, Camera, User, MessageSquare, MessageCircle, Send, X, Navigation2, LogOut, Compass , Search, Menu, Settings, Home, Briefcase, Sun, Moon } from 'lucide-react';
import Button from '../components/Button';
import './Dashboard.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://humfleet.xyz';


const KERALA_LOCATIONS = [
  // --- 0. MAJOR SOUTH INDIA HUBS ---
  { name: "Chennai Central Railway Station, Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  { name: "T. Nagar, Chennai, Tamil Nadu", lat: 13.0396, lng: 80.2335 },
  { name: "Anna Nagar, Chennai, Tamil Nadu", lat: 13.0847, lng: 80.2185 },
  { name: "Velachery, Chennai, Tamil Nadu", lat: 12.9806, lng: 80.2227 },
  { name: "Kempegowda International Airport (BLR), Bengaluru, Karnataka", lat: 13.1986, lng: 77.7066 },
  { name: "Koramangala, Bengaluru, Karnataka", lat: 12.9352, lng: 77.6245 },
  { name: "Indiranagar, Bengaluru, Karnataka", lat: 12.9784, lng: 77.6408 },
  { name: "Whitefield, Bengaluru, Karnataka", lat: 12.9698, lng: 77.7499 },
  { name: "Majestic Bus Station, Bengaluru, Karnataka", lat: 12.9779, lng: 77.5738 },
  { name: "Rajiv Gandhi International Airport (HYD), Hyderabad", lat: 17.2403, lng: 78.4294 },
  { name: "Banjara Hills, Hyderabad, Telangana", lat: 17.4173, lng: 78.4395 },
  { name: "HITECH City, Hyderabad, Telangana", lat: 17.4474, lng: 78.3762 },
  { name: "Coimbatore Junction Railway Station, Tamil Nadu", lat: 10.9942, lng: 76.9657 },
  { name: "Madurai Meenakshi Temple, Tamil Nadu", lat: 9.9195, lng: 78.1193 },
  { name: "Mysuru Palace, Karnataka", lat: 12.3051, lng: 76.6551 },
  { name: "Mangaluru Central Railway Station, Karnataka", lat: 12.8622, lng: 74.8427 },
  { name: "Vijayawada Junction, Andhra Pradesh", lat: 16.5186, lng: 80.6200 },
  { name: "Visakhapatnam Railway Station, Andhra Pradesh", lat: 17.7289, lng: 83.2952 },

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

  const [bookingStep, setBookingStep] = useState(1);
  const [language, setLanguage] = useState(localStorage.getItem('hum_lang') || 'en');

  const t = (key) => {
    const dict = {
      'Where to?': { en: 'Where to?', ml: 'എവിടേക്ക് പോകണം?', hi: 'कहाँ जाना है?' },
      'Select Vehicle': { en: 'Select Vehicle', ml: 'വാഹനം തിരഞ്ഞെടുക്കുക', hi: 'वाहन चुनें' },
      'Book Ride': { en: 'Book Ride', ml: 'റൈഡ് ബുക്ക് ചെയ്യുക', hi: 'राइड बुक करें' },
      'Cancel Trip': { en: 'Cancel Trip', ml: 'യാത്ര റദ്ദാക്കുക', hi: 'यात्रा रद्द करें' },
      
      'EMERGENCY SOS': { en: 'EMERGENCY SOS', ml: 'അടിയന്തര SOS', hi: 'आपातकालीन SOS' }
    };
    return dict[key] ? (dict[key][language] || dict[key]['en']) : key;
  };
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [mapSearchFocused, setMapSearchFocused] = useState(false);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapModalTarget, setMapModalTarget] = useState(null); // 'pickup' | 'dropoff' | 'save_home' | 'save_work'
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const [savedPlaces, setSavedPlaces] = useState(() => {
    try {
      const email = localStorage.getItem('passengerEmail');
      const stored = localStorage.getItem(`savedPlaces_${email}`);
      return stored ? JSON.parse(stored) : { home: null, work: null };
    } catch(e) { return { home: null, work: null }; }
  });
  
  const [currentName, setCurrentName] = useState(localStorage.getItem('passengerName') || 'Passenger');
  const [editNameInput, setEditNameInput] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  
  const [bgTheme, setBgTheme] = useState(localStorage.getItem('passengerBgTheme') || 'default');
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('passengerDarkMode') === 'true');

  // Apply dark mode to body and map
  useEffect(() => {
    if (isDarkMode) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
    
    // Notify map iframe if open
    const mapIframe = document.getElementById('map-modal-iframe');
    if (mapIframe && mapIframe.contentWindow) {
      mapIframe.contentWindow.postMessage({ type: 'SET_THEME', theme: isDarkMode ? 'dark' : 'light' }, '*');
    }
  }, [isDarkMode, showMapModal]);

  const [dynamicLocations, setDynamicLocations] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/locations`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setDynamicLocations(data || []))
      .catch(err => console.error('Failed to fetch dynamic locations:', err));
  }, []);

  useEffect(() => {
    if (!pickup) {
      handleUseCurrentLocation('pickup');
    }
  }, []);

  const [pickupFocused, setPickupFocused] = useState(false);
  const [dropoffFocused, setDropoffFocused] = useState(false);
  const [selectedTier, setSelectedTier] = useState('');

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
  
  useEffect(() => {
    if (categories.length > 0 && !selectedTier) {
      setSelectedTier(categories[0].name);
    }
  }, [categories, selectedTier]);
  
  // Custom offered fare states
  const [customFare, setCustomFare] = useState('');
  const [fareWarning, setFareWarning] = useState('');

  // Wallet & Profile State
  const [wallet, setWallet] = useState({ totalSpent: 0, taxPaid: 0, balance: 0 });
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');
  const [topupScreenshot, setTopupScreenshot] = useState(null);
  const [topupScreenshotBase64, setTopupScreenshotBase64] = useState(null);
  const [isUploadingTopup, setIsUploadingTopup] = useState(false);
  
  const [showRideHistory, setShowRideHistory] = useState(false);
  const [rideHistoryData, setRideHistoryData] = useState([]);

  const [passengerProfilePic, setPassengerProfilePic] = useState(localStorage.getItem('passengerProfilePic') || null);
  const [passengerRating, setPassengerRating] = useState(5.0);
  const [passengerId, setPassengerId] = useState(null);

  // In-Trip Chat States (Strictly enabled for matched driver & passenger on active ride)
  const [showInTripChat, setShowInTripChat] = useState(false);
  const ratedRideIdRef = useRef(null);
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



  // Ride Booking Workflow State
  const [activeRide, setActiveRide] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [rideAccepted, setRideAccepted] = useState(false);
  const [withPet, setWithPet] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(null);

  // Pre-booking states
  const [isPreBookToggle, setIsPreBookToggle] = useState(false);
  const [preBookDate, setPreBookDate] = useState('');
  const [preBookTime, setPreBookTime] = useState('');
  const [preBookedRides, setPreBookedRides] = useState([]);

  // Pink Driver (Female Driver) states
  const [requireFemaleDriver, setRequireFemaleDriver] = useState(false);
  const [femaleDriversOnline, setFemaleDriversOnline] = useState(0);

  // Bidirectional rating states
  const [showRating, setShowRating] = useState(false);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [selectedBadges, setSelectedBadges] = useState([]);

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
        if (data.id) setPassengerId(data.id);
        if (data.profilePic) {
          setPassengerProfilePic(data.profilePic);
          localStorage.setItem('passengerProfilePic', data.profilePic);
        }
        if (data.home || data.work) {
          setSavedPlaces(prev => ({
            ...prev,
            ...(data.home && { home: typeof data.home === 'string' ? JSON.parse(data.home) : data.home }),
            ...(data.work && { work: typeof data.work === 'string' ? JSON.parse(data.work) : data.work })
          }));
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
        
        // Dynamically add "Pink Driver" option if female drivers are online
        let femaleCount = 0;
        try {
          const femaleRes = await fetch(`${API_BASE}/api/drivers/online-female-count`);
          if (femaleRes.ok) {
            const femaleData = await femaleRes.json();
            femaleCount = femaleData.count || 0;
            setFemaleDriversOnline(femaleCount);
          }
        } catch(e) {}

        if (femaleCount > 0) {
          data.push({
            id: 'pink',
            name: 'Pink Driver 🌸',
            maxPassengers: 4,
            baseFare: 40,
            ratePerKm: 15,
            icon: '🌸',
            eta: '4-6 mins'
          });
        }
        
        setCategories(data);
        if (data.length > 0) {
          setSelectedTier(prev => {
            // Check if currently selected tier still exists, else default to first
            if (prev && data.some(d => d.name === prev)) return prev;
            return data[0].name;
          });
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
          if (data.id === ratedRideIdRef.current) return;
          setActiveRide(data);
          if (data.status === 'Accepted' || data.status === 'Arrived' || data.status === 'In Progress') {
            setIsSearching(false);
            setRideAccepted(true);
          } else if (data.status === 'Searching') {
            setIsSearching(true);
            setRideAccepted(false);
          }
        } else {
          setActiveRide(null);
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

  const handleTriggerSOS = () => {
    if (sosCountdown !== null) return;
    setSosCountdown(5);
    let count = 5;
    const interval = setInterval(async () => {
      count--;
      if (count > 0) {
        setSosCountdown(count);
      } else {
        clearInterval(interval);
        setSosCountdown(null);
        try {
          const res = await fetch(`${API_BASE}/api/rides/sos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              rideId: activeRide?.id,
              userType: 'passenger',
              userEmail: localStorage.getItem('passengerEmail'),
              lat: activeRide?.pickupCoords?.lat || 0,
              lng: activeRide?.pickupCoords?.lng || 0
            })
          });
          if (res.ok) {
            alert('🚨 SOS ALERT SENT TO ADMIN AND AUTHORITIES!');
          }
        } catch(e) { console.error(e); }
      }
    }, 1000);
    window.sosInterval = interval;
  };

  const handleCancelSOS = () => {
    if (window.sosInterval) {
      clearInterval(window.sosInterval);
      setSosCountdown(null);
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

  // Poll vehicle categories & settings every 1 second to get live admin pricing updates
  useEffect(() => {
    const interval = setInterval(async () => {
      fetchCategories();
      fetchPassengerActiveRide();
    }, 1000);
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
    const interval = setInterval(fetchTripChatMessages, 1000);
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
        // Only update fields — do NOT close the modal. User clicks Confirm to close.
        if (mapModalTarget === 'dropoff') {
          setDropoff(event.data.address);
          setDropoffCoords({ lat: event.data.lat, lng: event.data.lng });
        } else if (mapModalTarget === 'pickup') {
          setPickup(event.data.address);
          setPickupCoords({ lat: event.data.lat, lng: event.data.lng });
        } else if (mapModalTarget === 'update_dest') {
          setNewDestInput(event.data.address);
          setNewDestCoords({ lat: event.data.lat, lng: event.data.lng });
        } else if (mapModalTarget && mapModalTarget.startsWith('waypoint_')) {
          const index = parseInt(mapModalTarget.split('_')[1]);
          setWaypoints(prev => {
            const newWp = [...prev];
            newWp[index] = { address: event.data.address, lat: event.data.lat, lng: event.data.lng };
            return newWp;
          });
        } else if (mapModalTarget === 'save_home') {
          const newLoc = { address: event.data.address, lat: event.data.lat, lng: event.data.lng };
          setSavedPlaces(prev => {
            const updated = { ...prev, home: newLoc };
            localStorage.setItem(`savedPlaces_${localStorage.getItem('passengerEmail')}`, JSON.stringify(updated));
            fetch(`${API_BASE}/api/passengers/locations`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: localStorage.getItem('passengerEmail'), home: newLoc })
            });
            return updated;
          });
        } else if (mapModalTarget === 'save_work') {
          const newLoc = { address: event.data.address, lat: event.data.lat, lng: event.data.lng };
          setSavedPlaces(prev => {
            const updated = { ...prev, work: newLoc };
            localStorage.setItem(`savedPlaces_${localStorage.getItem('passengerEmail')}`, JSON.stringify(updated));
            fetch(`${API_BASE}/api/passengers/locations`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: localStorage.getItem('passengerEmail'), work: newLoc })
            });
            return updated;
          });
        }
      }
    };
    window.addEventListener('message', handleMapMessage);
    return () => window.removeEventListener('message', handleMapMessage);
  }, [mapModalTarget]);

  // Distance calculation: actual Haversine distance, defaults to 8 KM if no dropoff chosen yet
  const tripDistance = pickupCoords && dropoffCoords
    ? parseFloat(getFrontendDistance(pickupCoords.lat, pickupCoords.lng, dropoffCoords.lat, dropoffCoords.lng).toFixed(1))
    : 8;

  const isIntercity = tripDistance > 32.0;
  const intercityAllowance = tripDistance > 100.0 ? 300 : (tripDistance > 32.0 ? 250 : 0);

  let dynamicSurge = parseFloat(settings.surgeMultiplier) || 1.0;
  
  // AIRPORT SURGE LOGIC (1.15x extra for airport pickups)
  const AIRPORTS = [
    { lat: 8.4821, lng: 76.9200 },  // TRV (Trivandrum)
    { lat: 10.1520, lng: 76.4019 }, // COK (Cochin)
    { lat: 11.1364, lng: 75.9553 }, // CCJ (Calicut)
    { lat: 11.9184, lng: 75.5473 }  // CNN (Kannur)
  ];
  if (pickupCoords && pickupCoords.lat && pickupCoords.lng) {
    for (let apt of AIRPORTS) {
      if (getFrontendDistance(pickupCoords.lat, pickupCoords.lng, apt.lat, apt.lng) < 3.0) {
        dynamicSurge = Math.max(dynamicSurge, 1.15); // Apply 15% extra
        break;
      }
    }
  }
  
  const surge = dynamicSurge;

  const getPlatformFee = (fare) => {
  const f = parseFloat(fare || 0);
  if (f >= 500) return 15;
  if (f >= 200) return 10;
  return 5;
};

  const calculateCategoryFare = (cat) => {
    if (!cat) return '0.00';
    let catBase = parseFloat(cat.baseFare !== undefined ? cat.baseFare : settings.baseFare);
    if (parseFloat(settings.baseFare) > catBase) catBase = parseFloat(settings.baseFare);
    
    catBase += intercityAllowance;

    let catPerKm = parseFloat(cat.ratePerKm !== undefined ? cat.ratePerKm : settings.ratePerKm);

    const rawFare = (catBase + catPerKm * tripDistance) * surge;
    return rawFare.toFixed(2);
  };

  const currentCategory = categories.find(c => c.name === selectedTier);
  const minFare = currentCategory 
    ? calculateCategoryFare(currentCategory) 
    : '0.00';

  // Removed legacy effect that forced customFare (now tip) to minimum fare
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

    let stopped = false;
    let interval = null;

    const pollStatus = async () => {
      if (stopped) return;
      try {
        const response = await fetch(`${API_BASE}/api/rides/${activeRide.id}/status`);
        if (response.ok) {
          const data = await response.json();
          if (stopped) return;
          if (data && data.id === ratedRideIdRef.current) return;
          if (data.status === 'Accepted' || data.status === 'Arrived' || data.status === 'In Progress') {
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
            // Stop polling immediately — ride is done
            stopped = true;
            if (interval) clearInterval(interval);
            setActiveRide(data);
            setShowRating(prev => { if (!prev) fetchWallet(); return true; });
            setIsSearching(false);
            setRideAccepted(false);
          }
        }
      } catch (err) {
        console.error("Error polling ride status:", err);
      }
    };

    interval = setInterval(pollStatus, 2000);
    return () => { stopped = true; clearInterval(interval); };
  }, [activeRide?.id, rideAccepted]);

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
      }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const getFilteredLocations = (input) => {
    try {
      const validDynamic = Array.isArray(dynamicLocations) ? dynamicLocations : [];
      const allLocations = [...KERALA_LOCATIONS, ...validDynamic].filter(loc => loc && typeof loc.name === 'string');
      
      const uniqueLocations = Array.from(new Map(allLocations.map(item => [item.name, item])).values());
      
      if (!input) return uniqueLocations.slice(0, 50);
      const lower = String(input).toLowerCase();
      
      const filtered = uniqueLocations.filter(loc =>
        loc.name.toLowerCase().includes(lower)
      );
      
      if (filtered.length >= 3) {
        return [...filtered, ...(Array.isArray(nominatimResults) ? nominatimResults : []).filter(nr => !filtered.some(f => Math.abs((f.lat || 0) - (nr.lat || 0)) < 0.005 && Math.abs((f.lng || 0) - (nr.lng || 0)) < 0.005))].slice(0, 50);
      }
      return [...filtered, ...(Array.isArray(nominatimResults) ? nominatimResults : [])].slice(0, 50);
    } catch (err) {
      console.error("Error filtering locations:", err);
      const fallbackLower = String(input || '').toLowerCase();
      return KERALA_LOCATIONS.filter(loc => loc.name && loc.name.toLowerCase().includes(fallbackLower)).slice(0, 50);
    }
  };

  const handleBookRide = async () => {
    if (!pickup || !dropoff) {
      alert('Please select both pickup and drop-off locations!');
      return;
    }

    // Tip is completely optional
    const tipAmount = customFare ? parseFloat(customFare) : 0;

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
          fare: parseFloat(minFare).toFixed(2),
          driverTip: parseFloat(tipAmount).toFixed(2),
          passengerName: localStorage.getItem('passengerName') || 'Passenger',
          passengerEmail: localStorage.getItem('passengerEmail'),
          pickupCoords,
          dropoffCoords,
          waypoints,
          isPreBooked: isPreBookToggle,
          preBookDate: isPreBookToggle ? preBookDate : null,
          preBookTime: isPreBookToggle ? preBookTime : null,
          withPet,
          requireFemaleDriver: selectedTier === 'Pink Driver 🌸',
          vehicleCategory: selectedTier
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
          setWaypoints([]);
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

  const handleWaitForMe = async () => {
    if (!activeRide) return;
    try {
      const res = await fetch(`${API_BASE}/api/rides/${activeRide.id}/wait`, { method: 'POST' });
      if (res.ok) {
        alert('Driver notified to wait for you!');
      }
    } catch (err) { console.error('Error requesting wait:', err); }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm("Are you sure you want to cancel the trip?")) return;

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
    setSosCountdown(null);
    setCustomFare('');
    setDropoff('');
    setDropoffCoords(null);
    setWaypoints([]);
    setBookingStep(1);
    
    // Automatically find their location again instead of leaving it blank
    handleUseCurrentLocation('pickup');

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
    
    // Save current values for fetch
    const rideId = activeRide.id;
    ratedRideIdRef.current = rideId;
    const currentRating = ratingValue;
    const currentComment = ratingComment;
    const currentBadges = selectedBadges;

    try {
      await fetch(`${API_BASE}/api/rides/${rideId}/rate-driver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating: currentRating,
          comment: currentComment,
          badges: currentBadges
        })
      });
    } catch (err) {
      console.error("Failed to submit driver rating:", err);
    }
    // Clear UI AFTER server has processed it
    setActiveRide(null);
    setIsSearching(false);
    setRideAccepted(false);
    setDropoff('');
    setDropoffCoords(null);
    setWaypoints([]);
    setBookingStep(1);
    
    // Automatically find their location again instead of leaving it blank
    handleUseCurrentLocation('pickup');
    setShowRating(false);
    setRatingValue(5);
    setRatingComment('');
    setSelectedBadges([]);

    const mapIframe = document.getElementById('map-iframe');
    if (mapIframe && mapIframe.contentWindow) {
      mapIframe.contentWindow.postMessage({ type: 'RESET_MAP' }, '*');
    }


  };

  const handleTopupSubmit = async (e) => {
    e.preventDefault();
    if (!topupAmount || !topupScreenshotBase64) return;
    setIsUploadingTopup(true);
    try {
      const res = await fetch(`${API_BASE}/api/wallet/topup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: localStorage.getItem('passengerEmail'), amount: topupAmount, screenshot: topupScreenshotBase64 })
      });
      if (res.ok) {
        alert('Top-up request sent to admin for approval!');
        setShowWalletModal(false);
        setTopupAmount('');
        setTopupScreenshot(null);
        setTopupScreenshotBase64('');
      } else {
        alert('Failed to submit top-up request.');
      }
    } catch(err) {
      console.error(err);
      alert('Error connecting to server.');
    } finally {
      setIsUploadingTopup(false);
    }
  };

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    setIsApplyingPromo(true);
    try {
      const res = await fetch(`${API_BASE}/api/passengers/promo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: localStorage.getItem('passengerEmail'), code: promoCode })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setWallet(prev => ({ ...prev, balance: data.balance }));
        setPromoCode('');
      } else {
        alert(data.error || 'Failed to apply promo.');
      }
    } catch(err) {
      alert('Error connecting to server.');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleFetchRideHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/passengers/rides?email=${encodeURIComponent(localStorage.getItem('passengerEmail'))}`);
      if (res.ok) {
        const data = await res.json();
        setRideHistoryData(data);
        setShowRideHistory(true);
      }
    } catch(err) {
      console.error(err);
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

  if (!localStorage.getItem('passengerEmail')) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-main)', color: 'var(--text-muted)', fontSize: '16px' }}>
        Redirecting to login...
      </div>
    );
  }

  const shouldShowProfile = bookingStep === 1 || isProfileMenuOpen;
  
  const getBgStyle = () => {
    switch(bgTheme) {
      case 'deep_blue': return 'linear-gradient(135deg, #020617, #1e3a8a)';
      case 'emerald': return 'linear-gradient(135deg, #022c22, #059669)';
      case 'purple': return 'linear-gradient(135deg, #2e1065, #0f172a)';
      case 'crimson': return 'linear-gradient(135deg, #4c0519, #0f172a)';
      case 'dark_gray': return 'linear-gradient(135deg, #18181b, #27272a)';
      default: return 'var(--bg-main)';
    }
  };

  return (
    <div className="dashboard-page" style={{ overflowY: "auto", minHeight: "100vh", background: getBgStyle() }}>
      <div className="dashboard-container">
        <div className="dashboard-sidebar glass-card" style={{ zIndex: 10 }}>
          
          {/* Passenger Header & Profile Picture */}
          <div style={{ position: 'relative', minHeight: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '18px', marginBottom: '14px' }}>
            
            {/* Logo on Left */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '2px solid var(--border)'
            }}>
              <img src="/hum_fleet_official_logo.jpg" alt="HUM Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>


            
            {/* Menu Toggle Button (Shows when profile is hidden) */}
            {!shouldShowProfile && (
              <button 
                onClick={() => setIsProfileMenuOpen(true)}
                title="Open Profile"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '46px',
                  width: '36px',
                  height: '36px',
                  background: 'transparent',
                  color: 'var(--text-main)',
                  border: '2px solid var(--border)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <Menu size={16} />
              </button>
            )}

            {shouldShowProfile && (
              <button 
                onClick={() => setIsProfileMenuOpen(false)}
                title="Close Profile"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '46px',
                  width: '36px',
                  height: '36px',
                  background: 'transparent',
                  color: 'var(--text-main)',
                  border: '2px solid var(--border)',
                  borderRadius: '8px',
                  display: bookingStep > 1 ? 'flex' : 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <X size={16} />
              </button>
            )}

            {shouldShowProfile && (
              <>
                {/* Passenger Avatar */}
                <div style={{ position: 'relative', width: '70px', height: '70px', flexShrink: 0, marginBottom: '12px' }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)', background: '#121624' }}>
                    {passengerProfilePic ? (
                      <img src={passengerProfilePic} alt="Passenger Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold', fontSize: '24px' }}>
                        <User size={28} />
                      </div>
                    )}
                  </div>

                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h2 style={{ margin: 0, fontSize: '20px', textAlign: 'center' }}>{currentName}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', color: '#f59e0b', fontWeight: 'bold', marginTop: '6px' }}>
                    <span>★ {passengerRating.toFixed(1)} Rating</span>
                  </div>
                  {passengerId && (
                    <div style={{ marginTop: '10px', fontSize: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#3b82f6', padding: '4px 12px', borderRadius: '6px', display: 'inline-block', fontWeight: 'bold', textAlign: 'center' }}>
                      Customer ID: {passengerId}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {/* Settings Button */}
                    <button 
                      onClick={() => setShowSettingsModal(true)}
                      title="Settings"
                      style={{
                        width: '42px', height: '42px',
                        background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border)', color: 'var(--text-main)',
                        borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
                    >
                      <Settings size={20} />
                    </button>

                    {/* Ride History Button */}
                    <button 
                      onClick={() => {
                        handleFetchRideHistory();
                        setShowRideHistory(true);
                      }}
                      title="Ride History"
                      style={{
                        width: '42px', height: '42px',
                        background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8',
                        borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)'; }}
                    >
                      <Clock size={20} />
                    </button>

                    {/* WhatsApp Button */}
                    <button 
                      onClick={() => window.open('https://api.whatsapp.com/send?phone=918848347290', '_blank')}
                      title="Customer Care (WhatsApp)"
                      style={{
                        width: '42px', height: '42px',
                        background: 'rgba(37, 211, 102, 0.1)', border: '1px solid rgba(37, 211, 102, 0.3)', color: '#25D366',
                        borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(37, 211, 102, 0.2)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(37, 211, 102, 0.1)'; }}
                    >
                      <MessageCircle size={20} />
                    </button>

                    {/* Theme Toggle Button */}
                    <button 
                      onClick={() => {
                        const newMode = !isDarkMode;
                        setIsDarkMode(newMode);
                        localStorage.setItem('passengerDarkMode', newMode);
                      }}
                      title="Toggle Dark/Light Mode"
                      style={{
                        width: '42px', height: '42px',
                        background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border)', color: 'var(--text-main)',
                        borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
                    >
                      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Logout Button */}
                    <button 
                      onClick={handleLogout}
                      title="Logout"
                      style={{
                        width: '42px', height: '42px',
                        background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444',
                        borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                </div>
              </>
            )}
            
          </div>

          {/* Scheduled / Pre-booked Rides Section */}
          {shouldShowProfile && preBookedRides.length > 0 && (
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
                  <span style={{ color: 'var(--text-muted)' }}>Trip Fare:</span>
                  <span>₹{parseFloat(activeRide.fare || 0).toFixed(2)}</span>
                </div>
                {parseFloat(activeRide.driverTip || 0) > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Tip:</span>
                    <span>+₹{parseFloat(activeRide.driverTip || 0).toFixed(2)}</span>
                  </div>
                )}
                <div style={{ borderTop: '1px solid rgba(59, 130, 246, 0.3)', margin: '4px 0', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px', color: 'var(--text-main)' }}>
                  <span>Total Paid ({activeRide.paymentType === 'cash' ? '💵 Cash' : '💳 Prepaid'}):</span>
                  <span>₹{parseFloat(activeRide.totalCollected || 0).toFixed(2)}</span>
                </div>
              </div>
              
              <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.03)', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', margin: 0 }}>Rate your driver's behaviour</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                  How was your trip with **{activeRide.driverName || 'Not provided'}**?
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
          {!isSearching && !rideAccepted && !activeRide && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Progress Indicator Removed per user request */}
              {/* STEP 1: PICKUP & DROPOFF */}
              {bookingStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexShrink: 0 }} className="animate-fade-in">
                  
                  {/* PICKUP */}
                  <div 
                    onClick={() => {
                      setMapModalTarget('pickup');
                      setShowMapModal(true);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <MapPin size={22} color="var(--primary)" />
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pickup Location</span>
                      <span style={{ fontSize: '15px', fontWeight: 'bold', color: pickup ? 'var(--text-main)' : 'var(--text-muted)', marginTop: '4px' }}>
                        {pickup ? pickup.split(',')[0] : 'Locating...'}
                      </span>
                    </div>
                    <div style={{ padding: '6px 10px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--secondary)', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Map size={14} /> Map
                    </div>
                  </div>

                  {/* WAYPOINTS */}
                  {waypoints.map((wp, index) => (
                    <div key={index} style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                      <div 
                        onClick={() => { setMapModalTarget(`waypoint_${index}`); setShowMapModal(true); }}
                        style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                      >
                        <MapPin size={22} color="#f59e0b" />
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Stop {index + 1}</span>
                          <span style={{ fontSize: '15px', fontWeight: 'bold', color: wp.address ? 'var(--text-main)' : 'var(--text-muted)', marginTop: '4px' }}>
                            {wp.address ? wp.address.split(',')[0] : 'Tap to add stop...'}
                          </span>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setWaypoints(prev => prev.filter((_, i) => i !== index)); }}
                          style={{ padding: '6px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {waypoints.length < 3 && pickup && (
                    <button 
                      onClick={() => setWaypoints([...waypoints, { address: '', lat: null, lng: null }])}
                      style={{ background: 'none', border: '1px dashed var(--border)', color: 'var(--text-muted)', padding: '10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '13px' }}
                    >
                      <MapPin size={14} /> + Add Stop
                    </button>
                  )}

                  {/* DROPOFF */}
                  <div 
                    onClick={() => { setMapModalTarget('dropoff'); setShowMapModal(true); }}
                    style={{ 
                      padding: '16px', 
                      background: 'rgba(255,255,255,0.03)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <Navigation size={22} color="var(--secondary)" />
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Drop-off Location</span>
                      <span style={{ fontSize: '15px', fontWeight: 'bold', color: dropoff ? 'var(--text-main)' : 'var(--text-muted)', marginTop: '4px' }}>
                        {dropoff ? dropoff.split(',')[0] : 'Tap to choose from map...'}
                      </span>
                    </div>
                    <div style={{ padding: '6px 10px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--secondary)', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Map size={14} /> Map
                    </div>
                  </div>

                  {/* QUICK SAVED PLACES */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                    <button 
                      onClick={() => {
                        if (savedPlaces.home) {
                           setDropoff(savedPlaces.home.address);
                           setDropoffCoords({ lat: savedPlaces.home.lat, lng: savedPlaces.home.lng });
                        } else {
                           setShowSettingsModal(true);
                        }
                      }}
                      style={{ flex: 1, padding: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      <Home size={16} /> {savedPlaces.home ? 'Drop @ Home' : 'Add Home'}
                    </button>
                    <button 
                      onClick={() => {
                        if (savedPlaces.work) {
                           setDropoff(savedPlaces.work.address);
                           setDropoffCoords({ lat: savedPlaces.work.lat, lng: savedPlaces.work.lng });
                        } else {
                           setShowSettingsModal(true);
                        }
                      }}
                      style={{ flex: 1, padding: '10px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      <Briefcase size={16} /> {savedPlaces.work ? 'Drop @ Work' : 'Add Work'}
                    </button>
                  </div>

                  {/* Next Step is now globally below */}
                </div>
              )}

              {/* STEP 2: CATEGORY & BOOKING */}
              {bookingStep === 2 && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px', flexShrink: 0 }}>
                  <div 
                    onClick={() => setBookingStep(1)} 
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={18} color="var(--primary)" />
                      <span style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--text-main)' }}>Change Location</span>
                    </div>
                    <span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>&rarr;</span>
                  </div>

                  <div className="ride-options">
                    {categories.map((cat) => (
                      <div 
                        key={cat.id}
                        className={`ride-option ${selectedTier === cat.name ? 'selected' : ''}`}
                        onClick={() => setSelectedTier(cat.name)}
                      >
                        <Car size={24} />
                        <div className="option-details" style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                          <span className="option-name">{cat.name}</span>
                          <span className="option-meta">{cat.eta}</span>
                        </div>
                        <span className="option-price">₹{Math.round(calculateCategoryFare(cat))} - ₹{Math.round(calculateCategoryFare(cat) * 1.15)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="input-group" style={{ position: 'relative', marginTop: '16px', flexShrink: 0 }}>
                    <div className="input-icon" style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', color: 'var(--text-main)' }}>₹</div>
                    <input 
                      type="number" 
                      className="input-field with-icon" 
                      placeholder="Add Tip for Driver (Optional)"
                      value={customFare}
                      onChange={(e) => setCustomFare(e.target.value)}
                    />
                  </div>

                  {/* PRE-BOOK TOGGLE */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', marginTop: '16px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={18} color="var(--primary)" />
                        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Schedule for Later</span>
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={isPreBookToggle} 
                          onChange={(e) => setIsPreBookToggle(e.target.checked)} 
                          style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                        />
                      </label>
                    </div>
                    {isPreBookToggle && (
                      <div className="animate-fade-in" style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                        <input 
                          type="date" 
                          value={preBookDate}
                          onChange={(e) => setPreBookDate(e.target.value)}
                          className="input-field"
                          style={{ flex: 1, padding: '10px', fontSize: '13px' }}
                        />
                        <input 
                          type="time" 
                          value={preBookTime}
                          onChange={(e) => setPreBookTime(e.target.value)}
                          className="input-field"
                          style={{ flex: 1, padding: '10px', fontSize: '13px' }}
                        />
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: '10px', flexShrink: 0 }}>
                    <div style={{ textAlign: 'center', marginBottom: '12px', padding: '0 10px' }}>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                        <strong style={{color: '#f59e0b'}}>NOTE:</strong> The fare calculation is an estimate. The final amount will change as per the actual ride distance and waiting time.
                      </p>
                    </div>
                    <Button 
                      variant="primary" 
                      style={{ width: '100%' }}
                      disabled={!pickup || !dropoff || !selectedTier}
                      onClick={handleBookRide}
                    >
                      {isPreBookToggle ? `Schedule ${selectedTier}` : `Book ${selectedTier}`}
                    </Button>
                    <Button 
                      variant="outline" 
                      style={{ 
                        width: '100%', 
                        marginTop: '10px', 
                        borderColor: '#25D366', 
                        color: '#25D366',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        background: 'rgba(37, 211, 102, 0.05)'
                      }}
                      onClick={() => {
                        const text = `Hello, I would like to book a ride.\n*Pickup*: ${pickup}\n*Dropoff*: ${dropoff}\n*Category*: ${selectedTier}`;
                        window.open(`https://api.whatsapp.com/send?phone=918848347290&text=${encodeURIComponent(text)}`, '_blank');
                      }}
                    >
                      <MessageCircle size={18} /> Book via WhatsApp
                    </Button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* STATE 2: Searching for Driver */}
          {isSearching && !rideAccepted && !showRating && (
            <div className="searching-panel text-center animate-fade-in" style={{ padding: '30px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div className="request-pulse" style={{ margin: '0 auto' }}></div>
              <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Searching for Nearby Drivers...</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                Connecting with drivers near <strong>{pickup.split(',')[0]}</strong>. Please hold on.
              </p>
              <div style={{ background: 'rgba(0,0,0,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '16px', fontWeight: '800' }}>
                  EST. FARE: ₹{Math.round(parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0])) + (parseFloat(customFare) || 0))} - ₹{Math.round((parseFloat(calculateCategoryFare(categories.find(c => c.name === selectedTier) || categories[0]))) * 1.15 + (parseFloat(customFare) || 0))}
                </div>
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

              {/* Intercity check removed */}
              
              {/* Driver and Vehicle Detail Card */}
              <div style={{ border: '1px solid var(--border)', borderRadius: '14px', padding: '16px', background: 'rgba(16, 185, 129, 0.03)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800' }}>{activeRide.driverName || 'Not provided'} <span style={{ fontSize: '13px', color: '#f59e0b' }}>★ {activeRide.driverRating || '5.0'}</span></h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>HUM Partner</p>
                  </div>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)' }}>
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(activeRide.driverName || 'R')}&background=10b981&color=fff`} alt="Driver Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <div><strong>Vehicle:</strong> {activeRide.vehicleModel || 'Unknown Vehicle'}</div>
                  <div><strong>Plate No:</strong> <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{activeRide.vehiclePlate || 'Not provided'}</span></div>
                  <div><strong>Phone:</strong> {activeRide.driverPhone || 'Not provided'}</div>
                  
                                      <div style={{ borderTop: '1px dashed var(--border)', marginTop: '8px', paddingTop: '8px', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '15px' }}>
                      <span>TRIP FARE:</span>
                      <span>INR {parseFloat(activeRide.totalCollected || (parseFloat(activeRide.fare || 0) + parseFloat(activeRide.driverTip || 0))).toFixed(2)}</span>
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
                
                {activeRide.status !== 'In Progress' && (
                  <Button variant="primary" style={{ flex: 1, background: '#ef4444', borderColor: '#ef4444' }} onClick={handleCancelBooking}>
                    {t('Cancel Trip')}
                  </Button>
                )}
              </div>


              
              <Button 
                variant="primary" 
                style={{ background: '#3b82f6', color: 'white', borderColor: '#3b82f6', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} 
                onClick={() => {
                  const trackUrl = `${window.location.origin}/track.html?id=${activeRide.id}`;
                  const text = `Hey! Track my HUM ride live: ${trackUrl}\n\n📍 From: ${activeRide.pickup.split(',')[0]}\n🚩 To: ${activeRide.dropoff.split(',')[0]}\n🚕 Vehicle: ${activeRide.vehiclePlate || 'N/A'}`;
                  
                  if (navigator.share) {
                    navigator.share({
                      title: 'Track My HUM Trip',
                      text: text
                    }).catch(err => console.error('Error sharing:', err));
                  } else {
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                  }
                }}
              >
                <Share2 size={16} /> Share Live Status
              </Button>

              {sosCountdown !== null ? (
                <Button 
                  variant="primary" 
                  style={{ background: '#333', color: 'white', borderColor: '#333', width: '100%', marginTop: '10px' }} 
                  onClick={handleCancelSOS}
                >
                  {t('Cancel SOS')} ({sosCountdown}s)
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  style={{ background: '#ef4444', color: 'white', borderColor: '#ef4444', width: '100%', marginTop: '10px', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }} 
                  onClick={handleTriggerSOS}
                >
                  🚨 EMERGENCY SOS
                </Button>
              )}
            </div>
          )}
          
          {/* Next Step Button (Global for Step 1) */}
          {!activeRide && !isSearching && bookingStep === 1 && (
            <Button 
              variant="primary" 
              style={{ width: '100%', marginTop: '16px', padding: '14px', fontSize: '15px' }} 
              onClick={() => {
                if (pickup && dropoff) {
                  setBookingStep(2);
                } else {
                  alert('Please enter both pickup and drop-off locations first.');
                }
              }}
            >
              Select Vehicle <Car size={16} />
            </Button>
          )}
          {/* Logout button moved to the top right of the dashboard map */}

        </div>
        
        <div className="dashboard-map animate-fade-in delay-100" style={{ padding: 0, overflow: 'hidden', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
          
          

          
          

          
        </div>
      </div>
              {/* PINNED VERIFICATION PIN / CUSTOMER ID (Moved out of map z-index context) */}
        {rideAccepted && activeRide && passengerId && !showRating && (
          <div
            className="pulse-nav-button"
            style={{
              position: 'fixed',
              top: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999,
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.4)',
              borderRadius: '30px',
              padding: '10px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.6)'
            }}
          >
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', opacity: 0.9 }}>
              Verification PIN
            </span>
            <span style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '2px', fontFamily: 'monospace' }}>
              {passengerId}
            </span>
          </div>
        )}

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
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Chatting with Driver: <strong>{activeRide.driverName || 'Not provided'}</strong> ({activeRide.vehiclePlate || 'Not provided'})</span>
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
                    style={{ paddingRight: '80px' }}
                  />
                  <div 
                    onClick={() => { setMapModalTarget('update_dest'); setShowMapModal(true); }}
                    style={{ position: 'absolute', right: '6px', top: '50%', marginTop: '4px', transform: 'translateY(-50%)', padding: '6px 10px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--secondary)', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', zIndex: 10 }}
                  >
                    <Map size={14} /> Map
                  </div>
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
      {showWalletModal && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '24px', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Wallet size={20} /> Top-Up Wallet</h3>
              <button onClick={() => setShowWalletModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Scan the QR code or use the UPI ID to send money. Then upload the screenshot of the payment receipt.</p>
            
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=humfleet@upi&pn=HUM%20Fleet" alt="QR Code" style={{ borderRadius: '8px', border: '2px solid var(--border)' }} />
              <p style={{ margin: '10px 0 0 0', fontWeight: 'bold' }}>UPI ID: humfleet@upi</p>
            </div>

            <form onSubmit={handleTopupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Top-Up Amount (₹)</label>
                <input required type="number" className="input-field" value={topupAmount} onChange={e => setTopupAmount(e.target.value)} style={{ width: '100%' }} min="1" placeholder="Enter amount paid" />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>Payment Screenshot</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label style={{ padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', cursor: 'pointer', display: 'inline-block' }}>
                    Choose File
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setTopupScreenshot(file);
                        const reader = new FileReader();
                        reader.onloadend = () => setTopupScreenshotBase64(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </label>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{topupScreenshot ? topupScreenshot.name : 'No file chosen'}</span>
                </div>
              </div>

              <Button type="submit" variant="primary" style={{ marginTop: '8px' }} disabled={isUploadingTopup}>
                {isUploadingTopup ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>

            <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-main)' }}>Have a Promo Code?</h4>
              <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  value={promoCode} 
                  onChange={e => setPromoCode(e.target.value.toUpperCase())} 
                  placeholder="e.g. HUM50" 
                  style={{ flex: 1, textTransform: 'uppercase' }} 
                />
                <Button type="submit" variant="outline" disabled={isApplyingPromo || !promoCode}>
                  Apply
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* RIDE HISTORY MODAL */}






































      {/* ========== RIDE HISTORY MODAL ========== */}
      {showRideHistory && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1900,
          background: 'var(--bg-main)',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{
            padding: '16px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'var(--bg-card)'
          }}>
            <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} color="var(--primary)" /> Ride History
            </h3>
            <button
              onClick={() => setShowRideHistory(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
          </div>

          <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
            {rideHistoryData.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                <Clock size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                <p>You haven't taken any rides yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {rideHistoryData.map(ride => (
                  <div key={ride.id} style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px',
                    padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{ride.vehicleCategory || 'Standard'} Ride</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {ride.completionTime ? new Date(ride.completionTime).toLocaleString() : new Date().toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '900', fontSize: '16px', color: '#10b981' }}>₹{ride.fare || 0}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ride.paymentMethod || 'Cash'}</div>
                      </div>
                    </div>
                    
                    <div style={{ height: '1px', background: 'var(--border)' }}></div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <MapPin size={16} color="var(--primary)" style={{ marginTop: '2px' }} />
                        <div style={{ fontSize: '13px', color: 'var(--text-main)' }}>{ride.pickup ? ride.pickup.split(',')[0] : 'Unknown'}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <Navigation size={16} color="var(--secondary)" style={{ marginTop: '2px' }} />
                        <div style={{ fontSize: '13px', color: 'var(--text-main)' }}>{ride.destination ? ride.destination.split(',')[0] : 'Unknown'}</div>
                      </div>
                    </div>
                    
                    {ride.driverName && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '8px' }}>
                        <User size={14} color="var(--text-muted)" />
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Driver: <strong>{ride.driverName}</strong></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========== SETTINGS / SAVED PLACES MODAL ========== */}
      {showSettingsModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1900,
          background: 'var(--bg-main)',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{
            padding: '16px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'var(--bg-card)'
          }}>
            <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={20} color="var(--primary)" /> Settings
            </h3>
            <button
              onClick={() => setShowSettingsModal(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
          </div>

          <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
            <h4 style={{ margin: '0 0 14px 0', fontSize: '14px', color: 'var(--text-muted)' }}>PROFILE</h4>
            
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px',
              padding: '16px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px'
            }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Profile Picture</span>
                <label 
                  style={{
                    background: 'var(--primary)', color: '#fff', padding: '6px 12px', borderRadius: '8px', 
                    fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = 0.8; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = 1; }}
                >
                  <Camera size={14} /> Upload
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleUploadPassengerProfilePic(e.target.files[0])} 
                    style={{ display: 'none' }} 
                  />
                </label>
              </div>

              {isEditingName ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    value={editNameInput} 
                    onChange={(e) => setEditNameInput(e.target.value)}
                    style={{ flex: 1, background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }}
                    autoFocus
                  />
                  <button 
                    onClick={() => {
                      if (editNameInput.trim()) {
                        localStorage.setItem('passengerName', editNameInput.trim());
                        setCurrentName(editNameInput.trim());
                      }
                      setIsEditingName(false);
                    }}
                    style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '10px', borderRadius: '50%' }}>
                      <User size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '15px' }}>Your Name</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{currentName}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setEditNameInput(currentName);
                      setIsEditingName(true);
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                  >
                    EDIT
                  </button>
                </div>
              )}
            </div>

            <h4 style={{ margin: '0 0 14px 0', fontSize: '14px', color: 'var(--text-muted)' }}>BACKGROUND THEME</h4>
            
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px',
              padding: '16px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '10px'
            }}>
              {[
                { id: 'default', label: 'Default Dark', color: '#09090b' },
                { id: 'deep_blue', label: 'Deep Blue', color: '#1e3a8a' },
                { id: 'emerald', label: 'Emerald', color: '#059669' },
                { id: 'purple', label: 'Purple', color: '#4c1d95' },
                { id: 'crimson', label: 'Crimson', color: '#881337' },
                { id: 'dark_gray', label: 'Dark Gray', color: '#27272a' }
              ].map(theme => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setBgTheme(theme.id);
                    localStorage.setItem('passengerBgTheme', theme.id);
                  }}
                  style={{
                    flex: '1 1 calc(33.333% - 10px)',
                    background: theme.color,
                    color: '#fff',
                    border: bgTheme === theme.id ? '2px solid #fff' : '2px solid transparent',
                    borderRadius: '8px',
                    padding: '10px 4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    opacity: bgTheme === theme.id ? 1 : 0.7,
                    boxShadow: bgTheme === theme.id ? '0 4px 12px rgba(0,0,0,0.5)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {theme.label}
                </button>
              ))}
            </div>

            <h4 style={{ margin: '0 0 14px 0', fontSize: '14px', color: 'var(--text-muted)' }}>SAVED PLACES</h4>
            
            {/* Home */}
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px',
              padding: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '14px'
            }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '10px', borderRadius: '50%' }}>
                <Home size={20} />
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: 'bold', fontSize: '15px' }}>Home</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {savedPlaces.home ? savedPlaces.home.address : 'Tap to set your home address'}
                </div>
              </div>
              <button 
                onClick={() => {
                  setMapModalTarget('save_home');
                  setShowMapModal(true);
                  // don't close settings modal, they can see it update instantly!
                }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
              >
                {savedPlaces.home ? 'EDIT' : 'ADD'}
              </button>
            </div>

            {/* Work */}
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px',
              padding: '16px', display: 'flex', alignItems: 'center', gap: '14px'
            }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '10px', borderRadius: '50%' }}>
                <Briefcase size={20} />
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: 'bold', fontSize: '15px' }}>Work</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {savedPlaces.work ? savedPlaces.work.address : 'Tap to set your work address'}
                </div>
              </div>
              <button 
                onClick={() => {
                  setMapModalTarget('save_work');
                  setShowMapModal(true);
                }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
              >
                {savedPlaces.work ? 'EDIT' : 'ADD'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== CHOOSE FROM MAP MODAL ========== */}
      {showMapModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', flexDirection: 'column',
          }}
        >
          {/* No Header */}

          {/* Map iframe fills remaining space */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <iframe
              id="map-modal-iframe"
              src="/map.html"
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Choose from Map"
            />
          </div>

          {/* Confirm button */}
          <div style={{
            padding: '14px 18px',
            background: 'var(--bg-card)',
            borderTop: '1px solid var(--border)',
            flexShrink: 0,
          }}>
            <button
              onClick={() => setShowMapModal(false)}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff', fontWeight: '800', fontSize: '15px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              ✅ Confirm Location
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default PassengerDashboard;
