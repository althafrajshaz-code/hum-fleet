import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import './Auth.css';

const PassengerSignup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match!");
      return;
    }
    setValidationError('');

    try {
      const response = await fetch('http://localhost:5000/api/passengers/signup', {
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
                onChange={(e) => setPhone(e.target.value)}
                required 
              />
            </div>
            <small style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Enter 10-digit mobile number</small>
          </div>

          <div className="form-row">
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
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                className="input-field" 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <Button variant="primary" type="submit" className="full-width" style={{ marginTop: '8px' }}>
            Sign Up
          </Button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/passenger/login" className="auth-link">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default PassengerSignup;
