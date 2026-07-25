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
        <Link to="/" className="nav-logo">
          <div className="logo-icon">
            <Car size={24} />
          </div>
          <span className="logo-text text-gradient">HUM Fleet</span>
        </Link>
        <div className="nav-links">
          {!isPassengerFlow && !isDriverFlow && (
            <>
              <Link to="/passenger/login" className="nav-link">Ride</Link>
              <Link to="/driver/login" className="nav-link">Drive</Link>
            </>
          )}
          {isPassengerFlow && (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/passenger/login" className="nav-link">Passenger Portal</Link>
            </>
          )}
          {isDriverFlow && (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/driver/login" className="nav-link">Driver Portal</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
