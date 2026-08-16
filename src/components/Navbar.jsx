import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Moon, Sun, Monitor } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const isPassengerFlow = location.pathname.startsWith('/passenger');
  const isDriverFlow = location.pathname.startsWith('/driver');

  const [themeSetting, setThemeSetting] = React.useState(localStorage.getItem('themeSetting') || 'auto'); // 'light', 'dark', 'auto'

  React.useEffect(() => {
    let activeTheme = themeSetting;
    if (themeSetting === 'auto') {
      const hour = new Date().getHours();
      activeTheme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', activeTheme);
    localStorage.setItem('themeSetting', themeSetting);
  }, [themeSetting]);

  // Periodically check time for auto theme
  React.useEffect(() => {
    if (themeSetting !== 'auto') return;
    const interval = setInterval(() => {
      const hour = new Date().getHours();
      const activeTheme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
      if (document.documentElement.getAttribute('data-theme') !== activeTheme) {
        document.documentElement.setAttribute('data-theme', activeTheme);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [themeSetting]);

  const cycleTheme = () => {
    if (themeSetting === 'light') setThemeSetting('dark');
    else if (themeSetting === 'dark') setThemeSetting('auto');
    else setThemeSetting('light');
  };

  return (
    <nav className="navbar glass">
      <div className="container nav-container">
        <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'default' }}>
          <img src="/hum_fleet_official_logo.jpg" alt="HUM Fleet Logo" style={{ height: '42px', width: 'auto', borderRadius: '4px' }} />
        </div>
        <div className="nav-links">
          {!isPassengerFlow && !isDriverFlow && (
            <>
              <Link to="/passenger/login" className="nav-link">Ride</Link>
              <Link to="/driver/login" className="nav-link">Drive</Link>
            </>
          )}
          <button 
            onClick={cycleTheme} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', marginLeft: '12px' }}
            title={`Theme: ${themeSetting}`}
          >
            {themeSetting === 'light' && <Sun size={20} />}
            {themeSetting === 'dark' && <Moon size={20} />}
            {themeSetting === 'auto' && <Monitor size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
