import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import Button from '../components/Button';
import './Auth.css';

const API_BASE = (typeof window !== 'undefined' && window.location.hostname.includes('loca.lt'))
  ? 'https://hum-fleet-backend.loca.lt'
  : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:'))
    ? 'http://localhost:5000'
    : (import.meta.env.VITE_BACKEND_URL || 'https://server-ashen-beta.onrender.com');

const getBackendUrl = () => { return API_BASE; };

const PassengerLogin = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      localStorage.setItem('passengerEmail', user.email);
      localStorage.setItem('passengerName', user.displayName || 'Passenger');
      
      // Optionally notify backend here, but for now we proceed
      navigate('/passenger');
    } catch (err) {
      console.error(err);
      setError('Google Sign-In was unsuccessful: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${getBackendUrl()}/api/passengers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId, password })
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
          <div className="form-group">
            <label htmlFor="loginId">Email or Phone Number</label>
            <input 
              type="text" 
              id="loginId" 
              className="input-field" 
              placeholder="name@example.com or +91..." 
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required 
            />
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
          <Button variant="primary" type="submit" className="full-width">
            Login
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
            onClick={handleGoogleAuth}
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
            Sign in with Google
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
