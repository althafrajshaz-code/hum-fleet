import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Power, MapPin, Navigation, Car, AlertTriangle, ShieldCheck, DollarSign, Wallet, FileText, CheckCircle, Camera, X, Coffee, Pause, Play, MessageSquare, Send, Flame, Zap, Award, TrendingUp, Gauge, Compass, Activity, Sparkles, Settings, CreditCard, User, ChevronRight, Eye, EyeOff } from 'lucide-react';
import Button from '../components/Button';
import './Dashboard.css';

const API_BASE = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.protocol !== 'capacitor:')
  ? 'http://localhost:5000'
  : (import.meta.env.VITE_BACKEND_URL || 'https://server-ashen-beta.vercel.app');


const DriverDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('dispatches'); // 'dispatches' | 'wallet' | 'messages' | 'settings'
  const [settingsSubTab, setSettingsSubTab] = useState('rates'); // 'rates' | 'documents' | 'profile' | 'bank' | 'vehicles'
  const [earningsPeriod, setEarningsPeriod] = useState('daily'); // 'daily' | 'weekly' | 'monthly'
  const [homeEarnings, setHomeEarnings] = useState(null);
  const [showEarningsHistory, setShowEarningsHistory] = useState(false);
  const [earningsHistoryPeriod, setEarningsHistoryPeriod] = useState('weekly');
  const [earningsData, setEarningsData] = useState(null);
  const [earningsLoading, setEarningsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [status, setStatus] = useState('Pending'); // Pending, Approved, Rejected
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [driverDetails, setDriverDetails] = useState(null);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('driverTheme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const email = localStorage.getItem('driverEmail');
    if (!email) {
      navigate('/driver/login');
    }
  }, [navigate]);

  // System & Payment Gateway States
  const [systemSettings, setSystemSettings] = useState(null);
  const [showPayDuesModal, setShowPayDuesModal] = useState(false);
  const [showDuesNoticeModal, setShowDuesNoticeModal] = useState(false);
  const [hasDismissedDuesModal, setHasDismissedDuesModal] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [isPayingDues, setIsPayingDues] = useState(false);
  const [payDuesSuccess, setPayDuesSuccess] = useState(false);
  const [payDuesError, setPayDuesError] = useState(null);

  // Admin Direct Messaging States
  const [adminMessages, setAdminMessages] = useState([]);
  const [showAdminMessagesModal, setShowAdminMessagesModal] = useState(false);
  const [driverReplyText, setDriverReplyText] = useState('');

  // In-Trip Passenger-Driver Chat States (Strictly enabled for matched driver & passenger on active ride)
  const [showDriverTripChat, setShowDriverTripChat] = useState(false);
  const [driverTripChatMessages, setDriverTripChatMessages] = useState([]);
  const [driverTripChatText, setDriverTripChatText] = useState('');
  const [driverTripChatError, setDriverTripChatError] = useState(null);

  // Dynamic Telemetry & 15-Hour Maximum Shift Limit States
  const [liveSpeed, setLiveSpeed] = useState(28);
  const [liveCompass, setLiveCompass] = useState('NNE 24°');
  const [shiftMinutes, setShiftMinutes] = useState(720); // Default 12 hours accumulated (Max 900 mins = 15 hours)
  const [dailyTarget, setDailyTarget] = useState({ earned: 1425, goal: 2000, percentage: 71 });
  const [surgeZones] = useState([
    { id: 1, name: 'Infopark & SmartCity (Kakkanad, Kochi)', multiplier: '2.4x Surge', distance: '1.2 KM', lat: 10.0088, lng: 76.3606, color: '#ef4444' },
    { id: 2, name: 'Cochin International Airport (COK)', multiplier: '1.9x Surge', distance: '4.8 KM', lat: 10.1520, lng: 76.4019, color: '#f59e0b' },
    { id: 3, name: 'Technopark Phase 1 (Trivandrum)', multiplier: '1.7x Surge', distance: '8.5 KM', lat: 8.5581, lng: 76.8816, color: '#3b82f6' }
  ]);

  // Custom driver rates state
  const [ratePerKm, setRatePerKm] = useState('15.00');
  const [ratePerHour, setRatePerHour] = useState('120.00');

  // Bank Account Details State
  const [bankHolder, setBankHolder] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankSaveStatus, setBankSaveStatus] = useState(null); // null | 'saving' | 'saved' | 'error'

  // Profile Edit State
  const [profileEditName, setProfileEditName] = useState('');
  const [profileEditPicPreview, setProfileEditPicPreview] = useState(null);
  const [profileEditPicBase64, setProfileEditPicBase64] = useState(null);
  const [profileNewPassword, setProfileNewPassword] = useState('');
  const [profileConfirmPassword, setProfileConfirmPassword] = useState('');
  const [showProfilePassword, setShowProfilePassword] = useState(false);
  const [profileSaveStatus, setProfileSaveStatus] = useState(null); // null | 'saving' | 'saved' | 'error'

  // Vehicle management states
  const [vehicles, setVehicles] = useState([]);
  const [newMake, setNewMake] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newYear, setNewYear] = useState('');
  const [newPlate, setNewPlate] = useState('');
  const [newVehiclePhotos, setNewVehiclePhotos] = useState({});
  const [newVehicleDocs, setNewVehicleDocs] = useState({});
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
  const [vehicleSaveStatus, setVehicleSaveStatus] = useState(null); // null | 'saving' | 'saved' | 'error'

  // Wallet State
  const [wallet, setWallet] = useState({ cashCollected: 0, toBePaid: 0 });

  // Real-time Active Ride States
  const [incomingRide, setIncomingRide] = useState(null);
  const [currentRide, setCurrentRide] = useState(null);

  // Pre-booked / scheduled ride states
  const [availablePreBooked, setAvailablePreBooked] = useState([]);
  const [myScheduledTrips, setMyScheduledTrips] = useState([]);

  // Bidirectional rating states
  const [showRating, setShowRating] = useState(false);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  // Travel Route / En-Route Destination states
  const [travelRoute, setTravelRoute] = useState(null); // The currently set route from the server
  const [routeInput, setRouteInput] = useState('');
  const [routeInputFocused, setRouteInputFocused] = useState(false);
  const [nominatimResults, setNominatimResults] = useState([]);
  const [isGeoSearching, setIsGeoSearching] = useState(false);
  const nominatimTimerRef = useRef(null);
  
  // Real-time GPS Trip Meter State
  const [liveGpsDistance, setLiveGpsDistance] = useState(0); // Accumulated live GPS trip kilometers
  const [lastGpsCoords, setLastGpsCoords] = useState(null);
  
  // End Trip Summary & Cash Collection states
  const [showEndTripSummary, setShowEndTripSummary] = useState(false);
  const [collectCash, setCollectCash] = useState(true);
  const [ridePin, setRidePin] = useState('');
  const [queuedRide, setQueuedRide] = useState(null);

  // Daily face verification states
  const [isDailyVerified, setIsDailyVerified] = useState(true);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [verifyStep, setVerifyStep] = useState('camera'); // 'camera' | 'preview' | 'submitting' | 'done'
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Vehicle Photos & Docs editing states
  const [driverPhotos, setDriverPhotos] = useState({});
  const [driverDocs, setDriverDocs] = useState({});
  const [driverProfilePic, setDriverProfilePic] = useState(null);

  const fetchStatus = async (initialLoad = false) => {
    const email = localStorage.getItem('driverEmail');
    if (!email) {
      navigate('/driver/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/drivers/status?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setStatus(data.status);
        setIsBlocked(data.isBlocked || false);
        setIsDailyVerified(true);
        setDriverDetails(data);
        if (data.photos) setDriverPhotos(data.photos);
        if (data.docs) setDriverDocs(data.docs);
        if (data.profilePic) setDriverProfilePic(data.profilePic);
        if (initialLoad) {
          setRatePerKm(data.ratePerKm || '15.00');
          setRatePerHour(data.ratePerHour || '120.00');
        }
        fetchVehicles();
      } else {
        localStorage.removeItem('driverEmail');
        navigate('/driver/login');
      }
    } catch (err) {
      console.error("Error fetching driver status from API:", err);
    } finally {
      if (initialLoad) setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    const email = localStorage.getItem('driverEmail');
    if (!email) return;
    try {
      const response = await fetch(`${API_BASE}/api/drivers/vehicles?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      }
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
    }
  };

  const handleActivateVehicle = async (vehicleId) => {
    const email = localStorage.getItem('driverEmail');
    try {
      const response = await fetch(`${API_BASE}/api/drivers/vehicles/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, vehicleId })
      });
      if (response.ok) {
        const data = await response.json();
        setVehicles(data.vehicles);
        alert('Vehicle activated successfully! All active ride details will now map to this vehicle.');
        fetchStatus(false);
      } else {
        alert('Failed to activate vehicle.');
      }
    } catch (err) {
      console.error("Error activating vehicle:", err);
      alert('Network error, please try again.');
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!confirm('Are you sure you want to remove this vehicle from your account?')) return;
    const email = localStorage.getItem('driverEmail');
    try {
      const response = await fetch(`${API_BASE}/api/drivers/vehicles`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, vehicleId })
      });
      if (response.ok) {
        const data = await response.json();
        setVehicles(data.vehicles);
        alert('Vehicle removed successfully.');
        fetchStatus(false);
      } else {
        const errData = await response.json();
        alert(errData.error || 'Failed to delete vehicle.');
      }
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      alert('Network error, please try again.');
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    if (!newMake.trim() || !newModel.trim() || !newYear.trim() || !newPlate.trim()) {
      alert('Please fill out all vehicle specifications.');
      return;
    }

    if (!newVehiclePhotos.front || !newVehiclePhotos.rear || !newVehiclePhotos.left || !newVehiclePhotos.right || !newVehiclePhotos.inside) {
      alert('Please upload all 5 required vehicle photos (Front, Rear, Left, Right, Inside Cabin).');
      return;
    }

    if (!newVehicleDocs.rc || !newVehicleDocs.pollution || !newVehicleDocs.insurance || !newVehicleDocs.fitness) {
      alert('Please upload all 4 required compliance documents (RC, Pollution, Insurance, Fitness).');
      return;
    }
    
    setVehicleSaveStatus('saving');
    const email = localStorage.getItem('driverEmail');
    try {
      const response = await fetch(`${API_BASE}/api/drivers/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          manufacturer: newMake.trim(),
          model: newModel.trim(),
          year: newYear.trim(),
          plate: newPlate.trim(),
          photos: newVehiclePhotos,
          docs: newVehicleDocs
        })
      });

      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
        alert('New vehicle added successfully!');
        setNewMake('');
        setNewModel('');
        setNewYear('');
        setNewPlate('');
        setNewVehiclePhotos({});
        setNewVehicleDocs({});
        setShowAddVehicleForm(false);
        setVehicleSaveStatus('saved');
        fetchStatus(false);
        setTimeout(() => setVehicleSaveStatus(null), 3000);
      } else {
        const errData = await response.json();
        alert(errData.error || 'Failed to add vehicle.');
        setVehicleSaveStatus('error');
        setTimeout(() => setVehicleSaveStatus(null), 3000);
      }
    } catch (err) {
      console.error("Error adding vehicle:", err);
      alert('Network error, please verify the server is running.');
      setVehicleSaveStatus('error');
      setTimeout(() => setVehicleSaveStatus(null), 3000);
    }
  };

  const handleUploadProfilePic = async (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result;
      setDriverProfilePic(base64Data);
      const email = localStorage.getItem('driverEmail');
      try {
        const res = await fetch(`${API_BASE}/api/drivers/profile-pic`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, profilePic: base64Data })
        });
        if (res.ok) {
          alert('Driver Profile Picture updated successfully!');
          fetchStatus(false);
        }
      } catch (err) {
        console.error('Failed to update profile pic:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadCarPhoto = async (side, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result;
      const updatedPhotos = { ...driverPhotos, [side]: base64Data };
      setDriverPhotos(updatedPhotos);

      const email = localStorage.getItem('driverEmail');
      try {
        const res = await fetch(`${API_BASE}/api/drivers/photos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, photos: { [side]: base64Data } })
        });
        if (res.ok) {
          alert(`Vehicle ${side.charAt(0).toUpperCase() + side.slice(1)} photo updated successfully!`);
          fetchStatus(false);
        }
      } catch (err) {
        console.error('Failed to update photo:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadDoc = async (docId, docLabel, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result;
      const updatedDocs = { ...driverDocs, [docId]: base64Data };
      setDriverDocs(updatedDocs);

      const email = localStorage.getItem('driverEmail');
      try {
        const res = await fetch(`${API_BASE}/api/drivers/photos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, docs: { [docId]: base64Data } })
        });
        if (res.ok) {
          alert(`${docLabel} document updated successfully!`);
          fetchStatus(false);
        }
      } catch (err) {
        console.error('Failed to update document:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  // ---- Daily Verification Camera Handlers ----
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      setCameraStream(stream);
      setVerifyStep('camera');
      setCapturedPhoto(null);
      // Attach stream to video element after modal renders
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      alert('Camera access denied. Please allow camera permissions to complete daily verification.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
    setCapturedPhoto(dataUrl);
    setVerifyStep('preview');
    stopCamera();
  };

  const submitVerification = async () => {
    const email = localStorage.getItem('driverEmail');
    setVerifyStep('submitting');
    try {
      const response = await fetch(`${API_BASE}/api/drivers/verify-daily`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, photo: capturedPhoto })
      });
      if (response.ok) {
        setIsDailyVerified(true);
        setVerifyStep('done');
        setTimeout(() => {
          setShowVerifyModal(false);
          setCapturedPhoto(null);
          setVerifyStep('camera');
          // Now actually go online after successful verification
          goOnline();
        }, 1500);
      } else {
        alert('Verification failed. Please try again.');
        setVerifyStep('camera');
        startCamera();
      }
    } catch (err) {
      console.error('Verification error:', err);
      alert('Could not connect to server. Please try again.');
      setVerifyStep('camera');
    }
  };

  const goOnline = () => {
    setIsOnline(true);
    const email = localStorage.getItem('driverEmail');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          await fetch(`${API_BASE}/api/drivers/location`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, lat: position.coords.latitude, lng: position.coords.longitude, isOnline: true })
          });
        } catch (err) {
          console.error('Error updating location:', err);
        }
      });
    } else {
      fetch(`${API_BASE}/api/drivers/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, isOnline: true })
      }).catch(err => console.error(err));
    }
    // Immediately fetch trips after going online
    fetchAvailablePreBooked();
    fetchMyScheduledTrips();
    fetchDriverActiveRide();
  };

  const goOffline = () => {
    setIsOnline(false);
    setIsPaused(false);
    const email = localStorage.getItem('driverEmail');
    fetch(`${API_BASE}/api/drivers/location`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, isOnline: false, isPaused: false })
    }).catch(err => console.error(err));
  };

  const togglePauseBreak = async (shouldPause) => {
    setIsPaused(shouldPause);
    const email = localStorage.getItem('driverEmail');
    try {
      await fetch(`${API_BASE}/api/drivers/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, isOnline: true, isPaused: shouldPause })
      });
    } catch (err) {
      console.error('Error toggling rest break:', err);
    }
  };

  const fetchWallet = async () => {
    const email = localStorage.getItem('driverEmail');
    if (!email) return;
    try {
      const response = await fetch(`${API_BASE}/api/drivers/wallet?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setWallet(data);
        if (parseFloat(data.toBePaid || 0) >= 700 && !hasDismissedDuesModal) {
          setShowDuesNoticeModal(true);
        }
      }
    } catch (err) {
      console.error("Error fetching driver wallet:", err);
    }
  };

  const fetchSystemSettings = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/settings`);
      if (response.ok) {
        const data = await response.json();
        setSystemSettings(data);
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
  };

  const fetchAdminMessages = async () => {
    const email = localStorage.getItem('driverEmail');
    try {
      const response = await fetch(`${API_BASE}/api/drivers/messages?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setAdminMessages(data);
      }
    } catch (err) {
      console.error("Error fetching admin direct messages:", err);
    }
  };

  const clearAdminMessages = async () => {
    const email = localStorage.getItem('driverEmail');
    try {
      await fetch(`${API_BASE}/api/drivers/messages/clear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      setAdminMessages([]);
    } catch (err) {
      console.error("Error clearing viewed admin messages:", err);
    }
  };

  const handleResetShift = async () => {
    const email = localStorage.getItem('driverEmail');
    try {
      const res = await fetch(`${API_BASE}/api/drivers/shift/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, force: true })
      });
      if (res.ok) {
        setShiftMinutes(0);
        setIsPaused(false);
        alert('6-Hour Rest Break Completed! Your 15-hour shift timer has been reset. You can now restart rides.');
      } else {
        const data = await res.json();
        alert(data.error || 'Could not reset shift timer.');
      }
    } catch (err) {
      console.error("Error resetting shift time:", err);
    }
  };

  const handleDriverReply = async (e) => {
    e.preventDefault();
    if (!driverReplyText || !driverReplyText.trim()) return;
    const email = localStorage.getItem('driverEmail');
    try {
      const response = await fetch(`${API_BASE}/api/admin/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverEmail: email,
          sender: driverDetails?.name || 'Driver Partner',
          text: driverReplyText.trim()
        })
      });
      if (response.ok) {
        setDriverReplyText('');
        fetchAdminMessages();
      }
    } catch (err) {
      console.error("Error sending reply to admin:", err);
    }
  };

  // In-Trip Passenger-Driver Chat Helpers
  const fetchDriverTripChatMessages = async () => {
    if (!currentRide) return;
    const email = localStorage.getItem('driverEmail');
    try {
      const res = await fetch(`${API_BASE}/api/rides/messages?rideId=${currentRide.id}&userEmail=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setDriverTripChatMessages(data);
      }
    } catch (err) {
      console.error("Error fetching driver trip chat messages:", err);
    }
  };

  const sendDriverTripChatMessage = async (e) => {
    e.preventDefault();
    setDriverTripChatError(null);
    if (!driverTripChatText || !driverTripChatText.trim() || !currentRide) return;

    // Quick frontend check for phone digits
    const digitsOnly = driverTripChatText.replace(/[\s\-\.\+\(\)]/g, '');
    if (/\d{10,}/.test(digitsOnly)) {
      setDriverTripChatError('🚫 Safety Policy Alert: Phone numbers cannot be shared in chat.');
      return;
    }

    const email = localStorage.getItem('driverEmail');
    try {
      const res = await fetch(`${API_BASE}/api/rides/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rideId: currentRide.id,
          senderEmail: email,
          senderName: driverDetails?.name || 'Driver Partner',
          text: driverTripChatText.trim()
        })
      });
      if (res.ok) {
        setDriverTripChatText('');
        setDriverTripChatError(null);
        fetchDriverTripChatMessages();
      } else {
        const data = await res.json();
        setDriverTripChatError(data.error || 'Failed to send message.');
      }
    } catch (err) {
      console.error("Error sending driver trip chat message:", err);
    }
  };

  useEffect(() => {
    if (!showDriverTripChat || !currentRide) return;
    fetchDriverTripChatMessages();
    const interval = setInterval(fetchDriverTripChatMessages, 2000);
    return () => clearInterval(interval);
  }, [showDriverTripChat, currentRide]);

  // Real-time GPS Tracker & Running Kilometer Meter Effect
  useEffect(() => {
    if (!currentRide) {
      setLiveGpsDistance(0);
      setLastGpsCoords(null);
      return;
    }

    // Set initial distance baseline from ride estimation
    if (liveGpsDistance === 0 && currentRide.totalKm) {
      setLiveGpsDistance(parseFloat(currentRide.totalKm) || 0);
    }

    let watchId = null;
    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLat = position.coords.latitude;
          const newLng = position.coords.longitude;

          setLastGpsCoords((prevCoords) => {
            if (prevCoords) {
              const deltaKm = getFrontendDistance(prevCoords.lat, prevCoords.lng, newLat, newLng);
              // Only add valid motion delta (ignore tiny GPS drift under 15 meters)
              if (deltaKm > 0.015 && deltaKm < 3.0) {
                setLiveGpsDistance((prevDist) => parseFloat((prevDist + deltaKm).toFixed(2)));
              }
            }
            return { lat: newLat, lng: newLng };
          });
        },
        (err) => console.log('GPS Geolocation watch warning:', err.message),
        { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
      );
    }

    return () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [currentRide]);

  // Sync liveGpsDistance with backend during active ride
  const latestLiveGpsDistance = useRef(0);
  useEffect(() => {
    latestLiveGpsDistance.current = liveGpsDistance;
  }, [liveGpsDistance]);

  useEffect(() => {
    if (!currentRide || currentRide.status !== 'In Progress') return;
    const interval = setInterval(() => {
      const dist = latestLiveGpsDistance.current;
      if (dist > 0) {
        fetch(`${API_BASE}/api/rides/${currentRide.id}/update-distance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ liveGpsDistance: dist })
        }).catch(err => console.error("Error updating live distance:", err));
      }
    }, 15000); // Poll every 15 seconds
    return () => clearInterval(interval);
  }, [currentRide]);

  useEffect(() => {
    const email = localStorage.getItem('driverEmail');
    if (!email) {
      navigate('/driver/login');
      return;
    }
    fetchStatus(true);
    // Fetch home earnings summary
    fetch(`${API_BASE}/api/drivers/earnings?email=${encodeURIComponent(email)}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setHomeEarnings(d); })
      .catch(() => {});
    fetchWallet();
    fetchAdminMessages();
    fetchSystemSettings();
    fetchTravelRoute();
  }, []);

  const fetchTravelRoute = async () => {
    const email = localStorage.getItem('driverEmail');
    if (!email) return;
    try {
      const response = await fetch(`${API_BASE}/api/drivers/travel-route?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setTravelRoute(data);
      }
    } catch (err) {
      console.error("Error fetching travel route:", err);
    }
  };

  const handleSetTravelRoute = async (locName, locCoords) => {
    const email = localStorage.getItem('driverEmail');
    if (!email) return;
    try {
      const response = await fetch(`${API_BASE}/api/drivers/travel-route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, destination: locName, destinationCoords: locCoords })
      });
      if (response.ok) {
        const data = await response.json();
        setTravelRoute(data.travelRoute);
        setRouteInput('');
      }
    } catch (err) {
      console.error("Error setting travel route:", err);
    }
  };

  const handleClearTravelRoute = async () => {
    const email = localStorage.getItem('driverEmail');
    if (!email) return;
    try {
      const response = await fetch(`${API_BASE}/api/drivers/travel-route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, destination: null, destinationCoords: null })
      });
      if (response.ok) {
        setTravelRoute(null);
      }
    } catch (err) {
      console.error("Error clearing travel route:", err);
    }
  };

  // Debounced Nominatim geocoding search for travel route
  const searchNominatim = (query) => {
    if (nominatimTimerRef.current) clearTimeout(nominatimTimerRef.current);
    if (!query || query.trim().length < 3) {
      setNominatimResults([]);
      return;
    }
    nominatimTimerRef.current = setTimeout(async () => {
      setIsGeoSearching(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', Kerala, India')}&format=json&addressdetails=1&limit=8&countrycodes=in&viewbox=74.5,8.0,77.5,12.8&bounded=1`;
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map(item => ({
            name: item.display_name.replace(/, India$/i, ''),
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            isGeoResult: true
          }));
          setNominatimResults(mapped);
        }
      } catch (err) {
        console.error('Nominatim geocoding error:', err);
      } finally {
        setIsGeoSearching(false);
      }
    }, 400);
  };

  // Poll status of driver profile updates & admin messages
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStatus(false);
      fetchWallet();
      fetchAdminMessages();
      fetchSystemSettings();
      fetchTravelRoute();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchAvailablePreBooked = async () => {
    const email = localStorage.getItem('driverEmail');
    if (!email) return;
    try {
      const response = await fetch(`${API_BASE}/api/rides/prebooked?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setAvailablePreBooked(data);
      }
    } catch (err) {
      console.error("Error fetching available prebooked rides:", err);
    }
  };

  const fetchMyScheduledTrips = async () => {
    const email = localStorage.getItem('driverEmail');
    if (!email) return;
    try {
      const response = await fetch(`${API_BASE}/api/rides/driver/scheduled?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setMyScheduledTrips(data);
      }
    } catch (err) {
      console.error("Error fetching scheduled trips:", err);
    }
  };

  const fetchDriverActiveRide = async () => {
    const email = localStorage.getItem('driverEmail');
    if (!email) return;
    try {
      const response = await fetch(`${API_BASE}/api/rides/driver/active?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          if (data.current) setCurrentRide(data.current);
          else setCurrentRide(null);
          
          if (data.queued && data.queued.length > 0) setQueuedRide(data.queued[0]);
          else setQueuedRide(null);
        }
      }
    } catch (err) {
      console.error("Error fetching active driver ride:", err);
    }
  };

  const handleAcceptPreBooked = async (rideId) => {
    if (!driverDetails) return;
    
    // ₹1500 BALANCE LOCK check before local submit
    const CASH_LOCK_THRESHOLD = 1500;
    const driverPendingBalance = parseFloat(wallet.toBePaid || 0);
    const ride = availablePreBooked.find(r => r.id === rideId);
    const isCashTrip = ride ? (ride.paymentType === 'cash' || !ride.paymentType) : true;

    if (isCashTrip && driverPendingBalance > CASH_LOCK_THRESHOLD) {
      alert(`Your pending balance of ₹${driverPendingBalance.toFixed(2)} exceeds ₹${CASH_LOCK_THRESHOLD}. You can only accept prepaid trips until you settle your dues with HUM Fleet.`);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/rides/${rideId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          driverName: driverDetails.name,
          driverPhone: driverDetails.phone,
          driverEmail: driverDetails.email,
          vehicleModel: driverDetails.activeVehicle?.model || 'Tata Nexon',
          vehiclePlate: driverDetails.activeVehicle?.plateNo || 'DL 3C AY 4567'
        })
      });

      if (response.ok) {
        alert("Pre-booked trip accepted successfully! It has been added to your scheduled trips.");
        fetchAvailablePreBooked();
        fetchMyScheduledTrips();
      } else {
        const errData = await response.json();
        alert(errData.error || "Failed to accept trip.");
        fetchAvailablePreBooked();
      }
    } catch (err) {
      console.error("Failed to accept prebooked ride:", err);
      alert("Error accepting prebooked ride.");
    }
  };

  const handleStartScheduledTrip = async (rideId) => {
    if (!isOnline) {
      alert("Please go Online first to start this trip!");
      return;
    }
    if (currentRide) {
      alert("Please complete or cancel your current active trip before starting another one!");
      return;
    }
    if (!window.confirm("Are you ready to activate and start this scheduled trip now? This will make the trip active on the passenger's screen.")) return;

    try {
      const response = await fetch(`${API_BASE}/api/rides/${rideId}/start`, {
        method: 'POST'
      });
      if (response.ok) {
        const ride = await response.json();
        setCurrentRide(ride);
        alert("Trip started! You are now navigating to the passenger pickup point.");
      } else {
        alert("Failed to start scheduled trip.");
      }
    } catch (err) {
      console.error("Error starting scheduled trip:", err);
      alert("Error starting scheduled trip.");
    }
  };

  useEffect(() => {
    fetchDriverActiveRide();
    fetchAvailablePreBooked();
    fetchMyScheduledTrips();
  }, []);

  useEffect(() => {
    const checkScheduledRequests = () => {
      fetchMyScheduledTrips();
      if (isOnline && !currentRide && !showRating) {
        fetchAvailablePreBooked();
      }
    };
    const interval = setInterval(checkScheduledRequests, 5000);
    return () => clearInterval(interval);
  }, [isOnline, currentRide, showRating]);

  // Real-time active ride request polling loop
  useEffect(() => {
    // If offline, showing rating, or already have a queued ride, don't poll
    if (!isOnline || showRating || queuedRide) return;
    
    // Check 7 KM threshold if we are on a trip
    if (currentRide) {
      const baseTotal = parseFloat(currentRide.totalKm || 8.0);
      const liveDist = parseFloat(liveGpsDistance || 0);
      const remainingDistance = baseTotal - liveDist;
      
      // Only poll for next ride if we are <= 7 KM from destination
      if (remainingDistance > 7.0) return;
    }

    const checkActiveRequests = async () => {
      try {
        const email = localStorage.getItem('driverEmail');
        const response = await fetch(`${API_BASE}/api/rides/active?email=${encodeURIComponent(email)}`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            // New incoming ride detected!
            if (!incomingRide || incomingRide.id !== data.id) {
              setIncomingRide(data);
              
              // Voice synthesis "You have a ride"
              if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance("You have a ride.");
                const voices = window.speechSynthesis.getVoices();
                // Try to find a female voice
                const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Google UK English Female') || v.name.includes('Samantha') || v.name.includes('Victoria'));
                if (femaleVoice) {
                  utterance.voice = femaleVoice;
                }
                window.speechSynthesis.speak(utterance);
              }
            }
          } else {
            setIncomingRide(null);
          }
        }
      } catch (err) {
        console.error("Failed to query active requests:", err);
      }
    };

    const interval = setInterval(checkActiveRequests, 2000);
    return () => clearInterval(interval);
  }, [isOnline, currentRide, showRating]);

  // Sync maps on driver coordinates change
  useEffect(() => {
    if (driverDetails && isOnline) {
      const mapIframe = document.getElementById('driver-map-iframe');
      if (mapIframe && mapIframe.contentWindow) {
        mapIframe.contentWindow.postMessage({
          type: 'SET_DRIVER_LOCATION',
          lat: driverDetails.lat || 28.6304,
          lng: driverDetails.lng || 77.2177
        }, '*');
      }
    }
  }, [driverDetails, isOnline]);

  const handleSaveRates = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem('driverEmail');
    if (!email) return;

    try {
      // Fetch platform settings limits
      const settingsResponse = await fetch(`${API_BASE}/api/settings`);
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        
        if (parseFloat(ratePerKm) < parseFloat(settingsData.ratePerKm)) {
          alert(`Your custom Rate/KM cannot be less than the platform minimum of ₹${settingsData.ratePerKm}!`);
          return;
        }
        
        if (parseFloat(ratePerHour) < parseFloat(settingsData.minRatePerHour)) {
          alert(`Your custom Rate/Hour cannot be less than the platform minimum of ₹${settingsData.minRatePerHour}!`);
          return;
        }
      }

      const response = await fetch(`${API_BASE}/api/drivers/rates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, ratePerKm, ratePerHour })
      });
      if (response.ok) {
        alert('Your custom rates have been updated successfully!');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update rates.');
      }
    } catch (err) {
      console.error("Error saving rates:", err);
      alert('Failed to connect to API server.');
    }
  };

  const handleAcceptRide = async () => {
    if (!incomingRide) return;

    // Frontend guard: block cash trip acceptance if balance > ₹1500
    const CASH_LOCK_THRESHOLD = 1500;
    const isCashTrip = incomingRide.paymentType === 'cash' || !incomingRide.paymentType;
    if (isCashTrip && parseFloat(wallet.toBePaid || 0) > CASH_LOCK_THRESHOLD) {
      alert(`⚠️ Balance Lock Active!

Your pending HUM Fleet dues of ₹${parseFloat(wallet.toBePaid).toFixed(2)} exceed the ₹1,500 limit.

You can only accept prepaid trips until your balance is cleared.`);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/rides/${incomingRide.id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverName: driverDetails.name,
          driverPhone: driverDetails.phone,
          driverEmail: driverDetails.email,
          vehicleModel: driverDetails.activeVehicle.model,
          vehiclePlate: driverDetails.activeVehicle.plate
        })
      });
      const data = await response.json();
      if (response.ok) {
        setIncomingRide(null);
        if (currentRide) {
          setQueuedRide(data);
          alert("Next trip queued! It will begin after you complete your current trip.");
        } else {
          setCurrentRide(data);
          alert("Trip accepted! You are now navigating to the passenger pickup point.");
        }
        fetchData();
      } else if (response.status === 403) {
        const errData = await response.json();
        alert(`⚠️ ${errData.message}`);
      } else {
        alert('Failed to accept ride request.');
      }
    } catch (err) {
      console.error("Error accepting ride request:", err);
    }
  };

  const handleCancelRide = async () => {
    if (!currentRide) return;
    try {
      const response = await fetch(`${API_BASE}/api/rides/${currentRide.id}/cancel`, {
        method: 'POST'
      });
      if (response.ok) {
        setCurrentRide(null);
        fetchWallet();
      } else {
        alert('Failed to cancel ride.');
      }
    } catch (err) {
      console.error("Error cancelling ride:", err);
    }
  };

  const handleVerifyPin = async () => {
    if (!ridePin || ridePin.length !== 6) {
      alert("Please enter a valid 6-digit PIN.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/api/rides/${currentRide.id}/verify-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: ridePin })
      });
      const data = await response.json();
      if (response.ok) {
        alert("PIN verified successfully! Trip is now in progress.");
        fetchData();
        setRidePin('');
      } else {
        alert(data.error || "Invalid PIN. Please ask the passenger for their 6-digit ID.");
      }
    } catch (err) {
      console.error('Error verifying PIN:', err);
      alert('Failed to verify PIN. Please check your connection.');
    }
  };

  const handleCompleteRide = async (collectCashVal = true) => {
    if (!currentRide) return;
    try {
      const response = await fetch(`${API_BASE}/api/rides/${currentRide.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ collectCash: collectCashVal })
      });
      if (response.ok) {
        setShowEndTripSummary(false);
        setShowRating(true);
      } else {
        alert('Failed to complete ride.');
      }
    } catch (err) {
      console.error("Error completing ride:", err);
    }
  };

  const handleSubmitRating = async () => {
    if (!currentRide) return;
    try {
      await fetch(`${API_BASE}/api/rides/${currentRide.id}/rate-passenger`, {
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
      console.error("Failed to submit passenger rating:", err);
    }

    alert('Passenger feedback registered successfully!');
    if (queuedRide) {
      setCurrentRide(queuedRide);
      setQueuedRide(null);
      alert(`Ride completed. Your queued trip to ${queuedRide.dropoff} is now active!`);
    } else {
      setCurrentRide(null);
    }
    setShowRating(false);
    setRatingValue(5);
    setRatingComment('');
    fetchWallet();
  };

  if (loading) {
    return (
      <div className="dashboard-page flex-center">
        <div className="request-pulse"></div>
      </div>
    );
  }

  // Pending Approval State Layout
  if (status === 'Pending') {
    return (
      <div className="dashboard-page flex-center" style={{ minHeight: '80vh' }}>
        <div className="auth-card glass-card text-center animate-fade-in" style={{ maxWidth: '480px', padding: '40px 30px' }}>
          <div className="alert-badge text-gradient" style={{ animation: 'pulse 2s infinite', fontSize: '48px', marginBottom: '20px' }}>
            ⏳
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>Registration Pending Approval</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6' }}>
            Thank you for applying to join the HUM Fleet! Your driving documents, vehicle photos, and Indian bank account details are currently being reviewed by our administration panel.
          </p>
          <hr className="divider" style={{ margin: '24px 0' }} />
          <p style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 'bold' }}>
            We will activate your dashboard once approval is processed. Please check back shortly.
          </p>
          <Button variant="outline" style={{ marginTop: '20px', width: '100%' }} onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Rejected Driver State Layout
  if (status === 'Rejected') {
    return (
      <div className="dashboard-page flex-center" style={{ minHeight: '80vh' }}>
        <div className="auth-card glass-card text-center animate-fade-in" style={{ maxWidth: '480px', padding: '40px 30px', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
          <div className="alert-badge" style={{ fontSize: '48px', marginBottom: '20px', color: '#ef4444' }}>
            ⚠️
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ef4444', marginBottom: '12px' }}>Application Rejected</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6' }}>
            We regret to inform you that your application does not meet our compliance requirements or document checks at this time.
          </p>
          <hr className="divider" style={{ margin: '24px 0' }} />
          <Button variant="primary" style={{ width: '100%' }} onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Admin Blocked Driver State Layout
  if (isBlocked) {
    return (
      <div className="dashboard-page flex-center" style={{ minHeight: '80vh' }}>
        <div className="auth-card glass-card text-center animate-fade-in" style={{ maxWidth: '500px', padding: '40px 30px', borderColor: 'rgba(239, 68, 68, 0.35)', background: 'rgba(239,68,68,0.04)' }}>
          <div style={{ fontSize: '52px', marginBottom: '20px' }}>🚫</div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ef4444', marginBottom: '12px' }}>Account Blocked</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.7' }}>
            Your driver account has been <strong style={{ color: '#ef4444' }}>temporarily blocked</strong> by HUM Fleet administration.
            You will not receive any trip requests while your account is suspended.
          </p>
          <hr className="divider" style={{ margin: '24px 0' }} />
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#fca5a5', lineHeight: '1.6' }}>
              📞 Please contact <strong style={{ color: '#ef4444' }}>HUM Fleet support</strong> to understand the reason for the block and to request reinstatement of your account.
            </p>
          </div>
          <Button variant="outline" style={{ width: '100%', borderColor: '#ef4444', color: '#ef4444' }} onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container container">
        <div className="dashboard-sidebar glass-card" style={{ zIndex: 10 }}>
          
          {/* DRIVER PROFILE & ONLINE STATUS CARD */}
          <div className="driver-header-card" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '18px 14px',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a5f 100%)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            borderRadius: '16px',
            marginBottom: '16px',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.2)'
          }}>
            {/* 1. CENTERED DRIVER PROFILE SECTION */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px', padding: '6px 0' }}>
              {/* Centered Profile Avatar */}
              <div style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(255,255,255,0.7)', background: '#1e1b4b', boxShadow: '0 0 0 4px rgba(255,255,255,0.12)', margin: '0 auto' }}>
                {driverProfilePic ? (
                  <img src={driverProfilePic} alt="Driver Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold', fontSize: '22px' }}>
                    {(driverDetails?.name || 'D').charAt(0)}
                  </div>
                )}
                <label 
                  title="Change Profile Picture"
                  style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                >
                  <Camera size={18} />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleUploadProfilePic(e.target.files[0])} 
                    style={{ display: 'none' }} 
                  />
                </label>
              </div>

              {/* Centered Driver Name & Rating Badge */}
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>
                  {driverDetails?.name || 'Partner Driver'}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>HUM Fleet Partner</span>
                  <span style={{ background: 'rgba(251, 191, 36, 0.2)', border: '1px solid rgba(251, 191, 36, 0.5)', color: '#fbbf24', fontSize: '11px', fontWeight: '800', borderRadius: '12px', padding: '1px 8px' }}>
                    ★ {driverDetails?.rating || '5.0'} Rating
                  </span>
                </div>
              </div>
            </div>
            
            {/* TODAY'S EARNINGS CARD — ABOVE GO ONLINE */}
            <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '12px 14px' }}>
              <div style={{ fontSize: '10px', fontWeight: '800', color: 'rgba(16,185,129,0.7)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>📅 Today's Earnings</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#10b981' }}>₹{homeEarnings?.daily?.net ?? '0.00'}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '1px' }}>Net Earned</div>
                </div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#f59e0b' }}>₹{homeEarnings?.daily?.gross ?? '0.00'}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '1px' }}>Gross</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#3b82f6' }}>{homeEarnings?.daily?.count ?? 0}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '1px' }}>Trips</div>
                </div>
              </div>
            </div>

            {/* VIEW EARNINGS HISTORY BUTTON */}
            <button
              onClick={() => setShowEarningsHistory(true)}
              style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.55)', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
            >
              <TrendingUp size={13} /> View Earnings History
            </button>


            {/* 2. GO ONLINE BUTTON (POSITIONED DIRECTLY DOWN / UNDER THE PROFILE) */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {isOnline && !currentRide && (
                <Button 
                  variant={isPaused ? 'primary' : 'outline'} 
                  onClick={() => togglePauseBreak(!isPaused)}
                  style={{
                    flex: 1,
                    borderColor: isPaused ? '#f59e0b' : 'var(--border)',
                    background: isPaused ? '#f59e0b' : 'transparent',
                    color: isPaused ? '#000' : 'var(--text-main)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', padding: '12px'
                  }}
                >
                  {isPaused ? <Play size={16} /> : <Coffee size={16} color="#f59e0b" />}
                  {isPaused ? 'Resume Trips' : 'Take Rest Break'}
                </Button>
              )}

              <Button 
                variant={isOnline ? 'outline' : 'primary'} 
                className={isOnline ? 'status-online' : ''}
                onClick={async () => {
                  if (isOnline) {
                    // Go offline — sync status to backend
                    goOffline();
                    return;
                  }
                  // Going online — check daily verification first
                  if (!isDailyVerified) {
                    setShowVerifyModal(true);
                    setVerifyStep('camera');
                    setCapturedPhoto(null);
                    // Start camera after modal state renders
                    setTimeout(() => startCamera(), 200);
                  } else {
                    goOnline();
                  }
                }}
                style={{
                  flex: 1,
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: isOnline ? 'rgba(239, 68, 68, 0.12)' : 'linear-gradient(135deg, #10b981, #059669)',
                  color: isOnline ? '#ef4444' : '#ffffff',
                  borderColor: isOnline ? '#ef4444' : 'transparent',
                  boxShadow: isOnline ? '0 4px 14px rgba(239,68,68,0.2)' : '0 4px 16px rgba(16, 185, 129, 0.35)'
                }}
              >
                <Power size={18} /> {isOnline ? 'Go Offline' : 'Go Online'}
              </Button>
            </div>
          </div>

          {/* DRIVER TRAVEL ROUTE / DESTINATION FILTER */}
          <div className="glass-card" style={{ padding: '16px', background: travelRoute ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)', border: travelRoute ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: travelRoute ? '0' : '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Navigation size={16} color={travelRoute ? '#10b981' : 'var(--text-muted)'} />
                <span style={{ fontSize: '13px', fontWeight: '700', color: travelRoute ? '#10b981' : 'var(--text-main)' }}>Destination Filter</span>
              </div>
              {travelRoute && (
                <button onClick={handleClearTravelRoute} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', fontWeight: '800', cursor: 'pointer', padding: '4px 8px' }}>CLEAR</button>
              )}
            </div>

            {travelRoute ? (
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Currently matching rides along route to:</div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="#f59e0b" /> {travelRoute.destination}
                </div>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <input 
                  type="text"
                  className="input-field"
                  placeholder="Set travel destination..."
                  value={routeInput}
                  onChange={(e) => { setRouteInput(e.target.value); searchNominatim(e.target.value); }}
                  onFocus={() => setRouteInputFocused(true)}
                  onBlur={() => setTimeout(() => setRouteInputFocused(false), 250)}
                  style={{ fontSize: '12px', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                {routeInputFocused && (
                  <div className="autocomplete-dropdown glass-card" style={{ zIndex: 100 }}>
                    {isGeoSearching && (
                      <div className="dropdown-item" style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '14px', height: '14px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                        Searching locations...
                      </div>
                    )}
                    {nominatimResults.map((loc, idx) => (
                      <div 
                        onMouseDown={() => handleSetTravelRoute(loc.name, { lat: loc.lat, lng: loc.lng })}
                        key={idx} 
                        className="dropdown-item" 
                      >
                        <Navigation size={14} style={{ marginRight: '8px', color: 'var(--secondary)' }} />
                        {loc.name}
                      </div>
                    ))}
                    {!isGeoSearching && routeInput.trim().length >= 3 && nominatimResults.length === 0 && (
                      <div className="dropdown-item" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                        No locations found.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* DEDICATED ROW UNDER GO ONLINE BUTTON FOR ADMIN MESSAGE NOTICE (ELECTRIC PURPLE COLOUR THEME) */}
          {adminMessages.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowAdminMessagesModal(true);
                  clearAdminMessages();
                }}
                style={{
                  width: '100%',
                  position: 'relative',
                  borderColor: '#8b5cf6',
                  color: '#a78bfa',
                  background: 'rgba(139, 92, 246, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(139, 92, 246, 0.25)'
                }}
              >
                <MessageSquare size={16} color="#a78bfa" /> 💬 New Notice from Admin
                <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: '#fff', fontSize: '10px', borderRadius: '10px', padding: '2px 8px', fontWeight: '800' }}>
                  {adminMessages.length}
                </span>
              </Button>
            </div>
          )}

          {/* PARTNER DASHBOARD MENU VERTICAL LIST */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)', marginBottom: '4px', paddingLeft: '4px' }}>
              📋 Partner Dashboard Menu
            </span>

            {/* 1. TRIPS & DISPATCHES */}
            <button
              onClick={() => setActiveMenu('dispatches')}
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                border: activeMenu === 'dispatches' ? '1px solid var(--primary)' : '1px solid var(--border)',
                background: activeMenu === 'dispatches' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.01)',
                color: activeMenu === 'dispatches' ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Navigation size={18} color={activeMenu === 'dispatches' ? 'var(--primary)' : 'var(--text-muted)'} />
                <span>Trips & Dispatches</span>
              </div>
              <ChevronRight size={16} style={{ opacity: activeMenu === 'dispatches' ? 1 : 0.4 }} />
            </button>

            {/* 2. WALLET & DUES */}
            <button
              onClick={() => setActiveMenu('wallet')}
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                border: activeMenu === 'wallet' ? '1px solid var(--primary)' : '1px solid var(--border)',
                background: activeMenu === 'wallet' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.01)',
                color: activeMenu === 'wallet' ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Wallet size={18} color={activeMenu === 'wallet' ? 'var(--primary)' : 'var(--text-muted)'} />
                <span>Wallet & Dues</span>
              </div>
              <ChevronRight size={16} style={{ opacity: activeMenu === 'wallet' ? 1 : 0.4 }} />
            </button>

            {/* 3. MESSAGES (Shows count e.g. Messages (2) in Electric Purple when admin messages exist) */}
            <button
              onClick={() => {
                setActiveMenu('messages');
                if (adminMessages.length > 0) {
                  setShowAdminMessagesModal(true);
                  clearAdminMessages();
                }
              }}
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                border: activeMenu === 'messages' || adminMessages.length > 0 ? '1px solid #8b5cf6' : '1px solid var(--border)',
                background: activeMenu === 'messages' || adminMessages.length > 0 ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.01)',
                color: activeMenu === 'messages' || adminMessages.length > 0 ? '#a78bfa' : 'var(--text-main)',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquare size={18} color={activeMenu === 'messages' || adminMessages.length > 0 ? '#a78bfa' : 'var(--text-muted)'} />
                <span>Messages {adminMessages.length > 0 ? `(${adminMessages.length})` : ''}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {adminMessages.length > 0 && (
                  <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: '#fff', fontSize: '10px', borderRadius: '10px', padding: '2px 8px', fontWeight: '800' }}>
                    {adminMessages.length} NEW
                  </span>
                )}
                <ChevronRight size={16} style={{ opacity: activeMenu === 'messages' ? 1 : 0.4 }} />
              </div>
            </button>

            {/* 4. SETTINGS */}
            <button
              onClick={() => setActiveMenu('settings')}
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                border: activeMenu === 'settings' ? '1px solid var(--primary)' : '1px solid var(--border)',
                background: activeMenu === 'settings' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.01)',
                color: activeMenu === 'settings' ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Settings size={18} color={activeMenu === 'settings' ? 'var(--primary)' : 'var(--text-muted)'} />
                <span>Settings</span>
              </div>
              <ChevronRight size={16} style={{ opacity: activeMenu === 'settings' ? 1 : 0.4 }} />
            </button>
          </div>

           {/* ================= TAB 1: TRIPS & DISPATCHES ================= */}
          {activeMenu === 'dispatches' && (
            <div className="tab-pane animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* DYNAMIC TELEMETRY & SHIFT GOAL GAUGE */}
              <div className="dynamic-glow-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', padding: '12px', background: 'rgba(16, 185, 129, 0.03)', borderRadius: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Gauge size={18} />
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Speed & Heading</span>
                    <strong style={{ fontSize: '12px', color: 'var(--text-main)' }}>{isOnline ? '34 KM/H' : '0 KM/H'} • NNE</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: shiftMinutes >= 900 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.12)', color: shiftMinutes >= 900 ? '#ef4444' : '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Pause size={18} />
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Shift Driving Time</span>
                    <strong style={{ fontSize: '12px', color: shiftMinutes >= 900 ? '#ef4444' : '#f59e0b' }}>
                      {(shiftMinutes / 60).toFixed(1)} / 15.0 Hrs
                    </strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Activity size={18} />
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>GPS Telemetry</span>
                    <strong style={{ fontSize: '12px', color: '#3b82f6' }}>4G High Precision</strong>
                  </div>
                </div>
              </div>

              {/* 15-HOUR MAXIMUM SHIFT LIMIT & 6-HOUR MANDATORY REST WARNING BANNER */}
              {shiftMinutes >= 900 && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1.5px solid rgba(239, 68, 68, 0.5)',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  gap: '12px',
                  boxShadow: '0 4px 16px rgba(239, 68, 68, 0.15)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                      <AlertTriangle size={22} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#ef4444' }}>🛑 15h Shift Completed — Mandatory 6-Hour Rest Active</h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#fca5a5', lineHeight: '1.4' }}>
                        You have completed <strong>15 hours of driving shift with passengers</strong>. You must rest for <strong>6 full hours</strong> before restarting rides.
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="primary" 
                    onClick={handleResetShift}
                    style={{ background: '#ef4444', color: '#fff', border: 'none', fontWeight: '800', fontSize: '11px', padding: '8px 14px', whiteSpace: 'nowrap' }}
                  >
                    Restart Rides (After 6h Rest)
                  </Button>
                </div>
              )}



              {/* Active Rest Break Banner */}
              {isOnline && isPaused && (
                <div style={{
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1.5px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', flexShrink: 0 }}>
                      <Coffee size={22} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#f59e0b' }}>On Rest Break (Ride Requests Paused)</h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>You stay online without logging out, but new trip dispatches are paused while you rest.</p>
                    </div>
                  </div>
                  <Button 
                    variant="primary" 
                    onClick={() => togglePauseBreak(false)}
                    style={{ background: '#f59e0b', color: '#000', border: 'none', fontWeight: '800', fontSize: '12px', padding: '8px 16px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Play size={15} /> Resume Trips
                  </Button>
                </div>
              )}

              {/* Daily Verification Status Badge */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 14px',
                borderRadius: '12px',
                background: isDailyVerified ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
                border: `1px solid ${isDailyVerified ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.3)'}`,
                fontSize: '12px',
                fontWeight: '700',
                color: isDailyVerified ? '#10b981' : '#f59e0b'
              }}>
                {isDailyVerified ? <ShieldCheck size={16} /> : <Camera size={16} />}
                {isDailyVerified ? 'Face Verified — Today ✓' : 'Daily Face Verification Required'}
                {!isDailyVerified && (
                  <button
                    onClick={() => { setShowVerifyModal(true); setVerifyStep('camera'); setCapturedPhoto(null); setTimeout(() => startCamera(), 200); }}
                    style={{ marginLeft: 'auto', background: '#f59e0b', color: '#000', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}
                  >Verify Now</button>
                )}
              </div>

              {/* ₹700 Commission & GST Dues Notification Banner with WhatsApp Link (+91 8848347290) */}
              {parseFloat(wallet.toBePaid || 0) >= 700 && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(239, 68, 68, 0.12))',
                  border: '1.5px solid rgba(245, 158, 11, 0.6)',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <AlertTriangle size={22} color="#f59e0b" style={{ flexShrink: 0 }} />
                      <div>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#f59e0b' }}>
                          ⚠️ Platform Dues Payment Notice (≥ ₹700)
                        </h4>
                        <span style={{ fontSize: '12px', color: 'var(--text-main)' }}>
                          Your accumulated commission & GST dues have reached <strong style={{ color: '#ef4444' }}>₹{parseFloat(wallet.toBePaid).toFixed(2)}</strong>. Please clear your dues.
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', width: '100%', justifyContent: 'flex-end', marginTop: '4px' }}>
                      <a 
                        href={`https://api.whatsapp.com/send?phone=918848347290&text=${encodeURIComponent(`Hello Admin, I am driver ${driverInfo?.name || 'Partner'} (${driverInfo?.phone || ''}). My pending platform commission & GST dues have reached ₹${parseFloat(wallet.toBePaid || 0).toFixed(2)}. I would like to clear my dues.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#25D366',
                          color: '#ffffff',
                          fontWeight: '800',
                          fontSize: '12px',
                          padding: '8px 12px',
                          borderRadius: '8px'
                        }}
                      >
                        💬 Chat Admin on WhatsApp (+91 8848347290)
                      </a>

                      <button
                        onClick={() => setShowPayDuesModal(true)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          color: '#ffffff',
                          fontWeight: '800',
                          fontSize: '12px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <CreditCard size={14} /> Pay Dues Online
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ₹1500 Balance Lock Warning Banner */}
              {parseFloat(wallet.toBePaid || 0) > 1500 && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1.5px solid rgba(239, 68, 68, 0.5)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#ef4444' }}>Cash Trip Access Suspended</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#fca5a5', lineHeight: '1.5' }}>
                    Your pending balance of <strong style={{ color: '#ef4444' }}>₹{parseFloat(wallet.toBePaid).toFixed(2)}</strong> has exceeded the ₹1,500 limit.
                    You can only accept <strong>prepaid trips</strong> until your dues are settled with HUM Fleet.
                  </p>
                </div>
              )}

              {/* Rating Panel Screen (Shows after driver completes ride) */}
              {showRating && currentRide && (
                <div className="incoming-request animate-fade-in delay-100" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', color: '#f59e0b' }}>
                    <CheckCircle size={28} />
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Ride Complete!</h3>
                  </div>
                  
                  <div style={{ padding: '14px', border: '1px solid var(--border)', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.03)', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '800', margin: 0 }}>Rate passenger's behaviour</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                      How was your passenger **{currentRide.passengerName || 'Anoop Nair'}**?
                    </p>

                    <div style={{ display: 'flex', gap: '8px', margin: '6px 0' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatingValue(star)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
                        >
                          <span style={{ fontSize: '28px', color: star <= ratingValue ? '#f59e0b' : 'var(--border)' }}>★</span>
                        </button>
                      ))}
                    </div>

                    <div className="input-group" style={{ width: '100%', margin: 0 }}>
                      <textarea
                        className="input-field"
                        placeholder="Comments on passenger behaviour (optional)..."
                        value={ratingComment}
                        onChange={(e) => setRatingComment(e.target.value)}
                        rows="2"
                        style={{ width: '100%', resize: 'none', padding: '8px', fontSize: '12px' }}
                      />
                    </div>
                  </div>

                  <Button variant="primary" className="full-width" onClick={handleSubmitRating}>
                    Submit Rating
                  </Button>
                </div>
              )}

              {/* Incoming request block */}
              {isOnline && incomingRide && !currentRide && !showRating && (
                <div className="incoming-request animate-fade-in delay-100">
                  <div className="request-pulse"></div>
                  <h3>New Ride Request!</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                    {incomingRide.matchType === 'en-route' ? (
                      <div style={{ background: '#3b82f6', color: '#fff', fontWeight: 'bold', fontSize: '10px', padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Navigation size={12} /> En-Route Match
                      </div>
                    ) : (
                      <div style={{ background: '#10b981', color: '#fff', fontWeight: 'bold', fontSize: '10px', padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> Nearby Pickup ({incomingRide.distance} KM)
                      </div>
                    )}
                    {incomingRide.isIntercity && (
                      <div style={{ background: '#f59e0b', color: 'black', fontWeight: 'bold', fontSize: '10px', padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                        Intercity Ride (+₹250 Base Included)
                      </div>
                    )}
                  </div>


                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '10px',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      background: (incomingRide.paymentType === 'prepaid') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.12)',
                      color: (incomingRide.paymentType === 'prepaid') ? '#10b981' : '#3b82f6',
                      border: `1px solid ${(incomingRide.paymentType === 'prepaid') ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.3)'}`
                    }}>
                      {(incomingRide.paymentType === 'prepaid') ? '✓ Prepaid Trip' : '💵 Cash Trip'}
                    </span>
                  </div>

                  <div className="request-details">
                    <div className="req-row"><MapPin size={16}/> <strong>From:</strong> {incomingRide.pickup}</div>
                    <div className="req-row"><Navigation size={16}/> <strong>To:</strong> {incomingRide.dropoff}</div>
                    
                    <div style={{ borderTop: '1px solid var(--border)', marginTop: '8px', paddingTop: '8px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div><strong>Passenger Rating:</strong> <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>★ {incomingRide.passengerRating || '5.0'}</span></div>
                      <div><strong>Total Distance:</strong> {incomingRide.totalKm || 8.0} KM</div>
                      <div style={{ paddingLeft: '8px', borderLeft: '2px solid var(--primary)', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '12px' }}>
                        <div>• Passenger Bid: INR {parseFloat(incomingRide.fare).toFixed(2)}</div>
                        <div>• GST Tax (5%): +INR {(parseFloat(incomingRide.fare) * 0.05).toFixed(2)}</div>
                        <div style={{ borderTop: '1px solid var(--border)', marginTop: '4px', paddingTop: '4px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                          • Collect Cash: INR {(parseFloat(incomingRide.fare) * 1.05).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="req-price est-price" style={{ marginTop: '8px' }}>Offered Fare: INR {incomingRide.fare}</div>
                  </div>

                  {parseFloat(wallet.toBePaid || 0) > 1500 && incomingRide.paymentType === 'cash' ? (
                    <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', padding: '10px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', marginTop: '10px' }}>
                      🚫 Cannot accept cash trips until ₹1,500 pending dues are settled.
                    </div>
                  ) : (
                    <div className="request-actions">
                      <Button variant="outline" className="full-width" onClick={() => setIncomingRide(null)}>Decline</Button>
                      <Button variant="primary" className="full-width" onClick={handleAcceptRide}>Accept</Button>
                    </div>
                  )}
                </div>
              )}

              {/* Active ride in progress block */}
              {isOnline && currentRide && !showRating && (
                <div className="incoming-request animate-fade-in delay-100" style={{ background: 'rgba(59, 130, 246, 0.08)', borderColor: '#3b82f6' }}>
                  {showEndTripSummary ? (
                    <div>
                      <h3 style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 12px 0' }}>
                        <DollarSign size={20} /> End Trip Summary
                      </h3>
                      
                      {(() => {
                        const baseTotal = parseFloat(currentRide.totalKm || 8.0);
                        const liveDist = parseFloat(liveGpsDistance || 0);
                        const finalDist = liveDist > 0 ? liveDist : baseTotal;
                        
                        const rate = parseFloat(ratePerKm || 15.00);
                        let originalMinFare = baseTotal * rate;
                        if (currentRide.isIntercity) originalMinFare += 250;
                        
                        const originalOfferedFare = parseFloat(currentRide.fare || originalMinFare);
                        const voluntaryExtraOffer = Math.max(0, originalOfferedFare - originalMinFare);
                        
                        let recalculatedMinFare = finalDist * rate;
                        if (currentRide.isIntercity) recalculatedMinFare += 250;
                        
                        const baseF = recalculatedMinFare + voluntaryExtraOffer;
                        const tax = baseF * 0.05;
                        const total = baseF + tax;
                        
                        const isLess = liveDist > 0 && liveDist < baseTotal;
                        const isMore = liveDist > baseTotal;

                        return (
                          <>
                            <div className="request-details" style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span><strong>Final Distance:</strong></span>
                                <span>{finalDist.toFixed(2)} KM</span>
                              </div>
                              {isMore && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444', fontSize: '11px' }}>
                                  <span>Extra Distance Travelled:</span>
                                  <span>+{(finalDist - baseTotal).toFixed(2)} KM</span>
                                </div>
                              )}
                              {isLess && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontSize: '11px' }}>
                                  <span>Stopped Early:</span>
                                  <span>-{(baseTotal - finalDist).toFixed(2)} KM</span>
                                </div>
                              )}
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span><strong>Rate per KM:</strong></span>
                                <span>₹{rate.toFixed(2)}</span>
                              </div>
                              {voluntaryExtraOffer > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)', fontSize: '12px', fontWeight: 'bold' }}>
                                  <span>Passenger Voluntary Extra Tip:</span>
                                  <span>+₹{voluntaryExtraOffer.toFixed(2)}</span>
                                </div>
                              )}
                              <div style={{ borderTop: '1px dashed rgba(59, 130, 246, 0.2)', margin: '4px 0' }} />
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Subtotal (KM Fare):</span>
                                <span>₹{baseF.toFixed(2)}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f59e0b' }}>
                                <span>GST Tax (5%):</span>
                                <span>₹{tax.toFixed(2)}</span>
                              </div>
                              <div style={{ borderTop: '1px solid rgba(59, 130, 246, 0.3)', margin: '6px 0', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '15px' }}>
                                <span>Total Collected:</span>
                                <span>₹{total.toFixed(2)}</span>
                              </div>
                            </div>

                            <div style={{ marginTop: '16px', background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                                <input 
                                  type="checkbox" 
                                  checked={collectCash} 
                                  onChange={(e) => setCollectCash(e.target.checked)}
                                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <span>💵 Collect Cash from Passenger</span>
                              </label>
                              <p style={{ margin: '6px 0 0 28px', fontSize: '11px', color: 'var(--text-muted)' }}>
                                Passenger will pay ₹{total.toFixed(2)} in cash.
                              </p>
                            </div>
                          </>
                        );
                      })()}

                      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                        <Button variant="outline" className="full-width" onClick={() => setShowEndTripSummary(false)} style={{ borderColor: 'var(--text-muted)', color: 'var(--text-muted)' }}>
                          Back
                        </Button>
                        <Button variant="primary" className="full-width" onClick={() => handleCompleteRide(collectCash)} style={{ background: '#10b981', color: 'white' }}>
                          Confirm & Complete
                        </Button>
                      </div>
                    </div>
                  ) : currentRide.status === 'Accepted' ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <h3 style={{ color: '#3b82f6', marginBottom: '16px' }}>Verify Passenger to Start Trip</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                        Ask the passenger ({currentRide.passengerName || 'Passenger'}) for their 6-digit Ride PIN to verify their identity and start the trip.
                      </p>
                      <input 
                        type="text" 
                        value={ridePin} 
                        onChange={(e) => setRidePin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="Enter 6-digit PIN" 
                        style={{ fontSize: '20px', letterSpacing: '4px', textAlign: 'center', width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #3b82f6', background: 'transparent', color: 'var(--text-main)', marginBottom: '16px' }}
                      />
                      <Button variant="primary" className="full-width" onClick={handleVerifyPin} style={{ background: '#3b82f6', color: 'white' }} disabled={ridePin.length !== 6}>
                        Verify & Start Trip
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h3 style={{ color: '#3b82f6' }}>Trip in Progress</h3>
                      {currentRide.isIntercity && (
                        <div style={{ background: '#f59e0b', color: 'black', fontWeight: 'bold', fontSize: '10px', padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '8px' }}>
                          Intercity Route Active (+₹250 Base)
                        </div>
                      )}
                      {/* LIVE RUNNING GPS TAXIMETER CARD */}
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.12))',
                        border: '1.5px solid #10b981',
                        borderRadius: '14px',
                        padding: '14px',
                        marginBottom: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        boxShadow: '0 4px 16px rgba(16, 185, 129, 0.12)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', fontWeight: '900', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                            LIVE GPS TRIP METER ACTIVE
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>
                            Rate: ₹{parseFloat(ratePerKm || 15.00).toFixed(2)}/KM
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'center', paddingTop: '4px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Est. Distance</span>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                              {(liveGpsDistance > 0 ? liveGpsDistance : parseFloat(currentRide.totalKm || 8.0)).toFixed(2)} <span style={{ fontSize: '12px', color: '#10b981' }}>KM</span>
                            </div>
                          </div>
                          <div style={{ width: '1px', background: 'rgba(59, 130, 246, 0.2)', margin: '0 8px' }} />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Est. Fare</span>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                              ₹{((liveGpsDistance > 0 ? liveGpsDistance : parseFloat(currentRide.totalKm || 8.0)) * parseFloat(ratePerKm || 15.00) + (currentRide.isIntercity ? 250 : 0)).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px dashed var(--border)', paddingTop: '6px', marginTop: '2px' }}>
                          ⚡ GPS tracks precise vehicle motion while riding with passenger.
                        </div>
                      </div>

                      <div className="request-details">
                        <div className="req-row"><MapPin size={16}/> <strong>Pickup:</strong> {currentRide.pickup}</div>
                        <div className="req-row"><Navigation size={16}/> <strong>Drop-off:</strong> {currentRide.dropoff}</div>
                        
                        <div style={{ borderTop: '1px solid rgba(59, 130, 246, 0.2)', marginTop: '8px', paddingTop: '8px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div><strong>Estimated Distance:</strong> {currentRide.totalKm || 8.0} KM</div>
                          <div style={{ paddingLeft: '8px', borderLeft: '2px solid #3b82f6', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '12px' }}>
                            <div>• Offered Price: INR {parseFloat(currentRide.fare).toFixed(2)}</div>
                            <div>• GST Tax (5%): +INR {(parseFloat(currentRide.fare) * 0.05).toFixed(2)}</div>
                            <div style={{ borderTop: '1px solid rgba(59, 130, 246, 0.3)', marginTop: '4px', paddingTop: '4px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                              • Collect Cash: INR {(parseFloat(currentRide.fare) * 1.05).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <div className="req-price est-price" style={{ color: '#3b82f6', marginTop: '8px' }}>Fare: INR {currentRide.fare}</div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => { setShowDriverTripChat(true); fetchDriverTripChatMessages(); }}
                        style={{ width: '100%', marginBottom: '10px', borderColor: '#3b82f6', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <MessageSquare size={16} /> 💬 Chat with Passenger ({currentRide.passengerName || 'Passenger'})
                      </Button>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <Button variant="outline" className="full-width" onClick={handleCancelRide} style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                          Cancel Ride
                        </Button>
                        <Button variant="primary" className="full-width" onClick={() => setShowEndTripSummary(true)} style={{ background: '#3b82f6', color: 'white' }}>
                          Complete Ride
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Idle online status screen — Simple Clean Trip Searching Indicator */}
              {isOnline && !incomingRide && !currentRide && !showRating && !isPaused && (
                <div style={{
                  border: '1px dashed #10b981',
                  borderRadius: '16px',
                  padding: '24px 20px',
                  textAlign: 'center',
                  background: 'rgba(16, 185, 129, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
                }} className="animate-fade-in">
                  
                  {/* Simple Pulsing Beacon Ring */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1.5px solid #10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10b981',
                    boxShadow: '0 0 12px rgba(16, 185, 129, 0.2)',
                    animation: 'pulse 2s infinite'
                  }}>
                    <Car size={24} />
                  </div>

                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#10b981', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                      Searching for Nearby Trips...
                    </h4>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                      Scanning nearby Kerala passengers within 8 KM radius. Requests will pop up automatically.
                    </p>
                  </div>
                </div>
              )}

              {/* Offline status screen */}
              {!isOnline && (
                <div style={{ border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
                  <Power size={32} color="var(--text-muted)" style={{ marginBottom: '10px' }} />
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '800' }}>You are Currently Offline</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Click "Go Online" in the header to start accepting ride dispatches.</p>
                </div>
              )}

              {/* Available Pre-booked Trips Section (Visible when Online and Idle) */}
              {isOnline && !currentRide && !showRating && (
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '800', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📅 Available Pre-booked Trips ({availablePreBooked.length})
                  </h4>
                  {availablePreBooked.length === 0 ? (
                    <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', fontSize: '12px', color: 'var(--text-muted)' }}>
                      No available pre-booked trips within 20 KM.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                      {availablePreBooked.map(ride => (
                        <div key={ride.id} style={{ border: '1px solid var(--border)', borderRadius: '14px', padding: '14px', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                            <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{ride.preBookDate} at {ride.preBookTime}</span>
                            <span>📍 Driver Dist: <strong>{ride.distance} KM</strong></span>
                          </div>
                          <div style={{ fontSize: '12.5px', fontWeight: '600' }}>
                            📍 <strong>From:</strong> {ride.pickup}
                          </div>
                          <div style={{ fontSize: '12.5px', fontWeight: '600' }}>
                            🏁 <strong>To:</strong> {ride.dropoff}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '12px' }}>
                            <span>Bid Fare: <strong style={{ color: 'var(--primary)', fontSize: '13px' }}>₹{ride.fare}</strong></span>
                            <span>Total Dist: <strong>{ride.totalKm} KM</strong></span>
                          </div>
                          <Button variant="primary" className="full-width" onClick={() => handleAcceptPreBooked(ride.id)} style={{ marginTop: '8px', fontSize: '12.5px', padding: '8px' }}>
                            Accept Pre-booked Trip
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* My Scheduled Trips Section (Always Visible) */}
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '800', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  💼 My Scheduled Trips ({myScheduledTrips.length})
                </h4>
                {myScheduledTrips.length === 0 ? (
                  <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', fontSize: '12px', color: 'var(--text-muted)' }}>
                    You have no scheduled trips.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                    {myScheduledTrips.map(ride => (
                      <div key={ride.id} style={{ border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '14px', padding: '14px', background: 'rgba(56, 189, 248, 0.02)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                          <span style={{ fontWeight: '700', color: '#38bdf8' }}>{ride.preBookDate} at {ride.preBookTime}</span>
                          <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 6px', borderRadius: '8px', fontSize: '9px', fontWeight: 'bold' }}>ACCEPTED</span>
                        </div>
                        <div style={{ fontSize: '12.5px', fontWeight: '600' }}>
                          📍 <strong>From:</strong> {ride.pickup}
                        </div>
                        <div style={{ fontSize: '12.5px', fontWeight: '600' }}>
                          🏁 <strong>To:</strong> {ride.dropoff}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '12px' }}>
                          <span>Fare: <strong style={{ color: '#38bdf8', fontSize: '13px' }}>₹{ride.fare}</strong></span>
                          <span>Passenger: <strong>{ride.passengerName}</strong></span>
                        </div>
                        {isOnline ? (
                          <Button variant="primary" className="full-width" onClick={() => handleStartScheduledTrip(ride.id)} style={{ marginTop: '8px', background: '#38bdf8', borderColor: '#38bdf8', color: 'black', fontWeight: '800', fontSize: '12.5px', padding: '8px' }}>
                            Start Trip Now
                          </Button>
                        ) : (
                          <div style={{ fontSize: '11px', color: '#ef4444', textAlign: 'center', marginTop: '6px', fontWeight: 'bold' }}>
                            Go Online to start this trip
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ================= TAB 2: WALLET & EARNINGS ================= */}
          {activeMenu === 'wallet' && (
            <div className="tab-pane animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">Today's Earnings</span>
                  <span className="stat-value text-gradient">₹{homeEarnings?.daily?.net ?? '0.00'}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">System Status</span>
                  <span className={`stat-value status-${isOnline ? 'online' : 'offline'}`} style={{ color: isOnline ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {isOnline ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
              </div>

              {/* Driver Wallet Overview Widget */}
              <div style={{ border: '1px solid var(--border)', borderRadius: '14px', padding: '16px', background: 'rgba(255, 255, 255, 0.01)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '800' }}>
                  <Wallet size={18} color="var(--primary)" /> Driver Financial Ledger & Wallet
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <div style={{ padding: '10px', border: '1px solid var(--border)', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.02)', textAlign: 'center' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Cash Collected</span>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>₹{parseFloat(wallet.cashCollected || 0).toFixed(2)}</span>
                  </div>
                  <div style={{ padding: '10px', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.04)', textAlign: 'center' }}>
                    <span style={{ fontSize: '10px', color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>GST Collected</span>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary)' }}>₹{parseFloat(wallet.gstCollected || 0).toFixed(2)}</span>
                  </div>
                  <div style={{ padding: '10px', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.04)', textAlign: 'center' }}>
                    <span style={{ fontSize: '10px', color: '#ef4444', display: 'block', marginBottom: '4px' }}>Platform Dues</span>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#ef4444' }}>-₹{parseFloat(wallet.toBePaid || 0).toFixed(2)}</span>
                  </div>
                </div>

                {/* Dues Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', background: 'rgba(255,255,255,0.01)' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>📋 Platform Commission Breakdown</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Base Commission (5%):</span>
                    <strong style={{ color: '#ef4444' }}>-₹{(parseFloat(wallet.toBePaid || 0) * 0.5).toFixed(2)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Government GST (5%):</span>
                    <strong style={{ color: '#ef4444' }}>-₹{(parseFloat(wallet.toBePaid || 0) * 0.5).toFixed(2)}</strong>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800' }}>
                    <span style={{ color: '#ef4444' }}>Total Commission Dues:</span>
                    <strong style={{ color: '#ef4444' }}>-₹{parseFloat(wallet.toBePaid || 0).toFixed(2)}</strong>
                  </div>
                </div>

                {parseFloat(wallet.toBePaid || 0) > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                    <Button 
                      variant="primary" 
                      onClick={() => setShowPayDuesModal(true)}
                      style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', fontWeight: '800' }}
                    >
                      <CreditCard size={16} /> Pay Commission via Payment Gateway
                    </Button>
                    <a 
                      href={`https://api.whatsapp.com/send?phone=918848347290&text=${encodeURIComponent(`Hello Admin, I am driver ${driverInfo?.name || 'Partner'} (${driverInfo?.phone || ''}). My pending platform commission & GST dues have reached ₹${parseFloat(wallet.toBePaid || 0).toFixed(2)}. I would like to clear my dues.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        background: '#25D366',
                        color: '#ffffff',
                        fontWeight: '800',
                        fontSize: '12px',
                        padding: '10px',
                        borderRadius: '10px'
                      }}
                    >
                      💬 Chat Admin on WhatsApp (+91 8848347290)
                    </a>
                  </div>
                )}

                <div style={{ fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '10px', lineHeight: '1.5' }}>
                  💡 <strong>Commission Policy:</strong> 5% HUM Fleet Commission + 5% GST is deducted per completed ride. Dues must be paid through the gateway before pending balance crosses ₹1,500.
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: SETTINGS & CONFIGURATION ================= */}
          {activeMenu === 'settings' && (
            <div className="tab-pane animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* SETTINGS SUB-NAVIGATION PILLS */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '4px',
                padding: '4px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border)',
                borderRadius: '12px'
              }}>
                <button
                  onClick={() => setSettingsSubTab('rates')}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: settingsSubTab === 'rates' ? 'var(--primary)' : 'transparent',
                    color: settingsSubTab === 'rates' ? '#000' : 'var(--text-muted)',
                    fontWeight: '800',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  <DollarSign size={13} /> Rates
                </button>

                <button
                  onClick={() => setSettingsSubTab('documents')}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: settingsSubTab === 'documents' ? 'var(--primary)' : 'transparent',
                    color: settingsSubTab === 'documents' ? '#000' : 'var(--text-muted)',
                    fontWeight: '800',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  <FileText size={13} /> Docs & Photos
                </button>

                <button
                  onClick={() => setSettingsSubTab('profile')}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: settingsSubTab === 'profile' ? 'var(--primary)' : 'transparent',
                    color: settingsSubTab === 'profile' ? '#000' : 'var(--text-muted)',
                    fontWeight: '800',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  <User size={13} /> Profile
                </button>

                <button
                  onClick={() => setSettingsSubTab('bank')}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: settingsSubTab === 'bank' ? 'var(--primary)' : 'transparent',
                    color: settingsSubTab === 'bank' ? '#000' : 'var(--text-muted)',
                    fontWeight: '800',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  <CreditCard size={13} /> Bank
                </button>

                <button
                  onClick={() => {
                    setSettingsSubTab('vehicles');
                    fetchVehicles();
                  }}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: settingsSubTab === 'vehicles' ? 'var(--primary)' : 'transparent',
                    color: settingsSubTab === 'vehicles' ? '#000' : 'var(--text-muted)',
                    fontWeight: '800',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Car size={13} /> Vehicles
                </button>

                <button
                  onClick={() => setSettingsSubTab('appearance')}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: settingsSubTab === 'appearance' ? 'var(--primary)' : 'transparent',
                    color: settingsSubTab === 'appearance' ? '#000' : 'var(--text-muted)',
                    fontWeight: '800',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Sparkles size={13} /> Theme
                </button>
              </div>

              {/* SUB-SECTION 0.5: VEHICLES GARAGE */}
              {settingsSubTab === 'vehicles' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Car size={18} color="var(--primary)" />
                      <span style={{ fontSize: '14px', fontWeight: '800' }}>Manage Garage</span>
                    </div>
                    <button
                      onClick={() => setShowAddVehicleForm(prev => !prev)}
                      className="btn btn-outline"
                      style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700' }}
                    >
                      {showAddVehicleForm ? '✕ Close Form' : '➕ Add Another Vehicle'}
                    </button>
                  </div>

                  {/* Add Vehicle Form */}
                  {showAddVehicleForm && (
                    <form onSubmit={handleAddVehicle} style={{ border: '1px solid var(--border)', borderRadius: '14px', padding: '16px', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '800' }}>Add Specifications</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Manufacturer / Make</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="e.g. Tata, Hyundai"
                            value={newMake}
                            onChange={(e) => setNewMake(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Model Name</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="e.g. Nexon, Creta"
                            value={newModel}
                            onChange={(e) => setNewModel(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Mfg. Year</label>
                          <input
                            type="number"
                            className="input-field"
                            placeholder="e.g. 2023"
                            value={newYear}
                            onChange={(e) => setNewYear(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>License Plate Number</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="e.g. KA 01 AB 1234"
                            value={newPlate}
                            onChange={(e) => setNewPlate(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {/* Vehicle Photos */}
                      <div style={{ marginTop: '8px' }}>
                        <label style={{ fontSize: '11px', fontWeight: '800', display: 'block', marginBottom: '8px' }}>📷 Required Vehicle Photos</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                          {[
                            { id: 'front', label: 'Front view' },
                            { id: 'rear', label: 'Rear view' },
                            { id: 'left', label: 'Left Side' },
                            { id: 'right', label: 'Right Side' },
                            { id: 'inside', label: 'Inside Cabin' }
                          ].map((side) => (
                            <div key={side.id} style={{ border: '1px dashed var(--border)', borderRadius: '10px', padding: '8px', textAlign: 'center', position: 'relative' }}>
                              <span style={{ fontSize: '10px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>{side.label} *</span>
                              <input
                                type="file"
                                accept="image/*"
                                required
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (evt) => setNewVehiclePhotos(prev => ({ ...prev, [side.id]: evt.target.result }));
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                style={{ fontSize: '9px', width: '100%' }}
                              />
                              {newVehiclePhotos[side.id] && (
                                <div style={{ marginTop: '6px', width: '60px', height: '40px', margin: '6px auto 0 auto', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                  <img src={newVehiclePhotos[side.id]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={side.label} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Vehicle Documents */}
                      <div style={{ marginTop: '12px' }}>
                        <label style={{ fontSize: '11px', fontWeight: '800', display: 'block', marginBottom: '8px' }}>📄 Required Compliance Documents</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                          {[
                            { id: 'rc', label: 'Registration (RC)' },
                            { id: 'pollution', label: 'Pollution (PUC)' },
                            { id: 'insurance', label: 'Insurance Policy' },
                            { id: 'fitness', label: 'Fitness Certificate' }
                          ].map((doc) => (
                            <div key={doc.id} style={{ border: '1px dashed var(--border)', borderRadius: '10px', padding: '8px', textAlign: 'center', position: 'relative' }}>
                              <span style={{ fontSize: '10px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>{doc.label} *</span>
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                required
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (evt) => setNewVehicleDocs(prev => ({ ...prev, [doc.id]: evt.target.result }));
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                style={{ fontSize: '9px', width: '100%' }}
                              />
                              {newVehicleDocs[doc.id] && (
                                <span style={{ fontSize: '9px', color: '#10b981', display: 'block', marginTop: '4px', fontWeight: '700' }}>✓ Document Loaded</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        type="submit"
                        disabled={vehicleSaveStatus === 'saving'}
                        style={{ padding: '8px 12px', fontSize: '12px', fontWeight: '800', marginTop: '6px' }}
                      >
                        {vehicleSaveStatus === 'saving' ? '⏳ Adding vehicle...' : '💾 Save Vehicle to Garage'}
                      </Button>
                    </form>
                  )}

                  {/* Vehicles List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {vehicles.map((v) => (
                      <div
                        key={v.id}
                        style={{
                          border: '1px solid var(--border)',
                          borderRadius: '12px',
                          padding: '14px',
                          background: v.isActive ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255,255,255,0.01)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div style={{ width: '42px', height: '42px', borderRadius: '8px', overflow: 'hidden', background: '#121624', border: v.isActive ? '2px solid var(--primary)' : '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {v.photos?.front ? (
                              <img src={v.photos.front} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Car" />
                            ) : (
                              <Car size={20} color={v.isActive ? 'var(--primary)' : 'var(--text-muted)'} />
                            )}
                          </div>
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}>
                              {v.manufacturer} {v.model} ({v.year})
                              {v.status === 'Pending' && (
                                <span style={{ fontSize: '9px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>Pending</span>
                              )}
                              {v.status === 'Rejected' && (
                                <span style={{ fontSize: '9px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>Rejected</span>
                              )}
                              {v.status === 'Approved' && (
                                <span style={{ fontSize: '9px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>Approved</span>
                              )}
                            </span>
                            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                              {v.plate}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {v.isActive ? (
                            <span style={{ fontSize: '10px', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '20px', fontWeight: '800', border: '1px solid rgba(16,185,129,0.2)' }}>
                              ✓ Active Ride
                            </span>
                          ) : (
                            <>
                              {(v.status === 'Approved' || !v.status) && (
                                <button
                                  onClick={() => handleActivateVehicle(v.id)}
                                  className="btn btn-outline"
                                  style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700' }}
                                >
                                  Activate
                                </button>
                              )}
                              {v.status === 'Pending' && (
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '6px' }}>
                                  ⏳ Awaiting Approval
                                </span>
                              )}
                              {v.status === 'Rejected' && (
                                <span style={{ fontSize: '10px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', padding: '4px 8px', borderRadius: '6px' }}>
                                  Rejected
                                </span>
                              )}
                              <button
                                onClick={() => handleDeleteVehicle(v.id)}
                                style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                              >
                                Remove
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-SECTION 1: FARE RATES */}
              {settingsSubTab === 'rates' && (
                <div style={{ border: '1px solid var(--border)', borderRadius: '14px', padding: '16px', background: 'rgba(255, 255, 255, 0.01)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DollarSign size={18} color="var(--primary)" /> Custom Partner Fare Controls
                  </span>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    Set your base pricing per kilometer and per hour. Passengers bidding for rides in your area will receive fare offers based on these custom parameters.
                  </p>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Rate / KM (₹)</label>
                      <input 
                        type="number" 
                        className="input-field" 
                        value={ratePerKm}
                        onChange={(e) => setRatePerKm(e.target.value)}
                        style={{ padding: '10px 14px', fontSize: '14px' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Rate / Hour (₹)</label>
                      <input 
                        type="number" 
                        className="input-field" 
                        value={ratePerHour}
                        onChange={(e) => setRatePerHour(e.target.value)}
                        style={{ padding: '10px 14px', fontSize: '14px' }}
                      />
                    </div>
                  </div>

                  <Button 
                    variant="primary" 
                    className="full-width" 
                    style={{ padding: '10px 14px', fontSize: '13px', marginTop: '6px' }}
                    onClick={handleSaveRates}
                  >
                    Save Custom Rates
                  </Button>
                </div>
              )}

              {/* SUB-SECTION 2: CAR PHOTOS & DOCUMENTS */}
              {settingsSubTab === 'documents' && (
                <div style={{ border: '1px solid var(--border)', borderRadius: '14px', padding: '16px', background: 'rgba(255, 255, 255, 0.01)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Camera size={18} color="var(--primary)" /> Vehicle Photos & Compliance Documents
                  </span>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                    Edit and re-upload your vehicle pictures or documents anytime. Updates sync live to the operations panel.
                  </p>

                  {/* Vehicle Photos Grid */}
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
                      📸 Car Photos (5 Angles)
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '8px' }}>
                      {['front', 'rear', 'left', 'right', 'inside'].map((side) => {
                        const photoSrc = driverPhotos[side];
                        return (
                          <div key={side} style={{ position: 'relative', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', padding: '4px', background: 'rgba(0,0,0,0.3)', textAlign: 'center' }}>
                            <div style={{ height: '58px', borderRadius: '6px', overflow: 'hidden', background: '#0a0d14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {photoSrc ? (
                                <img src={photoSrc} alt={side} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <Camera size={20} color="var(--text-muted)" />
                              )}
                            </div>
                            <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'capitalize', display: 'block', margin: '4px 0 2px 0' }}>{side}</span>
                            <label style={{ cursor: 'pointer', display: 'inline-block', background: 'var(--primary)', color: '#000', borderRadius: '4px', padding: '2px 8px', fontSize: '10px', fontWeight: '800' }}>
                              Edit
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => handleUploadCarPhoto(side, e.target.files[0])} 
                                style={{ display: 'none' }} 
                              />
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Compliance Documents Grid */}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
                      📄 Compliance Documents
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[
                        { id: 'rc', label: 'Registration (RC)' },
                        { id: 'pollution', label: 'Pollution (PUC)' },
                        { id: 'insurance', label: 'Insurance Policy' },
                        { id: 'fitness', label: 'Fitness Certificate' },
                        { id: 'licenseFront', label: 'Licence (Front Side)' },
                        { id: 'licenseBack', label: 'Licence (Back Side)' }
                      ].map((doc) => {
                        const hasDoc = Boolean(driverDocs[doc.id] || (
                          (doc.id === 'licenseFront' || doc.id === 'licenseBack') ? driverDocs.license : null
                        ));
                        return (
                          <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', fontSize: '12px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                              <FileText size={16} color={hasDoc ? '#10b981' : 'var(--text-muted)'} />
                              {doc.label}
                            </span>
                            <label style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border)', color: '#fff', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: '700' }}>
                              {hasDoc ? 'Update' : 'Upload'}
                              <input 
                                type="file" 
                                accept="image/*,application/pdf" 
                                onChange={(e) => handleUploadDoc(doc.id, doc.label, e.target.files[0])} 
                                style={{ display: 'none' }} 
                              />
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-SECTION 3: PROFILE & VERIFICATION */}
              {settingsSubTab === 'profile' && (
                <div style={{ border: '1px solid var(--border)', borderRadius: '14px', padding: '16px', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={18} color="var(--primary)" />
                    <span style={{ fontSize: '14px', fontWeight: '800' }}>Edit Profile</span>
                  </div>

                  {/* Profile Picture Editor */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    {/* Avatar preview */}
                    <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--primary)', background: '#1e1b4b' }}>
                        {profileEditPicPreview ? (
                          <img src={profileEditPicPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : driverProfilePic ? (
                          <img src={driverProfilePic} alt="Current" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold', fontSize: '28px' }}>
                            {(profileEditName || driverDetails?.name || 'D').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      {/* Camera badge overlay */}
                      <label htmlFor="profile-pic-upload" style={{ position: 'absolute', bottom: 0, right: 0, width: '26px', height: '26px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #0f1117' }}>
                        <Camera size={13} color="#000" />
                        <input
                          id="profile-pic-upload"
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setProfileEditPicPreview(ev.target.result);
                              setProfileEditPicBase64(ev.target.result);
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tap the camera icon to change photo</span>
                    {profileEditPicPreview && (
                      <button
                        onClick={() => { setProfileEditPicPreview(null); setProfileEditPicBase64(null); }}
                        style={{ fontSize: '11px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }}
                      >
                        ✕ Remove new photo
                      </button>
                    )}
                  </div>

                  {/* Name Editor */}
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Display Name</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder={driverDetails?.name || 'Your full name'}
                      value={profileEditName}
                      onChange={(e) => setProfileEditName(e.target.value)}
                      style={{ padding: '10px 14px', fontSize: '14px', width: '100%', fontWeight: '600' }}
                    />
                  </div>

                  {/* Reset Password Fields */}
                  <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', display: 'block' }}>
                      🔑 Reset Security Password
                    </span>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>New Password</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showProfilePassword ? "text" : "password"}
                          className="input-field"
                          placeholder="••••••••"
                          value={profileNewPassword}
                          onChange={(e) => setProfileNewPassword(e.target.value)}
                          style={{ padding: '10px 14px', paddingRight: '40px', fontSize: '14px', width: '100%' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowProfilePassword(prev => !prev)}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2
                          }}
                        >
                          {showProfilePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Confirm Password</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showProfilePassword ? "text" : "password"}
                          className="input-field"
                          placeholder="••••••••"
                          value={profileConfirmPassword}
                          onChange={(e) => setProfileConfirmPassword(e.target.value)}
                          style={{ padding: '10px 14px', paddingRight: '40px', fontSize: '14px', width: '100%' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowProfilePassword(prev => !prev)}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2
                          }}
                        >
                          {showProfilePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Current read-only info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '10px' }}>
                    {[['Email', driverDetails?.email || '—'], ['Rating', `★ ${driverDetails?.rating || '5.0'}`], ['Status', driverDetails?.status || 'Approved']].map(([label, val]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                        <strong style={{ color: 'var(--text-main)' }}>{val}</strong>
                      </div>
                    ))}
                  </div>

                  {/* Feedback */}
                  {profileSaveStatus === 'saved' && (
                    <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#10b981', fontWeight: '700' }}>
                      ✅ Profile updated successfully!
                    </div>
                  )}
                  {profileSaveStatus === 'error' && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#ef4444', fontWeight: '700' }}>
                      ❌ Failed to save. Please try again.
                    </div>
                  )}

                  {/* Save Button */}
                  <Button
                    variant="primary"
                    className="full-width"
                    disabled={profileSaveStatus === 'saving'}
                    onClick={async () => {
                      if (!profileEditName.trim() && !profileEditPicBase64 && !profileNewPassword) {
                        alert('Please edit your name, choose a new photo, or enter a new password.');
                        return;
                      }
                      if (profileNewPassword) {
                        if (profileNewPassword !== profileConfirmPassword) {
                          alert('New passwords do not match!');
                          return;
                        }
                        if (profileNewPassword.length < 4) {
                          alert('Password must be at least 4 characters long.');
                          return;
                        }
                      }
                      setProfileSaveStatus('saving');
                      const email = localStorage.getItem('driverEmail');
                      try {
                        const res = await fetch(`${API_BASE}/api/drivers/profile`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            email,
                            name: profileEditName.trim() || driverDetails?.name,
                            profilePic: profileEditPicBase64 || undefined,
                            password: profileNewPassword || undefined
                          })
                        });
                        if (res.ok) {
                          // Immediately update profile pic in UI
                          if (profileEditPicBase64) setDriverProfilePic(profileEditPicBase64);
                          // Re-fetch driver details so name & all fields update on dashboard
                          await fetchStatus(false);
                          setProfileSaveStatus('saved');
                          setProfileEditName('');
                          setProfileEditPicPreview(null);
                          setProfileEditPicBase64(null);
                          setProfileNewPassword('');
                          setProfileConfirmPassword('');
                          setTimeout(() => setProfileSaveStatus(null), 3000);
                        } else {
                          setProfileSaveStatus('error');
                          setTimeout(() => setProfileSaveStatus(null), 3000);
                        }
                      } catch {
                        setProfileSaveStatus('error');
                        setTimeout(() => setProfileSaveStatus(null), 3000);
                      }
                    }}
                    style={{ padding: '12px', fontSize: '14px', fontWeight: '800' }}
                  >
                    {profileSaveStatus === 'saving' ? '⏳ Saving...' : '💾 Save Profile'}
                  </Button>

                  {/* Daily security verification separator */}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Daily Security Verification</span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', background: isDailyVerified ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)', border: `1px solid ${isDailyVerified ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}` }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: isDailyVerified ? '#10b981' : '#f59e0b' }}>
                        {isDailyVerified ? '✓ Daily Face Selfie Verified' : '⚠️ Verification Due'}
                      </span>
                      <Button variant="outline" style={{ fontSize: '11px', padding: '4px 10px' }} onClick={() => { setShowVerifyModal(true); setVerifyStep('camera'); setCapturedPhoto(null); setTimeout(() => startCamera(), 200); }}>
                        Re-Verify Face
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-SECTION 4: BANK ACCOUNT */}
              {settingsSubTab === 'bank' && (
                <div style={{ border: '1px solid var(--border)', borderRadius: '14px', padding: '16px', background: 'rgba(255, 255, 255, 0.01)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={18} color="var(--primary)" />
                    <span style={{ fontSize: '14px', fontWeight: '800' }}>Bank Account Details</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    Weekly earnings settlements and prepaid ride transfers are deposited into this verified account. Update carefully — changes require admin review.
                  </p>

                  {/* Current Saved Details (read-only preview) */}
                  {driverDetails?.bankName && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '12px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', marginBottom: '2px' }}>✅ Currently Saved Bank Details</span>
                      {[['Account Holder', driverDetails?.bankHolder || driverDetails?.name], ['Bank Name', driverDetails?.bankName], ['Account Number', driverDetails?.accountNo ? '•••• ' + String(driverDetails.accountNo).slice(-4) : '—'], ['IFSC Code', driverDetails?.ifscCode], ['UPI ID', driverDetails?.upiId || '—']].map(([label, val]) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>{label}:</span>
                          <strong style={{ color: 'var(--text-main)' }}>{val}</strong>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Editable Update Form */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>✏️ Update Bank Details</span>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Account Holder Name</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder={driverDetails?.bankHolder || driverDetails?.name || 'e.g. Rajesh Kumar'}
                        value={bankHolder}
                        onChange={(e) => setBankHolder(e.target.value)}
                        style={{ padding: '10px 14px', fontSize: '13px', width: '100%' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Bank Name</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder={driverDetails?.bankName || 'e.g. State Bank of India'}
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        style={{ padding: '10px 14px', fontSize: '13px', width: '100%' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Account Number</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder={driverDetails?.accountNo || 'e.g. 123456789012'}
                        value={accountNo}
                        onChange={(e) => setAccountNo(e.target.value.replace(/\D/g, ''))}
                        maxLength={18}
                        style={{ padding: '10px 14px', fontSize: '13px', width: '100%', letterSpacing: '1px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>IFSC Code</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder={driverDetails?.ifscCode || 'e.g. SBIN0001820'}
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                        maxLength={11}
                        style={{ padding: '10px 14px', fontSize: '13px', width: '100%', letterSpacing: '1px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>UPI ID <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>(optional)</span></label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder={driverDetails?.upiId || 'e.g. rajesh@okaxis'}
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        style={{ padding: '10px 14px', fontSize: '13px', width: '100%' }}
                      />
                    </div>

                    {bankSaveStatus === 'saved' && (
                      <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#10b981', fontWeight: '700' }}>
                        ✅ Bank details updated successfully!
                      </div>
                    )}
                    {bankSaveStatus === 'error' && (
                      <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#ef4444', fontWeight: '700' }}>
                        ❌ Failed to save. Please try again.
                      </div>
                    )}

                    <Button
                      variant="primary"
                      className="full-width"
                      disabled={bankSaveStatus === 'saving'}
                      onClick={async () => {
                        const email = localStorage.getItem('driverEmail');
                        if (!bankHolder && !bankName && !accountNo && !ifscCode) {
                          alert('Please fill in at least one field to update.');
                          return;
                        }
                        setBankSaveStatus('saving');
                        try {
                          const res = await fetch(`${API_BASE}/api/drivers/bank`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, bankHolder: bankHolder || driverDetails?.bankHolder, bankName: bankName || driverDetails?.bankName, accountNo: accountNo || driverDetails?.accountNo, ifscCode: ifscCode || driverDetails?.ifscCode, upiId: upiId || driverDetails?.upiId })
                          });
                          if (res.ok) {
                            setBankSaveStatus('saved');
                            setBankHolder(''); setBankName(''); setAccountNo(''); setIfscCode(''); setUpiId('');
                            setTimeout(() => setBankSaveStatus(null), 3000);
                          } else {
                            setBankSaveStatus('error');
                            setTimeout(() => setBankSaveStatus(null), 3000);
                          }
                        } catch {
                          setBankSaveStatus('error');
                          setTimeout(() => setBankSaveStatus(null), 3000);
                        }
                      }}
                      style={{ padding: '12px', fontSize: '14px', fontWeight: '800', marginTop: '4px' }}
                    >
                      {bankSaveStatus === 'saving' ? '⏳ Saving...' : '💾 Save Bank Details'}
                    </Button>
                  </div>
                </div>
              )}

              {/* SUB-SECTION 6: THEME & APPEARANCE */}
              {settingsSubTab === 'appearance' && (
                <div style={{ border: '1px solid var(--border)', borderRadius: '14px', padding: '16px', background: 'rgba(255, 255, 255, 0.01)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={18} color="var(--primary)" />
                    <span style={{ fontSize: '14px', fontWeight: '800' }}>Theme & Appearance</span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Choose your preferred dashboard display theme:</span>
                    
                    <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                      <button
                        onClick={() => setTheme('light')}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '10px',
                          border: theme === 'light' ? '2px solid var(--primary)' : '1px solid var(--border)',
                          background: theme === 'light' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                          color: theme === 'light' ? 'var(--primary)' : 'var(--text-main)',
                          fontWeight: '800',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          transition: 'all 0.2s'
                        }}
                      >
                        ☀️ Light Theme
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '10px',
                          border: theme === 'dark' ? '2px solid var(--primary)' : '1px solid var(--border)',
                          background: theme === 'dark' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                          color: theme === 'dark' ? 'var(--primary)' : 'var(--text-main)',
                          fontWeight: '800',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          transition: 'all 0.2s'
                        }}
                      >
                        🌙 Dark Theme
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ================= TAB 5: MESSAGES CENTER ================= */}
          {activeMenu === 'messages' && (
            <div className="tab-pane animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ border: '1px solid var(--border)', borderRadius: '14px', padding: '16px', background: 'rgba(255, 255, 255, 0.01)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageSquare size={18} color="var(--primary)" /> Admin Direct Messages & Support
                </span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
                  {adminMessages.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                      No messages from HUM Fleet Admin Support yet.
                    </div>
                  ) : (
                    adminMessages.map((msg) => (
                      <div key={msg.id} style={{
                        background: msg.sender.includes('Admin') ? 'rgba(59, 130, 246, 0.08)' : 'rgba(16, 185, 129, 0.1)',
                        border: `1px solid ${msg.sender.includes('Admin') ? 'rgba(59, 130, 246, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
                        borderRadius: '10px',
                        padding: '10px 14px'
                      }}>
                        <div style={{ fontSize: '10px', fontWeight: '800', color: msg.sender.includes('Admin') ? '#3b82f6' : '#10b981', marginBottom: '2px' }}>
                          {msg.sender} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-main)' }}>{msg.text}</div>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleDriverReply} style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Type message to Admin Support..."
                    value={driverReplyText}
                    onChange={(e) => setDriverReplyText(e.target.value)}
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
        
        <div className="dashboard-map glass-card animate-fade-in delay-100" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
          <iframe 
            id="driver-map-iframe"
            src="/map.html" 
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: '18px' }}
            title="Interactive Map"
          />
          {(isOnline) && (
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
              {currentRide ? `Destination: ${currentRide.dropoff.split(',')[0]}` : 'Waiting for Incoming Rides under 8.0 KM...'}
            </div>
          )}
        </div>
      </div>

      {/* Hidden Canvas for Selfie Capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Daily Face Verification Modal */}
      {showVerifyModal && (
        <div className="preview-modal" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '420px', padding: '24px', borderRadius: '20px', background: '#121624', border: '1px solid rgba(255,255,255,0.15)', textAlign: 'center', position: 'relative' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#fff' }}>Daily Face Verification</h3>
              </div>
              <button 
                onClick={() => { stopCamera(); setShowVerifyModal(false); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {verifyStep === 'camera' && (
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                  Position your face clearly within the oval frame to verify your identity for today's shift.
                </p>

                {/* Oval Camera Container */}
                <div style={{ position: 'relative', width: '220px', height: '260px', margin: '0 auto 20px auto', borderRadius: '50% / 40%', overflow: 'hidden', border: '3px solid var(--primary)', boxShadow: '0 0 25px rgba(16,185,129,0.3)', background: '#000' }}>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} 
                  />
                  {/* Face Alignment Oval Border Overlay */}
                  <div style={{ position: 'absolute', inset: 0, border: '2px dashed rgba(255,255,255,0.4)', borderRadius: '50% / 40%', pointerEvents: 'none' }} />
                </div>

                <Button 
                  variant="primary" 
                  onClick={capturePhoto} 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}
                >
                  <Camera size={18} /> Capture Verification Photo
                </Button>
              </div>
            )}

            {verifyStep === 'preview' && (
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>
                  Confirm your selfie photo is clear and well-lit.
                </p>

                <div style={{ position: 'relative', width: '220px', height: '260px', margin: '0 auto 20px auto', borderRadius: '50% / 40%', overflow: 'hidden', border: '3px solid #10b981', boxShadow: '0 0 25px rgba(16,185,129,0.4)' }}>
                  <img src={capturedPhoto} alt="Selfie Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Button 
                    variant="outline" 
                    onClick={() => { startCamera(); }} 
                    style={{ flex: 1 }}
                  >
                    Retake
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={submitVerification} 
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <CheckCircle size={16} /> Submit & Go Online
                  </Button>
                </div>
              </div>
            )}

            {verifyStep === 'submitting' && (
              <div style={{ padding: '30px 0' }}>
                <div className="request-pulse" style={{ margin: '0 auto 20px auto' }}></div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#fff' }}>Verifying Identity...</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Matching facial features with registered profile.</p>
              </div>
            )}

            {verifyStep === 'done' && (
              <div style={{ padding: '30px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#10b981', fontWeight: '800' }}>Face Verified!</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Daily verification complete. Going online now...</p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ADMIN DIRECT MESSAGES MODAL (APPEARS ONLY IF THERE IS A MESSAGE FROM ADMIN) */}
      {showAdminMessagesModal && adminMessages.length > 0 && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '520px', height: '560px', display: 'flex', flexDirection: 'column', padding: '20px', borderRadius: '20px', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Admin Direct Messages</h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Official broadcasts and direct communications from HUM Fleet Admin</span>
                </div>
              </div>
              <div>
                <button onClick={() => { setShowAdminMessagesModal(false); clearAdminMessages(); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Admin Notice Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {adminMessages.map((msg) => (
                <div key={msg.id} style={{
                  background: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  color: 'var(--text-main)',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#3b82f6', marginBottom: '4px' }}>
                    📢 {msg.sender} Notice • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div>{msg.text}</div>
                </div>
              ))}
            </div>

            {/* Modal Footer Close Button (No Reply Option) */}
            <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
              <Button 
                variant="outline" 
                onClick={() => { setShowAdminMessagesModal(false); clearAdminMessages(); }} 
                style={{ width: '100%', padding: '10px' }}
              >
                Dismiss & Close Notice
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* IN-TRIP LIVE CHAT MODAL (DRIVER TO PASSENGER EXCLUSIVE) */}
      {showDriverTripChat && currentRide && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '520px', height: '560px', display: 'flex', flexDirection: 'column', padding: '20px', borderRadius: '20px', background: 'var(--bg-card)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Live Trip Chat</h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Chatting with Passenger: <strong>{currentRide.passengerName || 'Customer'}</strong></span>
                </div>
              </div>
              <button onClick={() => setShowDriverTripChat(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={22} />
              </button>
            </div>

            {/* Security Notice Pill */}
            <div style={{ margin: '10px 0', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🔒 <strong>In-Trip Active Only:</strong> Phone & contact numbers cannot be shared for safety & privacy.
            </div>

            {/* Error Warning Banner */}
            {driverTripChatError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '10px', padding: '8px 12px', color: '#ef4444', fontSize: '12px', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={16} /> {driverTripChatError}
              </div>
            )}

            {/* Chat Thread */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {driverTripChatMessages.length === 0 ? (
                <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  <MessageSquare size={36} style={{ opacity: 0.4, marginBottom: '8px' }} />
                  <p style={{ margin: 0 }}>No messages exchanged yet with passenger.</p>
                  <p style={{ margin: 0, fontSize: '11px' }}>Send a message regarding pickup location or arrival status.</p>
                </div>
              ) : (
                driverTripChatMessages.map((msg) => {
                  const isMe = msg.role === 'driver';
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
            <form onSubmit={sendDriverTripChatMessage} style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Type message to passenger..."
                value={driverTripChatText}
                onChange={(e) => setDriverTripChatText(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', fontSize: '13px' }}
              />
              <Button variant="primary" type="submit" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px' }}>
                <Send size={16} /> Send
              </Button>
            </form>
          </div>
        </div>
      )}
      {/* ========== EARNINGS HISTORY MODAL ========== */}
      {showEarningsHistory && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowEarningsHistory(false); }}
        >
          <div className="animate-fade-in" style={{ width: '100%', maxWidth: '480px', background: 'var(--bg-card)', borderRadius: '24px 24px 0 0', padding: '20px', maxHeight: '88vh', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={20} color="#10b981" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800' }}>Earnings History</h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Your net earnings after 10% commission</span>
                </div>
              </div>
              <button onClick={() => setShowEarningsHistory(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>

            {/* Period Pills */}
            <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '4px' }}>
              {[['daily', '📅 Today'], ['weekly', '📆 This Week'], ['monthly', '🗓️ This Month']].map(([key, label]) => (
                <button
                  key={key}
                  onClick={async () => {
                    setEarningsHistoryPeriod(key);
                    if (!homeEarnings) {
                      const email = localStorage.getItem('driverEmail');
                      const r = await fetch(`${API_BASE}/api/drivers/earnings?email=${encodeURIComponent(email)}`);
                      if (r.ok) setHomeEarnings(await r.json());
                    }
                  }}
                  style={{ flex: 1, padding: '8px 4px', borderRadius: '9px', border: 'none', background: earningsHistoryPeriod === key ? 'var(--primary)' : 'transparent', color: earningsHistoryPeriod === key ? '#000' : 'var(--text-muted)', fontWeight: '800', fontSize: '11px', cursor: 'pointer', transition: 'all 0.2s' }}
                >{label}</button>
              ))}
            </div>

            {homeEarnings ? (() => {
              const period = homeEarnings[earningsHistoryPeriod];
              const periodLabel = earningsHistoryPeriod === 'daily' ? 'Today' : earningsHistoryPeriod === 'weekly' ? 'This Week' : 'This Month';
              return (
                <>
                  {/* Summary 4-Card Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { label: 'Trips', value: period.count, color: '#3b82f6', suffix: 'rides' },
                      { label: 'Gross', value: `₹${period.gross}`, color: '#f59e0b' },
                      { label: 'Commission (10%)', value: `₹${period.commission}`, color: '#ef4444' },
                      { label: 'Net Earnings', value: `₹${period.net}`, color: '#10b981' },
                    ].map(({ label, value, color }) => (
                      <div key={label} style={{ padding: '14px', borderRadius: '12px', border: `1px solid ${color}25`, background: `${color}08` }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '700' }}>{label}</div>
                        <div style={{ fontSize: '20px', fontWeight: '800', color }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Ride List */}
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
                      🧾 {periodLabel} — {period.count} Ride{period.count !== 1 ? 's' : ''}
                    </div>
                    {period.rides.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', border: '1px dashed var(--border)', borderRadius: '12px' }}>
                        No completed rides for {periodLabel.toLowerCase()} yet.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {period.rides.map((ride, i) => (
                          <div key={ride.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '10px' }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {ride.pickup} → {ride.dropoff}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                {ride.passengerName} • {ride.completedAt ? new Date(ride.completedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right', marginLeft: '12px' }}>
                              <div style={{ fontWeight: '800', fontSize: '14px', color: '#10b981' }}>₹{(parseFloat(ride.fare) * 0.9).toFixed(2)}</div>
                              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>of ₹{ride.fare}</div>
                              {ride.driverBalance !== undefined && ride.driverBalance !== null && (
                                <div style={{ fontSize: '10px', color: '#ef4444', fontWeight: 'bold', marginTop: '2px' }}>
                                  Bal: {parseFloat(ride.driverBalance) < 0 ? '-' : ''}₹{Math.abs(parseFloat(ride.driverBalance)).toFixed(2)}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Download PDF */}
                  <button
                    onClick={() => {
                      const driverName = driverDetails?.name || 'Driver Partner';
                      const rows = period.rides.map(r => `
                        <tr>
                          <td>${r.id ?? '—'}</td>
                          <td>${r.passengerName ?? '—'}</td>
                          <td>${r.pickup ?? '—'}</td>
                          <td>${r.dropoff ?? '—'}</td>
                          <td style="text-align:right">₹${r.fare ?? '0'}</td>
                          <td style="text-align:right;color:#059669">₹${(parseFloat(r.fare||0)*0.9).toFixed(2)}</td>
                          <td>${r.completedAt ? new Date(r.completedAt).toLocaleDateString('en-IN') : '—'}</td>
                        </tr>`).join('');
                      const win = window.open('', '_blank');
                      win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>HUM Fleet – Earnings Report</title>
                        <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;background:#fff;padding:32px;color:#111}
                        .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:16px;border-bottom:2px solid #10b981}
                        .logo{font-size:24px;font-weight:900;color:#10b981}h2{font-size:16px;font-weight:700;color:#333;margin-bottom:4px}
                        .meta{font-size:12px;color:#666}.summary{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
                        .card{padding:14px;border-radius:10px;border:1px solid #e5e7eb}
                        .card-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#666;margin-bottom:4px}
                        .card-val{font-size:20px;font-weight:800}table{width:100%;border-collapse:collapse;font-size:12px}
                        th{background:#f9fafb;padding:8px 10px;text-align:left;font-weight:700;color:#374151;border-bottom:2px solid #e5e7eb}
                        td{padding:8px 10px;border-bottom:1px solid #f3f4f6}tr:hover td{background:#f9fafb}
                        .footer{margin-top:24px;font-size:11px;color:#9ca3af;text-align:center;border-top:1px solid #e5e7eb;padding-top:12px}
                        @media print{body{padding:16px}}</style></head><body>
                        <div class="header">
                          <div><div class="logo">🚗 HUM Fleet</div><div class="meta">Partner Earnings Report · Generated ${new Date().toLocaleString('en-IN')}</div></div>
                          <div style="text-align:right"><h2>${driverName}</h2><div class="meta">Period: ${periodLabel}</div></div>
                        </div>
                        <div class="summary">
                          <div class="card"><div class="card-label">Trips</div><div class="card-val" style="color:#3b82f6">${period.count}</div></div>
                          <div class="card"><div class="card-label">Gross Earnings</div><div class="card-val" style="color:#f59e0b">₹${period.gross}</div></div>
                          <div class="card"><div class="card-label">Commission (10%)</div><div class="card-val" style="color:#ef4444">₹${period.commission}</div></div>
                          <div class="card"><div class="card-label">Net Earned</div><div class="card-val" style="color:#10b981">₹${period.net}</div></div>
                        </div>
                        <table><thead><tr><th>#</th><th>Passenger</th><th>Pickup</th><th>Drop-off</th><th>Gross (₹)</th><th>Net (₹)</th><th>Date</th></tr></thead>
                        <tbody>${rows || '<tr><td colspan="7" style="text-align:center;color:#9ca3af;padding:24px">No rides for this period</td></tr>'}</tbody></table>
                        <div class="footer">HUM Fleet Partner Earnings · System-generated statement · For disputes contact admin support</div>
                        <script>window.onload=()=>{window.print();}<\/script></body></html>`);
                      win.document.close();
                    }}
                    style={{ padding: '13px', width: '100%', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', fontWeight: '800', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    ⬇️ Download {periodLabel} Report (.PDF)
                  </button>
                </>
              );
            })() : (
              <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>⏳ Loading earnings...</div>
            )}
          </div>
        </div>
      )}
      {/* ========== PAYMENT GATEWAY MODAL ========== */}
      {showPayDuesModal && systemSettings && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '20px', borderRadius: '20px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Settle Platform Dues</h3>
              </div>
              <button onClick={() => { setShowPayDuesModal(false); setPayDuesSuccess(false); setPayDuesError(null); setPayAmount(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
              Pay your pending commission dues directly to the administrator's account details below.
            </p>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Admin Payment Method: {systemSettings.gatewayType === 'upi' ? 'UPI / QR Scan' : 'Bank Transfer'}
              </div>

              {systemSettings.gatewayType === 'upi' ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>UPI ID:</span>
                    <strong style={{ color: 'var(--primary)' }}>{systemSettings.upiId || 'humfleet@okaxis'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Beneficiary:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{systemSettings.accountHolder || 'HUM Fleet'}</strong>
                  </div>
                  {systemSettings.qrCodeUrl && (
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                      <img src={systemSettings.qrCodeUrl} alt="UPI QR Code" style={{ maxWidth: '160px', borderRadius: '10px', border: '3px solid #fff' }} />
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>Scan with GPay, PhonePe, Paytm, etc.</div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Bank Name:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{systemSettings.bankName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Account Holder:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{systemSettings.accountHolder}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Account Number:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{systemSettings.accountNo}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>IFSC Code:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{systemSettings.ifscCode}</strong>
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>Enter Payment Amount (INR)</label>
              <input 
                type="number" 
                className="input-field" 
                placeholder={`e.g. ${parseFloat(wallet.toBePaid || 0).toFixed(2)}`}
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                style={{ width: '100%', fontSize: '14px', padding: '10px 12px' }}
              />
            </div>

            {payDuesSuccess && (
              <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '10px', fontSize: '12px', color: '#10b981', fontWeight: '700', textAlign: 'center' }}>
                ✓ Payment confirmed! Platform commission dues updated.
              </div>
            )}

            {payDuesError && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px', fontSize: '12px', color: '#ef4444', fontWeight: '700', textAlign: 'center' }}>
                ✕ {payDuesError}
              </div>
            )}

            <Button 
              variant="primary" 
              className="full-width"
              disabled={isPayingDues}
              onClick={async () => {
                const amt = parseFloat(payAmount);
                if (isNaN(amt) || amt <= 0) {
                  alert('Please enter a valid payment amount.');
                  return;
                }
                setIsPayingDues(true);
                setPayDuesError(null);
                setPayDuesSuccess(false);
                const email = localStorage.getItem('driverEmail');
                try {
                  const res = await fetch(`${API_BASE}/api/drivers/pay-dues`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, amount: amt })
                  });
                  if (res.ok) {
                    const data = await res.json();
                    setWallet(data.wallet);
                    setPayDuesSuccess(true);
                    setPayAmount('');
                    setTimeout(() => {
                      setShowPayDuesModal(false);
                      setPayDuesSuccess(false);
                    }, 2000);
                  } else {
                    setPayDuesError('Failed to settle dues. Please try again.');
                  }
                } catch {
                  setPayDuesError('Server communication error.');
                } finally {
                  setIsPayingDues(false);
                }
              }}
            >
              {isPayingDues ? 'Processing Settlement...' : 'Confirm Payment & Settle'}
            </Button>

            <div style={{ textAlign: 'center', marginTop: '6px' }}>
              <a 
                href={`https://api.whatsapp.com/send?phone=918848347290&text=${encodeURIComponent(`Hello Admin, I am driver ${driverInfo?.name || 'Partner'} (${driverInfo?.phone || ''}). My pending platform commission & GST dues have reached ₹${parseFloat(wallet.toBePaid || 0).toFixed(2)}. I would like to clear my dues.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#25D366',
                  fontWeight: '700',
                  fontSize: '12px'
                }}
              >
                💬 Need help? Chat Admin on WhatsApp (+91 8848347290)
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========== INR 700 COMMISSION & GST DUES NOTIFICATION POPUP MODAL ========== */}
      {showDuesNoticeModal && parseFloat(wallet.toBePaid || 0) >= 700 && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)', position: 'fixed', inset: 0, zIndex: 1150, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '24px', borderRadius: '20px', background: 'var(--bg-card)', border: '1.5px solid rgba(245, 158, 11, 0.6)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={24} color="#f59e0b" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#f59e0b' }}>Commission & GST Dues Alert</h3>
              </div>
              <button onClick={() => { setShowDuesNoticeModal(false); setHasDismissedDuesModal(true); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Accumulated Dues (≥ ₹700)</span>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#ef4444' }}>
                ₹{parseFloat(wallet.toBePaid || 0).toFixed(2)}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                (10% Platform Commission & GST Dues)
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-main)', margin: 0, lineHeight: '1.5', textAlign: 'center' }}>
              Your accumulated platform commission & GST dues have reached <strong>₹700</strong> or above. Please clear your dues or communicate with the Admin via WhatsApp to settle your dues.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
              <a 
                href={`https://api.whatsapp.com/send?phone=918848347290&text=${encodeURIComponent(`Hello Admin, I am driver ${driverInfo?.name || 'Partner'} (${driverInfo?.phone || ''}). My pending platform commission & GST dues have reached ₹${parseFloat(wallet.toBePaid || 0).toFixed(2)}. I would like to clear my dues.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#25D366',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '13px',
                  padding: '12px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
                }}
              >
                💬 Chat Admin on WhatsApp (+91 8848347290)
              </a>

              <button
                onClick={() => {
                  setShowDuesNoticeModal(false);
                  setShowPayDuesModal(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '13px',
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <CreditCard size={16} /> Pay Dues Online
              </button>

              <button
                onClick={() => {
                  setShowDuesNoticeModal(false);
                  setHasDismissedDuesModal(true);
                }}
                style={{
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  fontWeight: '600',
                  fontSize: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px'
                }}
              >
                Dismiss Notice
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DriverDashboard;
