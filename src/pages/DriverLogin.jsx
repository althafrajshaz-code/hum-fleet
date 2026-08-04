import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import Button from '../components/Button';
import './Auth.css';

const DriverLogin = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const getBackendUrl = () => { return 'https://server-ashen-beta.vercel.app'; };

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      localStorage.setItem('driverEmail', user.email);
      localStorage.setItem('driverName', user.displayName || 'Driver');
      
      // Proceed directly for now
      navigate('/driver');
    } catch (err) {
      console.error(err);
      setError('Google Sign-In was unsuccessful: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${getBackendUrl()}/api/drivers/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ loginId, password })
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
          <div className="form-group">
            <label htmlFor="loginId">Email or Phone Number</label>
            <input 
              type="text" 
              id="loginId" 
              className="input-field" 
              placeholder="driver@example.com or +91..." 
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
          <Button variant="primary" type="submit" className="full-width" style={{ marginTop: '8px' }}>
            Login as Driver
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
          New to HUM Fleet? <Link to="/driver/signup" className="auth-link">Apply to Drive</Link>
        </div>
      </div>
    </div>
  );
};

export default DriverLogin;
