import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Car, AlertCircle, Phone, CheckCircle, DollarSign, Wallet, Map, Share2, Camera, User, MessageSquare, Send, X } from 'lucide-react';
import Button from '../components/Button';
import './Dashboard.css';

const INDIAN_LOCATIONS = [
  { name: "Indira Gandhi International Airport (DEL) T3, New Delhi", lat: 28.5562, lng: 77.1000 },
  { name: "Connaught Place (CP), Inner Circle, New Delhi", lat: 28.6304, lng: 77.2177 },
  { name: "New Delhi Railway Station (NDLS), Paharganj", lat: 28.6430, lng: 77.2223 },
  { name: "DLF CyberCity, Sector 24, Gurugram", lat: 28.4950, lng: 77.0896 },
  { name: "Noida Sector 62, Electronic City, Noida", lat: 28.6273, lng: 77.3725 },
  { name: "Taj Mahal, Agra (Intercity Ride ~200 KM)", lat: 27.1751, lng: 78.0421 },
  { name: "Mathura Junction Railway Station, Mathura (Intercity Ride ~140 KM)", lat: 27.4924, lng: 77.6737 }
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

const PassengerDashboard = () => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);

  const [pickupFocused, setPickupFocused] = useState(false);
  const [dropoffFocused, setDropoffFocused] = useState(false);
  const [selectedTier, setSelectedTier] = useState('HUM Go');
  
  // Custom offered fare states
  const [customFare, setCustomFare] = useState('');
  const [fareWarning, setFareWarning] = useState('');

  // Wallet & Profile State
  const [wallet, setWallet] = useState({ totalSpent: 0, taxPaid: 0 });
  const [passengerProfilePic, setPassengerProfilePic] = useState(localStorage.getItem('passengerProfilePic') || null);

  // In-Trip Chat States (Strictly enabled for matched driver & passenger on active ride)
  const [showInTripChat, setShowInTripChat] = useState(false);
  const [tripChatMessages, setTripChatMessages] = useState([]);
  const [tripChatText, setTripChatText] = useState('');
  const [tripChatError, setTripChatError] = useState(null);

  const handleUploadPassengerProfilePic = async (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result;
      setPassengerProfilePic(base64Data);
      localStorage.setItem('passengerProfilePic', base64Data);
      const email = localStorage.getItem('passengerEmail') || 'anoop.nair@gmail.com';
      try {
        await fetch('http://localhost:5000/api/passengers/profile-pic', {
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
  const [categories, setCategories] = useState([]);

  const [settings, setSettings] = useState({
    baseFare: '50.00',
    ratePerKm: '15.00',
    surgeMultiplier: '1.0'
  });

  // Ride Booking Workflow State
  const [activeRide, setActiveRide] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [rideAccepted, setRideAccepted] = useState(false);

  // Bidirectional rating states
  const [showRating, setShowRating] = useState(false);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  const fetchWallet = async () => {
    const email = localStorage.getItem('passengerEmail') || 'anoop.nair@gmail.com';
    try {
      const response = await fetch(`http://localhost:5000/api/passengers/wallet?email=${encodeURIComponent(email)}`);
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
      const response = await fetch('http://localhost:5000/api/vehicle-categories');
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

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/settings');
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
  }, []);

  // Fetch wallet when active ride changes (e.g. completes)
  useEffect(() => {
    fetchWallet();
  }, [activeRide]);

  // In-Trip Chat Message Polling (Active strictly for matched passenger and driver)
  const fetchTripChatMessages = async () => {
    if (!activeRide) return;
    const userEmail = localStorage.getItem('passengerEmail') || 'anoop.nair@gmail.com';
    try {
      const res = await fetch(`http://localhost:5000/api/rides/messages?rideId=${activeRide.id}&userEmail=${encodeURIComponent(userEmail)}`);
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
    if (!tripChatText || !tripChatText.trim() || !activeRide) return;
    
    // Quick frontend check for phone digits
    const digitsOnly = tripChatText.replace(/[\s\-\.\+\(\)]/g, '');
    if (/\d{10,}/.test(digitsOnly)) {
      setTripChatError('🚫 Safety Policy Alert: Phone numbers cannot be shared in chat.');
      return;
    }

    const userEmail = localStorage.getItem('passengerEmail') || 'anoop.nair@gmail.com';
    const passengerName = localStorage.getItem('passengerName') || 'Passenger';
    try {
      const res = await fetch('http://localhost:5000/api/rides/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rideId: activeRide.id,
          senderEmail: userEmail,
          senderName: passengerName,
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
    
    // Intercity pricing: add ₹250 extra to the driver base fare if distance is > 35 KM
    if (isIntercity) {
      catBase += 250.00;
    }

    const catPerKm = parseFloat(cat.ratePerKm !== undefined ? cat.ratePerKm : settings.ratePerKm);
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
    if (pickupCoords && dropoffCoords) {
      const mapIframe = document.getElementById('map-iframe');
      if (mapIframe && mapIframe.contentWindow) {
        mapIframe.contentWindow.postMessage({
          type: 'DRAW_ROUTE',
          pickup: pickupCoords,
          dropoff: dropoffCoords
        }, '*');
      }
    }
  }, [pickupCoords, dropoffCoords]);

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

  // Poll status of the ride request once created
  useEffect(() => {
    if (!activeRide) return;

    const pollStatus = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/rides/${activeRide.id}/status`);
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'Accepted') {
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
            setShowRating(true);
            setIsSearching(false);
            setRideAccepted(false);
          }
        }
      } catch (err) {
        console.error("Error polling ride status:", err);
      }
    };

    const interval = setInterval(pollStatus, 2000);
    return () => clearInterval(interval);
  }, [activeRide, rideAccepted]);

  const getFilteredLocations = (input) => {
    if (!input) return INDIAN_LOCATIONS;
    return INDIAN_LOCATIONS.filter(loc => 
      loc.name.toLowerCase().includes(input.toLowerCase())
    );
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

    try {
      setIsSearching(true);
      const response = await fetch('http://localhost:5000/api/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pickup,
          dropoff,
          fare: parseFloat(customFare).toFixed(2),
          passengerName: localStorage.getItem('passengerName') || 'Anoop Nair',
          passengerEmail: localStorage.getItem('passengerEmail') || 'anoop.nair@gmail.com',
          pickupCoords,
          dropoffCoords
        })
      });

      if (response.ok) {
        const ride = await response.json();
        setActiveRide(ride);
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

  const handleCancelBooking = () => {
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

  const handleSubmitRating = async () => {
    if (!activeRide) return;
    try {
      await fetch(`http://localhost:5000/api/rides/${activeRide.id}/rate-driver`, {
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

  return (
    <div className="dashboard-page">
      <div className="dashboard-container container">
        <div className="dashboard-sidebar glass-card" style={{ zIndex: 10 }}>
          
          {/* Passenger Header & Profile Picture */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '14px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Passenger Avatar */}
              <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)', background: '#121624', flexShrink: 0 }}>
                {passengerProfilePic ? (
                  <img src={passengerProfilePic} alt="Passenger Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold', fontSize: '18px' }}>
                    <User size={22} />
                  </div>
                )}
                <label 
                  title="Change Profile Picture"
                  style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                >
                  <Camera size={16} />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleUploadPassengerProfilePic(e.target.files[0])} 
                    style={{ display: 'none' }} 
                  />
                </label>
              </div>

              <div>
                <h2 style={{ margin: 0, fontSize: '18px' }}>Passenger Portal</h2>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>HUM Customer Profile</span>
              </div>
            </div>
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

          {/* STATE 4: Rating Panel Screen (Shows after ride completion) */}
          {showRating && activeRide && (
            <div className="accepted-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', color: '#f59e0b' }}>
                <CheckCircle size={28} />
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Ride Concluded!</h2>
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
                  onChange={(e) => setPickup(e.target.value)}
                  onFocus={() => setPickupFocused(true)}
                  onBlur={() => setTimeout(() => setPickupFocused(false), 200)}
                />
                {pickupFocused && (
                  <div className="autocomplete-dropdown glass-card">
                    {getFilteredLocations(pickup).map((loc, idx) => (
                      <div 
                        onMouseDown={() => {
                          setPickup(loc.name);
                          setPickupCoords({ lat: loc.lat, lng: loc.lng });
                        }}
                        key={idx} 
                        className="dropdown-item" 
                      >
                        <MapPin size={14} style={{ marginRight: '8px', color: 'var(--primary)' }} />
                        {loc.name}
                      </div>
                    ))}
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
                  onChange={(e) => setDropoff(e.target.value)}
                  onFocus={() => setDropoffFocused(true)}
                  onBlur={() => setTimeout(() => setDropoffFocused(false), 200)}
                />
                {dropoffFocused && (
                  <div className="autocomplete-dropdown glass-card">
                    {getFilteredLocations(dropoff).map((loc, idx) => (
                      <div 
                        onMouseDown={() => {
                          setDropoff(loc.name);
                          setDropoffCoords({ lat: loc.lat, lng: loc.lng });
                        }}
                        key={idx} 
                        className="dropdown-item" 
                      >
                        <Navigation size={14} style={{ marginRight: '8px', color: 'var(--secondary)' }} />
                        {loc.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

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
                    <h4 style={{ margin: '0 0 2px 0', fontSize: '13px', color: '#d97706', fontWeight: '800' }}>Intercity Trip Active ({tripDistance} KM)</h4>
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
                      <span className="ride-eta">Max: {cat.maxPassengers} Passengers</span>
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

          {/* STATE 3: Ride Accepted & Driver Details */}
          {rideAccepted && activeRide && !showRating && (
            <div className="accepted-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
                <CheckCircle size={28} />
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>Driver Matched!</h2>
              </div>
              {activeRide.isIntercity && (
                <span style={{ alignSelf: 'flex-start', background: '#f59e0b', color: 'black', fontWeight: 'bold', fontSize: '11px', padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase' }}>
                  Intercity Trip Approved
                </span>
              )}
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                Your driver is arriving shortly at <strong>{pickup.split(',')[0]}</strong>.
              </p>
              
              {/* Driver and Vehicle Detail Card */}
              <div style={{ border: '1px solid var(--border)', borderRadius: '14px', padding: '16px', background: 'rgba(16, 185, 129, 0.03)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                      <span>INR {parseFloat(activeRide.fare).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f59e0b' }}>
                      <span>GST (5%):</span>
                      <span>+INR {(parseFloat(activeRide.fare) * 0.05).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', borderTop: '1px solid var(--border)', paddingTop: '4px' }}>
                      <span>Pay Driver (Cash):</span>
                      <span>INR {(parseFloat(activeRide.fare) * 1.05).toFixed(2)}</span>
                    </div>
                  </div>

                </div>
              </div>

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
    </div>
  );
};

export default PassengerDashboard;
