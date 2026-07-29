import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import PassengerLogin from './pages/PassengerLogin';
import PassengerSignup from './pages/PassengerSignup';
import PassengerDashboard from './pages/PassengerDashboard';
import DriverLogin from './pages/DriverLogin';
import DriverSignup from './pages/DriverSignup';
import DriverDashboard from './pages/DriverDashboard';
import './index.css';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const AdminRedirect = () => {
  useEffect(() => {
    window.location.href = 'https://admin-cms-liard.vercel.app/';
  }, []);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: 'var(--text-muted)', fontSize: '16px' }}>
      Redirecting to Operations Control Center...
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Passenger Routes */}
          <Route path="/passenger/login" element={<PassengerLogin />} />
          <Route path="/passenger/signup" element={<PassengerSignup />} />
          <Route path="/passenger" element={<PassengerDashboard />} />
          
          {/* Driver Routes */}
          <Route path="/driver/login" element={<DriverLogin />} />
          <Route path="/driver/signup" element={<DriverSignup />} />
          <Route path="/driver" element={<DriverDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
