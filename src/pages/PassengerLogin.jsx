import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import './Auth.css';

const PassengerLogin = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/passengers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ loginId, password })
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('passengerEmail', user.email);
        localStorage.setItem('passengerName', user.name);
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
            <input 
              type="password" 
              id="password" 
              className="input-field" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <Button variant="primary" type="submit" className="full-width">
            Login
          </Button>
        </form>
        <div className="auth-footer">
          Don't have an account? <Link to="/passenger/signup" className="auth-link">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default PassengerLogin;
