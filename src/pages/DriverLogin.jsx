import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Phone } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import Button from '../components/Button';
import './Auth.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://humfleet.xyz';

const getBackendUrl = () => { return API_BASE; };

const DriverLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('driverEmail')) {
      navigate('/driver');
    }
  }, [navigate]);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${getBackendUrl()}/api/drivers/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ loginId: `+91 ${phone}`, password })
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('driverEmail', user.email);
        localStorage.setItem('driverName', user.name);
        navigate('/driver');
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid login details or password.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to authentication server.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card animate-fade-in">
        <div className="auth-header">
          <h2>Driver Partner Login</h2>
          <p>Sign in to start earning with HUM Fleet</p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            borderRadius: '8px', 
            padding: '10px', 
            color: '#ef4444', 
            fontSize: '14px', 
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label htmlFor="phone">Phone Number</label>
            <div style={{ display: 'flex', gap: '8px', height: '48px', marginTop: '8px' }}>
              <span className="input-field" style={{ width: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.05)', fontWeight: 'bold', padding: 0 }}>
                +91
              </span>
              <div style={{ position: 'relative', flex: 1 }}>
                <div className="input-icon"><Phone size={18} /></div>
                <input 
                  type="tel" 
                  id="phone" 
                  className="input-field with-icon" 
                  placeholder="98765 43210" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  pattern="[0-9]{10}"
                  required 
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                className="input-field" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '40px' }}
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
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
                  justifyContent: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <Button variant="primary" type="submit" className="full-width" style={{ marginTop: '8px' }}>
            Login as Driver
          </Button>
        </form>
        <div className="auth-footer">
          New to HUM Fleet? <Link to="/driver/signup" className="auth-link">Apply to Drive</Link>
        </div>
      </div>
    </div>
  );
};

export default DriverLogin;
