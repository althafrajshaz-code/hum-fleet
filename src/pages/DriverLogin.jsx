import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import './Auth.css';

const DriverLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save email in localStorage to check status on dashboard
    localStorage.setItem('driverEmail', email);
    navigate('/driver');
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card animate-fade-in">
        <div className="auth-header">
          <h2>Driver Partner Login</h2>
          <p>Sign in to start earning with HUM Fleet</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              className="input-field" 
              placeholder="driver@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
