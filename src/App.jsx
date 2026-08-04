import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import PassengerLogin from './pages/PassengerLogin';
import PassengerSignup from './pages/PassengerSignup';
import PassengerDashboard from './pages/PassengerDashboard';
import DriverLogin from './pages/DriverLogin';
import DriverSignup from './pages/DriverSignup';
import DriverDashboard from './pages/DriverDashboard';
import PublicTracking from './pages/PublicTracking';
import './index.css';

const AdminRedirect = () => {
  useEffect(() => {
    window.location.href = 'https://admin-78dq27d5i-althafrajshaz-codes-projects.vercel.app/';
  }, []);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: 'var(--text-muted)', fontSize: '16px' }}>
      Redirecting to Operations Control Center...
    </div>
  );
};

function App() {
  // VITE_APP_MODE is baked in at build time:
  //   'passenger' → Passenger APK (opens Passenger Login)
  //   'driver'    → Driver APK (opens Driver Login)
  //   undefined   → Web version (shows Landing Page with all routes)
  const mode = import.meta.env.VITE_APP_MODE;
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>

            {/* ── Always available ── */}
            <Route path="/track/:id" element={<PublicTracking />} />
            <Route path="/admin/*" element={<AdminRedirect />} />

            {/* ── PASSENGER APK: opens straight to Passenger Login ── */}
            {mode === 'passenger' && (
              <>
                <Route path="/" element={<PassengerLogin />} />
                <Route path="/passenger/login" element={<PassengerLogin />} />
                <Route path="/passenger/signup" element={<PassengerSignup />} />
                <Route path="/passenger" element={<PassengerDashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}

            {/* ── DRIVER APK: opens straight to Driver Login ── */}
            {mode === 'driver' && (
              <>
                <Route path="/" element={<DriverLogin />} />
                <Route path="/driver/login" element={<DriverLogin />} />
                <Route path="/driver/signup" element={<DriverSignup />} />
                <Route path="/driver" element={<DriverDashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}

            {/* ── WEB VERSION: full landing + all routes ── */}
            {!mode && (
              <>
                <Route path="/" element={<LandingPage />} />
                <Route path="/passenger/login" element={<PassengerLogin />} />
                <Route path="/passenger/signup" element={<PassengerSignup />} />
                <Route path="/passenger" element={<PassengerDashboard />} />
                <Route path="/driver/login" element={<DriverLogin />} />
                <Route path="/driver/signup" element={<DriverSignup />} />
                <Route path="/driver" element={<DriverDashboard />} />
              </>
            )}

          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
