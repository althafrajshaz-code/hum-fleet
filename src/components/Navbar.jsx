import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const isPassengerFlow = location.pathname.startsWith('/passenger');
  const isDriverFlow = location.pathname.startsWith('/driver');

  // Hide navbar entirely in APK mode (no web address / nav links needed)
  const appMode = import.meta.env.VITE_APP_MODE || localStorage.getItem('lockedAppMode');
  if (appMode === 'passenger' || appMode === 'driver') return null;

  return null;
};

export default Navbar;
