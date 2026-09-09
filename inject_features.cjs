const fs = require('fs');
const path = 'd:\\Althaf\\hum\\src\\pages\\DriverDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. ADD RINGTONE EFFECT
const importTarget = `import { MapPin, Navigation, ShieldCheck, CheckCircle2, ChevronRight, Send, Camera, Play, Coffee, FileText, Settings, Key, AlertCircle, X, ChevronDown, Check, Car, User, Wallet, History, MessageSquare, Menu, Sun, Moon, Power } from 'lucide-react';`;
const replaceImport = `import { MapPin, Navigation, ShieldCheck, CheckCircle2, ChevronRight, Send, Camera, Play, Coffee, FileText, Settings, Key, AlertCircle, X, ChevronDown, Check, Car, User, Wallet, History, MessageSquare, Menu, Sun, Moon, Power, PhoneCall } from 'lucide-react';`;
if (content.includes(importTarget)) {
  content = content.replace(importTarget, replaceImport);
}

const effectTarget = `  useEffect(() => {
    if (localStorage.getItem('theme')) {
      setTheme(localStorage.getItem('theme'));
    }
  }, []);`;
  
const effectReplace = `  useEffect(() => {
    if (localStorage.getItem('theme')) {
      setTheme(localStorage.getItem('theme'));
    }
  }, []);

  // RINGTONE EFFECT FOR INCOMING RIDES
  useEffect(() => {
    if (incomingRide) {
      const audio = new Audio('/ringtone.ogg');
      audio.loop = true;
      audio.play().catch(e => console.log('Audio blocked', e));
      if (navigator.vibrate) {
        navigator.vibrate([300, 100, 300, 100, 300, 100, 300]);
      }
      window._rideAudio = audio;
    } else {
      if (window._rideAudio) {
        window._rideAudio.pause();
        window._rideAudio = null;
      }
      if (navigator.vibrate) navigator.vibrate(0);
    }
    return () => {
      if (window._rideAudio) { window._rideAudio.pause(); window._rideAudio = null; }
    };
  }, [incomingRide]);`;
if (content.includes(effectTarget) && !content.includes('window._rideAudio')) {
  content = content.replace(effectTarget, effectReplace);
}

// 2. SHIFT SUMMARY MODAL & INTERCEPT
const stateTarget = `const [showEndTripSummary, setShowEndTripSummary] = useState(false);`;
const stateReplace = `const [showEndTripSummary, setShowEndTripSummary] = useState(false);
  const [showShiftSummary, setShowShiftSummary] = useState(false);`;
if (content.includes(stateTarget)) {
  content = content.replace(stateTarget, stateReplace);
}

const offlineBtnTarget = `                  if (isOnline) {
                    // Go offline ?" sync status to backend
                    goOffline();
                    return;
                  }`;
const offlineBtnReplace = `                  if (isOnline) {
                    setShowShiftSummary(true);
                    return;
                  }`;
if (content.includes(offlineBtnTarget)) {
  content = content.replace(offlineBtnTarget, offlineBtnReplace);
}

const modalTarget = `{/* IN-TRIP LIVE CHAT MODAL (DRIVER TO PASSENGER EXCLUSIVE) */}`;
const modalReplace = `{/* SHIFT SUMMARY MODAL */}
      {showShiftSummary && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '380px', padding: '24px', borderRadius: '20px', background: '#121624', border: '1px solid rgba(255,255,255,0.15)', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <Coffee size={32} color="#10b981" />
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '800', color: '#10b981' }}>Great Shift, Captain!</h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>
              You completed <strong style={{ color: '#fff' }}>{homeEarnings?.daily?.count || 0} trips</strong> and earned <strong style={{ color: '#fff' }}>₹{homeEarnings?.daily?.net || '0.00'}</strong> today. See you tomorrow!
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="outline" className="full-width" onClick={() => setShowShiftSummary(false)}>Keep Driving</Button>
              <Button variant="primary" className="full-width" onClick={() => { setShowShiftSummary(false); goOffline(); }} style={{ background: '#ef4444', color: '#fff', border: 'none' }}>Go Offline</Button>
            </div>
          </div>
        </div>
      )}

      {/* IN-TRIP LIVE CHAT MODAL (DRIVER TO PASSENGER EXCLUSIVE) */}`;
if (content.includes(modalTarget)) {
  content = content.replace(modalTarget, modalReplace);
}

// 3. SOS BUTTON & MAPS NAVIGATE BUTTON
const activeRideHeaderTarget = `<div className="active-ride-card animate-fade-in glass-card" style={{ marginBottom: '24px' }}>`;
const activeRideHeaderReplace = `<div className="active-ride-card animate-fade-in glass-card" style={{ marginBottom: '24px', position: 'relative' }}>
                  {currentRide && currentRide.status !== 'Completed' && (
                    <button 
                      onClick={() => {
                        alert('SOS Alert Triggered! Admin has been notified and emergency services are on standby.');
                        window.location.href = 'tel:112';
                      }}
                      style={{ position: 'absolute', top: '16px', right: '16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)', zIndex: 100 }}
                    >
                      <PhoneCall size={20} />
                    </button>
                  )}`;
if (content.includes(activeRideHeaderTarget)) {
  content = content.replace(activeRideHeaderTarget, activeRideHeaderReplace);
}

const verifyPinTarget = `<Button variant="primary" className="full-width" onClick={handleVerifyPin} style={{ background: '#3b82f6', color: 'white' }} disabled={ridePin.length !== 6}>
                          Verify & Start Trip
                        </Button>
                      </div>`;
const verifyPinReplace = `<Button variant="primary" className="full-width" onClick={handleVerifyPin} style={{ background: '#3b82f6', color: 'white', marginBottom: '12px' }} disabled={ridePin.length !== 6}>
                          Verify & Start Trip
                        </Button>
                        <Button onClick={() => {
                          window.open(\`https://www.google.com/maps/dir/?api=1&destination=\${currentRide.pickupLat || currentRide.pickup.split(',')[0]},\${currentRide.pickupLng || ''}\`, '_blank');
                        }} style={{ width: '100%', background: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <Navigation size={18} /> Navigate to Pickup
                        </Button>
                      </div>`;
if (content.includes(verifyPinTarget)) {
  content = content.replace(verifyPinTarget, verifyPinReplace);
}

const reqDetailsTarget = `<div className="req-price est-price" style={{ color: '#3b82f6', marginTop: '8px' }}>Fare: INR {currentRide.fare}</div>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => { setShowDriverTripChat(true); fetchDriverTripChatMessages(); }}`;
const reqDetailsReplace = `<div className="req-price est-price" style={{ color: '#3b82f6', marginTop: '8px' }}>Fare: INR {currentRide.fare}</div>
                        </div>
                        <Button onClick={() => {
                          window.open(\`https://www.google.com/maps/dir/?api=1&destination=\${currentRide.dropoffLat || currentRide.dropoff.split(',')[0]},\${currentRide.dropoffLng || ''}\`, '_blank');
                        }} style={{ width: '100%', marginBottom: '10px', background: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <Navigation size={18} /> Navigate to Drop-off
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => { setShowDriverTripChat(true); fetchDriverTripChatMessages(); }}`;
if (content.includes(reqDetailsTarget)) {
  content = content.replace(reqDetailsTarget, reqDetailsReplace);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully injected 4 new driver features.');
