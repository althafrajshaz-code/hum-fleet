import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, MessageCircle, Phone } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import Button from '../components/Button';
import './Auth.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://humfleet.xyz';

const getBackendUrl = () => { return API_BASE; };

const PassengerLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('passengerEmail')) {
      navigate('/passenger');
    }
  }, [navigate]);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch(`${getBackendUrl()}/api/passengers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId: `+91 ${phone}`, password })
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('passengerEmail', user.email);
        localStorage.setItem('passengerName', user.name);
        if (user.verificationCode) localStorage.setItem('passengerVerificationCode', user.verificationCode);
        navigate('/passenger');
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid login details or password.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to authentication server.');
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card animate-fade-in">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to your HUM Passenger account</p>
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
              <span className="input-field" style={{ width: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(200, 200, 200, 0.15)', fontWeight: 'bold', padding: 0 }}>
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
                  disabled={isLoading}
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
                disabled={isLoading}
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
          <Button variant="primary" type="submit" className="full-width" style={{ opacity: isLoading ? 0.7 : 1 }} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color, rgba(255, 255, 255, 0.1))' }}></div>
            <span style={{ padding: '0 12px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color, rgba(255, 255, 255, 0.1))' }}></div>
          </div>

          <button 
            type="button" 
            style={{ 
              width: '100%',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '10px', 
              background: 'rgba(37, 211, 102, 0.1)', 
              color: '#25D366', 
              fontWeight: '700',
              cursor: 'pointer',
              border: '1px solid rgba(37, 211, 102, 0.3)',
              padding: '12px',
              borderRadius: '12px',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.15)'; e.currentTarget.style.background = 'rgba(37, 211, 102, 0.15)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'rgba(37, 211, 102, 0.1)'; }}
            onClick={() => {
              const text = `Hello, I would like to book a ride with HUM Fleet.`;
              window.open(`https://api.whatsapp.com/send?phone=918848347290&text=${encodeURIComponent(text)}`, '_blank');
            }}
          >
            <MessageCircle size={20} />
            Quick Book via WhatsApp
          </button>
        </form>
        <div className="auth-footer">
          Don't have an account? <Link to="/passenger/signup" className="auth-link">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default PassengerLogin;
