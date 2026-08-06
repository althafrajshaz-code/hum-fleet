import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const isPassengerFlow = location.pathname.startsWith('/passenger');
  const isDriverFlow = location.pathname.startsWith('/driver');

  return (
    <nav className="navbar glass">
      <div className="container nav-container">
        <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/hum_fleet_official_logo.jpg" alt="HUM Fleet Logo" style={{ height: '42px', width: 'auto', borderRadius: '4px' }} />
        </Link>
        <div className="nav-links">
          {!isPassengerFlow && !isDriverFlow && (
            <>
              <Link to="/passenger/login" className="nav-link">Ride</Link>
              <Link to="/driver/login" className="nav-link">Drive</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
