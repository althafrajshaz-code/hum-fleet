import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import Button from '../components/Button';
import './Auth.css';

const API_BASE = (typeof window !== 'undefined' && window.location.hostname.includes('loca.lt'))
  ? 'https://hum-fleet-backend.loca.lt'
  : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:'))
    ? 'http://localhost:5000'
    : (import.meta.env.VITE_BACKEND_URL || 'https://hum-fleet-api.onrender.com');

const getBackendUrl = () => { return API_BASE; };

const PassengerSignup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await fetch(`${getBackendUrl()}/api/passengers/google-auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenResponse.access_token })
        });

        if (response.ok) {
          const user = await response.json();
          localStorage.setItem('passengerEmail', user.email);
          localStorage.setItem('passengerName', user.name);
          if (user.verificationCode) localStorage.setItem('passengerVerificationCode', user.verificationCode);
          navigate('/passenger');
        } else {
          const data = await response.json();
          setValidationError(data.error || 'Google Authentication failed.');
        }
      } catch (err) {
        console.error(err);
        setValidationError('Failed to connect to backend server.');
      }
    },
    onError: () => setValidationError('Google Sign-Up was unsuccessful.'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match!");
      return;
    }
    setValidationError('');

    try {
      const response = await fetch(`${getBackendUrl()}/api/passengers/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          phone: `+91 ${phone}`,
          password
        })
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('passengerEmail', user.email);
        localStorage.setItem('passengerName', user.name);
        if (user.verificationCode) localStorage.setItem('passengerVerificationCode', user.verificationCode);
        navigate('/passenger');
      } else {
        const data = await response.json();
        setValidationError(data.error || 'Failed to sign up.');
      }
    } catch (err) {
      console.error(err);
      setValidationError('Failed to connect to backend server.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card animate-fade-in">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Sign up to start riding with HUM Fleet</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {validationError && (
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
              {validationError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              className="input-field" 
              placeholder="John Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              className="input-field" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="input-field" style={{ width: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(200, 200, 200, 0.15)', fontWeight: 'bold' }}>
                +91
              </span>
              <input 
                type="tel" 
                id="phone" 
                className="input-field" 
                placeholder="98765 43210" 
                pattern="[0-9]{10}"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                required 
              />
            </div>
            <small style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Enter 10-digit mobile number</small>
          </div>

          <div className="form-row">
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
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="confirmPassword" 
                  className="input-field" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
          </div>

          <div style={{ textAlign: 'center', margin: '16px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            By signing up, you agree to our <Link to="/passenger/terms" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Terms & Conditions</Link>.
          </div>

          <Button variant="primary" type="submit" className="full-width" style={{ marginTop: '8px' }}>
            Sign Up
          </Button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color, rgba(255, 255, 255, 0.1))' }}></div>
            <span style={{ padding: '0 12px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color, rgba(255, 255, 255, 0.1))' }}></div>
          </div>

          <button 
            type="button" 
            className="input-field" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '12px', 
              background: 'white', 
              color: '#333', 
              fontWeight: '600',
              cursor: 'pointer',
              border: 'none',
              padding: '12px',
              transition: 'all 0.2s ease',
              marginTop: '4px'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            onClick={async () => {
              if (Capacitor.isNativePlatform()) {
                try {
                  const user = await GoogleAuth.signIn();
                  const token = user.authentication.idToken;
                  const res = await fetch(`${getBackendUrl()}/api/passengers/google-auth`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                  });
                  if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem('passengerEmail', data.email);
                    localStorage.setItem('passengerName', data.name);
                    if (data.verificationCode) localStorage.setItem('passengerVerificationCode', data.verificationCode);
                    navigate('/passenger');
                  } else {
                    const errData = await res.json();
                    setValidationError(errData.error || 'Native Google Auth failed');
                  }
                } catch (err) {
                  setValidationError('Native Google Login Error: ' + err.message);
                }
                return;
              }

              const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE';
              if (googleClientId === 'YOUR_GOOGLE_CLIENT_ID_HERE' || !googleClientId) {
                // Mock flow for testing
                fetch(`${getBackendUrl()}/api/passengers/google-auth`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ token: 'mock_token' })
                })
                .then(res => res.json())
                .then(user => {
                  if (user.error) throw new Error(user.error);
                  localStorage.setItem('passengerEmail', user.email);
                  localStorage.setItem('passengerName', user.name);
                  if (user.verificationCode) localStorage.setItem('passengerVerificationCode', user.verificationCode);
                  navigate('/passenger');
                })
                .catch(err => setValidationError(err.message || 'Mock Authentication failed.'));
              } else {
                handleGoogleAuth();
              }
            }}
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
            Sign up with Google
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/passenger/login" className="auth-link">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default PassengerSignup;
